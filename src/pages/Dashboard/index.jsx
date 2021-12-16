import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import * as config from "../../constants/config";
import { Layout, Menu, Tabs, Dropdown, Spin, notification } from "antd";
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
  ShoppingCartOutlined,
  GiftOutlined,
  WechatOutlined,
  AndroidOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { NotFound } from "../../_components/NotFound/index";
import { resetAcc } from "../../store/reducers/acc";
import { resetUser } from "../../store/reducers/user";
import { logout } from "../../api/auth";
import { HomeDashboard } from "./HomeDashboard";
import { ListOfProducts } from "./Product/ListOfProducts";
import { ListOfCategory } from "./Category/ListOfCategory";
import { ListOfOrders } from "./Order/ListOfOrders";
import { ListOfVoucher } from "./Voucher/ListOfVoucher";
import { ListOfPromotion } from "./Promotion/ListOfPromotion";
import { ListOfSupport } from "./SupportChat/ListOfSupport";
import { doNotGetData } from "../../constants/doNotGetData";
import { getAllCategoryTrueAndFalse } from "../../api/category";
import { getProducts } from "../../api/product";
import { insertProductAll } from "../../store/reducers/productAll";
import { insertCategoryTAF } from "../../store/reducers/categoryTrueAndFalse";
import { Predict } from "./Predict/Predict";
import { ListOfStaffs } from "./Staff/ListOfStaffs";
import { ListOfCustomers } from "./Customer/ListOfCustomers";

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
    user: {},
    acc: {},
    image: "",
  });

  // console.log("🚀🚀🚀🚀🚀🚀", state);

  const dispatch = useDispatch();
  const toggle = () => {
    setState((prev) => ({
      ...prev,
      collapsed: !prev.collapsed,
    }));
  };

  const token = Cookies.get("token");
  const user = useSelector((state) => state.user.User);
  const acc = useSelector((state) => state.acc.Acc);

  if (!token) {
    history.push("/account/sign-in");
  }

  useEffect(() => {
    if (user) {
      if (!user.image && user.gender === "Male") {
        setState((prev) => ({
          ...prev,
          user,
          image: "/image/avatar/male.jpg",
        }));
      }
      if (!user.image && user.gender === "Female") {
        setState((prev) => ({
          ...prev,
          user,
          image: "/image/avatar/female.jpg",
        }));
      }
      if (user.image) {
        setState((prev) => ({
          ...prev,
          user,
          image: `${config.API_URL}/user/avatar/${acc._id}`,
        }));
      }
    }
  }, [acc._id, state.user, user]);

  useEffect(() => {
    const fetchData = async () => {
      const re_category = await getAllCategoryTrueAndFalse(token);
      const re_product = await getProducts();
      if (!re_category || !re_product) {
        doNotGetData();
      }
      if (re_category && re_product) {
        if (re_category.success && re_product.success) {
          const keyCategory = re_category.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertCategoryTAF({ newCategory: keyCategory }));
          const keyProducts = re_product.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertProductAll({ newProduct: keyProducts }));
        }
        if (!re_category.success || !re_product.success) {
          notification["warning"]({
            message: "Warning",
            description: `${re_category.message}.\n ${re_product.message}.`,
          });
        }
      }
    };
    fetchData();
  }, [dispatch, token]);

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
      content: <ListOfStaffs />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickListCustomer = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <UnorderedListOutlined />
          List of Customers
        </span>
      ),
      content: <ListOfCustomers />,
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

  const onClickOrder = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <ShoppingCartOutlined />
          Order
        </span>
      ),
      content: <ListOfOrders />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickVoucher = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <GiftOutlined />
          Voucher
        </span>
      ),
      content: <ListOfVoucher />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickPromotion = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <TagFilled />
          Promotion
        </span>
      ),
      content: <ListOfPromotion />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickSupport = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <WechatOutlined />
          Support chat
        </span>
      ),
      content: <ListOfSupport />,
      key: `${index}`,
    });
    setState((prev) => ({
      ...prev,
      panes,
      newTabIndex: index,
      activeKey: `${index}`,
    }));
  };

  const onClickPredict = () => {
    const { panes, newTabIndex } = state;
    const index = newTabIndex + 1;
    panes.push({
      title: (
        <span>
          <AndroidOutlined />
          Predict order
        </span>
      ),
      content: <Predict />,
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
          Cookies.remove("token", { path: "/" });
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
        acc.role === "Admin" || acc.role === "Saler" ? (
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
                    <img src={state.image} alt="" className="avatar-img"></img>
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
                  {acc.role === "Admin" && (
                    <SubMenu
                      key="admin"
                      icon={<AndroidOutlined />}
                      title="Admin"
                    >
                      <Menu.Item key="predict" onClick={onClickPredict}>
                        Predict order
                      </Menu.Item>
                    </SubMenu>
                  )}

                  {acc.role === "Admin" && (
                    <SubMenu
                      key="customer"
                      icon={<UserOutlined />}
                      title="Customer"
                    >
                      <Menu.Item key="listCustomer" onClick={onClickListCustomer}>
                        List
                      </Menu.Item>
                    </SubMenu>
                  )}

                  {acc.role === "Admin" && (
                    <SubMenu
                      key="staff"
                      icon={<UsergroupAddOutlined />}
                      title="Staff"
                    >
                      <Menu.Item key="listStaff" onClick={onClickListStaff}>
                        List
                      </Menu.Item>
                    </SubMenu>
                  )}

                  <SubMenu
                    key="product"
                    icon={<DatabaseFilled />}
                    title="Product"
                  >
                    <Menu.Item key="listProduct" onClick={onClickListProduct}>
                      List
                    </Menu.Item>
                    {acc.role === "Admin" && (
                      <Menu.Item key="category" onClick={onClickCategory}>
                        Category
                      </Menu.Item>
                    )}
                    {/* <Menu.Item key="feedback">Feedback</Menu.Item> */}
                  </SubMenu>

                  <SubMenu
                    key="business"
                    icon={<SketchOutlined />}
                    title="Business"
                  >
                    {/* <Menu.Item key="bill">Bill</Menu.Item> */}
                    <Menu.Item key="order" onClick={onClickOrder}>
                      Order
                    </Menu.Item>
                  </SubMenu>

                  {acc.role === "Admin" && (
                    <SubMenu key="sale" icon={<TagFilled />} title="Sale">
                      <Menu.Item key="promotion" onClick={onClickPromotion}>
                        Promotion
                      </Menu.Item>
                      <Menu.Item key="voucher" onClick={onClickVoucher}>
                        Voucher
                      </Menu.Item>
                    </SubMenu>
                  )}

                  <SubMenu
                    key="notify"
                    icon={<NotificationOutlined />}
                    title="Notify"
                  >
                    <Menu.Item key="support" onClick={onClickSupport}>
                      Support
                    </Menu.Item>
                  </SubMenu>
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
          <div style={{ display: "grid", margin: "100px" }}>
            <Spin />
          </div>
        )
      ) : (
        <NotFound />
      )}
    </div>
  );
};

export { Dashboard };
