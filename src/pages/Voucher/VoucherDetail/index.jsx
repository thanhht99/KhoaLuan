import React, { useState, useEffect } from "react";
import "./index.css";
import "antd/dist/antd.css";
import {
  Row,
  Col,
  Breadcrumb,
  Image,
  Typography,
  Divider,
  notification,
} from "antd";
import { NotFound } from "../../../_components/NotFound";
import { doNotGetData } from "../../../constants/doNotGetData";
import { getAllVouchersSortByIsActive } from "../../../api/voucher";

const { Paragraph } = Typography;

const VoucherDetail = (props) => {
  const [state, setState] = useState({
    flag: false,
    voucher: {},
    visible: false,
  });

  useEffect(() => {
    const vouchers = JSON.parse(sessionStorage.getItem("vouchers"));

    if (vouchers) {
      vouchers.forEach((val) => {
        if (props.match.params.id === val.code) {
          setState((prev) => ({
            ...prev,
            voucher: val,
            flag: true,
          }));
        }
      });
    } else {
      const fetchData = async () => {
        const res = await getAllVouchersSortByIsActive(1);
        if (!res) {
          doNotGetData();
        }
        if (res) {
          if (res.success) {
            sessionStorage.setItem("vouchers", JSON.stringify(res.data));
            window.location.reload();
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
    }
  }, [props.match.params.id]);

  return (
    <>
      {state.flag ? (
        <div className="htmlVoucherDetail">
          <div className="relatePage">
            <Row justify="space-around">
              <Col span={24}>
                <Breadcrumb separator=">">
                  <Breadcrumb.Item href="/voucher/all">Voucher</Breadcrumb.Item>
                  <Breadcrumb.Item href="">
                    {state.voucher.voucher_name}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
          </div>
          <div className="detailVoucher">
            <Row>
              <Col span={10} className="imageDetailProduct">
                <Row style={{ justifyContent: "center" }}>
                  <Image
                    preview={true}
                    width="400px"
                    height="450px"
                    src={state.voucher.image}
                    onClick={() =>
                      setState((prev) => ({ ...prev, visible: true }))
                    }
                  />
                </Row>
              </Col>
              <Col span={14}>
                <Row>
                  <h1>{state.voucher.voucher_name}</h1>
                </Row>
                <Row>
                  <span
                    className="label-voucher-detail"
                    style={{ fontSize: "16px" }}
                  >
                    Code:
                  </span>
                  <Paragraph
                    style={{
                      color: "hsla(340, 100%, 50%, 0.5)",
                      fontWeight: "bold",
                      fontSize: "16px",
                    }}
                    copyable
                  >
                    {state.voucher.code}
                  </Paragraph>
                </Row>
                <Row>
                  <span className="label-voucher-detail">Discount:</span>
                  {state.voucher.discount > 1
                    ? `${state.voucher.discount} $`
                    : `${state.voucher.discount} %`}
                </Row>
                <Divider />
                <Row>
                  <span className="label-voucher-detail">Description:</span>
                  {state.voucher.voucher_desc}
                </Row>
                <Divider />
                <Row>
                  <span className="label-voucher-detail">Start Date:</span>
                  {new Date(state.voucher.startDate).toDateString()}
                </Row>
                <Row>
                  <span className="label-voucher-detail">End Date:</span>
                  {new Date(state.voucher.endDate).toDateString()}
                </Row>
              </Col>
            </Row>
          </div>
        </div>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export { VoucherDetail };
