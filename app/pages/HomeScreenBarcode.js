import React, {useState, useEffect} from 'react';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';
import 'react-native-gesture-handler';

import Toast from 'react-native-toast-message';

import {
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  StyleSheet,
  Modal,
  RefreshControl,
} from 'react-native';
import {ScanBarcode} from 'iconsax-react-native';

import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';

const HomeScreenBarcode = ({navigation}) => {
  const [profiles, setProfiles] = useState([]);

  const [HasCameraPermit, setHasCameraPermit] = useState();
  const device = useCameraDevice('back');
  const [modalVisible, setModalVisible] = useState(false);
  const [isCameraVisible, setCameraVisible] = useState(false);

  useEffect(() => {
    onAuth();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress,
    );
  }, []);

  const handleBackPress = () => {
    // Perform any action you want when the back button is pressed

    setCameraVisible(false);
  };
  const onAuth = async () => {
    setHasCameraPermit(true);
    // const grantedStatus = await Camera.requestCameraPermission();
    // if (grantedStatus === 'granted') {
    //   setHasCameraPermit(true);
    // } else {
    //   setHasCameraPermit(false);
    // }
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      // console.log(`Scanned ${codes.length} codes!`);
      // Hide the camera when a code is scanned
      // console.log(codes?.[0]?.value);
      setCameraVisible(false);

      findProduct(codes?.[0]?.value);
    },
  });

  const findProduct = async value => {
    // console.log(value);

    const readData = await EncryptedStorage.getItem('user');
    const retrievedData = JSON.parse(readData);

    try {
      const dataBody = {
        barcodeNumber: value,
        userId: retrievedData.id,
      };
      await client
        .post('/product/findProductDistributorHome', dataBody)
        .then(function (response) {
          console.log(response.data);
          if (response.data) {
            const responseData = response.data;
            const id = responseData._id;
            const isPublished = responseData.isPublished;
            console.log(id, isPublished);

            navigation.navigate('ProductPage', {id, isPublished});
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <View style={styles.Background}>
      {!isCameraVisible ? (
        <View
          style={{
            marginTop: '50%',
            height: '40%',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            marginHorizontal: '10%',
          }}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Outfit-Regular',
              fontSize: 40,
            }}>
            Scan Barcode
          </Text>
          <TouchableOpacity
            onPress={() => {
              setCameraVisible(true);
            }}
            style={{alignItems: 'center'}}>
            <ScanBarcode size="200" color="#FF8A65" />
          </TouchableOpacity>
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
});

export default HomeScreenBarcode;
