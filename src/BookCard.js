import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
const BookCard = (props) => {
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
        <Typography variant="body1">By {props.author}</Typography>
        <Typography variant="body1">Rating: {props.rating}</Typography>
        <Typography variant="body1">Published: {props.published}</Typography>
      </CardContent>
    </Card>
  );
};

export default BookCard;
