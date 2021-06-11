import { createStyles, makeStyles } from '@material-ui/core';
import React, { ReactElement } from 'react';
import CurrencyID from '../../constants/currency';
import { useAppSelector } from '../../store/hooks';
import { selectReceiveAsset, selectSendAsset } from '../../store/swaps-slice';
import BoltzReverseSwap from './components/BoltzReverseSwap';
import BoltzSubmarineSwap from './components/BoltzSubmarineSwap';

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      display: 'flex',
      'flex-direction': 'column',
      'justify-content': 'space-between',
      flex: 1,
      minHeight: 440,
    },
  })
);

const BoltzSwapFlow = (): ReactElement => {
  const classes = useStyles();
  const receiveCurrency = useAppSelector(selectReceiveAsset);
  const sendCurrency = useAppSelector(selectSendAsset);

  const component = () => {
    if (
      [CurrencyID.BTC, CurrencyID.LTC].includes(sendCurrency) &&
      [CurrencyID.LIGHTNING_BTC, CurrencyID.LIGHTNING_LTC].includes(
        receiveCurrency
      )
    ) {
      return <BoltzSubmarineSwap />;
    }
    if (
      [CurrencyID.LIGHTNING_BTC, CurrencyID.LIGHTNING_LTC].includes(
        sendCurrency
      ) &&
      [CurrencyID.BTC, CurrencyID.LTC].includes(receiveCurrency)
    ) {
      return <BoltzReverseSwap />;
    }
  };

  return (
    <div className={classes.root}>
      {component() || <div>Not implemented</div>}
    </div>
  );
};

export default BoltzSwapFlow;
