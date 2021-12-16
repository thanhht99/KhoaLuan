import React from "react";
import "antd/dist/antd.css";
import "../index.css";
import { RevenuePrediction } from "./RevenuePrediction";
import { ChartOrder } from "./ChartOrder";

const Predict = () => {
  return (
    <>
      <ChartOrder />
      <RevenuePrediction />
    </>
  );
};

export { Predict };
