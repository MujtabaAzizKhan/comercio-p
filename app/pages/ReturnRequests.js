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
import {returnRequest} from '../../backend/controllers/refund';

const ReturnRequests = () => {
  const [ID, setID] = useState('');
  const [name, setName] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [producer, setProducer] = useState('');
  const [requests, setRequests] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const getUserData = async () => {
    const readData = await EncryptedStorage.getItem('user');

    // Parse the JSON string to get the user data object
    const retrievedData = JSON.parse(readData);
    setID(retrievedData.id);
    setName(retrievedData.name);
    getRequests(retrievedData.name);
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getRequests = async brandName => {
    try {
      console.log(brandName);
      const response = await client.get(`/refund/getRequests/${brandName}`);
      const requestsReceived = response.data.requests;
      console.log('Requests:', requestsReceived);
      setRequests(requestsReceived);
      // Add logic to handle the retrieved requests
    } catch (error) {
      console.error('Error:', error);
      // Add logic to handle errors
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.item}>
      <Text style={styles.title2}>Order Number: {item.orderNumber}</Text>
      <Text style={styles.subtitle}>Customer Name: {item.customerName}</Text>
      <Text style={styles.subtitle}>Product: {item.product}</Text>
      <Text style={styles.subtitle}>Quantity: {item.quantity}</Text>
      <Text style={styles.subtitle}>Reason: {item.reason}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>
          Return Requests from Distributors will be displayed below.
        </Text>
        <Text style={styles.title}>Return Requests</Text>
        <View style={styles.separator} />

        {Array.isArray(requests) && requests.length > 0 ? (
          requests.map(item => (
            <TouchableOpacity key={item._id} style={styles.item}>
              <Text style={styles.title2}>
                Order Number: {item.orderNumber}
              </Text>
              <Text style={styles.subtitle}>
                Customer Name: {item.customerName}
              </Text>
              <Text style={styles.subtitle}>Product: {item.product}</Text>
              <Text style={styles.subtitle}>Quantity: {item.quantity}</Text>
              <Text style={styles.subtitle}>Reason: {item.reason}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.title2}>
            No return requests available. Looks lke your products are doing
            well!
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#101010',
  },
  container: {
    padding: 10,
    justifyContent: 'center',
    marginBottom: '20%',
  },
  header: {
    color: 'white',
    marginTop: '5%',
    fontFamily: 'Outfit-Bold',
    fontSize: 22,
    textAlign: 'left',
  },
  title: {
    color: 'white',
    marginTop: '6%',
    fontFamily: 'Outfit-Bold',
    fontSize: 19,
    textAlign: 'center',
  },
  title2: {
    color: '#E56033',
    marginTop: '6%',
    fontFamily: 'Outfit-Bold',
    fontSize: 19,
    textAlign: 'center',
  },
  separator: {
    marginTop: '2%',
    width: '100%',
    backgroundColor: '#E56033',
    height: '0.25%',
  },
  item: {
    backgroundColor: '#1F1F1F',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
  },
  subtitle: {
    color: 'white',
    fontFamily: 'Outfit-Regular',
    fontSize: 16,
    marginTop: 5,
  },
});

export default ReturnRequests;
