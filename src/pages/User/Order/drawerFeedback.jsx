import React, { useState } from "react";
import "antd/dist/antd.css";
import "./index.css";

import { Input, Form, Row, Col, Button, Rate, Image, notification } from "antd";
import { feedbackAPI } from "../../../api/feedback";
import Cookies from "js-cookie";
import { doNotGetData } from "../../../constants/doNotGetData";
import { useHistory } from "react-router";

const DrawerFeedback = (props) => {
  const [form] = Form.useForm();
  const token = Cookies.get("token");
  const history = useHistory();
  const initialState = {
    review: false,
  };
  const [state, setState] = useState(initialState);

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const body = {
      products: [],
    };
    props.feedback.map((item) => {
      const review = {
        productId: item._id,
        sku: item.sku,
        rating: values[`rate_${item.sku}`],
        contentFeedback: values[`feedback_${item.sku}`],
      };
      body.products.push(review);
      return item;
    });

    const res = await feedbackAPI(props.id, body, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        setState((prev) => ({ ...prev, review: true }));
        notification["success"]({
          message: "Success",
          description: `${res.data}.`,
        });
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        if (res.message !== "Token is expired") {
          notification["warning"]({
            message: "Warning",
            description: `${res.message}.`,
          });
        }
      }
    }
  };

  return (
    <>
      <Form
        className={"form-product-dashboard"}
        form={form}
        // onChange={onChangeForm}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        {props.feedback.map((item, index) => (
          <div className="drawer-feedback" key={index}>
            <span
              style={{
                fontSize: "17px",
                fontWeight: "bold",
              }}
            >
              {item.name + " - " + item.sku}
            </span>
            <Row gutter={16}>
              <Image src={item.image} width={200} height={200} alt="" />
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name={"rate_" + item.sku}
                  rules={[
                    {
                      required: true,
                      message: "Please choose rate",
                    },
                  ]}
                >
                  <Rate />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name={"feedback_" + item.sku}
                  rules={[
                    {
                      required: true,
                      message: "Please enter feedback",
                    },
                  ]}
                >
                  <Input placeholder="Please enter feedback" />
                </Form.Item>
              </Col>
            </Row>
            <br />
          </div>
        ))}

        <Row gutter={16} style={{ textAlign: "center" }}>
          <Col span={24}>
            <Form.Item>
              <Button
                type="primary"
                shape="round"
                htmlType="submit"
                disabled={state.review}
              >
                Reviews
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export { DrawerFeedback };
