import React, { useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { Layout, Menu, Tabs, Dropdown, Spin } from "antd";
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
  UnorderedListOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { NotFound } from "../../_components/NotFound/index";
import { resetAcc } from "../../store/reducers/acc";
import { resetUser } from "../../store/reducers/user";
import { logout } from "../../api/auth";
import { HomeDashboard } from "./HomeDashboard";
import { ListOfProducts } from "./Product/ListOfProducts";
import { ListOfCategory } from "./Category/ListOfCategory";

const { SubMenu } = Menu;
const { Sider, Header } = Layout;
const { TabPane } = Tabs;

const Dashboard = () => {
  const history = useHistory();
  const panes = [
    {
      title: (
        <span>
          <HomeOutlined />
          Home
        </span>
      ),
      content: <HomeDashboard />,
      key: "1",
      closable: false,
    },
  ];
  const [state, setState] = useState({
    collapsed: false,
    activeKey: panes[0].key,
    panes,
    newTabIndex: 2,
  });

  // console.log("🚀 🚀 🚀 🚀 🚀", state);

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

  const onChange = (activeKey) => {
    setState((prev) => ({
      ...prev,
      activeKey,
    }));
  };

  const onEdit = (targetKey, action) => {
    if (action === "remove") {
      remove(targetKey);
    }
  };

  const remove = (targetKey) => {
    let { activeKey } = state;
    let lastIndex;
    state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = state.panes.filter((pane) => pane.key !== targetKey);
    if (panes.length && activeKey === targetKey) {
      if (lastIndex >= 0) {
        activeKey = panes[lastIndex].key;
      } else {
        activeKey = panes[0].key;
      }
    }
    setState((prev) => ({
      ...prev,
      panes,
      activeKey,
    }));
  };

  const handleMenuClick = (e) => {};

  const onClickListProduct = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <UnorderedListOutlined />
          List of products
        </span>
      ),
      content: <ListOfProducts />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickListStaff = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <UnorderedListOutlined />
          List of staffs
        </span>
      ),
      content: "List of staffs",
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickCategory = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <MenuOutlined />
          Category
        </span>
      ),
      content: <ListOfCategory />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

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
      {token ? (
        acc.role === "Admin" ? (
          <Layout style={{ padding: "0px" }}>
            <Header
              className="headerDashboard"
              style={{
                display: "inline-flex",
                justifyContent: "space-between",
              }}
            >
              <div className="logoDashboard">
                <a href="/">
                  <img
                    src="/image/logoDashboard.gif"
                    alt=""
                    className="logoDashboard-img"
                    style={{ objectFit: "cover" }}
                  ></img>
                </a>

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
                    <Menu.Item key="listStaff" onClick={onClickListStaff}>
                      List
                    </Menu.Item>
                    <Menu.Item key="accountStaff">Account</Menu.Item>
                    <Menu.Item key="infoStaff">Info</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="product"
                    icon={<DatabaseFilled />}
                    title="Product"
                  >
                    <Menu.Item key="listProduct" onClick={onClickListProduct}>
                      List
                    </Menu.Item>
                    <Menu.Item key="category" onClick={onClickCategory}>
                      Category
                    </Menu.Item>
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
              <Layout style={{ padding: "24px" }}>
                <Tabs
                  hideAdd
                  onChange={onChange}
                  activeKey={state.activeKey}
                  type="editable-card"
                  onEdit={onEdit}
                >
                  {state.panes.map((pane) => (
                    <TabPane
                      tab={pane.title}
                      key={pane.key}
                      closable={pane.closable}
                    >
                      {pane.content}
                    </TabPane>
                  ))}
                </Tabs>
              </Layout>
            </Layout>
          </Layout>
        ) : (
          <Spin />
        )
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export { Dashboard };
