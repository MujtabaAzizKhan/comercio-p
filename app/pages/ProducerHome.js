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
import {useRoute} from '@react-navigation/native';
import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';

import ProducerCard from '../components/ProducerCard';
import Product from '../components/Product';

import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  RefreshControl,
  StyleSheet,
  ImageBackground,
  Keyboard,
  Pressable,
} from 'react-native';

const ProducerHome = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isRefreshing, setRefreshing] = useState(false);

  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [search, setSearch] = useState('');

  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);

  const listCategories = async userId => {
    try {
      const res = await client.get('/category/categories');
      const categories = res.data;
      const productData = {};
      // console.log(categories);

      for (const category of categories) {
        const productRes = await client.get(
          `/product/listByCat/isPublished/${category._id}/${userId}`,
        );
        productData[category.name] = productRes.data;
      }

      setCategories(categories);
      setProduct(productData);
      // console.log(productData + 'Yeh sab');
    } catch (error) {
      console.error('Error fetching categories and products:', error);
    }
  };

  const getUser = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      setUserData(retrievedData);

      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // If userData is successfully set, call listCategories
        await listCategories(retrievedData.id);
      }
    } catch (error) {
      console.error('Error in getUser:', error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a refresh action (you can replace this with your data fetching logic)
    setTimeout(() => {
      setRefreshing(false);
    }, 500); // Simulate a 1-second refresh
  };

  const route = useRoute();

  useEffect(() => {
    getUser();
    // console.log('Testing');
  }, [isRefreshing, navigation, route.params?.key]);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      nestedScrollEnabled={true}
      style={styles.Background}>
      <View
        style={{
          marginLeft: '5%',
          marginTop: '5%',
          flexDirection: 'row',
          justifyContent: 'space-around',
        }}>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Bold',
            fontSize: 22,
            marginRight: '65%',
            //marginLeft: '-5%',
          }}>
          COMERCIO
        </Text>
        {/* <TouchableOpacity onPress={() => navigation.navigate('Cart Screen')}>
          <Image
            source={require('../../assets/images/ShoppingCart.png')}
            style={{height: 25, width: 25}}
          />
        </TouchableOpacity> */}
      </View>

      <View style={{alignItems: 'center', marginTop: '4%'}}>
        <View
          style={{
            height: 50,
            width: 356,
            borderWidth: 1,
            borderColor: '#393840',
            backgroundColor: '#242222',
            borderRadius: 67,
            justifyContent: 'center',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
                marginLeft: '4.5%',
                marginRight: '5%',
                width: '65%',
              }}
              placeholder={'Search'}
              placeholderTextColor={'#FFFFFF'}
              maxLength={16}
              onChangeText={setSearch}
            />
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/Barcode.png')}
                style={{
                  height: 24,
                  width: 24,
                  marginHorizontal: '3%',
                }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Image
                source={require('../../assets/images/Search.png')}
                style={{
                  height: 24,
                  width: 24,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View
        style={{
          justifyContent: 'center',
          marginTop: '4%',
        }}>
        <Text
          style={{
            color: '#E56033',
            fontFamily: 'Outfit-Bold',
            fontSize: 20,
            textAlign: 'center',
          }}>
          My Products
        </Text>
      </View>
      <View
        style={{
          marginTop: '2%',
          width: '100%',
          backgroundColor: '#E56033',
          height: '0.1%',
        }}
      />

      <View style={{marginBottom: '22%'}}>
        {Object.entries(product).map(([categoryName, products]) => {
          const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()),
          );
          if (filteredProducts.length > 0) {
            return (
              <View
                style={{
                  alignItems: 'center',
                }}
                key={categoryName}>
                <View
                  style={{
                    width: '85%',
                  }}>
                  <Text
                    style={{
                      color: '#FFFFFF',
                      fontFamily: 'Outfit-Regular',
                      fontSize: 20,
                      marginVertical: '5%',
                    }}>
                    {categoryName}
                  </Text>
                  <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                    {filteredProducts.map(product => (
                      <Product
                        key={product._id}
                        name={product.name}
                        avatar={product.avatar}
                        price={product.price}
                        id={product._id}
                        isPublished={product.isPublished}
                      />
                    ))}
                  </View>
                </View>
              </View>
            );
          } else {
            return null; // Category is not rendered if no matching products
          }
        })}
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

export default ProducerHome;

// const getDistributors = async () => {

//     try {
//         const readData = await EncryptedStorage.getItem('user');
//         const retrievedData = JSON.parse(readData);
//         // console.log(retrievedData.id)

//         const dataBody = {
//             userId: retrievedData.id,
//         };

//         await client.post('/user/distributors', dataBody)
//             .then(function (response) {
//                 const responseData = response.data
//                 setProfiles(responseData)

//             })
//             .catch(function (error) {
//                 console.log(error);
//             });

//     } catch (error) {
//         console.error('Error updating user data:', error);
//     }
// }

{
  /* {profiles.map(profiles => (
                    // <ProfileTab onPress={()=>{FetchProfile()}}
                    <TouchableOpacity onPress={() => { FetchProfile(profiles._id, profiles.name, profiles.email, profiles.phoneNumber, profiles.address, profiles.city,) }}>
                        <ProducerCard
                            key={profiles._id}
                            name={profiles.name}
                            email={profiles.email}
                            address={profiles.address}
                            city={profiles.city}
                        />
                    </TouchableOpacity>
                ))} */
}
