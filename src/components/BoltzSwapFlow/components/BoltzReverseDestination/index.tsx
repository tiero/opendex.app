import {
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Switch,
  TextField,
  Tooltip,
} from '@material-ui/core';
import BigNumber from 'bignumber.js';
import { crypto } from 'bitcoinjs-lib';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { BOLTZ_CREATE_SWAP_API_URL } from '../../../../api/boltzApiUrls';
import { boltzPairsMap } from '../../../../constants/boltzRates';
import {
  BoltzSwapResponse,
  ClaimDetails,
} from '../../../../constants/boltzSwap';
import { useBoltzConfiguration } from '../../../../context/NetworkContext';
import { isAddressValid } from '../../../../services/reverse/addressValidation';
import {
  generateKeys,
  getHexString,
} from '../../../../services/submarine/keys';
import { randomBytes } from '../../../../services/submarine/randomBytes';
import { useAppSelector } from '../../../../store/hooks';
import {
  selectReceiveAsset,
  selectSendAmount,
  selectSendAsset,
} from '../../../../store/swaps-slice';
import svgIcons from '../../../../utils/svgIcons';

import BoltzSwapStep from '../BoltzSwapStep';

type BoltzReverseDestinationProps = {
  proceedToNext: (
    swapDetails: BoltzSwapResponse,
    claimDetails: ClaimDetails
  ) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      borderRadius: 0,
      alignItems: 'start',
    },
    instant: {
      marginTop: '1rem',
      '& .MuiFormControlLabel-label': {
        display: 'flex',
        alignItems: 'center',
      },
    },
    instantHint: {
      height: '1.25rem',
      marginLeft: '0.5rem',
    },
  })
);

const BoltzReverseDestination = (
  props: BoltzReverseDestinationProps
): ReactElement => {
  const { proceedToNext } = props;
  const classes = useStyles();
  const { apiEndpoint, bitcoinConstants, litecoinConstants } =
    useBoltzConfiguration();
  const receiveCurrency = useAppSelector(selectReceiveAsset);
  const sendAmount = useAppSelector(selectSendAmount);
  const sendCurrency = useAppSelector(selectSendAsset);
  const [address, setAddrerss] = useState('');
  const [instant, setInstant] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [keys, setKeys] = useState<{ publicKey?: string; privateKey?: string }>(
    {}
  );
  const network = useMemo(
    () =>
      boltzPairsMap(receiveCurrency) === 'BTC'
        ? bitcoinConstants
        : litecoinConstants,
    [bitcoinConstants, litecoinConstants, receiveCurrency]
  );

  const placeholder = `${receiveCurrency} receiving address`;

  useEffect(() => {
    setKeys(generateKeys(network));
  }, [network]);

  const createSwap = () => {
    const preImage = randomBytes(32);
    const pairId = `${boltzPairsMap(sendCurrency)}/${boltzPairsMap(
      receiveCurrency
    )}`;
    const params = {
      type: 'reverseSubmarine',
      pairId: pairId === 'BTC/LTC' ? 'LTC/BTC' : pairId,
      orderSide: pairId === 'BTC/LTC' ? 'buy' : 'sell',
      claimPublicKey: keys.publicKey || '',
      preimageHash: getHexString(crypto.sha256(preImage)),
      invoiceAmount: new BigNumber(sendAmount).multipliedBy(10 ** 8).toNumber(),
    };

    const claimDetails: ClaimDetails = {
      preImage: preImage,
      address: address,
      instantSwap: instant,
      privateKey: keys.privateKey || '',
    };

    const errorMessage = 'Something went wrong. Please try again.';
    setLoading(true);
    fetch(BOLTZ_CREATE_SWAP_API_URL(apiEndpoint), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(params),
    })
      .then(async response => {
        const data: BoltzSwapResponse = await response.json();
        setLoading(false);

        if (response.status === 201) {
          setError('');
          proceedToNext(data, claimDetails);
          return;
        }
        const message = data.error || errorMessage;
        setError(message);
      })
      .catch(() => {
        setError(errorMessage);
        setLoading(false);
      });
  };

  const addressInvalid = !!address && !isAddressValid(address, network);

  return (
    <BoltzSwapStep
      title={
        <>
          Paste a {receiveCurrency} address you'd like to receive the funds on
        </>
      }
      content={
        <Grid item container justify="center">
          <TextField
            multiline
            fullWidth
            variant="outlined"
            aria-label={'receive-address'}
            rows={3}
            placeholder={placeholder}
            value={address}
            onChange={e => {
              setAddrerss(e.target.value);
              setError('');
            }}
            InputProps={{
              className: classes.input,
            }}
            error={addressInvalid}
            helperText={addressInvalid && 'Invalid address'}
          />
          <FormControlLabel
            control={
              <Switch
                checked={instant}
                onChange={() => setInstant(oldValue => !oldValue)}
                name="instantSwap"
                color="primary"
              />
            }
            className={classes.instant}
            label={
              <>
                Swap instantly
                <Tooltip title="Enabling swap instantly means you agree to accept a 0-conf transaction from Boltz, which results in an instant swap.">
                  <img
                    className={classes.instantHint}
                    src={svgIcons.questionIcon}
                    alt="hint"
                  />
                </Tooltip>
              </>
            }
          />
        </Grid>
      }
      errorMessage={error}
      mainButtonText="Next"
      mainButtonVisible
      onMainButtonClick={createSwap}
      mainButtonDisabled={!address || !isAddressValid(address, network)}
      mainButtonLoading={loading}
    />
  );
};

export default BoltzReverseDestination;
