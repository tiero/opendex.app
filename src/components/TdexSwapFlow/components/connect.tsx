import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { MarinaProvider } from 'marina-provider';
import CircularProgress from '@material-ui/core/CircularProgress';

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
    marginBottom: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  }
}));


interface Props {
  onConnect(): void;
}


const Connect: React.FC<Props> = ({ onConnect }) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);

  let isCheckingMarina: boolean = false;
  let interval: any;

  useEffect(() => {

    if (typeof (window as any).marina === 'undefined') {
      return;
    }

    interval = setInterval(async () => {
      try {
        if (isCheckingMarina)
          return;

        isCheckingMarina = true;

        const marina: MarinaProvider = (window as any).marina;
        setInstalled(true);

        const isEnabled = await marina.isEnabled();
        setConnected(isEnabled);

        setIsLoading(false);
        isCheckingMarina = false;
      } catch (_) {
        setIsLoading(false);
        isCheckingMarina = false;
      }

    }, 1000);

    //Clean up
    return () => {
      clearInterval(interval);
    };

  }, [])


  const handleConnect = async () => {
    if (!installed) {
      return alert('Marina is not installed')
    }

    await (window as any).marina.enable();
  }

  const handleGetAddress = async () => {
    if (!installed) {
      return alert('Marina is not installed')
    }

    if (!connected) {
      return alert('User must enable this website to proceed')
    }

    onConnect()
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <div className={classes.root}>
      {
        installed && connected ? (
          <>
            <Typography className={classes.instructions}>
              🎉 Connected
            </Typography>
            <Button variant="contained" color="primary" onClick={handleGetAddress}>
              Go ahead
            </Button>
          </>
        ) : (
          <>
            <Typography className={classes.instructions}>
              Connect your wallet to OpenDEX
            </Typography>
            <Button
              className={classes.button}
              variant="contained"
              color="primary"
              onClick={handleConnect}
            >
              Connect with Marina Wallet
            </Button>
            <Button
              className={classes.button}
              variant="contained"
              disabled
              onClick={handleConnect}
            >
              In-browser wallet (coming soon)
            </Button>
          </>
        )
      }
    </div >
  );
}



export default Connect;