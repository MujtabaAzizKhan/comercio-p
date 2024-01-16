const dialogflow = require('dialogflow');
const uuid = require('uuid');

exports.query = async (req, res) => {
  const {userMessage} = req.body; // Assuming the user's message is in the request body
  //   console.log(userMessage);

  // Your Dialogflow project ID
  const projectId = 'comercio-qmqo';

  // A unique identifier for the given session
  const sessionId = uuid.v4();

  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename:
      '',
  });

  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: userMessage,
        languageCode: 'en-US',
      },
    },
  };

  try {
    // Send request and get the response
    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    // Send the response back to the frontend
    res.json({response: result.fulfillmentText});
  } catch (error) {
    console.error('Error communicating with Dialogflow:', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
};
