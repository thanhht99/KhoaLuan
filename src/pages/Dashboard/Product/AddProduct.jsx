import React, { useEffect, useState } from "react";
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
  Select,
  Upload,
  Modal,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  beforeUpload,
  getBase64,
  getBase64ListImage,
} from "../../../constants/beforeUpload";
import ImgCrop from "antd-img-crop";
import Cookies from "js-cookie";
import {
  createNewProduct,
  getProducts,
  listImageProduct,
} from "../../../api/product";
import { useHistory } from "react-router";
import { useDispatch } from "react-redux";
import { insertProductAll } from "../../../store/reducers/productAll";

const { Option } = Select;

const AddProduct = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    categories: props.categories,
    loading: false,
    imageUrl: "",
    originFileObj: null,
    previewVisible: false,
    previewImage: "",
    fileList: [],
    previewTitle: "",
  });
  const [formAddProduct] = Form.useForm();
  const token = Cookies.get("token");

  useEffect(() => {
    if (props.categories.length > 0) {
      setState((prev) => ({ ...prev, categories: props.categories }));
    }
  }, [props.categories]);

  const onFinish = async (values) => {
    // console.log("Success:", values);

    // console.log("State 😈 👿 👿 😈 👿 👿:", state);

    const formData = new FormData();
    formData.append("file", state.originFileObj);
    formData.append("category", values.category);
    formData.append("description", values.description);
    formData.append("quantity", values.quantity);
    formData.append("sku", values.sku);
    formData.append("name", values.name);
    formData.append("price", values.price);

    const formDataListImage = new FormData();
    state.fileList.forEach((file) => {
      formDataListImage.append("files", file.originFileObj);
    });
    console.log(
      "formDataListImage 🧡 🧡 🧡 🧡 🧡 🧡:",
      formDataListImage.getAll("files")
    );

    const newProduct = await createNewProduct(formData, token);
    let newListImageProduct;
    if (newProduct && newProduct.success) {
      const sku = values.sku;
      // console.log("newProduct 🧡 🧡 🧡 🧡 🧡 🧡:", newProduct);
      newListImageProduct = await listImageProduct(
        sku,
        formDataListImage,
        token
      );
      // console.log(
      //   "newListImageProduct 🧡 🧡 🧡 🧡 🧡 🧡:",
      //   newListImageProduct
      // );
    }
    if (
      newProduct &&
      newProduct.success &&
      newListImageProduct &&
      newListImageProduct.success
    ) {
      const re_product = await getProducts();
      const keyProducts = re_product.data.map((item, index) => {
        const key = index;
        return { ...item, key };
      });
      dispatch(insertProductAll({ newProduct: keyProducts }));
      notification["success"]({
        message: "Success",
        description: "Added product successfully",
      });
      setState((prev) => ({
        ...prev,
        loading: false,
        imageUrl: "",
        originFileObj: null,
        previewVisible: false,
        previewImage: "",
        fileList: [],
        previewTitle: "",
      }));
      formAddProduct.resetFields();
    }
    if (newProduct && !newProduct.success) {
      if (newProduct.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Warning",
          description: `${newProduct.message}`,
        });
        history.push("/account/sign-in/reload");
        // window.location.reload();
      } else {
        const message = Object.keys(newProduct.message).map((key) => {
          return newProduct.message[key];
        });
        notification["warning"]({
          message: "Add Product",
          description: `${message}`,
        });
      }
    }
    if (newListImageProduct && !newListImageProduct.success) {
      notification["warning"]({
        message: "Add product image list",
        description: `${newListImageProduct.message}`,
      });
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
    // console.log("🚀 ~ 🚀 ~ 🚀 ~", info);
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

  const handleChange = ({ fileList }) => {
    fileList.map((item) => {
      if (item.type === "image/jpeg" || item.type === "image/png") {
        item.status = "done";
      }
      return item;
    });
    setState((prev) => ({ ...prev, fileList }));
  };
  const handleCancel = () => {
    setState((prev) => ({ ...prev, previewVisible: false }));
  };
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64ListImage(file.originFileObj);
    }

    setState((prev) => ({
      ...prev,
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle:
        file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    }));
  };

  return (
    <>
      <Form
        className={"form-add-product-dashboard"}
        form={formAddProduct}
        name="Add Product"
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Product's name"
              rules={[
                { required: true, message: "Please enter Product's name" },
              ]}
              style={{ color: "green" }}
            >
              <Input placeholder="Please enter Product's name" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="sku"
              label="SKU"
              rules={[{ required: true, message: "Please enter SKU" }]}
            >
              <Input placeholder="Please enter SKU" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="category"
              label="Category"
              rules={[{ required: true, message: "Please enter category" }]}
            >
              {state.categories && state.categories.length > 0 ? (
                <Select style={{ width: "100%" }} placeholder="Select category">
                  {state.categories.map((item, index) => (
                    <Option value={item.category_name} key={index}>
                      {item.category_name}
                    </Option>
                  ))}
                </Select>
              ) : (
                <Select style={{ width: "100%" }} disabled></Select>
              )}
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="quantity"
              label="Warehouse"
              rules={[{ required: true, message: "Please enter quantity" }]}
            >
              <InputNumber
                min={0}
                placeholder="Please enter quantity"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="price"
              label="Price($)"
              rules={[{ required: true, message: "Please enter price" }]}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Please enter price"
              />
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
          <Col span={4}>
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
              <div className="avatarProduct">
                <ImgCrop rotate>
                  <Upload
                    name="avatarProduct"
                    listType="picture-card"
                    className={"avatarProduct"}
                    showUploadList={false}
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                  >
                    {state.imageUrl ? (
                      <img
                        id="avatarProduct"
                        src={state.imageUrl}
                        alt="avatarProduct"
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
          <Col span={8}>
            <Form.Item
              name="listImage"
              label="List Image"
              rules={[
                {
                  required: true,
                  message: "Select List Image",
                },
              ]}
            >
              <div className="listImage">
                <ImgCrop rotate>
                  <Upload
                    name="listImage"
                    listType="picture-card"
                    className={"listImage"}
                    fileList={state.fileList}
                    beforeUpload={beforeUpload}
                    onChange={handleChange}
                    onPreview={handlePreview}
                  >
                    {state.fileList.length >= 10 ? null : uploadButton}
                  </Upload>
                </ImgCrop>
                <Modal
                  visible={state.previewVisible}
                  title={state.previewTitle}
                  footer={null}
                  onCancel={handleCancel}
                >
                  <img
                    alt="example"
                    style={{ width: "100%" }}
                    src={state.previewImage}
                  />
                </Modal>
              </div>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              <span style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                <PlusOutlined />
              </span>
              Add product
            </Button>
          </Form.Item>
        </Row>
        <Divider />
      </Form>
    </>
  );
};

export { AddProduct };
