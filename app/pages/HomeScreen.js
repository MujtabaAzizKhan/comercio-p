import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
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
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  RefreshControl,
  Keyboard,
  SafeAreaView,
} from 'react-native';

import {
  Camera,
  useCameraDevice,
  useCodeScanner,
  // verificationCodeData,
  // source,
  // scanCodeFromScanIcon,
  // scanCodeFromBindButton,
} from 'react-native-vision-camera';
import {set} from 'mongoose';

// import AntDesign from 'react-native-vector-icons/AntDesign';
// import {Formik} from 'formik';
// import * as yup from 'yup';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const HomeScreen = ({navigation}) => {
  const [search, setSearch] = useState('');
  const [profiles, setProfiles] = useState([]);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [isSearchingProducer, setIsSearchingProducer] = useState(true);

  const [userData, setUserData] = useState({});
  const [isProducer, setIsProducer] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const [recommendation, setRecommendation] = useState([]);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);
        setIsProducer(retrievedData.isProducer);

        // Call getHistory if the user is not a producer
        if (!retrievedData.isProducer) {
          getHistory();
        }
      }
    } catch (error) {
      console.error('Error fetching the user:', error);
      console.error('Error response:', error.response);
    }
  };

  const getHistory = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        // Get the shopping history of the user
        const res = await client.get(`/history/${retrievedData.id}`);

        console.log(res.data);

        // Get all the brands of the products in the history
        const historyBrands = res.data[0].history.flatMap(historyItem =>
          historyItem.products.map(product => product.product.brand),
        );
        //console.log(historyBrands);

        // Get the unique brands from the history
        const uniqueHistoryBrands = [...new Set(historyBrands)];
        console.log(uniqueHistoryBrands);

        const brands = uniqueHistoryBrands;

        const res1 = await client.post(
          `/product/getByBrand/${retrievedData.id}`,
          {
            brand: brands,
          },
        );
        const limitedData = res1.data.slice(0, 6);

        setRecommendation(limitedData);
        console.log(limitedData);
      }
    } catch (error) {
      console.error('Error fetching the history:', error);
      console.error('Error response:', error.response);
    }
  };

  const filterProfiles = search => {
    return profiles.filter(profile =>
      profile.name.toLowerCase().includes(search.toLowerCase()),
    );
  };

  const getProducers = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      // console.log(retrievedData.id)

      const dataBody = {
        userId: retrievedData.id,
      };

      await client

        .post('/user/producers', dataBody)

        .then(function (response) {
          const responseData = response.data;
          setProfiles(responseData);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const FetchProfile = async (
    id,
    name,
    avatar,
    email,
    phoneNumber,
    address,
    city,
    isProducer,
  ) => {
    const profileData = {
      id: id,
      name: name,
      avatar: avatar,
      email: email,
      phoneNumber: phoneNumber,
      address: address,
      city: city,
      isProducer: isProducer,
    };

    navigation.navigate('DisplayProfile', {data: profileData});
  };

  const setRole = () => {
    setIsSearchingProducer(!isSearchingProducer);
  };

  const listCategories = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      const retrievedData = JSON.parse(readData);
      // console.log(retrievedData.id)

      const userId = retrievedData.id;

      const res = await client.get('/category/categories');
      const categories = res.data;
      const productData = {};

      for (const category of categories) {
        const productRes = await client.get(
          `/user/products-by-producer?userId=${userId}&categoryId=${category._id}`,
        );
        //This function up here is basically the getProductsByProducer function. Had to place it here for all the logic to work properly.

        productData[category.name] = productRes.data;
      }
      setCategories(categories);

      setProducts(productData);
      // console.log(categories);
      // console.log(productData);
    } catch (error) {
      console.error('Error fetching categories and products:', error);
    }
  };

  useEffect(() => {
    try {
      if (isSearchingProducer == true) {
        getProducers();
      } else {
        // getProducts();
        listCategories();
      }
    } catch (error) {
      console.log(error);
    }
  }, [isSearchingProducer]);

  return (
    <SafeAreaView>
      <View style={styles.Background}>
        <ScrollView nestedScrollEnabled={true} style={styles.Background}>
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
                marginRight: '40%',
                marginLeft: '-5%',
              }}>
              COMERCIO
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart Screen')}>
              <Image
                source={require('../../assets/images/ShoppingCart.png')}
                style={{height: 25, width: 25}}
              />
            </TouchableOpacity>
          </View>

          {isSearchingProducer ? (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: '8%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setRole();
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                  }}>
                  Products
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setRole();
                }}>
                <Text
                  style={{
                    color: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                  }}>
                  Producers
                </Text>
                <View style={{height: '4%', backgroundColor: '#E56033'}} />
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginTop: '8%',
              }}>
              <TouchableOpacity
                onPress={() => {
                  setRole();
                }}>
                <Text
                  style={{
                    color: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                  }}>
                  Products
                </Text>
                <View style={{height: '4%', backgroundColor: '#E56033'}} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setRole();
                }}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                  }}>
                  Producers
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{alignItems: 'center'}}>
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
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('HomeScreenBarcode');
                  }}>
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

          {isSearchingProducer ? (
            <View style={{marginTop: '1%', alignItems: 'center'}}>
              {filterProfiles(search).map(profile => (
                <TouchableOpacity
                  key={profile._id}
                  onPress={() => {
                    FetchProfile(
                      profile._id,
                      profile.name,
                      profile.avatar,
                      profile.email,
                      profile.phoneNumber,
                      profile.address,
                      profile.city,
                      profile.isProducer,
                    );
                  }}>
                  <ProducerCard
                    name={profile.name}
                    avatar={profile.avatar}
                    email={profile.email}
                    phoneNumber={profile.phoneNumber}
                    address={profile.address}
                    city={profile.city}
                    isProducer={profile.isProducer}
                  />
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={{marginBottom: '22%'}}>
              {Object.entries(products).map(([categoryName, products]) => {
                // Filter products within the category
                const filteredProducts = products.filter(product =>
                  product.name.toLowerCase().includes(search.toLowerCase()),
                );

                // If there are matching products then category is rendered otherwise not.
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
          )}
          {/* Recommendations */}
          {recommendation.length > 0 ? (
            <View
              style={{
                alignItems: 'center',
                marginTop: '5%',
              }}>
              <View
                style={{
                  width: '85%',
                }}>
                <Text
                  style={{
                    color: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 20,
                    marginBottom: '5%',
                  }}>
                  Recommended For You
                </Text>
                <View
                  style={{
                    marginBottom: '5%',
                    width: '100%',
                    backgroundColor: '#E56033',
                    height: '0.25%',
                  }}
                />
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  {recommendation.map(product => (
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
          ) : null}

          <View style={{height: 150}}></View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default HomeScreen;
