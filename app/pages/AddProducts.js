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
import {NavigationContainer, StackActions} from '@react-navigation/native';

const AddProducts = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add Products</Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
          }}>
          <TouchableOpacity style={styles.buttonOrange}>
            <Text style={styles.buttonOrangeText}>Manual Entry</Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 40,
            marginBottom: 50,
          }}>
          <TouchableOpacity style={styles.buttonWhite}>
            <Text style={styles.buttonWhiteText}>Via Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* <ImageBackground source={require('./images/brownhue.png')} resizeMode="cover" style={styles.image} >
  
          </ImageBackground> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  titleContainer: {
    fontFamily: 'Outfit-Regular',
    minHeight: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white',
  },
  title2: {
    marginLeft: 56,
    fontFamily: 'outfit',
    textAlign: 'left',
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
  },
  buttonOrange: {
    justifyContent: 'center',
    height: 100,
    backgroundColor: '#E56033',
    width: 261,
    borderRadius: 18,
  },
  buttonOrangeText: {
    fontFamily: 'Outfit-Regular',
    marginLeft: 20,
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '700',
    color: 'white',
  },
  buttonWhite: {
    justifyContent: 'center',
    height: 100,
    backgroundColor: 'white',
    width: 261,
    borderRadius: 18,
  },
  buttonWhiteText: {
    fontFamily: 'Outfit-Regular',
    marginLeft: 20,
    fontSize: 22,
    textAlign: 'left',
    fontWeight: '700',
    color: 'black',
  },
});

export default AddProducts;
