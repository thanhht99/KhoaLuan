import { SendOutlined, WechatOutlined } from "@ant-design/icons";
import {
  Affix,
  Drawer,
  Tooltip,
  Button,
  Input,
  Space,
  notification,
} from "antd";
import Cookies from "js-cookie";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Message from "./../Message/index";
import { io } from "socket.io-client";
import { API_SOCKET_URL } from "../../constants/config";
import {
  getConversationByUser,
  newConversation,
  updateConversation,
} from "../../api/conversation";
import { getMessageByConversation, newMessage } from "../../api/message";
import { doNotGetData } from "../../constants/doNotGetData";
import { useHistory } from "react-router";

const DrawerChat = (props) => {
  const reduxAcc = useSelector((state) => state.acc.Acc);
  const history = useHistory();
  const token = Cookies.get("token");

  const [messages, setMessages] = useState([]);
  const [newMessageState, setNewMessageState] = useState("");
  // const [arrivalMessage, setArrivalMessage] = useState(null);

  const [state, setState] = useState({
    nameUser: reduxAcc.email ? reduxAcc.email : "Client",
    idUser: reduxAcc._id ? reduxAcc._id : null,
    checkAcc: false,
    drawerVisible: false,
    isConversation: false,
    conversations: null,
    arrivalMessage: null,
    senderId: null,
  });
  const socket = useRef();
  const scrollRef = useRef();

  // console.log("🚀🚀🚀🚀🚀🚀🚀~ state", state);
  // console.log("🔜🔜🔜🔜🔜🔜🔜🔜 messages", messages);

  useEffect(() => {
    const getConversations = async () => {
      const res = await getConversationByUser(state.idUser, token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        // console.log("🤺🤺🤺🤺🤺🤺🤺🤺~ res", res);
        if (res.success) {
          if (res.data.length === 0) {
            const body = {
              senderId: state.idUser,
            };
            const res_newConversation = await newConversation(body, token);
            setState((prev) => ({
              ...prev,
              conversations: res_newConversation.data,
              isConversation: true,
            }));
          }
          if (res.data.length > 0) {
            setState((prev) => ({
              ...prev,
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
        nameUser: reduxAcc.email ? reduxAcc.email : "Client",
        idUser: reduxAcc._id ? reduxAcc._id : null,
        checkAcc: true,
      }));
    }
    if (!token && state.checkAcc) {
      setState((prev) => ({
        ...prev,
        nameUser: reduxAcc.email ? reduxAcc.email : "Client",
        idUser: reduxAcc._id ? reduxAcc._id : null,
        checkAPI: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        nameUser: reduxAcc.email ? reduxAcc.email : "Client",
        idUser: reduxAcc._id ? reduxAcc._id : null,
      }));
    }
  }, [
    token,
    state.checkAcc,
    state.idUser,
    history,
    reduxAcc.email,
    reduxAcc._id,
  ]);

  useEffect(() => {
    const getMessages = async () => {
      const id = state.conversations ? state.conversations._id : state.idUser;
      const res = await getMessageByConversation(id, token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        // console.log("💟💟💟💟💟💟💟💟~ res", res);
        if (res.success) {
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
    socket.current = io(`${API_SOCKET_URL}`);
    socket.current.on("getMessageSP", (data) => {
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

    socket.current.on("receive_message", (data) => {
      // console.log("🔜🔜🔜🔜🔜🔜🔜🔜 data", data);
      if (data.senderId === "Waiting") {
        socket.current.emit("customer_leaveRoom", {
          conversationId: state.conversations
            ? state.conversations._id
            : state.idUser,
        });
      }
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
  });

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const update = () => {
    setState({
      ...state,
      drawerVisible: state.drawerVisible ? false : true,
    });
  };

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: state.idUser,
      text: newMessageState,
      conversationId: state.conversations ? state.conversations._id : null,
    };

    const checkReceive = state.senderId
      ? state.senderId
      : state.conversations
      ? state.conversations.members.find((member) => member !== state.idUser)
      : null;
    const receiverId =
      checkReceive === "Waiting" || checkReceive === "SENDER"
        ? "SENDER"
        : checkReceive;
    // console.log("🥶🥶🥶🥶🥶🥶🥶 ~ receiverId", receiverId);

    if (receiverId !== "SENDER") {
      socket.current.emit("sendMessage", {
        senderId: state.idUser,
        receiverId,
        text: newMessageState,
        conversationId: state.conversations ? state.conversations._id : null,
      });
    }
    if (receiverId === "SENDER") {
      socket.current.emit("waitingRoom", {
        conversationId: state.conversations ? state.conversations._id : null,
      });
    }

    const res = await newMessage(message, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        const body = {
          senderId: state.idUser,
          receiverId: "SENDER",
        };
        await updateConversation(state.conversations._id, body, token);
        setMessages([...messages, res.data]);
        setNewMessageState("");
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
    <>
      <Affix offsetTop="100" style={{}}>
        <Tooltip title="Chat with the store">
          <Button
            type="primary"
            size="large"
            shape="circle"
            icon={
              <WechatOutlined
                style={{
                  color: "white",
                  fontSize: "30px",
                }}
              />
            }
            style={{
              color: "white",
              cursor: "pointer",
              height: "70px",
              width: "70px",
              float: "right",
              marginTop: "600px",
            }}
            onClick={update}
          />
        </Tooltip>
      </Affix>
      <Drawer
        title={state.nameUser}
        width={520}
        placement="right"
        closable={true}
        onClose={() => setState({ ...state, drawerVisible: false })}
        visible={state.drawerVisible}
      >
        <div className="chatBox">
          <div className="chatBoxWrapper">
            <div className="chatBoxTop">
              {messages.map((m, index) => (
                <div ref={scrollRef} key={index}>
                  <Message
                    message={m}
                    name="Supporter"
                    own={m.sender === state.idUser}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="chat-input-area">
          <Space>
            <Input
              placeholder="Enter your message here"
              bordered={true}
              className="input-chat-message"
              style={{ position: "relative", width: "407px" }}
              onChange={(e) => {
                setNewMessageState(e.target.value);
              }}
              value={newMessageState}
            />
            <Button
              type="primary"
              size="large"
              shape="circle"
              htmlType="submit"
              icon={<SendOutlined />}
              onClick={handleSubmit}
            ></Button>
          </Space>
        </div>
      </Drawer>
    </>
  );
};

export default DrawerChat;
