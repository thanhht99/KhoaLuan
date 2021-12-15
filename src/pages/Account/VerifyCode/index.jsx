import React, { useEffect, useState } from "react";
import "./index.css";
import "antd/dist/antd.css";
import { Button, Form, Input, notification, Result } from "antd";
import { doNotGetData } from "../../../constants/doNotGetData";
import { findAcc, verifyCode } from "../../../api/auth";
import { NotFound } from "../../../_components/NotFound";
import { useHistory } from "react-router-dom";

const VerifyCode = (props) => {
  const history = useHistory();
  const [state, setState] = useState({
    isAcc: false,
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      isAcc: false,
    }));
    const fetchData = async () => {
      const res = await findAcc(props.match.params.id);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          setState((prev) => ({
            ...prev,
            isAcc: true,
          }));
        }
      }
    };
    fetchData();
  }, [props.match.params.id]);

  const onFinish = async (values) => {
    const body = {
      verifyCode: values.verifyCode,
    };

    const res = await verifyCode(body, props.match.params.id);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        notification["success"]({
          message: "Successfully",
          description: `${res.data}.`,
        });
        history.push("/account/sign-in/");
      }
      if (!res.success) {
        notification["warning"]({
          message: "Warning",
          description: `${res.message}.`,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div>
      {state.isAcc ? (
        <Result
          title="Enter Verify Code"
          extra={
            <Form onFinish={onFinish} onFinishFailed={onFinishFailed}>
              <Form.Item
                name="verifyCode"
                rules={[
                  { required: true, message: "Please enter Verify Code!" },
                ]}
              >
                <Input
                  placeholder="Enter Verify Code"
                  style={{ width: "20%" }}
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            </Form>
          }
        />
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export { VerifyCode };
