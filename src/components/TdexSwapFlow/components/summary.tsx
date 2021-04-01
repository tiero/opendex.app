import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  result: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(6),
    fontSize: '1.5rem',
    lineHeight: 'normal'
  },
}));



interface Props {
  success: boolean;
  error?: string;
}

const Summary: React.FC<Props> = ({ success }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography className={classes.result}>
        {success ? 'Success' : 'Something went wrong'}
      </Typography>
    </div >
  );
}



export default Summary;