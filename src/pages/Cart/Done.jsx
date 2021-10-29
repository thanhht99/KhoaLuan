import React from "react";
import "antd/dist/antd.css";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const Done = () => {
  return (
    <div>
      <Result
        status="success"
        title="Order is complete!"
        subTitle="Your order will be confirmed by the staff within 30 minutes to 1 hour, please wait. Thanks you!"
        extra={
          <Button type="primary">
            <Link to="/">Go to Home</Link>
          </Button>
        }
      />
    </div>
  );
};

export { Done };
