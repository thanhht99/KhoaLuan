import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  DatePicker,
  Spin,
  Row,
  Button,
  Col,
  Form,
  Input,
  Tooltip,
  Table,
  InputNumber,
  notification,
} from "antd";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { insertPromotion } from "../../../store/reducers/promotionDetail";
import moment from "moment";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { updatePromotion } from "../../../api/promotion";

const initialState = {
  products: [],
  total: null,
};

const DrawerPromotion = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const reduxPromotion = useSelector(
    (state) => state.promotionDetail.Promotion
  );
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";

  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (state.products.length === 0) {
      const keyProducts = props.promotion.products.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      setState((prev) => ({
        ...prev,
        products: keyProducts,
      }));
    }
    if (!props.drawerVisible) {
      setState({ ...initialState });
    }
  }, [state.products.length, props.drawerVisible, props.promotion.products]);

  const startDate = new Date(props.promotion.startDate);
  const startDateFormat =
    startDate.getDate() +
    "/" +
    (startDate.getMonth() + 1) +
    "/" +
    startDate.getFullYear();
  const endDate = new Date(props.promotion.endDate);
  const endDateFormat =
    endDate.getDate() +
    "/" +
    (endDate.getMonth() + 1) +
    "/" +
    endDate.getFullYear();

  const columns = [
    {
      title: "SKU",
      dataIndex: "productSku",
      width: "15%",
      ...getColumnSearchProps("productSku"),
      render: (productSku, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={record.name}
            color="hsla(340, 100%, 50%, 0.5)"
          >
            {productSku}
          </Tooltip>
        </div>
      ),
    },
  ];

  const onChangeForm = () => {
    const formValues = form.getFieldsValue();
    // console.log("🛸🛸🛸🛸🛸🛸🛸🛸🛸 formValues", formValues);

    const startDate = formValues.startDate
      ? formValues.startDate._d.toString()
      : props.promotion.startDate;
    const endDate = formValues.endDate
      ? formValues.endDate._d.toString()
      : props.promotion.endDate;

    let newPromotion = {
      promotion_name: formValues.name,
      promotion_desc: formValues.description,
      discount: formValues.discount,
      type: formValues.type,
      startDate,
      endDate,
    };
    dispatch(insertPromotion({ newPromotion }));
  };

  // Update Promotion
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const body = {
      promotion_name: values.name,
      promotion_desc: values.description,
      discount: values.discount,
    };

    const update = await updatePromotion(props.id, body, token);
    if (update && update.success) {
      notification["success"]({
        message: "Update Promotion",
        description: "Update Promotion successfully",
      });
    }
    if (update && !update.success) {
      if (update.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update Promotion",
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
          message: "Update Promotion",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update Promotion",
          description: `${update.message}`,
        });
      }
    }
  };

  return (
    <>
      {reduxPromotion ? (
        <>
          <Form
            className={"form-promotion-dashboard"}
            form={form}
            onChange={onChangeForm}
            layout="vertical"
            fields={[
              {
                name: ["name"],
                value: reduxPromotion.promotion_name,
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
                value: reduxPromotion.discount,
              },
              {
                name: ["type"],
                value: reduxPromotion.type,
              },
              {
                name: ["description"],
                value: reduxPromotion.promotion_desc,
              },
            ]}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Promotion name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Promotion name",
                    },
                  ]}
                  style={{ color: "green" }}
                >
                  <Input placeholder="Please enter Promotion name" />
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
                    disabled
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
              <Col span={12}>
                <Form.Item
                  name="type"
                  label="Type"
                  rules={[{ required: true, message: "Please type" }]}
                >
                  <Input
                    disabled
                    placeholder="Please type"
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
              <Table
                columns={columns}
                dataSource={state.products}
                footer={() => {
                  const total =
                    state.total || state.total === 0
                      ? state.total
                      : state.products.length;
                  return <strong>Sum: {total}</strong>;
                }}
                onChange={(pagination, filters, sorter, extra) => {
                  setState((prev) => ({
                    ...prev,
                    total: extra.currentDataSource.length,
                  }));
                }}
              />
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
        <Spin />
      )}
    </>
  );
};

export { DrawerPromotion };
