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

interface Props {}

const useStyles = makeStyles(theme =>
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
    },
  })
);

const steps = ['Connect', 'Review & Confirm', 'Summary'];

const TdexSwapFlow: React.FC<Props> = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(0);

  const { baseAmount, baseAsset, quoteAmount, quoteAsset } = useAppSelector(
    (state: RootState) => state.swaps
  );

  const [isLoading, setIsLoading] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chain, setChain] = useState<'liquid' | 'regtest'>('liquid');
  const [txid, setTxid] = useState('');

  const [isCheckingMarina, setIsCheckingMarina] = useState(false);

  useEffect(() => {
    if (typeof (window as any).marina === 'undefined') {
      return;
    }

    const interval = setInterval(checkIfMarinaConnected, 2000);

    //Clean up
    return () => {
      clearInterval(interval);
    };
  }, []);

  const checkIfMarinaConnected = async () => {
    try {
      if (isCheckingMarina) return;
      setIsCheckingMarina(true);

      const marina: MarinaProvider = (window as any).marina;
      setInstalled(true);

      const isEnabled = await marina.isEnabled();
      setConnected(isEnabled);

      const net = await marina.getNetwork();
      setChain(net);

      /* if (isEnabled && activeStep === 0) {
        // skip directly to Review step
        setActiveStep(1)
      } */
    } finally {
      setIsLoading(false);
      setIsCheckingMarina(false);
    }
  };

  const handleTradeCompleted = (txid: string) => {
    setTxid(txid);
    setActiveStep(2);
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const getStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Connect
            installed={installed}
            connected={connected}
            onConnect={handleNext}
          />
        );
      case 1:
        return (
          <Review
            installed={installed}
            connected={connected}
            chain={chain}
            terms={{
              assetToBeSent: baseAsset,
              amountToBeSent: Number(baseAmount),
              assetToReceive: quoteAsset,
              amountToReceive: Number(quoteAmount),
            }}
            onTrade={handleTradeCompleted}
            onReject={handleReset}
          />
        );
      case 2:
        return <Summary chain={chain} txid={txid} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <div className={classes.wrapper}>
      <TdexSteps steps={steps} activeStep={activeStep} />
      <div>{getStepContent()}</div>
      <div className={classes.info}>
        {`Status: ${
          connected ? `Connected - Network: ${chain}` : `Not Connected`
        }`}
      </div>
    </div>
  );
};

export default TdexSwapFlow;
