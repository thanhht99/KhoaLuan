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
    <div className="htmlRegister" id="htmlRegister">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
      <div className="registerform" >
        <h1 className="texttop" style={{color:"white"}}>Register For Free</h1>
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
            rules={[
              {
                required: true,
                message: "Please input your name.Example: John Witch",
              },
            ]}
          >
            <DatePicker></DatePicker>
          </Form.Item>

          <Form.Item name="radio-group" label="Gender"
          rules={[
            {
              required: true,
              message: "Please input your name.Example: John Witch",
            },
          ]}>
            <Radio.Group>
              <Radio value="male" style={{color:"white"}}>Male</Radio>
              <Radio value="female" style={{color:"white"}}>Female</Radio>
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
                required: true,
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
