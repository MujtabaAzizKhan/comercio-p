import 'react-native-gesture-handler';
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

import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {updateNotification} from '../utils/helper';
import AppNotification from '../components/AppNotification';
import {useRoute} from '@react-navigation/native';
import client from '../api/client';

const ReviewPage = ({navigation, route}) => {
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });

  const [name, setName] = useState('');
  const [rating, setRating] = useState(route.params.rate);
  const [review, setReview] = useState('');

  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const {id} = route.params;

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const readData = await EncryptedStorage.getItem('user');
    setUserData(readData);

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(!isLoggedOut);

      // Parse the JSON string to get the user data object
      const retrievedData = JSON.parse(readData);
      setName(retrievedData.name);
    }
  };

  const handleRatingPress = newRating => {
    setRating(newRating);
  };

  const handleSubmit = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);
        const reviewData = {
          user: retrievedData.id,
          product: id,
          review: review,
          rating: rating,
        };

        const res = await client.post('/productReview/create', reviewData);
        navigation.dispatch(StackActions.replace('ProductPage', {id: id}));
      }
    } catch (error) {
      console.error('Error adding review:', error);
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
            fontFamily: 'Outfit-Bold',
            fontSize: 24,
            marginLeft: '28%',
            marginTop: '-1%',
          }}>
          Review
        </Text>
      </View>
      {message.text ? (
        <AppNotification type={message.type} text={message.text} />
      ) : null}
      <View style={{alignItems: 'center', marginTop: '3.5%'}}>
        <View
          style={{
            width: '85%',
          }}>
          <View style={{flexDirection: 'row', alignContent: 'flex-start'}}>
            <Image
              source={require('../../assets/images/S0mple.jpg')}
              style={{
                width: 54,
                height: 54,
                borderRadius: 54,
              }}
            />
            <Text
              style={{
                fontFamily: 'Outfit-SemiBold',
                fontSize: 18,
                color: '#ffffff',
                marginLeft: '5%',
                marginTop: '3%',
              }}>
              {name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginVertical: '5%'}}>
            <TouchableOpacity onPress={() => handleRatingPress(1)}>
              <AntDesign
                name={rating >= 1 ? 'star' : 'staro'}
                size={20}
                style={{marginHorizontal: 35}}
                color={'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRatingPress(2)}>
              <AntDesign
                name={rating >= 2 ? 'star' : 'staro'}
                size={20}
                style={{marginLeft: '12%'}}
                color={'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRatingPress(3)}>
              <AntDesign
                name={rating >= 3 ? 'star' : 'staro'}
                size={20}
                style={{marginLeft: '12%'}}
                color={'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRatingPress(4)}>
              <AntDesign
                name={rating >= 4 ? 'star' : 'staro'}
                size={20}
                style={{marginLeft: '12%'}}
                color={'white'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRatingPress(5)}>
              <AntDesign
                name={rating >= 5 ? 'star' : 'staro'}
                size={20}
                style={{marginLeft: '12%'}}
                color={'white'}
              />
            </TouchableOpacity>
          </View>

          <TextInput
            style={{
              width: '100%',
              height: 50,
              paddingLeft: 25,
              fontSize: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
            }}
            placeholder={'Describe your experience'}
            placeholderTextColor={'#CB8D78'}
            onChangeText={setReview}
          />
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: 'white',
            width: '85%',
            height: 50,
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '85%',
          }}
          onPress={() => handleSubmit()}>
          <Text
            style={{
              color: '#393840',
              fontFamily: 'Outfit-Bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            Post
          </Text>
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
});

export default ReviewPage;
