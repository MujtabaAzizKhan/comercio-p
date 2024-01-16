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
  Modal,
} from 'react-native';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import * as ImagePicker from 'react-native-image-picker';
import client from '../api/client';
import {ActivityIndicator} from 'react-native';
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
import axios from 'axios';

const ShoppingHistory = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [history, setHistory] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [receipt, setReceipt] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [ID, setID] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await getHistory();
      await getUserData();
      await getReceipt();
      setIsLoading(false); // Set isLoading to false when the data is fetched
    };

    fetchData();
  }, []);

  const getHistory = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(`/history/${retrievedData.id}`);
        const historyData = res.data;
        setHistory(res.data);
        console.log(historyData);
      }
    } catch (error) {
      console.error('Error fetching the history:', error);
      console.error('Error response:', error.response);
    }
  };
  const getReceipt = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(`/history/getInvoice/${retrievedData.id}`);
        const receiptData = res.data;
        setReceipt(res.data);
        console.log(receipt);
      }
    } catch (error) {
      console.error('Error fetching the history:', error);
      console.error('Error response:', error.response);
    }
  };
  const getUserData = async () => {
    const readData = await EncryptedStorage.getItem('user');
    setUserData(readData);

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(false);

      // Parse the JSON string to get the user data object
      const retrievedData = JSON.parse(readData);

      setID(retrievedData.id);
    }
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let receipt = null;

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErr('Error picking image');
      } else {
        receipt = response.assets[0];
        cloudinaryUpload(receipt);
      }
    });
  };
  const cameraPicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let receipt = null;

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErr('Error picking image');
      } else {
        receipt = response.assets[0];
        cloudinaryUpload(receipt);
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
        const imageUrl = response.data.url;

        const formData = new FormData();
        formData.append('file', {
          uri: file.uri,
          type: 'image/jpg',
          name: 'image.jpg',
        });
        formData.append('imageUrl', JSON.stringify(imageUrl));

        axios({
          method: 'post',
          url: `http:///api/history/processInvoice/${ID}`,
          data: formData,
          headers: {'Content-Type': 'multipart/form-data'},
        })
          .then(response => {
            console.log('Success:', response.data);
          })
          .catch(error => {
            console.error('Error:', error);
            if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.log(error.response.data);
              console.log(error.response.status);
              console.log(error.response.headers);
            } else if (error.request) {
              // The request was made but no response was received
              console.log(error.request);
            } else {
              // Something happened in setting up the request that triggered an Error
              console.log('Error', error.message);
            }
          });

        //sendReceipt(response.data.url);
        setModalVisible(false);
      } catch (error) {
        console.error('Error while uploading:', error);
        console.error('Cloudinary response:', error.response);
      }
    }
  };
  if (isLoading) {
    return (
      <View
        style={{flex: 1, justifyContent: 'center', backgroundColor: '#101010'}}>
        <ActivityIndicator color="white" />
      </View>
    );
  }
  return (
    <View
      style={{
        backgroundColor: '#101010',
        height: '100%',
      }}>
      <ScrollView>
        <View style={{marginLeft: '5%', marginTop: '5%', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.pop(1))}>
            <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
          </TouchableOpacity>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Bold',
              fontSize: 24,
              marginLeft: '30%',
            }}>
            Orders
          </Text>
        </View>
        <View
          style={{
            marginTop: '2%',
            width: '100%',
            backgroundColor: '#E56033',
            height: 2,
          }}
        />

        <View style={{alignItems: 'center'}}>
          <View
            style={{
              width: '85%',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 15,
                marginLeft: '4%',
                marginTop: '2%',
              }}>
              Order History
            </Text>
            {/* order */}
            {history.map((userHistory, index) =>
              userHistory.history.map((order, orderIndex) => (
                <View key={orderIndex}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '4%',
                    }}>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'Outfit-Regular',
                        fontSize: 12,
                        marginLeft: '4%',
                      }}>
                      {order.createdAt.slice(0, 10)}
                    </Text>
                    <TouchableOpacity
                      style={{flexDirection: 'row', marginRight: '8.5%'}}
                      onPress={() =>
                        navigation.navigate('ViewOrder', {
                          orderNumber: order.orderNumber,
                        })
                      }>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontFamily: 'Outfit-Regular',
                          fontSize: 12,
                          marginTop: '1%',
                          textDecorationLine: 'underline',
                        }}>
                        Details
                      </Text>
                      <Entypo
                        name={'chevron-small-right'}
                        size={18}
                        color={'white'}
                      />
                    </TouchableOpacity>
                  </View>

                  {order.orderNumber && (
                    <Text
                      style={{
                        color: '#E56033',
                        fontFamily: 'Outfit-Bold',
                        fontSize: 13,
                        marginLeft: '4%',
                        marginTop: '2%',
                      }}>
                      #{order.orderNumber}
                    </Text>
                  )}

                  {/*product */}

                  {order.products.map((product, productIndex) => (
                    <View
                      style={{
                        height: 50,
                        width: '100%',
                        marginVertical: '1%',
                        justifyContent: 'center',
                      }}
                      key={productIndex}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                          source={require('../../assets/images/rtx4090.png')}
                          style={{
                            height: 50,
                            width: 70,
                            marginLeft: '3.5%',
                          }}
                        />
                        <View
                          style={{
                            flexDirection: 'column',
                            marginLeft: '4%',
                          }}>
                          <Text
                            style={{
                              color: '#FFFFFF',
                              fontFamily: 'Outfit-Medium',
                              fontSize: 13,
                            }}>
                            {product.product.name}
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontFamily: 'Outfit-Regular',
                                fontSize: 10,
                              }}>
                              Quantity: {product.quantity} |
                            </Text>
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontFamily: 'Outfit-Regular',
                                fontSize: 10,
                              }}>
                              Rs {product.price}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  ))}
                  {/* Grey Line */}
                  <View
                    style={{
                      margin: '5%',
                      marginTop: '4%',
                      width: '85%',
                      backgroundColor: '#393840',
                      height: '0.5%',
                    }}
                  />
                </View>
              )),
            )}
          </View>
        </View>
        {receipt.length > 0 ? (
          <View style={{alignItems: 'center'}}>
            <View
              style={{
                width: '85%',
              }}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 15,
                  marginLeft: '4%',
                  marginTop: '2%',
                }}>
                Receipts
              </Text>
              {/* order */}
              {receipt.map((userHistory, index) =>
                userHistory.buyingHistory.map((order, orderIndex) => (
                  <View key={orderIndex}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginTop: '4%',
                      }}>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontFamily: 'Outfit-Regular',
                          fontSize: 12,
                          marginLeft: '4%',
                        }}>
                        {order.createdAt}
                      </Text>
                      <TouchableOpacity
                        style={{flexDirection: 'row', marginRight: '8.5%'}}
                        onPress={() =>
                          navigation.navigate('ViewReceiptImage', {
                            image: order.imageUrl,
                          })
                        }>
                        <Text
                          style={{
                            color: '#FFFFFF',
                            fontFamily: 'Outfit-Regular',
                            fontSize: 12,
                            marginTop: '1%',
                            textDecorationLine: 'underline',
                          }}>
                          Image
                        </Text>
                        <Entypo
                          name={'chevron-small-right'}
                          size={18}
                          color={'white'}
                        />
                      </TouchableOpacity>
                    </View>

                    {userHistory._id && (
                      <Text
                        style={{
                          color: '#E56033',
                          fontFamily: 'Outfit-Bold',
                          fontSize: 13,
                          marginLeft: '4%',
                          marginTop: '2%',
                        }}>
                        #{userHistory._id}
                      </Text>
                    )}

                    {/*product */}

                    {order.products.map((product, productIndex) => (
                      <View
                        style={{
                          height: 50,
                          width: '100%',
                          marginVertical: '1%',
                          justifyContent: 'center',
                        }}
                        key={productIndex}>
                        <View
                          style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View
                            style={{
                              flexDirection: 'column',
                              marginLeft: '4%',
                            }}>
                            <Text
                              style={{
                                color: '#FFFFFF',
                                fontFamily: 'Outfit-Medium',
                                fontSize: 13,
                              }}>
                              {product.product}
                            </Text>
                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontFamily: 'Outfit-Regular',
                                  fontSize: 10,
                                }}>
                                Quantity: {product.quantity} |
                              </Text>
                              <Text
                                style={{
                                  color: '#FFFFFF',
                                  fontFamily: 'Outfit-Regular',
                                  fontSize: 10,
                                }}>
                                Rs {product.price}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    ))}
                    <View
                      style={{
                        marginLeft: '4%',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          color: '#E56033',
                          fontFamily: 'Outfit-Medium',
                          fontSize: 15,
                        }}>
                        Total Price:{' '}
                      </Text>
                      <Text
                        style={{
                          color: '#FFFFFF',
                          fontFamily: 'Outfit-Medium',
                          fontSize: 15,
                        }}>
                        Rs {order.totalPrice}
                      </Text>
                    </View>
                    {/* Grey Line */}
                    <View
                      style={{
                        margin: '5%',
                        marginTop: '4%',
                        width: '85%',
                        backgroundColor: '#393840',
                        height: '0.5%',
                      }}
                    />
                  </View>
                )),
              )}
            </View>
          </View>
        ) : null}

        <View style={{height: 120}}></View>
      </ScrollView>
      <View
        style={{
          position: 'absolute',
          bottom: 25,
          right: 5,
          marginBottom: '5%',
        }}>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(!modalVisible);
          }}
          style={{marginBottom: '5%', marginRight: '5%'}}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              borderWidth: 1,
              borderColor: '#E56033',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#101010',
            }}>
            <Image
              source={require('../../assets/images/Scan-Linear.png')}
              style={{height: 32, width: 32}}
            />
          </View>
        </TouchableOpacity>
      </View>
      {/* MODAL */}
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
    </View>
  );
};
const styles = StyleSheet.create({
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

export default ShoppingHistory;
