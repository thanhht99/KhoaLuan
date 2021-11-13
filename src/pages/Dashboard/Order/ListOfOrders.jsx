import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { ReloadOutlined } from "@ant-design/icons";
import {
  Divider,
  Button,
  Table,
  Tooltip,
  notification,
  Drawer,
  Switch,
} from "antd";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { doNotGetData } from "../../../constants/doNotGetData";
import { insertOrderAll } from "../../../store/reducers/orderAll";
import { allOrder } from "../../../api/order";
import { useHistory } from "react-router";
import { DrawerOrder } from "./DrawerOrder";
import { insertOrder } from "../../../store/reducers/orderDetail";

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

const ListOfOrders = () => {
  const token = Cookies.get("token");
  const history = useHistory();
  const dispatch = useDispatch();
  const reduxOrderAll = useSelector((state) => state.orderAll.Order);
  const initialState = {
    orders: reduxOrderAll,
    order: null,
    total: null,
    drawerVisible: false,
  };
  const [state, setState] = useState(initialState);

  const fetchData = async () => {
    const res_allOrder = await allOrder(token);
    if (!res_allOrder) {
      doNotGetData();
    }
    if (res_allOrder) {
      if (res_allOrder.success) {
        const keyAllOrder = res_allOrder.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertOrderAll({ newOrder: keyAllOrder }));
        setState((prev) => ({
          ...prev,
          orders: keyAllOrder,
        }));
      }
      if (!res_allOrder.success) {
        if (res_allOrder.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning",
            description: `${res_allOrder.message}`,
          });
          history.push("/account/sign-in/reload");
          window.location.reload();
        }
        notification["warning"]({
          message: "Warning: Get all orders",
          description: `${res_allOrder.message}.`,
        });
      }
    }
  };

  useEffect(() => {
    if (
      reduxOrderAll.length === 0 ||
      state.orders.length !== reduxOrderAll.length
    ) {
      fetchData();
    }
  });

  const refresh = () => {
    fetchData();
    // setState({ ...initialState });
  };

  const onClickOrder = (record) => {
    // console.log("✅✅✅ Hello World", record);
    setState((prev) => ({
      ...prev,
      order: record,
      drawerVisible: true,
    }));
    dispatch(insertOrder({ newOrder: record }));
  };

  const filterOrderStatus = orderStatus.map((item) => {
    const value = {
      text: item,
      value: item,
    };
    return value;
  });

  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      width: "20%",
      ...getColumnSearchProps("orderCode"),
      render: (orderCode, record) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={orderCode}
            color="hsla(340, 100%, 50%, 0.5)"
            key={record.orderCode}
            onClick={() => onClickOrder(record)}
          >
            {orderCode}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Order Date",
      dataIndex: "orderDate",
      width: "20%",
      ...getColumnSearchProps("orderDate"),
      defaultSortOrder: "descend",
      sorter: (a, b) => a.orderDate.localeCompare(b.orderDate),
    },
    {
      title: "Payments",
      dataIndex: "payments",
      width: "20%",
      filters: [
        {
          text: "Momo",
          value: "Momo",
        },
        {
          text: "COD",
          value: "COD",
        },
        {
          text: "Bank account",
          value: "Bank account",
        },
      ],
      onFilter: (value, record) => {
        return record.payments.indexOf(value) === 0;
      },
    },
    {
      title: "Order Status",
      dataIndex: "orderStatus",
      width: "20%",
      filters: filterOrderStatus,
      onFilter: (value, record) => {
        return record.orderStatus.indexOf(value) === 0;
      },
    },
    {
      title: "Feedback",
      dataIndex: "isFeedback",
      width: "10%",
      filters: [
        {
          text: "True",
          value: "true",
        },
        {
          text: "False",
          value: "false",
        },
      ],
      onFilter: (value, record) => {
        return record.isFeedback.toString().indexOf(value) === 0;
      },
      render: (isFeedback) => (
        <div>
          <Switch checked={isFeedback} />
        </div>
      ),
    },
  ];

  const onClose = async () => {
    fetchData();

    setState((prev) => ({
      ...prev,
      // categories: keyCategory,
      drawerVisible: false,
    }));
  };

  return (
    <>
      <br />
      <Button
        type="primary"
        size="small"
        onClick={refresh}
        icon={<ReloadOutlined />}
        style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
        className={"btn-Reload-Page-List-Of-Orders"}
      >
        Reload Page
      </Button>
      <Divider />
      <Table
        columns={columns}
        dataSource={state.orders}
        footer={() => {
          const total = state.total ? state.total : state.orders.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />
      {state.order && (
        <Drawer
          title={state.order.orderCode}
          width={520}
          onClose={onClose}
          visible={state.drawerVisible}
          className={"drawer-order-dashboard"}
        >
          <DrawerOrder
            id={state.order._id}
            order={state.order}
            drawerVisible={state.drawerVisible}
          />
        </Drawer>
      )}
    </>
  );
};

export { ListOfOrders };
