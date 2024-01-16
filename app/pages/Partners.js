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
import PartnerRequestCard from '../components/PartnerRequestCard';
import ProducerCard from '../components/ProducerCard';
import Product from '../components/Product';

import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Keyboard,
  Pressable,
} from 'react-native';

const Partners = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [partners, setPartners] = useState([]);
  const [connectionReq, setConnectionReq] = useState([]);

  const [isRefreshing, setRefreshing] = useState(false);

  const [isSearchingDistributor, setIsSearchingDistributor] = useState(true);

  const filterProfiles = search => {
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const filterPartners = search => {
    return partners.filter(partner =>
      partner.name.toLowerCase().includes(search.toLowerCase()),
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

        .post('/user/distributors', dataBody)

        .then(function (response) {
          const responseData = response.data;
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
    isProducer,
  ) => {
    const profileData = {
      id: id,
      name: name,
      avatar: avatar,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      city: city,
      isProducer: isProducer,
    };

    navigation.navigate('DisplayDistributorProfile', {data: profileData});
  };

  const setRole = () => {
    setIsSearchingDistributor(!isSearchingDistributor);
  };

  const getPartners = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      // console.log(retrievedData.id)

      const dataBody = {
        userId: retrievedData.id,
      };

      await client

        .post('/partner/displayPartners', dataBody)

        .then(function (response) {
          const responseData = response.data;
          setPartners(responseData);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const getNotifications = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      // console.log(retrievedData.id)

      const dataBody = {
        userId: retrievedData.id,
      };

      await client
        .post('/partner/pendingConnections', dataBody)
        .then(function (response) {
          const responseData = response.data;
          //   console.log(responseData);
          setConnectionReq(responseData);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 500); // Simulate a half second refresh
  };

  useEffect(() => {
    try {
      if (isSearchingDistributor == true) {
        console.log('Dist');
        getDistributors();
      } else {
        console.log('Part');
        getPartners();
        getNotifications();
      }
    } catch (error) {
      console.log(error);
    }
  }, [isSearchingDistributor, isRefreshing]);

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

      {isSearchingDistributor ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: '8%',
          }}>
          <TouchableOpacity
            onPress={() => {
              setRole();
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
              }}>
              Partners
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setRole();
            }}>
            <Text
              style={{
                color: '#E56033',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
              }}>
              Distributors
            </Text>
            <View style={{height: '4%', backgroundColor: '#E56033'}} />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: '8%',
          }}>
          <TouchableOpacity
            onPress={() => {
              setRole();
            }}>
            <Text
              style={{
                color: '#E56033',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
              }}>
              Partners
            </Text>
            <View style={{height: '4%', backgroundColor: '#E56033'}} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setRole();
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
              }}>
              Distributors
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={{alignItems: 'center'}}>
        <View
          style={{
            height: 50,
            width: 356,
            borderWidth: 1,
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

      {isSearchingDistributor ? (
        <View style={{marginTop: '1%', alignItems: 'center'}}>
          {filterProfiles(search).map(profile => (
            <TouchableOpacity
              key={profile._id}
              onPress={() => {
                FetchProfile(
                  profile._id,
                  profile.name,
                  profile.avatar,
                  profile.email,
                  profile.phoneNumber,
                  profile.address,
                  profile.city,
                  profile.isProducer,
                );
              }}>
              <ProducerCard
                name={profile.name}
                avatar={profile.avatar}
                email={profile.email}
                phoneNumber={profile.phoneNumber}
                address={profile.address}
                city={profile.city}
                isProducer={profile.isProducer}
              />
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={{alignItems: 'center'}}>
          <ScrollView style={styles.Background}>
            <Text
              style={{
                color: '#E56033',
                fontFamily: 'Outfit-Bold',
                fontSize: 20,
                textAlign: 'center',
                marginTop: '10%',
              }}>
              My Partners
            </Text>
            {filterPartners(search).map(profile => (
              <TouchableOpacity
                key={profile._id}
                onPress={() => {
                  FetchProfile(
                    profile._id,
                    profile.name,
                    profile.avatar,
                    profile.email,
                    profile.phoneNumber,
                    profile.address,
                    profile.city,
                    profile.isProducer,
                  );
                }}>
                <ProducerCard
                  name={profile.name}
                  avatar={profile.avatar}
                  email={profile.email}
                  phoneNumber={profile.phoneNumber}
                  address={profile.address}
                  city={profile.city}
                  isProducer={profile.isProducer}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={{marginTop: '10%'}}>
            <View>
              {connectionReq.length > 0 ? (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#E56033',
                      fontFamily: 'Outfit-Bold',
                      fontSize: 20,
                      textAlign: 'center',
                      marginTop: '10%',
                    }}>
                    Partner Requests
                  </Text>
                  {connectionReq.map(profile => (
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
                      <PartnerRequestCard
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
            </View>
          </ScrollView>
        </View>
      )}

      <View style={{height: 130}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
  },
});

export default Partners;
