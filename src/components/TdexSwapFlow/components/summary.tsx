import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { EsploraByChain } from '../constants';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  result: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
    fontSize: '1.5rem',
    lineHeight: 'normal',
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
}));

interface Props {
  chain: 'liquid' | 'regtest';
  txid: string;
  onNewTrade(): void;
}

const Summary: React.FC<Props> = ({ chain, txid, onNewTrade }) => {
  const classes = useStyles();

  const openInNewTab = url => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.result}>Trade completed</Typography>
      <Button
        variant="contained"
        onClick={() => openInNewTab(`${EsploraByChain[chain]}/tx/${txid}`)}
      >
        Open in explorer
      </Button>
      <Button onClick={onNewTrade}>New trade</Button>
    </div>
  );
};

export default Summary;
