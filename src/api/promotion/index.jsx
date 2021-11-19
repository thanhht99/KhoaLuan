import callApi from "./../index";

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const getAllPromotions = async (token) => {
  try {
    const res = await callApi(`promotion/all`, "GET", null, headersToken(token))
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

export const createNewPromotion = async (body, token) => {
  try {
    const res = await callApi(
      `promotion/create`,
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

export const updatePromotion = async (id, body, token) => {
  try {
    const res = await callApi(
      `promotion/update/${id}`,
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

export const updateActivePromotion = async (id, isActive, token) => {
  try {
    const res = await callApi(
      `promotion/updateActive/${id}?isActive=${isActive}`,
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
