const User = require('../model/user');
const Product = require('../model/product');
const VerificationToken = require('../model/verificationToken');
const ResetToken = require('../model/resetToken');
const {sendError, createRandomBytes} = require('../utils/helper');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {
  generateOTP,
  mailTransport,
  generateEmailTemplate,
  plainEmailTemplate,
  generatePasswordResetTemplate,
  generatePasswordResetSuccessfullTemplate,
} = require('../utils/mail');
const {isValidObjectId} = require('mongoose');

exports.createUser = async (req, res) => {
  const {name, email, password, isProducer} = req.body;
  const user = await User.findOne({email});
  if (user) return sendError(res, 'This email already exists!');

  const newUser = new User({
    name,
    email,
    password,
    isProducer,
  });

  const OTP = generateOTP();
  const verificationToken = new VerificationToken({
    owner: newUser._id,
    token: OTP,
  });

  await verificationToken.save();
  await newUser.save();

  mailTransport().sendMail({
    from: 'COMERCIO@gmail.com',
    to: newUser.email,
    subject: 'Verify your email account',
    html: generateEmailTemplate(OTP),
  });

  res.json({
    success: true,
    user: {
      name: newUser.name,
      email: newUser.email,
      id: newUser._id,
      verified: newUser.verified,
      isProducer: newUser.isProducer,
    },
  });
};

exports.signin = async (req, res) => {
  const {email, password} = req.body;
  if (!email.trim() || !password.trim())
    return sendError(res, 'email/password missing!');

  const user = await User.findOne({email});
  if (!user) return sendError(res, 'User not found');

  const isMatched = await user.comparePassword(password);
  if (!isMatched) return sendError(res, 'email/password does not match!');

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.status(202).json({
    success: true,
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    phoneNumber: user.phoneNumber,
    address: user.address,
    city: user.city,
    isProducer: user.isProducer,
    // token: token,
  });
};

exports.verifyEmail = async (req, res) => {
  const {userId, otp} = req.body;
  if (!userId || !otp.trim())
    return sendError(res, 'Invalid request, missing parameters!');

  if (!isValidObjectId(userId)) return sendError(res, 'Invalid user id!');

  const user = await User.findById(userId);
  if (!user) return sendError(res, 'Sorry, user not found!');

  if (user.verified) return sendError(res, 'This account is already verified!');

  const token = await VerificationToken.findOne({owner: user._id});
  if (!token) return sendError(res, 'Sorry, user not found!');

  const isMatched = await token.compareToken(otp);
  if (!isMatched) return sendError(res, 'Please provide a valid token!');

  user.verified = true;

  await VerificationToken.findByIdAndDelete(token._id);
  await user.save();

  mailTransport().sendMail({
    from: 'COMERCIO@gmail.com',
    to: user.email,
    subject: 'Welcome!',
    html: plainEmailTemplate(user.name),
  });
  res.json({
    success: true,
    message: 'your email has been verified.',
    user: {name: user.name, email: user.email, id: user._id},
  });
};

exports.forgotPassword = async (req, res) => {
  const {email} = req.body;
  if (!email) return sendError(res, 'Please provide a valid email!');

  const user = await User.findOne({email});

  if (!user) return sendError(res, 'User not found, invalid request!');

  const token = await ResetToken.findOne({owner: user._id});
  if (token)
    return sendError(res, 'You can request another token after one hour!');

  const randomBytes = await createRandomBytes();
  const resetToken = new ResetToken({owner: user._id, token: randomBytes});
  await resetToken.save();

  mailTransport().sendMail({
    from: 'COMERCIO@gmail.com',
    to: user.email,
    subject: 'Password Reset!',
    html: generatePasswordResetTemplate(
      `http://localhost:3000/reset-password?token=${randomBytes}&id=${user._id}`,
    ),
  });

  res.json({
    success: true,
    message: 'Password reset link is sent to your email.',
  });
};

exports.resetPassword = async (req, res) => {
  const {password} = req.body;

  const user = await User.findById(req.user._id);
  if (!user) return sendError(res, 'User not found');

  const isSamePassword = await user.comparePassword(password);
  if (isSamePassword) return sendError(res, 'New Password must be different!');

  if (password.trim().length < 8 || password.trim().length > 20)
    return sendError(res, 'Password must be 8 to 20 characters long!');

  user.password = password.trim();
  await user.save();

  await ResetToken.findOneAndDelete({owner: user._id});

  mailTransport().sendMail({
    from: 'COMERCIO@gmail.com',
    to: user.email,
    subject: 'Successfull Password Reset!',
    html: generatePasswordResetSuccessfullTemplate(user.name),
  });

  res.json({succes: true, message: 'Successfull Password Reset!'});
};

exports.profilePicture = async (req, res) => {
  try {
    const profileData = req.body;
    // console.log(updatedData);
    const userEmail = profileData.email; // Using this email as the identifier

    // We find the user by ther email and update their avatar
    const updatedUser = await User.findOneAndUpdate(
      {email: userEmail},
      {
        $set: {
          avatar: profileData.url,
        },
      },
      {new: true},
    );

    if (!updatedUser) {
      return res.status(404).json({error: 'User not found'});
    }

    res.json(profileData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({error: 'An error occurred while updating the profile'});
  }
};

exports.profile = async (req, res) => {
  try {
    const updatedData = req.body;
    // console.log(updatedData);
    const userEmail = updatedData.email; // Use the email as the identifier

    // Find the user by their email and update their profile
    const updatedUser = await User.findOneAndUpdate(
      {email: userEmail},
      {
        $set: {
          id: updatedData.id,
          name: updatedData.name,
          avatar: updatedData.avatar,
          email: updatedData.email,
          phoneNumber: updatedData.phoneNumber,
          address: updatedData.address,
          city: updatedData.city,
        },
      },
      {new: true},
    );

    console.log(updatedData.id);

    if (!updatedUser) {
      return res.status(404).json({error: 'User not found'});
    }

    //Do not return updatedUser again Tayyab, woh response hai I'll kill you if you do it again. ~Tayyab
    res.json(updatedData);
    console.log(updatedData);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({error: 'An error occurred while updating the profile'});
  }
};

exports.updateIsProducer = async (req, res) => {
  try {
    const {userId} = req.params;
    const update = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({error: 'Invalid user ID'});
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    const updatedData = await User.findByIdAndUpdate(userId, update, {
      new: true,
    });

    if (!updatedData) {
      return res.status(404).json({error: 'User not found'});
    }
    await updatedData.save();

    res.json({success: true, user: updatedData});
  } catch (error) {
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
};

exports.distributors = async (req, res) => {
  try {
    const {userId} = req.body;

    // console.log('Reaching Distributors function');
    const distributors = await User.find({
      isProducer: false,
      _id: {$ne: userId},
    });
    console.log(distributors);
    res.json(distributors);
  } catch (error) {
    res.status(500).json({error: 'Error fetching non-producers'});
  }
};

exports.producers = async (req, res) => {
  try {
    const {userId} = req.body;

    // console.log('Reaching Producers function');

    const producers = await User.find({isProducer: true, _id: {$ne: userId}});
    res.json(producers);
  } catch (error) {
    res.status(500).json({error: 'Error fetching non-producers'});
  }
};

exports.checkConnection = async (req, res) => {
  try {
    const {userId, connectedUserId} = req.body;
    const user = await User.findById(userId);
    // console.log(connectedUserId +"The rest")
    // console.log(userId)

    const existingConnection = user.connections.find(
      connection => connection.connectionID === connectedUserId,
    );

    if (existingConnection) {
      return res.status(200).json(true);
    }
  } catch (error) {
    res.status(500).json({error: 'Error while Checking Connection'});
  }
};

exports.checkAcceptedConnection = async (req, res) => {
  try {
    const {userId, connectedUserId} = req.body;
    const user = await User.findById(userId);

    const existingConnection = user.connections.find(
      connection => connection.connectionID === connectedUserId,
    );

    if (existingConnection.status === 'accepted') {
      // console.log('TRUEEE');
      return res.status(200).json(true);
    } else {
      // console.log('FALSEEE');

      return res.status(200).json(false);
    }
  } catch (error) {
    res.status(500).json({error: 'Error while Checking Accepted Connection'});
  }
};

exports.addConnection = async (req, res) => {
  try {
    const {userId, userName, connectedUserId, connectedUserName, status} =
      req.body;

    const user = await User.findById(userId);
    // console.log(user)

    const existingConnection = user.connections.find(
      connection => connection.connectionID === connectedUserId,
    );

    if (existingConnection) {
      // console.log('Failed');
      return res.status(200).json({message: 'Connection already exists'});
    }
    // console.log(' nawt existing');

    const updatedUser = await User.findOneAndUpdate(
      {_id: userId},
      {
        $push: {
          connections: {
            connectionID: connectedUserId,
            connectionName: connectedUserName,
            status,
          },
        },
      },
      {new: true}, // To return the updated user document
    );

    //Updating on the other user account
    const updatedUser2 = await User.findOneAndUpdate(
      {_id: connectedUserId},
      {
        $push: {
          connections: {
            connectionID: userId,
            connectionName: userName,
            status,
          },
        },
      },
      {new: true}, // To return the updated user document
    );

    if (!updatedUser || !updatedUser2) {
      return res.status(404).json({message: 'User not found'});
    }

    return res.status(201).json({message: 'Connection added successfully'});
  } catch (error) {
    return res
      .status(500)
      .json({error: 'Internal server error while adding connection'});
  }
};

//To Display pending connections in the notifications section
exports.pendingConnections = async (req, res) => {
  try {
    const {userId} = req.body;
    // console.log(userId);
    // Find the current user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Filter pending connections
    const pendingConnections = user.connections.filter(
      connection => connection.status === 'pending',
    );

    const distributorProfiles = [];

    for (const connection of pendingConnections) {
      const distributor = await User.findById(connection.connectionID);

      if (distributor) {
        distributorProfiles.push({
          id: distributor._id,
          name: distributor.name,
          avatar: distributor.avatar,
          email: distributor.email,
          phoneNumber: distributor.phoneNumber,
          address: distributor.address,
          city: distributor.city,
          isProducer: distributor.isProducer,
          // Add other profile fields as needed
        });
      }
    }
    // console.log(distributorProfiles);

    if (distributorProfiles.length > 0) {
      return res.status(200).json(distributorProfiles);
    } else {
      return res.status(200).json({message: 'No pending connections found'});
    }
  } catch (error) {
    return res
      .status(500)
      .json({error: 'Internal server error while checking pending connection'});
  }
};

exports.acceptConnection = async (req, res) => {
  try {
    const {userID, connectionID} = req.body;

    // console.log(userID, connectionID);

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const connection = user.connections.find(
      conn => conn.connectionID === connectionID,
    );

    if (connection) {
      connection.status = 'accepted';

      // Use findOneAndUpdate with $set to update the connection status
      await User.findOneAndUpdate(
        {_id: userID, 'connections.connectionID': connectionID},
        {
          $set: {'connections.$.status': 'accepted'},
        },
        // console.log('Noice done'),
      );

      // Update the other user's connection status (the distributor in this case)
      const distributor = await User.findById(connectionID);
      const distributorConnection = distributor.connections.find(
        conn => conn.connectionID === userID,
      );

      if (distributorConnection) {
        distributorConnection.status = 'accepted';

        // Use findOneAndUpdate with $set to update the connection status
        await User.findOneAndUpdate(
          {_id: connectionID, 'connections.connectionID': userID},
          {
            $set: {'connections.$.status': 'accepted'},
          },
        );
      }

      return res
        .status(200)
        .json({success: true, message: 'Connection accepted'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while accepting Distributor connection ',
    });
  }
};

exports.rejectConnection = async (req, res) => {
  try {
    const {userID, connectionID} = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const connectionIndex = user.connections.findIndex(
      conn => conn.connectionID === connectionID,
    );

    if (connectionIndex !== -1) {
      user.connections.splice(connectionIndex, 1);

      // Update the user's connections with the rejected connection removed
      await User.findByIdAndUpdate(userID, {connections: user.connections});

      // Update the other user's connections (the distributor in this case)
      const distributor = await User.findById(connectionID);
      const distributorIndex = distributor.connections.findIndex(
        conn => conn.connectionID === userID,
      );

      if (distributorIndex !== -1) {
        distributor.connections.splice(distributorIndex, 1);

        // Update the distributor's connections with the rejected connection removed
        await User.findByIdAndUpdate(connectionID, {
          connections: distributor.connections,
        });
      }

      return res
        .status(200)
        .json({success: true, message: 'Connection rejected'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while rejecting distributor connection',
    });
  }
};

exports.getProductsByProducer = async (req, res) => {
  try {
    const userId = req.query.userId; // To Access the userId query parameter
    const categoryId = req.query.categoryId; // To Access the categoryId query
    // console.log(userId)

    // First We Find the user with the specified ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({error: 'User not found'});
    }

    // We Find connections with 'accepted' status
    const acceptedConnections = user.connections.filter(
      connection => connection.status === 'accepted',
    );
    // console.log(acceptedConnections)

    // Extract producer IDs from accepted connections
    const producerIds = acceptedConnections.map(
      connection => connection.connectionID,
    );

    // We Find products from producers with 'accepted' connections
    //Note that you'll have to add isPublished condition here later on
    const products = await Product.find({
      $and: [
        {categories: categoryId}, // Products in the specified category
        {createdBy: {$in: producerIds}}, // Products created by specific producers
        {isPublished: true}, //Products published.
      ],
    });
    // console.log(products);

    res.json(products);
  } catch (error) {
    res.status(500).json({error: 'Error fetching products'});
  }
};
