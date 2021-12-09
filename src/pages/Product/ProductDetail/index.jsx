import React, { useState, useEffect } from "react";
import "./index.css";
import "antd/dist/antd.css";
import {
  Row,
  Col,
  Breadcrumb,
  Image,
  Rate,
  Button,
  Radio,
  Divider,
  InputNumber,
  Collapse,
  Comment,
  Tooltip,
  List,
  message,
  notification,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { NotFound } from "../../../_components/NotFound/index";
import { useHistory } from "react-router-dom";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch } from "react-redux";
import { numberProduct } from "../../../store/reducers/cart";
import { doNotGetData } from "../../../constants/doNotGetData";
import { findFeedbackByProduct } from "../../../api/feedback";
import { format } from "timeago.js";
import { getCategory } from "../../../api/category";
import { getProductIsActiveTrue } from "../../../api/product";

const ProductDetail = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [state, setState] = useState({
    product: {},
    flag: false,
    radioSize: null,
    quantity: 1,
    review: null,
    reviewAll: null,
    initLoading: true,
    loading: false,
    limit: 5,
    category: "All",
  });
  const { Panel } = Collapse;
  const [visible, setVisible] = useState(false);

  // console.log("🌐🌐🌐🌐🌐🌐 state", state);

  useEffect(() => {
    const fetchData = async (sku) => {
      const res = await findFeedbackByProduct(sku);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          // console.log("🦐🦐🦐🦐🦐🦐 res.data", res.data);
          const review = res.data
            .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
            .map((item, index) => {
              const key = index;
              return { ...item, key };
            });

          setState((prev) => ({
            ...prev,
            review,
            reviewAll: review,
          }));
        }
        if (!res.success) {
          notification["warning"]({
            message: "Warning",
            description: `${res.message}.`,
          });
        }
      }
    };
    setState((prev) => ({ ...prev, flag: false, radioSize: "S" }));
    const sessionProducts = sessionStorage.getItem("products");
    const products = JSON.parse(sessionProducts);

    if (products) {
      products.forEach((val) => {
        if (props.match.params.id === val.sku) {
          fetchData(val.sku);
          setState((prev) => ({
            ...prev,
            product: val,
            flag: true,
            initLoading: false,
          }));
        }
      });
    } else {
      const fetchProductData = async () => {
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
            window.location.reload();
          }
          if (!re_category.success || !re_product.success) {
            notification["warning"]({
              message: "Warning",
              description: `${re_category.message}.\n ${re_product.message}.`,
            });
          }
        }
      };
      fetchProductData();
    }
  }, [props.match.params.id, history]);

  const responsive = {
    superLargeDesktop: {
      // the naming can be any, depends on you.
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1350 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1350, min: 464 },
      items: 5,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4,
    },
  };

  const onChange = (e) => {
    setState((prev) => ({ ...prev, radioSize: e.target.value }));
  };

  const onLoadMore = () => {
    setState((prev) => ({ ...prev, limit: prev.limit + 5 }));
  };

  const onChangeQuantity = (value) => {
    setState((prev) => ({ ...prev, quantity: value }));
  };

  const onClickAddToCart = (val) => {
    if (val.quantity > 0 && state.quantity < val.quantity) {
      dispatch(numberProduct({ product: val, number: state.quantity }));
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

  //data - list comment
  const data = state.review
    ? state.review.map((item) => {
        const comment = {
          author: item.fullName,
          avatar: item.image || "/image/avatar/2.jpg",
          content: (
            <span>
              <Rate
                disabled
                allowHalf
                value={Number(item.rating)}
                style={{ fontSize: "17px", color: "hsla(340, 100%, 50%, 0.5)" }}
              ></Rate>
              <br />
              {item.contentFeedback}
            </span>
          ),
          datetime: (
            <Tooltip title={new Date(item.createdAt).toDateString()}>
              <span>{format(item.createdAt)}</span>
            </Tooltip>
          ),
        };
        return comment;
      })
    : [];

  const loadMore =
    !state.initLoading && !state.loading && state.limit < data.length ? (
      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          marginBottom: 12,
          height: 32,
          lineHeight: "32px",
        }}
      >
        <Button onClick={onLoadMore}>Loading more...</Button>
      </div>
    ) : null;

  const categoryChange = (e) => {
    setState((prev) => ({
      ...prev,
      review: null,
    }));
    const star = ["1", "2", "3", "4", "5"];
    if (e.target.value === "All") {
      setState((prev) => ({
        ...prev,
        review: state.reviewAll,
        category: e.target.value,
      }));
    } else {
      star.forEach((item) => {
        if (e.target.value === item) {
          let reviewChanged = state.reviewAll.filter((x) => {
            return Number(e.target.value) === Number(x.rating);
          });
          setState((prev) => ({
            ...prev,
            review: reviewChanged,
            category: e.target.value,
          }));
        }
      });
    }
  };

  return (
    <>
      {state.flag ? (
        <div className="htmlProductDetail">
          <div className="relatePage">
            <Row justify="space-around">
              <Col span={24}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item href="/product/all">Product</Breadcrumb.Item>
                  <Breadcrumb.Item href="">
                    {state.product.category}
                  </Breadcrumb.Item>
                  <Breadcrumb.Item href="">
                    {state.product.name}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </div>
          <div className="detailProduct">
            <Row>
              <Col span={10} className="imageDetailProduct">
                <Row style={{ justifyContent: "center" }}>
                  <Image
                    preview={{ visible: false }}
                    width="400px"
                    height="450px"
                    src={state.product.image}
                    onClick={() => setVisible(true)}
                  />
                  {state.product.isPromotion && (
                    <img
                      alt=""
                      src="/image/discount.png"
                      className="image-sale-product"
                      style={{
                        height: "100px",
                        width: "360px",
                        position: "absolute",
                      }}
                    />
                  )}
                </Row>
                <div style={{ position: "relative" }}>
                  <Image.PreviewGroup
                    preview={{
                      visible,
                      onVisibleChange: (vis) => setVisible(vis),
                    }}
                  >
                    <Carousel responsive={responsive}>
                      <Image
                        className="imageListProduct"
                        width="90px"
                        height="95px"
                        src={state.product.image}
                      />
                      {state.product.listImage.length > 0 &&
                        state.product.listImage.map((val, index) => (
                          <Image
                            className="imageListProduct"
                            key={index}
                            width="90px"
                            height="95px"
                            src={val}
                          />
                        ))}
                    </Carousel>
                  </Image.PreviewGroup>
                </div>
              </Col>
              <Col span={14}>
                <Row>
                  <h1>{state.product.name}</h1>
                </Row>
                <Row>
                  {state.product.isPromotion ? (
                    <>
                      <strike style={{ color: "hsla(340, 100%, 50%, 0.5)" }}>
                        <h2 style={{ color: "hsla(340, 100%, 50%, 0.5)" }}>
                          {state.product.price}$
                        </h2>
                      </strike>
                      <span style={{ marginLeft: "20px" }}>
                        {state.product.promotion_detail.discount > 1 ? (
                          <>
                            <h2>
                              {parseFloat(
                                state.product.price -
                                  state.product.promotion_detail.discount
                              ).toFixed(2)}
                              $
                            </h2>
                            <span>
                              <strong style={{ color: "rgb(255 109 44)" }}>
                                DISCOUNT:{" "}
                                {state.product.promotion_detail.discount}$
                              </strong>
                            </span>
                          </>
                        ) : (
                          <>
                            <h2>
                              {parseFloat(
                                state.product.price -
                                  state.product.price *
                                    state.product.promotion_detail.discount
                              ).toFixed(2)}
                              $
                            </h2>
                            <span>
                              <strong style={{ color: "rgb(255 109 44)" }}>
                                DISCOUNT:{" "}
                                {state.product.promotion_detail.discount * 100}%
                              </strong>
                            </span>
                          </>
                        )}
                      </span>
                    </>
                  ) : (
                    <h2>{state.product.price}$</h2>
                  )}
                </Row>
                <Row style={{ textAlign: "center", lineHeight: "31px" }}>
                  <div className="rating">
                    <strong
                      style={{
                        textDecoration: "underline",
                        paddingRight: "5px",
                        color: "hsla(340, 100%, 50%, 0.5)",
                      }}
                    >
                      {state.product.rating}
                    </strong>
                    <Rate
                      disabled
                      allowHalf
                      style={{ color: "hsla(340, 100%, 50%, 0.5)" }}
                      defaultValue={state.product.rating}
                    ></Rate>
                  </div>
                  <div className="review">
                    <span>
                      <strong
                        style={{
                          textDecoration: "underline",
                          paddingRight: "5px",
                        }}
                      >
                        {state.product.numRating}
                      </strong>
                      Reviews
                    </span>
                  </div>
                  <div className="sold">
                    <span>
                      <strong>{state.product.sold}</strong> Sold
                    </span>
                  </div>
                </Row>
                <div className="formDetailProduct">
                  <Divider />
                  <Row>
                    <span>Size </span>
                    <Radio.Group
                      onChange={onChange}
                      style={{ paddingLeft: "46px" }}
                      value={state.radioSize}
                    >
                      <Radio value="S">S</Radio>
                      <Radio value="M">M</Radio>
                      <Radio value="L">L</Radio>
                      <Radio value="XL">XL</Radio>
                      <Radio value="XXL">XXL</Radio>
                    </Radio.Group>
                  </Row>
                  <Divider />
                  <Row style={{ textAlign: "center", lineHeight: "31px" }}>
                    <span>Quantity </span>
                    <InputNumber
                      min={1}
                      max={20}
                      defaultValue={1}
                      style={{ paddingLeft: "20px", marginLeft: "17px" }}
                      onChange={onChangeQuantity}
                    />
                  </Row>
                  <br />
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      backgroundColor: "hsla(340, 100%, 50%, 0.5)",
                      marginLeft: "70px",
                    }}
                    className={"btnAddToCart"}
                    onClick={() => onClickAddToCart(state.product)}
                  >
                    Add to cart
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div className="infoProduct">
            <Collapse
              defaultActiveKey={["1", "2"]}
              className="collapseInfoProduct"
            >
              <Panel header="PRODUCT DETAILS" key="1">
                <Row>Category: {state.product.category}</Row>
                <Row>SKU: {state.product.sku}</Row>
                <Row>Now available: {state.product.quantity}</Row>
              </Panel>
              <Panel header="PRODUCT DESCRIPTION" key="2">
                <p style={{ whiteSpace: "pre-line" }}>
                  {state.product.description}
                </p>
              </Panel>
            </Collapse>
          </div>

          <div className="commentProduct">
            <h1 style={{ textAlign: "center" }}>Reviews</h1>
            <div>
              <Row>
                <Col span={6} style={{ textAlign: "center" }}>
                  <p>{state.product.rating}/5</p>
                  <Rate
                    disabled
                    allowHalf
                    defaultValue={state.product.rating}
                  ></Rate>
                </Col>
                <Col span={18}>
                  <Radio.Group
                    onChange={categoryChange}
                    value={state.category}
                    style={{ paddingLeft: 15 }}
                  >
                    <Radio value="All">All</Radio>
                    <Radio value="1">1 star</Radio>
                    <Radio value="2">2 star</Radio>
                    <Radio value="3">3 star</Radio>
                    <Radio value="4">4 star</Radio>
                    <Radio value="5">5 star</Radio>
                  </Radio.Group>
                </Col>
              </Row>
            </div>
            <div>
              <List
                className="comment-list"
                header={`${data.length} reviewed`}
                loading={state.initLoading}
                loadMore={loadMore}
                itemLayout="horizontal"
                dataSource={data.slice(0, state.limit)}
                renderItem={(item) => (
                  <li>
                    <Comment
                      actions={item.actions}
                      author={item.author}
                      avatar={item.avatar}
                      content={item.content}
                      datetime={item.datetime}
                    />
                  </li>
                )}
              />
            </div>
            {/* <div>
          <AddComment />
        </div> */}
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export { ProductDetail };
