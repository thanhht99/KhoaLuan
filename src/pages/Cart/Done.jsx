import React from "react";
import "antd/dist/antd.css";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { resetInfoOrder } from "../../store/reducers/infoOrder";

const Done = () => {
  const dispatch = useDispatch();
  const cookiesInfoOrder = JSON.parse(Cookies.get("infoOrder"));

  const onClick = () => {
    dispatch(resetInfoOrder());
  };

  return (
    <div>
      <Result
        status="success"
        title={`Order ${cookiesInfoOrder.orderCode} has been successfully ordered!`}
        subTitle="Your order will be confirmed by the staff within 30 minutes to 1 hour, please wait. Thanks you!"
        extra={
          <Button type="primary" onClick={onClick}>
            <Link to="/product/all">Go to Product List</Link>
          </Button>
        }
      />
    </div>
  );
};

export { Done };
