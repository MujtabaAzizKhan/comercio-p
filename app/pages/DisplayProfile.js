import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Keyboard,
  Pressable,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  Profile,
  Mobile,
  Buildings,
  Location,
  LogoutCurve,
} from 'iconsax-react-native';
import {
  NavigationContainer,
  StackActions,
  useRoute,
} from '@react-navigation/native';

const DisplayProfile = ({navigation}) => {
  const route = useRoute();
  const dataReceived = route.params?.data || {}; // Access the passed props

  const [userID, setUserID] = useState(dataReceived.id);
  const [displayName, setDisplayName] = useState(dataReceived.name);
  const [avatar, setAvatar] = useState(dataReceived.avatar);
  const [displayEmail, setDisplayEmail] = useState(dataReceived.email);
  const [phoneNumber, setPhoneNumber] = useState(dataReceived.phoneNumber);
  const [city, setCity] = useState(dataReceived.city);
  const [address, setAddress] = useState(dataReceived.address);
  const [isRequestSent, setIsRequestSent] = useState(false);

  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    try {
      checkAcceptedConnection()
        .then(isAccepted => {
          if (!isAccepted) {
            checkConnection();
          } else {
            console.log('Is accepted true hogya haaiiiii');
          }
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkConnection = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);

      const data = {
        userId: retrievedData.id,
        connectedUserId: userID,
      };

      // console.log(data.userId + 'This is the main user');
      // console.log(data.connectedUserId + 'This is the other user');

      await client
        .post('/user/checkConnection', data)
        .then(function (response) {
          // console.log('Checking Connection');
          // console.log(response.data + 'A RHAAAAA');
          if (isRequestSent === true) {
          } else {
            setIsRequestSent(response.data);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const connect = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);

      const connectionData = {
        userId: retrievedData.id,
        userName: retrievedData.name,
        connectedUserId: userID,
        connectedUserName: displayName,
        status: 'pending',
      };

      // console.log(connectionData.userId);
      // console.log(connectionData.connectedUserId);

      await client
        .post('/user/addConnection', connectionData)
        .then(function (response) {
          // console.log(response.data);
          setIsRequestSent(true);
          // console.log('Connect Function');
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const withdrawRequest = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      //   console.log(retrievedData.id);
      //   console.log(id);

      const connectionData = {
        userID: retrievedData.id,
        // userName: retrievedData.name,
        connectionID: dataReceived.id,
        // connectedUserName: displayName,
        // status: 'pending',
      };

      // console.log(connectionData.userID);
      // console.log(connectionData.connectionID);

      await client
        .post('/user/rejectConnection', connectionData)
        .then(function (response) {
          // console.log(response.data);
          setIsRequestSent(false);
          setAccepted(false);
          // console.log('Withdraw request');
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const checkAcceptedConnection = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);

      const data = {
        userId: retrievedData.id,
        connectedUserId: userID,
      };

      await client
        .post('/user/checkAcceptedConnection', data)
        .then(function (response) {
          setAccepted(response.data);
          // console.log('Checking Accepted Connection');
          if (response.data === false) {
            // console.log('false Accepted Connection');
            return false;
          } else {
            // console.log('true Accepted Connection');
            return true;
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error checking accepted connection:', error);
    }
  };

  // Get the device's screen width and height
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Calculate the size for the circular view based on percentages
  const viewSize = (screenWidth, screenHeight) * 0.23; // Adjust the percentage as needed

  return (
    <ScrollView>
      <View style={styles.Background}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.glowWrapper}>
            <Image
              source={{
                uri:
                  avatar ||
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
              }}
              style={{
                width: viewSize,
                height: viewSize,
                borderRadius: viewSize / 2,
                marginTop: '10%',
              }}
            />
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Light',
              fontSize: 25,
              marginBottom: '1%',
            }}>
            {displayName}
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Light',
              fontSize: 25,
            }}>
            {displayEmail}
          </Text>
        </View>

        {!dataReceived.isProducer ? (
          <View></View>
        ) : accepted ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.ConnectedButton}
              onPress={() => {
                withdrawRequest();
              }}>
              <Text style={styles.ConnectedText}>Connected</Text>
            </TouchableOpacity>
          </View>
        ) : isRequestSent ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.RetrieveRequest}
              onPress={() => {
                withdrawRequest();
              }}>
              <Text style={styles.RetrieveRequestText}>Cancel Request</Text>
            </TouchableOpacity>
          </View>
        ) : !isRequestSent ? (
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              style={styles.AddProducerButton}
              onPress={() => {
                connect();
              }}>
              <Text style={styles.AddProducerText}>Add Producer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View></View>
        )}

        <Text
          style={{
            color: '#FFFFFF',
            marginTop: '3%',
            marginLeft: '4%',
            fontFamily: 'Outfit-Heading',
            fontSize: 30,
          }}>
          Contact Information
        </Text>

        <View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: '3%',
                backgroundColor: '#171819',
                borderRadius: 10,
                height: 60,
                width: '90%',
                alignItems: 'center',
              }}>
              <Profile marginLeft="1%" size="30" color="#E56033" />
              <Text
                style={{
                  marginLeft: '1%',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>
                Name
              </Text>

              <Text
                style={{
                  width: '68%',
                  textAlign: 'right',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>{`${displayName}`}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                backgroundColor: '#171819',
                borderRadius: 10,
                height: 60,
                width: '90%',
                alignItems: 'center',
              }}>
              <AntDesign
                style={{marginLeft: '1%'}}
                name={'mail'}
                size={30}
                color={'#E56033'}
              />
              <Text
                style={{
                  marginLeft: '1%',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>
                Email
              </Text>

              <Text
                style={{
                  width: '68%',
                  textAlign: 'right',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>{`${displayEmail}`}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                backgroundColor: '#171819',
                borderRadius: 10,
                height: 60,
                width: '90%',
                alignItems: 'center',
              }}>
              <Mobile marginLeft="1%" size="30" color="#E56033" />
              <Text
                style={{
                  marginLeft: '1%',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>
                Phone
              </Text>

              <Text
                style={{
                  width: '68%',
                  textAlign: 'right',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>{`${phoneNumber}`}</Text>
            </View>
          </View>

          <Text
            style={{
              color: '#FFFFFF',
              marginTop: '5%',
              marginLeft: '4%',
              fontFamily: 'Outfit-Heading',
              fontSize: 30,
            }}>
            Location
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                backgroundColor: '#171819',
                borderRadius: 10,
                height: 60,
                width: '90%',
                alignItems: 'center',
              }}>
              <Location marginLeft="1%" size="30" color="#E56033" />
              <Text
                style={{
                  marginLeft: '1%',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>
                Address
              </Text>

              <Text
                style={{
                  width: '60%',
                  textAlign: 'right',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                  flexWrap: 'wrap',
                  overflow: 'hidden',
                }}>{`${address}`}</Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                backgroundColor: '#171819',
                borderRadius: 10,
                height: 60,
                width: '90%',
                alignItems: 'center',
                marginBottom: '10%',
              }}>
              <Buildings marginLeft="1%" size="30" color="#E56033" />
              <Text
                style={{
                  marginLeft: '1%',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>
                City
              </Text>

              <Text
                style={{
                  width: '68%',
                  textAlign: 'right',
                  fontSize: 20,
                  fontFamily: 'Outfit-Regular',
                  color: 'white',
                }}>{`${city}`}</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  glowWrapper: {
    width: 200, // Adjust the size of the wrapper as needed
    height: 190, // Adjust the size of the wrapper as needed
    borderRadius: 75, // Half of width and height to make it circular
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#E56033', // Color of the glow
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 100, // Opacity of the glow
    shadowRadius: 10, // Spread of the glow
    elevation: 50,
  },

  ConnectedButton: {
    width: 160,
    height: 50,
    marginTop: '5%',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },

  AddProducerButton: {
    width: 160,
    height: 50,
    marginTop: '5%',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CB8D78',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RetrieveRequest: {
    width: 160,
    height: 50,
    marginTop: '5%',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RetrieveRequestText: {
    fontSize: 17,
    fontFamily: 'Outfit-Regular',
    color: 'red',
  },

  AddProducerText: {
    fontSize: 17,
    fontFamily: 'Outfit-Regular',
    color: '#CB8D78',
  },

  ConnectedText: {
    fontSize: 17,
    fontFamily: 'Outfit-Regular',
    color: 'green',
  },
  Background: {
    backgroundColor: '#101010',
    height: '100%',
    marginBottom: '20%',
  },
});

export default DisplayProfile;
