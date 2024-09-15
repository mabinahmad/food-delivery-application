import React, { useRef } from "react";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import "./Footer.css";
//=============================================

export const Footer = () => {
  return (
    <div className="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <h1 className="company-name">Theen</h1>
        </div>
        <div className="footer-social-icons">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook className="facebook-icon" />
          </a>

          <a
            href="https://www.twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter className="twitter-icon" />
          </a>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="instagram-icon" />
          </a>
        </div>
        <div className="footer-content-right">
          <ul>
            <li>+974 12121212</li>
            <li>contact@ma.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">
        Copyright 2024 Theen.com - All Rights Reserved
      </p>
    </div>
  );
};
