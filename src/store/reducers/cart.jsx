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
      const keyCart = Number(Cookies.get("keyCart"));
      state._products = action.payload.product;
      if (cookiesCart.length === 0) {
        let cart = {
          id: state._products.id,
          quantity: 1,
          key: keyCart + 1,
          name: state._products.name,
          image: state._products.image,
          price: state._products.price,
        };
        Cookies.set("keyCart", keyCart + 1, { path: "/" });
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
            key: keyCart + 1,
            name: state._products.name,
            image: state._products.image,
            price: state._products.price,
          };
          Cookies.set("keyCart", keyCart + 1, { path: "/" });
          cookiesCart.push(_cart);
        }
      }
      let json_cart = JSON.stringify(cookiesCart);
      Cookies.set("cart", json_cart, { path: "/" });
      state.Carts = cookiesCart;
      return state;
    },
    numberProduct: (state, action) => {
      const cookiesCart = JSON.parse(Cookies.get("cart"));
      const keyCart = Number(Cookies.get("keyCart"));
      state._products = action.payload.product;
      if (cookiesCart.length === 0) {
        let cart = {
          id: state._products.id,
          quantity: 1,
          key: keyCart + 1,
          name: state._products.name,
          image: state._products.image,
          price: state._products.price,
        };
        Cookies.set("keyCart", keyCart + 1, { path: "/" });
        cookiesCart.push(cart);
      } else {
        let check = false;
        cookiesCart.map((item, key) => {
          if (item.id === state._products.id) {
            cookiesCart[key].quantity += action.payload.number;
            check = true;
          }
          return item;
        });
        if (!check) {
          let _cart = {
            id: state._products.id,
            quantity: 1,
            key: keyCart + 1,
            name: state._products.name,
            image: state._products.image,
            price: state._products.price,
          };
          Cookies.set("keyCart", keyCart + 1, { path: "/" });
          cookiesCart.push(_cart);
        }
      }
      let json_cart = JSON.stringify(cookiesCart);
      Cookies.set("cart", json_cart, { path: "/" });
      state.Carts = cookiesCart;
      return state;
    },
    updateCart: (state, action) => {
      const cookiesCart = JSON.parse(Cookies.get("cart"));
      state.Carts = cookiesCart;
      return state;
    },
    deleteProduct: (state, action) => {
      let cookiesCart = JSON.parse(Cookies.get("cart"));
      const id = action.payload.id;
      const afterDelete = cookiesCart.filter((item) => {
        return item.id !== id;
      });
      let json_cart = JSON.stringify(afterDelete);
      Cookies.set("cart", json_cart, { path: "/" });
      state.Carts = afterDelete;
      return state;
    },
    changeNumberProduct: (state, action) => {
      const cookiesCart = JSON.parse(Cookies.get("cart"));
      const id = action.payload.id;
      const quantity = action.payload.quantity;
      cookiesCart.map((item, key) => {
        if (item.id === id) {
          cookiesCart[key].quantity = quantity;
        }
        return item;
      });
      let json_cart = JSON.stringify(cookiesCart);
      Cookies.set("cart", json_cart, { path: "/" });
      state.Carts = cookiesCart;
      return state;
    },
    resetCart: () => {
      const cart = [];
      let json_cart = JSON.stringify(cart);
      Cookies.set("cart", json_cart, { path: "/" });
      return initialState;
    },
  },
});

export const {
  addCart,
  numberProduct,
  updateCart,
  deleteProduct,
  changeNumberProduct,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
