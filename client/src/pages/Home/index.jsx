import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Carousel } from "antd";

const Home = () => {
  const contentStyle = {
    height: "70%",
    width: "40%",
    color: "#fff",
    position: "relative",
    left: "30%",
    background: "#fff",
  };

  return (
    <div
      className="htmlHome"
      id="htmlHome"
      style={{ height: "100%", width: "100%" }}>
      <div className="infoStore">
        <img
          src="/image/homevideo.gif"
          alt="Home Video"
          className="info"
          style={{ height: "100%", width: "100%" }}></img>
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
        <div className="titleBestSeller">
          <p className="tbs-1">Best Seller</p>
          <p className="tbs-2">Best selling products</p>
        </div>
        <div className="images">
          <div className="image-item">
            <img src="/image/product/product1.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product2.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product3.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product4.jpg" alt=""></img>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="titleBestSeller">
          <p className="tbs-1">New Product</p>
          <p className="tbs-2">Top latest products</p>
        </div>
        <div className="images">
          <div className="image-item">
            <img src="/image/product/product1.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product2.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product3.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product4.jpg" alt=""></img>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="titleBestSeller">
          <p className="tbs-1">Promotions & Vouchers</p>
          <p className="tbs-2">Info</p>
        </div>
        <div className="images">
          <div className="image-item">
            <img src="/image/product/product1.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product2.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product3.jpg" alt=""></img>
          </div>
          <div className="image-item">
            <img src="/image/product/product4.jpg" alt=""></img>
          </div>
        </div>
      </div>
      <div className="row-background">
        <div className="bg">
          <img src="/image/homeBackground.jpg" alt=""></img>
        </div>
      </div>
    </div>
  );
};

export { Home };
