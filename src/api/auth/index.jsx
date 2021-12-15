import callApi from "./../index";

const basicAuth = Buffer.from(
  `${process.env.REACT_APP_BASEAUTH_USER}:${process.env.REACT_APP_BASEAUTH_PASSWORD}`,
  "utf8"
).toString("base64");
const headers = { Authorization: `Basic ${basicAuth}` };

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const signIn = async (body) => {
  try {
    const res = await callApi("auth/signIn", "POST", body, headers)
      .then((res) => {
        // console.log("😈 👿 👿 ~ file: Auth ~ signIn DATA 🧡", res);
        return res.data;
      })
      .catch((err) => {
        // console.log("🚀 ~ file:~ signIn ~ err:", err);
        if (err.message === "Network Error") {
          return null;
        }
        // console.log("🙏🙏🙏 Error Error 🙏🙏🙏 ~ file: Auth ~ signIn");
        // console.log("🚀", err.response.data);
        return err.response.data;
      });
    return res;
  } catch (error) {
    // console.log("💣💣💣~ file: Auth ~ signIn ~ error", error);
    return null;
  }
};

export const signUp = async (body) => {
  try {
    const res = await callApi("auth/signUp", "POST", body, headers)
      .then((res) => {
        // console.log("😈 👿 👿 ~ DATA 🧡", res.data);
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

export const logout = async (token) => {
  try {
    const res = await callApi("auth/logout", "POST", null, headersToken(token))
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

export const findAcc = async (id) => {
  try {
    const res = await callApi(`auth/findAcc/${id}`, "GET", null, headers)
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

export const verifyCode = async (body, id) => {
  try {
    const res = await callApi(
      `auth/signUp/verifyCode/${id}`,
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
