import React from "react";
import { Pie } from "@ant-design/charts";
import { useSelector } from "react-redux";

const PieCategory = () => {
  const reduxProductAll = useSelector((state) => state.productAll.Product);
  const reduxCategoryTAFAll = useSelector(
    (state) => state.categoryTAF.Category
  );

  let data = reduxCategoryTAFAll.map((category) => {
    var total = 0;
    reduxProductAll.forEach((product) => {
      if (product.category === category.category_name) {
        total++;
      }
    });
    const item = {
      type: category.category_name,
      value: total,
    };
    return item;
  });

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
