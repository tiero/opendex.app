import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

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

const esploraURL: Record<string, string> = {
  regtest: 'http://localhost:5001',
  liquid: 'https://blockstream.info/liquid',
};

interface Props {
  chain: 'liquid' | 'regtest';
  txid: string;
  onReset(): void;
}

const Summary: React.FC<Props> = ({ chain, txid, onReset }) => {
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
        onClick={() => openInNewTab(`${esploraURL[chain]}/tx/${txid}`)}
      >
        Open in explorer
      </Button>
      <Button onClick={onReset}>Go to home</Button>
    </div>
  );
};

export default Summary;
