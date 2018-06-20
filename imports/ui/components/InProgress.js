import React from "react";
import { Link } from "react-router-dom";
import InnerHeader from "./InnerHeader";

const InProgress = ({ title }) => {
  return (
    <div className="in-progress">
      <InnerHeader title={title} />
      <div className="in-progress__content">
        <h2>No episodes in progress.</h2>
        <div>
          Press play on <Link to="/discover">something new</Link>. You know you
          want to.
        </div>
      </div>
    </div>
  );
};

export default InProgress;
