import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import {
  changeNumberProduct,
  deleteProduct,
  updateCart,
} from "./../../store/reducers/cart";
import { Tooltip, InputNumber, Table, Popconfirm } from "antd";

function TotalPrice(price, quantity) {
  return Number(price * quantity).toLocaleString("en-US");
}

const InfoCart = () => {
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart.Carts, shallowEqual);
  const cookiesCart = JSON.parse(Cookies.get("cart"));
  const [state, setState] = useState({
    cart: reduxCart,
  });
  let TotalCart = 0;
  state.cart.forEach((item) => {
    TotalCart += item.quantity * item.price;
  });

  useEffect(() => {
    if (reduxCart.length !== cookiesCart.length) {
      dispatch(updateCart());
    }
    if (reduxCart.length > 0) {
      setState({ cart: reduxCart });
    } else {
      setState({ cart: [] });
    }
  }, [reduxCart, dispatch, cookiesCart.length]);

  const onChangeQuantity = (e, id) => {
    if (e) {
      dispatch(changeNumberProduct({ quantity: e, id }));
    }
    if (!e) {
      dispatch(changeNumberProduct({ quantity: 1, id }));
    }
  };

  const confirm = (record) => {
    dispatch(deleteProduct({ id: record.id }));
  };

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      width: "30%",
      render: (name) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={name}
          >
            {name}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "10%",
      align: "center",
      render: (image) => (
        <>
          <img
            src={image}
            style={{ width: "100px", height: "80px", objectFit: "cover" }}
            alt=""
          />
        </>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "10%",
      align: "center",
      render: (price) => <div>{price}$</div>,
    },
    {
      title: "Quantity",
      dataIndex: ["id", "record"],
      width: "10%",
      align: "center",
      editable: true,
      inputType: "number",
      render: (id, record) => (
        <div>
          <InputNumber
            min={1}
            max={20}
            defaultValue={record.quantity}
            style={{ width: "70%" }}
            onChange={(e) => onChangeQuantity(e, record.id)}
          />
        </div>
      ),
    },
    {
      title: "Total Price",
      dataIndex: ["id", "record"],
      align: "center",
      render: (id, record) => (
        <div style={{ fontWeight: "bold" }}>
          {TotalPrice(record.price, record.quantity)}$
        </div>
      ),
    },
    {
      title: "Operation",
      dataIndex: ["id", "record"],
      render: (id, record) => (
        <Popconfirm title="Sure to delete?" onConfirm={() => confirm(record)}>
          <span style={{ color: "red", cursor: "pointer" }}>Delete</span>
        </Popconfirm>
      ),
    },
  ];
  return (
    <div style={{ paddingBottom: "50px" }}>
      <Table columns={columns} dataSource={state.cart} />
      <div
        className=""
        style={{
          color: "hsla(340, 100%, 50%, 0.5)",
          float: "left",
          paddingLeft: "16px",
          fontSize: "20px",
        }}
      >
        <span>
          Total :
          <strong> {Number(TotalCart).toLocaleString("en-US")} $</strong>
        </span>
        <br />
      </div>
    </div>
  );
};

export { InfoCart };
