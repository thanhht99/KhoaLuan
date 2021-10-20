import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Steps, Button, message, notification } from "antd";
import {
  ShoppingCartOutlined,
  SolutionOutlined,
  BankOutlined,
  SmileOutlined,
  CheckSquareOutlined,
} from "@ant-design/icons";
import { InfoCart } from "./InfoCart";
import { InfoOrder } from "./InfoOrder";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { updateCart } from "../../store/reducers/cart";
import { updateInfoOrder } from "../../store/reducers/infoOrder";

const { Step } = Steps;

const Cart = (props) => {
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart.Carts, shallowEqual);
  const reduxInfoOrder = useSelector(
    (state) => state.infoOrder.InfoOrder,
    shallowEqual
  );
  const cookiesInfoOrder = JSON.parse(Cookies.get("infoOrder"));
  console.log(
    "🚀 ~ file: index.jsx ~ line 30 ~ Cart ~ cookiesInfoOrder",
    cookiesInfoOrder
  );
  const cookiesCart = JSON.parse(Cookies.get("cart"));
  const [state, setState] = useState({
    cart: reduxCart,
  });

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
      content: "Reconfirm the order-content",
      icon: <CheckSquareOutlined />,
    },
    {
      title: "Payment methods",
      content: "Payment methods-content",
      icon: <BankOutlined />,
    },
    {
      title: "Done",
      content: "Done-content",
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
        {current > 1 && current < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {current === steps.length - 1 && (
          <Button
            type="primary"
            onClick={() => message.success("Processing complete!")}
          >
            Done
          </Button>
        )}
        {current > 0 && (
          <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </div>
  );
};

export { Cart };
