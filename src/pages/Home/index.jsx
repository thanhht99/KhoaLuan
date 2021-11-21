import React, { useEffect } from "react";
import "antd/dist/antd.css";
import "./index.css";
import HoverImage from "react-hover-image";
import { Carousel, Button, Affix } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

// import store from './../../store'

const Home = () => {
  // const dispatch = useDispatch();
  const token = Cookies.get("token");
  const acc = useSelector((state) => state.acc.Acc);

  useEffect(() => {
    // const token = localStorage.getItem("token");
    // console.log("🚀 ~ file: index.jsx ~ line 10 ~ useEffect ~ token", token);
    // if(token) {
    //     history.push('/home');
    // }
  });

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
      style={{ height: "100%", width: "100%" }}
    >
      {token && (acc.role === "Admin" || acc.role === "Saler") && (
        <>
          <Affix offsetTop="0">
            <Button type="primary">
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </Affix>
        </>
      )}
      <div className="infoStore">
        <img
          src="/image/homevideo.gif"
          alt="Home Video"
          className="info"
          style={{ height: "100%", width: "100%" }}
        ></img>
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
              style={contentStyle}
            ></img>
          </div>
        </Carousel>
      </div>
      <div className="row">
        <div className="title">
          <p className="t-1">Best Seller</p>
          <p className="t-2">Best selling products</p>
        </div>
        <div className="images">
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product1.jpg"
                hoverSrc="/image/product/product1_1.jpg"
              ></HoverImage>
            </a>
          </div>
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product2.jpg"
                hoverSrc="/image/product/product2_1.jpg"
              ></HoverImage>
            </a>
          </div>
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product3.jpg"
                hoverSrc="/image/product/product3_1.jpg"
              ></HoverImage>
            </a>
          </div>
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product4.jpg"
                hoverSrc="/image/product/product4_1.jpg"
              ></HoverImage>
            </a>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="title">
          <p className="t-1">New Product</p>
          <p className="t-2">Top latest products</p>
        </div>
        <div className="images">
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product8.jpg"
                hoverSrc="/image/product/product8_1.jpg"
              ></HoverImage>
            </a>
          </div>
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product7.jpg"
                hoverSrc="/image/product/product7_1.jpg"
              ></HoverImage>
            </a>
          </div>
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product6.jpg"
                hoverSrc="/image/product/product6_1.jpg"
              ></HoverImage>
            </a>
          </div>
          <div className="image-item">
            <a href="/">
              <HoverImage
                className="hover-image"
                src="/image/product/product5.jpg"
                hoverSrc="/image/product/product5_1.jpg"
              ></HoverImage>
            </a>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="title">
          <p className="t-1">Promotions & Vouchers</p>
          <p className="t-2">Info</p>
        </div>
        <div className="images">
          <div className="image-item2">
            <a href="/">
              <img
                src="/image/Promotions_Vouchers/black_friday.jpg"
                alt=""
              ></img>
            </a>
          </div>
          <div className="image-item2">
            <a href="/">
              <img src="/image/Promotions_Vouchers/sale50.jpg" alt=""></img>
            </a>
          </div>
          <div className="image-item2">
            <a href="/">
              <img src="/image/Promotions_Vouchers/sale70.jpg" alt=""></img>
            </a>
          </div>
          <div className="image-item2">
            <a href="/">
              <img src="/image/Promotions_Vouchers/xmas.jpg" alt=""></img>
            </a>
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
