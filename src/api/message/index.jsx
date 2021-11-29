import callApi from "./../index";

const headersToken = (token) => {
  return { Authorization: `Basic ${token}` };
};

export const newMessage = async (body, token) => {
  try {
    const res = await callApi("messages/", "POST", body, headersToken(token))
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

export const getMessageByConversation = async (conversationId, token) => {
  try {
    const res = await callApi(
      `messages/${conversationId}`,
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
