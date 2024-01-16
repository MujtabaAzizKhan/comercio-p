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
} from 'react-native';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import client from '../api/client';

const SellingHistory = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [history, setHistory] = useState([]);
  const [buttonState, setButtonState] = useState(false);

  useEffect(() => {
    getHistory();
  }, [buttonState]);

  const toggleButton = async orderNumber => {
    try {
      // Toggle the status in the backend
      await client.put(`/sellingHistory/toggleDelivered/${orderNumber}`);
      setButtonState(!buttonState);
    } catch (error) {
      console.error('Error toggling isDelivered status:', error);
    }
  };

  const getHistory = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(`/sellingHistory/${retrievedData.id}`);
        const historyData = res.data;
        setHistory(historyData);
        // const firstItemIsDelivered =
        //   historyData[0].sellingHistory[0].isDelivered;

        // console.log(firstItemIsDelivered);
        // console.log(historyData.sellingHistory.buyer);
      }
    } catch (error) {
      console.error('Error fetching the history:', error);
      console.error('Error response:', error.response);
    }
  };

  return (
    <ScrollView
      style={{
        backgroundColor: '#101010',
      }}>
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
          margin: '5%',
          marginTop: '2%',
          marginLeft: '17%',
          width: '66.5%',
          backgroundColor: '#E56033',
          height: '0.5%',
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
            userHistory.sellingHistory.map((order, orderIndex) => (
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
                      navigation.navigate('ViewSellingOrder', {
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
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Image
                        source={{
                          uri:
                            product.product.avatar ||
                            'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
                        }}
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
                <View
                  style={{
                    alignItems: 'center',
                  }}>
                  <TouchableOpacity
                    style={[
                      styles.button,
                      order.isDelivered == false
                        ? styles.notDelivered
                        : styles.delivered,
                    ]}
                    onPress={() => {
                      toggleButton(order.orderNumber);
                    }}>
                    <Text style={styles.buttonText}>
                      {order.isDelivered == false
                        ? 'Not Delivered'
                        : 'Delivered'}
                    </Text>
                  </TouchableOpacity>
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
      <View style={{height: 120}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 30,
    width: '40%',
    borderWidth: 1,
    borderColor: '#333',
  },
  delivered: {
    width: 135,
    borderRadius: 51,
    borderWidth: 1.5,
    borderColor: '#E56033',
  },
  notDelivered: {
    width: 135,
    borderRadius: 51,
    borderWidth: 1.5,
    borderColor: 'red',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default SellingHistory;
