import React, { useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Upload, Form, Input, InputNumber, Button } from "antd";
//Descriptions,
import ImgCrop from "antd-img-crop";

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const Info = () => {
  const [fileList, setFileList] = useState([]);

  const onFinish = async (values) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  return (
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
        >
          <Form.Item label="Avatar" name="avatar">
            <div className="avatar">
              <ImgCrop rotate>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onChange}
                  className="avatar-uploader"
                  // isImageUrl={isImageUrl}
                >
                  {fileList.length < 1 && "+ Upload"}
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
            <Input placeholder="Full Name" />
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
            <Input value="thanh267" placeholder="Username" />
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
              value="0367662607"
              placeholder="Phone"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name={["user", "email"]}
            rules={[
              {
                required: true,
                type: "email",
              },
            ]}
          >
            <Input value="0367662607" placeholder="Email" />
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

          <Form.Item label="Save Info" name="saveInfo" className="formSaveInfo">
            <div className="saveInfo">
              <Button type="primary" htmlType="submit" className="btnSaveInfo">
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
  );
};

export { Info };
