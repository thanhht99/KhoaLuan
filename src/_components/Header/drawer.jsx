import React, { useEffect, useState } from "react";
import { Badge, Drawer, Button, Row, Col, notification } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Cookies from "js-cookie";
import {
  getCartFromAPI,
  resetCart,
  updateCart,
} from "./../../store/reducers/cart";
import { Link } from "react-router-dom";
import { getCart, saveCart } from "../../api/cart";
import { useHistory } from "react-router";
import { doNotGetData } from "../../constants/doNotGetData";

const Drawers = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxCart = useSelector((state) => state.cart.Carts, shallowEqual);
  const cookiesCart = JSON.parse(Cookies.get("cart"));
  const token = Cookies.get("token");
  const acc = useSelector((state) => state.acc.Acc);

  if (reduxCart.length !== cookiesCart.length) {
    dispatch(updateCart());
  }
  const [state, setState] = useState({
    shoppingCartList: reduxCart,
    checkAPI: false,
    drawerVisible: false,
  });

  const DescriptionItem = ({ title, url }) => (
    <div
      style={{
        fontSize: 14,
        lineHeight: "22px",
        marginBottom: 7,
        color: "rgba(0,0,0,0.65)",
        width: "470px",
      }}
    >
      <img src={url} alt="example" width="60" height="60" />
      <p
        style={{
          marginLeft: 8,
          display: "inline-block",
          color: "rgba(0,0,0,0.85)",
        }}
      >
        {title}
      </p>
    </div>
  );

  // console.log("💯💯💯💯💯💯 state", state);

  useEffect(() => {
    const fetchData = async () => {
      const get_cart = await getCart(token);
      if (!get_cart) {
        doNotGetData();
      }
      if (get_cart) {
        if (get_cart.success) {
          // console.log("🚀🚀🚀🚀🚀 ~ get_cart.data", get_cart.data);
          dispatch(getCartFromAPI({ newCart: get_cart.data.products }));
          setState((prev) => ({
            ...prev,
            shoppingCartList: get_cart.data.products,
          }));
        }
        if (!get_cart.success) {
          if (get_cart.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning: get order",
              description: `${get_cart.message}`,
            });
            history.push("/account/sign-in/reload");
            window.location.reload();
          } else {
            notification["warning"]({
              message: "Warning: get order",
              description: `${get_cart.message}.`,
            });
          }
        }
      }
    };
    if (token && !state.checkAPI && acc.role === "Customer") {
      fetchData();
      setState((prev) => ({
        ...prev,
        checkAPI: true,
      }));
    }
    if (!token && state.checkAPI) {
      setState((prev) => ({
        ...prev,
        checkAPI: false,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        shoppingCartList: reduxCart,
      }));
    }
  }, [
    state.shoppingCartList.length,
    state.checkAPI,
    token,
    dispatch,
    history,
    reduxCart,
    acc.role,
  ]);

  const update = () => {
    setState({
      ...state,
      drawerVisible: state.drawerVisible ? false : true,
    });
  };

  const onClickClear = () => {
    dispatch(resetCart());
  };

  const onClickSaveCart = async () => {
    // console.log("💦💦💦💦💦💦 state", state);

    const body = {
      products: state.shoppingCartList,
    };

    const save = await saveCart(body, token);
    if (save && save.success) {
      notification["success"]({
        message: "Save",
        description: "Successfully saved",
      });
    }
    if (save && !save.success) {
      if (save.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Save cart",
          description: `${save.message}`,
        });
        history.push("/account/sign-in/reload");
        // window.location.reload();
      }
      if (typeof save.message === "object") {
        const message = Object.keys(save.message).map((key) => {
          return save.message[key];
        });
        notification["warning"]({
          message: "Save cart",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Save cart",
          description: `${save.message}`,
        });
      }
    }
  };

  return (
    <>
      <Badge
        size="default"
        count={state.shoppingCartList.length}
        // count={10}
        style={{ right: "15px", top: "15px" }}
      >
        <ShoppingCartOutlined
          style={{
            margin: "17px",
            color: "white",
            cursor: "pointer",
            fontSize: "26px",
          }}
          onClick={update}
        />
      </Badge>
      <Drawer
        title="Cart List"
        width={520}
        placement="right"
        closable={true}
        onClose={() => setState({ ...state, drawerVisible: false })}
        visible={state.drawerVisible}
      >
        {state.shoppingCartList.map((item, index) => (
          <Row key={index}>
            <Col span={12} key={index}>
              <DescriptionItem title={item.name} url={item.image} key={index} />
            </Col>
          </Row>
        ))}

        {token && (
          <Button
            type="primary"
            style={{ margin: 5 }}
            onClick={onClickSaveCart}
          >
            Save cart
          </Button>
        )}

        {state.shoppingCartList.length === 0 ? null : (
          <>
            <Button type="primary" style={{ margin: 5 }}>
              <Link
                to={{
                  pathname: "/cart",
                }}
              >
                Go to cart
              </Link>
            </Button>

            <Button type="primary" style={{ margin: 5 }} onClick={onClickClear}>
              <Link to="/product/all">Clear</Link>
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};
export default Drawers;
