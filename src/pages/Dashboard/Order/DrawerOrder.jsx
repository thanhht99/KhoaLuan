import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import Cookies from "js-cookie";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import {
  Descriptions,
  Spin,
  Steps,
  Switch,
  Table,
  Button,
  Space,
  Popconfirm,
  notification,
  Image,
} from "antd";
import { changeOrderStatus } from "../../../api/order";
import { doNotGetData } from "../../../constants/doNotGetData";
import { cancelOrder } from "../../../api/order";

const { Step } = Steps;

function TotalPrice(price, quantity) {
  return Number(price * quantity).toLocaleString("en-US");
}

const orderStatus = [
  "Waiting for confirmation",
  "Waiting for the goods",
  "Delivered to the carrier",
  "Delivering",
  "Successful delivery",
  "Has received the goods",
  "Cancel order",
  "Return the goods/ Refund",
];

const DrawerOrder = (props) => {
  const history = useHistory();
  const token = Cookies.get("token");
  const reduxOrder = useSelector((state) => state.orderDetail.Order);
  const products = reduxOrder.products.map((item, index) => {
    const product = { ...item, key: index };
    return product;
  });
  const keyCurrent = orderStatus.indexOf(reduxOrder.orderStatus);

  const [state, setState] = useState({
    disabled: true,
    current: keyCurrent,
  });
  const [changeOS, setChangeOS] = useState(false);

  // console.log("🚀 🚀 🚀 🚀 🚀  ~ props", props);
  // console.log("🚀 🚀 🚀 🚀 🚀  ~ reduxOrder", reduxOrder);

  useEffect(() => {
    if (props.id) {
      setState({ current: keyCurrent, disabled: true });
    }
    if (
      props.order.orderStatus === "Cancel order" ||
      props.order.orderStatus === "Return the goods/ Refund"
    ) {
      setChangeOS(true);
    }
    if (
      props.order.orderStatus !== "Cancel order" &&
      props.order.orderStatus !== "Return the goods/ Refund"
    ) {
      setChangeOS(false);
    }
  }, [props.id, keyCurrent, props.order.orderStatus]);

  const next = () => {
    setState((prev) => ({ ...prev, current: prev.current + 1 }));
  };
  const prev = () => {
    setState((prev) => ({ ...prev, current: prev.current - 1 }));
  };

  const columns = [
    {
      title: "SKU",
      dataIndex: "sku",
      width: "30%",
      align: "center",
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
      render: (id, record) => <div>{record.quantity}</div>,
    },
    {
      title: "Discount",
      dataIndex: ["discount"],
      align: "center",
      render: (discount) => (
        <div style={{ fontWeight: "bold", color: "rgb(255 109 44)" }}>
          {discount !== 0 ? (
            discount.discount > 1 ? (
              <>{discount.discount}$</>
            ) : (
              <>{discount.discount * 100}%</>
            )
          ) : null}
        </div>
      ),
    },
    {
      title: "Total Price",
      dataIndex: ["id", "record"],
      align: "center",
      render: (id, record) => (
        <div style={{ fontWeight: "bold" }}>
          {record.discount !== 0 ? (
            record.discount.discount > 1 ? (
              <>
                {TotalPrice(
                  parseFloat(record.price - record.discount.discount).toFixed(
                    2
                  ),
                  record.quantity
                )}
                $
              </>
            ) : (
              <>
                {TotalPrice(
                  parseFloat(
                    record.price - record.price * record.discount.discount
                  ).toFixed(2),
                  record.quantity
                )}
                $
              </>
            )
          ) : (
            <>{TotalPrice(record.price, record.quantity)}$</>
          )}
        </div>
      ),
    },
  ];

  const steps = orderStatus.map((item) => {
    return { title: item };
  });

  const toggleDisabled = () => {
    setState((prev) => ({ ...prev, disabled: !prev.disabled }));
  };

  const onClickConfirm = async () => {
    if (state.current || state.current === 0) {
      const body = {
        orderStatus: orderStatus[state.current],
      };

      const res_changeOrderStatus = await changeOrderStatus(
        props.id,
        body,
        token
      );
      if (!res_changeOrderStatus) {
        doNotGetData();
      }
      if (res_changeOrderStatus) {
        if (res_changeOrderStatus.success) {
          notification["success"]({
            message: "Update order status",
            description: "Change order status successfully",
          });
        }
        if (!res_changeOrderStatus.success) {
          if (res_changeOrderStatus.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning",
              description: `${res_changeOrderStatus.message}`,
            });
            history.push("/account/sign-in/reload");
            window.location.reload();
          }
          notification["warning"]({
            message: "Warning: Change Order Status",
            description: `${res_changeOrderStatus.message}.`,
          });
        }
      }
    }
  };

  const onClickCancel = async (record) => {
    const res = await cancelOrder(record._id, token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        notification["success"]({
          message: "Success",
          description: `${res.data}`,
        });
        setChangeOS(true);
        props.onClose();
        setState((prev) => ({ ...prev, disabled: true }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: cancel order",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
        }
        if (res.message !== "Token is expired") {
          notification["warning"]({
            message: "Warning: cancel order",
            description: `${res.message}.`,
          });
        }
      }
    }
  };

  return (
    <>
      {reduxOrder ? (
        <>
          <Descriptions className={"drawer-order-dashboard"}>
            <Descriptions.Item label="Order Code" span={3}>
              {reduxOrder.orderCode}
            </Descriptions.Item>
            <Descriptions.Item label="Order Date" span={3}>
              {reduxOrder.orderDate}
            </Descriptions.Item>
            <Descriptions.Item label="Customer's name" span={3}>
              {reduxOrder.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={3}>
              {reduxOrder.email}
            </Descriptions.Item>
            <Descriptions.Item label="Phone" span={3}>
              {reduxOrder.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={3}>
              {reduxOrder.address}
            </Descriptions.Item>
          </Descriptions>
          <br />
          <Table columns={columns} dataSource={products} />
          {reduxOrder.payments === "Momo" ||
          reduxOrder.payments === "Bank account" ? (
            <Image
              src={reduxOrder.imagePayment}
              width={200}
              height={200}
              alt=""
            />
          ) : (
            <></>
          )}
          <Descriptions
            className={"drawer-order-dashboard"}
            style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
          >
            <Descriptions.Item label="Payments" span={3}>
              {reduxOrder.payments}
            </Descriptions.Item>
            <Descriptions.Item label="Note" span={3}>
              {reduxOrder.note}
            </Descriptions.Item>
            <Descriptions.Item label="Intended Arrival Date" span={3}>
              {reduxOrder.intendedArrivalDate}
            </Descriptions.Item>

            <Descriptions.Item label="Temporary Money" span={2}>
              {reduxOrder.temporaryMoney}$
            </Descriptions.Item>
            <Descriptions.Item label="Transport Fee" span={1}>
              {reduxOrder.transportFee}$
            </Descriptions.Item>
            <Descriptions.Item label="Voucher Code" span={2}>
              {reduxOrder.voucherCode}
            </Descriptions.Item>
            <Descriptions.Item label="Discount" span={1}>
              {reduxOrder.discount
                ? reduxOrder.discount > 1
                  ? `${reduxOrder.discount}$`
                  : `${reduxOrder.discount * 100}%`
                : null}
            </Descriptions.Item>
            <Descriptions.Item label="Total Payment" span={2}>
              {reduxOrder.totalPayment}$
            </Descriptions.Item>
            <Descriptions.Item label="Total Product" span={1}>
              {reduxOrder.totalProduct}
            </Descriptions.Item>
          </Descriptions>
          <br />
          <Descriptions className={"drawer-order-dashboard"}>
            <Descriptions.Item label="Active">
              <Switch checked={reduxOrder.isActive} />
            </Descriptions.Item>
            <Descriptions.Item label="Bill">
              <Switch checked={reduxOrder.isBill} />
            </Descriptions.Item>
            <Descriptions.Item label="Feedback">
              <Switch checked={reduxOrder.isFeedback} />
            </Descriptions.Item>
          </Descriptions>
          <br />
          <Space size="middle">
            <Button type="primary" onClick={toggleDisabled} disabled={changeOS}>
              Change order status
            </Button>
            <Button
              type="primary"
              disabled={state.disabled}
              onClick={() => next()}
            >
              Next
            </Button>
            <Button
              type="primary"
              disabled={state.disabled}
              onClick={() => prev()}
            >
              Previous
            </Button>
            {props.order.orderStatus !== "Has received the goods" &&
              (props.order.orderStatus === "Waiting for confirmation" ||
              props.order.orderStatus === "Waiting for the goods" ? (
                <>
                  <Popconfirm
                    title="Are you sure to cancel the order?"
                    onConfirm={() => onClickCancel(props.order)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="primary" danger>
                      Cancel
                    </Button>
                  </Popconfirm>
                </>
              ) : (
                <>
                  <Button type="primary" danger disabled>
                    Cancel
                  </Button>
                </>
              ))}
          </Space>
          <div>
            <br />
            <Steps progressDot current={state.current} direction="vertical">
              {steps.map((item) => (
                <Step
                  key={item.title}
                  title={item.title}
                  className={"drawer-steps-order-status"}
                  // style={{ marginTop: "10px" }}
                />
              ))}
            </Steps>

            <Popconfirm
              title="Are you sure to save?"
              onConfirm={onClickConfirm}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" disabled={changeOS}>
                Confirm & Save
              </Button>
            </Popconfirm>
          </div>
        </>
      ) : (
        <div style={{ display: "grid", margin: "100px" }}>
          <Spin />
        </div>
      )}
    </>
  );
};

export { DrawerOrder };
