import callApi from "./../index";

const basicAuth = Buffer.from(
  `${process.env.REACT_APP_BASEAUTH_USER}:${process.env.REACT_APP_BASEAUTH_PASSWORD}`,
  "utf8"
).toString("base64");
const headers = { Authorization: `Basic ${basicAuth}` };

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const getProductIsActiveTrue = async () => {
  try {
    const res = await callApi(
      "product/allByActive?isActive=1",
      "GET",
      null,
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

export const getProductIsActiveTrueAndIsPromotionFalse = async () => {
  try {
    const res = await callApi(
      "product/allByActive?isActive=1&isPromotion=0",
      "GET",
      null,
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

export const getProducts = async () => {
  try {
    const res = await callApi("product/all", "GET", null, headers)
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

export const createNewProduct = async (body, token) => {
  try {
    const res = await callApi(
      "product/create",
      "POST",
      body,
      headersToken(token)
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

export const listImageProduct = async (sku, body, token) => {
  try {
    const res = await callApi(
      `product/listImage/${sku}`,
      "PATCH",
      body,
      headersToken(token)
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

export const updateProduct = async (sku, body, token) => {
  try {
    const res = await callApi(
      `product/update/${sku}`,
      "PATCH",
      body,
      headersToken(token)
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

export const updateListImageProduct = async (sku, body, token) => {
  try {
    const res = await callApi(
      `product/updateListImage/${sku}`,
      "PATCH",
      body,
      headersToken(token)
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

export const updateActiveProduct = async (sku, isActive, token) => {
  try {
    const res = await callApi(
      `product/updateActive/${sku}?isActive=${isActive}`,
      "PATCH",
      null,
      headersToken(token)
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
