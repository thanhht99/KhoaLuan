import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import {
  Modal,
  Input,
  InputNumber,
  Divider,
  Form,
  Row,
  Col,
  Button,
  Rate,
  Upload,
  notification,
  Spin,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import ImgCrop from "antd-img-crop";
import {
  beforeUpload,
  getBase64,
  getBase64ListImage,
} from "../../../constants/beforeUpload";
import { updateListImageProduct, updateProduct } from "../../../api/product";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { insertProduct } from "../../../store/reducers/productDetail";
import { useHistory } from "react-router";

const initialState = {
  loading: false,
  imageUrl: "",
  originFileObj: null,
  previewVisible: false,
  previewImage: "",
  fileList: [],
  previewTitle: "",
};

const DrawerProduct = (props) => {
  const history = useHistory();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const reduxProduct = useSelector((state) => state.productDetail.Product);
  // console.log("🚀🚀🚀🚀🚀🚀🚀 reduxProduct", reduxProduct);

  const token = Cookies.get("token");
  const [state, setState] = useState(initialState);

  useEffect(() => {
    if (props.product) {
      const fileList = props.product.listImage.map((image, index) => {
        const img = {
          uid: index,
          name: index,
          status: "done",
          url: image,
        };
        return img;
      });
      setState((prev) => ({
        ...prev,
        imageUrl: props.product.image,
        fileList,
      }));
    }
    if (!props.drawerVisible) {
      setState({ ...initialState });
    }
  }, [props.product, props.drawerVisible]);

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

  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  // List Image
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

  // Update Product
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    // console.log("Success:", values);

    // console.log("State 😈 👿 👿 😈 👿 👿:", state);
    
    const formData = new FormData();
    formData.append("file", state.originFileObj);
    formData.append("description", values.description);
    formData.append("quantity", values.quantity);
    formData.append("name", values.name);
    formData.append("price", values.price);

    const update = await updateProduct(values.sku, formData, token);
    let newListImageProduct;
    if (update && update.success) {
      const formDataListImage = new FormData();
      state.fileList.forEach((file) => {
        if (file.originFileObj) {
          formDataListImage.append("files", file.originFileObj);
        }
        if (file.url) {
          formDataListImage.append("listURL", file.url);
        }
      });

      newListImageProduct = await updateListImageProduct(
        values.sku,
        formDataListImage,
        token
      );
      // console.log(
      //   "newListImageProduct 🧡 🧡 🧡 🧡 🧡 🧡:",
      //   newListImageProduct
      // );

      if (newListImageProduct && newListImageProduct.success) {
        notification["success"]({
          message: "Success",
          description: "Updated product successfully",
        });
      }
      if (newListImageProduct && !newListImageProduct.success) {
        notification["warning"]({
          message: "Update Prodct",
          description: `${newListImageProduct.message}`,
        });
      }
    }
    if (update && !update.success) {
      if (update.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Warning",
          description: `${update.message}`,
        });
        history.push("/account/sign-in/reload");
        window.location.reload();
      } else {
        notification["warning"]({
          message: "Update Prodct",
          description: `${update.message}`,
        });
      }
    }
  };

  const onChangeForm = () => {
    const formValues = form.getFieldsValue();
    // console.log("🛸🛸🛸🛸🛸🛸🛸🛸🛸 formValues", formValues);

    let newProduct = {
      category: formValues.category,
      description: formValues.description,
      name: formValues.name,
      price: formValues.price,
      sku: formValues.sku,
      sold: formValues.sold,
      quantity: formValues.quantity,
      rating: reduxProduct.rating,
      numRating: reduxProduct.numRating,
    };
    dispatch(insertProduct({ newProduct }));
  };

  return (
    <>
      {reduxProduct ? (
        <>
          <Form
            className={"form-product-dashboard"}
            form={form}
            onChange={onChangeForm}
            layout="vertical"
            fields={[
              {
                name: ["name"],
                value: reduxProduct.name,
              },
              {
                name: ["sku"],
                value: reduxProduct.sku,
              },
              {
                name: ["quantity"],
                value: reduxProduct.quantity,
              },
              {
                name: ["sold"],
                value: reduxProduct.sold,
              },
              {
                name: ["category"],
                value: reduxProduct.category,
              },
              {
                name: ["price"],
                value: reduxProduct.price,
              },
              {
                name: ["description"],
                value: reduxProduct.description,
              },
              {
                name: ["image"],
                value: state.imageUrl,
              },
              {
                name: ["listImage"],
                value: state.fileList,
              },
            ]}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="Product's name"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Product's name",
                    },
                  ]}
                  style={{ color: "green" }}
                >
                  <Input placeholder="Please enter Product's name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="sku"
                  label="SKU"
                  rules={[{ required: true, message: "Please enter SKU" }]}
                >
                  <Input placeholder="Please enter SKU" disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="Category"
                  rules={[{ required: true, message: "Please enter category" }]}
                >
                  <Input placeholder="Please enter category" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="sold"
                  label="Sold"
                  rules={[{ required: true, message: "Please enter sold" }]}
                >
                  <Input placeholder="Please enter sold" disabled />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="quantity"
                  label="Warehouse"
                  rules={[{ required: true, message: "Please enter quantity" }]}
                >
                  <InputNumber
                    placeholder="Please enter quantity"
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[{ required: true, message: "Please enter price" }]}
                >
                  <InputNumber
                    placeholder="Please enter price"
                    style={{ width: "100%" }}
                    formatter={(value) => `$ ${value}`}
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
              <div>
                <strong
                  style={{
                    textDecoration: "underline",
                    paddingRight: "10px",
                    color: "hsla(340, 100%, 50%, 0.5)",
                  }}
                >
                  {reduxProduct.rating}
                </strong>
                <Rate
                  disabled
                  allowHalf
                  style={{
                    color: "hsla(340, 100%, 50%, 0.5)",
                    paddingRight: "20px",
                  }}
                  defaultValue={reduxProduct.rating}
                ></Rate>
                <span style={{ paddingLeft: "15px" }}>
                  (
                  <strong
                    style={{
                      textDecoration: "underline",
                      paddingLeft: "5px",
                      color: "hsla(340, 100%, 50%, 0.5)",
                    }}
                  >
                    {reduxProduct.numRating}
                  </strong>{" "}
                  Reviews)
                </span>
              </div>
            </Row>

            <Divider />

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
            </Row>

            <Row>
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

export { DrawerProduct };
