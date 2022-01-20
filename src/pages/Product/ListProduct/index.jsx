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
  Input,
  Checkbox,
  Result,
  // Divider,
} from "antd";
import { getCategory } from "../../../api/category";
import { getProductIsActiveTrue } from "../../../api/product";
import { doNotGetData } from "../../../constants/doNotGetData";
import { useDispatch } from "react-redux";
import { addCart } from "../../../store/reducers/cart";

const { Meta } = Card;
const { Option } = Select;
const { Search } = Input;
const CheckboxGroup = Checkbox.Group;

const ListProduct = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    minValue: 0,
    maxValue: 12,
    products: [],
    category: "All",
    price: { value: "increase" },
    discount: { value: "both" },
    page: 1,
    search: null,
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
  const plainOptions = categories.map((item) => {
    return item.category_name;
  });

  const onChange = (pageNumber) => {
    console.log("Page: ", pageNumber);
    if (pageNumber <= 1) {
      setState((prev) => ({
        ...prev,
        page: pageNumber,
        minValue: 0,
        maxValue: 12,
      }));
    } else {
      setState((prev) => ({
        ...prev,
        page: pageNumber,
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
      onChange(1);
    }
    if (value.value === "decrease") {
      // console.log("🚀🚀🚀🚀🚀 decrease");
      setState((prev) => ({
        ...prev,
        products: prev.products.sort((a, b) => b.price - a.price),
        price: { value: "decrease" },
      }));
      onChange(1);
    }
  };

  const discountChange = (value) => {
    // console.log("🚀🚀🚀🚀🚀 value", value);
    // console.log("🚀🚀🚀🚀🚀 state", state);
    if (state.category === "All") {
      if (value.value === "yes") {
        setState((prev) => ({
          ...prev,
          products: list_product
            .sort((a, b) => a.price - b.price)
            .filter((product) => {
              return product.isPromotion === true;
            }),
          price: { value: "increase" },
          discount: { value: "yes" },
        }));
        onChange(1);
      }
      if (value.value === "no") {
        setState((prev) => ({
          ...prev,
          products: list_product
            .sort((a, b) => a.price - b.price)
            .filter((product) => {
              return product.isPromotion === false;
            }),
          price: { value: "increase" },
          discount: { value: "no" },
        }));
        onChange(1);
      }
      if (value.value === "both") {
        setState((prev) => ({
          ...prev,
          products: list_product.sort((a, b) => a.price - b.price),
          price: { value: "increase" },
          discount: { value: "both" },
        }));
        onChange(1);
      }
    }
    if (state.category !== "All") {
      if (value.value === "yes") {
        setState((prev) => ({
          ...prev,
          products: list_product
            .sort((a, b) => a.price - b.price)
            .filter((product) => {
              return (
                product.isPromotion === true &&
                product.category === state.category
              );
            }),
          price: { value: "increase" },
          discount: { value: "yes" },
        }));
        onChange(1);
      }
      if (value.value === "no") {
        setState((prev) => ({
          ...prev,
          products: list_product
            .sort((a, b) => a.price - b.price)
            .filter((product) => {
              return (
                product.isPromotion === false &&
                product.category === state.category
              );
            }),
          price: { value: "increase" },
          discount: { value: "no" },
        }));
        onChange(1);
      }
      if (value.value === "both") {
        setState((prev) => ({
          ...prev,
          products: list_product
            .sort((a, b) => a.price - b.price)
            .filter((product) => {
              return product.category === state.category;
            }),
          price: { value: "increase" },
          discount: { value: "both" },
        }));
        onChange(1);
      }
    }
  };

  const onSearch = (value) => {
    if (value) {
      setState((prev) => ({
        ...prev,
        search: value,
      }));
      filterArray(value);
    }
    if (!value) {
      setState((prev) => ({
        ...prev,
        products: list_product.sort((a, b) => a.price - b.price),
        search: null,
        category: "All",
        price: { value: "increase" },
        discount: { value: "both" },
      }));
      onChange(1);
    }
  };

  const filterArray = (query) => {
    var searchString = query;
    var responseData = list_product;

    if (searchString.length > 0) {
      responseData = responseData.filter((item) => {
        return item.name.toLowerCase().match(searchString.toLowerCase());
      });
      setState((prev) => ({
        ...prev,
        products: responseData.sort((a, b) => a.price - b.price),
        category: "All",
        price: { value: "increase" },
        discount: { value: "both" },
      }));
      onChange(1);
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
          discount: { value: "both" },
          search: null,
        }));
        onChange(1);
      } else if (e.target.value === "All") {
        setState((prev) => ({
          ...prev,
          products: list_product.sort((a, b) => a.price - b.price),
          category: e.target.value,
          price: { value: "increase" },
          search: null,
          discount: { value: "both" },
        }));
        onChange(1);
      }
    });
  };

  const [checkAll, setCheckAll] = React.useState(false);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkedList, setCheckedList] = React.useState(plainOptions);
  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setCheckAll(e.target.checked);
    setIndeterminate(false);

    if (e.target.checked) {
      setState((prev) => ({
        ...prev,
        products: list_product.sort((a, b) => a.price - b.price),
        price: { value: "increase" },
        search: null,
        discount: { value: "both" },
      }));
      onChange(1);
    }
    if (!e.target.checked) {
      setState((prev) => ({
        ...prev,
        products: [],
        price: { value: "increase" },
        search: null,
        discount: { value: "both" },
      }));
      onChange(1);
    }
  };
  const onChangeCheckbox = (list) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);

    let changeProduct = list_product.filter((product) => {
      return list.includes(product.category);
    });
    setState((prev) => ({
      ...prev,
      products: changeProduct.sort((a, b) => a.price - b.price),
      price: { value: "increase" },
      discount: { value: "both" },
      search: null,
    }));
    onChange(1);
  };

  return (
    <div className="htmlListProduct" id="htmlListProduct">
      <div className="test-list-product">
        <div className="list-product-sort-bar" hidden>
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
          <div className="list-product-sort-by-discount">
            <Select
              labelInValue
              style={{ width: 160, marginLeft: "8px" }}
              onChange={discountChange}
              value={state.discount}
            >
              <Option value="yes">Discount: yes</Option>
              <Option value="no">Discount: no</Option>
              <Option value="both">Discount: both</Option>
            </Select>
          </div>
          <Search
            placeholder="Search"
            onSearch={onSearch}
            enterButton
            style={{ width: "160px", marginLeft: "8px" }}
            defaultValue={state.search ? state.search : null}
          />
        </div>
        <div className="list-product-sort-bar">
          <span>Sort By</span>
          {categories && categories.length > 0 && (
            <>
              <Checkbox
                style={{ paddingLeft: 15, paddingRight: 8 }}
                checked={checkAll}
                onChange={onCheckAllChange}
                indeterminate={indeterminate}
              >
                Check all
              </Checkbox>
              <CheckboxGroup
                options={plainOptions}
                value={checkedList}
                onChange={onChangeCheckbox}
              />
            </>
          )}
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
          <div className="list-product-sort-by-discount">
            <Select
              labelInValue
              style={{ width: 160, marginLeft: "8px" }}
              onChange={discountChange}
              value={state.discount}
            >
              <Option value="yes">Discount: yes</Option>
              <Option value="no">Discount: no</Option>
              <Option value="both">Discount: both</Option>
            </Select>
          </div>
          <Search
            placeholder="Search"
            onSearch={onSearch}
            enterButton
            style={{ width: "160px", marginLeft: "8px" }}
            defaultValue={state.search ? state.search : null}
          />
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
                <div style={{}}>
                  <img
                    alt=""
                    style={{
                      height: "350px",
                      width: "100%",
                      position: "relative",
                    }}
                    src={val.image}
                    className="image-list-product"
                  />
                  {val.isPromotion && (
                    <img
                      alt=""
                      src="/image/discount.png"
                      className="image-sale-product"
                      style={{
                        height: "100px",
                        width: "360px",
                        position: "absolute",
                        right: "-1px",
                      }}
                    />
                  )}
                </div>
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
                {val.isPromotion ? (
                  <>
                    <span style={{ textDecoration: "line-through " }}>
                      {val.price + " $"}
                    </span>
                    <span>{"  "}</span>
                    {val.promotion_detail.discount > 1 ? (
                      <strong style={{ color: "rgb(255 109 44)" }}>
                        <span>
                          {parseFloat(
                            val.price - val.promotion_detail.discount
                          ).toFixed(2) + " "}
                        </span>
                        <DollarCircleOutlined />
                      </strong>
                    ) : (
                      <strong style={{ color: "rgb(255 109 44)" }}>
                        <span>
                          {parseFloat(
                            val.price -
                              val.price * val.promotion_detail.discount
                          ).toFixed(2) + " "}{" "}
                        </span>
                        <DollarCircleOutlined />
                      </strong>
                    )}
                  </>
                ) : (
                  <>
                    <span>{val.price + " "}</span>
                    <DollarCircleOutlined />
                  </>
                )}
                <span style={{ float: "right" }}>
                  <IconFont type="icon-shoppingcart" />
                  {val.sold}
                </span>
              </p>
              <Rate disabled allowHalf defaultValue={val.rating} />
            </Card>
          ))
        ) : (
          <Result status="404" title="No products" />
        )}
      </div>
      <div className="pagination-list-product">
        <Pagination
          defaultCurrent={state.page}
          total={state.products.length}
          defaultPageSize={12}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { ListProduct };
