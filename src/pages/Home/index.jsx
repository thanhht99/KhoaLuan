import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import "./index.css";
import { doNotGetData } from "../../constants/doNotGetData";
import HoverImage from "react-hover-image";
import { Carousel, Button, Affix, notification, Spin, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { bestSeller, newProducts, vouchers } from "../../api/home";

const Home = () => {
  const token = Cookies.get("token");
  const acc = useSelector((state) => state.acc.Acc);
  const initialState = {
    newProducts: null,
    vouchers: null,
    bestSeller: null,
  };
  const [state, setState] = useState(initialState);

  // console.log("🦈🦈🦈🦈🦈🦈", state);

  useEffect(() => {
    const fetchData = async () => {
      const bestSellerAPI = await bestSeller();
      if (!bestSellerAPI) {
        doNotGetData();
      }
      if (bestSellerAPI) {
        if (bestSellerAPI.success) {
          try {
            const newProductsAPI = await newProducts();
            const vouchersAPI = await vouchers();
            // console.log("🧸🧸🧸🧸🧸🧸 bestSellerAPI", bestSellerAPI);
            // console.log("🍒🍒🍒🍒🍒🍒 newProductsAPI", newProductsAPI);
            // console.log("🦑🦑🦑🦑🦑🦑 vouchersAPI", vouchersAPI);

            const bestSellerState = bestSellerAPI.data.map((item, index) => {
              const key = index;
              return { ...item, key };
            });
            const newProductsState = newProductsAPI.data.map((item, index) => {
              const key = index;
              return { ...item, key };
            });
            const vouchersState = vouchersAPI.data.map((item, index) => {
              const key = index;
              return { ...item, key };
            });

            setState((prev) => ({
              ...prev,
              bestSeller: bestSellerState,
              newProducts: newProductsState,
              vouchers: vouchersState,
            }));
          } catch (err) {
            notification["warning"]({
              message: "Warning: Home",
              description: err,
            });
          }
        }
        if (!bestSellerAPI.success) {
          notification["warning"]({
            message: "Warning: Home",
            description: `${bestSellerAPI.message}.`,
          });
        }
      }
    };
    fetchData();
  }, []);

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
          style={{ height: "400px", width: "100%" }}
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
        {state.bestSeller ? (
          <div className="images">
            {state.bestSeller.length === 4 &&
              state.bestSeller.map((item, index) => (
                <div className="image-item" key={index}>
                  <Tooltip placement="top" title={item.name}>
                    <a href={`/product/detail/${item.sku}`}>
                      <HoverImage
                        className="hover-image"
                        src={item.image}
                        hoverSrc={item.listImage[0]}
                      ></HoverImage>
                    </a>
                  </Tooltip>
                </div>
              ))}
          </div>
        ) : (
          <div className="spin-home">
            <Spin tip="Loading..." />
          </div>
        )}
      </div>
      <div className="row">
        <div className="title">
          <p className="t-1">New Products</p>
          <p className="t-2">Top latest products</p>
        </div>
        {state.newProducts ? (
          <div className="images">
            {state.newProducts.length === 4 &&
              state.newProducts.map((item, index) => (
                <div className="image-item" key={index}>
                  <Tooltip placement="top" title={item.name}>
                    <a href={`/product/detail/${item.sku}`}>
                      <HoverImage
                        className="hover-image"
                        src={item.image}
                        hoverSrc={item.listImage[0]}
                      ></HoverImage>
                    </a>
                  </Tooltip>
                </div>
              ))}
          </div>
        ) : (
          <div className="spin-home">
            <Spin tip="Loading..." />
          </div>
        )}
      </div>
      <div className="row">
        <div className="title">
          <p className="t-1">New Vouchers</p>
          <p className="t-2">Info</p>
        </div>
        {state.vouchers ? (
          <div className="images">
            {state.vouchers.length === 4 &&
              state.vouchers.map((item, index) => (
                <div className="image-item2" key={index}>
                  <Tooltip placement="top" title={item.voucher_name}>
                    <a href={`/voucher/detail/${item.code}`}>
                      <img src={item.image} alt=""></img>
                    </a>
                  </Tooltip>
                </div>
              ))}
          </div>
        ) : (
          <div className="spin-home">
            <Spin tip="Loading..." />
          </div>
        )}
      </div>
      {/* <div className="row-background">
        <div className="bg">
          <img src="/image/homeBackground.jpg" alt=""></img>
        </div>
      </div> */}
    </div>
  );
};

export { Home };
