import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  DatePicker,
  Spin,
  Row,
  Button,
  Col,
  Form,
  Input,
  Upload,
  InputNumber,
  notification,
} from "antd";
import { beforeUpload, getBase64 } from "../../../constants/beforeUpload";
import { useHistory } from "react-router";
import Cookies from "js-cookie";
import { insertVoucher } from "../../../store/reducers/voucherDetail";
import ImgCrop from "antd-img-crop";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { updateVoucher } from "../../../api/voucher";

const initialState = {
  loading: false,
  imageUrl: "",
  originFileObj: null,
};

const DrawerVoucher = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const reduxVoucher = useSelector((state) => state.voucherDetail.Voucher);
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";

  const startDate = new Date(props.voucher.startDate);
  const startDateFormat =
    startDate.getDate() +
    "/" +
    (startDate.getMonth() + 1) +
    "/" +
    startDate.getFullYear();
  const endDate = new Date(props.voucher.endDate);
  const endDateFormat =
    endDate.getDate() +
    "/" +
    (endDate.getMonth() + 1) +
    "/" +
    endDate.getFullYear();

  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (props.voucher) {
      setState((prev) => ({
        ...prev,
        imageUrl: props.voucher.image,
      }));
    }
    if (!props.drawerVisible) {
      setState({ ...initialState });
    }
  }, [props.drawerVisible, props.voucher]);

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
  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // Update Product
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const formData = new FormData();
    formData.append("voucher_name", values.name);
    formData.append("voucher_desc", values.description);
    formData.append("code", values.code);
    formData.append("discount", values.discount);
    formData.append("file", state.originFileObj);
    formData.append("startDate", values.startDate._d);
    formData.append("endDate", values.endDate._d);

    const update = await updateVoucher(props.id, formData, token);
    if (update && update.success) {
      notification["success"]({
        message: "Update Voucher",
        description: "Update Voucher successfully",
      });
    }
    if (update && !update.success) {
      if (update.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update Voucher",
          description: `${update.message}`,
        });
        history.push("/account/sign-in/reload");
        // window.location.reload();
      }
      if (typeof update.message === "object") {
        const message = Object.keys(update.message).map((key) => {
          return update.message[key];
        });
        notification["warning"]({
          message: "Update Voucher",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update Voucher",
          description: `${update.message}`,
        });
      }
    }
  };

  const onChangeForm = () => {
    const formValues = form.getFieldsValue();
    // console.log("🛸🛸🛸🛸🛸🛸🛸🛸🛸 formValues", formValues);

    const startDate = formValues.startDate
      ? formValues.startDate._d.toString()
      : props.voucher.startDate;
    const endDate = formValues.endDate
      ? formValues.endDate._d.toString()
      : props.voucher.endDate;

    let newVoucher = {
      voucher_name: formValues.name,
      voucher_desc: formValues.description,
      discount: formValues.discount,
      code: formValues.code,
      startDate,
      endDate,
    };
    dispatch(insertVoucher({ newVoucher }));
  };

  return (
    <>
      {reduxVoucher ? (
        <>
          <Form
            className={"form-voucher-dashboard"}
            form={form}
            onChange={onChangeForm}
            layout="vertical"
            fields={[
              {
                name: ["name"],
                value: reduxVoucher.voucher_name,
              },
              {
                name: ["startDate"],
                value: moment(startDateFormat, dateFormat),
              },
              {
                name: ["endDate"],
                value: moment(endDateFormat, dateFormat),
              },
              {
                name: ["discount"],
                value: reduxVoucher.discount,
              },
              {
                name: ["code"],
                value: reduxVoucher.code,
              },
              {
                name: ["description"],
                value: reduxVoucher.voucher_desc,
              },
              {
                name: ["image"],
                value: state.imageUrl,
              },
            ]}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Voucher name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Voucher name",
                    },
                  ]}
                  style={{ color: "green" }}
                >
                  <Input placeholder="Please enter Voucher name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
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
              <Col span={12}>
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
            <Row gutter={16}>
              <Col span={12}>
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
              <Col span={12}>
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
            <Row gutter={16}>
              <Col span={24}>
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
                  <Input.TextArea
                    rows={4}
                    placeholder="Please enter description"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Form.Item
                name="image"
                label="Avatar"
                rules={[
                  {
                    required: true,
                    message: "Select Avatar",
                  },
                ]}
              >
                <div className="avatarVoucher">
                  <ImgCrop rotate>
                    <Upload
                      name="avatarVoucher"
                      listType="picture-card"
                      className={"avatarVoucher"}
                      showUploadList={false}
                      beforeUpload={beforeUpload}
                      onChange={onChange}
                    >
                      {state.imageUrl ? (
                        <img
                          id="avatarVoucher"
                          src={state.imageUrl}
                          alt="avatarVoucher"
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
            </Row>

            <Row gutter={16} style={{ textAlign: "center" }}>
              <Col span={24}>
                <Form.Item>
                  <Button type="primary" shape="round" htmlType="submit">
                    Update
                  </Button>
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

export { DrawerVoucher };
