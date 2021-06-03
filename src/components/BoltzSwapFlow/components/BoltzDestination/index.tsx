import {
  createStyles,
  FormControlLabel,
  Grid,
  InputAdornment,
  makeStyles,
  Switch,
  TextField,
  Tooltip,
} from '@material-ui/core';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { BOLTZ_CREATE_SWAP_API_URL } from '../../../../api/boltzApiUrls';
import { boltzPairsMap } from '../../../../constants/boltzRates';
import {
  BoltzSwapResponse,
  RefundDetails,
} from '../../../../constants/boltzSwap';
import { useBoltzConfiguration } from '../../../../context/NetworkContext';
import { UtilsContext } from '../../../../context/UtilsContext';
import { isInvoiceValid } from '../../../../services/submarine/invoiceValidation';
import { generateKeys } from '../../../../services/submarine/keys';
import { selectUnit } from '../../../../store/boltz-slice';
import { useAppSelector } from '../../../../store/hooks';
import {
  selectReceiveAmount,
  selectReceiveAsset,
  selectSendAsset,
} from '../../../../store/swaps-slice';
import { addRefundDetailsToLocalStorage } from '../../../../utils/boltzRefund';
import svgIcons from '../../../../utils/svgIcons';
import BoltzAmount from '../BoltzAmount';
import BoltzSwapStep from '../BoltzSwapStep';
import Button from '../../../Button';
import DownloadRefundFile from '../../../DownloadRefundFile';
import QrCodeReader from '../../../QrCodeReader';

type BoltzDestinationProps = {
  proceedToNext: (swapDetails: BoltzSwapResponse) => void;
};

const useStyles = makeStyles(() =>
  createStyles({
    input: {
      borderRadius: 0,
      alignItems: 'start',
    },
    scanButton: {
      marginBottom: '1rem',
    },
    hintIcon: {
      height: '1.5rem',
    },
    endAdornment: {
      display: 'block',
    },
    downloadRefund: {
      marginTop: '1rem',
      '& .MuiFormControlLabel-label': {
        display: 'flex',
        alignItems: 'center',
      },
    },
    downloadRefundHint: {
      height: '1.25rem',
      marginLeft: '0.5rem',
    },
  })
);

const BoltzDestination = (props: BoltzDestinationProps): ReactElement => {
  const { proceedToNext } = props;
  const classes = useStyles();
  const receiveAmount = useAppSelector(selectReceiveAmount);
  const receiveCurrency = useAppSelector(selectReceiveAsset);
  const sendCurrency = useAppSelector(selectSendAsset);
  const units = useAppSelector(selectUnit);
  const [invoice, setInvoice] = useState('');
  const [error, setError] = useState('');
  const [downloadRefundFile, setDownloadRefundFile] = useState(true);
  const [loading, setLoading] = useState(false);
  const [browserScan, setBrowserScan] = useState(false);
  const {
    apiEndpoint,
    bitcoinConstants,
    litecoinConstants,
  } = useBoltzConfiguration();
  const [keys, setKeys] = useState<{ publicKey?: string; privateKey?: string }>(
    {}
  );
  const [refundDetails, setRefundDetails] = useState<RefundDetails | undefined>(
    undefined
  );
  const [displayedAmount, setDisplayedAmount] = useState('');
  const utilsContext = useContext(UtilsContext);
  const isMobileView = !!utilsContext?.isMobileView;

  const invoiceFieldText = `Invoice for ${displayedAmount} ${
    units[boltzPairsMap(receiveCurrency)].id
  }`;

  const invoiceValid = invoice => !invoice || isInvoiceValid(invoice);

  const nextEnabled = !!invoice && isInvoiceValid(invoice);

  useEffect(() => {
    const network =
      boltzPairsMap(receiveCurrency) === 'BTC'
        ? bitcoinConstants
        : litecoinConstants;
    setKeys(generateKeys(network));
  }, [sendCurrency, receiveCurrency, bitcoinConstants, litecoinConstants]);

  const createSwap = () => {
    const params = {
      type: 'submarine',
      pairId: `${boltzPairsMap(sendCurrency)}/${boltzPairsMap(
        receiveCurrency
      )}`,
      orderSide: 'sell',
      invoice: invoice,
      refundPublicKey: keys.publicKey,
      channel: {
        auto: true,
        private: false,
        inboundLiquidity: 25,
      },
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
          const refundData: RefundDetails = {
            swapId: data.id,
            currency: sendCurrency,
            timeoutBlockHeight: data.timeoutBlockHeight,
            redeemScript: data.redeemScript!,
            privateKey: keys.privateKey!,
            date: new Date(),
          };
          setRefundDetails(refundData);
          addRefundDetailsToLocalStorage(refundData);
          proceedToNext(data);
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

  return (
    <BoltzSwapStep
      title={
        <>
          Paste invoice to receive
          <br />
          <BoltzAmount
            amountInMainUnit={receiveAmount}
            currency={receiveCurrency}
            onDisplayedAmountChange={setDisplayedAmount}
          />
        </>
      }
      content={
        <Grid item container justify="center">
          {isMobileView && (
            <Button
              onClick={() => setBrowserScan(true)}
              startIcon={<img src={svgIcons.camera} alt="scan" />}
              className={classes.scanButton}
            >
              Scan invoice
            </Button>
          )}
          <TextField
            multiline
            fullWidth
            variant="outlined"
            aria-label={invoiceFieldText}
            rows={6}
            placeholder={invoiceFieldText}
            value={invoice}
            onChange={e => {
              setInvoice(e.target.value);
              setError('');
            }}
            error={!invoiceValid(invoice)}
            helperText={!invoiceValid(invoice) && 'Invalid invoice'}
            InputProps={{
              className: classes.input,
              endAdornment: (
                <InputAdornment position="end" className={classes.endAdornment}>
                  <Tooltip title="A lightning invoice is how you receive payments on the lightning network. Please use a Lightning wallet to create an invoice.">
                    <img
                      className={classes.hintIcon}
                      src={svgIcons.questionIcon}
                      alt="hint"
                    />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={downloadRefundFile}
                onChange={() => setDownloadRefundFile(oldValue => !oldValue)}
                name="downloadRefundFile"
                color="primary"
              />
            }
            className={classes.downloadRefund}
            label={
              <>
                Download refund file
                <Tooltip title="The refund details are stored in your browser. You can also save the file on your device.">
                  <img
                    className={classes.downloadRefundHint}
                    src={svgIcons.questionIcon}
                    alt="hint"
                  />
                </Tooltip>
              </>
            }
          />
          {downloadRefundFile && !!refundDetails && (
            <DownloadRefundFile details={refundDetails} />
          )}
          <QrCodeReader
            onClose={(invoice: string) => setInvoice(invoice.toLowerCase())}
            open={browserScan}
            setOpen={setBrowserScan}
          />
        </Grid>
      }
      errorMessage={error}
      mainButtonText="Next"
      mainButtonVisible
      onMainButtonClick={createSwap}
      mainButtonDisabled={!nextEnabled}
      mainButtonLoading={loading}
    />
  );
};

export default BoltzDestination;
