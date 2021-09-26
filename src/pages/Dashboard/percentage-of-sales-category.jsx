import React from "react";
import { Pie } from "@ant-design/charts";

const PieCategory = () => {
  var data = [
    {
      type: "a",
      value: 40,
    },
    {
      type: "b",
      value: 25,
    },
    {
      type: "c",
      value: 190,
    },
    {
      type: "d",
      value: 15,
    },
    {
      type: "e",
      value: 10,
    },
    {
      type: "f",
      value: 50,
    },
  ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: function content(_ref) {
        var percent = _ref.percent;
        return "".concat((percent * 100).toFixed(0), "%");
      },
      style: {
        fontSize: 18,
        textAlign: "center",
        // paddingLeft: "100px",
        // paddingTop: "50px",
      },
    },
    interactions: [{ type: "element-active" }],
  };
  return <Pie {...config} />;
};

export default PieCategory;
