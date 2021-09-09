import React from "react";
import "./index.css";
import "antd/dist/antd.css";
import { Form, Input, Button, Checkbox, DatePicker, Select, Radio } from "antd";

const SignUp = () => {
  const onFinish = (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div id="container" style={{ padding: 205, backgroundImage: `url("/image/whitetheme.jpeg")`, backgroundSize: "100% 100%" }}>
      <div className="form" >
        <h1 className="texttop">Register For Free</h1>
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
            size: "16"
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}>
          <Form.Item
            label="Name"
            name="username"
            rules={[
              {
                required: true,
                message: "Please input your name.Example: John Witch",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: "Please input your email.Example: johnwitch@gmail.com",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="DOB"
            name="dayofbirth"
          >
            <DatePicker></DatePicker>
          </Form.Item>

          <Form.Item name="radio-group" label="Gender">
            <Radio.Group>
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[
              {
                required: true,
                message: "Please input your phone number.Example: 0909222333",
              },
            ]}>
            <Input />
          </Form.Item>

          <Form.Item
            label="Address"
            name="address"
            rules={[
              {
                required: false,
                message: "Please input your address.Example: 1 Hai Ba Trung Street District 1",
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
            label="Confirm Password"
            name="confirmpassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
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
            }}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export { SignUp };
