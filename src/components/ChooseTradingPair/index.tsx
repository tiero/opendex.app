import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AssetSelector from '../../components/AssetSelector';
import CardComponent from '../../components/Card';
import SwapButton from '../SwapButton';
import { CurrencyOption, CurrencyOptions } from '../../constants/swap';
import Button from '../Button';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBaseAsset, setQuoteAsset } from '../../store/swaps-slice';
import Skeleton from '@material-ui/lab/Skeleton';

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

export type ChooseTradingPairProps = {
  sendCurrencyValue: number;
  receiveCurrencyValue: number;
  onSendCurrencyChange: () => void;
  onNumberInputKeyPress: () => void;
  handleSwapClick: () => void;
  onReceiveAmountChange: () => void;
};

const ChooseTradingPair = (props: ChooseTradingPairProps) => {
  const classes = useStyles();
  const {
    sendCurrencyValue,
    onNumberInputKeyPress,
    handleSwapClick,
    receiveCurrencyValue,
    onReceiveAmountChange,
  } = props;
  const dispatch = useAppDispatch();
  const baseAsset = useAppSelector(state => state.swaps.baseAsset);
  const quoteAsset = useAppSelector(state => state.swaps.quoteAsset);

  const baseCurrency = CurrencyOptions.find(
    currency => currency.id === baseAsset
  )!;
  const quoteCurrency = CurrencyOptions.find(
    currency => currency.id === quoteAsset
  )!;

  const renderCryptoOptions = () => {
    return (
      <Grid container justify="center" direction="row" alignItems="center">
        <AssetSelector
          label={'You send'}
          value={sendCurrencyValue}
          onAmountChange={() => {}}
          onAssetChange={(currency: CurrencyOption) =>
            dispatch(setBaseAsset(currency.id))
          }
          onKeyPress={onNumberInputKeyPress}
          selectedAsset={baseCurrency}
        />
        <Grid item xs={12}>
          <Skeleton variant="text" height={40} animation={'wave'} />
        </Grid>
        <Grid item xs={12}>
          <SwapButton onClick={handleSwapClick} />
        </Grid>
        <Grid item xs={12}>
          <AssetSelector
            label={'You receive'}
            value={receiveCurrencyValue}
            onAmountChange={onReceiveAmountChange}
            onAssetChange={(currency: CurrencyOption) =>
              dispatch(setQuoteAsset(currency.id))
            }
            onKeyPress={onNumberInputKeyPress}
            selectedAsset={quoteCurrency}
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
        <Button variant="contained" color="primary">
          Next
        </Button>
      </div>
    </CardComponent>
  );
};

export default ChooseTradingPair;
