import React from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  return (
    <div>
      <ul>
        <li>All</li>
        <li>
          <Link to="/discover">Discover</Link>
        </li>
        <li>New Releases</li>
        <li>In progress</li>
        <li>Starred</li>
      </ul>
    </div>
  );
};

export default SideBar;
