import React, { useState, useEffect } from 'react';
import { MarinaProvider } from 'marina-provider';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

import TdexSteps from './components/steps';
import Connect from './components/connect';
import Review from './components/review';
import Summary from './components/summary';

import { createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setSwapStep } from '../../store/swaps-slice';
import { SwapStep } from '../../constants/swap';

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

  const { sendAsset, receiveAsset, sendAmount, receiveAmount } = useAppSelector(
    (state: RootState) => state.swaps
  );

  const [isLoading, setIsLoading] = useState(true);
  const [installed, setInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chain, setChain] = useState<'liquid' | 'regtest'>('liquid');
  const [txid, setTxid] = useState('');

  useEffect(() => {
    let isCheckingMarina = false;
    const interval = setInterval(async () => {
      try {
        const marina: MarinaProvider = (window as any).marina;
        setInstalled(true);

        const net = await marina.getNetwork();
        setChain(net);

        if (isCheckingMarina) return;
        isCheckingMarina = true;

        if (activeStep > 0) return;
        const isEnabled = await marina.isEnabled();
        setConnected(isEnabled);

        if (isEnabled && activeStep === 0) {
          // skip directly to Review step
          setActiveStep(1);
        }
      } catch (error) {
        console.log(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
        isCheckingMarina = false;
      }
    }, 1000);

    //Clean up
    return () => {
      clearInterval(interval);
    };
  }, [activeStep]);

  const handleTradeCompleted = (txid: string) => {
    setTxid(txid);
    setActiveStep(2);
  };

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  };

  const dispatch = useAppDispatch();
  const handleGoBack = () => {
    dispatch(setSwapStep(SwapStep.CHOOSE_PAIR));
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
            chain={chain}
            terms={{
              assetToBeSent: sendAsset,
              amountToBeSent: Number(sendAmount.replace(',', '')),
              assetToReceive: receiveAsset,
              amountToReceive: Number(receiveAmount.replace(',', '')),
            }}
            onTrade={handleTradeCompleted}
            onReject={handleGoBack}
          />
        );
      case 2:
        return <Summary chain={chain} txid={txid} />;
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className={classes.wrapper}>
        <CircularProgress />
      </div>
    );
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
