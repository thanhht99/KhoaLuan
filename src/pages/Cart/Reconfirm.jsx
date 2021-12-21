import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import {
  Descriptions,
  Tooltip,
  Radio,
  Table,
  Collapse,
  notification,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addInfoOrder, changeIsError2 } from "../../store/reducers/infoOrder";
import { getVoucher } from "../../api/voucher";
import { Distance } from "../../constants/Distance";

// const API_KEY = "AIzaSyBLIvjpZ--1QiK92WZIVzfiTHBAAvQtSuw";

function TotalPrice(price, quantity) {
  return Number(price * quantity).toLocaleString("en-US");
}
const { Panel } = Collapse;

const Reconfirm = () => {
  const dispatch = useDispatch();
  const reduxInfoOrder = useSelector((state) => state.infoOrder.InfoOrder);
  const reduxCart = useSelector((state) => state.cart.Carts);
  let TotalCart = 0;
  let TotalProduct = 0;
  reduxCart.forEach((item) => {
    TotalCart +=
      item.discount !== 0
        ? item.discount.discount > 1
          ? item.quantity * (item.price - item.discount.discount)
          : item.quantity * (item.price - item.price * item.discount.discount)
        : item.quantity * item.price;
    TotalProduct += item.quantity;
  });

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    distance: null,
    province: null,
    fee: null,
  });
  const [voucher, setVoucher] = useState({
    discount: null,
    typeVoucher: null,
  });

  // console.log("💥 . 💡", location);

  useEffect(() => {
    const fetchData = async () => {
      axios
        .get("https://maps.googleapis.com/maps/api/geocode/json", {
          params: {
            address: reduxInfoOrder.address,
            key: process.env.REACT_APP_API_KEY,
          },
        })
        .then((response) => {
          const location = response.data.results[0].geometry.location;
          let province;
          response.data.results[0].address_components.forEach((item, index) => {
            if (item.types[0] === "administrative_area_level_1") {
              province = item.long_name;
            }
          });
          const distance = Distance(
            10.849967,
            106.77164,
            location.lat,
            location.lng
          ).toFixed(1);
          setLocation({
            lat: location.lat,
            lng: location.lng,
            distance,
            province,
          });
        })
        .catch((err) => {
          console.log(err);
          notification["error"]({
            message: "Error",
            description:
              "Google maps. Please refresh page or contact admin for support. Thank you!",
          });
          dispatch(changeIsError2());
        });
    };
    if (reduxInfoOrder.address) {
      fetchData();
    }
  }, [reduxInfoOrder.address, dispatch]);

  useEffect(() => {
    const fetchVoucher = async () => {
      const voucher = await getVoucher(reduxInfoOrder.voucherCode);
      if (!voucher.success) {
        notification["warning"]({
          message: "Warning",
          description: `${voucher.message}`,
        });
        dispatch(changeIsError2());
      }
      if (voucher.success) {
        setVoucher({
          discount: voucher.data.discount,
          typeVoucher: voucher.data.type,
        });
      }
    };
    if (reduxInfoOrder.voucherCode) {
      fetchVoucher();
    }
  }, [reduxInfoOrder.voucherCode, dispatch]);

  useEffect(() => {
    if (location.province) {
      switch (location.province) {
        case "Đà Nẵng":
          setLocation((prev) => ({ ...prev, fee: 2.08 }));
          break;
        case "Thành phố Hồ Chí Minh":
          setLocation((prev) => ({ ...prev, fee: 1.07 }));
          break;
        case "Hà Nội":
          setLocation((prev) => ({ ...prev, fee: 2.64 }));
          break;
        default:
      }
      if (!location.fee) {
        if (location.distance < 100) {
          setLocation((prev) => ({ ...prev, fee: 1.51 }));
        }
        if (location.distance > 300) {
          setLocation((prev) => ({ ...prev, fee: 3.07 }));
        }
        if (location.distance >= 100 && location.distance <= 300) {
          setLocation((prev) => ({ ...prev, fee: 2.01 }));
        }
      }
    }
  }, [location.distance, location.fee, location.province]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      width: "40%",
      render: (name) => (
        <div style={{ cursor: "pointer" }}>
          <Tooltip
            placement="topLeft"
            title={name}
            color="hsla(340, 100%, 50%, 0.5)"
            key={name}
          >
            {name}
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Image",
      dataIndex: "image",
      width: "10%",
      align: "center",
      render: (image) => (
        <>
          <img
            src={image}
            style={{ width: "100px", height: "80px", objectFit: "cover" }}
            alt=""
          />
        </>
      ),
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

  const onChangePayment = (e) => {
    const totalPayment1 =
      total(Number(TotalCart).toLocaleString("en-US"), voucher, location.fee) <
      0
        ? 0
        : total(
            Number(TotalCart).toLocaleString("en-US"),
            voucher,
            location.fee
          );
    const newReduxInfoOrder = {
      ...reduxInfoOrder,
      phone: "0" + reduxInfoOrder.phone,
      payments: e.target.value,
      orderDate: Date().toLocaleString(),
      intendedArrivalDate: "5-7 Day",
      products: reduxCart,
      totalProduct: Number(TotalProduct),
      discount: voucher.discount,
      temporaryMoney: Number(Number(TotalCart).toLocaleString("en-US")),
      transportFee: location.fee,
      totalPayment: Number(totalPayment1),
      isError2: false,
    };
    dispatch(addInfoOrder({ infoOrder: newReduxInfoOrder }));
  };

  const total = (temporaryMoney, voucher, fee) => {
    switch (voucher.typeVoucher) {
      case "Money":
        const res1 =
          Number(temporaryMoney) - Number(voucher.discount) + Number(fee);
        return Number(res1).toLocaleString("en-US");
      case "Percent":
        const res2 =
          Number(temporaryMoney) -
          Number(temporaryMoney) * Number(voucher.discount) +
          Number(fee);
        return Number(res2).toLocaleString("en-US");
      default:
        const res3 = Number(temporaryMoney) + Number(fee);
        return Number(res3).toLocaleString("en-US");
    }
  };

  return (
    <>
      <div style={{ background: "white" }}>
        <br />
        <Descriptions
          title="Delivery information"
          bordered
          style={{ textAlign: "initial" }}
        >
          <Descriptions.Item label="Full Name">
            {reduxInfoOrder.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Telephone">
            {reduxInfoOrder.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {reduxInfoOrder.email}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={3}>
            {reduxInfoOrder.address}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Descriptions
          title="Ordered products"
          layout="vertical"
          style={{ textAlign: "initial" }}
          bordered
        ></Descriptions>
        <Table columns={columns} dataSource={reduxCart} />
        <Descriptions
          title="Order details"
          style={{ textAlign: "initial" }}
          bordered
        >
          <Descriptions.Item label="Order Date" span={2}>
            {Date().toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Intended Arrival Date">
            5-7 Day
          </Descriptions.Item>

          <Descriptions.Item label="Note" span={3}>
            {reduxInfoOrder.note}
          </Descriptions.Item>

          <Descriptions.Item label="Total Product">
            {Number(TotalProduct).toLocaleString("en-US")}
          </Descriptions.Item>
          <Descriptions.Item label="Voucher Code">
            {reduxInfoOrder.voucherCode}
          </Descriptions.Item>
          <Descriptions.Item label="Discount">
            {voucher.typeVoucher === "Money" && <>{voucher.discount} $</>}
            {voucher.typeVoucher === "Percent" && <>{voucher.discount} %</>}
          </Descriptions.Item>

          <Descriptions.Item label="Temporary Money">
            <strong> {Number(TotalCart).toLocaleString("en-US")} $ </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Delivery">J&T Express</Descriptions.Item>
          <Descriptions.Item label="Transport Fee">
            {location.fee} $
          </Descriptions.Item>

          <Descriptions.Item label="Total Payment">
            <strong id="totalPayment">
              {total(
                Number(TotalCart).toLocaleString("en-US"),
                voucher,
                Number(location.fee).toLocaleString("en-US")
              ) < 0
                ? Number(0).toLocaleString("en-US")
                : total(
                    Number(TotalCart).toLocaleString("en-US"),
                    voucher,
                    Number(location.fee).toLocaleString("en-US")
                  )}
              $
            </strong>
          </Descriptions.Item>
          <Descriptions.Item label="Payment Method" span={2}>
            <Radio.Group onChange={onChangePayment}>
              <Radio value="Momo">Momo</Radio>
              <br />
              <Radio value="COD">COD</Radio>
              <br />
              <Radio value="Bank account">Bank account</Radio>
            </Radio.Group>
          </Descriptions.Item>
        </Descriptions>
      </div>
      <div style={{ textAlign: "initial" }}>
        <Collapse
          className="collapseDeliveryFee"
          style={{ backgroundColor: "red" }}
        >
          <Panel header="Delivery fee ( J&T )" key="1">
            <Descriptions layout="vertical" bordered>
              <Descriptions.Item label="in HCM City">1,07 $</Descriptions.Item>
              <Descriptions.Item label="Đà Nẵng">2,08 $</Descriptions.Item>
              <Descriptions.Item label="Hà Nội">2,64 $</Descriptions.Item>
              <Descriptions.Item label="<100Km">1,51 $</Descriptions.Item>
              <Descriptions.Item label="100-300Km">2,01 $</Descriptions.Item>
              <Descriptions.Item label=">300Km">3,07 $</Descriptions.Item>
            </Descriptions>
          </Panel>
        </Collapse>
      </div>
    </>
  );
};

export { Reconfirm };
