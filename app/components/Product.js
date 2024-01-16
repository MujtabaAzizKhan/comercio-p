import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Product = ({name, avatar, price, id, isPublished}) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ProductPage', {id, isPublished})}>
      <View
        style={{
          backgroundColor: '#000000',
          height: 105,
          width: 100,
          borderRadius: 7,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: '1.5%',
          marginBottom: '10%',
        }}>
        <Image
          source={{
            uri:
              avatar ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/MacOS_prohibitory_symbol.svg/2048px-MacOS_prohibitory_symbol.svg.png',
          }}
          style={{height: 50, width: 60}}
        />
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Bold',
              fontSize: 10,
            }}>
            {name}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 8,
                marginTop: '2.25%',
              }}>
              Rs.
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 10,
                marginTop: '.5%',
              }}>
              {' '}
              {price}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default Product;

{
  /* <TouchableOpacity>
      <View
        style={{
          backgroundColor: '#000000',
          height: 105,
          width: 100,
          borderRadius: 7,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: '1.5%',
          marginBottom: '10%',
        }}>
        <Image
          source={require('../../assets/images/pc.png')}
          style={{height: 50, width: 60}}
        />
        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Bold',
              fontSize: 10,
            }}>
            Gaming PC
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Regular',
              fontSize: 10,
              marginTop: '-3.5%',
            }}>
            Rs 5,00,000
          </Text>
        </View>
      </View>
    </TouchableOpacity> */
}
