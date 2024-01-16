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
import NumericInput from 'react-native-numeric-input';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const AddToHistoryManually = ({navigation}) => {
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [value, setValue] = useState(null);
  const [value1, setValue1] = useState(null);
  const [value2, setValue2] = useState(null);
  const [items, setItems] = useState([
    {label: 'Sneakers', value: 'sneakers'},
    {label: 'T-Shirts', value: 'tshirts'},
  ]);
  const [items1, setItems1] = useState([
    {label: 'One', value: 'one'},
    {label: 'Breakout', value: 'breakout'},
  ]);

  return (
    <View style={{flex: 1, backgroundColor: 'black'}}>
      <ScrollView>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Add To History</Text>
          <Text style={{color: 'white', marginTop: 4}}>
            Provide all the information about the History
          </Text>
        </View>

        <View style={{marginTop: 50}}>
          <Text style={styles.title2}>Product Name</Text>
          <TextInput
            placeholderTextColor={'black'}
            style={styles.addManuallyTextSlim}
            placeholder="Nike Air Jordan"
          />
        </View>

        <View style={{marginTop: 70}}>
          <Text style={styles.title2}>Category</Text>
          <DropDownPicker
            style={styles.dropDown}
            dropDownContainerStyle={{
              backgroundColor: '#E56033',
              maxWidth: 288,
              marginLeft: 56,
            }}
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
          />
        </View>

        <View style={{marginTop: 70}}>
          <Text style={styles.title2}>Brand</Text>
          <DropDownPicker
            style={styles.dropDown}
            dropDownContainerStyle={{
              backgroundColor: '#E56033',
              maxWidth: 288,
              marginLeft: 56,
            }}
            open={open1}
            value={value1}
            items={items1}
            setOpen={setOpen1}
            setValue={setValue1}
            setItems={setItems1}
          />
        </View>

        <View style={{marginTop: 70}}>
          <Text style={styles.title2}>Description</Text>
          <TextInput
            placeholderTextColor={'black'}
            style={styles.addManuallyTextLarge}
          />
        </View>

        <TouchableOpacity>
          <View
            style={{
              height: 40,
              width: 40,
              marginTop: 20,
              backgroundColor: '#E56033',
              borderRadius: 50,
              marginLeft: 330,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: 30,
                marginBottom: 12,
                justifyContent: 'center',
              }}>
              +
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            flexDirection: 'row',
            marginTop: 70,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'outfit',
              textAlign: 'left',
              fontSize: 18,
              fontWeight: 'bold',
              color: 'white',
              marginRight: 10,
            }}>
            Quantity
          </Text>
          <NumericInput
            value={value2}
            onChange={setValue2 => value2}
            totalWidth={200}
            totalHeight={50}
            iconSize={30}
            step={1}
            borderColor={'#E56033'}
            separatorWidth={1}
            minValue={1}
            valueType="real"
            textColor="white"
            iconStyle={{color: 'white'}}
            rightButtonBackgroundColor="#E56033"
            leftButtonBackgroundColor="#E56033"
          />
        </View>

        <TouchableOpacity>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: 275,
              marginTop: 60,
              height: 63,
              borderRadius: 50,
              marginLeft: 'auto',
              marginRight: 'auto',
              backgroundColor: 'transparent',
              borderWidth: 3,
              borderColor: '#E56033',
            }}>
            <Text style={{color: 'white', fontSize: 20, fontWeight: '600'}}>
              Add To History
            </Text>
          </View>
        </TouchableOpacity>
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
  addManuallyTextSlim: {
    padding: 10,
    marginLeft: 56,
    width: '73%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
    backgroundColor: '#F2F2F2',
  },
  addManuallyTextLarge: {
    padding: 10,
    marginLeft: 56,
    width: '73%',
    height: 100,
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
    backgroundColor: '#F2F2F2',
  },
  dropDown: {
    padding: 10,
    marginLeft: 56,
    width: '73%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 4,
    marginTop: 10,
    fontFamily: 'Outfit-Regular',
    backgroundColor: '#F2F2F2',
  },
});

export default AddToHistoryManually;
