import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import {
  Input,
  Layout,
  notification,
  Space,
  Button,
  Popconfirm,
  Tooltip,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { doNotGetData } from "../../../constants/doNotGetData";
import {
  getConversationById,
  getConversationByUser,
  updateConversation,
} from "../../../api/conversation";
import { CloseOutlined, SendOutlined } from "@ant-design/icons";
import Message from "../../../_components/Message";
import { getMessageByConversation, newMessage } from "../../../api/message";
import { io } from "socket.io-client";
import { API_SOCKET_URL, API_URL } from "../../../constants/config";
import {
  addNeedSupport,
  insertNeedSupport,
  removeNeedSupport,
} from "../../../store/reducers/listOfNeedSupport";
import { getAccById } from "../../../api/user";

const { Header, Footer, Sider, Content } = Layout;

const ListOfSupport = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const reduxAcc = useSelector((state) => state.acc.Acc);
  const reduxUser = useSelector((state) => state.user.User);
  const reduxNeedSupport = useSelector(
    (state) => state.needSupport.NeedSupport
  );

  const scrollRef = useRef();
  const socket = useRef();

  const initialState = {
    idUser: reduxAcc._id ? reduxAcc._id : null,
    isConversation: false,
    conversations: null,
    checkAcc: false,
    chatWith: null,
    disable: false,
    senderId: null,
  };
  const [messages, setMessages] = useState([]);
  const [newMessageState, setNewMessage] = useState("");
  const [state, setState] = useState(initialState);

  // console.log("🥎🥎🥎🥎🥎🥎~ state", state);
  // console.log("🎂🎂🎂🎂🎂🎂~ messages", messages);

  useEffect(() => {
    socket.current = io(`${API_SOCKET_URL}`);
    socket.current.on("receive_message", (data) => {
      // console.log("🥶🥶🥶🥶🥶🥶🥶~ data", data);

      const arrivalMessage = {
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      };
      setState((prev) => ({
        ...prev,
        senderId: data.senderId,
      }));
      setMessages((prev) => [...prev, arrivalMessage]);
    });
    socket.current.on("getWaitingRoom", (conversations) => {
      const needAdd = conversations.map((conversation) => {
        return conversation.conversationId;
      });

      if (needAdd && needAdd.length > 0) {
        needAdd.forEach((item) => {
          const check = reduxNeedSupport.includes(item);
          if (!check) {
            dispatch(addNeedSupport({ item }));
          }
        });
      }
    });
    socket.current.on("removeConversation", (data) => {
      dispatch(removeNeedSupport({ item: data }));
    });
  });

  useEffect(() => {
    const getConversations = async () => {
      const id = "SENDER";
      const res = await getConversationByUser(id, token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          const newNeedSupport = res.data.map((item) => {
            return item._id;
          });
          dispatch(insertNeedSupport({ newNeedSupport }));
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
            window.location.reload();
          }
          notification["warning"]({
            message: "Warning",
            description: `${res.message}.`,
          });
        }
      }
    };
    getConversations();
  }, [reduxAcc._id, history, token, dispatch]);

  useEffect(() => {
    const getConversations = async () => {
      const res = await getConversationByUser(state.idUser, token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          if (res.data.length === 0) {
            setState((prev) => ({
              ...prev,
              isConversation: false,
            }));
          }
          if (res.data.length > 0) {
            // console.log("🆎🆎🆎🆎🆎🆎~ res.data", res.data);
            const customer = res.data[0].members.filter((item) => {
              return item !== state.idUser;
            });
            const res_acc = await getAccById(customer[0], token);

            setState((prev) => ({
              ...prev,
              disable: true,
              chatWith: res_acc.data,
              conversations: res.data[0],
              isConversation: true,
            }));
          }
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
            window.location.reload();
          }
          notification["warning"]({
            message: "Warning",
            description: `${res.message}.`,
          });
        }
      }
    };

    if (token && !state.checkAcc) {
      getConversations();
      scrollToBottom();

      setState((prev) => ({
        ...prev,
        idUser: reduxAcc._id ? reduxAcc._id : null,
        checkAcc: true,
      }));
    }
    if (!token && state.checkAcc) {
      setState((prev) => ({
        ...prev,
        idUser: reduxAcc._id ? reduxAcc._id : null,
        checkAPI: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        idUser: reduxAcc._id ? reduxAcc._id : null,
      }));
    }
  }, [token, state.checkAcc, state.idUser, history, reduxAcc._id]);

  useEffect(() => {
    const getMessages = async () => {
      const id = state.conversations ? state.conversations._id : state.idUser;
      const res = await getMessageByConversation(id, token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          setState((prev) => ({
            ...prev,
            disable: true,
          }));
          setMessages(res.data);
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning: get message",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
            window.location.reload();
          }
          notification["warning"]({
            message: "Warning: get message",
            description: `${res.message}.`,
          });
        }
      }
    };
    if (state.isConversation && messages.length === 0) {
      getMessages();
    }
  }, [
    state.isConversation,
    messages.length,
    history,
    state.idUser,
    token,
    state.conversations,
  ]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const confirm = async (record) => {
    const res = await getConversationById(record, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        let members = res.data.members;
        const customer = members.filter((item) => {
          return item !== "SENDER";
        });
        const body = {
          senderId: customer[0],
          receiverId: state.idUser,
        };

        await updateConversation(res.data._id, body, token);

        const res_acc = await getAccById(customer[0], token);

        const message = {
          sender: state.idUser,
          text: `${reduxUser.fullName} connected`,
          conversationId: res.data._id,
        };
        await newMessage(message, token);

        socket.current.emit("spSendMessage", {
          conversationId: res.data._id,
          senderId: state.idUser,
          receiverId: customer[0],
          text: `${reduxUser.fullName} connected`,
        });
        dispatch(removeNeedSupport({ item: res.data._id }));
        const res_mess = await getMessageByConversation(record, token);
        const res_conversation = await getConversationByUser(
          state.idUser,
          token
        );

        setState((prev) => ({
          ...prev,
          disable: true,
          chatWith: res_acc.data,
          conversations: res_conversation.data[0],
        }));
        setMessages(res_mess.data);
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        notification["warning"]({
          message: "Warning",
          description: `${res.message}.`,
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: state.idUser,
      text: newMessageState,
      conversationId: state.conversations ? state.conversations._id : null,
    };

    const res = await newMessage(message, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        // console.log("🥶🥶🥶🥶🥶🥶🥶~ res.data", res.data);

        socket.current.emit("sendMessage", {
          senderId: state.idUser,
          receiverId: state.chatWith._id,
          text: newMessageState,
          conversationId: state.conversations ? state.conversations._id : null,
        });
        // setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        notification["warning"]({
          message: "Warning",
          description: `${res.message}.`,
        });
      }
    }
  };

  const handleClose = async (e) => {
    e.preventDefault();

    const customer = state.conversations.members.filter((item) => {
      return item !== state.idUser;
    });
    let cus = customer[0];
    const body = {
      senderId: customer[0],
      receiverId: "Waiting",
    };

    const res = await updateConversation(state.conversations._id, body, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        const message = {
          sender: state.idUser,
          text: `${reduxUser.fullName} has exited the conversation`,
          conversationId: state.conversations ? state.conversations._id : null,
        };

        await newMessage(message, token);

        socket.current.emit("leaveRoom", {
          conversationId: state.conversations ? state.conversations._id : null,
          senderId: state.idUser,
          receiverId: cus,
          text: `${reduxUser.fullName} has exited the conversation`,
        });

        setState({ ...initialState });
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        notification["warning"]({
          message: "Warning",
          description: `${res.message}.`,
        });
      }
    }
  };

  return (
    <div className="dashboard-list-of-support">
      <Layout style={{ padding: "0px", overflow: "hidden" }}>
        <Sider className="sider-supportChat-dashboard">
          <h1
            style={{
              color: "rgb(24 144 255)",
              fontSize: "18px",
              marginLeft: "10px",
            }}
          >
            List of need support
          </h1>
          <div className="scroll-supportChat-dashboard">
            {reduxNeedSupport.map((item, index) => (
              <Popconfirm
                title="Are you sure you would support this customer?"
                onConfirm={() => confirm(item)}
                okText="Yes"
                cancelText="No"
                key={index}
                disabled={state.disable}
              >
                <div className="chatOnlineFriend">
                  <div className="chatOnlineImgContainer">
                    <img
                      className="chatOnlineImg"
                      src="/image/avatar/female.jpg"
                      alt=""
                    />
                  </div>
                  <span
                    className="chatOnlineName"
                    style={{ marginLeft: "10px" }}
                  >
                    Customer {index + 1}
                  </span>
                </div>
              </Popconfirm>
            ))}
          </div>
        </Sider>
        <Layout style={{ padding: "0px", overflow: "hidden" }}>
          {state.chatWith ? (
            <>
              <Header className="header-supportChat-dashboard">
                <div className="chatOnlineFriend-header">
                  <div className="chatOnlineImgContainer">
                    <img
                      className="chatOnlineImg-header"
                      src={
                        state.chatWith
                          ? state.chatWith.user_detail.image
                            ? `${API_URL}/user/avatar/${state.chatWith._id}`
                            : "/image/avatar/female.jpg"
                          : "/image/avatar/female.jpg"
                      }
                      alt=""
                    />
                  </div>
                  <span
                    className="chatOnlineName"
                    style={{ marginLeft: "10px", fontSize: "20px" }}
                  >
                    <strong>
                      {state.chatWith
                        ? state.chatWith.email
                        : "No one to chat with"}
                    </strong>
                  </span>
                </div>
              </Header>

              <Content className="content-supportChat-dashboard">
                {messages.map((m, index) => (
                  <div ref={scrollRef} key={index}>
                    <Message message={m} own={m.sender === state.idUser} />
                  </div>
                ))}
              </Content>

              <Footer className="footer-supportChat-dashboard">
                <div className="chat-input-area-dashboard">
                  <Space>
                    <Input
                      placeholder="Enter your message here"
                      bordered={true}
                      className="input-chat-message"
                      style={{ position: "relative", width: "407px" }}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                      }}
                      value={newMessageState}
                    />

                    <Tooltip title="Send" color="blue">
                      <Button
                        type="primary"
                        size="large"
                        shape="circle"
                        htmlType="submit"
                        icon={<SendOutlined />}
                        onClick={handleSubmit}
                      ></Button>
                    </Tooltip>

                    <Popconfirm
                      title="Are you sure ?"
                      onConfirm={handleClose}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Tooltip title="Close support" color="red">
                        <Button
                          type="danger"
                          size="large"
                          shape="circle"
                          htmlType="submit"
                          icon={<CloseOutlined />}
                        ></Button>
                      </Tooltip>
                    </Popconfirm>
                  </Space>
                </div>
              </Footer>
            </>
          ) : (
            <span className="noConversationText">
              Open a conversation to start a chat.
            </span>
          )}
        </Layout>
      </Layout>
    </div>
  );
};

export { ListOfSupport };
