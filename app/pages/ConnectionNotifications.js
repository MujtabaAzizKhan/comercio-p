import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Formik} from 'formik';
import * as yup from 'yup';
import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';

import Product from '../components/Product';
import DistributorCard from '../components/DistributorCard';

import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  RefreshControl,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Keyboard,
  Pressable,
} from 'react-native';

const ConnectionNotifications = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [isRefreshing, setRefreshing] = useState(false);

  const filterProfiles = search => {
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const getDistributors = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      // console.log(retrievedData.id)

      const dataBody = {
        userId: retrievedData.id,
      };

      await client
        .post('/user/pendingConnections', dataBody)
        .then(function (response) {
          const responseData = response.data;
          //   console.log(responseData);
          setProfiles(responseData);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const FetchProfile = async (
    id,
    name,
    avatar,
    email,
    phoneNumber,
    address,
    city,
  ) => {
    // console.log(phoneNumber + 'ASdasd');
    const profileData = {
      id: id,
      name: name,
      avatar: avatar,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      city: city,
    };

    navigation.navigate('DisplayProfile', {data: profileData});
  };

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 500); // Simulate a half second refresh
  };

  useEffect(() => {
    try {
      getDistributors();
    } catch (error) {
      console.log(error);
    }
  }, [isRefreshing]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      nestedScrollEnabled={true}
      style={styles.Background}>
      <View
        style={{
          marginLeft: '5%',
          marginTop: '5%',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Bold',
            fontSize: 22,
            marginRight: '40%',
            marginLeft: '-5%',
          }}>
          COMERCIO
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Cart Screen')}>
          <Image
            source={require('../../assets/images/ShoppingCart.png')}
            style={{height: 25, width: 25}}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          marginTop: '8%',
        }}>
        <TouchableOpacity>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Bold',
              fontSize: 20,
              textAlign: 'center',
            }}>
            Connection Notifications
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            height: 50,
            width: 356,
            borderWidth: 1,
            marginTop: '1%',
            borderColor: '#393840',
            backgroundColor: '#242222',
            borderRadius: 67,
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
                marginLeft: '4.5%',
                marginRight: '5%',
                width: '65%',
              }}
              placeholder={'Search'}
              placeholderTextColor={'#FFFFFF'}
              maxLength={16}
              onChangeText={setSearch}
            />
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/Barcode.png')}
                style={{
                  height: 24,
                  width: 24,
                  marginHorizontal: '3%',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/Search.png')}
                style={{
                  height: 24,
                  width: 24,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {profiles.length > 0 ? (
        <View style={{alignItems: 'center'}}>
          {filterProfiles(search).map(profile => (
            <TouchableOpacity
              key={profile.id}
              onPress={() => {
                FetchProfile(
                  profile._id,
                  profile.name,
                  profile.avatar,
                  profile.email,
                  profile.phoneNumber,
                  profile.address,
                  profile.city,
                );
              }}>
              <DistributorCard
                id={profile.id}
                name={profile.name}
                avatar={profile.avatar}
                email={profile.email}
                phoneNumber={profile.phoneNumber}
                address={profile.address}
                city={profile.city}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View></View>
      )}
      <View style={{height: 120}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default ConnectionNotifications;
