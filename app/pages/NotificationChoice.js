import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import email from 'react-native-email';

const NotificationChoice = ({navigation}) => {
  const [Subject, setSubject] = useState('');
  const [Body, setBody] = useState('');

  handleEmail = () => {
    const to = ['mujtabaaziz40@gmail.com'];
    email(to, {
      subject: `${Subject}`,
      body: `${Body}`,
      checkCanOpen: false, // Call Linking.canOpenURL prior to Linking.openURL
    }).catch(console.error);
  };
  return (
    <ScrollView>
      <View style={styles.Background}>
        <View style={{marginLeft: '5%', marginTop: '5%'}}>
          <TouchableOpacity
            onPress={() => navigation.dispatch(StackActions.pop(1))}>
            <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
          </TouchableOpacity>
        </View>

        <View style={{alignItems: 'center', marginTop: '5%'}}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Bold',
              fontSize: 37,
            }}>
            Order Tracking & Notifications
          </Text>
        </View>

        <TouchableOpacity>
          <View
            style={{
              alignItems: 'center',
              marginTop: '10%',
              flexDirection: 'row',
            }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Bold',
                fontSize: 23,
                textAlign: 'center',
                marginRight: '5%',
                maxWidth: '25%',
              }}>
              Order Status
            </Text>
            <Image
              source={require('../../assets/images/CheckOrderStatus.jpg')}
              style={{
                height: 300,
                width: 225,
                borderRadius: 20,
                marginLeft: '8%',
              }}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: '#E56033',
            width: '100%',
            height: '0.5%',
            marginTop: '3%',
            marginBottom: '3%',
          }}></View>

        <View>
          <TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={require('../../assets/images/CheckOrderStatus.jpg')}
                style={{
                  height: 300,
                  width: 225,
                  borderRadius: 20,
                }}
              />
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Bold',
                  fontSize: 18,
                  marginLeft: '1%',
                  textAlign: 'center',
                }}>
                Notifications
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

//   return (
//     <ScrollView>
//       <View style={styles.Background}>
//         <View style={{marginLeft: '5%', marginTop: '5%'}}>
//           <TouchableOpacity
//             onPress={() => navigation.dispatch(StackActions.pop(1))}>
//             <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
//           </TouchableOpacity>
//         </View>

//         <View
//           style={{
//             margin: '5%',
//             marginLeft: '10%',
//           }}>
//           <Text
//             style={{color: '#FFFFFF', fontFamily: 'Outfit-Bold', fontSize: 37}}>
//             Order Tracking & Notifications
//           </Text>

//           <View>
//             <TouchableOpacity style={{alignItems: 'center'}}>
//               <Image
//                 source={require('../../assets/images/CheckOrderStatus.jpg')}
//                 style={{
//                   height: 200,
//                   width: 200,
//                 }}
//               />
//             </TouchableOpacity>
//             <View
//               style={{
//                 backgroundColor: 'red',
//                 width: '100%',
//                 height: '20%',
//               }}></View>
//           </View>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
    marginBottom: '50%',
  },
});

export default NotificationChoice;
