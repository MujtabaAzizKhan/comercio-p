import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import client from '../api/client';
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

const initialValuesSignIn = {
  email: '',
  password: '',
};

const validationSchemaSignIn = yup.object({
  email: yup.string().email('Invalid email!').required('Email is missing!'),
  password: yup
    .string()
    .trim()
    .min(8, 'Invalid Password')
    .required('Password is missing!'),
});

const SignInScreen = ({navigation}) => {
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  const handleSignin = async (values, formikActions) => {
    const res = await signin(values);
    formikActions.setSubmitting(false);
    if (!res.success) {
      return updateNotification(setMessage, res.error);
    }

    if (res.isProducer == false) {
      const cartData = {products: []};
      const cart = await client.post(`/cart/create/${res.id}`, cartData);
    }
    formikActions.resetForm();
    navigation.dispatch(
      StackActions.replace('Tab Drawer', {profile: res.user}),
    );
    console.log(res);
  };
  return (
    <ScrollView style={styles.Background}>
      <View style={{marginLeft: '5%', marginTop: '5%'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
        {message.text ? (
          <AppNotification type={message.type} text={message.text} />
        ) : null}
      </View>

      <View
        style={{
          margin: '5%',
          marginLeft: '10%',
        }}>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Bold', fontSize: 37}}>
          Let's sign you in.
        </Text>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Light', fontSize: 37}}>
          Welcome back. You've been missed!
        </Text>
      </View>

      <Formik
        initialValues={initialValuesSignIn}
        validationSchema={validationSchemaSignIn}
        onSubmit={handleSignin}>
        {({
          errors,
          values,
          touched,
          handleBlur,
          handleSubmit,
          handleChange,
        }) => {
          console.log(errors, values);
          return (
            <>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: '8%',
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Outfit-Regular',
                    color: '#f6091c',
                    paddingBottom: 2,
                    alignSelf: 'flex-start',
                    marginLeft: '10%',
                  }}>
                  {touched.email && errors.email ? errors.email : ''}
                </Text>
                <View style={{marginBottom: '4%'}}>
                  <TextInput
                    style={{
                      width: 313,
                      height: 50,
                      padding: 13,
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
                    placeholder={'Email or username'}
                    placeholderTextColor={'#CB8D78'}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: 'Outfit-Regular',
                    color: '#f6091c',
                    paddingBottom: 2,
                    alignSelf: 'flex-start',
                    marginLeft: '10%',
                  }}>
                  {touched.password && errors.password ? errors.password : ''}
                </Text>
                <View>
                  <TextInput
                    style={{
                      width: 313,
                      height: 50,
                      padding: 13,
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
                    placeholder={'Password'}
                    placeholderTextColor={'#CB8D78'}
                    secureTextEntry={true}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: 15,
                  marginTop: '50%',
                }}
                onPress={() => navigation.navigate('Sign up Screen')}>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 18,
                  }}>
                  Don't have an account?{' '}
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 18,
                  }}>
                  Register
                </Text>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: '10%',
                }}>
                <TouchableOpacity onPress={handleSubmit}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      width: 313,
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
                      Sign in
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </>
          );
        }}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default SignInScreen;
