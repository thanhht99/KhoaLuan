import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Col,
  Form,
  Row,
  Spin,
  Input,
  InputNumber,
  notification,
  DatePicker,
} from "antd";
import { validateMessages } from "../../../constants/validateMessages";
import { getUserByUserName } from "../../../api/user";
import Cookies from "js-cookie";
import { doNotGetData } from "../../../constants/doNotGetData";
import { useHistory } from "react-router-dom";
import moment from "moment";

const DrawerCustomer = (props) => {
  const [formStaffDrawer] = Form.useForm();
  const history = useHistory();
  const initialState = {
    user: null,
  };
  const token = Cookies.get("token");
  const dateFormat = "DD/MM/YYYY";

  const [state, setState] = useState(initialState);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getUserByUserName(props.customer.userName, token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          const dayOfBirth = new Date(res.data.dayOfBirth);
          const createdAt = new Date(res.data.createdAt);
          const dayOfBirthFormat =
            dayOfBirth.getDate() +
            "/" +
            (dayOfBirth.getMonth() + 1) +
            "/" +
            dayOfBirth.getFullYear();
          const createdAtFormat =
            createdAt.getDate() +
            "/" +
            (createdAt.getMonth() + 1) +
            "/" +
            createdAt.getFullYear();
          setState((prev) => ({
            ...prev,
            user: res.data,
            dayOfBirthFormat,
            createdAtFormat,
          }));
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
    fetchData();
  }, [props.customer, history, token]);

  return (
    <>
      {props.customer && state.user ? (
        <>
          <Form
            className={"form-staff-drawer-dashboard"}
            form={formStaffDrawer}
            // onChange={onChangeForm}
            layout="vertical"
            fields={[
              {
                name: ["fullName"],
                value: state.user.fullName,
              },
              {
                name: ["userName"],
                value: props.customer.userName,
              },
              {
                name: ["phone"],
                value: state.user.phone,
              },
              {
                name: ["email"],
                value: props.customer.email,
              },
              {
                name: ["gender"],
                value: state.user.gender,
              },
              {
                name: ["dayOfBirth"],
                value: moment(state.dayOfBirthFormat, dateFormat),
              },
              {
                name: ["createdAt"],
                value: moment(state.createdAtFormat, dateFormat),
              },
            ]}
            validateMessages={validateMessages}
          >
            <Row gutter={16}>
              <Col span={24}>
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
                  <Input placeholder="Full Name" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
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
                  <Input placeholder="Email" disabled />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
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
                  <Input placeholder="Username" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
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
                  <InputNumber
                    placeholder="Phone"
                    style={{ width: "100%" }}
                    disabled
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gender"
                  label="Gender"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder="Username" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="dayOfBirth"
                  label="Day Of Birth"
                  rules={[
                    {
                      required: true,
                      type: "date",
                      message: "Please enter Day Of Birth",
                    },
                  ]}
                >
                  <DatePicker
                    disabled
                    style={{ width: "100%" }}
                    format={dateFormat}
                  ></DatePicker>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="createdAt"
                  label="Created At"
                  rules={[
                    {
                      type: "date",
                    },
                  ]}
                >
                  <DatePicker
                    disabled
                    style={{ width: "100%" }}
                    format={dateFormat}
                  ></DatePicker>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      ) : (
        <div style={{ display: "grid", margin: "100px" }}>
          <Spin />
        </div>
      )}
    </>
  );
};

export { DrawerCustomer };
