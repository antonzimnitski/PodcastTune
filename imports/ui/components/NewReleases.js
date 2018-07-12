import React from "react";
import { Link } from "react-router-dom";

import InnerHeader from "./InnerHeader";

const NewReleases = ({ title }) => {
  return (
    <div className="new-releases">
      <InnerHeader title={title} />
      <div className="new-releases__content">
        <h2>All caught up!.</h2>
        <div>
          It's time to subscribe to some{" "}
          <Link to="/discover">more podcasts</Link>.
        </div>
      </div>
    </div>
  );
};

export default NewReleases;
