import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  Carts: [],
  _products: {},
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addCart: (state, action) => {
      const cookiesCart = JSON.parse(Cookies.get("cart"));
      state._products = action.payload.product;
      if (Number(Cookies.get("numberCart")) === 0) {
        let cart = {
          id: state._products.id,
          quantity: 1,
          name: state._products.name,
          image: state._products.image,
          price: state._products.price,
        };
        cookiesCart.push(cart);
      } else {
        let check = false;
        cookiesCart.map((item, key) => {
          if (item.id === state._products.id) {
            cookiesCart[key].quantity++;
            check = true;
          }
          return item;
        });
        if (!check) {
          let _cart = {
            id: state._products.id,
            quantity: 1,
            name: state._products.name,
            image: state._products.image,
            price: state._products.price,
          };
          cookiesCart.push(_cart);
        }
      }
      let json_cart = JSON.stringify(cookiesCart);
      Cookies.set("cart", json_cart, { path: "/" });
      const newNumber = Number(Cookies.get("numberCart")) + 1;
      Cookies.set("numberCart", newNumber, { path: "/" });
      state.Carts = cookiesCart;
      return state;
    },
    numberProduct: (state, action) => {
      const cookiesCart = JSON.parse(Cookies.get("cart"));
      state._products = action.payload.product;
      if (Number(Cookies.get("numberCart")) === 0) {
        let cart = {
          id: state._products.id,
          quantity: 1,
          name: state._products.name,
          image: state._products.image,
          price: state._products.price,
        };
        cookiesCart.push(cart);
      } else {
        let check = false;
        cookiesCart.map((item, key) => {
          if (item.id === state._products.id) {
            cookiesCart[key].quantity++;
            check = true;
          }
          return item;
        });
        if (!check) {
          let _cart = {
            id: state._products.id,
            quantity: 1,
            name: state._products.name,
            image: state._products.image,
            price: state._products.price,
          };
          cookiesCart.push(_cart);
        }
      }
      let json_cart = JSON.stringify(cookiesCart);
      Cookies.set("cart", json_cart, { path: "/" });
      const newNumber =
        Number(Cookies.get("numberCart")) + action.payload.number;
      Cookies.set("numberCart", newNumber, { path: "/" });
      state.Carts = cookiesCart;
      return state;
    },
    updateCart: (state, action) => {
      const cookiesCart = JSON.parse(Cookies.get("cart"));
      state.Carts = cookiesCart;
      return state;
    },
  },
});

export const { addCart, numberProduct, updateCart } = cartSlice.actions;

export default cartSlice.reducer;
