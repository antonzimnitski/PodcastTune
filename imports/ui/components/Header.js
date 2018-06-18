import React from "react";
import { Session } from "meteor/session";
import { withTracker } from "meteor/react-meteor-data";
import { Link } from "react-router-dom";

const Header = props => {
  const navImageSrc = props.isNavOpen ? "/images/x.svg" : "/images/bars.svg";
  return (
    <div className="top-header">
      <img
        className="top-header__nav-toogle"
        onClick={() => props.handleNavToggle()}
        src={navImageSrc}
      />
      <Link className="top-header__logo" to="/">
        <img src="/images/logo.svg" alt="" />
      </Link>
    </div>
  );
};

export default withTracker(() => {
  return {
    handleNavToggle: () => Session.set("isNavOpen", !Session.get("isNavOpen")),
    isNavOpen: Session.get("isNavOpen")
  };
})(Header);
