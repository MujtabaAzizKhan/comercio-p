import client from '../api/client';
import EncryptedStorage from 'react-native-encrypted-storage';

export const signup = async values => {
  try {
    const {data} = await client.post('/user/create', {...values});
    return data;
  } catch (error) {
    if (error?.response?.data) {
      return error.response.data;
    }
    return {success: false, error: error.message};
  }
};

export const signin = async values => {
  try {
    //Token is in this data
    const {data} = await client.post('/user/signin', {...values});
    console.log(data);

    await EncryptedStorage.setItem('user', JSON.stringify(data));
    return data;
  } catch (error) {
    if (error?.response?.data) {
      return error.response.data;
    }
    return {success: false, error: error.message};
  }
};

export const verifyEmail = async (otp, userId) => {
  try {
    const {data} = await client.post('/user/verify-email', {otp, userId});
    return data;
  } catch (error) {
    if (error?.response?.data) {
      return error.response.data;
    }
    return {success: false, error: error.message};
  }
};
