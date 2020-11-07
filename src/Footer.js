import React, { useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";

const Footer = () => {
  return (
    <div
      style={{
        gridRowStart: "3",
        gridRowEnd: "4",
        width: "100%",
        textAlign: "center",
        padding:'1em 0 1em 0'
      }}
    >
      <Typography variant="body1" color='secondary' >
        Created by Piotr Mrozowski for Veeqo {new Date().getFullYear()}
      </Typography>
    </div>
  );
};

export default Footer;
