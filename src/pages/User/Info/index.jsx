import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import {
  Upload,
  Form,
  Input,
  InputNumber,
  Button,
  DatePicker,
  Radio,
  message,
  notification,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { validateMessages } from "./../../../constants/validateMessages";
import Cookies from "js-cookie";
import { NotFound } from "../../../_components/NotFound/index";
import moment from "moment";
import { getUser, updateAvatar, updateUser } from "./../../../api/user/index";
import * as config from "../../../constants/config";
import { insertUser, resetUser } from "../../../store/reducers/user";

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

const Info = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    imageUrl: "",
  });
  const token = Cookies.get("token");
  const user = useSelector((state) => state.user.User);
  const acc = useSelector((state) => state.acc.Acc);
  const dateFormat = "DD/MM/YYYY";
  const phone = Number(user.phone);
  const DOB = new Date(user.dayOfBirth);
  const DOBFormat =
    DOB.getDate() + "/" + (DOB.getMonth() + 1) + "/" + DOB.getFullYear();

  useEffect(() => {
    if (!user.image && user.gender === "Male") {
      setState((prev) => ({ ...prev, imageUrl: "/image/avatar/male.jpg" }));
    }
    if (!user.image && user.gender === "Female") {
      setState((prev) => ({ ...prev, imageUrl: "/image/avatar/female.jpg" }));
    }
    if (user.image) {
      setState((prev) => ({
        ...prev,
        imageUrl: `${config.API_URL}/user/avatar/${acc._id}`,
      }));
    }
  }, [user.image, user.gender, acc._id]);

  const onChange = (info) => {
    console.log("🚀 ~ file: index.jsx ~ line 63 ~ onChange ~ info", info);
    if (info.file.type === "image/jpeg" || info.file.type === "image/png") {
      info.file.status = "done";
    }
    if (info.file.status === "uploading") {
      setState({ loading: true });
      return;
    }
    if (info.file.status === "done") {
      getBase64(info.file.originFileObj, async (imageUrl) => {
        setState({
          imageUrl,
          loading: false,
        });
        const formData = new FormData();
        formData.append("image", info.file.originFileObj);
        await updateAvatar(token, formData);
        // window.location.reload();
      });
    }
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    const { address, phone } = values;

    const res = await updateUser(token, { address, phone: "0" + phone });
    if (res === null) {
      history.push("/server-upgrade");
    } else if (res.success === true) {
      notification["success"]({
        message: "Success",
        description: "",
      });
      dispatch(resetUser());
      const re_user = await getUser(token);
      if (re_user.code === 401) {
        Cookies.remove("token", { path: "" });
        notification["warning"]({
          message: "Warning",
          description: `${re_user.message}`,
        });
        history.push("/account/sign-in/reload");
        window.location.reload();
      } else if (re_user.code !== 401) {
        dispatch(insertUser({ newUser: re_user.data }));
      }
      history.push("/user/info/reload");
    } else if (res.success === false) {
      if (res.code === 404 || res.code === 403) {
        notification["warning"]({
          message: "Warning",
          description: `${res.message}`,
        });
      } else if (
        res.message === "Cannot read property 'filename' of undefined"
      ) {
        notification["error"]({
          message: "Error",
          description: "Image update error",
        });
      } else if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "" });
        notification["warning"]({
          message: "Warning",
          description: `${res.message}`,
        });
        history.push("/account/sign-in/reload");
        window.location.reload();
      } else {
        notification["error"]({
          message: "Error",
          description: `${res.message}`,
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

  return (
    <>
      {token ? (
        <div className="htmlInfo">
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
          <div className="formInfo">
            <Form
              className={"my-form-info"}
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 8,
              }}
              style={{ height: "100%", width: "100%" }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              validateMessages={validateMessages}
              fields={[
                {
                  name: ["username"],
                  value: acc.userName,
                },
                {
                  name: ["fullName"],
                  value: user.fullName,
                },
                {
                  name: ["email"],
                  value: acc.email,
                },
                {
                  name: ["phone"],
                  value: phone,
                },
                {
                  name: ["gender"],
                  value: user.gender,
                },
                {
                  name: ["address"],
                  value: user.address,
                },
                {
                  name: ["dayOfBirth"],
                  value: moment(DOBFormat, dateFormat),
                },
              ]}
            >
              <Form.Item label="Avatar">
                <div className="avatar">
                  <ImgCrop rotate>
                    <Upload
                      name="avatarInfo"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                      beforeUpload={beforeUpload}
                      onChange={onChange}
                    >
                      {state.imageUrl ? (
                        <img
                          id="avatarInfo"
                          src={state.imageUrl}
                          alt="avatar"
                          style={{
                            width: "104px",
                            height: "104px",
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

              <Form.Item
                label="Full Name"
                name="fullName"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled style={{ fontWeight: "bold" }} />
              </Form.Item>

              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input disabled style={{ fontWeight: "bold" }} />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    type: "email",
                  },
                ]}
              >
                <Input disabled style={{ fontWeight: "bold" }} />
              </Form.Item>

              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  {
                    required: true,
                    type: "number",
                  },
                ]}
              >
                <InputNumber
                  placeholder="Phone"
                  style={{ width: "100%", fontWeight: "bold" }}
                />
              </Form.Item>

              <Form.Item
                name="gender"
                label="Gender"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group disabled style={{ backgroundColor: "white" }}>
                  <Radio value="Male">Male</Radio>
                  <Radio value="Female">Female</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="DOB"
                name="dayOfBirth"
                rules={[
                  {
                    required: true,
                    type: "date",
                  },
                ]}
              >
                <DatePicker
                  disabled
                  style={{ width: "100%" }}
                  format={dateFormat}
                ></DatePicker>
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea placeholder="Address" />
              </Form.Item>

              <Form.Item label="Save Info" className="formSaveInfo">
                <div className="saveInfo">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="btnSaveInfo"
                  >
                    Save
                  </Button>
                </div>
              </Form.Item>
            </Form>
          </div>
          <div className="night">
            {Array.of(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13).map((val) => (
              <div className="shooting_star" key={val}></div>
            ))}
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export { Info };
