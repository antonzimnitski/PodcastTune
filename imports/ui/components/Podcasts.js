import React from "react";
import InnerHeader from "./InnerHeader";

const Podcasts = ({ title }) => {
  return (
    <div>
      <InnerHeader title={title} />
      <div>Podcasts</div>
    </div>
  );
};

export default Podcasts;
