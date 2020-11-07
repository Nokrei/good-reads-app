import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Header = () => {
  const classes = useStyles();
  return (
    <div className={classes.root} id="top">
      <AppBar position="static" style={{ marginBottom: "1em", opacity:'0.95' }}>
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            <Link to="/" style={{textDecoration:'none', color:'inherit'}}>Book Search</Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Header;
