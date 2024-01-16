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
import BouncyCheckboxGroup from 'react-native-bouncy-checkbox-group';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

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

import client from '../api/client';

const ChoiceScreen = ({navigation, route}) => {
  const {profile} = route.params;
  const [checkboxState, setCheckboxState] = useState(true);
  const [checkboxStateP, setCheckboxStateP] = useState(false);

  const handleCheckbox = () => {
    if (checkboxState == true) {
      setCheckboxStateP(!checkboxStateP);
      setCheckboxState(!checkboxState);
    } else if (checkboxStateP == true) {
      setCheckboxState(!checkboxState);
      setCheckboxStateP(!checkboxStateP);
    }
  };

  const handleSubmit = async () => {
    try {
      if (checkboxStateP == true) {
        const res = await client.put(`/user/${profile.id}`, {isProducer: true});

        // const update = res.data;
        // console.log(update);
        navigation.dispatch(StackActions.replace('Sign in Screen'), {
          profile: res.user,
        });
      } else if (checkboxState == true) {
        const res = await client.put(`/user/${profile.id}`, {
          isProducer: false,
        });
        navigation.dispatch(StackActions.replace('Sign in Screen'), {
          profile: res.user,
        });
      }
    } catch (error) {
      console.error('Error updating the role:', error);
    }
  };

  return (
    <ScrollView style={styles.Background}>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            margin: '5%',
            marginLeft: '7%',
          }}>
          <Text
            style={{color: '#FFFFFF', fontFamily: 'Outfit-Bold', fontSize: 37}}>
            Select Role
          </Text>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Light',
              fontSize: 37,
            }}>
            How would you like to use your account?
          </Text>
        </View>
        <View style={{width: '85%'}}>
          <BouncyCheckbox
            size={25}
            fillColor="#CB8D78"
            disableText={false}
            unfillColor="#FFFFFF"
            text="As a Distributor"
            iconStyle={{borderColor: 'red'}}
            innerIconStyle={{borderWidth: 2}}
            textStyle={{
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
              textDecorationLine: 'none',
            }}
            style={{
              marginVertical: '2%',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              padding: 13,
            }}
            isChecked={checkboxState}
            disableBuiltInState
            onPress={handleCheckbox}
          />
          <BouncyCheckbox
            size={25}
            fillColor="#CB8D78"
            disableText={false}
            unfillColor="#FFFFFF"
            text="As a Producer"
            iconStyle={{borderColor: 'red'}}
            innerIconStyle={{borderWidth: 2}}
            textStyle={{
              fontFamily: 'Outfit-Regular',
              color: '#CB8D78',
              textDecorationLine: 'none',
            }}
            style={{
              marginVertical: '2%',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#393840',
              padding: 13,
            }}
            isChecked={checkboxStateP}
            disableBuiltInState
            onPress={handleCheckbox}
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
            marginTop: '65%',
          }}
          // onPress={() =>
          //   navigation.dispatch(StackActions.replace('Home Screen'))
          // }
          onPress={handleSubmit}>
          <Text
            style={{
              color: '#393840',
              fontFamily: 'Outfit-Bold',
              textAlign: 'center',
              fontSize: 16,
            }}>
            Proceed
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

export default ChoiceScreen;
