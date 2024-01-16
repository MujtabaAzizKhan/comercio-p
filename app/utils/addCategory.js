import client from '../api/client';

export const addCategory = async values => {
  try {
    const {data} = await client.post('/category/create', {...values});
    return data;
  } catch (error) {
    if (error?.response?.data) {
      return error.response.data;
    }
    return {success: false, error: error.message};
  }
};
