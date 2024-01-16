import {
  Text,
  View,
  TextInput,
  Image,
  Platform,
  Button,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Keyboard,
  Pressable,
  Modal,
  Dimensions,
} from 'react-native';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

import {
  Profile,
  Mobile,
  GalleryEdit,
  Buildings,
  CloseSquare,
  Location,
  LogoutCurve,
  Gallery,
  Camera,
} from 'iconsax-react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {Cloudinary, upload} from '@cloudinary/url-gen';
import axios from 'axios';

import {set} from 'mongoose';

const ProfilePage = ({navigation}) => {
  const [ID, setID] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // const [token, setToken] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [displayEmail, setDisplayEmail] = useState('');

  const [userData, setUserData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [updatedData, setUpdatedData] = useState({});

  const [isProducer, setIsProducer] = useState(false);
  const [userId, setUserId] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const getUserData = async () => {
    const readData = await EncryptedStorage.getItem('user');
    setUserData(readData);

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(false);

      // Parse the JSON string to get the user data object
      const retrievedData = JSON.parse(readData);
      // console.log(retrievedData);
      // console.log("ASDASD")

      setID(retrievedData.id);
      setName(retrievedData.name);
      setAvatar(retrievedData.avatar);
      setDisplayName(retrievedData.name);
      setEmail(retrievedData.email);
      setDisplayEmail(retrievedData.email);
      // setToken(retrievedData.token);
      setPhoneNumber(retrievedData.phoneNumber);
      setAddress(retrievedData.address);
      setCity(retrievedData.city);
      setIsProducer(retrievedData.isProducer);
      setUserId(retrievedData.id);
      setUpdatedData(readData);
    }
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const cameraPicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let profPicture = null;

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErr('Error picking image');
      } else {
        profPicture = response.assets[0];

        cloudinaryUpload(profPicture);
      }
    });
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let profPicture = null;

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErr('Error picking image');
      } else {
        profPicture = response.assets[0];

        cloudinaryUpload(profPicture);
      }
    });
  };

  const cloudinaryUpload = async file => {
    if (file) {
      const data = new FormData();

      const upload_preset = 'comercio';

      data.append('file', {
        uri: file.uri,
        type: 'image/jpg',
        name: 'image.jpg',
      });

      data.append('upload_preset', upload_preset);

      try {
        const response = await axios.post('', data, {
          headers: {'content-type': 'multipart/form-data'},
        });

        // console.log(response.data);
        console.log(response.data.url);
        setProfilePicture(response.data.url);
        setAvatar(response.data.url);
        setModalVisible(false);
      } catch (error) {
        console.error('Error while uploading:', error);
        console.error('Cloudinary response:', error.response);
      }
    }
  };

  const setProfilePicture = async url => {
    try {
      const profileData = {
        email: email,
        url: url,
      };
      await client
        .put('/user/profilePicture', profileData)
        .then(function (response) {
          const responseData = response.data;
          // console.log(responseData);
          Toast.show({
            type: 'info',
            text1: 'Picture updated, effective next login',
            visibilityTime: 4000,
            autoHide: true,
            // position: 'bottom',
            // bottomOffset: 80,
            // topOffset: 30,
            // bottomOffset: 40,
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const updateUserProfile = async () => {
    try {
      // const config = {
      //     headers: {
      //         Authorization: `Bearer ${token}`
      //     }
      // }
      const profileData = {
        id: ID,
        name: name,
        avatar: avatar,
        email: email,
        phoneNumber: phoneNumber,
        city: city,
        address: address,
        isProducer: isProducer,
      };

      await client
        .put('/user/profile', profileData)
        .then(function (response) {
          const responseData = response.data;
          // console.log(responseData.name);
          // console.log(responseData);

          setID(responseData.id);
          setName(responseData.name);
          setAvatar(responseData.avatar);
          setDisplayName(responseData.name);
          setEmail(responseData.email);
          setDisplayEmail(responseData.email);
          setPhoneNumber(responseData.phoneNumber);
          setAddress(responseData.address);
          setCity(responseData.city);
          setIsProducer(responseData.isProducer);

          updateLocalStorage(responseData);

          setIsEditing(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const updateLocalStorage = async data => {
    await EncryptedStorage.setItem('user', JSON.stringify(data));
  };

  const logout = async () => {
    if (isProducer == false) {
      // console.log('dasdsadad');
      const res = await client.delete(`/cart/delete/${userId}`);
      EncryptedStorage.removeItem('user');
      navigation.dispatch(StackActions.replace('Sign in Screen'));
    } else {
      EncryptedStorage.removeItem('user');
      navigation.dispatch(StackActions.replace('Sign in Screen'));
    }
  };

  const handleToggleEditing = () => {
    // Toggle the value of isEditing
    setIsEditing(!isEditing);
  };

  // Get the device's screen width and height
  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  // Calculate the size for the circular view based on percentages
  const viewSize = (screenWidth, screenHeight) * 0.23; // Adjust the percentage as needed

  return (
    <ScrollView>
      <View style={styles.Background}>
        <TouchableOpacity onPress={logout}>
          <View
            style={{
              marginTop: '4%',
              flexDirection: 'row',
              alignSelf: 'flex-end',
              marginRight: '2%',
            }}>
            <LogoutCurve size="30" color="#E56033" />
            <Text
              style={{
                marginLeft: '1%',
                fontSize: 20,
                fontFamily: 'Outfit-Regular',
                color: '#E56033',
              }}>
              Logout
            </Text>
          </View>
        </TouchableOpacity>

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
            <TouchableOpacity
              style={{marginLeft: '90%', marginTop: '-10%'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              <GalleryEdit size="30" color="#FF8A65" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Light',
              fontSize: 25,
              marginTop: '2.5%',
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

        <TouchableOpacity
          style={{marginLeft: '75%', flexDirection: 'row', marginTop: '7%'}}
          onPress={handleToggleEditing}>
          <AntDesign name={'edit'} size={30} color={'#E56033'} />
          <Text
            style={{
              color: '#E56033',
              marginLeft: '4%',
              marginTop: '1%',
              fontFamily: 'Outfit-Regular',
              fontSize: 22,
            }}>
            Edit
          </Text>
        </TouchableOpacity>

        {/* Modal is here*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}>
              <View style={{alignItems: 'flex-end', marginBottom: '1%'}}>
                <CloseSquare size="32" color="#FF8A65" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => {
                handleImagePicker();
              }}>
              <Gallery size="100" color="#FF8A65" />
            </TouchableOpacity>

            <View
              style={{
                width: '100%',
                height: '1.5%',
                backgroundColor: 'white',
                marginTop: '5%',
                marginBottom: '5%',
              }}></View>

            <TouchableOpacity
              style={{alignItems: 'center', marginBottom: '7%'}}
              onPress={() => {
                cameraPicker();
              }}>
              <Camera size="100" color="#FF8A65" />
            </TouchableOpacity>
          </View>
        </Modal>

        <Text
          style={{
            color: '#FFFFFF',
            marginTop: '3%',
            marginLeft: '4%',
            fontFamily: 'Outfit-SemiBold',
            fontSize: 30,
          }}>
          Contact Information
        </Text>

        {isEditing ? (
          <View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '3%',
                  backgroundColor: '#171819',
                  borderRadius: 10,
                  height: 50,
                  width: '90%',
                  alignItems: 'center',
                }}>
                <Profile marginLeft="1%" size="30" color="#E56033" />
                <TextInput
                  style={{
                    width: '80%',
                    marginTop: '-5%',
                    marginLeft: '2%',
                    fontSize: 20,
                    paddingBottom: 1,
                    borderBottomWidth: 2,
                    borderColor: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    color: 'white',
                  }}
                  placeholder={'Enter Name Here'}
                  placeholderTextColor={'white'}
                  onChangeText={setName}
                  value={name}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '2%',
                  backgroundColor: '#171819',
                  borderRadius: 10,
                  height: 50,
                  width: '90%',
                  alignItems: 'center',
                }}>
                <AntDesign
                  style={{marginLeft: '1%'}}
                  name={'mail'}
                  size={30}
                  color={'#E56033'}
                />
                <TextInput
                  style={{
                    width: '80%',
                    marginTop: '-5%',
                    marginLeft: '2%',
                    fontSize: 20,
                    paddingBottom: 1,
                    borderBottomWidth: 2,
                    borderColor: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    color: 'white',
                  }}
                  placeholder={'Enter Name Here'}
                  placeholderTextColor={'white'}
                  onChangeText={setEmail}
                  value={email}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '2%',
                  backgroundColor: '#171819',
                  borderRadius: 10,
                  height: 50,
                  width: '90%',
                  alignItems: 'center',
                }}>
                <Mobile marginLeft="1%" size="30" color="#E56033" />
                <TextInput
                  style={{
                    width: '80%',
                    marginTop: '-5%',
                    marginLeft: '2%',
                    fontSize: 20,
                    paddingBottom: 1,
                    borderBottomWidth: 2,
                    borderColor: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    color: 'white',
                  }}
                  placeholder={'Enter Phone Number'}
                  placeholderTextColor={'white'}
                  onChangeText={setPhoneNumber}
                  value={phoneNumber}
                />
              </View>
            </View>

            <Text
              style={{
                color: '#FFFFFF',
                marginTop: '5%',
                marginLeft: '4%',
                fontFamily: 'Outfit-SemiBold',
                fontSize: 30,
              }}>
              Location
            </Text>

            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '3%',
                  backgroundColor: '#171819',
                  borderRadius: 10,
                  height: 50,
                  width: '90%',
                  alignItems: 'center',
                }}>
                <Location marginLeft="1%" size="30" color="#E56033" />
                <TextInput
                  style={{
                    width: '80%',
                    marginTop: '-5%',
                    marginLeft: '2%',

                    fontSize: 20,
                    paddingBottom: 1,
                    borderBottomWidth: 2,
                    borderColor: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    color: 'white',
                  }}
                  placeholder={'Enter Address'}
                  placeholderTextColor={'white'}
                  onChangeText={setAddress}
                  value={address}
                />
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: '2%',
                  backgroundColor: '#171819',
                  borderRadius: 10,
                  height: 50,
                  width: '90%',
                  alignItems: 'center',
                }}>
                <Buildings marginLeft="1%" size="30" color="#E56033" />
                <TextInput
                  style={{
                    width: '80%',
                    marginTop: '-5%',
                    marginLeft: '2%',
                    fontSize: 20,
                    paddingBottom: 1,
                    borderBottomWidth: 2,
                    borderColor: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    color: 'white',
                  }}
                  placeholder={'Enter City'}
                  placeholderTextColor={'white'}
                  onChangeText={setCity}
                  value={city}
                />
              </View>

              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <TouchableOpacity
                  style={{
                    width: 200,
                    height: 50,
                    marginTop: '8%',
                    borderRadius: 51,
                    borderWidth: 2,
                    borderColor: '#E56033',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    updateUserProfile();
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Outfit-Bold',
                      color: '#FFFFFF',
                      fontSize: 20,
                    }}>
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
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
                fontFamily: 'Outfit-SemiBold',
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
                    marginRight: '2%',
                    fontFamily: 'Outfit-Regular',
                    color: 'white',
                  }}>
                  Address
                </Text>

                <Text
                  style={{
                    width: '60%',
                    textAlign: 'right',
                    fontSize: 15,
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
        )}
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
  Background: {
    backgroundColor: '#101010',
    height: '100%',

    marginBottom: '30%',
  },
  titleContainer: {
    fontFamily: 'Outfit-Regular',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white',
  },
  title2: {
    marginLeft: 56,
    fontFamily: 'outfit',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  buttonOrange: {
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#E56033',
    width: 261,
    borderRadius: 18,
  },
  buttonOrangeText: {
    fontFamily: 'Outfit-Regular',
    marginLeft: 20,
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '700',
    color: 'white',
  },
  buttonWhite: {
    justifyContent: 'center',
    height: 100,
    backgroundColor: 'white',
    width: 261,
    borderRadius: 18,
  },
  buttonWhiteText: {
    fontFamily: 'Outfit-Regular',
    marginLeft: 20,
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '700',
    color: 'black',
  },
  addManuallyTextSlim: {
    padding: 10,
    marginLeft: 56,
    width: '73%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
    backgroundColor: '#F2F2F2',
  },
  addManuallyTextLarge: {
    padding: 10,
    marginLeft: 56,
    width: '73%',
    height: 100,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
    backgroundColor: '#F2F2F2',
  },
  dropDown: {
    padding: 10,
    marginLeft: 56,
    width: '73%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
    backgroundColor: '#F2F2F2',
  },
  modalView: {
    margin: 50,
    marginTop: '55%',
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4, // Adjust the height as needed
    },
    shadowOpacity: 5, // Adjust the opacity as needed
    shadowRadius: 4,
    elevation: 5, // Adjust the elevation as needed
  },
});

export default ProfilePage;
