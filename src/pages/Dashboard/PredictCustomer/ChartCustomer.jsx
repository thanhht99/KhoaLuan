import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import "../index.css";
import { Line } from "@ant-design/charts";
import Cookies from "js-cookie";
import { doNotGetData } from "../../../constants/doNotGetData";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import { chartCustomer } from "../../../api/ML";
import { Card, Col, Row, Progress } from "antd";
import { CaretUpOutlined } from "@ant-design/icons";

const ChartCustomer = () => {
  const history = useHistory();
  const token = Cookies.get("token");
  const [state, setState] = useState({
    chartCustomer: null,
    chart1: null,
  });
  const day = new Date();
  const date = day.getDate();
  const month = day.getMonth() + 1;
  const year = day.getFullYear();
  const today = date + "/" + month + "/" + year;

  useEffect(() => {
    const fetchData = async () => {
      const res = await chartCustomer(token);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          setState((prev) => ({ ...prev, chartCustomer: res.data }));
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

  const data1 = state.chartCustomer
    ? state.chartCustomer.map((item) => {
        const body = {
          date: item.date,
          total: item.total,
        };
        return body;
      })
    : [];

  const total = state.chartCustomer
    ? state.chartCustomer.reduce((acc, val) => {
        return acc + val.total;
      }, 0)
    : 0;

  const checkNewRegistration = state.chartCustomer
    ? state.chartCustomer.filter((item) => {
        return item.date === today;
      })
    : null;
  const newRegistration = checkNewRegistration
    ? checkNewRegistration[0].total
    : 0;

  const config1 = {
    data: data1,
    width: 600,
    height: 200,
    autoFit: false,
    xField: "date",
    yField: "total",
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
      <div>
        <Row gutter={16}>
          <Col span={8}>
            <Card
              title="Total number of customers (before/today)"
              bordered={false}
              style={{ backgroundColor: "hsla(340, 100%, 50%, 0.5)" }}
            >
              <div className="overview-header-count">
                {total - newRegistration}/{total}
              </div>
              <Progress
                percent={parseFloat(
                  ((total - newRegistration) / total) * 100
                ).toFixed(2)}
              />
              <div className="overview-body">
                <span className="new-registered-user-span">
                  New registered user:
                  {" " + newRegistration}
                </span>
                <br />
                <span style={{ fontWeight: "bold", color: "green" }}>
                  <CaretUpOutlined />
                  {parseFloat(
                    (newRegistration / (total - newRegistration)) * 100
                  ).toFixed(2)}
                  %
                </span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <br />

      <h1>Number of registered customers by day</h1>
      <Line
        {...config1}
        onReady={(chartInstance) => (state.chart1 = chartInstance)}
      />
      <br />
    </div>
  );
};

export { ChartCustomer };
