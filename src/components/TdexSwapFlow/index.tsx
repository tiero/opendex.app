import React, { useState, useEffect } from 'react';
import { MarinaProvider } from 'marina-provider';

import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

import TdexSteps from './components/steps';
import Connect from './components/connect';
import Review from './components/review';
import Summary from './components/summary';


import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props { }

const useStyles = makeStyles((theme) =>
  createStyles({
    wrapper: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      marginTop: '1rem',
      marginBottom: '1rem',
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
    info: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(3),
    }
  })
);

const steps = ["Connect", "Review & Confirm", "Summary"];

const TdexSwapFlow: React.FC<Props> = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const {
    baseAmount,
    baseAsset,
    quoteAmount,
    quoteAsset
  } = useAppSelector((state: RootState) => state.swaps);


  const [isLoading, setIsLoading] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chain, setChain] = useState<'liquid' | 'regtest'>('liquid');
  const [txid, setTxid] = useState('');


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

        const net = await marina.getNetwork();
        setChain(net);

        setIsLoading(false);
        isCheckingMarina = false;

      } catch (_) {
        setIsLoading(false);
        isCheckingMarina = false;
      }

    }, 5000);

    //Clean up
    return () => {
      clearInterval(interval);
    };

  }, [])

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Connect installed={installed} connected={connected} onConnect={handleNext} />
      case 1:
        return (
          <Review
            installed={installed}
            connected={connected}
            chain={chain}
            onTrade={(txid: string) => {
              setTxid(txid);
              handleNext();
            }}
            onReject={handleReset}
          />
        );
      case 2:
        return <Summary chain={chain} txid={txid} onReset={handleReset} />
      default:
        return null;
    }
  }

  if (isLoading) {
    return <CircularProgress />
  }

  return (
    <div className={classes.wrapper}>
      <TdexSteps steps={steps} activeStep={activeStep} />
      <div>
        {getStepContent()}
      </div>
      <div className={classes.info} >
        {`Status: ${connected ? `Connected - Network: ${chain}` : `Not Connected`}`}
      </div>
    </div>
  );

};

export default TdexSwapFlow;
