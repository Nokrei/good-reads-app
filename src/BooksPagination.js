import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Pagination from "@material-ui/lab/Pagination";

const BooksPagination = (props) => {
  const useStyles = makeStyles((theme) => ({
    root: {
      "& > * + *": {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();

  return (
    <div
      className={classes.root}
      style={{
        display: "flex",
        justifyContent: "center",
        margin: "1em 0 1em 0",
      }}
    >
      <Pagination
        count={props.count}
        page={props.page}
        onChange={props.handleChange}
        color="primary"
        variant="text"
        size="large"
        shape="round"
      />
    </div>
  );
};

export default BooksPagination;
