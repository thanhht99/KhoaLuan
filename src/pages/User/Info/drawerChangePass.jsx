import { Form, Input, Button, notification } from "antd";
import React from "react";
import { updatePassword } from "../../../api/user";
import { validateMessages } from "../../../constants/validateMessages";
import { doNotGetData } from "../../../constants/doNotGetData";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";

const DrawerChangePass = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onFinish = async (values) => {
    const body = {
      password: values.confirmpassword,
    };

    const res = await updatePassword(body, props.token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        notification["success"]({
          message: "Success:",
          description: `${res.data}`,
        });
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

  return (
    <Form
      className={"form-product-dashboard"}
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      validateMessages={validateMessages}
    >
      <Form.Item
        label="New password"
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
        <Input.Password placeholder="New password" />
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
                new Error("The two passwords that you entered do not match!")
              );
            },
          }),
        ]}
      >
        <Input.Password placeholder="Confirm Password" />
      </Form.Item>

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" htmlType="submit">
          Change
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DrawerChangePass;
