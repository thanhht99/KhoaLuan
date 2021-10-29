import React, { useState, useEffect } from "react";
import "./index.css";
import "antd/dist/antd.css";
import {
  createFromIconfontCN,
  DollarCircleOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Pagination,
  Card,
  Rate,
  Select,
  Radio,
  notification,
  Button,
  message,
  Tooltip,
  Spin,
  // Divider,
} from "antd";
import { getCategory } from "../../../api/category";
import { getProductIsActiveTrue } from "../../../api/product";
import { doNotGetData } from "../../../constants/doNotGetData";
import { useDispatch } from "react-redux";
import { addCart } from "../../../store/reducers/cart";

const { Meta } = Card;
const { Option } = Select;

const ListProduct = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    minValue: 0,
    maxValue: 12,
    products: [],
    category: "All",
    price: { value: "increase" },
    // flag: false,
  });
  useEffect(() => {
    const fetchData = async () => {
      const re_category = await getCategory();
      const re_product = await getProductIsActiveTrue();
      if (!re_category || !re_product) {
        doNotGetData();
      }
      if (re_category && re_product) {
        if (re_category.success && re_product.success) {
          sessionStorage.setItem(
            "categories",
            JSON.stringify(re_category.data)
          );
          sessionStorage.setItem("products", JSON.stringify(re_product.data));
          setState((prev) => ({
            ...prev,
            products: re_product.data.sort((a, b) => a.price - b.price),
          }));
        }
        if (!re_category.success || !re_product.success) {
          notification["warning"]({
            message: "Warning",
            description: `${re_category.message}.\n ${re_product.message}.`,
          });
        }
      }
    };
    fetchData();
  }, []);

  let list_product = JSON.parse(sessionStorage.getItem("products"));
  let categories = JSON.parse(sessionStorage.getItem("categories"));

  const onChange = (pageNumber) => {
    console.log("Page: ", pageNumber);
    if (pageNumber <= 1) {
      setState((prev) => ({ ...prev, minValue: 0, maxValue: 12 }));
    } else {
      setState((prev) => ({
        ...prev,
        minValue: pageNumber * 12 - 12,
        maxValue: pageNumber * 12,
      }));
    }
  };

  const onClick = (val) => {
    if (val.quantity > 0) {
      dispatch(addCart({ product: val }));
      message.destroy();
      message.info("Added to cart");
    }
    if (val.quantity <= 0) {
      notification["warning"]({
        message: "Warning",
        description: "Quantity is not enough !!!",
      });
    }
  };

  const IconFont = createFromIconfontCN({
    scriptUrl: [
      "//at.alicdn.com/t/font_1788044_0dwu4guekcwr.js", // icon-javascript, icon-java, icon-shoppingcart (overrided)
      "//at.alicdn.com/t/font_1788592_a5xf2bdic3u.js", // icon-shoppingcart, icon-python
    ],
  });

  const priceChange = (value) => {
    if (value.value === "increase") {
      // console.log("🚀🚀🚀🚀🚀 increase");
      setState((prev) => ({
        ...prev,
        products: prev.products.sort((a, b) => a.price - b.price),
        price: { value: "increase" },
      }));
    }
    if (value.value === "decrease") {
      // console.log("🚀🚀🚀🚀🚀 decrease");
      setState((prev) => ({
        ...prev,
        products: prev.products.sort((a, b) => b.price - a.price),
        price: { value: "decrease" },
      }));
    }
  };

  const categoryChange = (e) => {
    categories.forEach((val) => {
      if (e.target.value === val.category_name) {
        let changeProduct = list_product.filter((product) => {
          return e.target.value === product.category;
        });
        setState((prev) => ({
          ...prev,
          products: changeProduct.sort((a, b) => a.price - b.price),
          category: e.target.value,
          price: { value: "increase" },
        }));
        onChange(1);
      } else if (e.target.value === "All") {
        setState((prev) => ({
          ...prev,
          products: list_product.sort((a, b) => a.price - b.price),
          category: e.target.value,
          price: { value: "increase" },
        }));
        onChange(1);
      }
    });
  };

  return (
    <div className="htmlListProduct" id="htmlListProduct">
      <div className="test-list-product">
        <div className="list-product-sort-bar">
          <span>Sort By</span>
          <Radio.Group
            onChange={categoryChange}
            value={state.category}
            style={{ paddingLeft: 15 }}
          >
            <Radio value="All">All</Radio>
            {categories &&
              categories.length > 0 &&
              categories.map((val, index) => (
                <Radio key={index} value={val.category_name}>
                  {val.category_name}
                </Radio>
              ))}
          </Radio.Group>
          <div className="list-product-sort-by-options">
            <Select
              labelInValue
              // defaultValue={{ value: "increase" }}
              style={{ width: 160 }}
              onChange={priceChange}
              value={state.price}
            >
              <Option value="increase">Price: Increase</Option>
              <Option value="decrease">Price: Decrease</Option>
            </Select>
          </div>
        </div>
      </div>
      <div className="cart-list-product">
        {state.products && state.products.length > 0 ? (
          state.products.slice(state.minValue, state.maxValue).map((val) => (
            <Card
              className="card-list-product"
              key={val.id}
              hoverable
              style={{ width: 350 }}
              cover={
                <img alt="" src={val.image} className="image-list-product" />
              }
              actions={[
                <Button
                  type="primary"
                  size="large"
                  icon={<InfoCircleOutlined />}
                  style={{
                    width: "100%",
                    backgroundColor: "#3300FF",
                  }}
                  href={`/product/detail/${val.sku}`}
                >
                  Detail
                </Button>,
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  style={{
                    backgroundColor: "hsla(340, 100%, 50%, 0.5)",
                    width: "100%",
                  }}
                  className={"btnAddToCart"}
                  onClick={() => onClick(val)}
                >
                  Add to cart
                </Button>,
              ]}
            >
              <Tooltip placement="topLeft" title={val.name}>
                <Meta className="card-meta-list-product" title={val.name} />
              </Tooltip>
              <p style={{ fontSize: "17px", paddingTop: "15px" }}>
                <strong>{val.price + " "} </strong>
                <DollarCircleOutlined />
                <span style={{ float: "right" }}>
                  <IconFont type="icon-shoppingcart" />
                  {val.sold}
                </span>
              </p>
              <Rate disabled allowHalf defaultValue={val.rating} />
            </Card>
          ))
        ) : (
          <Spin />
        )}
      </div>
      <div className="pagination-list-product">
        <Pagination
          defaultCurrent={1}
          total={state.products.length}
          defaultPageSize={12}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { ListProduct };
