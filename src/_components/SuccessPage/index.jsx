import React from "react";
import "antd/dist/antd.css";
import { Button, Result } from "antd";
import { Link } from "react-router-dom";

const SuccessPage = (props) => {
  return (
    <div>
      <Result
        status="success"
        title="Successfully!"
        subTitle={props.title}
        extra={[
          <Button type="primary" key="console">
            <Link to="/account/sign-in">Go to sign in</Link>
          </Button>,
        ]}
      />
    </div>
  );
};

export { SuccessPage };
