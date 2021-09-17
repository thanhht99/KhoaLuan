import callApi from "./../index";

const headers = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const getUser = async (token) => {
  try {
    const res = await callApi("user/", "GET", null, headers(token))
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

export const getAcc = async (token) => {
  try {
    const res = await callApi("user/acc/info", "GET", null, headers(token))
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
