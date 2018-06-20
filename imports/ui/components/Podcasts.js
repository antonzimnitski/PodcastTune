import React from "react";
import { Link } from "react-router-dom";
import InnerHeader from "./InnerHeader";

const Podcasts = ({ title }) => {
  return (
    <div className="podcasts">
      <InnerHeader title={title} />
      <div className="podcasts__content">
        <h2>Oh no! It's empty!</h2>
        <div>
          Head to <Link to="/discover">Discover section</Link>, to find
          something you interested in.
        </div>
      </div>
    </div>
  );
};

export default Podcasts;
