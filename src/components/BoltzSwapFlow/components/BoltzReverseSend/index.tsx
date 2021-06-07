import {
  createStyles,
  Grid,
  Link,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { ReactElement, useEffect, useMemo, useState } from 'react';
import {
  BoltzSwapResponse,
  StatusResponse,
  SwapUpdateEvent,
} from '../../../../constants/boltzSwap';
import { useAppSelector } from '../../../../store/hooks';
import { selectSendAsset } from '../../../../store/swaps-slice';
import svgIcons from '../../../../utils/svgIcons';
import BoltzSwapStep from '../BoltzSwapStep';
import Button from '../../../Button';
import DrawQrCode from '../../../DrawQrCode';
import { useBlockExplorers } from '../../../../context/NetworkContext';
import { boltzPairsMap } from '../../../../constants/boltzRates';
import { timeUntilExpiry } from '../../../../utils/invoiceDecoder';
import { getETALabelWithSeconds } from '../../../../services/refund/timestamp';

type BoltzReverseSendProps = {
  swapDetails?: BoltzSwapResponse;
  swapStatus?: StatusResponse;
};

const useStyles = makeStyles(() =>
  createStyles({
    qrCodeContainer: {
      marginTop: '1rem',
    },
    input: {
      borderRadius: 0,
    },
    titleContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titleIcon: {
      height: '1.5rem',
      marginLeft: '0.5rem',
    },
    buttonsContainer: {
      marginTop: '1rem',
    },
    link: {
      display: 'flex',
      alignItems: 'center',
    },
    linkIcon: {
      height: '1rem',
      marginLeft: '0.25rem',
    },
    expireContainer: {
      marginBottom: '1rem',
    },
  })
);

const BoltzReverseSend = (props: BoltzReverseSendProps): ReactElement => {
  const classes = useStyles();
  const explorers = useBlockExplorers();
  const { swapDetails, swapStatus } = props;
  const sendCurrency = useAppSelector(selectSendAsset);
  const [etaTimeDiffLabel, setEtaTimeDiffLabel] = useState('');
  const [etaLeft, setETALeft] = useState(timeUntilExpiry(swapDetails?.invoice));

  const explorer = useMemo(() => explorers.get(boltzPairsMap(sendCurrency)), [
    sendCurrency,
    explorers,
  ]);

  const blockExplorerLink = `${explorer!.address}${swapDetails?.lockupAddress}`;

  const mainButtonText =
    !!swapStatus && swapStatus.status === SwapUpdateEvent.TransactionMempool
      ? 'Waiting for one confirmation'
      : 'Waiting for transaction';

  useEffect(() => {
    setEtaTimeDiffLabel(getETALabelWithSeconds(etaLeft).label);

    if (etaLeft) {
      setTimeout(() => {
        setETALeft(etaLeft - 1);
      }, 1000);
    }
  }, [etaLeft]);

  const eta = etaLeft ? `Expires in ${etaTimeDiffLabel}` : 'Expired!';

  return (
    <BoltzSwapStep
      title={
        <span className={classes.titleContainer}>
          Pay this {sendCurrency} invoice
          <Tooltip title="A lightning invoice is how you receive payments on the lightning network. Please use a lightning wallet to pay the invoice.">
            <img
              className={classes.titleIcon}
              src={svgIcons.questionIcon}
              alt="hint"
            />
          </Tooltip>
        </span>
      }
      content={
        <>
          <Typography variant="body1" className={classes.expireContainer}>
            {eta}
          </Typography>
          <TextField
            fullWidth
            variant="outlined"
            multiline
            disabled
            value={swapDetails!.invoice}
            InputProps={{
              className: classes.input,
            }}
          />
          <Grid
            item
            container
            justify="space-between"
            className={classes.buttonsContainer}
          >
            <Link
              href={blockExplorerLink}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}
            >
              Check the lockup
              <Tooltip title="Check the address to which Boltz will lockup coins after the invoice is paid.">
                <img
                  className={classes.linkIcon}
                  src={svgIcons.questionIcon}
                  alt="hint"
                />
              </Tooltip>
            </Link>
            <Button
              variant="contained"
              onClick={() =>
                navigator.clipboard?.writeText(swapDetails!.invoice!)
              }
            >
              Copy Invoice
            </Button>
          </Grid>
          <Grid
            item
            container
            justify="center"
            className={classes.qrCodeContainer}
          >
            <DrawQrCode size={200} link={swapDetails!.invoice} />
          </Grid>
        </>
      }
      mainButtonVisible
      mainButtonDisabled
      mainButtonText={mainButtonText}
    />
  );
};

export default BoltzReverseSend;
