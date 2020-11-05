import React, { useContext } from "react";
import { Route, Link } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
const LayoutRoute = (props) => {
  return (
    <React.Fragment>
      <Header />
      <Footer />
      <Route
        path={props.path}
        exact={props.exact}
        component={props.component}
      />
    </React.Fragment>
  );
};

export default LayoutRoute;
