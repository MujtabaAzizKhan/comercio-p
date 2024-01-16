import 'react-native-gesture-handler';
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
} from 'react-native';

import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import NumericInput from 'react-native-numeric-input';
import EncryptedStorage from 'react-native-encrypted-storage';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useRoute} from '@react-navigation/native';
import client from '../api/client';
import {set} from 'mongoose';
import Toast from 'react-native-toast-message';

const ProductPage = ({navigation}) => {
  const [product, setProduct] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [productPublished, setProductPublished] = useState(isPublished);

  const [producer, setProducer] = useState(false);

  const [rating, setRating] = useState(0);

  const [reviewStatus, setReviewStatus] = useState(false);

  // for single review
  const [user, setUser] = useState('');
  const [reviewId, setReviewId] = useState('');
  const [singleReview, setSingleReview] = useState('');
  const [singleReviewRating, setSingleReviewRating] = useState('');

  // for all review
  const [allReviews, setAllReviews] = useState([]);

  const [value, setValue] = useState(null);
  const [value2, setValue2] = useState(1);

  const route = useRoute();
  const {id, isPublished} = route.params;

  const [maxQuantity, setMaxQuantity] = useState(0);

  useEffect(() => {
    setProductPublished(isPublished);
    getProduct();
    getUser();
    getReview();
    getAllReviews();
  }, [isPublished]);

  const getProduct = async () => {
    try {
      const res = await client.get(`/product/${id}`);
      const productData = res.data;
      setProduct(productData);
      setMaxQuantity(Number(res.data.quantity));
    } catch (error) {
      console.error('Error fetching the product:', error);
    }
  };

  const deleteProduct = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.delete(`/product/${retrievedData.id}/${id}`);
        const delProduct = res.data;
        console.log(delProduct);
      }
    } catch (error) {
      console.error('Error deleting the product: ', error);
    }
  };

  const handleDelete = () => {
    deleteProduct();

    setModalVisible(!modalVisible);
    navigation.dispatch(StackActions.replace('Inventory Screen'));
  };

  const getUser = async () => {
    const readData = await EncryptedStorage.getItem('user');
    setUserData(readData);

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(!isLoggedOut);

      // Parse the JSON string to get the user data object
      const retrievedData = JSON.parse(readData);
      setUser(retrievedData.name);

      if (retrievedData.isProducer == true) {
        setProducer(true);
      }
    }
  };

  const togglePublishState = async () => {
    setProductPublished(!productPublished);

    try {
      let data = await client.get(`/product/setPublished/${id}`);
      console.log(data);
      console.log('YOLO');
      navigation.goBack({key: Date.now()});
    } catch (err) {
      console.error('Error fetching categories and products:', err);
    }
  };

  const handleUpdateReviewPress = newRating => {
    const rate = newRating;
    navigation.navigate('UpdateReviewPage', {id, rate, reviewId});
  };

  const handleWriteReviewPress = newRating => {
    const rate = newRating;
    navigation.navigate('ReviewPage', {id, rate});
  };

  const handleRatingPress = newRating => {
    const rate = newRating;
    setRating(newRating);
    setTimeout(() => {
      navigation.navigate('ReviewPage', {id, rate});
    }, 500);
  };

  const getReview = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(
          `/productReview/${retrievedData.id}/${id}`,
        );
        const reviewData = res.data;
        // console.log(reviewData);
        if (reviewData && reviewData.review !== null) {
          setSingleReview(reviewData.review);
          setSingleReviewRating(reviewData.rating);
          setReviewId(reviewData._id);
          setReviewStatus(true);
        } else {
          setSingleReview(null);
          setReviewStatus(false);
        }
      }
    } catch (error) {
      console.error('Error fetching the review:', error);
      console.error('Error response:', error.response);
    }
  };

  const getAllReviews = async () => {
    try {
      const res = await client.get(`/productReview/allProductReviews/${id}`);
      const reviewData = res.data;
      setAllReviews(reviewData);
      console.log(reviewData);
    } catch (error) {
      console.error('Error fetching the review:', error);
      console.error('Error response:', error.response);
    }
  };

  const handleAddToCart = async () => {
    try {
      const stringQuantity = value2.toString();
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const cartItem = {products: [{product: id, quantity: stringQuantity}]};
        const res = await client.put(
          `/cart/update/${retrievedData.id}`,
          cartItem,
        );
        Toast.show({
          type: 'success',
          text1: 'Product added to cart',
          visibilityTime: 2000,
          autoHide: true,
          // position: 'bottom',
          // bottomOffset: 80,
          // topOffset: 30,
          // bottomOffset: 40,
        });
      }
    } catch (error) {
      console.error('Error fetching the review:', error);
      console.error('Error response:', error.response);
    }
  };
  const handleBuyNow = async () => {
    try {
      const stringQuantity = value2.toString();
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const cartItem = {products: [{product: id, quantity: stringQuantity}]};
        const res = await client.put(
          `/cart/update/${retrievedData.id}`,
          cartItem,
        );
        navigation.navigate('Cart Screen');
      }
    } catch (error) {
      console.error('Error fetching the review:', error);
      console.error('Error response:', error.response);
    }
  };

  return producer == true ? (
    <ScrollView style={styles.Background}>
      <View style={{marginLeft: '5%', marginTop: '5%', flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Bold',
            fontSize: 24,
            marginLeft: '28%',
            marginTop: '-1%',
          }}>
          Product
        </Text>
      </View>
      <View style={{alignItems: 'center', marginVertical: '3%'}}>
        <Image
          source={{
            uri:
              product.avatar ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/MacOS_prohibitory_symbol.svg/2048px-MacOS_prohibitory_symbol.svg.png',
          }}
          style={{height: 350, width: '100%'}}
        />
      </View>

      <View style={styles.container}>
        <TouchableOpacity
          style={[
            styles.button,
            productPublished ? styles.published : styles.unpublished,
          ]}
          onPress={togglePublishState}>
          <Text style={styles.buttonText}>
            {productPublished ? 'Published' : 'Unpublished'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: '85%',
            backgroundColor: '#393840',
            borderRadius: 10,
            padding: 10,
            margin: '2%',
          }}>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 18,
            }}>
            {product.name}
          </Text>
          <View style={{flexDirection: 'row', marginVertical: '2%'}}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 13,
                marginTop: '0.75%',
              }}>
              Rs.
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 15,
              }}>
              {' '}
              {product.price}
            </Text>
          </View>
          <Text
            numberOfLines={8}
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Light',
              fontSize: 12,
              width: '100%',
              textAlign: 'justify',
            }}>
            {product.description}
          </Text>
        </View>
        <View
          style={{
            width: '85%',
            backgroundColor: '#393840',
            borderRadius: 10,
            padding: 10,
            margin: '2%',
          }}>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 15,
            }}>
            Reviews
          </Text>
          {allReviews.map((review, index) => (
            <View style={{marginVertical: '2%'}} key={index}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 14,
                  marginBottom: '1.5%',
                }}>
                {review.user.name}
              </Text>
              <View style={{flexDirection: 'row', marginBottom: '1%'}}>
                <AntDesign
                  name={review.rating >= 1 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 2 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 3 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 4 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 5 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />
              </View>
              <Text
                numberOfLines={8}
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Light',
                  fontSize: 12,
                  width: '100%',
                  textAlign: 'justify',
                }}>
                {review.review}
              </Text>
            </View>
          ))}
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: '2%',
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('UpdateProduct', {id})}>
            <View
              style={{
                backgroundColor: '#3B3A41',
                width: 175,
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
                Update
              </Text>
            </View>
          </TouchableOpacity>

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
                <Text style={styles.modalText}>
                  Are you sure you want to delete this product?
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <Pressable
                    style={{
                      borderRadius: 12,
                      padding: 10,
                      elevation: 2,
                      marginHorizontal: '1.5%',
                      backgroundColor: 'red',
                    }}
                    onPress={handleDelete}>
                    <Text
                      style={{
                        color: '#3B3A41',
                        fontFamily: 'Outfit-SemiBold',
                        textAlign: 'center',
                        fontSize: 14,
                      }}>
                      Delete
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      borderRadius: 12,
                      padding: 10,
                      elevation: 2,
                      marginHorizontal: '1.5%',
                      backgroundColor: '#3B3A41',
                    }}
                    onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textStyle}>Cancel</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>

          <TouchableOpacity
            onPress={() => setModalVisible(true)} /*onPress={deleteProduct}*/
            style={{
              backgroundColor: 'red',
              width: 180,
              height: 50,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 180,
            }}>
            <Text
              style={{
                color: '#393840',
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
                fontSize: 16,
              }}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  ) : (
    <ScrollView style={styles.Background}>
      <View style={{marginLeft: '5%', marginTop: '5%', flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => navigation.dispatch(StackActions.pop(1))}>
          <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
        </TouchableOpacity>
        <Text
          style={{
            color: '#FFFFFF',
            fontFamily: 'Outfit-Bold',
            fontSize: 24,
            marginLeft: '28%',
            marginTop: '-1%',
          }}>
          Product
        </Text>
      </View>
      <View style={{alignItems: 'center', marginVertical: '3%'}}>
        <Image
          source={{
            uri:
              product.avatar ||
              'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/MacOS_prohibitory_symbol.svg/2048px-MacOS_prohibitory_symbol.svg.png',
          }}
          style={{height: 350, width: '100%'}}
        />
      </View>
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: '85%',
            backgroundColor: '#393840',
            borderRadius: 10,
            padding: 10,
            margin: '2%',
          }}>
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Regular',
              fontSize: 18,
            }}>
            {product.name}
          </Text>
          <View style={{flexDirection: 'row', marginVertical: '2%'}}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 13,
                marginTop: '0.75%',
              }}>
              Rs.
            </Text>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 15,
              }}>
              {' '}
              {product.price}
            </Text>
          </View>
          <Text
            numberOfLines={8}
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Light',
              fontSize: 12,
              width: '100%',
              textAlign: 'justify',
            }}>
            {product.description}
          </Text>
        </View>
        <View
          style={{
            width: '85%',
            backgroundColor: '#393840',
            borderRadius: 10,
            padding: 10,
            margin: '2%',
          }}>
          {reviewStatus == false ? (
            <View>
              <Text
                style={{
                  color: '#E56033',
                  fontFamily: 'Outfit-Medium',
                  fontSize: 15,
                }}>
                Rate this app
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 11,
                  marginBottom: '2%',
                }}>
                Tell others what you think
              </Text>
              <View style={{flexDirection: 'row', marginVertical: '1%'}}>
                <TouchableOpacity onPress={() => handleRatingPress(1)}>
                  <AntDesign
                    name={rating >= 1 ? 'star' : 'staro'}
                    size={20}
                    style={{marginRight: '8%'}}
                    color={'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(2)}>
                  <AntDesign
                    name={rating >= 2 ? 'star' : 'staro'}
                    size={20}
                    style={{marginLeft: '10%'}}
                    color={'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(3)}>
                  <AntDesign
                    name={rating >= 3 ? 'star' : 'staro'}
                    size={20}
                    style={{marginLeft: '10%'}}
                    color={'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(4)}>
                  <AntDesign
                    name={rating >= 4 ? 'star' : 'staro'}
                    size={20}
                    style={{marginLeft: '10%'}}
                    color={'white'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleRatingPress(5)}>
                  <AntDesign
                    name={rating >= 5 ? 'star' : 'staro'}
                    size={20}
                    style={{marginLeft: '10%'}}
                    color={'white'}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => handleWriteReviewPress(0)}>
                <Text
                  style={{
                    color: 'skyblue',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 12,
                    marginVertical: '2%',
                  }}>
                  Write a review
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View>
            <Text
              style={{
                color: '#E56033',
                fontFamily: 'Outfit-Medium',
                fontSize: 15,
              }}>
              Your Review
            </Text>
            {reviewStatus == true ? (
              <View style={{marginVertical: '2%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Bold',
                    fontSize: 14,
                    marginBottom: '1.5%',
                  }}>
                  {user}
                </Text>
                <View style={{flexDirection: 'row', marginBottom: '1%'}}>
                  <AntDesign
                    name={singleReviewRating >= 1 ? 'star' : 'staro'}
                    size={12}
                    color={'white'}
                  />

                  <AntDesign
                    name={singleReviewRating >= 2 ? 'star' : 'staro'}
                    size={12}
                    color={'white'}
                  />

                  <AntDesign
                    name={singleReviewRating >= 3 ? 'star' : 'staro'}
                    size={12}
                    color={'white'}
                  />

                  <AntDesign
                    name={singleReviewRating >= 4 ? 'star' : 'staro'}
                    size={12}
                    color={'white'}
                  />

                  <AntDesign
                    name={singleReviewRating >= 5 ? 'star' : 'staro'}
                    size={12}
                    color={'white'}
                  />
                </View>
                <Text
                  numberOfLines={8}
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Light',
                    fontSize: 12,
                    width: '100%',
                    textAlign: 'justify',
                  }}>
                  {singleReview}
                </Text>
                <TouchableOpacity
                  onPress={() => handleUpdateReviewPress(singleReviewRating)}>
                  <Text
                    style={{
                      color: 'skyblue',
                      fontFamily: 'Outfit-Regular',
                      fontSize: 12,
                      marginVertical: '2%',
                    }}>
                    Edit your review
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 11,
                  marginBottom: '2%',
                }}>
                You haven't reviewed this product yet
              </Text>
            )}
          </View>

          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Medium',
              fontSize: 15,
            }}>
            Reviews
          </Text>

          {allReviews.map((review, index) => (
            <View style={{marginVertical: '2%'}} key={index}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 14,
                  marginBottom: '1.5%',
                }}>
                {review.user.name}
              </Text>
              <View style={{flexDirection: 'row', marginBottom: '1%'}}>
                <AntDesign
                  name={review.rating >= 1 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 2 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 3 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 4 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />

                <AntDesign
                  name={review.rating >= 5 ? 'star' : 'staro'}
                  size={12}
                  color={'white'}
                />
              </View>
              <Text
                numberOfLines={8}
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Light',
                  fontSize: 12,
                  width: '100%',
                  textAlign: 'justify',
                }}>
                {review.review}
              </Text>
            </View>
          ))}
          <Text
            style={{
              color: '#E56033',
              fontFamily: 'Outfit-Medium',
              fontSize: 15,
              marginTop: '5%',
            }}>
            Quantity
          </Text>
          {product.quantity == 0 ? (
            <View style={{alignItems: 'center', marginTop: '2%'}}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 14,
                }}>
                Out Of Stock
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginTop: '2%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <NumericInput
                value={value2}
                onChange={setValue2}
                totalWidth={150}
                totalHeight={45}
                iconSize={30}
                step={1}
                borderColor={'#FFFFFF'}
                separatorWidth={0}
                minValue={1}
                maxValue={maxQuantity}
                valueType="real"
                rounded
                textColor="#CB8D78"
                iconStyle={{color: '#CB8D78'}}
                rightButtonBackgroundColor="#393840'"
                leftButtonBackgroundColor="#393840'"
              />
            </View>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            margin: '2%',
          }}>
          <TouchableOpacity
            onPress={handleBuyNow}
            disabled={product.quantity == 0}>
            <View
              style={{
                backgroundColor: product.quantity == 0 ? '#ccc' : '#393840',
                width: 177,
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
                  color: product.quantity == 0 ? '#393840' : '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 14,
                }}>
                Buy Now
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddToCart}
            disabled={product.quantity == 0}
            style={{
              backgroundColor: product.quantity == 0 ? '#ccc' : '#E56033',
              width: 180,
              height: 50,
              padding: 10,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 180,
              flexDirection: 'row',
              borderRightColor: '#393840',
              borderRightWidth: 1,

            }}>
            <Image
              source={require('../../assets/images/ShoppingCart.png')}
              style={{
                height: 25,
                width: 25,
                marginLeft: '1%',
                marginTop: '0.25%',
                tintColor: '#393840',
              }}
            />
            <Text
              style={{
                color: '#393840',
                fontFamily: 'Outfit-Bold',
                textAlign: 'center',
                fontSize: 14,
                marginLeft: '5%',
              }}>
              Add to Cart
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  modalView: {
    margin: 30,
    marginTop: '70%',
    backgroundColor: '#101010',
    borderWidth: 1,
    borderColor: '#393840',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: '#FFFFFF',
    fontFamily: 'Outfit-Regular',
    textAlign: 'center',
    fontSize: 14,
  },
  modalText: {
    color: '#CB8D78',
    marginBottom: 15,
    textAlign: 'center',
  },

  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: '2%',
  },
  button: {
    padding: 10,
    borderRadius: 30,
    width: '35%',
    borderWidth: 1,
    borderColor: '#333',
  },
  published: {
    backgroundColor: '#E56033',
  },
  unpublished: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default ProductPage;
