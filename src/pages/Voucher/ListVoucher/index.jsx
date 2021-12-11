import React, { useState, useEffect } from "react";
import "./index.css";
import "antd/dist/antd.css";
import { getAllVouchersSortByIsActive } from "../../../api/voucher";
import { doNotGetData } from "../../../constants/doNotGetData";
import { Card, notification, Pagination, Spin, Tooltip } from "antd";

const { Meta } = Card;

const ListVoucher = () => {
  const [state, setState] = useState({
    vouchers: [],
    minValue: 0,
    maxValue: 12,
    page: 1,
  });

  // let list_voucher = JSON.parse(sessionStorage.getItem("vouchers"));
  // console.log("🚀🚀🚀🚀🚀🚀 ~ list_voucher", list_voucher);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getAllVouchersSortByIsActive(1);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          sessionStorage.setItem("vouchers", JSON.stringify(res.data));
          setState((prev) => ({
            ...prev,
            vouchers: res.data,
          }));
        }
        if (!res.success) {
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
        }
      }
    };
    fetchData();
  }, []);

  const onChange = (pageNumber) => {
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

  return (
    <div className="htmlListVoucher" id="htmlListVoucher">
      <div className="cart-list-voucher">
        {state.vouchers && state.vouchers.length > 0 ? (
          state.vouchers
            .slice(state.minValue, state.maxValue)
            .map((val, index) => (
              <Card
                className="card-list-voucher"
                key={index}
                hoverable
                style={{ width: 350 }}
                cover={
                  <a href={`/voucher/detail/${val.code}`}>
                    <img
                      alt=""
                      style={{
                        height: "350px",
                        width: "100%",
                        position: "relative",
                      }}
                      src={val.image}
                      className="image-list-voucher"
                    />
                  </a>
                }
              >
                <Tooltip placement="topLeft" title={val.voucher_name}>
                  <Meta
                    className="card-meta-list-voucher"
                    title={val.voucher_name}
                  />
                </Tooltip>
              </Card>
            ))
        ) : (
          <div style={{ display: "grid", margin: "100px" }}>
            <Spin />
          </div>
        )}
      </div>
      <div className="pagination-list-voucher">
        <Pagination
          defaultCurrent={state.page}
          total={state.vouchers.length}
          defaultPageSize={12}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export { ListVoucher };
