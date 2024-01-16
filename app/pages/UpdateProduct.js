import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  StyleSheet,
  ImageBackground,
  Keyboard,
  Pressable,
} from 'react-native';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import NumericInput from 'react-native-numeric-input';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import client from '../api/client';
import {addProduct} from '../utils/addProduct';
import {updateNotification} from '../utils/helper';
import AppNotification from '../components/AppNotification';
import * as ImagePicker from 'react-native-image-picker';
import {useRoute} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';

import {
  Barcode,
  GalleryEdit,
  TickCircle,
  CloseSquare,
  Gallery,
  Camera,
} from 'iconsax-react-native';

const UpdateProduct = ({navigation}) => {
  const [message, setMessage] = useState({
    text: '',
    type: '',
  });

  const route = useRoute();
  const {id} = route.params;
  // console.log(id);
  // const code = route.params?.code;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(1);
  const [items, setItems] = useState([]);

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [description, setDescription] = useState('');

  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [product, setProduct] = useState('');

  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  useEffect(() => {
    listCategories();
    // console.log('check');
    getProduct();
  }, []);

  useEffect(() => {
    // Update the 'name' state when 'product' changes
    if (product) {
      setName(product.name);
      setAvatar(product.avatar);
      setBrand(product.brand);
      setPrice(product.price);
      setBarcode(product.barcodeNumber);
      setDescription(product.description);
    }
  }, [product]);

  const getProduct = async () => {
    try {
      const res = await client.get(`/product/${id}`);
      const productData = res.data;
      // console.log(productData);
      setProduct(productData);
      // console.log(typeof value2);
    } catch (error) {
      console.error('Error fetching the product:', error);
    }
  };

  const handleImagePicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let profPicture = null;

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErr('Error picking image');
      } else {
        profPicture = response.assets[0];

        cloudinaryUpload(profPicture);
      }
    });
  };

  const cameraPicker = async () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };

    let profPicture = null;

    ImagePicker.launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        setErr('Error picking image');
      } else {
        profPicture = response.assets[0];

        cloudinaryUpload(profPicture);
      }
    });
  };

  const cloudinaryUpload = async file => {
    if (file) {
      const data = new FormData();

      const upload_preset = 'comercio';

      data.append('file', {
        uri: file.uri,
        type: 'image/jpg',
        name: 'image.jpg',
      });

      data.append('upload_preset', upload_preset);

      try {
        const response = await axios.post('', data, {
          headers: {'content-type': 'multipart/form-data'},
        });

        // console.log(response.data);
        console.log(response.data.url);
        setAvatar(response.data.url);
        setModalVisible(false);
      } catch (error) {
        console.error('Error while uploading:', error);
        console.error('Cloudinary response:', error.response);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      const stringQuantity = value2.toString();

      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const updatedProductData = {
          name: name,
          avatar: avatar,
          brand: brand,
          price: price,
          description: description,
          barcodeNumber: barcode,
          quantity: stringQuantity,
          categories: value,
        };

        console.log(retrievedData.id);
        console.log('1');

        const res = await client.put(
          `/product/${retrievedData.id}/${id}`,
          updatedProductData,
        );
        console.log('2');
        const updatedProduct = res.data;
        console.log('3');
        console.log(updatedProduct);
        navigation.dispatch(StackActions.replace('Inventory Screen'));
        if (!res.success) {
          return updateNotification(setMessage, res.error);
        }
      }
    } catch (error) {
      console.error('Error updating the product: ', error);
    }
  };

  const listCategories = async () => {
    try {
      const res = await client.get('/category/categories');
      setCategories(res.data);
      const categories = res.data.map(category => ({
        label: category.name,
        value: category._id,
      }));
      setItems(categories);
      // console.log(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
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
            Update Product
          </Text>
        </View>

        <View
          style={{
            marginTop: '5%',
            marginLeft: '6%',
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
            Update the information about the product
          </Text>
        </View>
        <View
          style={{
            marginTop: '2%',
            marginLeft: '19.5%',
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
                Product Name
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
                placeholder="Enter product name"
                placeholderTextColor={'#CB8D78'}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={{marginVertical: '5%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: '#FFFFFF',
                  fontSize: 16,
                  marginBottom: '2%',
                }}>
                Category
              </Text>

              <DropDownPicker
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
                  backgroundColor: '#101010',
                }}
                dropDownContainerStyle={{
                  backgroundColor: '#101010',
                  width: 313,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#393840',
                  position: 'relative',
                  top: 0,
                }}
                listMode="SCROLLVIEW"
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                placeholder="Select a Category"
                placeholderStyle={{
                  fontFamily: 'Outfit-Regular',
                  color: '#CB8D78',
                  fontSize: 16,
                }}
                theme="DARK"
                labelStyle={{
                  fontFamily: 'Outfit-Regular',
                  color: '#CB8D78',
                  fontSize: 16,
                }}
              />
            </View>

            <View style={{marginVertical: '5%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: '#FFFFFF',
                  fontSize: 16,
                  marginBottom: '2%',
                }}>
                Brand
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
                placeholder="Enter brand name"
                placeholderTextColor={'#CB8D78'}
                value={brand}
                onChangeText={setBrand}
              />
            </View>

            <View style={{marginVertical: '5%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: '#FFFFFF',
                  fontSize: 16,
                  marginBottom: '2%',
                }}>
                Price
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
                placeholder="0"
                placeholderTextColor={'#CB8D78'}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />
            </View>

            <View style={{marginVertical: '5%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: '#FFFFFF',
                  fontSize: 16,
                  marginBottom: '2%',
                }}>
                Barcode
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
                placeholder="0"
                placeholderTextColor={'#CB8D78'}
                value={barcode}
                onChangeText={setBarcode}
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() =>
                navigation.navigate('GenerateBarcode', {
                  barcode: barcode,
                })
              }>
              <View
                style={{
                  width: 210,
                  height: 50,
                  marginVertical: '5%',
                  borderRadius: 51,
                  borderWidth: 1,
                  borderColor: '#E56033',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Barcode
                  style={{marginRight: '2%'}}
                  size="28"
                  color="#FF8A65"
                />

                <Text
                  style={{
                    fontFamily: 'Outfit-Regular',
                    color: '#FFFFFF',
                    marginLeft: '2%',
                    fontSize: 16,
                  }}>
                  Generate Barcode
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={{alignItems: 'center'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}>
              {avatar == '' ? (
                <View
                  style={{
                    width: 210,
                    height: 50,
                    marginVertical: '5%',
                    borderRadius: 51,
                    borderWidth: 1,
                    borderColor: '#E56033',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <GalleryEdit
                    style={{marginRight: '2%'}}
                    size="28"
                    color="#FF8A65"
                  />

                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                      marginLeft: '2%',
                      fontSize: 16,
                    }}>
                    Upload Image
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    width: 210,
                    height: 50,
                    marginVertical: '5%',
                    borderRadius: 51,
                    borderWidth: 1,
                    borderColor: 'green',
                    backgroundColor: 'green',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row',
                  }}>
                  <TickCircle
                    style={{marginRight: '2%'}}
                    size="28"
                    color="white"
                  />

                  <Text
                    style={{
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                      marginLeft: '2%',
                      fontSize: 16,
                    }}>
                    Image Uploaded!
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert('Modal has been closed.');
                setModalVisible(!modalVisible);
              }}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisible(false);
                  }}>
                  <View
                    style={{
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                    }}>
                    <CloseSquare
                      style={{
                        marginTop: '-12%',
                        marginRight: '-10%',
                      }}
                      size="32"
                      color="#FF8A65"
                    />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{alignItems: 'center'}}
                  onPress={() => {
                    handleImagePicker();
                  }}>
                  <Gallery size="100" color="#FF8A65" />
                </TouchableOpacity>

                <View
                  style={{
                    width: '100%',
                    height: '1.5%',
                    backgroundColor: 'white',
                    marginTop: '5%',
                    marginBottom: '5%',
                  }}></View>

                <TouchableOpacity
                  style={{alignItems: 'center', marginBottom: '7%'}}
                  onPress={() => {
                    cameraPicker();
                  }}>
                  <Camera size="100" color="#FF8A65" />
                </TouchableOpacity>
              </View>
            </Modal>

            <TouchableOpacity
              style={{alignItems: 'center', marginTop: '5%'}}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}></TouchableOpacity>

            <View style={{marginVertical: '5%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-Medium',
                  color: '#FFFFFF',
                  fontSize: 16,
                  marginBottom: '2%',
                }}>
                Description
              </Text>
              <TextInput
                style={{
                  width: 313,
                  height: 100,
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
                placeholderTextColor={'#CB8D78'}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: '5%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NumericInput
                value={value2}
                onChange={setValue2}
                totalWidth={180}
                totalHeight={50}
                iconSize={30}
                step={1}
                borderColor={'#393840'}
                separatorWidth={0.7}
                minValue={1}
                valueType="real"
                rounded
                textColor="#CB8D78"
                iconStyle={{color: '#CB8D78'}}
                rightButtonBackgroundColor="#101010"
                leftButtonBackgroundColor="#101010"
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
                  Update
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* <View>
            {categories.map(category => (
              <Text
                key={category._id}
                style={{
                  fontFamily: 'Outfit-Regular',
                  color: '#FFFFFF',
                  fontSize: 16,
                }}>
                {category.name}
              </Text>
            ))}
          </View> */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  modalView: {
    margin: 40,
    backgroundColor: 'black',
    borderRadius: 20,
    marginTop: '50%',
    padding: 35,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 4, // Adjust the height as needed
    },
    shadowOpacity: 5, // Adjust the opacity as needed
    shadowRadius: 4,
    elevation: 20, // Adjust the elevation as needed
  },
});

export default UpdateProduct;
