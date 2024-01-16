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
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NumericInput from 'react-native-numeric-input';
import EncryptedStorage from 'react-native-encrypted-storage';
import client from '../api/client';
import {useRoute} from '@react-navigation/native';

const ViewSellingOrder = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const [order, setOrder] = useState('');
  const [price, setPrice] = useState('');
  const [buyer, setBuyer] = useState('');

  const route = useRoute();
  const {orderNumber} = route.params;

  useEffect(() => {
    getOrder();
  }, []);

  const getOrder = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(
          `/sellingHistory/singleOrder/${orderNumber}`,
        );
        const orderData = res.data;
        setOrder(orderData);

        // Calculate total price
        const totalPrice = orderData.sellingHistory[0].products.reduce(
          (sum, product) => {
            return sum + product.price * product.quantity;
          },
          0,
        );

        setPrice(totalPrice);
        setBuyer(orderData.sellingHistory[0].buyer.name);
        console.log(orderData);
      }
    } catch (error) {
      console.error('Error fetching the order:', error);
      console.error('Error response:', error.response);
    }
  };

  return (
    <ScrollView style={styles.Background}>
      <View style={{marginLeft: '5%', marginTop: '5%', flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-SemiBold',
            fontSize: 24,
            marginLeft: '31.5%',
            marginTop: '-1%',
          }}>
          ORDER
        </Text>
      </View>

      <View
        style={{
          margin: '5%',
          marginTop: '2%',
          marginLeft: '17%',
          width: '66.5%',
          backgroundColor: '#E56033',
          height: '0.25%',
        }}
      />

      <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: '85%',
          }}>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Bold',
              fontSize: 13,
              marginLeft: '4%',
              marginTop: '2%',
            }}>
            #{orderNumber}
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Bold',
              fontSize: 13,
              marginLeft: '4%',
              marginTop: '2%',
            }}>
            Buyer: {buyer}
          </Text>
          {order &&
            order.sellingHistory[0].products.map((product, index) => (
              <View
                style={{
                  height: 78,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: '#393840',
                  borderRadius: 7,
                  marginVertical: '4%',
                  justifyContent: 'center',
                }}
                key={index}>
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
                      marginLeft: '4%',
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
                        fontFamily: 'Outfit-Bold',
                        fontSize: 13,
                      }}>
                      {product.product.name}
                    </Text>
                    <Text
                      style={{
                        color: '#FFFFFF',
                        fontFamily: 'Outfit-Regular',
                        fontSize: 10,
                      }}>
                      Rs {product.product.price}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Outfit-Regular',
                      fontSize: 20,
                      position: 'absolute',
                      bottom: 0,
                      right: 18,
                      textAlign: 'center',
                      padding: 10,
                    }}>
                    {product.quantity}
                  </Text>
                </View>
              </View>
            ))}
        </View>
        <View
          style={{
            width: '100%',
            backgroundColor: 'grey',
            height: 78,
            justifyContent: 'space-evenly',
            alignItems: 'center',
            flexDirection: 'row',
            marginVertical: '3%',
          }}>
          <View>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 10,
              }}>
              Total
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 16,
              }}>
              Rs {price}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default ViewSellingOrder;
