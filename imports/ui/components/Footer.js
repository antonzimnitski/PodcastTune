import React from "react";
import moment from "moment";

const Footer = () => {
  return (
    <footer className="footer">
      <span className="footer__text">
        Copyright &copy; {moment().year()}{" "}
        <a
          className="footer__link"
          href="https://github.com/Zimniros"
          target="_blank"
        >
          Anton Zimnitski
        </a>
      </span>
    </footer>
  );
};

export default Footer;
