import React, { useEffect, useState } from "react";
import "./index.css";
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, notification, Modal } from "antd";
import { forgetPassword, signIn } from "./../../../api/auth/index";
import { getAcc, getUser } from "./../../../api/user/index";
import { validateMessages } from "./../../../constants/validateMessages";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { insertAcc } from "./../../../store/reducers/acc";
import { insertUser } from "./../../../store/reducers/user";
import { SingInWithGoogle } from "./SingInWithGoogle";
import { doNotGetData } from "../../../constants/doNotGetData";

const SignIn = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const token = Cookies.get("token");
  if (token) {
    history.push("/home");
  }
  useEffect(() => {});

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const res = await signIn(values);

    if (res === null) {
      history.push("/server-upgrade");
    } else if (res.success === true) {
      Cookies.set("token", res.data, { path: "/", expires: 2 });
      const token = Cookies.get("token");
      const acc = await getAcc(token);
      dispatch(insertAcc({ newAcc: acc.data }));
      const user = await getUser(token);
      dispatch(insertUser({ newUser: user.data }));

      if (acc.data.role === "Saler") {
        history.push("/dashboard");
      }
      if (acc.data.role === "Admin") {
        history.push("/dashboard");
      }
      if (acc.data.role === "Customer") {
        history.push("/home");
      }
    } else if (res.success === false) {
      if (res.code === 404 || res.code === 403) {
        notification["warning"]({
          message: "Warning",
          description: `${res.message}`,
        });
      } else {
        notification["error"]({
          message: "Error",
          description: `${res.message}`,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinishForgotPassword = async (values) => {
    const body = {
      userNameOrEmail: values.userNameOrEmail1,
    };

    const res = await forgetPassword(body);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        notification["success"]({
          message: "Success:",
          description: `${res.data}`,
        });
        form.resetFields();
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning:",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
        }
        if (typeof res.message === "object") {
          const message = Object.keys(res.message).map((key) => {
            return res.message[key];
          });
          notification["warning"]({
            message: "Warning:",
            description: `${message}`,
          });
        } else {
          notification["warning"]({
            message: "Warning:",
            description: `${res.message}`,
          });
        }
      }
    }
  };

  const onFinishFailedForgotPassword = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="htmlLogin" id="htmlLogin">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="form">
        <h1 className="texttop" style={{ color: "white" }}>
          Sign In
        </h1>
        <Form
          className={"my-form"}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 8,
          }}
          style={{ height: "100%", width: "100%" }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          validateMessages={validateMessages}
        >
          <Form.Item
            label="Username or Email"
            name="userNameOrEmail"
            rules={[
              {
                required: true,
                type: "string",
                max: 32,
              },
            ]}
          >
            <Input placeholder="Username or Email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                type: "string",
                min: 6,
                max: 50,
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <span
              className="rememberMe"
              style={{ color: "#1890ff", cursor: "pointer" }}
              onClick={showModal}
            >
              Forgot password?
            </span>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 10,
            }}
          >
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
            <SingInWithGoogle />
          </Form.Item>
        </Form>
        <Modal
          title="Forgot password"
          visible={isModalVisible}
          okButtonProps={{ disabled: true }}
          onCancel={handleCancel}
          // cancelButtonProps={{ disabled: true }}
        >
          <Form
            className={"form-forgot-password"}
            form={form}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 18 }}
            style={{ height: "100%", width: "100%" }}
            onFinish={onFinishForgotPassword}
            onFinishFailed={onFinishFailedForgotPassword}
            validateMessages={validateMessages}
          >
            <Form.Item
              label="Username or Email"
              name="userNameOrEmail1"
              rules={[
                {
                  required: true,
                  type: "string",
                  max: 32,
                },
              ]}
            >
              <Input placeholder="Username or Email" />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 9,
                span: 10,
              }}
            >
              <Button type="primary" htmlType="submit">
                Send mail
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>

      <div className="night">
        {Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13).map((val) => (
          <div className="shooting_star" key={val}></div>
        ))}
      </div>
    </div>
  );
};

export { SignIn };
