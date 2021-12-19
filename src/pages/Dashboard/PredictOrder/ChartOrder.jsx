import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { Line } from "@ant-design/charts";
import Cookies from "js-cookie";
import { chartOrder } from "../../../api/ML";
import { doNotGetData } from "../../../constants/doNotGetData";
import { notification } from "antd";
import { useHistory } from "react-router-dom";

const ChartOrder = () => {
  const history = useHistory();
  const token = Cookies.get("token");
  const [state, setState] = useState({
    chartOrder: null,
    chart1: null,
    chart2: null,
  });

  // console.log("🚀🚀🚀🚀🚀🚀🚀🚀🚀 ~ state", state);

  useEffect(() => {
    const fetchData = async () => {
      const res = await chartOrder(token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          setState((prev) => ({ ...prev, chartOrder: res.data }));
        }
        if (!res.success) {
          if (res.message === "Token is expired") {
            Cookies.remove("token", { path: "/" });
            notification["warning"]({
              message: "Warning",
              description: `${res.message}`,
            });
            history.push("/account/sign-in/reload");
          } else {
            notification["warning"]({
              message: "Warning:",
              description: `${res.message}.`,
            });
          }
        }
      }
    };
    fetchData();
  }, [token, history]);

  const data1 = state.chartOrder
    ? state.chartOrder.map((item) => {
        const body = {
          date: item.date,
          sold: item.sold,
        };
        return body;
      })
    : [];

  const data2 = state.chartOrder
    ? state.chartOrder.map((item) => {
        const body = {
          date: item.date,
          money: item.money + "$",
        };
        return body;
      })
    : [];

  const config1 = {
    data: data1,
    width: 600,
    height: 200,
    autoFit: false,
    xField: "date",
    yField: "sold",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  const config2 = {
    data: data2,
    width: 600,
    height: 200,
    autoFit: false,
    xField: "date",
    yField: "money",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };

  return (
    <div>
      <h1>Product sales chart</h1>
      <Line
        {...config1}
        onReady={(chartInstance) => (state.chart1 = chartInstance)}
        key="1111"
      />
      <br />

      <h1>Graph of sales revenue</h1>
      <Line
        {...config2}
        onReady={(chartInstance) => (state.chart2 = chartInstance)}
      />
      <br />
    </div>
  );
};

export { ChartOrder };
