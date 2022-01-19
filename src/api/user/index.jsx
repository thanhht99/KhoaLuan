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

export const updatePassword = async (body,token) => {
  try {
    const res = await callApi("user/updatePassword", "PATCH", body, headers(token))
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

export const updatePasswordFromAdmin = async (body,token) => {
  try {
    const res = await callApi("user/updatePasswordFromAdmin", "PATCH", body, headers(token))
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

export const getUserByUserName = async (userName, token) => {
  try {
    const res = await callApi(
      `user/detail/${userName}`,
      "GET",
      null,
      headers(token)
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

export const updateUser = async (token, body) => {
  try {
    const res = await callApi("user/updateUser", "PATCH", body, headers(token))
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

export const getAccById = async (id, token) => {
  try {
    const res = await callApi(`user/acc/_id/${id}`, "GET", null, headers(token))
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

export const getAvatarUser = async (token) => {
  try {
    const res = await callApi("user/avatar", "GET", null, headers(token))
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

export const updateAvatar = async (token, body) => {
  try {
    const res = await callApi(
      "user/updateAvatar",
      "PATCH",
      body,
      headers(token)
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
