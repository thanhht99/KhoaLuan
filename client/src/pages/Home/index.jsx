import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Carousel, Row, Col, Divider } from "antd";

const Home = () => {
  const contentStyle = {
    height: "600px",
    width: "500",
    color: "#fff",
    position: "relative",
    left: "50%",
    margin: "0px 20px 0 -250px",
    background: "#fff",
  };

  const style = { background: "#0092ff", padding: "8px 0" };

  return (
    <div className="htmlHome" id="htmlHome">
      <div className="infoStore">
        <img src="/image/homevideo.gif" alt="Home Video" className="info"></img>
      </div>
      <div className="container">
        <Carousel autoplay>
          <div className="image">
            <img src="/image/home1.jpg" alt="home1" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home2.jpg" alt="home2" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home3.jpg" alt="home3" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home4.jpg" alt="home4" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home5.jpg" alt="home5" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home6.jpg" alt="home6" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home7.jpg" alt="home7" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home8.jpg" alt="home8" style={contentStyle}></img>
          </div>
          <div className="image">
            <img src="/image/home9.jpg" alt="home9" style={contentStyle}></img>
          </div>
          <div className="image">
            <img
              src="/image/home10.jpg"
              alt="home10"
              style={contentStyle}></img>
          </div>
        </Carousel>
      </div>
      <div className="row">
        <Divider orientation="center" className={"bestSeller"}>
          <p>Best Seller</p>
          <p>Best selling products</p>
        </Divider>
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
          <Col className="gutter-row" span={6}>
            <div style={style}>col-6</div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export { Home };
