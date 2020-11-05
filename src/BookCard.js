import React,{useState, useContext} from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from './AppContext'
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
const BookCard = (props) => {
   // Author name will be tied to global state
   const [globalState, setGlobalState] = useContext(AppContext)

    const handleAuthorClick= ()=>{
      setGlobalState({
        ...globalState,
        author: props.author
      })
    }

  const useStyles = makeStyles({
    root: {
      minWidth: 275,
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
  });
  const classes = useStyles();
  return (
    <Card
      className={classes.root}
      style={{ width: "10em", Minheight: "20em", border: "1px solid grey" }}
    >
      <CardContent>
        <img src={props.img} alt="Book Image" style={{ height: "5em" }} />
        <Typography variant="h6">{props.title}</Typography>

        <Typography variant="body1">
          By <Link to="/authorScreen" onClick={handleAuthorClick}>{props.author}</Link>
        </Typography>

        <Typography variant="body1">Rating: {props.rating}</Typography>
        <Typography variant="body1">Published: {props.published}</Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
