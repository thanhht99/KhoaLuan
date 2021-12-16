import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { doNotGetData } from "../../../constants/doNotGetData";
import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";
import { Table, notification, Switch, Divider, Button, Popconfirm } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { ExportReactCSV } from "../../../constants/ExportReactCSV ";
import { getAllFeedback, updateActiveFeedback } from "../../../api/feedback";
import { insertFeedback } from "../../../store/reducers/feedbackAll";

const ListOfFeedbacks = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const reduxFeedback = useSelector((state) => state.feedbackAll.Feedback);
  const initialState = {
    feedbackAll: reduxFeedback,
    feedback: null,
    drawerVisible: false,
    total: null,
  };
  const token = Cookies.get("token");

  const [state, setState] = useState(initialState);

  const fetchDataGetFeedback = async () => {
    const res = await getAllFeedback(token);
    if (!res) {
      doNotGetData();
    }
    if (res) {
      if (res.success) {
        const newFeedback = res.data.map((item, index) => {
          const key = index;
          return { ...item, key };
        });
        dispatch(insertFeedback({ newFeedback }));
        setState((prev) => ({
          ...prev,
          feedbackAll: newFeedback,
        }));
      }
      if (!res.success) {
        if (res.message === "Token is expired") {
          Cookies.remove("token", { path: "/" });
          notification["warning"]({
            message: "Warning: get feedback",
            description: `${res.message}`,
          });
          history.push("/account/sign-in/reload");
        }
        if (typeof res.message === "object") {
          const message = Object.keys(res.message).map((key) => {
            return res.message[key];
          });
          notification["warning"]({
            message: "Warning: get feedback",
            description: `${message}`,
          });
        } else {
          notification["warning"]({
            message: "Warning: get feedback",
            description: `${res.message}`,
          });
        }
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllFeedback(token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          const newFeedback = res.data.map((item, index) => {
            const key = index;
            return { ...item, key };
          });
          dispatch(insertFeedback({ newFeedback }));
          setState((prev) => ({
            ...prev,
            feedbackAll: newFeedback,
          }));
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning: get feedback",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
          }
          if (typeof res.message === "object") {
            const message = Object.keys(res.message).map((key) => {
              return res.message[key];
            });
            notification["warning"]({
              message: "Warning: get feedback",
              description: `${message}`,
            });
          } else {
            notification["warning"]({
              message: "Warning: get feedback",
              description: `${res.message}`,
            });
          }
        }
      }
    };
    if (
      reduxFeedback.length === 0 ||
      state.feedbackAll.length !== reduxFeedback.length
    ) {
      fetchData();
    }
  }, [dispatch, history, token, reduxFeedback, state.feedbackAll.length]);

  const confirmIsActive = async (record) => {
    const res = await updateActiveFeedback(record._id, !record.isActive, token);

    if (res && res.success) {
      fetchDataGetFeedback();

      notification["success"]({
        message: "Successfully",
        description: `${res.data}`,
      });
    }
    if (res && !res.success) {
      if (res.message === "Token is expired") {
        Cookies.remove("token", { path: "/" });
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${res.message}`,
        });
        history.push("/account/sign-in/reload");
      }
      if (typeof res.message === "object") {
        const message = Object.keys(res.message).map((key) => {
          return res.message[key];
        });
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${message}`,
        });
      } else {
        notification["warning"]({
          message: "Warning: confirm IsActive",
          description: `${res.message}`,
        });
      }
    }
  };

  const columns = [
    {
      title: "Order Code",
      dataIndex: "orderCode",
      width: "10%",
      ...getColumnSearchProps("orderCode"),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: "10%",
      ...getColumnSearchProps("sku"),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      width: "10%",
      ...getColumnSearchProps("rating"),
    },
    {
      title: "Content Feedback",
      dataIndex: "contentFeedback",
      width: "40%",
      ...getColumnSearchProps("contentFeedback"),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: "20%",
      ...getColumnSearchProps("createdAt"),
      defaultSortOrder: "descend",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      align: "center",
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
        return record.isActive.toString().indexOf(value) === 0;
      },
      render: (isActive, record) => (
        <div>
          <Popconfirm
            title="Do you want to change the status?"
            onConfirm={() => confirmIsActive(record)}
          >
            <Switch checked={isActive} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const refresh = () => {
    setState({ ...initialState });
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
        className={"btn-Reload-Page-List-Of-StaffList"}
      >
        Reload Page
      </Button>

      <ExportReactCSV
        csvData={state.feedbackAll}
        fileName="List of feedbacks"
      />
      <Divider />

      <Table
        columns={columns}
        dataSource={state.feedbackAll}
        footer={() => {
          const total =
            state.total || state.total === 0
              ? state.total
              : state.feedbackAll.length;
          return <strong>Sum: {total}</strong>;
        }}
        onChange={(pagination, filters, sorter, extra) => {
          setState((prev) => ({
            ...prev,
            total: extra.currentDataSource.length,
          }));
        }}
      />
    </>
  );
};

export { ListOfFeedbacks };
