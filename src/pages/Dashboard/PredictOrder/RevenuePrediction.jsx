import React, { useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { InputNumber, Col, Row, Form, Button, Input, notification } from "antd";
import { SyncOutlined } from "@ant-design/icons";
import { revenuePrediction } from "../../../api/ML";
import Cookies from "js-cookie";
import { doNotGetData } from "../../../constants/doNotGetData";
import { useHistory } from "react-router-dom";

const RevenuePrediction = () => {
  const history = useHistory();
  const token = Cookies.get("token");
  const [formRevenuePrediction] = Form.useForm();
  const [state, setState] = useState({
    predict: null,
  });

  const onFinish = async (values) => {
    const body = {
      quantity: values.quantity,
    };

    const res = await revenuePrediction(body, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        setState((prev) => ({ ...prev, predict: `${res.data} $` }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: Revenue Prediction",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        } else {
          notification["warning"]({
            message: "Warning: Revenue Prediction",
            description: `${res.message}.`,
          });
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
        className={"form-predict-dashboard"}
        form={formRevenuePrediction}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        fields={[
          {
            name: ["predict"],
            value: state.predict,
          },
        ]}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="quantity"
              label="Quantity"
              rules={[
                {
                  required: true,
                  message: "Please enter the quantity you intend to sell",
                },
              ]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Please enter the quantity you intend to sell"
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ marginTop: "36px" }}
              >
                <span style={{ paddingRight: "10px" }}>
                  <SyncOutlined spin />
                </span>
                Calculate
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="predict"
              label="Predict"
              style={{ paddingTop: "5px" }}
            >
              <Input
                disabled={true}
                style={{ color: "hsla(340, 100%, 50%, 0.5)" }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export { RevenuePrediction };
