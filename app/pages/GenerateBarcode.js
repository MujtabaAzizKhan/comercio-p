import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  Platform,
  PermissionsAndroid,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  NavigationContainer,
  StackActions,
  useRoute,
} from '@react-navigation/native';
import {Button, Icon, Input, Dialog} from '@rneui/themed';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import {
  DocumentForward,
  DocumentDownload,
  TickCircle,
} from 'iconsax-react-native';

import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot, {captureRef} from 'react-native-view-shot';
import client from '../api/client';
import Toast from 'react-native-toast-message';

const GenerateBarcode = ({navigation}) => {
  const route = useRoute();
  const barcode = route.params?.barcode;

  const [BarValue, setBarValue] = useState('');
  const [BarImage, setBarImage] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [unique, setUnique] = useState(true);
  const [loading, setloading] = useState(false);
  const [generatedBarcode, setGeneratedBarcode] = useState('');

  const ref = useRef();

  useEffect(() => {
    setGeneratedBarcode(barcode);
  }, []);

  const shareBarcode = useCallback(() => {
    captureRef(ref, {
      format: 'jpg',
      quality: 0.8,
      result: 'base64',
    }).then(
      b64 => {
        const shareImageBase64 = {
          title: 'Barcode',
          message: 'Generated Barcode',
          url: `data:image/jpeg;base64,${b64}`,
        };
        setBarImage(String(shareImageBase64.url));
        Share.open(shareImageBase64);
      },
      error => console.error('Oops, snapshot failed', error),
    );
  }, []);

  const checkUniqueness = async () => {
    try {
      dataBody = {
        barcodeNumber: generatedBarcode,
      };
      // console.log(generatedBarcode);
      const response = await client.post('/product/isBarcodeUnique', dataBody);
      setUnique(response.data.isUnique);
      // console.log(unique);
      if (response.data.isUnique === true) {
        Toast.show({
          type: 'success',
          text1: 'Barcode is Unique',
          visibilityTime: 2000,
          autoHide: true,
          // position: 'bottom',
          // bottomOffset: 80,
          // topOffset: 30,
          // bottomOffset: 40,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Barcode already in use',
          visibilityTime: 2000,
          autoHide: true,
          // position: 'bottom',
          // bottomOffset: 80,
          // topOffset: 30,
          // bottomOffset: 40,
        });
      }
    } catch (error) {
      console.error('Error checking barcode uniqueness:', error);
    }
  };

  const downloadBarcode = useCallback(() => {
    setShowDialog(true);
    setloading(true);
    captureRef(ref, {
      format: 'jpg',
      quality: 0.8,
      result: 'base64',
    }).then(
      async b64 => {
        const shareImageBase64 = {
          title: 'Barcode',
          message: 'Here is my barcode!',
          url: `data:image/jpeg;base64,${b64}`,
        };
        setBarImage(String(shareImageBase64.url));

        if (Platform.OS === 'ios') {
          saveImage(String(shareImageBase64.url));
        } else {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
              {
                title: 'Storage Permission Required',
                message:
                  'App needs access to your storage to download the Barcode image',
              },
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              console.log('Storage Permission Granted');
              saveImage(String(shareImageBase64.url));
            } else {
              console.log('Storage Permission Not Granted');
            }
          } catch (err) {
            console.log(err);
          }
        }
      },
      error => console.error('Oops, snapshot failed', error),
    );
  }, []);

  const saveImage = barcode => {
    setloading(false);
    barcode = barcode.split('data:image/jpeg;base64,')[1];

    let date = new Date();
    const {fs} = RNFetchBlob;
    let filename =
      '/barcode_' +
      Math.floor(date.getTime() + date.getSeconds() / 2) +
      '.jpeg';
    let PictureDir = fs.dirs.DownloadDir + filename;

    fs.writeFile(PictureDir, barcode, 'base64')
      .then(() => {
        RNFetchBlob.android.addCompleteDownload({
          title: 'Barcode generated!',
          useDownloadManager: true,
          showNotification: true,
          notification: true,
          path: PictureDir,
          mime: 'image/jpeg',
          description: 'Image',
        });
      })
      .catch(err => {
        console.log('ERR: ', err);
      });
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Input
          placeholder="Type your Barcode here..."
          placeholderTextColor={'#CB8D78'}
          value={generatedBarcode}
          color="#CB8D78"
          onChangeText={setGeneratedBarcode}
          leftIcon={
            <Icon name="barcode" type="ionicon" size={24} color="#E56033" />
          }
        />

        <ViewShot ref={ref}>
          {generatedBarcode && (
            <Barcode
              format="EAN13"
              value={BarValue ? BarValue : generatedBarcode}
              text={BarValue ? BarValue : generatedBarcode}
              style={{marginBottom: 20}}
              textStyle={{color: '#000'}}
              maxWidth={Dimensions.get('window').width / 1.5}
            />
          )}
        </ViewShot>

        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={() => {
            checkUniqueness();
          }}>
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
            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#FFFFFF',
                marginLeft: '2%',
                fontSize: 16,
              }}>
              Check Uniqueness
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{alignItems: 'center'}} onPress={shareBarcode}>
          <View
            style={{
              width: 220,
              flexDirection: 'row',
              height: 70,
              borderRadius: 51,
              borderWidth: 1,
              marginTop: '5%',
              marginRight: '0.5%',
              borderColor: '#E56033',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DocumentForward size="26" color="#FF8A65" />

            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#FFFFFF',
                marginLeft: '4%',
                fontWeight: '600',
                fontSize: 22,
              }}>
              Share
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{alignItems: 'center'}}
          onPress={downloadBarcode}>
          <View
            style={{
              width: 220,
              flexDirection: 'row',
              height: 70,
              borderRadius: 51,
              marginLeft: '0.5%',
              marginTop: '5%',
              borderWidth: 1,
              borderColor: '#E56033',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <DocumentDownload size="26" color="#FF8A65" />

            <Text
              style={{
                fontFamily: 'Outfit-Regular',
                color: '#FFFFFF',
                marginLeft: '4%',
                fontWeight: '600',
                fontSize: 22,
              }}>
              Download
            </Text>
          </View>
        </TouchableOpacity>

        <Dialog
          isVisible={showDialog}
          onBackdropPress={() => setShowDialog(!showDialog)}>
          {loading ? (
            <Dialog.Loading />
          ) : (
            <>
              <Dialog.Title
                titleStyle={{color: '#000', fontSize: 25}}
                title="Barcode Downloaded"
              />
              <Text style={{color: '#000', fontSize: 18}}>
                Your barcode has been downloaded successfully. Check it in your{' '}
                <Text style={{fontWeight: 'bold'}}>Downloads</Text> folder.
              </Text>
            </>
          )}
        </Dialog>
        <Text
          style={{
            color: 'white',
            fontSize: 10,
            marginTop: '10%',
            textAlign: 'left',
            maxWidth: '70%',
          }}>
          Important! The 13th digit is a specific check digit. Make sure you
          keep trying until you get the correct one. Also make sure you use a 13
          digit barcode. Thank you!
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#101010',
    height: '100%',
    marginBottom: '90%',
    justifyContent: 'center',
  },
  iconButtonHomeContainer: {marginRight: 10},
  iconButtonHome: {
    type: 'material-community',
    size: 50,
    color: 'white',
  },
  titleButtonHome: {
    fontWeight: '700',
    fontSize: 25,
  },
  buttonHome: {
    backgroundColor: '#E56033',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 30,
    height: 100,
  },
  buttonHomeContainer: {
    width: 220,
    marginHorizontal: 50,
    marginVertical: 20,
  },
});

export default GenerateBarcode;
