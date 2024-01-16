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

import AppNotification from '../components/AppNotification';
import {signin, signup, verifyEmail} from '../utils/auth';
import {updateNotification} from '../utils/helper';

const OTPScreen = ({navigation, route}) => {
  const {profile} = route.params;
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  const [firstNum, setFirstNum] = useState('');
  const [secondNum, setSecondNum] = useState('');
  const [thirdNum, setThirdNum] = useState('');
  const [fourthNum, setFourthNum] = useState('');

  const otpVerify = firstNum + secondNum + thirdNum + fourthNum;
  const submitOTP = async () => {
    Keyboard.dismiss();
    const res = await verifyEmail(otpVerify, profile.id);
    console.log(typeof profile.id);
    console.log(res);
    if (!res.success) {
      return updateNotification(setMessage, res.error);
    }
    navigation.dispatch(
      StackActions.replace('ChoiceScreen', {profile: res.user}),
    );
  };

  return (
    <View style={styles.Background}>
      <View style={{marginLeft: '5%', marginTop: '5%'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
      </View>
      {message.text ? (
        <AppNotification type={message.type} text={message.text}>
          <Text />
        </AppNotification>
      ) : null}

      <View
        style={{
          margin: '5%',
          marginLeft: '13%',
        }}>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Bold', fontSize: 37}}>
          Enter OTP
        </Text>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Light', fontSize: 20}}>
          A 4-digit code has been sent to
        </Text>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Light', fontSize: 20}}>
          your email.
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{margin: '2%'}}>
          <TextInput
            style={{
              width: 54,
              height: 47,
              padding: 13,
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
            }}
            placeholder={'1'}
            placeholderTextColor={'#CB8D78'}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={setFirstNum}
          />
        </View>
        <View style={{margin: '2%'}}>
          <TextInput
            style={{
              width: 54,
              height: 47,
              padding: 13,
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
            }}
            placeholder={'3'}
            placeholderTextColor={'#CB8D78'}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={setSecondNum}
          />
        </View>
        <View style={{margin: '2%'}}>
          <TextInput
            style={{
              width: 54,
              height: 47,
              padding: 13,
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
            }}
            placeholder={'3'}
            placeholderTextColor={'#CB8D78'}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={setThirdNum}
          />
        </View>
        <View style={{margin: '2%'}}>
          <TextInput
            style={{
              width: 54,
              height: 47,
              padding: 13,
              textAlign: 'center',
              fontSize: 16,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
            }}
            placeholder={'7'}
            placeholderTextColor={'#CB8D78'}
            maxLength={1}
            keyboardType="numeric"
            onChangeText={setFourthNum}
          />
        </View>
      </View>
      {/* <TouchableOpacity>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            margin: 15,
            marginTop: '5%',
            marginRight: '14%',
          }}>
          <Text
            style={{
              color: '#CB8D78',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
            }}>
            Resend OTP!
          </Text>
        </View>
      </TouchableOpacity> */}

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: '80%',
        }}>
        <TouchableOpacity onPress={submitOTP}>
          <View
            style={{
              backgroundColor: 'white',
              width: 285,
              height: 50,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#393840',
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
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

export default OTPScreen;
