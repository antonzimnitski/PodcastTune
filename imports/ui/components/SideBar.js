import React from "react";
import { NavLink, Link } from "react-router-dom";
import Auth from "./Auth";

const SideBar = () => {
  return (
    <nav>
      <Link className="sidebar__logo" to="/">
        <img src="/images/logo.svg" alt="" />
      </Link>
      <div className="sidebar__links">
        <Link className="sidebar__link" to="/">
          Podcasts
        </Link>

        <Link className="sidebar__link" to="/discover">
          Discover
        </Link>

        <Link className="sidebar__link" to="/new-releases">
          New Releases
        </Link>

        <Link className="sidebar__link" to="/in-progress">
          In progress
        </Link>

        <Link className="sidebar__link" to="/starred">
          Starred
        </Link>
        <Auth />
      </div>
    </nav>
  );
};

export default SideBar;
