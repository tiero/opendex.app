import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AssetSelector from '../AssetSelector';
import Button from '../Button';
import CardComponent from '../Card';
import ErrorMessage from '../ErrorMessage';
import SwapButton from '../SwapButton';
import { SwapStep } from '../../constants/swap';
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

  const baseCurrency = CurrencyOptions.find(
    currency => currency.id === sendAsset
  )!;
  const quoteCurrency = CurrencyOptions.find(
    currency => currency.id === receiveAsset
  )!;

  timer(1000).subscribe(() => dispatch(setRates({})));
  const nextDisabled =
    !ratesLoaded ||
    Number(sendAmount) === 0 ||
    Number(receiveAmount) === 0 ||
    !swapProvider;

  const renderCryptoOptions = () => {
    return (
      <Grid container justify="center" direction="row" alignItems="center">
        <Grid item xs={12}>
          <AssetSelector
            label={'You send'}
            value={sendAmount}
            placeholder={'0.00'}
            onAmountChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => dispatch(setSendAmount(e.target.value))}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setSendAsset(currency.id))
            }
            selectedAsset={baseCurrency}
            loading={!ratesLoaded}
          />
        </Grid>
        <Grid item xs={12}>
          <SwapButton
            onClick={() => {
              dispatch(setSendAsset(quoteCurrency.id));
              dispatch(setReceiveAsset(baseCurrency.id));
            }}
            disabled={!ratesLoaded}
          />
        </Grid>
        <Grid item xs={12}>
          <AssetSelector
            label={'You receive'}
            value={receiveAmount}
            placeholder={'0.00'}
            onAmountChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => dispatch(setReceiveAmount(e.target.value))}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setReceiveAsset(currency.id))
            }
            selectedAsset={quoteCurrency}
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
