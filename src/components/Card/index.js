import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
  root: {
    // width: 400,
    height: 550,
    borderRadius: 12,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

const CardComponent = ({ children }) => {
    const classes = useStyles();
    return (
        <Card className={classes.root}>
            <CardContent>{children}</CardContent>
        </Card>
    )
};

export default CardComponent;