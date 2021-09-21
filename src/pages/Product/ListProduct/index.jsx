import React, { useState } from "react";
import "./index.css";
import "antd/dist/antd.css";
import { createFromIconfontCN, DollarCircleOutlined } from "@ant-design/icons";
import { Pagination, Card, Rate, Select, Radio } from "antd";
const { Meta } = Card;
const { Option } = Select;

const ListProduct = () => {
  let data_product = [
    {
      id: 1,
      price: 69,
      image: "/image/product/product4.jpg",
      category: "Hat",
      name: "Card name1",
      sold: 10,
      rating: 3.2,
    },
    {
      id: 2,
      price: 6,
      image: "/image/product/product3_1.jpg",
      category: "Shirt",
      name: "Card name2",
      sold: 10,
      rating: 2,
    },
    {
      id: 3,
      price: 9,
      image: "/image/product/product2_1.jpg",
      category: "Coat",
      name: "Card name3",
      sold: 10,
      rating: 3,
    },
    {
      id: 4,
      price: 6,
      image: "/image/product/product4.jpg",
      category: "Shirt",
      name: "Card name4",
      sold: 10,
      rating: 3.7,
    },
    {
      id: 5,
      price: 6,
      image: "/image/product/product2.jpg",
      category: "Coat",
      name: "Card name5",
      sold: 10,
      rating: 4.2,
    },
    {
      id: 6,
      price: 60,
      image: "/image/product/product3_1.jpg",
      category: "Shirt",
      name: "Card name6",
      sold: 10,
      rating: 4.7,
    },
    {
      id: 7,
      price: 60,
      image: "/image/product/product4.jpg",
      category: "Coat",
      name: "Card name7",
      sold: 10,
      rating: 1.2,
    },
    {
      id: 8,
      price: 61,
      image: "/image/product/product2.jpg",
      category: "Hat",
      name: "Card name8",
      sold: 10,
      rating: 4.2,
    },
    {
      id: 9,
      price: 69,
      image: "/image/product/product7_1.jpg",
      category: "Hat",
      name: "Card name9",
      sold: 10,
      rating: 3.3,
    },
    {
      id: 10,
      price: 9,
      image: "/image/product/product3.jpg",
      category: "Hat",
      name: "Card name10",
      sold: 10,
      rating: 3.3,
    },
    {
      id: 11,
      price: 9,
      image: "/image/product/product2_1.jpg",
      category: "Shirt",
      name: "Card name11",
      sold: 10,
      rating: 4.1,
    },
    {
      id: 12,
      price: 9,
      image: "/image/product/product3_1.jpg",
      category: "Shirt",
      name: "Card name12",
      sold: 10,
      rating: 3.9,
    },
    {
      id: 13,
      price: 9,
      image: "/image/product/product7_1.jpg",
      category: "Hat",
      name: "Card name13",
      sold: 10,
      rating: 4.1,
    },
    {
      id: 14,
      price: 9,
      image: "/image/product/product3.jpg",
      category: "Shirt",
      name: "Card name14",
      sold: 10,
      rating: 1.1,
    },
    {
      id: 15,
      price: 9,
      image: "/image/product/product2_1.jpg",
      category: "Coat",
      name: "Card name31",
      sold: 10,
      rating: 2.1,
    },
    {
      id: 16,
      price: 9,
      image: "/image/product/product6.jpg",
      category: "Shirt",
      name: "Card name32",
      sold: 10,
      rating: 4.1,
    },
    {
      id: 17,
      price: 9,
      image: "/image/product/product7_1.jpg",
      category: "Hat",
      name: "Card name33",
      sold: 10,
      rating: 3.1,
    },
    {
      id: 18,
      price: 619,
      image: "/image/product/product7.jpg",
      category: "Shirt",
      name: "Card name34",
      sold: 10,
      rating: 3.2,
    },
    {
      id: 19,
      price: 699,
      image: "/image/product/product6.jpg",
      category: "Hat",
      name: "Card name35",
      sold: 10,
      rating: 4.3,
    },
    {
      id: 20,
      price: 19,
      image: "/image/product/product4.jpg",
      category: "Hat",
      name: "Card name36",
      sold: 10,
      rating: 4.4,
    },
    {
      id: 21,
      price: 19,
      image: "/image/product/product3.jpg",
      category: "Shirt",
      name: "Card name37",
      sold: 10,
      rating: 4.7,
    },
    {
      id: 22,
      price: 69,
      image: "/image/product/product2.jpg",
      category: "Coat",
      name: "Card name38",
      sold: 10,
      rating: 4.9,
    },
    {
      id: 23,
      price: 19,
      image: "/image/product/product6.jpg",
      category: "Coat",
      name: "Card name39",
      sold: 10,
      rating: 4.1,
    },
  ];

  let data_category = [
    { id: 1, name: "Hat" },
    { id: 2, name: "T-Shirt" },
    { id: 3, name: "Shirt" },
    { id: 4, name: "Coat" },
  ];

  sessionStorage.setItem("categories", JSON.stringify(data_category));
  sessionStorage.setItem("products", JSON.stringify(data_product));
  let list_product = JSON.parse(sessionStorage.getItem("products"));
  let categories = JSON.parse(sessionStorage.getItem("categories"));

  const [state, setState] = useState({
    minValue: 0,
    maxValue: 12,
    products: list_product.sort((a, b) => a.price - b.price),
    category: "All",
    price: { value: "increase" },
  });

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
      if (e.target.value === val.name) {
        let changeProduct = list_product.filter((product) => {
          return e.target.value === product.category;
        });
        setState((prev) => ({
          ...prev,
          products: changeProduct,
          category: e.target.value,
          price: { value: "increase" },
        }));
        onChange(1);
      } else if (e.target.value === "All") {
        setState((prev) => ({
          ...prev,
          products: list_product,
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
              categories.map((val) => (
                <Radio key={val.id} value={val.name}>
                  {val.name}
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
        {state.products &&
          state.products.length > 0 &&
          state.products.slice(state.minValue, state.maxValue).map((val) => (
            <a
              href="/product"
              key={val.id}
              style={{ width: "350px", height: "100%" }}
            >
              <Card
                className="card-list-product"
                key={val.id}
                hoverable
                style={{ width: 350 }}
                cover={
                  <img alt="" src={val.image} className="image-list-product" />
                }
              >
                <Meta className="card-meta-list-product" title={val.name} />
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
            </a>
          ))}
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
