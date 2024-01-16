import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import React from 'react';

const SellProducts = () => {
  return (
    <View style={styles.Background}>
      <ScrollView>
        <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <Text
            style={{
              fontFamily: 'outfit',
              textAlign: 'left',
              fontSize: 23,
              marginTop: 20,
              fontWeight: 'bold',
              color: 'white',
            }}>
            Comercio
          </Text>
          <TouchableOpacity
            style={{height: 25, width: 25, marginLeft: '50%', marginTop: 20}}>
            <Image
              source={require('../../assets/images/ShoppingCart.png')}
              style={{height: 25, width: 25}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 45,
          }}>
          <Text
            style={{
              color: '#E56033',
              fontSize: 18,
              textDecorationLine: 'underline',
              fontFamily: 'Outfit-Regular',
            }}>
            Products
          </Text>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Outfit-Regular',
              marginLeft: 40,
            }}>
            Retailers
          </Text>
        </View>

        <View
          style={{
            backgroundColor: '#242222',
            marginTop: 10,
            borderRadius: 40,
            width: 356,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            marginLeft: 'auto',
            marginRight: 'auto',
            flexDirection: 'row',
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Outfit-Regular',
            }}>
            Search
          </Text>
          <TouchableOpacity style={{height: 24, width: 24, marginLeft: '60%'}}>
            <Image
              source={require('../../assets/images/barcode1.png')}
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>

          <TouchableOpacity style={{height: 24, width: 24, marginLeft: 10}}>
            <Image
              source={require('../../assets/images/search1.png')}
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20,
          }}>
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontFamily: 'Outfit-Regular',
            }}>
            Your Products
          </Text>

          <TouchableOpacity>
            <View
              style={{
                backgroundColor: '#E56033',
                height: 31,
                width: 131,
                borderRadius: 9,
                marginLeft: 60,
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 18,
                  fontFamily: 'Outfit-Regular',
                  padding: 3,
                }}>
                + Add Products
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20,
          }}>
          <TouchableOpacity style={{width: 97, height: 49}}>
            <View
              style={{
                width: 97,
                height: 49,
                borderRadius: 7,
                backgroundColor: '#E56033',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'Outfit-Regular',
                  maxWidth: 65,
                  textAlign: 'left',
                  marginTop: 8,
                  marginLeft: 2,
                }}>
                All Categories
              </Text>
              <Image
                source={require('../../assets/images/category1.png')}
                style={{height: 24, width: 24, marginLeft: 5, marginTop: 14}}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width: 97, height: 49}}>
            <View
              style={{
                width: 97,
                height: 49,
                borderRadius: 7,
                backgroundColor: '#242222',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'Outfit-Regular',
                  maxWidth: 40,
                  textAlign: 'left',
                  marginTop: 8,
                  marginLeft: 12,
                }}>
                On Sale
              </Text>
              <Image
                source={require('../../assets/images/radar-2.png')}
                style={{height: 24, width: 24, marginLeft: 25, marginTop: 14}}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={{width: 97, height: 49}}>
            <View
              style={{
                width: 97,
                height: 49,
                borderRadius: 7,
                backgroundColor: '#242222',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 13,
                  fontFamily: 'Outfit-Regular',
                  maxWidth: 40,
                  textAlign: 'left',
                  marginTop: 8,
                  marginLeft: 12,
                }}>
                Out of Stock
              </Text>
              <Image
                source={require('../../assets/images/shopping-bag.png')}
                style={{height: 24, width: 24, marginLeft: 12, marginTop: 14}}
              />
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <TouchableOpacity>
            <View
              style={{
                height: 104,
                width: 100,
                backgroundColor: '#3F3F3F',
                borderRadius: 7,
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/images/gpu.png')}
                style={{
                  height: 39,
                  width: 81,
                  justifyContent: 'center',
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                Rtx 3090
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={{
                height: 104,
                width: 100,
                backgroundColor: '#000000',
                borderRadius: 7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/pc1.png')}
                style={{
                  height: 60,
                  width: 54,
                  justifyContent: 'center',
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                PC
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <TouchableOpacity>
            <View
              style={{
                height: 104,
                width: 100,
                backgroundColor: '#3F3F3F',
                borderRadius: 7,
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/images/gpu.png')}
                style={{
                  height: 39,
                  width: 81,
                  justifyContent: 'center',
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                Rtx 3090
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={{
                height: 104,
                width: 100,
                backgroundColor: '#000000',
                borderRadius: 7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/pc1.png')}
                style={{
                  height: 60,
                  width: 54,
                  justifyContent: 'center',
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                PC
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginTop: 40,
          }}>
          <TouchableOpacity>
            <View
              style={{
                height: 104,
                width: 100,
                backgroundColor: '#3F3F3F',
                borderRadius: 7,
                justifyContent: 'center',
              }}>
              <Image
                source={require('../../assets/images/gpu.png')}
                style={{
                  height: 39,
                  width: 81,
                  justifyContent: 'center',
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                Rtx 3090
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View
              style={{
                height: 104,
                width: 100,
                backgroundColor: '#000000',
                borderRadius: 7,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../assets/images/pc1.png')}
                style={{
                  height: 60,
                  width: 54,
                  justifyContent: 'center',
                  marginLeft: 8,
                }}
              />
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontFamily: 'Outfit-Regular',
                  textAlign: 'center',
                  marginTop: 8,
                }}>
                PC
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  Background: {
    backgroundColor: '#101010',
    height: '100%',
  },
});

export default SellProducts;
