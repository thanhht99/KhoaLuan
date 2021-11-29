import React from "react";
import "./index.css";
import { format } from "timeago.js";

const Message = (props) => {
  return (
    <div className={props.own ? "message own" : "message"}>
      <div className="messageTop">
        <div>
          {props.own ? null : (
            <p className="messageNameUser">
              <strong>{props.name}</strong>
            </p>
          )}
          <p className="messageText">{props.message.text}</p>
        </div>
      </div>
      <div className="messageBottom">{format(props.message.createdAt)}</div>
    </div>
  );
};

export default Message;
