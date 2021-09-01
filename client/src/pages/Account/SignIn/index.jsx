import React from "react";
import "./index.css";
import "antd/dist/antd.css";
import { useHistory } from "react-router-dom";
import { Form, Input, Button, Checkbox, notification } from "antd";
import { signIn } from "./../../../api/auth/index";

const SignIn = () => {
  const history = useHistory();

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const res = await signIn(values);
    // console.log("🚀 ~ file: SignIn ~ onFinish ~ res", res);
    if (res === null) {
      history.push("/server-upgrade");
    } else if (res.success === true) {
      localStorage.setItem("token", res.data);
    } else if (res.success === false) {
      if (res.code === 404 || res.code === 403 || res.code === 401) {
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
    <div className="htmlLogin" id="htmlLogin">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="form">
        <Form
          className={"my-form"}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 8,
          }}
          font={{
            weight: "bold",
            size: "18",
            color: "white",
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
            <Checkbox>
              <span className="rememberMe">Remember me</span>
            </Checkbox>
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

      <div className="night">
        {Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13).map((val) => (
          <div className="shooting_star" key={val}></div>
        ))}
      </div>
    </div>
  );
};

export { SignIn };
