import callApi from "./../index";

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const saveCart = async (body, token) => {
  try {
    const res = await callApi("cart/save", "POST", body, headersToken(token))
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          return null;
        }
        return err.response.data;
      });
    return res;
  } catch (error) {
    return null;
  }
};

export const getCart = async (token) => {
  try {
    const res = await callApi("cart/", "GET", null, headersToken(token))
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        if (err.message === "Network Error") {
          return null;
        }
        return err.response.data;
      });
    return res;
  } catch (error) {
    return null;
  }
};
