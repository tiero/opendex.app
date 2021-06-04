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
import { seletctBestProvider } from '../../store/tdex-slice';

import { SwapStep } from '../../constants/swap';

interface Props { }

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

enum Steps {
  Connect,
  Review,
  Summary,
}

const TdexSwapFlow: React.FC<Props> = () => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(Steps.Connect);

  const { sendAsset, receiveAsset, sendAmount, receiveAmount } = useAppSelector(
    (state: RootState) => state.swaps
  );
  const bestProvider = useAppSelector(seletctBestProvider);

  if (!bestProvider) throw new Error('TDEX: no provider has been selected');

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

        if (activeStep > Steps.Connect) return;
        const isEnabled = await marina.isEnabled();
        setConnected(isEnabled);

        if (isEnabled && activeStep === Steps.Connect) {
          // skip directly to Review step
          setActiveStep(Steps.Review);
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
    setActiveStep(Steps.Summary);
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
      case Steps.Connect:
        return (
          <Connect
            installed={installed}
            connected={connected}
            onConnect={handleNext}
          />
        );
      case Steps.Review:
        return (
          <Review
            chain={chain}
            providerWithMarket={bestProvider}
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
      case Steps.Summary:
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

  const { name, endpoint } = bestProvider.provider;
  return (
    <div className={classes.wrapper}>
      <TdexSteps steps={steps} activeStep={activeStep} />
      <div>{getStepContent()}</div>
      <div className={classes.info}>
        <p>
          {' '}
          {`Status: ${connected ? `Connected - Network: ${chain}` : `Not Connected`
            }`}
        </p>
        <p>
          Market provided by
          {name}
          <br />
          {endpoint.substring(0, 12)}...
          {endpoint.substring(endpoint.length - 12, endpoint.length)}
        </p>
      </div>
    </div>
  );
};

export default TdexSwapFlow;
