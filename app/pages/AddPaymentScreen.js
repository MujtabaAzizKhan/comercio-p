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
} from 'react-native';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {NavigationContainer, StackActions} from '@react-navigation/native';

const AddPaymentScreen = ({navigation}) => {
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
            marginLeft: '10%',
            marginTop: '-1%',
          }}>
          Add Payment Method
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
          Provide your credit card information
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
            width: '67%',
            height: '17%',
            marginTop: '10%',
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-SemiBold',
              fontSize: 16,
            }}>
            Card number
          </Text>
          <View
            style={{
              height: 41,
              width: 261,
              borderWidth: 1,
              borderColor: '#393840',
              borderRadius: 67,
              marginTop: '3%',
              justifyContent: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={require('../../assets/images/Mastercard.png')}
                style={{
                  height: 25,
                  width: 45,
                  marginLeft: '4%',
                }}
              />
              <TextInput
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 13,
                  marginLeft: '4.5%',
                  marginRight: '1%',
                  width: '65%',
                }}
                placeholder={'3254-6754-0001-5654'}
                placeholderTextColor={'#FFFFFF'}
                inputMode={'numeric'}
                maxLength={16}
              />
              <Ionicons name={'ios-keypad-outline'} size={12} color={'white'} />
            </View>
          </View>
        </View>
        <View
          style={{
            width: '67%',
            height: '15%',
          }}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-SemiBold',
                fontSize: 16,
                marginRight: '38%',
              }}>
              Expiration date
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-SemiBold',
                fontSize: 16,
              }}>
              CVV
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: '3%',
            }}>
            <View
              style={{
                height: 41,
                width: 65,
                borderWidth: 1,
                borderColor: '#393840',
                borderRadius: 67,
                marginTop: '3%',
                justifyContent: 'center',
                marginRight: '4%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 13,
                    marginLeft: '4%',
                  }}
                  placeholder={'05'}
                  placeholderTextColor={'#FFFFFF'}
                  inputMode={'numeric'}
                  maxLength={2}
                />
                <View style={{marginLeft: '8%'}}>
                  <SimpleLineIcons name={'arrow-up'} size={6} color={'white'} />
                  <SimpleLineIcons
                    name={'arrow-down'}
                    size={6}
                    color={'white'}
                    style={{marginTop: '-10%'}}
                  />
                </View>
              </View>
            </View>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
                marginTop: '7%',
                marginRight: '4%',
              }}>
              /
            </Text>
            <View
              style={{
                height: 41,
                width: 86,
                borderWidth: 1,
                borderColor: '#393840',
                borderRadius: 67,
                marginTop: '3%',
                justifyContent: 'center',
                marginRight: '7%',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 13,
                    marginLeft: '4%',
                  }}
                  placeholder={'2027'}
                  placeholderTextColor={'#FFFFFF'}
                  inputMode={'numeric'}
                  maxLength={4}
                />
                <View style={{marginLeft: '8%'}}>
                  <SimpleLineIcons name={'arrow-up'} size={6} color={'white'} />
                  <SimpleLineIcons
                    name={'arrow-down'}
                    size={6}
                    color={'white'}
                    style={{marginTop: '-10%'}}
                  />
                </View>
              </View>
            </View>
            <View
              style={{
                height: 41,
                width: 65,
                borderWidth: 1,
                borderColor: '#393840',
                borderRadius: 67,
                marginTop: '3%',
                justifyContent: 'center',
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <TextInput
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 13,
                    marginLeft: '4%',
                  }}
                  placeholder={'843'}
                  placeholderTextColor={'#FFFFFF'}
                  inputMode={'numeric'}
                  maxLength={3}
                />
                <TouchableOpacity>
                  <Ionicons
                    name={'ios-keypad-outline'}
                    size={12}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity>
          <View
            style={{
              width: 261,
              height: 50,
              marginTop: '20%',
              borderRadius: 51,
              borderWidth: 1,
              borderColor: '#E56033',
              backgroundColor: '#E56033',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#FFFFFF',
                fontSize: 16,
              }}>
              Submit
            </Text>
          </View>
        </TouchableOpacity>
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

export default AddPaymentScreen;
