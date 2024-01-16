import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EncryptedStorage from 'react-native-encrypted-storage';

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

import HomeScreen from '../pages/HomeScreen';
import ProducerHome from '../pages/ProducerHome';
import SettingsScreen from '../pages/SettingsScreen';
import CartScreen from '../pages/CartScreen';
import ProfilePage from '../pages/ProfilePage';
import InventoryScreen from '../pages/InventoryScreen';
import Partners from '../pages/Partners';
import ConnectionNotifications from '../pages/ConnectionNotifications';
const TabDrawer = () => {
  const [isProducer, setIsProducer] = useState(false);

  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  useEffect(() => {
    getUser();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const readData = await EncryptedStorage.getItem('user');
    const retrievedData = JSON.parse(readData);

    if (retrievedData.isProducer == false) {
      setIsProducer(false);
      // console.log('Producer nahi hai');
    } else {
      setIsProducer(true);
      // console.log('Producer hai');
    }
  };

  const getUser = async () => {
    const readData = await EncryptedStorage.getItem('user');
    setUserData(readData);

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(!isLoggedOut);

      // Parse the JSON string to get the user data object
      const retrievedData = JSON.parse(readData);

      if (retrievedData.isProducer == true) {
        setIsProducer(true);
      }
    }
  };
  const inventoryButton = isProducer ? (
    <Tab.Screen
      name="Inventory"
      component={InventoryScreen}
      options={{
        tabBarIcon: ({focused}) => (
          <View
            style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
            <Image
              source={require('../../assets/images/bag-linear.png')}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? '#E56033' : '#FFFFFF',
              }}
            />
            <Text
              style={{
                color: focused ? '#E56033' : '#FFFFFF',
                fontSize: 12,
                fontFamily: 'Outfit-Regular',
              }}>
              Inventory
            </Text>
          </View>
        ),
      }}
    />
  ) : (
    <Tab.Screen
      name="Partners"
      component={Partners}
      options={{
        tabBarIcon: ({focused}) => (
          <View
            style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
            <Image
              source={require('../../assets/images/partners-linear.png')}
              resizeMode="contain"
              style={{
                width: 25,
                height: 25,
                tintColor: focused ? '#E56033' : '#FFFFFF',
              }}
            />
            <Text
              style={{
                color: focused ? '#E56033' : '#FFFFFF',
                fontSize: 12,
                fontFamily: 'Outfit-Regular',
              }}>
              Partners
            </Text>
          </View>
        ),
      }}
    />
  );
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 20,
          borderColor: 'green',
          right: 20,
          borderRadius: 15,
          elevation: 0,
          backgroundColor: '#242222',
          height: 70,
          ...styles.shadow,
        },
      }}>
      {isProducer ? (
        <Tab.Screen
          name="ProducerHome"
          component={ProducerHome}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 5,
                }}>
                <Image
                  source={require('../../assets/images/home-linear.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#E56033' : '#FFFFFF',
                  }}
                />
                <Text
                  style={{
                    color: focused ? '#E56033' : '#FFFFFF',
                    fontSize: 12,
                    fontFamily: 'Outfit-Regular',
                  }}>
                  Home
                </Text>
              </View>
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 5,
                }}>
                <Image
                  source={require('../../assets/images/home-linear.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#E56033' : '#FFFFFF',
                  }}
                />
                <Text
                  style={{
                    color: focused ? '#E56033' : '#FFFFFF',
                    fontSize: 12,
                    fontFamily: 'Outfit-Regular',
                  }}>
                  Home
                </Text>
              </View>
            ),
          }}
        />
      )}
      {inventoryButton}

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
              <Image
                source={require('../../assets/images/setting-linear.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#E56033' : '#FFFFFF',
                }}
              />
              <Text
                style={{
                  color: focused ? '#E56033' : '#FFFFFF',
                  fontSize: 12,
                  fontFamily: 'Outfit-Regular',
                }}>
                Settings
              </Text>
            </View>
          ),
        }}
      />

      {!isProducer ? (
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 5,
                }}>
                <Image
                  source={require('../../assets/images/ShoppingCart.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#E56033' : '#FFFFFF',
                  }}
                />
                <Text
                  style={{
                    color: focused ? '#E56033' : '#FFFFFF',
                    fontSize: 12,
                    fontFamily: 'Outfit-Regular',
                  }}>
                  Cart
                </Text>
              </View>
            ),
          }}
        />
      ) : (
        <Tab.Screen
          name="ConnectionNotifications"
          component={ConnectionNotifications}
          options={{
            tabBarIcon: ({focused}) => (
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  top: 5,
                }}>
                <Image
                  source={require('../../assets/images/Notification.png')}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? '#E56033' : '#FFFFFF',
                  }}
                />
                <Text
                  style={{
                    color: focused ? '#E56033' : '#FFFFFF',
                    fontSize: 10,
                    fontFamily: 'Outfit-Regular',
                  }}>
                  Notifications
                </Text>
              </View>
            ),
          }}
        />
      )}

      <Tab.Screen
        name="Profile"
        component={ProfilePage}
        options={{
          tabBarIcon: ({focused}) => (
            <View
              style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
              <Image
                source={require('../../assets/images/profile-linear.png')}
                resizeMode="contain"
                style={{
                  width: 25,
                  height: 25,
                  tintColor: focused ? '#E56033' : '#FFFFFF',
                }}
              />
              <Text
                style={{
                  color: focused ? '#E56033' : '#FFFFFF',
                  fontSize: 12,
                  fontFamily: 'Outfit-Regular',
                }}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
  shadow: {
    shadowColor: '#FFFFFF',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    borderTopWidth: 0,
  },
});

export default TabDrawer;
