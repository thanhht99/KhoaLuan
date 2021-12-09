import callApi from "../index";

const basicAuth = Buffer.from(
  `${process.env.REACT_APP_BASEAUTH_USER}:${process.env.REACT_APP_BASEAUTH_PASSWORD}`,
  "utf8"
).toString("base64");
const headers = { Authorization: `Basic ${basicAuth}` };

export const bestSeller = async () => {
  try {
    const res = await callApi("home/bestSeller", "GET", null, headers)
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

export const newProducts = async () => {
  try {
    const res = await callApi("home/newProducts", "GET", null, headers)
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

export const vouchers = async () => {
  try {
    const res = await callApi("home/vouchers", "GET", null, headers)
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
