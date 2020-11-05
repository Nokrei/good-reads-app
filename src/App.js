import React, { useState, useContext }  from "react";
import "./App.css";
import { BrowserRouter, Redirect, Route, Switch, Link } from "react-router-dom";
import AppContext from './AppContext';
import LayoutRoute from "./LayoutRoute";
import MainScreen from "./MainScreen";
import AuthorScreen from "./AuthorScreen";
const App = ()=> {
  const [globalState, setGlobalState] = useState({
    author:''
  });
  return (
    <React.Fragment>
      <AppContext.Provider value={[globalState, setGlobalState]}>
      <BrowserRouter>
        <Switch>
          <LayoutRoute path="/" exact={true} component={MainScreen} />
          <LayoutRoute
            path="/authorScreen"
            exact={true}
            component={AuthorScreen}
          />
        </Switch>
      </BrowserRouter>
      </AppContext.Provider>
    </React.Fragment>
  );
}

export default App;
