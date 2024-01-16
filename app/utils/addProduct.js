import client from '../api/client';

export const addProduct = async (values, id) => {
  try {
    const {data} = await client.post(`/product/create/${id}`, {...values});
    return data;
  } catch (error) {
    if (error?.response?.data) {
      return error.response.data;
    }
    return {success: false, error: error.message};
  }
};
