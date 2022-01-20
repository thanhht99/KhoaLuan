import React, { useState } from "react";
import "./index.css";
import { Input, Descriptions, Result, notification, Table } from "antd";
import { doNotGetData } from "../../../constants/doNotGetData";
import { searchOrder } from "../../../api/order";
import { changeFromSkuToName } from "../../../api/product";
// import { filterOrderStatus } from "../../../constants/orderStatus";
// import { getColumnSearchProps } from "../../../constants/getColumnSearchProps";

const { Search } = Input;

function TotalPrice(price, quantity) {
  return Number(price * quantity).toLocaleString("en-US");
}

const OrderSearch = () => {
  const initialState = {
    order: null,
    search: null,
    products: [],
  };
  const [state, setState] = useState(initialState);
  // console.log("🚀🚀🚀🚀🚀🚀🚀 ~ state", state);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: "20%",
      align: "center",
    },
    {
      title: "Price",
      dataIndex: "price",
      width: "10%",
      align: "center",
      render: (price) => <div>{price}$</div>,
    },
    {
      title: "Quantity",
      dataIndex: ["id", "record"],
      width: "10%",
      align: "center",
      editable: true,
      inputType: "number",
      render: (id, record) => <div>{record.quantity}</div>,
    },
    {
      title: "Discount",
      dataIndex: ["discount"],
      width: "10%",
      align: "center",
      render: (discount) => (
        <div style={{ fontWeight: "bold", color: "rgb(255 109 44)" }}>
          {discount !== 0 ? (
            discount.discount > 1 ? (
              <>{discount.discount}$</>
            ) : (
              <>{discount.discount * 100}%</>
            )
          ) : null}
        </div>
      ),
    },
    {
      title: "Total Price",
      dataIndex: ["id", "record"],
      width: "10%",
      align: "center",
      render: (id, record) => (
        <div style={{ fontWeight: "bold" }}>
          {record.discount !== 0 ? (
            record.discount.discount > 1 ? (
              <>
                {TotalPrice(
                  parseFloat(record.price - record.discount.discount).toFixed(
                    2
                  ),
                  record.quantity
                )}
                $
              </>
            ) : (
              <>
                {TotalPrice(
                  parseFloat(
                    record.price - record.price * record.discount.discount
                  ).toFixed(2),
                  record.quantity
                )}
                $
              </>
            )
          ) : (
            <>{TotalPrice(record.price, record.quantity)}$</>
          )}
        </div>
      ),
    },
  ];

  const onSearch = async (value) => {
    if (value) {
      const res = await searchOrder(value);
      if (!res) {
        doNotGetData();
      }
      if (res) {
        if (res.success) {
          const body = {
            products: res.data.products,
          };
          const getChangeFromSkuToName = await changeFromSkuToName(body);
          const products = getChangeFromSkuToName.data.map((item, index) => {
            const product = { ...item, key: index };
            return product;
          });
          setState((prev) => ({
            ...prev,
            order: res.data,
            search: value,
            products,
          }));
        }
        if (!res.success) {
          setState((prev) => ({
            ...prev,
            order: null,
            search: value,
            products: [],
          }));
          notification["warning"]({
            message: "Warning",
            description: `${res.message}`,
          });
        }
      }
    }
  };

  return (
    <div className="htmlOrderSearch" id="htmlOrderSearch">
      <div className="test-list-product">
        <div className="list-product-sort-bar" style={{ marginBottom: "50px" }}>
          <Search
            placeholder="Search"
            onSearch={onSearch}
            enterButton
            style={{ width: "160px", marginLeft: "8px" }}
            defaultValue={state.search ? state.search : null}
          />
        </div>
        {state.order ? (
          <>
            <Descriptions
              title={state.order.orderCode}
              style={{ marginBottom: "50px" }}
              bordered
            >
              <Descriptions.Item label="Full Name">
                {state.order.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Telephone">
                {state.order.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {state.order.email}
              </Descriptions.Item>
              <Descriptions.Item label="Order Date" span={1}>
                {state.order.orderDate}
              </Descriptions.Item>
              <Descriptions.Item label="Address" span={2}>
                {state.order.address}
              </Descriptions.Item>
              <Descriptions.Item label="Payment methods" span={1}>
                {state.order.payments}
              </Descriptions.Item>
              <Descriptions.Item label="Order Status" span={2}>
                {state.order.orderStatus}
              </Descriptions.Item>
              <Descriptions.Item label="Note" span={3}>
                {state.order.note}
              </Descriptions.Item>
              <Descriptions.Item label="Voucher Code" span={1}>
                {state.order.voucherCode}
              </Descriptions.Item>
              <Descriptions.Item label="Discount" span={1}>
                {state.order.discount}
              </Descriptions.Item>
              <Descriptions.Item label="Transport Fee" span={1}>
                {state.order.transportFee}$
              </Descriptions.Item>
              <Descriptions.Item
                label="Total number of products ordered"
                span={1}
              >
                {state.order.totalProduct}
              </Descriptions.Item>
              <Descriptions.Item label="Total amount of goods" span={1}>
                {state.order.temporaryMoney}$
              </Descriptions.Item>
              <Descriptions.Item label="Total" span={1}>
                {state.order.totalPayment}$
              </Descriptions.Item>
            </Descriptions>
            <h1
              style={{
                fontWeight: 700,
                marginLeft: 19,
                color: "rgba(255, 0, 85, 0.5)",
                fontSize: "20px",
              }}
            >
              List of products
            </h1>
            <Table columns={columns} dataSource={state.products} />
          </>
        ) : (
          <Result status="404" title="No order" />
        )}
      </div>
    </div>
  );
};

export { OrderSearch };
