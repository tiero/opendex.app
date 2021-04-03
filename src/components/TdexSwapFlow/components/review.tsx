import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import { fetchAndUnblindUtxos, greedyCoinSelector, IdentityType } from 'ldk';
import BrowserInjectOpenDex from './browserInject';
import { TradeType, Trade } from 'tdex-sdk';

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

interface Props {
  installed: boolean;
  connected: boolean;
  chain: 'liquid' | 'regtest';
  onTrade(txid: string): void;
  onReject(): void;
}

const Review: React.FC<Props> = ({
  onTrade,
  onReject,
  installed,
  connected,
  chain,
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

    const ESPLORA_API_URL = 'http://localhost:3001';
    const TDEX_PROVIDER_URL = 'http://localhost:9945';

    const market = {
      baseAsset:
        '5ac9f65c0efcc4775e0baec4ec03abdde22473cd3cf33c0419ca290e0751b225',
      quoteAsset:
        '4e10f035e3127235c4842cc9ba7bc9cf4fe9be350edf940dc78f46d7efea5850',
    };

    try {
      setIsLoading(true);

      const identity = new BrowserInjectOpenDex({
        chain,
        type: IdentityType.Inject,
        value: {
          windowProvider: 'marina',
        },
      });

      const addrs = await identity.getAddresses();
      const utxos = await fetchAndUnblindUtxos(addrs, ESPLORA_API_URL);

      const trade = new Trade({
        providerUrl: TDEX_PROVIDER_URL,
        explorerUrl: ESPLORA_API_URL,
        coinSelector: greedyCoinSelector(),
        utxos,
      });

      const txid = await trade.sell({
        market,
        amount: 6000,
        asset: market.baseAsset,
        identity,
      });

      setIsLoading(false);
      onTrade(txid);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <div className={classes.root}>
      <Typography className={classes.instructions}>
        Review the terms of the trade before confirming
      </Typography>
      <Typography className={classes.terms}>📤 You send X of LBTC</Typography>
      <br />
      <Typography className={classes.terms}>
        📥 You receive X of USDT
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
