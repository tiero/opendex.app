import React from 'react';
import svgIcons from '../../utils/svgIcons';
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {Grid} from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      color: theme.palette.text.secondary,
    }
  })
);

const TextInfo = (props) => {
    const classes = useStyles();
    const { className, label, value, explanation = false, onMouseEnterHandler, onMouseLeaveHandler } = props;
    return (
       <Grid container className={classes.container} justify='center'>
            <Grid item className={className} xs={12}>
                {label}
                {explanation}
            </Grid>
            <Grid item className={className} xs={12}>
              {value}
            </Grid>
       </Grid>
    )
}

export default TextInfo;
