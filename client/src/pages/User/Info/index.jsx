import React from "react";
import "antd/dist/antd.css";
import "./index.css"
import { Descriptions } from "antd";

const Info = () => {
  return (
    <div className="htmlInfo">
      <div className="description">
        <Descriptions title="User Info">
          <Descriptions.Item label="Full Name">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="Username">
            Hangzhou, Zhejiang
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
          <Descriptions.Item label="Email">empty@gmail.com</Descriptions.Item>
          <Descriptions.Item label="Address">
            No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item>
          <Descriptions.Item label="Active">empty</Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export { Info };
