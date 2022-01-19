import callApi from "./../index";

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const newConversation = async (body, token) => {
  try {
    const res = await callApi(
      "conversation/",
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

export const updateConversation = async (id, body, token) => {
  try {
    const res = await callApi(
      `conversation/update/${id}`,
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

export const getConversationByUser = async (userId, token) => {
  try {
    const res = await callApi(
      `conversation/${userId}`,
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

export const getConversationById = async (id, token) => {
  try {
    const res = await callApi(
      `conversation/_id/${id}`,
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

export const getConversationIncludesTwoUser = async (
  firstUserId,
  secondUserId,
  token
) => {
  try {
    const res = await callApi(
      `conversation/find/${firstUserId}/${secondUserId}`,
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

export const getListUserFromObjectIdConversation = async (body, token) => {
  try {
    const res = await callApi(
      `conversation/getListUserFromObjectIdConversation`,
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

export const getAccByConversationId = async (conversationId, token) => {
  try {
    const res = await callApi(
      `conversation/acc/${conversationId}`,
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