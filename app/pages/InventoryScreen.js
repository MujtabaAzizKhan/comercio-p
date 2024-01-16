import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EncryptedStorage from 'react-native-encrypted-storage';
import {Formik} from 'formik';
import * as yup from 'yup';
import {ScanBarcode} from 'iconsax-react-native';

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
  Modal,
  RefreshControl,
  ImageBackground,
  Keyboard,
  Pressable,
  BackHandler,
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

import Product from '../components/Product';
import client from '../api/client';

const InventoryScreen = ({navigation}) => {
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState([]);

  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const device = useCameraDevice('back');

  const [HasCameraPermit, setHasCameraPermit] = useState();
  const [isCameraVisible, setCameraVisible] = useState(false);
  const [backButtonPressed, setBackButtonPressed] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    // Simulate a refresh action (you can replace this with your data fetching logic)
    setTimeout(() => {
      setRefreshing(false);
    }, 500); // Simulate a 1-second refresh
  };

  useEffect(() => {
    getUser();
    onAuth();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
  }, [isRefreshing, navigation]);

  const findProduct = async value => {
    // console.log(value);
    try {
      const dataBody = {
        barcodeNumber: value,
      };

      await client
        .post('/product/findProduct', dataBody)
        .then(function (response) {
          const responseData = response.data;
          // console.log(responseData + 'Response Data');
          if (response.data == null) {
            // If no data is found, call the add product function
            // console.log('null data');
            navigation.navigate('AddProductsManually', {
              code: value,
            });
          } else {
            const id = responseData._id;
            navigation.navigate('UpdateProduct', {id});
          }
          setModalVisible(false);
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  const onAuth = async () => {
    const grantedStatus = await Camera.requestCameraPermission();
    if (grantedStatus === 'granted') {
      setHasCameraPermit(true);
    } else {
      setHasCameraPermit(false);
    }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      // console.log(`Scanned ${codes.length} codes!`);
      // console.log(codes?.[0]?.value);
      // setCode(codes?.[0]?.value); //It comes in as string
      // Hide the camera when a code is scanned
      setCameraVisible(false);
      setModalVisible(true);

      findProduct(codes?.[0]?.value);
    },
  });

  const handleBackPress = () => {
    // Perform any action you want when the back button is pressed

    setCameraVisible(false);
  };

  //Under these are the inventory product functions

  const listCategories = async userId => {
    try {
      const res = await client.get('/category/categories');
      const categories = res.data;
      const productData = {};

      for (const category of categories) {
        const productRes = await client.get(
          `/product/listByCat/${category._id}/${userId}`,
        );
        productData[category.name] = productRes.data;
      }

      setCategories(categories);
      setProduct(productData);
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

  return (
    <View style={styles.Background}>
      {!isCameraVisible ? (
        <View>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
            style={{
              backgroundColor: '#101010',
            }}>
            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Code Scanned!</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
            <View
              style={{marginLeft: '5%', marginTop: '5%', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => navigation.dispatch(StackActions.pop(1))}>
                <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
              </TouchableOpacity>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 24,
                  marginLeft: '23%',
                }}>
                Inventory
              </Text>
            </View>
            <View
              style={{
                marginTop: '2%',
                width: '100%',
                backgroundColor: '#E56033',
                height: '0.25%',
              }}
            />

            <View style={{marginBottom: '22%'}}>
              {Object.entries(product).map(([categoryName, products]) => {
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
                        {products.map(product => (
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
              })}
            </View>
            <View style={{height: 200}}></View>
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              bottom: 25,
              right: 8,
              marginBottom: '5%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setCameraVisible(true);
              }}
              style={{alignItems: 'center'}}>
              <ScanBarcode
                style={{marginBottom: '10%', marginLeft: '10%'}}
                size="90"
                color="#FF8A65"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddProductsManually')}
              style={{marginBottom: '5%'}}>
              <View
                style={{
                  width: 130,
                  height: 35,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: '#E56033',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#101010',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <AntDesign
                    name={'pluscircleo'}
                    size={11}
                    color={'#FFFFFF'}
                    style={{marginTop: '2.3%'}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                      fontSize: 14,
                      marginLeft: '3%',
                    }}>
                    Add Product
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddCategory')}
              style={{marginTop: '5%'}}>
              <View
                style={{
                  width: 130,
                  height: 35,
                  borderRadius: 25,
                  borderWidth: 1,
                  borderColor: '#FFFFFF',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#101010',
                }}>
                <View style={{flexDirection: 'row'}}>
                  <AntDesign
                    name={'pluscircleo'}
                    size={11}
                    color={'#E56033'}
                    style={{marginTop: '2.3%'}}
                  />
                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#E56033',
                      fontSize: 14,
                      marginLeft: '3%',
                    }}>
                    Add Category
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Camera
          style={StyleSheet.absoluteFill}
          photo={true}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4, // Adjust the height as needed
    },
    shadowOpacity: 5, // Adjust the opacity as needed
    shadowRadius: 4,
    elevation: 20, // Adjust the elevation as needed
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#E56033',
  },
  textStyle: {
    color: 'white',
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InventoryScreen;
