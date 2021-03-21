import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AssetSelector from '../../components/AssetSelector';
import CardComponent from '../../components/Card';
import SwapButton from '../SwapButton';
import { CurrencyOption, CurrencyOptions } from '../../constants/swap';
import Button from '../Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  isRatesLoaded,
  selectBaseAmount,
  selectBaseAsset,
  selectQuoteAmount,
  selectQuoteAsset,
  setBaseAmount,
  setBaseAsset,
  setQuoteAmount,
  setQuoteAsset,
} from '../../store/swaps-slice';

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
  })
);

export type ChooseTradingPairProps = {};

const ChooseTradingPair = (props: ChooseTradingPairProps) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const baseAsset = useAppSelector(selectBaseAsset);
  const quoteAsset = useAppSelector(selectQuoteAsset);
  const baseAmount = useAppSelector(selectBaseAmount);
  const quoteAmount = useAppSelector(selectQuoteAmount);
  const ratesLoaded = useAppSelector(isRatesLoaded);

  const baseCurrency = CurrencyOptions.find(
    currency => currency.id === baseAsset
  )!;
  const quoteCurrency = CurrencyOptions.find(
    currency => currency.id === quoteAsset
  )!;

  const nextDisabled =
    !ratesLoaded || Number(baseAmount) === 0 || Number(quoteAmount) === 0;

  const renderCryptoOptions = () => {
    return (
      <Grid container justify="center" direction="row" alignItems="center">
        <Grid item xs={12}>
          <AssetSelector
            label={'You send'}
            value={baseAmount}
            placeholder={'0.00'}
            onAmountChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => dispatch(setBaseAmount(e.target.value))}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setBaseAsset(currency.id))
            }
            selectedAsset={baseCurrency}
            loading={!ratesLoaded}
          />
        </Grid>
        <Grid item xs={12}>
          <SwapButton
            onClick={() => {
              dispatch(setBaseAsset(quoteCurrency.id));
              dispatch(setQuoteAsset(baseCurrency.id));
            }}
            disabled={!ratesLoaded}
          />
        </Grid>
        <Grid item xs={12}>
          <AssetSelector
            label={'You receive'}
            value={quoteAmount}
            placeholder={'0.00'}
            onAmountChange={(
              e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
            ) => dispatch(setQuoteAmount(e.target.value))}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setQuoteAsset(currency.id))
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
        </Grid>
        <Button variant="contained" color="primary" disabled={nextDisabled}>
          Next
        </Button>
      </div>
    </CardComponent>
  );
};

export default ChooseTradingPair;
