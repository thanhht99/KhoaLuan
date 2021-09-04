import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Row, Col } from "antd";

const ServerUpgrade = () => {
  return (
    <div className="htmlServerUpgrade">
      <Row className="row" style={{ height: "100%", width: "100%" }}>
        <Col
          span={10}
          className={"colServerUpgrade"}>
          <img
            className="imgServerUpgrade"
            src="/image/ServerUpgrade.gif"
            alt="ServerUpgrade"
            style={{ height: "100%", width: "100%" }}></img>
        </Col>
        <Col span={14} className="name">
          <section className="light">
            <h1 className="h1">Network Error</h1>
          </section>
        </Col>
      </Row>
    </div>
  );
};

export { ServerUpgrade };
