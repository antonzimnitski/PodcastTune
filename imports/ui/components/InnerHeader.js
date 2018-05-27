import React from "react";
import { history } from "react-router-dom";

const InnerHeader = ({ title }) => {
  return (
    <div className="inner-header">
      {title ? <h1 className="inner-header__title">{title}</h1> : null}
      <div
        className="inner-header__back-btn"
        onClick={() => this.history.back()}
      >
        <div className="inner-header__back-arrow" />
        Go Back
      </div>
    </div>
  );
};

export default InnerHeader;
