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
import {LineChart, BarChart} from 'react-native-gifted-charts';
import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {NavigationContainer, StackActions} from '@react-navigation/native';

const BuyingRecordScreen = ({navigation}) => {
  const [selectedValue, setSelectedValue] = useState('Daily');
  const dailyData = [
    {
      value: 2500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: '01:00',
    },
    {value: 2400, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 3500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: '06:00',
    },
    {value: 3000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 4500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: '12:00',
    },
    {value: 4000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 5200,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: '18:00',
    },
    {value: 4900, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 3000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: '24:00',
    },
    {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  ];
  const weeklyData = [
    {
      value: 2500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Mon',
    },
    {value: 2400, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 3500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Tue',
    },
    {value: 3000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 4500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Wed',
    },
    {value: 4000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 5200,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Thu',
    },
    {value: 4900, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 3000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Fri',
    },
    {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
    {
      value: 1000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Sat',
    },
    {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
    {
      value: 5500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Sun',
    },
    {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  ];
  const monthlyData = [
    {
      value: 2500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Jan',
    },
    {value: 2400, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 3500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Feb',
    },
    {value: 3000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 4500,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Mar',
    },
    {value: 4000, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 5200,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'Apr',
    },
    {value: 4900, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},

    {
      value: 3000,
      frontColor: '#006DFF',
      gradientColor: '#009FFF',
      spacing: 6,
      label: 'May',
    },
    {value: 2800, frontColor: '#3BE9DE', gradientColor: '#93FCF8'},
  ];
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
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginVertical: '1%',
        }}>
        <TouchableOpacity onPress={() => setSelectedValue('Daily')}>
          {selectedValue == 'Daily' ? (
            <View>
              <Text
                style={{
                  color: '#E56033',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                }}>
                Daily
              </Text>
              <View
                style={{
                  width: '100%',
                  height: '2%',
                  backgroundColor: '#E56033',
                }}
              />
            </View>
          ) : (
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
              }}>
              Daily
            </Text>
          )}
        </TouchableOpacity>
        <View>
          <TouchableOpacity onPress={() => setSelectedValue('Weekly')}>
            {selectedValue == 'Weekly' ? (
              <View>
                <Text
                  style={{
                    color: '#E56033',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                  }}>
                  Week
                </Text>
                <View
                  style={{
                    width: '100%',
                    height: '2%',
                    backgroundColor: '#E56033',
                  }}
                />
              </View>
            ) : (
              <Text
                style={{
                  color: '#FFFFFF',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                }}>
                Week
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setSelectedValue('Monthly')}>
          {selectedValue == 'Monthly' ? (
            <View>
              <Text
                style={{
                  color: '#E56033',
                  fontFamily: 'Outfit-Regular',
                  fontSize: 16,
                }}>
                Month
              </Text>
              <View
                style={{
                  width: '100%',
                  height: '2%',
                  backgroundColor: '#E56033',
                }}
              />
            </View>
          ) : (
            <Text
              style={{
                color: '#FFFFFF',
                fontFamily: 'Outfit-Regular',
                fontSize: 16,
              }}>
              Month
            </Text>
          )}
        </TouchableOpacity>
      </View>
      {/* Daily */}
      {selectedValue === 'Daily' ? (
        <View>
          {/*Daily Graph*/}
          <View
            style={{
              margin: 1,
              padding: 16,
              borderRadius: 20,
              backgroundColor: '#101010',
            }}>
            <View style={{padding: 20, alignItems: 'center'}}>
              <BarChart
                data={dailyData}
                barWidth={16}
                initialSpacing={10}
                spacing={14}
                barBorderRadius={4}
                showGradient
                yAxisThickness={0}
                xAxisType={'dashed'}
                xAxisColor={'lightgray'}
                yAxisTextStyle={{color: 'lightgray'}}
                stepValue={1000}
                maxValue={6000}
                noOfSections={6}
                yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
                labelWidth={40}
                xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
                showLine
                lineConfig={{
                  color: '#F29C6E',
                  thickness: 3,
                  curved: true,
                  hideDataPoints: true,
                  shiftY: 20,
                  initialSpacing: -30,
                }}
              />
            </View>
          </View>
          {/*Daily Data*/}
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
                  08 December 2023
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
                  Rs 20,000
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
                  5
                </Text>
              </View>
            </View>
            {/*Compared To Previous Day*/}
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
                  Compared to Yesterday
                </Text>
                <Text
                  style={{
                    color: 'green',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                    marginRight: '2%',
                  }}>
                  +2%
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : // Weekly
      selectedValue === 'Weekly' ? (
        <View>
          {/*Monthly Graph*/}
          <View
            style={{
              margin: 10,
              padding: 16,
              borderRadius: 20,
              backgroundColor: '#101010',
            }}>
            <View style={{padding: 20, alignItems: 'center'}}>
              <BarChart
                data={weeklyData}
                barWidth={16}
                initialSpacing={10}
                spacing={14}
                barBorderRadius={4}
                showGradient
                yAxisThickness={0}
                xAxisType={'dashed'}
                xAxisColor={'lightgray'}
                yAxisTextStyle={{color: 'lightgray'}}
                stepValue={1000}
                maxValue={6000}
                noOfSections={6}
                yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
                labelWidth={40}
                xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
                showLine
                lineConfig={{
                  color: '#F29C6E',
                  thickness: 3,
                  curved: true,
                  hideDataPoints: true,
                  shiftY: 20,
                  initialSpacing: -30,
                }}
              />
            </View>
          </View>
          {/*Weekly*/}
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
                  Week
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                    marginRight: '2%',
                  }}>
                  17-23 April,2023
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
                  Total Sold
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                    marginRight: '2%',
                  }}>
                  Rs 20,000
                </Text>
              </View>
            </View>
            {/*Total Items Sold*/}
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
                  Total Items Sold
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                    marginRight: '2%',
                  }}>
                  120
                </Text>
              </View>
            </View>
            {/*Compared To last week*/}
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
                  Compared to last week
                </Text>
                <Text
                  style={{
                    color: 'green',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                    marginRight: '2%',
                  }}>
                  +2%
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : // Monthly
      selectedValue === 'Monthly' ? (
        <View>
          {/*Monthly Graph*/}
          <View
            style={{
              margin: 10,
              padding: 16,
              borderRadius: 20,
              backgroundColor: '#101010',
            }}>
            <View style={{padding: 20, alignItems: 'center'}}>
              <BarChart
                data={monthlyData}
                barWidth={16}
                initialSpacing={10}
                spacing={14}
                barBorderRadius={4}
                showGradient
                yAxisThickness={0}
                xAxisType={'dashed'}
                xAxisColor={'lightgray'}
                yAxisTextStyle={{color: 'lightgray'}}
                stepValue={1000}
                maxValue={6000}
                noOfSections={6}
                yAxisLabelTexts={['0', '1k', '2k', '3k', '4k', '5k', '6k']}
                labelWidth={40}
                xAxisLabelTextStyle={{color: 'lightgray', textAlign: 'center'}}
                showLine
                lineConfig={{
                  color: '#F29C6E',
                  thickness: 3,
                  curved: true,
                  hideDataPoints: true,
                  shiftY: 20,
                  initialSpacing: -30,
                }}
              />
            </View>
          </View>
          {/*Weekly*/}
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
                  Year
                </Text>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 16,
                    marginRight: '2%',
                  }}>
                  2023
                </Text>
              </View>
            </View>
            {/*Total Sales*/}
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
                  Rs 20,000
                </Text>
              </View>
            </View>
            {/*Total Products Sold*/}
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
                  100
                </Text>
              </View>
            </View>
          </View>
        </View>
      ) : null}
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

export default BuyingRecordScreen;
