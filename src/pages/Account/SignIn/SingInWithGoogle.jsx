import React from "react";
import "./index.css";
import "antd/dist/antd.css";
import { GoogleLogin } from "react-google-login";
import { notification } from "antd";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { getAcc, getUser } from "../../../api/user";
import { insertUser } from "../../../store/reducers/user";
import { insertAcc } from "../../../store/reducers/acc";
import { useDispatch } from "react-redux";

const SingInWithGoogle = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const handleLogin = async (googleData) => {
    const callAPI = await fetch("http://localhost:4200/api/auth/signInGoogle", {
      method: "POST",
      body: JSON.stringify({
        tokenGoogle: googleData.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const res = await callAPI.json();

    if (res === null) {
      history.push("/server-upgrade");
    } else if (res.success === true) {
      Cookies.set("token", res.data, { path: "/", expires: 2 });
      const token = Cookies.get("token");
      const acc = await getAcc(token);
      dispatch(insertAcc({ newAcc: acc.data }));
      const user = await getUser(token);
      dispatch(insertUser({ newUser: user.data }));

      if (acc.data.role === "Saler") {
        history.push("/dashboard");
      }
      if (acc.data.role === "Admin") {
        history.push("/dashboard");
      }
      if (acc.data.role === "Customer") {
        history.push("/home");
      }
    } else if (res.success === false) {
      if (res.code === 404 || res.code === 403) {
        notification["warning"]({
          message: "Warning",
          description: `${res.message}`,
        });
      } else {
        notification["error"]({
          message: "Error",
          description: `${res.message}`,
        });
      }
    }
  };
  const handleFailure = (res) => {
    alert(res.error || res);
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Log in with Google"
        onSuccess={handleLogin}
        onFailure={handleFailure}
        cookiePolicy={"single_host_origin"}
      ></GoogleLogin>
    </div>
  );
};

export { SingInWithGoogle };
