import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Layout, Menu, notification, Dropdown } from "antd";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import * as config from "../../constants/config";
import { getAcc, getUser } from "./../../api/user";
import { logout } from "./../../api/auth";
import { insertUser, resetUser } from "./../../store/reducers/user";
import { insertAcc, resetAcc } from "./../../store/reducers/acc";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
const { Header } = Layout;

const PageHeader = () => {
  const history = useHistory();
  const [state, setState] = useState({
    acc: {},
    user: {},
    style: {},
  });
  const user = useSelector((state) => state.user.User);
  const acc = useSelector((state) => state.acc.Acc);
  const dispatch = useDispatch();
  const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      setState((prev) => ({ ...prev, style: { visibility: "visible" } }));
    }
    if (token) {
      setState((prev) => ({ ...prev, style: { visibility: "hidden" } }));
    }
    if (token && Object.keys(acc).length === 0) {
      const fetchData = async () => {
        const re_acc = await getAcc(token);
        const re_user = await getUser(token);
        if (re_user.code === 401 || re_acc.code === 401) {
          Cookies.remove("token", { path: "" });
          notification["warning"]({
            message: "Warning",
            description: `${re_acc.message}`,
          });
          history.push("/account/sign-in/reload");
        } else if (re_user.code !== 401 && re_acc.code !== 401) {
          dispatch(insertAcc({ newAcc: re_acc.data }));
          dispatch(insertUser({ newUser: re_user.data }));
        }
      };
      fetchData();
    }
    setState((prev) => ({ ...prev, user, acc }));
  }, [acc, user, token, dispatch, history]);

  const handleMenuClick = (e) => {
    // console.log("click", e);
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
    <div className="htmlHeader">
      {state.acc.role !== "Admin" && state.acc.role !== "Saler" && (
        <Header>
          <div className="logo-avatar">
            {token && state.acc.role === "Customer" && (
              <Dropdown
                overlay={menu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <span className="user-action" style={{ cursor: "pointer" }}>
                  {!state.user.image && state.user.gender === "Male" && (
                    <>
                      <img
                        src="/image/avatar/male.jpg"
                        alt=""
                        className="avatar-img"
                        style={{
                          objectFit: "cover",
                          width: "64px",
                          height: "64px",
                        }}
                      ></img>
                    </>
                  )}
                  {!state.user.image && state.user.gender === "Female" && (
                    <>
                      <img
                        src="/image/avatar/female.jpg"
                        alt=""
                        className="avatar-img"
                        style={{
                          objectFit: "cover",
                          width: "64px",
                          height: "64px",
                        }}
                      ></img>
                    </>
                  )}
                  {state.user.image && (
                    <>
                      <img
                        src={`${config.API_URL}/user/avatar/${state.acc._id}`}
                        alt=""
                        className="avatar-img"
                        style={{
                          objectFit: "cover",
                          width: "64px",
                          height: "64px",
                        }}
                      ></img>
                    </>
                  )}
                </span>
              </Dropdown>
            )}
          </div>
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item key="home">
              <Link to="/home">Home</Link>
            </Menu.Item>
            <Menu.Item key="product">
              <Link to="/product/all">Product</Link>
            </Menu.Item>
            <Menu.Item key="signUp" style={state.style}>
              <Link to="/account/sign-up">Sign Up</Link>
            </Menu.Item>
            <Menu.Item key="signIn" style={state.style}>
              <Link to="/account/sign-in">Sign In</Link>
            </Menu.Item>
          </Menu>
        </Header>
      )}
    </div>
  );
};

export default PageHeader;
