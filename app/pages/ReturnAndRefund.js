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

const ReturnAndRefund = () => {
  const [ID, setID] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [producer, setProducer] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const getUserData = async () => {
    const readData = await EncryptedStorage.getItem('user');

    // Parse the JSON string to get the user data object
    const retrievedData = JSON.parse(readData);
    setID(retrievedData.id);
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const trimmedProducer = producer.trim();

  const handleSubmit = async () => {
    const formData = {
      customerId: ID,
      orderNumber,
      producer: trimmedProducer,
      product,
      quantity,
      reason,
      isAccepted: false,
    };

    await client
      .post('/refund/returnRequest', formData)
      .then(response => {
        console.log('Success:', response.data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView style={styles.Background}>
      <View
        style={{
          padding: 10,
          marginBottom: '20%',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
            marginTop: '5%',
            fontFamily: 'Outfit-Bold',
            fontSize: 24,
            textAlign: 'center',
          }}>
          Wish to return something? You've come to the right place!
        </Text>
        <Text
          style={{
            color: 'white',
            marginTop: '6%',
            fontFamily: 'Outfit-Bold',
            fontSize: 19,
            textAlign: 'left',
          }}>
          Return Form
        </Text>
        <View
          style={{
            marginTop: '2%',
            width: '100%',
            backgroundColor: '#E56033',
            height: '0.25%',
          }}
        />
        <View>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
              marginTop: '5%',
              textAlign: 'left',
              marginLeft: '2%',
            }}>
            Order Number
          </Text>
          <TextInput
            style={{
              color: 'white',
              borderColor: 'white',
              fontFamily: 'Outfit-Regular',
              marginTop: '1%',
              borderWidth: 1,
              borderRadius: 10,
              width: '90%',
            }}
            placeholder="Enter your order number."
            placeholderTextColor={'white'}
            value={orderNumber}
            onChangeText={text => setOrderNumber(text)}
          />
        </View>

        <View>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
              marginTop: '5%',
              textAlign: 'left',
              marginLeft: '2%',
            }}>
            Producer Name
          </Text>
          <TextInput
            style={{
              color: 'white',
              borderColor: 'white',
              fontFamily: 'Outfit-Regular',
              marginTop: '1%',
              borderWidth: 1,
              borderRadius: 10,
              width: '90%',
            }}
            placeholder="Enter Producer Name."
            placeholderTextColor={'white'}
            value={producer}
            onChangeText={text => setProducer(text)}
          />
        </View>

        <View>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
              marginTop: '5%',
              textAlign: 'left',
              marginLeft: '2%',
            }}>
            Product Name
          </Text>
          <TextInput
            style={{
              color: 'white',
              borderColor: 'white',
              fontFamily: 'Outfit-Regular',
              marginTop: '1%',
              borderWidth: 1,
              borderRadius: 10,
              width: '90%',
            }}
            placeholder="Enter Product Name."
            placeholderTextColor={'white'}
            value={product}
            onChangeText={text => setProduct(text)}
          />
        </View>
        <View>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
              marginTop: '5%',
              textAlign: 'left',
              marginLeft: '2%',
            }}>
            Quantity
          </Text>
          <TextInput
            style={{
              color: 'white',
              borderColor: 'white',
              fontFamily: 'Outfit-Regular',
              marginTop: '1%',
              borderWidth: 1,
              borderRadius: 10,
              width: '90%',
            }}
            placeholder="Quantity Bought"
            value={quantity}
            placeholderTextColor={'white'}
            onChangeText={text => setQuantity(text)}
            keyboardType="numeric"
          />
        </View>
        <View>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
              marginTop: '5%',
              textAlign: 'left',
              marginLeft: '2%',
            }}>
            Reason For Return
          </Text>
          <TextInput
            style={{
              color: 'white',
              borderColor: 'white',
              fontFamily: 'Outfit-Regular',
              marginTop: '1%',
              borderWidth: 1,
              borderRadius: 10,
              width: '90%',
            }}
            placeholderTextColor={'white'}
            placeholder="Reason for Return"
            value={reason}
            onChangeText={text => setReason(text)}
            multiline
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
              handleSubmit();
            }}>
            <Text
              style={{
                fontFamily: 'Outfit-Bold',
                color: '#FFFFFF',
                fontSize: 20,
              }}>
              Send
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
});

export default ReturnAndRefund;
