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
import {LineChart, BarChart} from 'react-native-gifted-charts';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import EncryptedStorage from 'react-native-encrypted-storage';
import client from '../api/client';
import {set} from 'mongoose';

const SellingRecordScreen = ({navigation}) => {
  const [userData, setUserData] = useState({});
  const [isLoggedOut, setIsLoggedOut] = useState(true);
  const [history, setHistory] = useState([]);
  const [data, setData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [highestOrder, setHighestOrder] = useState(0);
  const [mostSalesDate, setMostSalesDate] = useState('');

  useEffect(() => {
    getHistory();
  }, []);

  const getHistory = async () => {
    try {
      const readData = await EncryptedStorage.getItem('user');
      setUserData(readData);

      // Check if 'user' data exists in AsyncStorage
      if (readData !== null) {
        setIsLoggedOut(!isLoggedOut);

        // Parse the JSON string to get the user data object
        const retrievedData = JSON.parse(readData);

        const res = await client.get(`/sellingHistory/${retrievedData.id}`);
        const historyData = res.data;
        setHistory(historyData);
        console.log(historyData);
        console.log(historyData[0].sellingHistory);

        if (historyData && Array.isArray(historyData[0].sellingHistory)) {
          setData(
            historyData[0].sellingHistory.map((item, index) => ({
              value: parseFloat(item.totalPrice),
              frontColor: '#006DFF',
              gradientColor: '#009FFF',
              spacing: 6,
              label: new Date(item.createdAt).toLocaleDateString('en-GB'),
            })),
          );
        }
        let totalPrice = 0;
        historyData[0].sellingHistory.forEach(item => {
          totalPrice += parseFloat(item.totalPrice);
        });
        setTotalSales(totalPrice);
        // console.log(totalPrice);
        let totalProducts = 0;
        historyData[0].sellingHistory.forEach(item => {
          totalProducts += item.products.length;
        });
        setTotalProducts(totalProducts);
        // console.log(totalProducts);
        let highestOrder = 0;
        historyData[0].sellingHistory.forEach(item => {
          const totalPrice = parseFloat(item.totalPrice);
          if (totalPrice > highestOrder) {
            highestOrder = totalPrice;
          }
        });
        // console.log(highestOrder);
        setHighestOrder(highestOrder);
        let mostSalesDate = '';
        let mostSales = 0;
        historyData[0].sellingHistory.forEach(item => {
          const totalPrice = parseFloat(item.totalPrice);
          if (totalPrice > mostSales) {
            mostSales = totalPrice;
            mostSalesDate = new Date(item.createdAt).toLocaleDateString(
              'en-GB',
            );
          }
        });
        // console.log(mostSalesDate);
        setMostSalesDate(mostSalesDate);
      }
    } catch (error) {
      console.error('Error fetching the history:', error);
      console.error('Error response:', error.response);
    }
  };

  return (
    <ScrollView style={styles.Background}>
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
            marginLeft: '20.5%',
            marginTop: '-1%',
          }}>
          Selling Records
        </Text>
      </View>
      <View
        style={{
          margin: '5%',
          marginTop: '2%',
          marginLeft: '17%',
          width: '66.5%',
          backgroundColor: '#E56033',
          height: '0.5%',
        }}
      />

      <View>
        {/*Graph*/}
        <View
          style={{
            margin: 1,
            padding: 16,
            borderRadius: 20,
            backgroundColor: '#101010',
          }}>
          <View style={{padding: 20, alignItems: 'center'}}>
            {data.length > 0 && (
              <BarChart
                data={data}
                barWidth={80}
                initialSpacing={5}
                spacing={14}
                barBorderRadius={4}
                showGradient
                yAxisThickness={0}
                xAxisType={'dashed'}
                xAxisColor={'lightgray'}
                yAxisTextStyle={{color: 'lightgray'}}
                stepValue={5000}
                maxValue={50000}
                noOfSections={10}
                yAxisLabelTexts={[
                  '0',
                  '5k',
                  '10k',
                  '15k',
                  '20k',
                  '25k',
                  '30k',
                  '35k',
                  '40k',
                  '45k',
                  '50k',
                ]}
                labelWidth={80}
                xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
                showLine
                lineConfig={{
                  color: '#F29C6E',
                  thickness: 4,
                  curved: true,
                  isAnimated: true,
                  hideDataPoints: true,
                  shiftY: 15,
                  initialSpacing: 0,
                  startIndex: 0,
                  spacing: 30,
                }}
              />
            )}
          </View>
        </View>
        {/*Data*/}
        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <View style={{marginBottom: '3%'}}>
            <View
              style={{
                width: 270,
                height: 40,
                borderRadius: 10,
                borderBottomWidth: 2,
                borderBottomColor: '#393840',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#CB8D78',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginLeft: '2%',
                }}>
                Date
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginRight: '2%',
                }}>
                {new Date().toLocaleDateString('en-GB', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>
          {/*Total Sold*/}
          <View style={{marginBottom: '3%'}}>
            <View
              style={{
                width: 270,
                height: 40,
                borderRadius: 10,
                borderBottomWidth: 2,
                borderBottomColor: '#393840',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#CB8D78',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginLeft: '2%',
                }}>
                Total Sales
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginRight: '2%',
                }}>
                Rs {totalSales}
              </Text>
            </View>
          </View>
          {/*Total Products Sold */}
          <View style={{marginBottom: '3%'}}>
            <View
              style={{
                width: 270,
                height: 40,
                borderRadius: 10,
                borderBottomWidth: 2,
                borderBottomColor: '#393840',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#CB8D78',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginLeft: '2%',
                }}>
                Total Products Sold
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginRight: '2%',
                }}>
                {totalProducts}
              </Text>
            </View>
          </View>
          {/*Highest Order*/}
          <View style={{marginBottom: '3%'}}>
            <View
              style={{
                width: 270,
                height: 40,
                borderRadius: 10,
                borderBottomWidth: 2,
                borderBottomColor: '#393840',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#CB8D78',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginLeft: '2%',
                }}>
                Highest Order
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginRight: '2%',
                }}>
                {highestOrder}
              </Text>
            </View>
          </View>
          {/*Highest Sales Day*/}
          <View style={{marginBottom: '3%'}}>
            <View
              style={{
                width: 270,
                height: 40,
                borderRadius: 10,
                borderBottomWidth: 2,
                borderBottomColor: '#393840',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#CB8D78',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginLeft: '2%',
                }}>
                Highest Sales Day
              </Text>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                  marginRight: '2%',
                }}>
                {mostSalesDate}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{height: 120}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default SellingRecordScreen;
