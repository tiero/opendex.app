import { Grid, Typography } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import React from 'react';
import AssetSelector from '../../components/AssetSelector';
import CardComponent from '../../components/Card';
import SwapButton from '../SwapButton';
import { CurrencyOption } from '../../constants/swap';
import Button from '../Button';

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
  receiveCurrencyType: CurrencyOption;
  sendCurrencyType: CurrencyOption;
  sendCurrencyValue: number;
  receiveCurrencyValue: number;
  onSendCurrencyChange: () => void;
  onSendAssetChange: () => void;
  onNumberInputKeyPress: () => void;
  handleSwapClick: () => void;
  onReceiveCurrencyChange: () => void;
  onReceiveAssetChange: () => void;
};

const ChooseTradingPair = (props: ChooseTradingPairProps) => {
  const classes = useStyles();
  const {
    sendCurrencyValue,
    onSendCurrencyChange,
    onSendAssetChange,
    onNumberInputKeyPress,
    sendCurrencyType,
    handleSwapClick,
    receiveCurrencyValue,
    onReceiveCurrencyChange,
    onReceiveAssetChange,
    receiveCurrencyType,
  } = props;

  const renderCryptoOptions = () => {
    return (
      <Grid container justify="center" direction="row" alignItems="center">
        <AssetSelector
          label={'You send'}
          defaultValue={2.3}
          value={sendCurrencyValue}
          onAmountChange={onSendCurrencyChange}
          onAssetChange={onSendAssetChange}
          onKeyPress={onNumberInputKeyPress}
          selectedAsset={sendCurrencyType}
        />
        <Grid item xs={12}>
          <SwapButton onClick={handleSwapClick} />
        </Grid>
        <Grid item xs={12}>
          <AssetSelector
            label={'You receive'}
            defaultValue={3.2}
            value={receiveCurrencyValue}
            onAmountChange={onReceiveCurrencyChange}
            onAssetChange={onReceiveAssetChange}
            onKeyPress={onNumberInputKeyPress}
            selectedAsset={receiveCurrencyType}
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
