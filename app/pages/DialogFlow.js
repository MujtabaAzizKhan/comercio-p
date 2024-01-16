import React, {useState, useEffect} from 'react';
import {
  View,
  TextInput,
  Button,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import client from '../api/client';

const DialogFlow = () => {
  const [userMessage, setUserMessage] = useState('');
  const [response, setResponse] = useState('I await your command');
  const [dialogflowResponse, setDialogflowResponse] = useState({
    response: 'I await your command.',
  });
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const [fill, setFill] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [rotation1, setRotation1] = useState(0);

  const viewSize = (screenWidth, screenHeight) * 0.23;

  useEffect(() => {
    const interval = setInterval(() => {
      // Update fill value based on the current value
      setFill(prevFill => (prevFill === 100 ? 0 : 100));
      setRotation(Math.floor(Math.random() * 360));
      setRotation1(Math.floor(Math.random() * 360));
    }, 2000); // Set the interval time. (2000 = 2 seconds)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [response]);

  const handleSendQuery = () => {
    // console.log(userMessage);

    client
      .post('/dialogFlow/query', {userMessage})
      .then(response => {
        setResponse(response.data.fulfillmentText);
        // console.log(response.data);
        setDialogflowResponse(response.data);
      })
      .catch(error => {
        console.error('Error communicating with the server:', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '5%',
        }}>
        <View style={styles.glowWrapper}>
          <Image
            source={{
              uri: 'https://d112y698adiu2z.cloudfront.net/photos/production/software_photos/001/753/697/datas/gallery.jpg',
            }}
            style={{
              width: viewSize,
              height: viewSize,
              borderRadius: viewSize / 2,
            }}
          />
          <AnimatedCircularProgress
            size={viewSize + 25}
            width={4}
            rotation={rotation}
            duration={2000}
            tintColorSecondary={'#00e0ff'}
            fill={fill}
            tintColor="white"
            backgroundColor="#3d5875"
            style={{position: 'absolute'}}>
            {fill => {
              fill;
            }}
          </AnimatedCircularProgress>

          <AnimatedCircularProgress
            size={viewSize + 50}
            width={4}
            rotation={rotation1}
            duration={2000}
            tintColorSecondary={'#00e0ff'}
            fill={fill}
            tintColor="white"
            backgroundColor="#3d5875"
            style={{position: 'absolute'}}>
            {fill => {
              fill;
            }}
          </AnimatedCircularProgress>
        </View>

        <Text style={styles.response}>{dialogflowResponse.response + ''}</Text>

        <View style={{width: '95%', marginTop: '25%'}}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            onChangeText={text => setUserMessage(text)}
            value={userMessage}
          />
          <TouchableOpacity
            style={{alignItems: 'center', justifyContent: 'center'}}
            onPress={handleSendQuery}>
            <View
              style={{
                width: 180,
                flexDirection: 'row',
                height: 60,
                borderRadius: 40,
                borderWidth: 1,
                borderColor: '#44accf',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontFamily: 'Outfit-Regular',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  textAlign: 'center',
                  fontSize: 22,
                }}>
                Send
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101010',
    height: '100%',
    padding: 10,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    color: 'white',
    fontSize: 16,
    fontFamily: 'Outfit-Regular',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: '4%',
  },
  response: {
    color: '#44accf',
    marginTop: '3%',
    fontFamily: 'Outfit-Light',
    fontSize: 22,
    textAlign: 'center',
  },
  glowWrapper: {
    width: 250,
    height: 240,
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#08a1d4',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 100,
    shadowRadius: 10,
    elevation: 50,
  },
});

export default DialogFlow;
