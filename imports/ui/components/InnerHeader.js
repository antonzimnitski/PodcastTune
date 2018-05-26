import React from "react";
import { history } from "react-router-dom";

const InnerHeader = ({ title }) => {
  return (
    <div>
      {title ? <h1>{title}</h1> : null}
      <button onClick={() => this.history.back()}>Go Back</button>
    </div>
  );
};

export default InnerHeader;
