import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Layout, Menu } from "antd";
import { Link } from "react-router-dom";
const { Header } = Layout;

const PageHeader = () => {
  return (
    <Header>
      <div className="hello">
        <h1>Hello</h1>
      </div>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="home">
          <Link to="/home">Home</Link>
        </Menu.Item>
        <Menu.Item key="signIn">
          <Link to="/account/sign-in">Sign In</Link>
        </Menu.Item>
        <Menu.Item key="signUp">
          <Link to="/account/sign-up">Sign Up</Link>
        </Menu.Item>
      </Menu>
    </Header>
  );
};

export default PageHeader;
