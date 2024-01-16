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
import React, { useState, useEffect } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import email from 'react-native-email'





const ContactSupportTeam = ({navigation}) => {

    const [Subject, setSubject] = useState('');
    const [Body, setBody] = useState('');


    handleEmail = () => {

        const to = ['mujtabaaziz40@gmail.com']
        email(to, {
            subject: `${Subject}`,
            body: `${Body}`,
            checkCanOpen: false // Call Linking.canOpenURL prior to Linking.openURL
        }).catch(console.error)

    }

    return (
        <ScrollView>
            <View style={styles.Background}>

                <View style={{ marginLeft: '5%', marginTop: '5%' }}>
                    <TouchableOpacity
                        onPress={() => navigation.dispatch(StackActions.pop(1))}>
                        <Ionicons name={'arrow-back-sharp'} size={25} color={'white'} />
                    </TouchableOpacity>
                </View>

                <View
                    style={{
                        margin: '5%',
                        marginLeft: '10%',
                    }}>
                    <Text
                        style={{ color: '#FFFFFF', fontFamily: 'Outfit-Bold', fontSize: 37 }}>
                        Having Problems?
                    </Text>
                    <Text
                        style={{ color: '#FFFFFF', fontFamily: 'Outfit-Light', fontSize: 37 }}>
                        Contact Us Here!
                    </Text>
                    <Image
                        source={require('../../assets/images/CustomerSupport.jpg')}
                        style={{ height: 300, width: 315, marginBottom: '1%', marginTop: '4%' }}
                    />
                </View>


                <View
                    style={{
                        flexDirection: 'column',
                        marginTop: '0%',
                        marginBottom: '20%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>

                    <View style={{ marginBottom: '5%' }}>
                        <TextInput
                            style={{
                                width: 320,
                                height: 60,
                                padding: 13,
                                paddingLeft: 25,
                                fontSize: 16,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#393840',
                                fontFamily: 'Outfit-Regular',
                                color: '#CB8D78',
                            }}
                            placeholder={'Subject'}
                            onChangeText={newText => setSubject(newText)}
                            placeholderTextColor={'#CB8D78'}
                        />
                    </View>

                    <View>
                        <TextInput
                            style={{
                                width: 320,
                                height: 100,
                                padding: 13,
                                paddingLeft: 25,
                                fontSize: 16,
                                borderRadius: 10,
                                borderWidth: 1,
                                borderColor: '#393840',
                                fontFamily: 'Outfit-Regular',
                                color: '#CB8D78',
                            }}
                            placeholder={'Message'}
                            onChangeText={newText => setBody(newText)}
                            placeholderTextColor={'#CB8D78'}
                            multiline={true}

                        />
                    </View>

                    <TouchableOpacity style={{
                        width: 261,
                        height: 50,
                        marginTop: '8%',
                        borderRadius: 51,
                        borderWidth: 1,
                        borderColor: '#E56033',
                        alignItems: 'center',
                        justifyContent: 'center',

                    }} onPress={handleEmail} >
                        <Text
                            style={{
                                fontFamily: 'Outfit-Regular',
                                color: '#FFFFFF',
                                fontSize: 20,
                            }}>
                            Send
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ScrollView >
    );
};

const styles = StyleSheet.create({
    Background: {
        backgroundColor: '#101010',
        height: '100%',
    },
})

export default ContactSupportTeam;