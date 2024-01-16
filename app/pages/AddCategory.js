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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {addCategory} from '../utils/addCategory';
import {updateNotification} from '../utils/helper';
import AppNotification from '../components/AppNotification';

const AddCategory = ({navigation}) => {
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });

  const [name, setName] = useState('');

  const handleSubmit = async () => {
    const categoryData = {
      name: name,
    };
    const res = await addCategory(categoryData);

    if (!res.success) {
      return updateNotification(setMessage, res.error);
    }
    navigation.dispatch(
      StackActions.replace('Inventory Screen', {profile: res.user}),
    );
    console.log(res);
    console.log(name);
  };

  return (
    <View style={styles.Background}>
      <ScrollView
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}>
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
              marginLeft: '22%',
              marginTop: '-1%',
            }}>
            Add Category
          </Text>
        </View>

        <View
          style={{
            marginTop: '5%',
            marginHorizontal: '5%',
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
            Provide the name of the category
          </Text>
        </View>
        <View
          style={{
            marginTop: '2%',
            marginLeft: '17%',
            width: '66.5%',
            backgroundColor: '#E56033',
            height: '0.25%',
          }}
        />
        {message.text ? (
          <AppNotification type={message.type} text={message.text} />
        ) : null}
        <View style={{alignItems: 'center'}}>
          <View style={{width: '85%'}}>
            <View style={{marginVertical: '5%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: '#FFFFFF',
                  fontSize: 16,
                  marginBottom: '2%',
                }}>
                Category Name
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
                placeholder="Sports"
                placeholderTextColor={'grey'}
                value={name}
                onChangeText={setName}
              />
            </View>

            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={handleSubmit}>
              <View
                style={{
                  width: 261,
                  height: 50,
                  marginVertical: '5%',
                  borderRadius: 51,
                  borderWidth: 1,
                  borderColor: '#E56033',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Outfit-Regular',
                    color: '#FFFFFF',
                    fontSize: 16,
                  }}>
                  Add Category
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default AddCategory;
