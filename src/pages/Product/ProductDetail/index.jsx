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
  // Form,
  // Input,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import moment from "moment";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { NotFound } from "../../../_components/NotFound/index";

const ProductDetail = (props) => {
  const [state, setState] = useState({
    product: {},
    flag: false,
  });
  const { Panel } = Collapse;
  const [visible, setVisible] = useState(false);
  //chon size + mau
  const [value, setValue] = React.useState(1);

  useEffect(() => {
    setState((prev) => ({ ...prev, flag: false }));
    const sessionProducts = sessionStorage.getItem("products");
    const products = JSON.parse(sessionProducts);
    products.forEach((val) => {
      if (props.match.params.id === val.sku) {
        setState((prev) => ({ ...prev, product: val, flag: true }));
      }
    });
  }, [props.match.params.id]);

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
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const onChangeQuantity = (value) => {
    console.log("changed", value);
  };

  //data - list comment
  const data = [
    {
      actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: "Han Solo",
      avatar:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      content: <p>Toi rat thich chiec quan nay, no that dep.</p>,
      datetime: (
        <Tooltip
          title={moment().subtract(1, "days").format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>{moment().subtract(1, "days").fromNow()}</span>
        </Tooltip>
      ),
    },
    {
      actions: [<span key="comment-list-reply-to-0">Reply to</span>],
      author: "Zayn Malik",
      avatar:
        "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      content: <p>Love this jean, love its materials.</p>,
      datetime: (
        <Tooltip
          title={moment().subtract(2, "days").format("YYYY-MM-DD HH:mm:ss")}
        >
          <span>{moment().subtract(2, "days").fromNow()}</span>
        </Tooltip>
      ),
    },
  ];

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
                  <h2>{state.product.price}$</h2>
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
                      value={value}
                      style={{ paddingLeft: "46px" }}
                    >
                      <Radio value={1}>S</Radio>
                      <Radio value={2}>M</Radio>
                      <Radio value={3}>L</Radio>
                      <Radio value={4}>XL</Radio>
                      <Radio value={5}>XXL</Radio>
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

          {/*xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
       CHUA DUNG TOI 
       xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx*/}
          <div className="commentProduct">
            <h1 style={{ textAlign: "center" }}>DANH GIA SAN PHAM</h1>
            <div>
              <Row>
                <Col span={6} style={{ textAlign: "center" }}>
                  <p>4.5/5</p>
                  <Rate disabled allowHalf defaultValue={4.5}></Rate>
                </Col>
                <Col span={18}>
                  <Button>Tat ca</Button>
                  <Button>1 sao</Button>
                  <Button>2 sao</Button>
                  <Button>3 sao</Button>
                  <Button>4 sao</Button>
                  <Button>5 sao</Button>
                </Col>
              </Row>
            </div>
            <div>
              <List
                className="comment-list"
                header={`${data.length} replies`}
                itemLayout="horizontal"
                dataSource={data}
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
