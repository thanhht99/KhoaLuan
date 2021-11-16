import React, { useState } from "react";
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
  Upload,
  DatePicker,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { beforeUpload, getBase64 } from "../../../constants/beforeUpload";
import ImgCrop from "antd-img-crop";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { createNewVoucher, getAllVouchers } from "../../../api/voucher";
import { insertVoucherAll } from "../../../store/reducers/voucherAll";

const AddVoucher = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const initialState = {
    loading: false,
    imageUrl: "",
    originFileObj: null,
  };
  const [state, setState] = useState(initialState);
  const [formAddVoucher] = Form.useForm();
  const token = Cookies.get("token");
  const dateFormat = "DD/MM/YYYY";

  const onFinish = async (values) => {
    const formData = new FormData();
    formData.append("voucher_name", values.name);
    formData.append("voucher_desc", values.description);
    formData.append("code", values.code);
    formData.append("discount", values.discount);
    formData.append("file", state.originFileObj);
    formData.append("startDate", values.startDate._d);
    formData.append("endDate", values.endDate._d);

    const newVoucher = await createNewVoucher(formData, token);
    if (newVoucher && newVoucher.success) {
      const re_voucher = await getAllVouchers(token);
      const keyVoucher = re_voucher.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertVoucherAll({ newVoucher: keyVoucher }));

      notification["success"]({
        message: "Add Voucher",
        description: "Added Voucher successfully",
      });
      setState({ ...initialState });
      formAddVoucher.resetFields();
    }
    if (newVoucher && !newVoucher.success) {
      if (newVoucher.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Add Voucher",
          description: `${newVoucher.message}`,
        });
        history.push("/account/sign-in/reload");
        // window.location.reload();
      }
      if (typeof newVoucher.message === "object") {
        const message = Object.keys(newVoucher.message).map((key) => {
          return newVoucher.message[key];
        });
        notification["warning"]({
          message: "Add Voucher",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Add Voucher",
          description: `${newVoucher.message}`,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onChange = (info) => {
    if (info.file.type === "image/jpeg" || info.file.type === "image/png") {
      info.file.status = "done";
    }
    if (info.file.status === "uploading") {
      setState((prev) => ({
        ...prev,
        loading: true,
      }));
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, async (imageUrl) => {
        setState((prev) => ({
          ...prev,
          imageUrl,
          loading: false,
          originFileObj: info.file.originFileObj,
        }));
      });
    }
  };

  return (
    <>
      <Form
        className={"form-add-voucher-dashboard"}
        form={formAddVoucher}
        name="Add Voucher"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Voucher name"
              rules={[{ required: true, message: "Please enter Voucher name" }]}
              style={{ color: "green" }}
            >
              <Input placeholder="Please enter Voucher name" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="startDate"
              label="Start Date"
              rules={[
                {
                  required: true,
                  type: "date",
                  message: "Please enter start date",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format={dateFormat}
              ></DatePicker>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="endDate"
              label="End Date"
              rules={[
                {
                  required: true,
                  type: "date",
                  message: "Please enter end date",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format={dateFormat}
              ></DatePicker>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: "Please enter description",
                },
              ]}
            >
              <Input.TextArea rows={4} placeholder="Please enter description" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="image"
              label="Voucher image"
              rules={[
                {
                  required: true,
                  message: "Select voucher image",
                },
              ]}
            >
              <div className="avatarVoucherImage">
                <ImgCrop rotate>
                  <Upload
                    name="avatarVoucherImage"
                    listType="picture-card"
                    className={"avatarVoucherImage"}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                  >
                    {state.imageUrl ? (
                      <img
                        id="avatarVoucherImage"
                        src={state.imageUrl}
                        alt="avatarVoucherImage"
                        style={{
                          height: "102px",
                          width: "102px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </div>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="code"
              label="Code"
              rules={[{ required: true, message: "Please enter code" }]}
            >
              <Input
                maxLength={8}
                minLength={8}
                placeholder="Please enter code"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="discount"
              label="Discount"
              rules={[{ required: true, message: "Please enter discount" }]}
            >
              <InputNumber
                min={0}
                placeholder="Please enter discount"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                <PlusOutlined />
              </span>
              Add voucher
            </Button>
          </Form.Item>
        </Row>
        <Divider />
      </Form>
    </>
  );
};

export { AddVoucher };
