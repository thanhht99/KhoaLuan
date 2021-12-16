import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Form,
  Row,
  Col,
  notification,
  Divider,
  Input,
  InputNumber,
  Button,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { validateMessages } from "../../../constants/validateMessages";
import { getStaff, signUp } from "../../../api/auth";
import { doNotGetData } from "../../../constants/doNotGetData";
import { insertStaffList } from "../../../store/reducers/staffList";

const { Option } = Select;

const AddStaff = (props) => {
  const dispatch = useDispatch();
  const [formAddStaff] = Form.useForm();
  const token = Cookies.get("token");

  const onFinish = async (values) => {
    // console.log("Success:", values);
    values.dayOfBirth = values.dayOfBirth._d;
    values.phone = "0" + values.phone;
    values.role = "Saler";

    const res = await signUp(values);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        try {
          const res_getStaff = await getStaff(token);
          const newStaffList = res_getStaff.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertStaffList({ newStaffList }));
          notification["success"]({
            message: "Success",
            description: "Added staff successfully",
          });
          formAddStaff.resetFields();
        } catch (err) {
          notification["error"]({
            message: "ERROR",
            description: `${err}`,
          });
        }
      } else if (!res.success) {
        if (res.code === 404 || res.code === 403) {
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
        } else {
          if (typeof res.message === "object") {
            const message = Object.keys(res.message).map((key) => {
              return res.message[key];
            });
            notification["warning"]({
              message: "Warning: sign up",
              description: `${message}`,
            });
          }
          if (typeof res.message !== "object") {
            notification["error"]({
              message: "Error",
              description: `${res.message}`,
            });
          }
        }
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        className={"form-add-staff-dashboard"}
        form={formAddStaff}
        name="Add Staff"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        validateMessages={validateMessages}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[
                {
                  required: true,
                  type: "string",
                  min: 3,
                  max: 50,
                },
              ]}
            >
              <Input placeholder="Full Name" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Username"
              name="userName"
              rules={[
                {
                  required: true,
                  type: "string",
                  min: 6,
                  max: 32,
                },
              ]}
            >
              <Input placeholder="Username" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="gender"
              label="Gender"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select style={{ width: "100%" }} placeholder="Select category">
                <Option value="Male">Male</Option>
                <Option value="Female">Female</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={4}>
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
          </Col>
          <Col span={4}>
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
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
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
              <Input placeholder="Email" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[
                {
                  required: true,
                  type: "number",
                  max: 1000000000,
                },
              ]}
            >
              <InputNumber placeholder="Phone" style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              label="DOB"
              name="dayOfBirth"
              rules={[
                {
                  required: true,
                  type: "date",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }}></DatePicker>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                <PlusOutlined />
              </span>
              Add staff
            </Button>
          </Form.Item>
        </Row>
        <Divider />
      </Form>
    </>
  );
};

export { AddStaff };
