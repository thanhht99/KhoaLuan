import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import PieCategory from "./percentage-of-sales-category";
import { Layout, Calendar, Card, Col, Row } from "antd";
// import { CaretUpOutlined } from "@ant-design/icons";
const { Content } = Layout;

const HomeDashboard = () => {
  return (
    <>
      <Content
        className="site-layout-background"
        style={{
          padding: 24,
          margin: 0,
          maxHeight: 561,
        }}
      >
        <div className="site-card-dashboard">
          <Row gutter={16}>
            
            {/* <Col span={8}>
              <Card
                title="Total sales"
                bordered={false}
                style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
              >
                <div className="overview-header-count">$ 126,560</div>
                <div className="overview-body">
                  <span>Change from yesterday</span>
                  <span style={{ fontWeight: "bold", color: "green" }}>
                    <CaretUpOutlined />
                    10%
                  </span>
                </div>
                <div className="overview-footer">
                  <span>Daily turnover</span>
                  <span style={{ marginLeft: "7px" }}>$ 12.423</span>
                </div>
              </Card>
            </Col> */}
            <Col span={12}>
              <Card
                title="Calendar"
                bordered={false}
                style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
              >
                <Calendar fullscreen={false} className="dashboard-calendar" />
              </Card>
            </Col>
          </Row>
        </div>
      </Content>

      <Content
        className="percentage-of-sales-category"
        style={{
          maxHeight: 469,
        }}
      >
        <div className="title-percentage-of-sales-category">
          <h1>Percentage of sales category</h1>
        </div>
        <PieCategory />
      </Content>
    </>
  );
};

export { HomeDashboard };
