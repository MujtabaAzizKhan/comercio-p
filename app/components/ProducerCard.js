import 'react-native-gesture-handler';
import React from 'react';
import {Text, View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Mobile, Shop, TruckFast} from 'iconsax-react-native';

const ProducerCard = ({
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
  return (
    // <TouchableOpacity onPress={() => navigation.navigate('ViewProfile', {id})}>

    <View
      style={{
        width: 320,
        height: 150,
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
    </View>
  );
};

const styles = StyleSheet.create({
  AddProducerButton: {
    width: 160,
    height: 50,
    marginTop: '5%',
    marginLeft: '-2%',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#393840',
    alignItems: 'center',
    justifyContent: 'center',
  },
  AddProducerText: {
    fontSize: 17,
    fontFamily: 'Outfit-Regular',
    color: '#CB8D78',
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

export default ProducerCard;