import 'react-native-gesture-handler';
import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Mobile, Shop, TruckFast} from 'iconsax-react-native';
import EncryptedStorage from 'react-native-encrypted-storage';
import client from '../api/client';

const DistributorCard = ({
  id,
  name,
  avatar,
  email,
  phoneNumber,
  address,
  city,
  isProducer,
}) => {
  if (address == '') {
    address = 'Unknown';
  }
  if (phoneNumber == '') {
    phoneNumber = 'Unknown';
  }

  const navigation = useNavigation();

  const acceptConnection = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      //   console.log(retrievedData.id);
      //   console.log(id);

      const connectionData = {
        userID: retrievedData.id,
        // userName: retrievedData.name,
        connectionID: id,
        // connectedUserName: displayName,
        // status: 'pending',
      };

      // console.log(connectionData.userId);
      // console.log(connectionData.connectedUserId);

      await client
        .post('/user/acceptConnection', connectionData)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const rejectConnection = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      //   console.log(retrievedData.id);
      //   console.log(id);

      const connectionData = {
        userID: retrievedData.id,
        // userName: retrievedData.name,
        connectionID: id,
        // connectedUserName: displayName,
        // status: 'pending',
      };

      // console.log(connectionData.userId);
      // console.log(connectionData.connectedUserId);

      await client
        .post('/user/rejectConnection', connectionData)
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    // <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', {id})}>

    <View
      style={{
        width: 320,
        height: 225,
        padding: 13,
        borderWidth: 1,
        borderColor: '#393840',
        borderRadius: 10,
        margin: 10,
      }}>
      <View style={{flexDirection: 'row'}}>
        <Image
          style={{
            height: 110,
            width: 110,
            borderRadius: 50,
            marginLeft: '-2%',
            marginTop: '2%',
          }}
          source={{
            uri:
              avatar ||
              'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
          }}
        />

        <View style={{flex: 1, marginLeft: '10%', marginRight: '1%'}}>
          <View style={{flexDirection: 'row', marginLeft: '-2%'}}>
            {isProducer ? (
              <Shop size="25" color="#E56033" />
            ) : (
              <TruckFast size="25" color="#E56033" />
            )}

            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 16,
                marginLeft: '2%',
              }}>
              {name}
            </Text>
          </View>
          <View style={{flexDirection: 'row', marginTop: '4%'}}>
            <Mobile size="25" color="#E56033" />
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 16,
              }}>
              {phoneNumber}
            </Text>
          </View>

          <View style={{flexDirection: 'row', marginTop: '3%'}}>
            <Octicons
              style={{marginTop: '1%'}}
              name={'location'}
              size={21}
              color={'#E56033'}
            />
            <Text style={styles.AddressText}>
              {address}, {city}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            acceptConnection();
          }}
          style={styles.AddDistributorButton}>
          <Text style={styles.AddDistributorText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            rejectConnection();
          }}
          style={styles.RejectDistributorButton}>
          <Text style={styles.RejectDistributorText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  AddDistributorButton: {
    width: 135,
    height: 50,
    marginTop: '5%',
    marginRight: '3%',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E56033',
    alignItems: 'center',
    justifyContent: 'center',
  },
  RejectDistributorButton: {
    width: 135,
    height: 50,
    marginTop: '5%',
    marginLeft: '3%',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  AddDistributorText: {
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
    color: '#E56033',
  },
  RejectDistributorText: {
    fontSize: 15,
    fontFamily: 'Outfit-Regular',
    color: 'red',
  },
  AddressText: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Bold',
    fontSize: 16,
    overflow: 'hidden',
    marginLeft: '4%',
  },
  // AcceptButton: {
  //     width: 90,
  //     height: 50,
  //     margin: '2%',
  //     textAlign: 'center',
  //     borderRadius: 10,
  //     borderWidth: 1,
  //     borderColor: '#393840',
  //     backgroundColor: '#E56033',
  //     alignItems: 'center',
  //     justifyContent: 'center',
  // },
  // AcceptButtonText: {
  //     fontSize: 16,
  //     fontFamily: 'Outfit-Regular',
  //     color: '#FFFFFF',
  // },
});

export default DistributorCard;
