import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {StackActions} from '@react-navigation/native';
import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

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

const ViewRequestScreen = ({navigation}) => {
  return (
    <ScrollView style={styles.Background}>
      <View>
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
              marginLeft: '20%',
            }}>
            View Requests
          </Text>
        </View>

        <View
          style={{
            margin: '5%',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: '10%',
          }}>
          <Text
            style={{
              color: '#FFFFFF',
              fontFamily: 'Outfit-Regular',
              fontSize: 16,
            }}>
            4 NEW REQUESTS
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/*View request card 1*/}
          <View
            style={{
              width: 261,
              height: 215,
              padding: 13,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              borderRadius: 10,
            }}>
            <View style={{flexDirection: 'row', marginLeft: '-42%'}}>
              <View
                style={{
                  backgroundColor: '#E56033',
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{height: 34, width: 34, borderRadius: 34}}
                  source={require('../../assets/images/S0mple.jpg')}
                />
              </View>
              <View style={{marginLeft: '5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Bold',
                    fontSize: 13,
                  }}>
                  The King
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <AntDesign name={'staro'} size={12} color={'gold'} />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{margin: '3.5%', marginLeft: '-20%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Name
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Sheesh Shop
                </Text>
              </View>
              <View style={{margin: '3.5%', marginLeft: '15%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Type
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Cash and carry
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', margin: '5%', marginLeft: '-26%'}}>
              <Octicons name={'location'} size={20} color={'#FFFFFF'} />

              <View style={{marginLeft: '3.5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 12,
                  }}>
                  Block 6 Gulberg,Lahore
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  #457, 2nd Floor
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#CB8D78',
                    }}>
                    Decline
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    backgroundColor: '#E56033',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                    }}>
                    Accept
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*View request card 2*/}
          <View
            style={{
              width: 261,
              height: 215,
              padding: 13,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              borderRadius: 10,
              marginTop: '4%',
            }}>
            <View style={{flexDirection: 'row', marginLeft: '-42%'}}>
              <View
                style={{
                  backgroundColor: '#E56033',
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{height: 34, width: 34, borderRadius: 34}}
                  source={require('../../assets/images/S0mple.jpg')}
                />
              </View>
              <View style={{marginLeft: '5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Bold',
                    fontSize: 13,
                  }}>
                  The King
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <AntDesign name={'staro'} size={12} color={'gold'} />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{margin: '3.5%', marginLeft: '-20%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Name
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Sheesh Shop
                </Text>
              </View>
              <View style={{margin: '3.5%', marginLeft: '15%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Type
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Cash and carry
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', margin: '5%', marginLeft: '-26%'}}>
              <Octicons name={'location'} size={20} color={'#FFFFFF'} />

              <View style={{marginLeft: '3.5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 12,
                  }}>
                  Block 6 Gulberg,Lahore
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  #457, 2nd Floor
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#CB8D78',
                    }}>
                    Decline
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    backgroundColor: '#E56033',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                    }}>
                    Accept
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*View request card 3*/}
          <View
            style={{
              width: 261,
              height: 215,
              padding: 13,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              borderRadius: 10,
              marginTop: '4%',
            }}>
            <View style={{flexDirection: 'row', marginLeft: '-42%'}}>
              <View
                style={{
                  backgroundColor: '#E56033',
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{height: 34, width: 34, borderRadius: 34}}
                  source={require('../../assets/images/S0mple.jpg')}
                />
              </View>
              <View style={{marginLeft: '5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Bold',
                    fontSize: 13,
                  }}>
                  The King
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <AntDesign name={'staro'} size={12} color={'gold'} />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{margin: '3.5%', marginLeft: '-20%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Name
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Sheesh Shop
                </Text>
              </View>
              <View style={{margin: '3.5%', marginLeft: '15%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Type
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Cash and carry
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', margin: '5%', marginLeft: '-26%'}}>
              <Octicons name={'location'} size={20} color={'#FFFFFF'} />

              <View style={{marginLeft: '3.5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 12,
                  }}>
                  Block 6 Gulberg,Lahore
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  #457, 2nd Floor
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#CB8D78',
                    }}>
                    Decline
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    backgroundColor: '#E56033',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                    }}>
                    Accept
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          {/*View request card 4*/}
          <View
            style={{
              width: 261,
              height: 215,
              padding: 13,
              borderWidth: 1,
              borderColor: '#393840',
              alignItems: 'center',
              borderRadius: 10,
              marginTop: '4%',
            }}>
            <View style={{flexDirection: 'row', marginLeft: '-42%'}}>
              <View
                style={{
                  backgroundColor: '#E56033',
                  width: 36,
                  height: 36,
                  borderRadius: 36,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  style={{height: 34, width: 34, borderRadius: 34}}
                  source={require('../../assets/images/S0mple.jpg')}
                />
              </View>
              <View style={{marginLeft: '5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Bold',
                    fontSize: 13,
                  }}>
                  The King
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <AntDesign name={'staro'} size={12} color={'gold'} />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                  <AntDesign
                    name={'staro'}
                    size={12}
                    style={{marginLeft: '1%'}}
                    color={'gold'}
                  />
                </View>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <View style={{margin: '3.5%', marginLeft: '-20%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Name
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Sheesh Shop
                </Text>
              </View>
              <View style={{margin: '3.5%', marginLeft: '15%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Shop Type
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  Cash and carry
                </Text>
              </View>
            </View>
            <View
              style={{flexDirection: 'row', margin: '5%', marginLeft: '-26%'}}>
              <Octicons name={'location'} size={20} color={'#FFFFFF'} />

              <View style={{marginLeft: '3.5%'}}>
                <Text
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 12,
                  }}>
                  Block 6 Gulberg,Lahore
                </Text>
                <Text
                  style={{
                    color: '#CB8D78',
                    fontFamily: 'Outfit-Regular',
                    fontSize: 10,
                  }}>
                  #457, 2nd Floor
                </Text>
              </View>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#CB8D78',
                    }}>
                    Decline
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity>
                <View
                  style={{
                    width: 111,
                    height: 50,
                    padding: 13,
                    margin: '2%',
                    textAlign: 'center',
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: '#393840',
                    backgroundColor: '#E56033',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      fontFamily: 'Outfit-Regular',
                      color: '#FFFFFF',
                    }}>
                    Accept
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
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
});

export default ViewRequestScreen;
