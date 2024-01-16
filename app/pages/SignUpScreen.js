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

const initialValuesSignUp = {
  name: '',
  email: '',
  password: '',
};

const validationSchemaSignUp = yup.object({
  name: yup.string().trim().required('Name is missing!'),
  email: yup.string().email('Invalid email!').required('Email is missing!'),
  password: yup.string().trim().min(8, 'Password is too short!'),
});

const SignUpScreen = ({navigation}) => {
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });
  const handleSignup = async (values, formikActions) => {
    const res = await signup(values);
    formikActions.setSubmitting(false);
    if (!res.success) {
      return updateNotification(setMessage, res.error);
    }
    navigation.dispatch(StackActions.replace('OTP', {profile: res.user}));
    formikActions.resetForm();
    console.log(res);
  };

  return (
    <ScrollView
      style={styles.Background}
      showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        onPress={() => navigation.dispatch(StackActions.pop(1))}>
        <View style={{marginLeft: '5%', marginTop: '5%'}}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </View>
      </TouchableOpacity>
      {message.text ? (
        <AppNotification type={message.type} text={message.text} />
      ) : null}
      <View
        style={{
          margin: '5%',
          marginLeft: '10%',
        }}>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Bold', fontSize: 37}}>
          Let's sign you up.
        </Text>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Light', fontSize: 37}}>
          Welcome.
        </Text>
        <Text
          style={{color: '#FFFFFF', fontFamily: 'Outfit-Light', fontSize: 34}}>
          A new journey starts!
        </Text>
      </View>

      <Formik
        initialValues={initialValuesSignUp}
        validationSchema={validationSchemaSignUp}
        onSubmit={handleSignup}>
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
                  marginTop: '3%',
                }}>
                <View style={{marginBottom: '4%'}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#f6091c',
                      paddingBottom: 2,
                    }}>
                    {touched.name && errors.name ? errors.name : ''}
                  </Text>
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
                    placeholder={'Name'}
                    placeholderTextColor={'#CB8D78'}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                  />
                </View>
                <View style={{marginBottom: '4%'}}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#f6091c',
                      paddingBottom: 2,
                    }}>
                    {touched.email && errors.email ? errors.email : ''}
                  </Text>
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
                    placeholder={'Email'}
                    placeholderTextColor={'#CB8D78'}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#f6091c',
                      paddingBottom: 2,
                    }}>
                    {touched.password && errors.password ? errors.password : ''}
                  </Text>
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
                onPress={() => navigation.navigate('Sign in Screen')}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: 15,
                    marginTop: '31%',
                  }}>
                  <Text
                    style={{
                      color: '#CB8D78',
                      fontFamily: 'Outfit-Regular',
                      fontSize: 18,
                    }}>
                    Already have an account?{' '}
                  </Text>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Outfit-Regular',
                      fontSize: 18,
                    }}>
                    Login
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginBottom: '10%',
                }}>
                <TouchableOpacity
                  onPress={handleSubmit}
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
                    Sign up
                  </Text>
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

export default SignUpScreen;
