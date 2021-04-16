import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import AssetSelector from '../AssetSelector';
import Button from '../Button';
import CardComponent from '../Card';
import ErrorMessage from '../ErrorMessage';
import SwapButton from '../SwapButton';
import { SwapStep, SwapProvider } from '../../constants/swap';
import { CurrencyOptions, CurrencyOption } from '../../constants/currency';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  isRatesLoaded,
  selectSendAmount,
  selectSendAsset,
  selectReceiveAmount,
  selectReceiveAsset,
  selectSwapProvider,
  setSendAmount,
  setSendAsset,
  setReceiveAmount,
  setReceiveAsset,
  setRates,
  setSwapStep,
} from '../../store/swaps-slice';
import { timer } from 'rxjs';
import { RatesFetcher } from '../../constants/rates';
import ExampleFetcherWithInitalizer from '../../constants/rates_example';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
      flex: 1,
    },
    content: {
      padding: '2rem',
    },
    text: {
      marginBottom: '1rem',
      fontSize: '1.5rem',
      lineHeight: 'normal',
      letterSpacing: '1px',
    },
    amount: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '1rem',
    },
    right: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    amountscontainer: {
      marginTop: '1rem',
    },
    errorMessageContainer: {
      minHeight: '1.5rem',
      marginTop: '1rem',
    },
  })
);

export type ChooseTradingPairProps = {};

const ChooseTradingPair = (_props: ChooseTradingPairProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const sendAsset = useAppSelector(selectSendAsset);
  const receiveAsset = useAppSelector(selectReceiveAsset);
  const sendAmount = useAppSelector(selectSendAmount);
  const receiveAmount = useAppSelector(selectReceiveAmount);
  const swapProvider = useAppSelector(selectSwapProvider);
  const ratesLoaded = useAppSelector(isRatesLoaded);

  const [tdexFetcher, setTdexFetcher] = useState<RatesFetcher | undefined>();

  const sendCurrency = CurrencyOptions.find(
    currency => currency.id === sendAsset
  )!;
  const receiveCurrency = CurrencyOptions.find(
    currency => currency.id === receiveAsset
  )!;

  timer(1000).subscribe(() => dispatch(setRates({})));
  const nextDisabled =
    !ratesLoaded ||
    Number(sendAmount) === 0 ||
    Number(receiveAmount) === 0 ||
    !swapProvider;

  useEffect(() => {
    (async () => {
      // start a new Example rates fetcher
      // This is an example of stateful implementation with async
      // instantiation using the The Functional Options Pattern
      // https://betterprogramming.pub/how-to-write-an-async-class-constructor-in-typescript-javascript-7d7e8325c35e

      const tdexFetcher = new ExampleFetcherWithInitalizer(
        await ExampleFetcherWithInitalizer.WithCustomInitializer()
      );

      setTdexFetcher(tdexFetcher);
    })();
  }, []);

  let ratesFetcher;
  switch (swapProvider) {
    case SwapProvider.TDEX:
      ratesFetcher = tdexFetcher;
      break;
    case SwapProvider.BOLTZ:
    case SwapProvider.COMIT:
    default:
      break;
  }

  const onSendAmountChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    dispatch(setSendAmount(value));

    // preview other amount
    if (ratesFetcher) {
      const receiveValue = await ratesFetcher.PreviewGivenSend({
        amount: Number(value),
        currency: sendCurrency.id,
      });
      dispatch(setReceiveAmount(receiveValue.amountWithFees.amount.toString()));
    }
  };

  const onReceiveAmountChange = async (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const value = e.target.value;
    dispatch(setReceiveAmount(value));

    // preview other amount
    if (ratesFetcher) {
      const sendValue = await ratesFetcher.PreviewGivenReceive({
        amount: Number(value),
        currency: receiveCurrency.id,
      });
      dispatch(setSendAmount(sendValue.amountWithFees.amount.toString()));
    }
  };

  const renderCryptoOptions = () => {
    return (
      <Grid container justify="center" direction="row" alignItems="center">
        <Grid item xs={12}>
          <AssetSelector
            label={'You send'}
            value={sendAmount}
            placeholder={'0.00'}
            onAmountChange={onSendAmountChange}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setSendAsset(currency.id))
            }
            selectedAsset={sendCurrency}
            loading={!ratesLoaded}
          />
        </Grid>
        <Grid item xs={12}>
          <SwapButton
            onClick={() => {
              dispatch(setSendAsset(receiveCurrency.id));
              dispatch(setReceiveAsset(sendCurrency.id));
            }}
            disabled={!ratesLoaded}
          />
        </Grid>
        <Grid item xs={12}>
          <AssetSelector
            label={'You receive'}
            value={receiveAmount}
            placeholder={'0.00'}
            onAmountChange={onReceiveAmountChange}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setReceiveAsset(currency.id))
            }
            selectedAsset={receiveCurrency}
            loading={!ratesLoaded}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <CardComponent>
      <div className={classes.root}>
        <Grid container justify="flex-start" className={classes.content}>
          <Typography className={classes.text} component="h2" align="left">
            Swap
          </Typography>
          {renderCryptoOptions()}
          <Grid
            item
            container
            justify="center"
            className={classes.errorMessageContainer}
          >
            {!swapProvider && ratesLoaded && (
              <ErrorMessage message="Trading pair not supported" />
            )}
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          disabled={nextDisabled}
          onClick={() => dispatch(setSwapStep(SwapStep.SWAP_FLOW))}
        >
          Next
        </Button>
      </div>
    </CardComponent>
  );
};

export default ChooseTradingPair;
