import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppContext from "./AppContext";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
const BookCard = (props) => {
  // Author name will be tied to global state
  const [globalState, setGlobalState] = useContext(AppContext);

  const handleAuthorClick = () => {
    setGlobalState({
      ...globalState,
      author: props.author,
      authorId: props.authorId,
    });
  };

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
      style={props.style}
    >
      
      <CardContent>
      <span style={{visibility:'hidden', position:'absolute'}}>{props.authorId}</span>
        <img src={props.img} alt="Book Image" style={{ Maxheight: "12em", opacity:'1' }} />
        <Typography variant="h6" style={{textAlign:'center'}}>{props.title}</Typography>
        <Typography variant="body1">{props.isbn}</Typography>
        <Typography variant="body1">{props.reviewCount}</Typography>
  <Typography variant="subtitle2"><a href={props.link} target="_blank">Goodreads page</a></Typography>
        <Typography variant="body1">{props.pages}</Typography>
        <Typography variant="body1">{props.format}</Typography>
        <Typography variant="body1">{props.rating}</Typography>
        <Typography variant="body1">{props.ratingCount}</Typography>
        <Typography variant="body1">{props.published}</Typography>
        <br/>
        <Typography variant="body1">{props.desc}</Typography>
        <Typography variant="body1">
          <Link to="/authorScreen" onClick={handleAuthorClick}>
            {props.author}
          </Link>
        </Typography>

        
        
      </CardContent>
    </Card>
  );
};

export default BookCard;
