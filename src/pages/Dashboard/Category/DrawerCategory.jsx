import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import { Spin, Form, Col, Row, Button, Input, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { insertCategoryDetail } from "../../../store/reducers/categoryDetail";
import Cookies from "js-cookie";
import { updateCategory } from "../../../api/category";
import { useHistory } from "react-router";

const DrawerCategory = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const token = Cookies.get("token");
  const reduxCategory = useSelector((state) => state.categoryDetail.Category);

  const onFinish = async (values) => {
    // console.log("Success:", values);

    const body = {
      category_name: values.name,
      category_desc: values.description,
    };

    const update = await updateCategory(props.id, body, token);

    if (update && update.success) {
      notification["success"]({
        message: "Update Category",
        description: "Updated category successfully",
      });
    }
    if (update && !update.success) {
      if (update.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Update Category",
          description: `${update.message}`,
        });
        history.push("/account/sign-in/reload");
        window.location.reload();
      }
      if (typeof update.message === "object") {
        const message = Object.keys(update.message).map((key) => {
          return update.message[key];
        });
        notification["warning"]({
          message: "Update Category",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Update Category",
          description: `${update.message}`,
        });
      }
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChangeForm = () => {
    const formValues = form.getFieldsValue();
    // console.log("🛸🛸🛸🛸🛸🛸🛸🛸🛸 formValues", formValues);

    const newCategory = {
      category_name: formValues.name,
      category_desc: formValues.description,
    };
    dispatch(insertCategoryDetail({ newCategory }));
  };

  return (
    <>
      {reduxCategory ? (
        <>
          <Form
            className={"form-product-dashboard"}
            form={form}
            onChange={onChangeForm}
            layout="vertical"
            fields={[
              {
                name: ["name"],
                value: reduxCategory.category_name,
              },
              {
                name: ["description"],
                value: reduxCategory.category_desc,
              },
            ]}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Category name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter category name",
                    },
                  ]}
                  style={{ color: "green" }}
                >
                  <Input placeholder="Please enter category name" />
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

export { DrawerCategory };
