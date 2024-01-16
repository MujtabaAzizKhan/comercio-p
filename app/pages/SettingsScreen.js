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
import EncryptedStorage from 'react-native-encrypted-storage';
import client from '../api/client';

const SettingScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [isProducer, setIsProducer] = useState(false);
  const [userId, setUserId] = useState('');

  const logout = async () => {
    if (isProducer == false) {
      // console.log('dasdsadad');
      const res = await client.delete(`/cart/delete/${userId}`);
      EncryptedStorage.removeItem('user');
      navigation.dispatch(StackActions.replace('Sign in Screen'));
    } else {
      EncryptedStorage.removeItem('user');
      navigation.dispatch(StackActions.replace('Sign in Screen'));
    }
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getUserData = async () => {
    const readData = await EncryptedStorage.getItem('user');
    const retrievedData = JSON.parse(readData);
    setName(retrievedData.name);
    setAvatar(retrievedData.avatar);
    setIsProducer(retrievedData.isProducer);
    console.log(isProducer);
    setUserId(retrievedData.id);
  };

  return (
    <View style={styles.Background}>
      <View>
        <Text
          style={{
            fontFamily: 'Outfit-Bold',
            fontSize: 22,
            color: '#ffffff',
            margin: 15,
            marginLeft: '10%',
            marginTop: 30,
          }}>
          Settings
        </Text>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate('ProfilePage')}>
        <View style={{alignItems: 'center', marginBottom: 35}}>
          <View style={{flexDirection: 'row', margin: 10}}>
            <Image
              source={{
                uri:
                  avatar ||
                  'https://static.vecteezy.com/system/resources/previews/020/765/399/non_2x/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg',
              }}
              style={{
                width: 54,
                height: 54,
                marginLeft: '10%',
                borderRadius: 54,
              }}
            />
            <View
              style={{marginRight: '30%', marginLeft: '2%', marginTop: '2%'}}>
              <Text
                style={{
                  fontFamily: 'Outfit-SemiBold',
                  fontSize: 18,
                  color: '#ffffff',
                }}>
                {name}
              </Text>
              <Text
                style={{
                  fontFamily: 'Outfit-Regular',
                  fontSize: 13.5,
                  color: 'grey',
                  marginTop: '-3%',
                }}>
                Edit Personal details
              </Text>
            </View>
            <Image
              source={require('../../assets/images/SmallArrowRight.png')}
              style={{
                width: 10,
                height: 25,
                marginRight: '10%',
                marginTop: '4%',
              }}
            />
          </View>
        </View>
      </TouchableOpacity>
      {/* <View style={{alignItems: 'center'}}>
        <View
          style={{
            width: '80%',
            height: 45,
            padding: 10,
          }}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Image
              source={require('../../assets/images/Moon.png')}
              style={{width: 24, height: 24}}
            />
            <Text
              style={{
                color: '#ffffff',
                fontSize: 16,
                fontFamily: 'Outfit-Regular',
                marginLeft: '-33%',
              }}>
              Dark Mode
            </Text>
            <Image
              source={require('../../assets/images/ToggleOnCircle.png')}
              style={{width: 28, height: 24}}
            />
          </View>
        </View>
      </View> */}
      <View style={{alignItems: 'center'}}>
        <View style={{width: '85%'}}>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 18,
              color: '#E56033',
              marginLeft: '2%',
            }}>
            Profile
          </Text>
          <View
            style={{
              borderWidth: 2,
              borderColor: '#65331c',
              width: '100%',
              height: 'auto',
              borderRadius: 10,
              margin: '2%',
              padding: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../assets/images/UserEdit.png')}
                style={{width: 24, height: 24, marginTop: '0.5%'}}
              />
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 15,
                  fontFamily: 'Outfit-Regular',
                  margin: 3,
                  marginLeft: '5%',
                }}>
                Edit Profile
              </Text>
              <TouchableOpacity
                style={{marginLeft: '30%'}}
                onPress={() => navigation.navigate('ProfilePage')}>
                <Image
                  source={require('../../assets/images/SmallArrowRight.png')}
                  style={{
                    width: 12,
                    height: 22,
                    marginLeft: '57.5%',
                    marginTop: '0.5%',
                  }}
                />
              </TouchableOpacity>
            </View>
            {/* <View style={{marginTop: 15, flexDirection: 'row'}}>
              <Image
                source={require('../../assets/images/Key.png')}
                style={{width: 24, height: 24}}
              />
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 15,
                  fontFamily: 'Outfit-Regular',
                  margin: 3,
                  marginLeft: '10%',
                }}>
                Change Password
              </Text>

              <TouchableOpacity style={{marginLeft: '23%'}}>
                <Image
                  source={require('../../assets/images/SmallArrowRight.png')}
                  style={{width: 12, height: 22, marginLeft: '27%'}}
                />
              </TouchableOpacity>
            </View> */}
          </View>
        </View>
      </View>

      {/* Records */}
      <View style={{alignItems: 'center', marginTop: '5%'}}>
        <View style={{width: '85%'}}>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 18,
              color: '#E56033',
              marginLeft: '2%',
            }}>
            Records
          </Text>
          <View
            style={{
              borderWidth: 2,
              borderColor: '#65331c',
              width: '100%',
              height: 'auto',
              borderRadius: 10,
              margin: '2%',
              padding: 10,
            }}>
            {isProducer ? (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/Receipt21-Linear.png')}
                  style={{width: 24, height: 24, marginTop: '0.5%'}}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 15,
                    fontFamily: 'Outfit-Regular',
                    margin: 3,
                    marginLeft: '5%',
                  }}>
                  History
                </Text>
                <TouchableOpacity
                  style={{marginLeft: '23%'}}
                  onPress={() => navigation.navigate('SellingHistory')}>
                  <Image
                    source={require('../../assets/images/SmallArrowRight.png')}
                    style={{
                      width: 12,
                      height: 22,
                      marginLeft: '70%',
                      marginTop: '0.5%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/Receipt21-Linear.png')}
                  style={{width: 24, height: 24, marginTop: '0.5%'}}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 15,
                    fontFamily: 'Outfit-Regular',
                    margin: 3,
                    marginLeft: '5%',
                  }}>
                  History
                </Text>
                <TouchableOpacity
                  style={{marginLeft: '23%'}}
                  onPress={() => navigation.navigate('ShoppingHistory')}>
                  <Image
                    source={require('../../assets/images/SmallArrowRight.png')}
                    style={{
                      width: 12,
                      height: 22,
                      marginLeft: '70%',
                      marginTop: '0.5%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            {isProducer ? (
              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/Key.png')}
                  style={{width: 24, height: 24}}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 15,
                    fontFamily: 'Outfit-Regular',
                    margin: 3,
                    marginLeft: '5%',
                  }}>
                  Selling Records
                </Text>

                <TouchableOpacity
                  style={{marginLeft: '23%'}}
                  onPress={() => navigation.navigate('SellingRecordScreen')}>
                  <Image
                    source={require('../../assets/images/SmallArrowRight.png')}
                    style={{
                      width: 12,
                      height: 22,
                      marginLeft: '51.6%',
                      marginTop: '0.5%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/Scan-Linear.png')}
                  style={{width: 24, height: 24, marginTop: '0.5%'}}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 15,
                    fontFamily: 'Outfit-Regular',
                    margin: 3,
                    marginLeft: '5%',
                  }}>
                  Scan A Receipt
                </Text>

                <TouchableOpacity
                  style={{marginLeft: '23%'}}
                  onPress={() => navigation.navigate('ShoppingHistory')}>
                  <Image
                    source={require('../../assets/images/SmallArrowRight.png')}
                    style={{
                      width: 12,
                      height: 22,
                      marginLeft: '52%',
                      marginTop: '0.5%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
      {/* Support And Communication */}
      <View style={{alignItems: 'center', marginTop: '5%'}}>
        <View style={{width: '85%'}}>
          <Text
            style={{
              fontFamily: 'Outfit-Regular',
              fontSize: 18,
              color: '#E56033',
              marginLeft: '2%',
            }}>
            Support And Communication
          </Text>
          <View
            style={{
              borderWidth: 2,
              borderColor: '#65331c',
              width: '100%',
              height: 'auto',
              borderRadius: 10,
              margin: '2%',
              padding: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                source={require('../../assets/images/Support-Linear.png')}
                style={{width: 24, height: 24, marginTop: '0.5%'}}
              />
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 15,
                  fontFamily: 'Outfit-Regular',
                  margin: 3,
                  marginLeft: '5%',
                }}>
                Contact Support Team
              </Text>
              <TouchableOpacity
                style={{marginLeft: '1%'}}
                onPress={() => navigation.navigate('ContactSupportTeam')}>
                <Image
                  source={require('../../assets/images/SmallArrowRight.png')}
                  style={{
                    width: 12,
                    height: 22,
                    marginLeft: '48.5%',
                    marginTop: '0.5%',
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={{marginTop: 15, flexDirection: 'row'}}>
              <Image
                source={require('../../assets/images/EmojiHappy-Linear.png')}
                style={{width: 24, height: 24, marginTop: '0.5%'}}
              />
              <Text
                style={{
                  color: '#ffffff',
                  fontSize: 15,
                  fontFamily: 'Outfit-Regular',
                  margin: 3,
                  marginLeft: '5%',
                }}>
                Get Jarvis Help
              </Text>

              <TouchableOpacity
                style={{marginLeft: '23%'}}
                onPress={() => navigation.navigate('DialogFlow')}>
                <Image
                  source={require('../../assets/images/SmallArrowRight.png')}
                  style={{
                    width: 12,
                    height: 22,
                    marginLeft: '48%',
                    marginTop: '0.5%',
                  }}
                />
              </TouchableOpacity>
            </View>
            {isProducer ? null : (
              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/Box-Linear.png')}
                  style={{width: 24, height: 24, marginTop: '0.5%'}}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 15,
                    fontFamily: 'Outfit-Regular',
                    margin: 3,
                    marginLeft: '5%',
                  }}>
                  Return or Refund
                </Text>

                <TouchableOpacity
                  style={{marginLeft: '23%'}}
                  onPress={() => navigation.navigate('ReturnAndRefund')}>
                  <Image
                    source={require('../../assets/images/SmallArrowRight.png')}
                    style={{
                      width: 12,
                      height: 22,
                      marginLeft: '42%',
                      marginTop: '0.5%',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={logout}>
              <View style={{marginTop: 15, flexDirection: 'row'}}>
                <Image
                  source={require('../../assets/images/LogoutCurve.png')}
                  style={{width: 24, height: 24, marginTop: '0.5%'}}
                />
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 15,
                    fontFamily: 'Outfit-Regular',
                    margin: 3,
                    marginLeft: '5%',
                  }}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
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
});

export default SettingScreen;
