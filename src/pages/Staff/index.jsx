import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { NotFound } from "../../_components/NotFound/index";

const Staff = () => {
  const history = useHistory();
  const token = Cookies.get("token");
  const acc = useSelector((state) => state.acc.Acc);
  console.log("🚀 ~ file: index.jsx ~ line 10 ~ Staff ~ token", token);
  if (!token) {
    history.push("/account/sign-in");
  }
  return (
    <div className="htmlStaff" id="htmlStaff">
      {token && acc.role === "Saler" ? <h1>Helllo Staff</h1> : <NotFound />}
    </div>
  );
};

export { Staff };
