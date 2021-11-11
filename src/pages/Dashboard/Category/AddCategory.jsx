import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import { Col, Input, Row, Divider, Form, Button, notification } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useHistory } from "react-router";
import {
  createNewCategory,
  getAllCategoryTrueAndFalse,
  getCategory,
} from "../../../api/category";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { insertCategoryTAF } from "../../../store/reducers/categoryTrueAndFalse";
import { insertCategory } from "../../../store/reducers/categoryAll";

const AddCategory = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const token = Cookies.get("token");
  const [formAddCategory] = Form.useForm();

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const body = {
      category_name: values.name,
      category_desc: values.description,
    };

    const newCategory = await createNewCategory(body, token);
    if (newCategory && newCategory.success) {
      const re_category = await getAllCategoryTrueAndFalse(token);
      const keyCategory = re_category.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertCategoryTAF({ newCategory: keyCategory }));

      // Update redux category isActive=true
      const categoryTrue = await getCategory();
      const categoryTrueKey = categoryTrue.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertCategory({ newCategory: categoryTrueKey }));

      notification["success"]({
        message: "Add Category",
        description: "Added category successfully",
      });
      formAddCategory.resetFields();
    }
    if (newCategory && !newCategory.success) {
      if (newCategory.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Add Category",
          description: `${newCategory.message}`,
        });
        history.push("/account/sign-in/reload");
        // window.location.reload();
      } else {
        notification["warning"]({
          message: "Add Category",
          description: `${newCategory.message}`,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      <Form
        className={"form-add-category-dashboard"}
        form={formAddCategory}
        name="Add Category"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Category name"
              rules={[
                { required: true, message: "Please enter Category name" },
              ]}
              style={{ color: "green" }}
            >
              <Input placeholder="Please enter Category name" />
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
              <Input.TextArea rows={3} placeholder="Please enter description" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                <PlusOutlined />
              </span>
              Add category
            </Button>
          </Form.Item>
        </Row>
        <Divider />
      </Form>
    </>
  );
};

export { AddCategory };
