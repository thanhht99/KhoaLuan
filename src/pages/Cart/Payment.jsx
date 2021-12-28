import React, { useState } from "react";
import "antd/dist/antd.css";
import {
  Descriptions,
  message,
  Upload,
  Result,
  notification,
  Button,
} from "antd";
import { BankOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import { uploadPaymentImage } from "../../api/order";
import Cookies from "js-cookie";

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

const Payment = () => {
  const cookiesInfoOrder = JSON.parse(Cookies.get("infoOrder"));

  const [state, setState] = useState({
    loading: false,
    imageUrl: "",
    flag: false,
    flagSave: false,
    originFileObj: null,
  });

  // console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ cookiesInfoOrder", cookiesInfoOrder);

  const onChange = (info) => {
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
          originFileObj: info.file.originFileObj,
        });
      });
    }
  };

  const uploadButton = (
    <div>
      {state.loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Payment image</div>
    </div>
  );

  const onClick = async () => {
    if (!state.originFileObj) {
      notification["warning"]({
        message: "Warning",
        description: "No pictures yet",
      });
    }
    if (state.originFileObj) {
      const formData = new FormData();
      formData.append("file", state.originFileObj);
      const res = await uploadPaymentImage(
        cookiesInfoOrder.orderCode,
        formData
      );
      if (res.success) {
        cookiesInfoOrder.imagePayment = true;
        let json_InfoOrder = JSON.stringify(cookiesInfoOrder);
        Cookies.set("infoOrder", json_InfoOrder, { path: "/" });
        notification["success"]({
          message: "Success",
          description: `${res.data}`,
        });
      }
      if (!res.success) {
        notification["error"]({
          message: "Error",
          description: `${res.message}`,
        });
      }
    }
  };

  const onClickPaypal = async () => {
    window.open(
      `http://localhost:4200/api/payment/pay/${cookiesInfoOrder.orderCode}`,
      "Paypal",
      "width=1000,height=800"
    );
  };

  return (
    <>
      {cookiesInfoOrder.payments === "Momo" && (
        <div>
          <Result
            icon={<BankOutlined />}
            title="Payment method confirmed: Momo"
            subTitle={`Please transfer with the content below. Thanks you so much! \n(Please enter the correct transfer content to avoid unfortunate situations)`}
            style={{ whiteSpace: "pre-line" }}
          >
            <Descriptions
              bordered
              style={{
                background: "white",
                width: "40%",
                justifyContent: "center",
                border: "inset",
                textAlign: "initial",
                marginLeft: "30%",
              }}
            >
              <Descriptions.Item label="Name of beneficiary" span={3}>
                HOANG TIEN THANH
              </Descriptions.Item>
              <Descriptions.Item label="Phone of beneficiary" span={3}>
                0367662607
              </Descriptions.Item>
              <Descriptions.Item label="Payment amount" span={3}>
                <strong>{cookiesInfoOrder.totalPayment} $</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Transfer contents" span={3}>
                {cookiesInfoOrder.orderCode}
              </Descriptions.Item>
            </Descriptions>
            <br />
            <div className="imageMomo">
              <span
                style={{ fontSize: "24px", color: "hsla(340, 100%, 50%, 0.5)" }}
              >
                Use MoMo to scan the following QR code to transfer money
              </span>
              <br />
              <img
                src="/image/payment.png"
                alt="Momo"
                style={{ height: "178px", width: "178px" }}
              ></img>
            </div>
            <br />
            <div className="imagePayment">
              <span style={{ fontSize: "24px" }}>
                Upload a transfer verification image
              </span>
              <div className="imagePayment" style={{ paddingTop: "20px" }}>
                <ImgCrop rotate>
                  <Upload
                    name="imagePayment"
                    listType="picture-card"
                    className={"imagePaymentUpload"}
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                  >
                    {state.imageUrl ? (
                      <img
                        id="imagePayment"
                        src={state.imageUrl}
                        alt="imagePayment"
                        style={{
                          width: "144px",
                          height: "144px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </div>
              <Button type="primary" htmlType="submit" onClick={onClick}>
                Upload
              </Button>
            </div>
          </Result>
        </div>
      )}
      {cookiesInfoOrder.payments === "COD" && (
        <div>
          <Result
            icon={<BankOutlined />}
            title="Payment method confirmed: COD"
            subTitle={`Your order code: ${cookiesInfoOrder.orderCode}`}
          />
        </div>
      )}
      {cookiesInfoOrder.payments === "Bank account" && (
        <div>
          <Result
            icon={<BankOutlined />}
            title="Payment method confirmed: Bank account"
            subTitle={`Please transfer with the content below. Thanks you so much! \n(Please enter the correct transfer content to avoid unfortunate situations)`}
            style={{ whiteSpace: "pre-line" }}
          >
            <Descriptions
              bordered
              style={{
                background: "white",
                width: "70%",
                justifyContent: "center",
                border: "inset",
                textAlign: "initial",
                marginLeft: "15%",
              }}
            >
              <Descriptions.Item label="Bank" span={3}>
                Ngân hàng thương mại cổ phần Ngoại thương Việt Nam (Vietcombank)
              </Descriptions.Item>
              <Descriptions.Item label="Name of beneficiary" span={3}>
                HOANG TIEN THANH
              </Descriptions.Item>
              <Descriptions.Item label="Branch" span={1.5}>
                THU DUC - TRU SO CHINH
              </Descriptions.Item>
              <Descriptions.Item label="Account number" span={1.5}>
                0381000541292
              </Descriptions.Item>
              <Descriptions.Item label="Payment amount" span={3}>
                <strong>{cookiesInfoOrder.totalPayment} $</strong>
              </Descriptions.Item>
              <Descriptions.Item label="Transfer contents" span={3}>
                {cookiesInfoOrder.orderCode}
              </Descriptions.Item>
            </Descriptions>
            <br />
            <div className="imagePayment">
              <span style={{ fontSize: "24px" }}>
                Upload a transfer verification image
              </span>
              <div className="imagePayment" style={{ paddingTop: "20px" }}>
                <ImgCrop rotate>
                  <Upload
                    name="imagePayment"
                    listType="picture-card"
                    className={"imagePaymentUpload"}
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                  >
                    {state.imageUrl ? (
                      <img
                        id="imagePayment"
                        src={state.imageUrl}
                        alt="imagePayment"
                        style={{
                          width: "144px",
                          height: "144px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </div>
              <Button type="primary" htmlType="submit" onClick={onClick}>
                Upload
              </Button>
            </div>
          </Result>
        </div>
      )}
      {cookiesInfoOrder.payments === "Paypal" && (
        <div>
          <Result
            icon={<img src="/paypal.png" alt=""/>}
            title="Payment method confirmed: Paypal"
            subTitle={`Your order code: ${cookiesInfoOrder.orderCode}`}
          >
            <Button
              type="primary"
              htmlType="submit"
              onClick={onClickPaypal}
              style={{ paddingTop: "0px", marginBottom: "20px" }}
            >
              Go to Paypal
            </Button>
            <br />
            <div className="imagePayment">
              <span style={{ fontSize: "24px" }}>
                Upload a transfer verification image
              </span>
              <div className="imagePayment" style={{ paddingTop: "20px" }}>
                <ImgCrop rotate>
                  <Upload
                    name="imagePayment"
                    listType="picture-card"
                    className={"imagePaymentUpload"}
                    showUploadList={false}
                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                    beforeUpload={beforeUpload}
                    onChange={onChange}
                  >
                    {state.imageUrl ? (
                      <img
                        id="imagePayment"
                        src={state.imageUrl}
                        alt="imagePayment"
                        style={{
                          width: "144px",
                          height: "144px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      uploadButton
                    )}
                  </Upload>
                </ImgCrop>
              </div>
              <Button type="primary" htmlType="submit" onClick={onClick}>
                Upload
              </Button>
            </div>
          </Result>
        </div>
      )}
    </>
  );
};

export { Payment };
