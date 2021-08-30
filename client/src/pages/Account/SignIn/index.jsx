import React from "react";
import "./index.css";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { signIn } from "./../../../api/auth/index";

const SignIn = () => {
  const onFinish = async (values) => {
    console.log("Success:", values);

    const res = await signIn(values);
    // console.log("🚀 ~ file: index.jsx ~ line 12 ~ onFinish ~ res", res);
    if (res.success === true) {
      localStorage.setItem("token", res.data);
    }
    if (res.success === false) {
      if (res.code === 404 || res.code === 401) {
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

  return (
    <div
      id="container"
      style={{
        padding: 205,
        backgroundImage: `url("/image/background.jpg")`,
        backgroundSize: "100% 100%",
      }}>
      <div className="form">
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 8,
          }}
          font={{
            weight: "bold",
            size: "16",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <Form.Item
            label="Username or Email"
            name="userNameOrEmail"
            rules={[
              {
                required: true,
                message: "Please input your username or email!",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}>
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 8,
              span: 16,
            }}>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}>
            <Button type="primary" htmlType="submit">
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export { SignIn };
