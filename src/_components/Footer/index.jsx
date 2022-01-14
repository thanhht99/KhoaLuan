import React from "react";
import "./index.css";
import { Layout, Row, Col } from "antd";
import { useSelector } from "react-redux";
import GoogleMapReact from "google-map-react";
import {
  YoutubeFilled,
  TwitterOutlined,
  FacebookFilled,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

// API key free
const API_KEY = "AIzaSyAuqtG8XhmKQPGoYpFi9dqZmhZTDWGCxE0";
// const API_KEY = process.env.REACT_APP_API_KEY;
const AnyReactComponent = ({ text }) => (
  <div
    style={{
      fontWeight: "bold",
      fontSize: "14px",
      color: "red",
    }}
  >
    {text}
  </div>
);

const PageFooter = () => {
  const acc = useSelector((state) => state.acc.Acc);

  return (
    <div className="htmlFooter">
      {acc.role !== "Admin" && acc.role !== "Saler" && (
        <Footer>
          <Row
            className={"row-footer"}
            justify="space-around"
            style={{ paddingBottom: "30px" }}
          >
            <Col span={5}>
              <div className="footer-row-name-col">
                <h3>Contact</h3>
                <div className="contact">
                  <p className="contact-email">
                    <MailOutlined style={{ color: "#EA4335" }} />
                    <span> hoangtienthanh1999@gmail.com</span>
                  </p>
                  <p>
                    <PhoneOutlined style={{ color: "#2bc48a" }} />
                    <span> 0367662607</span>
                  </p>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className="footer-row-name-col">
                <h3>Follow</h3>
                <div className="follow">
                  <YoutubeFilled style={{ color: "red", cursor: "pointer" }} />
                  <FacebookFilled
                    style={{ color: "#2962ff", cursor: "pointer" }}
                  />
                  <TwitterOutlined
                    style={{ color: "rgb(29, 155, 240)", cursor: "pointer" }}
                  />
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div className="footer-row-name-col">
                <h3>Address</h3>
                <div className="address">
                  <BankOutlined style={{ color: "#337ab7" }} />
                  <span style={{ paddingLeft: "5px" }}>
                    1 Vo Van Ngan, Linh Chieu, Thu Duc City, Ho Chi Minh City
                  </span>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div
                className="map-address"
                style={{ height: "180px", width: "230px" }}
              >
                <GoogleMapReact
                  bootstrapURLKeys={{
                    key: API_KEY,
                  }}
                  defaultCenter={{ lat: 10.849967, lng: 106.77164 }}
                  defaultZoom={16}
                >
                  <AnyReactComponent
                    lat={10.849967}
                    lng={106.771644}
                    text="Our Store"
                  />
                </GoogleMapReact>
              </div>
            </Col>
          </Row>
          <div
            className="copy-right"
            style={{ textAlign: "center", borderTop: "1px solid #292a2d" }}
          >
            <br />
            <span>Copyright ©2021 AT99. Powered by Ant Design</span>
          </div>
        </Footer>
      )}
    </div>
  );
};

export default PageFooter;
