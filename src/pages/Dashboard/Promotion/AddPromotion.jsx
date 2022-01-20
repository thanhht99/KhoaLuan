import React, { useState, useEffect } from "react";
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
  Table,
  Tooltip,
  DatePicker,
  Spin,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { createNewPromotion, getAllPromotions } from "../../../api/promotion";
import { insertPromotionAll } from "../../../store/reducers/promotionAll";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { doNotGetData } from "../../../constants/doNotGetData";
import { getProductIsActiveTrueAndIsPromotionFalse } from "../../../api/product";
import { getCategory } from "../../../api/category";
import { insertCategory } from "../../../store/reducers/categoryAll";
import { insertProductAllTrue } from "../../../store/reducers/productAllTrue";
import moment from "moment";

function disabledDate(current) {
  // Can not select days before today and today
  return current && current < moment().endOf("day");
}

const AddPromotion = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const reduxProductAllTrue = useSelector(
    (state) => state.productAllTrue.Product
  );
  const reduxCategoryAll = useSelector((state) => state.categoryAll.Category);

  const initialState = {
    products: reduxProductAllTrue,
    categories: reduxCategoryAll,
    total: null,
    selectedRowKeys: [],
  };
  const [state, setState] = useState(initialState);
  // console.log("🚀🚀🚀🚀🚀 ", state);

  const fetchData = async () => {
    const re_category = await getCategory();
    const re_product = await getProductIsActiveTrueAndIsPromotionFalse();
    if (!re_category || !re_product) {
      doNotGetData();
    }
    if (re_category && re_product) {
      if (re_category.success && re_product.success) {
        const list_product = re_product.data.map((item) => {
          const key = item.sku;
          return { ...item, key };
        });
        const categories = re_category.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertProductAllTrue({ newProduct: list_product }));
        dispatch(insertCategory({ newCategory: categories }));
        setState((prev) => ({
          ...prev,
          products: list_product,
          categories,
        }));
      }
      if (!re_category.success || !re_product.success) {
        notification["warning"]({
          message: "Warning",
          description: `${re_category.message}.\n ${re_product.message}.`,
        });
      }
    }
  };

  useEffect(() => {
    if (
      reduxProductAllTrue.length === 0 ||
      reduxCategoryAll.length === 0 ||
      JSON.stringify(state.products) !== JSON.stringify(reduxProductAllTrue)
    ) {
      fetchData();
    }
  });

  const [formAddPromotion] = Form.useForm();
  const token = Cookies.get("token");
  const dateFormat = "DD/MM/YYYY";

  let filterCategories;
  if (state.categories) {
    filterCategories = state.categories.map((item) => {
      const value = {
        text: item.category_name,
        value: item.category_name,
      };
      return value;
    });
  }

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      width: "40%",
      ...getColumnSearchProps("name"),
      render: (name, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record.sku}
          >
            {name}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: "15%",
      ...getColumnSearchProps("sku"),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "10%",
      align: "center",
      render: (image) => (
        <>
          <img
            src={image}
            style={{ width: "100px", height: "80px", objectFit: "cover" }}
            alt=""
          />
        </>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "10%",
      align: "center",
      defaultSortOrder: "descend",
      sorter: (a, b) => a.price - b.price,
      render: (price) => <div>{price}$</div>,
    },
    {
      title: "Category",
      dataIndex: "category",
      width: "10%",
      filters: filterCategories,
      onFilter: (value, record) => {
        return record.category.indexOf(value) === 0;
      },
    },
  ];

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const body = {
      promotion_name: values.name,
      promotion_desc: values.description,
      discount: values.discount,
      startDate: values.startDate._d,
      endDate: values.endDate._d,
      products: state.selectedRowKeys,
    };

    if (state.selectedRowKeys.length === 0) {
      notification["warning"]({
        message: "Warning",
        description: "Please select the product",
      });
    }

    if (state.selectedRowKeys.length > 0) {
      const newPromotion = await createNewPromotion(body, token);
      if (newPromotion && newPromotion.success) {
        const re_promotion = await getAllPromotions(token);
        const keyPromotion = re_promotion.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertPromotionAll({ newPromotion: keyPromotion }));

        notification["success"]({
          message: "Add Promotion",
          description: "Added Promotion successfully",
        });
        setState({ ...initialState });
        fetchData();
        formAddPromotion.resetFields();
      }
      if (newPromotion && !newPromotion.success) {
        if (newPromotion.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Add Promotion",
            description: `${newPromotion.message}`,
          });
          history.push("/account/sign-in/reload");
          // window.location.reload();
        }
        if (typeof newPromotion.message === "object") {
          const message = Object.keys(newPromotion.message).map((key) => {
            return newPromotion.message[key];
          });
          notification["warning"]({
            message: "Add Promotion",
            description: `${message}`,
          });
        } else {
          notification["warning"]({
            message: "Add Promotion",
            description: `${newPromotion.message}`,
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
        className={"form-add-promotion-dashboard"}
        form={formAddPromotion}
        name="Add Promotion"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Promotion name"
              rules={[
                { required: true, message: "Please enter Promotion name" },
              ]}
              style={{ color: "green" }}
            >
              <Input placeholder="Please enter Promotion name" />
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
                disabledDate={disabledDate}
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
                disabledDate={disabledDate}
              ></DatePicker>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
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
          <Col span={18}>
            {state.products ? (
              <Table
                rowSelection={{
                  selectedRowKeys: state.selectedRowKeys,
                  onChange: (selectedRowKeys) => {
                    // console.log("selectedRowKeys changed: ", selectedRowKeys);
                    setState((prev) => ({ ...prev, selectedRowKeys }));
                  },
                  selections: [
                    Table.SELECTION_ALL,
                    Table.SELECTION_INVERT,
                    Table.SELECTION_NONE,
                  ],
                }}
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
            ) : (
              <div style={{ display: "grid", margin: "100px" }}>
                <Spin />
              </div>
            )}
          </Col>
        </Row>
        <Row gutter={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                <PlusOutlined />
              </span>
              Add promotion
            </Button>
          </Form.Item>
        </Row>
        <Divider />
      </Form>
    </>
  );
};

export { AddPromotion };
