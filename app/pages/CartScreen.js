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
import {Card, TruckFast} from 'iconsax-react-native';

const CartScreen = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const [cart, setCart] = useState('');
  const [price, setPrice] = useState('');

  const [emptyCart, setEmptyCart] = useState(true);

  useEffect(() => {
    getCart();
  }, []);

  const getCart = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(`/cart/${retrievedData.id}`);
        if (res.data[0].products.length === 0) {
          setEmptyCart(true);
        } else {
          setEmptyCart(false);
        }
        console.log(res.data[0]);
        const cartData = res.data;
        setCart(cartData);
        setPrice(cartData[0].totalPrice);
      }
    } catch (error) {
      console.error('Error fetching the cart:', error);
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
          CART
        </Text>
        <Image
          source={require('../../assets/images/ShoppingCart.png')}
          style={{height: 25, width: 25, marginLeft: '1%', marginTop: '0.25%'}}
        />
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
          {cart &&
            cart[0].products.map((product, index) => (
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
                    }}
                    key={index}>
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

          <TouchableOpacity
            onPress={() => navigation.navigate('ChoosePaymentScreen', {price})}
            disabled={emptyCart === true}>
            <View
              style={{
                width: 140,
                height: 50,
                borderRadius: 32,
                borderWidth: 1,
                borderColor: emptyCart === true ? '#ccc' : '#E56033',
                backgroundColor: emptyCart === true ? '#ccc' : '#E56033',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Card size="32" color="black" />
              <Text
                style={{
                  fontFamily: 'Outfit-Regular',
                  color: '#FFFFFF',
                  marginLeft: '5%',
                  fontSize: 14,
                }}>
                Checkout
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.header}>OR</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('PayOnPickup', {price})}
          style={{
            alignItems: 'center',
          }}>
          <Text style={styles.header2}>Pay on Pickup</Text>
          <TruckFast size="100" color="#FF8A65" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  header: {
    color: 'white',
    marginTop: '10%',
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
    textAlign: 'center',
  },

  header2: {
    color: 'white',
    marginTop: '10%',
    fontFamily: 'Outfit-Bold',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default CartScreen;
