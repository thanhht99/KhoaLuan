import callApi from "./../index";

const basicAuth = Buffer.from(
  `${process.env.REACT_APP_BASEAUTH_USER}:${process.env.REACT_APP_BASEAUTH_PASSWORD}`,
  "utf8"
).toString("base64");
const headers = { Authorization: `Basic ${basicAuth}` };

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const getFormToFeedback = async (id, token) => {
  try {
    const res = await callApi(
      `feedback/form/${id}`,
      "GET",
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

export const getAllFeedback = async (token) => {
  try {
    const res = await callApi(`feedback/all`, "GET", null, headersToken(token))
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

export const feedbackAPI = async (id, body, token) => {
  try {
    const res = await callApi(
      `feedback/${id}`,
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

export const findFeedbackByProduct = async (sku) => {
  try {
    const res = await callApi(`feedback/find/${sku}`, "GET", null, headers)
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

export const updateActiveFeedback = async (_id, isActive, token) => {
  try {
    const res = await callApi(
      `feedback/updateActive/${_id}?isActive=${isActive}`,
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

export const getFeedback = async (orderCode, token) => {
  try {
    const res = await callApi(
      `feedback/show/${orderCode}`,
      "GET",
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
