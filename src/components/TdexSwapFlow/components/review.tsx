import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchAndUnblindUtxos, greedyCoinSelector, IdentityType } from 'ldk';
import BrowserInjectOpenDex from './browserInject';
import { TradeType, Trade } from 'tdex-sdk';

import { ProviderByChain, ExplorerByChain, CurrencyToAssetByChain } from '../constants'
import CurrencyID from '../../../constants/currency';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(6),
  },
  terms: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    fontSize: '1.5rem',
    lineHeight: 'normal',
  },
  buttons: {
    marginTop: theme.spacing(6),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
}));



interface SwapTerms {
  assetToBeSent: string;
  amountToBeSent: number;
  assetToReceive: string;
  amountToReceive: number;
}

interface Props {
  installed: boolean;
  connected: boolean;
  chain: 'liquid' | 'regtest';
  terms: SwapTerms
  onTrade(txid: string): void;
  onReject(): void;
}

const Review: React.FC<Props> = ({
  onTrade,
  onReject,
  installed,
  connected,
  chain,
  terms,
}) => {
  const classes = useStyles();

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!installed) {
      return alert('Marina is not installed');
    }

    if (!connected) {
      return alert('User must enable this website to proceed');
    }

    try {
      setIsLoading(true);

      const explorer = ExplorerByChain[chain];
      const [provider] = ProviderByChain[chain];

      const identity = new BrowserInjectOpenDex({
        chain,
        type: IdentityType.Inject,
        value: {
          windowProvider: 'marina',
        },
      });

      const addrs = await identity.getAddresses();
      const utxos = await fetchAndUnblindUtxos(addrs, explorer);

      const trade = new Trade({
        providerUrl: provider,
        explorerUrl: explorer,
        coinSelector: greedyCoinSelector(),
        utxos,
      });


      const market = {
        baseAsset: CurrencyToAssetByChain[chain][CurrencyID.LIQUID_BTC],
        quoteAsset: CurrencyToAssetByChain[chain][CurrencyID.LIQUID_USDT]
      };
      const makeTrade = terms.assetToBeSent === CurrencyID.LIQUID_BTC ? (req) => trade.sell(req) : (req) => trade.buy(req);

      const txid = await trade.sell({
        market,
        amount: terms.amountToBeSent,
        asset: CurrencyToAssetByChain[chain][terms.assetToBeSent],
        identity,
      });

      onTrade(txid);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.instructions}>
        Review the terms of the trade before confirming
      </Typography>
      <Typography className={classes.terms}>📤 You send {terms.amountToBeSent} of {terms.assetToBeSent}</Typography>
      <br />
      <Typography className={classes.terms}>
        📥 You receive {terms.amountToReceive} of {terms.assetToReceive}
      </Typography>
      {!isLoading ? (
        <div className={classes.buttons}>
          <Button onClick={onReject}>Reject</Button>
          <Button variant="contained" color="primary" onClick={handleConfirm}>
            Accept
          </Button>
        </div>
      ) : (
        <CircularProgress />
      )}
    </div>
  );
};

export default Review;
