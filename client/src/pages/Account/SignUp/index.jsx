import React from "react";
import "./index.css";
import "antd/dist/antd.css";
import { Form, Input, Button, DatePicker, Radio, InputNumber } from "antd";
import { validateMessages } from "./../../../constants/validateMessages";

const SignUp = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="htmlRegister" id="htmlRegister">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="registerform">
        <h1 className="texttop" style={{ color: "white" }}>
          Sign Up
        </h1>
        <Form
          className={"my-regiterform"}
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
            label="Username"
            name="username"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Full Name"
            name="fullName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="DOB"
            name="dayOfBirth"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }}></DatePicker>
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gender"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Radio.Group>
              <Radio value="male" style={{ color: "white" }}>
                Male
              </Radio>
              <Radio value="female" style={{ color: "white" }}>
                Female
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber
              value="0367662607"
              placeholder="Phone"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmpassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "The two passwords that you entered do not match!"
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Register
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

export { SignUp };
