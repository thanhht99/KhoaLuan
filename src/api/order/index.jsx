import callApi from "../index";

const basicAuth = Buffer.from(
  `${process.env.REACT_APP_BASEAUTH_USER}:${process.env.REACT_APP_BASEAUTH_PASSWORD}`,
  "utf8"
).toString("base64");
const headers = { Authorization: `Basic ${basicAuth}` };

export const createOrder = async (body) => {
  try {
    const res = await callApi("order", "POST", body, headers)
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

export const uploadPaymentImage = async (orderCode, body) => {
  try {
    const res = await callApi(
      `firebase/upload/${orderCode}`,
      "POST",
      body,
      headers
    )
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
