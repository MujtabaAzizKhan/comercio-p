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

const PayOnPickup = ({navigation, amount}) => {
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

  const functionOne = async () => {
    const readData = await EncryptedStorage.getItem('user');
    setUserData(readData);

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(!isLoggedOut);

      // Parse the JSON string to get the user data object
      const retrievedData = JSON.parse(readData);

      Alert.alert('Success', 'Your order is confirmed!');
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

    (paymentIntent = ''), (ephemeralKey = ''), (customer = '');
  };
  return (
    <ScrollView style={styles.Background}>
      <View style={{marginBottom: '20%'}}>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Bold',
            fontSize: 24,
            textAlign: 'center',
          }}>
          PayOnPickup
        </Text>
        <View
          style={{
            marginTop: '2%',
            width: '100%',
            backgroundColor: '#E56033',
            height: '0.25%',
          }}
        />

        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: 'white',
              marginTop: '15%',
              fontFamily: 'Outfit-Bold',
              fontSize: 18,
              textAlign: 'left',
            }}>
            With this option, Payment is made upon picking up the products
            directly.
          </Text>
          <Image
            source={require('../../assets/images/Pickup.jpg')}
            style={{
              height: 300,
              width: 315,
              marginBottom: '1%',
              marginTop: '4%',
            }}
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
              functionOne();
            }}>
            <Text
              style={{
                fontFamily: 'Outfit-Bold',
                color: '#FFFFFF',
                fontSize: 20,
              }}>
              Accept
            </Text>
          </TouchableOpacity>
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

export default PayOnPickup;
