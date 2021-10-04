import React, { useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  Layout,
  Menu,
  Breadcrumb,
  Calendar,
  Card,
  Col,
  Row,
  Progress,
  Dropdown,
} from "antd";
import PieCategory from "./percentage-of-sales-category";
import {
  UserOutlined,
  HomeOutlined,
  TagFilled,
  UsergroupAddOutlined,
  SketchOutlined,
  DatabaseFilled,
  NotificationOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  CaretUpOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { NotFound } from "../../_components/NotFound/index";
import { resetAcc } from "../../store/reducers/acc";
import { resetUser } from "../../store/reducers/user";
import { logout } from "../../api/auth";
const { SubMenu } = Menu;
const { Sider, Content, Header } = Layout;

const Dashboard = () => {
  const history = useHistory();
  const [state, setState] = useState({
    collapsed: false,
  });
  const dispatch = useDispatch();
  const toggle = () => {
    setState((prev) => ({
      ...prev,
      collapsed: !prev.collapsed,
    }));
  };

  const token = Cookies.get("token");
  const acc = useSelector((state) => state.acc.Acc);
  if (!token) {
    history.push("/account/sign-in");
  }

  const handleMenuClick = (e) => {};

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/user/info">Info</Link>
      </Menu.Item>
      <Menu.Item
        key="2"
        icon={<LogoutOutlined />}
        onClick={async () => {
          Cookies.remove("token", { path: "" });
          await logout(token);
          dispatch(resetAcc());
          dispatch(resetUser());
        }}
      >
        <Link to="/account/sign-in/reload">Logout</Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="htmlDashboard" id="htmlDashboard">
      {token && acc.role === "Admin" ? (
        <Layout style={{ padding: "0px" }}>
          <Header
            className="headerDashboard"
            style={{ display: "inline-flex", justifyContent: "space-between" }}
          >
            <div className="logoDashboard">
              <img
                src="/image/logoDashboard.gif"
                alt=""
                className="logoDashboard-img"
                style={{ objectFit: "cover" }}
              ></img>
              {React.createElement(
                state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                {
                  className: "trigger",
                  onClick: toggle,
                }
              )}
            </div>
            <div className="admin-avatar">
              <Dropdown
                overlay={menu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <span className="user-action" style={{ cursor: "pointer" }}>
                  <img
                    src="/image/avatarMan.jpg"
                    alt=""
                    className="avatar-img"
                    style={{
                      objectFit: "cover",
                      width: "64px",
                      height: "64px",
                    }}
                  ></img>
                </span>
              </Dropdown>
            </div>
          </Header>
          <Layout style={{ padding: "0px" }}>
            <Sider
              trigger={null}
              collapsible
              collapsed={state.collapsed}
              width={200}
              className="site-layout-background"
            >
              <Menu
                mode="inline"
                defaultSelectedKeys={["1"]}
                defaultOpenKeys={["sub1"]}
                style={{ height: "100%", borderRight: 0 }}
              >
                <SubMenu
                  key="customer"
                  icon={<UserOutlined />}
                  title="Customer"
                >
                  <Menu.Item key="accountCustomer">Account</Menu.Item>
                  <Menu.Item key="infoCustomer">Info</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="staff"
                  icon={<UsergroupAddOutlined />}
                  title="Staff"
                >
                  <Menu.Item key="accountStaff">Account</Menu.Item>
                  <Menu.Item key="infoStaff">Info</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="product"
                  icon={<DatabaseFilled />}
                  title="Product"
                >
                  <Menu.Item key="listProduct">List</Menu.Item>
                  <Menu.Item key="category">Category</Menu.Item>
                  <Menu.Item key="feedback">Feedback</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="business"
                  icon={<SketchOutlined />}
                  title="Business"
                >
                  <Menu.Item key="bill">Bill</Menu.Item>
                  <Menu.Item key="order">Order</Menu.Item>
                </SubMenu>
                <SubMenu key="sale" icon={<TagFilled />} title="Sale">
                  <Menu.Item key="promotion">Promotion</Menu.Item>
                  <Menu.Item key="voucher">Voucher</Menu.Item>
                </SubMenu>
                <SubMenu
                  key="notify"
                  icon={<NotificationOutlined />}
                  title="Notify"
                ></SubMenu>
              </Menu>
            </Sider>
            <Layout style={{ padding: "0 24px 24px" }}>
              <Breadcrumb style={{ margin: "16px 0" }}>
                <Breadcrumb.Item href="">
                  <HomeOutlined />
                </Breadcrumb.Item>
              </Breadcrumb>
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
                    <Col span={8}>
                      <Card
                        title="Current Visits"
                        bordered={false}
                        style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
                      >
                        <div className="overview-header-count">8846/10000</div>
                        <Progress percent={75} />
                        <div className="overview-body">
                          <span className="new-registered-user-span">
                            New registered user: 10
                          </span>
                          <br />
                          <span style={{ fontWeight: "bold", color: "green" }}>
                            <CaretUpOutlined />
                            10%
                          </span>
                        </div>
                      </Card>
                    </Col>
                    <Col span={8}>
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
                    </Col>
                    <Col span={8}>
                      <Card
                        title="Calendar"
                        bordered={false}
                        style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
                      >
                        <Calendar
                          fullscreen={false}
                          className="dashboard-calendar"
                        />
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
            </Layout>
          </Layout>
        </Layout>
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export { Dashboard };
