const User = require('../model/user');
const mongoose = require('mongoose');

exports.checkPartnerConnection = async (req, res) => {
  try {
    const {userId, connectedUserId} = req.body;
    const user = await User.findById(connectedUserId);

    const existingPartner = user.partners.find(
      partner => partner.connectionID === userId,
    );

    if (existingPartner) {
      return res.status(200).json(true);
    }

    return res.status(200).json(false);
  } catch (error) {
    res.status(500).json({error: 'Error while Checking Partner Connection'});
  }
};

exports.checkAcceptedPartner = async (req, res) => {
  try {
    const {userId, connectedUserId} = req.body;
    const user = await User.findById(userId);

    const existingPartner = user.partners.find(
      partner => partner.connectionID === connectedUserId,
    );

    if (existingPartner.status === 'accepted') {
      return res.status(200).json(true);
    }

    return res.status(200).json(false);
  } catch (error) {
    res.status(500).json({error: 'Error while Checking Accepted Partner'});
  }
};

exports.addPartner = async (req, res) => {
  // Ok, so basically we have made changes here and this partner connection procedure is different from the Distributor-Partner Connections.
  //Basically, when a request is sent. A pending status is added in the other person's (To the one whom request is sent) database. It is not added in the main user's database so when we have to receive notifications about a pending connection, the user who sends a request doesn't get back the notification meaning he can accept the same request he sent. For this, the pending part needs to be in once place, and that of the other person's collection.

  //This is done in addpartner. Similarly, reject partner has also been modified. It checks the pending portion in other person's collection.

  try {
    const {userId, userName, connectedUserId, connectedUserName, status} =
      req.body;

    const user = await User.findById(userId);
    //Notice that the main user here is the o

    const existingPartner = user.partners.find(
      partner => partner.connectionID === connectedUserId,
    );

    if (existingPartner) {
      return res.status(200).json({message: 'Partner already exists'});
    }

    // Updating on the other user's account. We don't update on the main side so we don't get our own request notifications.
    const updatedUser2 = await User.findOneAndUpdate(
      {_id: connectedUserId},
      {
        $push: {
          partners: {
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

    return res.status(201).json({message: 'Partner added successfully'});
  } catch (error) {
    return res
      .status(500)
      .json({error: 'Internal server error while adding partner'});
  }
};

//To Display pending partner connections in the notifications section
exports.pendingPartners = async (req, res) => {
  try {
    const {userId} = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Filter pending partners
    const pendingPartners = user.partners.filter(
      partner => partner.status === 'pending',
    );

    const partnerProfiles = [];

    for (const partner of pendingPartners) {
      const partnerUser = await User.findById(partner.connectionID);

      if (partnerUser) {
        partnerProfiles.push({
          id: partnerUser._id,
          name: partnerUser.name,
          avatar: partnerUser.avatar,
          email: partnerUser.email,
          phoneNumber: partnerUser.phoneNumber,
          address: partnerUser.address,
          city: partnerUser.city,
          isProducer: partnerUser.isProducer,
          // Add other profile fields as needed
        });
      }
    }

    if (partnerProfiles.length > 0) {
      return res.status(200).json(partnerProfiles);
    } else {
      return res.status(200).json({message: 'No pending partners found'});
    }
  } catch (error) {
    return res
      .status(500)
      .json({error: 'Internal server error while checking pending partners'});
  }
};

exports.acceptPartner = async (req, res) => {
  try {
    const {userID, connectionID} = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const partner = user.partners.find(
      partner => partner.connectionID === connectionID,
    );

    if (partner) {
      partner.status = 'accepted';

      // Use findOneAndUpdate with $set to update the partner status
      await User.findOneAndUpdate(
        {_id: userID, 'partners.connectionID': connectionID},
        {
          $set: {'partners.$.status': 'accepted'},
        },
      );

      // Update the other user's partner status (the distributor in this case)
      const partnerUser = await User.findById(connectionID);
      const partnerUserConnection = partnerUser.partners.find(
        partner => partner.connectionID === userID,
      );

      if (partnerUserConnection) {
        partnerUserConnection.status = 'accepted';

        // Use findOneAndUpdate with $set to update the partner status
        await User.findOneAndUpdate(
          {_id: connectionID, 'partners.connectionID': userID},
          {
            $set: {'partners.$.status': 'accepted'},
          },
        );
      }

      return res
        .status(200)
        .json({success: true, message: 'Partner connection accepted'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Partner connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while accepting Partner connection',
    });
  }
};

exports.rejectPartner = async (req, res) => {
  try {
    const {userID, connectionID} = req.body;

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const partnerIndex = user.partners.findIndex(
      partner => partner.connectionID === connectionID,
    );

    if (partnerIndex !== -1) {
      user.partners.splice(partnerIndex, 1);

      // Update the user's partners with the rejected partner removed
      await User.findByIdAndUpdate(userID, {partners: user.partners});

      // And then we update the other user's partners
      const partnerUser = await User.findById(connectionID);
      const partnerUserIndex = partnerUser.partners.findIndex(
        partner => partner.connectionID === userID,
      );

      if (partnerUserIndex !== -1) {
        partnerUser.partners.splice(partnerUserIndex, 1);

        await User.findByIdAndUpdate(connectionID, {
          partners: partnerUser.partners,
        });
      }

      return res
        .status(200)
        .json({success: true, message: 'Partner connection rejected'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Partner connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while rejecting partner connection',
    });
  }
};

exports.withdrawRequest = async (req, res) => {
  try {
    const {userID, connectionID} = req.body;

    //Here the user basically takes in other person's ID so that other person's data is being accessed. In the other person's collection, we check if request is present since we only added there.

    const user = await User.findById(connectionID);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const partnerIndex = user.partners.findIndex(
      partner => partner.connectionID === userID,
    );

    if (partnerIndex !== -1) {
      user.partners.splice(partnerIndex, 1);

      // Update the user's partners with the rejected partner removed
      await User.findByIdAndUpdate(userID, {partners: user.partners});

      // And then we update the other user's partners
      const partnerUser = await User.findById(connectionID);
      const partnerUserIndex = partnerUser.partners.findIndex(
        partner => partner.connectionID === userID,
      );

      if (partnerUserIndex !== -1) {
        partnerUser.partners.splice(partnerUserIndex, 1);

        await User.findByIdAndUpdate(connectionID, {
          partners: partnerUser.partners,
        });
      }

      return res
        .status(200)
        .json({success: true, message: 'Partner connection rejected'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Partner connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while rejecting partner connection',
    });
  }
};

exports.displayPartners = async (req, res) => {
  try {
    const {userId} = req.body;

    const user = await User.findById(userId);

    // Filter partners with status 'accepted'
    const acceptedPartners = user.partners.filter(
      partner => partner.status === 'accepted',
    );

    // Extract the connection IDs from accepted partners
    const connectionIds = acceptedPartners.map(partner => partner.connectionID);

    // Fetch the full profiles of the connected users
    const connectedUsers = await User.find({_id: {$in: connectionIds}});

    // console.log(connectedUsers);

    res.json(connectedUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Error fetching connected users'});
  }
};

exports.pendingConnections = async (req, res) => {
  try {
    const {userId} = req.body;
    // console.log(userId);
    // Find the current user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    // Filtering pending partner connections
    const pendingConnections = user.partners.filter(
      partner => partner.status === 'pending',
    );

    const partnerProfiles = [];

    for (const partner of pendingConnections) {
      const distributor = await User.findById(partner.connectionID);

      if (distributor) {
        partnerProfiles.push({
          id: distributor._id,
          name: distributor.name,
          avatar: distributor.avatar,
          email: distributor.email,
          phoneNumber: distributor.phoneNumber,
          address: distributor.address,
          city: distributor.city,
          isProducer: distributor.isProducer,
          // Add other profile fields if needed here.
        });
      }
    }
    // console.log(distributorProfiles);

    if (partnerProfiles.length > 0) {
      return res.status(200).json(partnerProfiles);
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
    const {userID, userName, connectionID} = req.body;

    // console.log(userID, connectionID);

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }

    const partner = user.partners.find(
      partner => partner.connectionID === connectionID,
    );

    if (partner) {
      partner.status = 'accepted';

      // Use findOneAndUpdate with $set to update the partner status
      await User.findOneAndUpdate(
        {_id: userID, 'partners.connectionID': connectionID},
        {
          $set: {'partners.$.status': 'accepted'},
        },
      );

      //IMPORTANT NOTE:
      // Update the other request sender's connection status. We have commented out the part where it checks if the request sender has a pending status in his collection because he doesn't. (See addpartner).
      // Also, insteadd of changing pending. Since nothing present. An accepted condition is pushed.

      // const partnerUser = await User.findById(connectionID);
      // const userConnection = partnerUser.partners.find(
      //   conn => conn.connectionID === userID,
      // );

      // if (userConnection) {
      //   userConnection.status = 'accepted';

      // Use findOneAndUpdate with $set to update the partner status
      // await User.findOneAndUpdate(
      //   {_id: connectionID, 'partners.connectionID': userID},
      //   {
      //     $set: {'partners.$.status': 'accepted'},
      //   },
      // );

      await User.findOneAndUpdate(
        {_id: connectionID},
        {
          $push: {
            partners: {
              connectionID: userID,
              connectionName: userName,
              status: 'accepted',
            },
          },
        },
        {new: true}, // To return the updated user document
      );
      // }

      return res
        .status(200)
        .json({success: true, message: 'Partner Connection accepted'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Partner Connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while accepting Partner connection ',
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

    const connectionIndex = user.partners.findIndex(
      conn => conn.connectionID === connectionID,
    );

    if (connectionIndex !== -1) {
      user.partners.splice(connectionIndex, 1);

      // Update the user's partners with the rejected partner removed
      await User.findByIdAndUpdate(userID, {partners: user.partners});

      // Update the other user's partners
      const partnerUser = await User.findById(connectionID);
      const partnerIndex = partnerUser.partners.findIndex(
        conn => conn.connectionID === userID,
      );

      if (partnerIndex !== -1) {
        partnerUser.partners.splice(partnerIndex, 1);

        // Update the partner's partners with the rejected partner removed
        await User.findByIdAndUpdate(connectionID, {
          partners: partnerUser.partners,
        });
      }

      return res
        .status(200)
        .json({success: true, message: 'Partner connection rejected'});
    } else {
      return res
        .status(404)
        .json({success: false, message: 'Partner connection not found'});
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Internal server error while rejecting distributor connection',
    });
  }
};
