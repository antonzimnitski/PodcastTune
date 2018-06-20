import React from "react";
import InnerHeader from "./InnerHeader";

const Starred = ({ title }) => {
  return (
    <div className="starred">
      <InnerHeader title={title} />
      <div className="starred__content">
        <h2>No stared episodes available.</h2>
        <div>It's time to find some new favourites.</div>
      </div>
    </div>
  );
};

export default Starred;
