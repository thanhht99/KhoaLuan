import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Steps, Button, notification } from "antd";
import {
  ShoppingCartOutlined,
  SolutionOutlined,
  BankOutlined,
  SmileOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { InfoCart } from "./InfoCart";
import { InfoOrder } from "./InfoOrder";
import { Reconfirm } from "./Reconfirm";
import { Payment } from "./Payment";
import { Done } from "./Done";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { resetCart, updateCart } from "../../store/reducers/cart";
import {
  // resetInfoOrder,
  updateInfoOrder,
} from "../../store/reducers/infoOrder";
import { createOrder } from "../../api/order";
import { saveCart } from "../../api/cart";

const { Step } = Steps;

const Cart = (props) => {
  const cookiesPositionCart = JSON.parse(Cookies.get("positionCart"));
  const token = Cookies.get("token");

  const [current, setCurrent] = useState(cookiesPositionCart);
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart.Carts, shallowEqual);
  const reduxInfoOrder = useSelector(
    (state) => state.infoOrder.InfoOrder,
    shallowEqual
  );
  const cookiesCart = JSON.parse(Cookies.get("cart"));
  const [state, setState] = useState({
    cart: reduxCart,
  });

  // console.log("🚀 ~ file: index.jsx ~ line 40 ~ Cart ~ state", state);

  useEffect(() => {
    if (reduxCart.length !== cookiesCart.length) {
      dispatch(updateCart());
      dispatch(updateInfoOrder());
    }
    if (reduxCart.length > 0) {
      setState({ cart: reduxCart });
      dispatch(updateInfoOrder());
    } else {
      setState({ cart: [] });
    }
  }, [reduxCart, dispatch, cookiesCart.length]);

  const steps = [
    {
      title: "Cart",
      content: <InfoCart />,
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Info Order",
      content: <InfoOrder />,
      icon: <SolutionOutlined />,
    },
    {
      title: "Reconfirm the order",
      content: <Reconfirm />,
      icon: <CheckSquareOutlined />,
    },
    {
      title: "Payment",
      content: <Payment />,
      icon: <BankOutlined />,
    },
    {
      title: "Done",
      content: <Done />,
      icon: <SmileOutlined />,
    },
  ];

  const onClickInfoOrder = () => {
    if (
      !reduxInfoOrder.address ||
      !reduxInfoOrder.email ||
      !reduxInfoOrder.fullName ||
      !reduxInfoOrder.phone ||
      reduxInfoOrder.isError
    ) {
      notification["warning"]({
        message: "Warning",
        description: "Please fill in all required information !",
      });
    } else {
      let json_InfoOrder = JSON.stringify(reduxInfoOrder);
      Cookies.set("infoOrder", json_InfoOrder, { path: "/" });
      Cookies.set("positionCart", 2, { path: "/" });
      next();
    }
  };

  const onClickInfoOrder2 = async () => {
    if (reduxInfoOrder.isError2) {
      notification["error"]({
        message: "Error",
        description: "Please choose a payment method!",
      });
    } else if (!reduxInfoOrder.isError2) {
      const apiOrder = await createOrder(reduxInfoOrder);
      // console.log("💯💯💯💯💯💯 apiOrder", apiOrder);

      if (apiOrder.success) {
        // save cart
        if (token) {
          const body = {
            products: [],
          };
          await saveCart(body, token);
        }

        let json_InfoOrder = JSON.stringify(apiOrder.data);
        Cookies.set("infoOrder", json_InfoOrder, { path: "/" });
        Cookies.set("positionCart", 3, { path: "/" });
        next();
      }
      if (!apiOrder.success) {
        notification["warning"]({
          message: "Warning",
          description: `${apiOrder.message}`,
        });
      }
    }
  };

  const onClickInfoOrder3 = async () => {
    const cookiesInfoOrderUpdate = JSON.parse(Cookies.get("infoOrder"));
    if (
      (cookiesInfoOrderUpdate.payments === "Momo" ||
        cookiesInfoOrderUpdate.payments === "Bank account" ||
        cookiesInfoOrderUpdate.payments === "Paypal") &&
      !cookiesInfoOrderUpdate.imagePayment
    ) {
      notification["error"]({
        message: "Error",
        description: "Please upload payment image!",
      });
    } else if (
      cookiesInfoOrderUpdate.payments === "COD" ||
      cookiesInfoOrderUpdate.imagePayment
    ) {
      dispatch(resetCart());
      // dispatch(resetInfoOrder());
      Cookies.set("positionCart", 0, { path: "/" });
      Cookies.set("keyCart", 0, { path: "/" });
      next();
    }
  };

  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };
  return (
    <div className="htmlCart" id="htmlCart">
      <Steps current={current}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      <div className="steps-content">{steps[current].content}</div>
      <div className="steps-action">
        {current === 0 && (
          <Button
            type="primary"
            onClick={() => {
              if (state.cart.length > 0) {
                next();
              } else {
                notification["warning"]({
                  message: "Warning",
                  description: "There are no products in the cart yet !",
                });
              }
            }}
          >
            Next
          </Button>
        )}
        {current === 1 && (
          <Button type="primary" htmlType="submit" onClick={onClickInfoOrder}>
            Next
          </Button>
        )}
        {current === 2 && (
          <Button type="primary" htmlType="submit" onClick={onClickInfoOrder2}>
            Next
          </Button>
        )}
        {current === 3 && (
          <Button type="primary" htmlType="submit" onClick={onClickInfoOrder3}>
            Next
          </Button>
        )}
        {current > 0 && current < 3 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export { Cart };
