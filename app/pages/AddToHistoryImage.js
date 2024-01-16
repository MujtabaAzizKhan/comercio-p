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
import {NavigationContainer, StackActions} from '@react-navigation/native';

const AddToHistoryImage = ({navigation}) => {
  return (
    <View style={styles.Background}>
      <View style={{marginLeft: '5%', marginTop: '5%'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
      </View>

      <Text
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          color: '#FFFFFF',
          fontFamily: 'Outfit-SemiBold',
          fontSize: 24,
          marginTop: '5%',
        }}>
        Add To History
      </Text>

      <View
        style={{
          height: 490,
          width: 317,
          marginLeft: 'auto',
          marginRight: 'auto',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
          backgroundColor: 'white',
          marginTop: 20,
          borderRadius: 18,
        }}>
        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 16,
            marginTop: 330,
            maxWidth: 250,
            textAlign: 'center',
          }}>
          Take a picture of receipt to add to history or upload
        </Text>
      </View>

      <TouchableOpacity>
        <View
          style={{
            height: 50,
            width: 50,
            marginTop: 20,
            backgroundColor: '#E56033',
            borderRadius: 50,
            marginLeft: 'auto',
            marginRight: 'auto',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
          }}>
          <Ionicons name={'camera-outline'} size={25} color={'black'} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default AddToHistoryImage;
