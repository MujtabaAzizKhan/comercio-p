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
  Alert,
} from 'react-native';
import 'react-native-gesture-handler';
import {StackActions} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import axios from 'axios';
import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';
import {useRoute} from '@react-navigation/native';

//An Amount needs to be passed from the checkout into the ChoosePaymentScreen component
const ChoosePaymentScreen = ({navigation, amount}) => {
  const route = useRoute();
  const {price} = route.params;

  const [loading, setLoading] = useState(false);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const xd = parseInt(price);
  // console.log(typeof xd);
  // console.log(xd);
  amount = xd;

  const data = {
    amount,
  };

  const fetchPaymentSheetParams = async () => {
    const headers = {
      'Content-Type': 'application/json', // Set the content type header
    };

    try {
      const response = await client.post('/payment', data, {headers});
      //console.log(response.data);
      ({paymentIntent, ephemeralKey, customer} = response.data);
    } catch (error) {
      console.log('Error:', error);
    }

    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    let {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'Comercio',
      allowsDelayedPaymentMethods: true,

      defaultBillingDetails: {
        address: {
          country: 'IND',
        },
      },
    });
    if (!error) {
      setLoading(true);
    }
  };

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        Alert.alert('Success', 'Your order is confirmed!');

        // Get the cart
        const res = await client.get(`/cart/${retrievedData.id}`);
        //console.log(res.data);
        const cartDataForHistory = res.data;
        //console.log(cartDataForHistory[0].products);

        // Create a new buying history
        const historyData = {
          history: [
            {
              totalPrice: price,
              products: cartDataForHistory[0].products.map(product => {
                return {
                  product: product.product._id,
                  quantity: product.quantity,
                  price: product.price,
                };
              }),
            },
          ],
        };
        const history = await client.post(
          `/history/create/${retrievedData.id}`,
          historyData,
        );

        let creators = [
          ...new Set(
            cartDataForHistory[0].products.map(
              product => product.product.createdBy,
            ),
          ),
        ];

        let promises = creators.map(async creator => {
          const sellingHistoryData = {
            sellingHistory: [
              {
                buyer: retrievedData.id,
                orderNumber:
                  history.data.history[history.data.history.length - 1]
                    .orderNumber,
                totalPrice: price,
                products: cartDataForHistory[0].products
                  .filter(product => product.product.createdBy === creator)
                  .map(product => {
                    return {
                      product: product.product._id,
                      quantity: product.quantity,
                      price: product.price,
                    };
                  }),
              },
            ],
          };
          return client
            .post(`/sellingHistory/create/${creator}`, sellingHistoryData)
            .catch(error => {
              console.log(error.response.data);
            });
        });

        await Promise.all(promises);

        //decrease the quantity of the products

        const products = res.data[0].products;

        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const createdBy = product.product.createdBy;
          const productId = product.product._id;
          const quantity = product.product.quantity;

          const decreaseQuantity = quantity - product.quantity;

          const res1 = await client.put(`/product/${createdBy}/${productId}`, {
            quantity: decreaseQuantity,
          });
        }

        // Delete the cart
        const delCart = await client.delete(`/cart/delete/${retrievedData.id}`);

        // Create a new cart
        const cartData = {products: []};
        const cartNew = await client.post(
          `/cart/create/${retrievedData.id}`,
          cartData,
        );
        navigation.dispatch(StackActions.replace('Tab Drawer'));
      }
    }
    (paymentIntent = ''), (ephemeralKey = ''), (customer = '');
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={styles.Background}>
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
            marginLeft: '15%',
            marginTop: '-1%',
          }}>
          Choose Payment
        </Text>
      </View>

      <View
        style={{
          margin: '5%',
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: '0%',
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Regular',
            fontSize: 13,
          }}>
          List of all your credit cards
        </Text>
      </View>

      <View style={{alignItems: 'center'}}>
        <View
          style={{
            height: 161,
            width: 261,
            borderRadius: 20,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            margin: '7%',
          }}>
          <Image
            source={require('../../assets/images/paymentPicture.png')}
            style={{width: 227, height: 161}}
          />
        </View>
        <View
          style={{
            height: 161,
            width: 261,
            borderRadius: 27,
            backgroundColor: '#2F2121',
            alignItems: 'center',
            margin: '7%',
          }}>
          <Image
            source={require('../../assets/images/Mastercard.png')}
            style={{height: 25, width: 45, marginLeft: '75%', marginTop: '10%'}}
          />
          <View
            style={{
              flexDirection: 'row',
              marginTop: '10%',
              marginLeft: '7.5%',
            }}>
            <View>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 13,
                }}>
                3254-6754-0001-5654
              </Text>
            </View>

            <View style={{marginLeft: '20%'}}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 13,
                  marginLeft: '10%',
                }}>
                12/24
              </Text>
              <Text
                style={{
                  color: '#E56033',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 10,
                }}>
                Valid Thru
              </Text>
            </View>
          </View>
          <View
            style={{
              height: 40,
              width: 262,
              backgroundColor: '#E5B8EC',
              borderBottomRightRadius: 27,
              borderBottomLeftRadius: 27,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '4.3%',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
                marginRight: '50%',
              }}>
              John Deaf
            </Text>
            {/* <TouchableOpacity>
              <Octicons name={'pencil'} size={18} color={'black'} onPress={() => navigation.navigate('AddPaymentScreen')} />
            </TouchableOpacity> */}
          </View>
        </View>
        {/* <View style={{ flexDirection: 'row' }}>
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 8,
              backgroundColor: '#E56033',
              marginRight: '3%',
            }}
          />
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 8,
              backgroundColor: '#9F9494',
              marginRight: '3%',
            }}
          />
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 8,
              backgroundColor: '#9F9494',
              marginRight: '3%',
            }}
          />
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 8,
              backgroundColor: '#9F9494',
            }}
          />

        </View> */}

        <StripeProvider publishableKey={process.env.stripeKey}>
          <View>
            <TouchableOpacity
              style={{
                width: 261,
                height: 50,
                marginTop: '19%',
                borderRadius: 51,
                borderWidth: 1,
                borderColor: '#E56033',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={openPaymentSheet}>
              <Text
                style={{
                  fontFamily: 'Outfit-Regular',
                  color: '#FFFFFF',
                  fontSize: 16,
                }}>
                Select
              </Text>
            </TouchableOpacity>
          </View>
        </StripeProvider>

        {/* <TouchableOpacity>
          <View style={{flexDirection: 'row', margin: '7%'}}>
            <AntDesign
              name={'pluscircleo'}
              size={10}
              color={'#FFFFFF'}
              style={{marginTop: '2%'}}
            />
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#FFFFFF',
                fontSize: 13,
                marginLeft: ' 5%',
              }}>
              Add a new payment method
            </Text>
          </View>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default ChoosePaymentScreen;
