import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';

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

const WelcomeScreen = ({navigation}) => {
  return (
    <View style={styles.Background}>
      <View style={styles.WelcomeContainer}>
        <Text style={styles.Headings}>Comercio</Text>
        <Text style={styles.SubHeadings}>
          The most innovative marketplace. Everything available at your
          fingertips.
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-start',
          marginBottom: '10%',
        }}>
        <TouchableOpacity onPress={() => navigation.navigate('Sign in Screen')}>
          <View
            style={{
              backgroundColor: '#3B3A41',
              width: 150,
              height: 50,
              padding: 10,
              borderTopRightRadius: 10,
              borderBottomRightRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: '50%',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 16,
              }}>
              Sign in
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: 'white',
            width: 150,
            height: 50,
            padding: 10,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            left: 50,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Sign up Screen')}>
            <Text
              style={{
                color: '#393840',
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  //Welcome Screen
  Headings: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Bold',
    fontSize: 30,
  },
  SubHeadings: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Light',
    fontSize: 22,
  },
  WelcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    margin: 12,
    marginTop: '-30%',
  },
});

export default WelcomeScreen;
