import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { brown } from "@material-ui/core/colors";
import AppContext from "./AppContext";
import LayoutRoute from "./LayoutRoute";
import MainScreen from "./MainScreen";
import AuthorScreen from "./AuthorScreen";
const App = () => {
  const [globalState, setGlobalState] = useState({
    author: "",
    authorId:''
  });
  const theTheme = createMuiTheme({
    typography: {
      htmlFontSize: 18,
    },
    palette: {
      type: "dark",
      primary: {
        main: brown[800],
      },
      secondary: {
        main: "#ede2d1",
      },
    },
  });
  return (
    <React.Fragment>
      <ThemeProvider theme={theTheme}>
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
      </ThemeProvider>
    </React.Fragment>
  );
};

export default App;
