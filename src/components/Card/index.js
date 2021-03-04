import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";

const useStyles = makeStyles({
  root: {
    height: 600,
    borderRadius: '0.2rem',
  },
  content: {
    padding: 0,
    height: '100%',
    '&:last-child': {
      'padding-bottom': 0,
    }
  }
});

const CardComponent = ({ children }) => {
  const classes = useStyles();
  return (
    <Card className={classes.root}>
      <CardContent className={classes.content}>{children}</CardContent>
    </Card>
  );
};

export default CardComponent;

