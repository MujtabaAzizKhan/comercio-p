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
  Modal,
  ActivityIndicator,
} from 'react-native';
import 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';

const ShoppingHistory = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const {image} = route.params;
  useEffect(() => {
    Image.prefetch(image).then(() => setIsLoading(false));
  }, [image]);
  return (
    <ScrollView
      style={{
        backgroundColor: '#101010',
      }}>
      <View style={{marginLeft: '5%', marginTop: '5%', flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() =>
            navigation.dispatch(StackActions.replace('ShoppingHistory'))
          }>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-SemiBold',
            fontSize: 24,
            marginLeft: '28%',
            marginTop: '-1%',
          }}>
          RECEIPT
        </Text>
      </View>

      <View
        style={{
          marginVertical: '2%',
          width: '100%',
          backgroundColor: '#E56033',
          height: '0.25%',
        }}
      />
      {isLoading ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '80%',
          }}>
          <ActivityIndicator color="white" />
        </View>
      ) : (
        <View style={{backgroundColor: '#101010', width: '100%', height: 800}}>
          {image && (
            <Image
              source={{
                uri: image,
              }}
              style={{
                width: '100%',
                height: '100%',
                marginTop: 10,
              }}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
};

export default ShoppingHistory;
