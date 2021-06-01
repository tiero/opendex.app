import { Grid } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import React from 'react';
import Divider from '../Divider';

const useStyles = makeStyles(theme =>
  createStyles({
    text: {
      display: 'flex',
      justifyContent: 'center',
      margin: '1rem 0',
      color: theme.palette.text.secondary,
    },
  })
);

const Footer = () => {
  const classes = useStyles();

  return (
    <Grid
      container
      justify="center"
      direction="row"
      alignItems="center"
      className={classes.root}
    >
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item className={classes.text} xs={11} sm={9}>
        opendex.app runs locally in your browser. It does not collect any
        personal data and ensures swaps are secure.
      </Grid>
    </Grid>
  );
};

export default Footer;
