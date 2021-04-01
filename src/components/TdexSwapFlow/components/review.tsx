import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  terms: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: '1.5rem',
    lineHeight: 'normal'
  },
  buttons: {
    marginTop: theme.spacing(6),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  }
}));



interface Props {
  onConfirm(): void;
  onReject(): void;
}

const Review: React.FC<Props> = ({ onConfirm, onReject }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.instructions}>
        Review the terms of the trade before confirming
      </Typography>
      <Typography className={classes.terms}>
        📤 You send X of LBTC
      </Typography>
      <br />
      <Typography className={classes.terms}>
        📥 You receive X of USDT
      </Typography>
      <div className={classes.buttons}>
        <Button onClick={onReject}>
          Reject
        </Button>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Accept
        </Button>
      </div>

    </div >
  );
}



export default Review;