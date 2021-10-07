import { notification } from "antd";

export const doNotGetData = () => {
  notification["error"]({
    message: "Error",
    description: "Can't get data from server. Please connect admin",
  });
};
