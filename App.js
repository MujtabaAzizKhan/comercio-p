import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import NumericInput from 'react-native-numeric-input';
import DropDownPicker from 'react-native-dropdown-picker';
import {Formik} from 'formik';
import {StripeProvider} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import EncryptedStorage from 'react-native-encrypted-storage';

import * as yup from 'yup';

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
  SafeAreaView,
  Pressable,
} from 'react-native';

import AppNotification from './app/components/AppNotification';

import Product from './app/components/Product';
import {signin, signup, verifyEmail} from './app/utils/auth';
import {updateNotification} from './app/utils/helper';
import client from './app/api/client';

//Page Imports
import CartScreen from './app/pages/CartScreen';
import SellProducts from './app/pages/SellProducts';
import ShoppingHistory from './app/pages/ShoppingHistory';
import SellingHistory from './app/pages/SellingHistory';
import AddToHistory from './app/pages/AddToHistory';
import AddToHistoryManually from './app/pages/AddToHistoryManually';
import AddProductsManually from './app/pages/AddProductsManually';
import AddToHistoryImage from './app/pages/AddToHistoryImage';
import AddProductsBarcode from './app/pages/AddProductsBarcode';
import AddProducts from './app/pages/AddProducts';
import SettingsScreen from './app/pages/SettingsScreen';
import BuyingRecordScreen from './app/pages/BuyingRecordScreen';
import SellingRecordScreen from './app/pages/SellingRecordScreen';
import AddPaymentScreen from './app/pages/AddPaymentScreen';
import ChoosePaymentScreen from './app/pages/ChoosePaymentScreen';
import ContactSupportTeam from './app/pages/ContactSupportTeam';
import ProfilePage from './app/pages/ProfilePage';
import AddCategory from './app/pages/AddCategory';
import UpdateProduct from './app/pages/UpdateProduct';
import ProductPage from './app/pages/ProductPage';
import ViewRequestScreen from './app/pages/ViewRequestScreen';
import TabDrawer from './app/pages/TabDrawer';
import InventoryScreen from './app/pages/InventoryScreen';
import WelcomeScreen from './app/pages/WelcomeScreen';
import OTPScreen from './app/pages/OTPScreen';
import HomeScreen from './app/pages/HomeScreen';
import HomeScreenBarcode from './app/pages/HomeScreenBarcode';
import ProducerHome from './app/pages/ProducerHome';
import SignInScreen from './app/pages/SignInScreen';
import SignUpScreen from './app/pages/SignUpScreen';
import ChoiceScreen from './app/pages/ChoiceScreen';
import DisplayProfile from './app/pages/DisplayProfile';
import ReviewPage from './app/pages/ReviewPage';
import UpdateReviewPage from './app/pages/UpdateReviewPage';
import NotificationChoice from './app/pages/NotificationChoice';
import ConnectionNotifications from './app/pages/ConnectionNotifications';
import Partners from './app/pages/Partners';
import DisplayDistributorProfile from './app/pages/DisplayDistributorProfile';
import GenerateBarcode from './app/pages/GenerateBarcode';
import ViewOrder from './app/pages/ViewOrder';
import ViewSellingOrder from './app/pages/ViewSellingOrder';
import DialogFlow from './app/pages/DialogFlow';
import ReturnAndRefund from './app/pages/ReturnAndRefund';
import ReturnRequests from './app/pages/ReturnRequests';
import PayOnPickup from './app/pages/PayOnPickup';
import ViewReceiptImage from './app/pages/ViewReceiptImage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const NavigatorScreen = ({navigation}) => {
  return (
    <ScrollView>
      <Button
        title="Tab Drawer"
        onPress={() => navigation.navigate('Tab Drawer')}
      />
      <Button
        title="ProductPage"
        onPress={() => navigation.navigate('ProductPage')}
      />
      <Button
        title="Welcome Screen"
        onPress={() => navigation.navigate('Welcome Screen')}
      />
      <Button
        title="Sign in"
        onPress={() => navigation.navigate('Sign in Screen')}
      />
      <Button
        title="Sign Up"
        onPress={() => navigation.navigate('Sign up Screen')}
      />
      <Button title="OTP" onPress={() => navigation.navigate('OTP')} />
      <Button
        title="ChoiceScreen"
        onPress={() => navigation.navigate('ChoiceScreen')}
      />
      <Button title="Cart" onPress={() => navigation.navigate('Cart Screen')} />
      <Button title="Home" onPress={() => navigation.navigate('Home Screen')} />
      <Button
        title="HomeScreenBarcode"
        onPress={() => navigation.navigate('Home Screen Barcode')}
      />

      <Button
        title="Producer Home"
        onPress={() => navigation.navigate('ProducerHome')}
      />

      <Button
        title="Buying Records"
        onPress={() => navigation.navigate('BuyingRecordScreen')}
      />
      <Button
        title="Selling Records"
        onPress={() => navigation.navigate('SellingRecordScreen')}
      />
      <Button
        title="Choose Payment Method"
        onPress={() => navigation.navigate('ChoosePaymentScreen')}
      />
      <Button
        title="Add Payment Method"
        onPress={() => navigation.navigate('AddPaymentScreen')}
      />
      <Button
        title="Settings"
        onPress={() => navigation.navigate('SettingsScreen')}
      />
      <Button
        title={'Inventory Screen'}
        onPress={() => navigation.navigate('Inventory Screen')}
      />
      <Button
        title={'Add Category'}
        onPress={() => navigation.navigate('AddCategory')}
      />
      <Button
        title="View Retailers Request"
        onPress={() => navigation.navigate('View Request Screen')}
      />
      <Button
        title={'Add Products Manually'}
        onPress={() => navigation.navigate('AddProductsManually')}
      />
      <Button
        title={'Add To History Manually'}
        onPress={() => navigation.navigate('AddToHistoryManually')}
      />
      <Button
        title={'Selling History'}
        onPress={() => navigation.navigate('SellingHistory')}
      />
      <Button
        title={'Shopping History'}
        onPress={() => navigation.navigate('ShoppingHistory')}
      />
      <Button
        title={'Add Products'}
        onPress={() => navigation.navigate('AddProducts')}
      />
      <Button
        title={'Add To History'}
        onPress={() => navigation.navigate('AddToHistory')}
      />
      <Button
        title={'Add Products Barcode'}
        onPress={() => navigation.navigate('AddProductsBarcode')}
      />
      <Button
        title={'Add To History Image'}
        onPress={() => navigation.navigate('AddToHistoryImage')}
      />
      <Button
        title={'Sell Products'}
        onPress={() => navigation.navigate('SellProducts')}
      />
      <Button
        title="Contact Support Team"
        onPress={() => navigation.navigate('ContactSupportTeam')}
      />
      <Button
        title="Profile Page"
        onPress={() => navigation.navigate('ProfilePage')}
      />
      <Button
        title="Display Profile"
        onPress={() => navigation.navigate('DisplayProfile')}
      />
      <Button
        title="Notification Choice"
        onPress={() => navigation.navigate('NotificationChoice')}
      />
      <Button
        title="Connection Notifications"
        onPress={() => navigation.navigate('ConnectionNotifications')}
      />
      <Button
        title="Partners"
        onPress={() => navigation.navigate('Partners')}
      />
      <Button
        title="Display Distributor Profile"
        onPress={() => navigation.navigate('DisplayDistributorProfile')}
      />
      <Button
        title="Generate Barcode"
        onPress={() => navigation.navigate('GenerateBarcode')}
      />
      <Button
        title="ViewOrder"
        onPress={() => navigation.navigate('ViewOrder')}
      />
      <Button
        title="ViewSellingOrder"
        onPress={() => navigation.navigate('ViewSellingOrder')}
      />
      <Button
        title="DialogFlow"
        onPress={() => navigation.navigate('DialogFlow')}
      />
      <Button
        title="ReturnAndRefund"
        onPress={() => navigation.navigate('ReturnAndRefund')}
      />
      <Button
        title="ReturnRequests"
        onPress={() => navigation.navigate('ReturnRequests')}
      />
      <Button
        title="PayOnPickup"
        onPress={() => navigation.navigate('PayOnPickup')}
      />
      <Button
        title="ViewReceiptImage"
        onPress={() => navigation.navigate('ViewReceiptImage')}
      />
    </ScrollView>
  );
};
const App = () => {
  const [isLoggedOut, setIsLoggedOut] = useState(true);

  const getUserData = async () => {
    const readData = await EncryptedStorage.getItem('user');

    // Check if 'user' data exists in AsyncStorage
    if (readData !== null) {
      setIsLoggedOut(false);
    }
  };

  useEffect(() => {
    try {
      getUserData();
    } catch (error) {
      console.log(error);
    }
  }, []);
  return (
    <StripeProvider
      publishableKey="pk_test_51Ng4iCCZy7IOAqtQdQ1WZbhbNrujkoR4qYWUY0lHCypKmS6Z24doZDgctBku0UR5cB8MEAnz6kEQRvvhfKGaECG700jlUp5r9I"
      // merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
    >
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          {isLoggedOut ? (
            <Stack.Screen name="navigatorScreen" component={WelcomeScreen} />
          ) : (
            //<Stack.Screen name="navigatorScreen" component={NavigatorScreen} />
            <Stack.Screen name="navigatorScreen" component={TabDrawer} />
            //<Stack.Screen name="navigatorScreen" component={NavigatorScreen} />
          )}
          <Stack.Screen
            name="Welcome Screen"
            component={WelcomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Sign in Screen"
            component={SignInScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Sign up Screen"
            component={SignUpScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="OTP"
            component={OTPScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Cart Screen"
            component={CartScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home Screen"
            component={HomeScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="HomeScreenBarcode"
            component={HomeScreenBarcode}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProducerHome"
            component={ProducerHome}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="BuyingRecordScreen"
            component={BuyingRecordScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SellingRecordScreen"
            component={SellingRecordScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChoosePaymentScreen"
            component={ChoosePaymentScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddPaymentScreen"
            component={AddPaymentScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="View Request Screen"
            component={ViewRequestScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddProducts"
            component={AddProducts}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddToHistory"
            component={AddToHistory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddToHistoryImage"
            component={AddToHistoryImage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddProductsManually"
            component={AddProductsManually}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddToHistoryManually"
            component={AddToHistoryManually}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SellingHistory"
            component={SellingHistory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ShoppingHistory"
            component={ShoppingHistory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddProductsBarcode"
            component={AddProductsBarcode}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="SellProducts"
            component={SellProducts}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ContactSupportTeam"
            component={ContactSupportTeam}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProfilePage"
            component={ProfilePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ProductPage"
            component={ProductPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ChoiceScreen"
            component={ChoiceScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Inventory Screen"
            component={InventoryScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="AddCategory"
            component={AddCategory}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UpdateProduct"
            component={UpdateProduct}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Tab Drawer"
            component={TabDrawer}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DisplayProfile"
            component={DisplayProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="NotificationChoice"
            component={NotificationChoice}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ConnectionNotifications"
            component={ConnectionNotifications}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Partners"
            component={Partners}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DisplayDistributorProfile"
            component={DisplayDistributorProfile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReviewPage"
            component={ReviewPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UpdateReviewPage"
            component={UpdateReviewPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="GenerateBarcode"
            component={GenerateBarcode}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ViewOrder"
            component={ViewOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ViewSellingOrder"
            component={ViewSellingOrder}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="DialogFlow"
            component={DialogFlow}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReturnAndRefund"
            component={ReturnAndRefund}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReturnRequests"
            component={ReturnRequests}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="PayOnPickup"
            component={PayOnPickup}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ViewReceiptImage"
            component={ViewReceiptImage}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </StripeProvider>
  );
};

export default App;
