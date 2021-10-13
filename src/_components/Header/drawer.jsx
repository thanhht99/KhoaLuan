import React, { useEffect, useState } from "react";
import { Badge, Drawer, Button, Row, Col } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { updateCart } from "./../../store/reducers/cart";

const Drawers = (props) => {
  const dispatch = useDispatch();
  const reduxCart = useSelector((state) => state.cart.Carts);
  const cookiesCart = JSON.parse(Cookies.get("cart"));
  if (reduxCart.length !== cookiesCart.length) {
    dispatch(updateCart());
  }
  const [state, setState] = useState({
    shoppingCartList: reduxCart,
    drawerVisible: false,
  });

  const DescriptionItem = ({ title, url }) => (
    <div
      style={{
        fontSize: 14,
        lineHeight: "22px",
        marginBottom: 7,
        color: "rgba(0,0,0,0.65)",
        width: "470px",
      }}
    >
      <img src={url} alt="example" width="60" height="60" />
      <p
        style={{
          marginLeft: 8,
          display: "inline-block",
          color: "rgba(0,0,0,0.85)",
        }}
      >
        {title}
      </p>
    </div>
  );

  useEffect(() => {
    setState({
      shoppingCartList: reduxCart,
    });
  }, [reduxCart]);

  const update = () => {
    setState({
      ...state,
      drawerVisible: state.drawerVisible ? false : true,
    });
  };

  return (
    <>
      <Badge
        size="default"
        count={state.shoppingCartList.length}
        // count={10}
        style={{ right: "15px", top: "15px" }}
      >
        <ShoppingCartOutlined
          style={{
            margin: "17px",
            color: "white",
            cursor: "pointer",
            fontSize: "26px",
          }}
          onClick={update}
        />
      </Badge>
      <Drawer
        title="Cart List"
        width={520}
        placement="right"
        closable={true}
        onClose={() => setState({ ...state, drawerVisible: false })}
        visible={state.drawerVisible}
      >
        {state.shoppingCartList.map((item, index) => (
          <Row key={index}>
            <Col span={12} key={index}>
              <DescriptionItem title={item.name} url={item.image} key={index} />
            </Col>
          </Row>
        ))}
        {state.shoppingCartList.length === 0 ? null : (
          <>
            <Button type="primary" style={{ margin: 5 }}>
              Procced
            </Button>
            <Button
              type="primary"
              style={{ margin: 5 }}
              //   onClick={() => props.clear()}
            >
              Clear
            </Button>
          </>
        )}
      </Drawer>
    </>
  );
};
export default Drawers;
