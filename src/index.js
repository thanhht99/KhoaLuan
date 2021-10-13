import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { store } from "./store/index";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  // <React.StrictMode>
  <CookiesProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </CookiesProvider>,
  // </React.StrictMode>
  document.getElementById("root")
);
reportWebVitals();
