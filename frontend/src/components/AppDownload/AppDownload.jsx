import React from "react";
import { assets } from "../../assets/assets";
import "./AppDownload.css";
//================================================

// The AppDownload component displays information about downloading the app.
//---------------------------------------------------------------------------
export const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        Download our <br />
        <span className="company-name"> Theen</span> App
      </p>
      <div className="app-download-platforms">
        <img src={assets.play_store} alt="" />
        <img src={assets.app_store} alt="" />
      </div>
    </div>
  );
};
