import { createStyles, Grid, makeStyles } from '@material-ui/core';
import React, { ReactElement, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import { from } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { BOLTZ_SWAP_STATUS_API_URL } from '../api/boltzApiUrls';
import BoltzChooseSwap from '../components/BoltzSwapFlow/components/BoltzChooseSwap';
import BoltzRefundResult from '../components/BoltzSwapFlow/components/BoltzRefundResult';
import BoltzRefundStatus from '../components/BoltzSwapFlow/components/BoltzRefundStatus';
import BoltzSwapStep from '../components/BoltzSwapFlow/components/BoltzSwapStep';
import CardComponent from '../components/Card';
import Title from '../components/Title';
import {
  RefundDetails,
  StatusResponse,
  SwapTransaction,
  SwapUpdateEvent,
} from '../constants/boltzSwap';
import { useBoltzConfiguration } from '../context/NetworkContext';
import Layout from '../layout/main';
import { timeDiffCalc } from '../services/refund/timestamp';
import {
  getBoltzSwapsFromLocalStorage,
  removeRefundDetailsFromLocalStorage,
  startRefund,
} from '../utils/boltzRefund';
import { startListening } from '../utils/boltzSwapStatus';
import { getErrorMessage } from '../utils/error';

type RefundStep = {
  content: ReactElement;
  buttonText: string;
  onButtonClick: () => void;
  buttonDisabled?: boolean;
};

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

const BoltzRefund = (): ReactElement => {
  const classes = useStyles();
  const boltzConfig = useBoltzConfiguration();
  const { apiEndpoint } = boltzConfig;
  const location = useLocation<{ swapId: string }>();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [refundDetails, setRefundDetails] =
    useState<RefundDetails | undefined>(undefined);
  const [swapStatus, setSwapStatus] =
    useState<StatusResponse | undefined>(undefined);
  const [swapTransaction, setSwapTransaction] =
    useState<SwapTransaction | undefined>(undefined);
  const [activeStep, setActiveStep] = useState(0);
  const [address, setAddress] = useState('');

  const reset = () => {
    setActiveStep(0);
    setErrorMessage('');
    setRefundDetails(undefined);
    setSwapStatus(undefined);
    setSwapTransaction(undefined);
    setAddress('');
  };

  const getEta = () => {
    const d1 = new Date();
    const d2 = new Date(swapTransaction!.timeoutEta! * 1000);
    const { label, value } = timeDiffCalc(d2, d1);
    return {
      label,
      eta: value > 0 ? value : 0,
    };
  };

  const swapComplete =
    swapStatus?.status === SwapUpdateEvent.TransactionClaimed;

  const refundButtonText = () => {
    if (swapTransaction?.error) {
      return swapTransaction.error;
    }
    if (swapComplete) {
      return 'Ok';
    }
    if (swapTransaction?.timeoutEta) {
      const { label } = getEta();
      return `Refund possible in ~ ${label}`;
    }
    return 'Start Refund';
  };

  const steps: RefundStep[] = [
    {
      content: (
        <BoltzChooseSwap
          setErrorMessage={setErrorMessage}
          setRefundDetails={setRefundDetails}
        />
      ),
      buttonText: 'Check Status',
      onButtonClick: () => checkStatus(refundDetails!.swapId),
      buttonDisabled: !refundDetails,
    },
    {
      content: (
        <BoltzRefundStatus
          swapStatus={swapStatus!}
          refundDetails={refundDetails!}
          address={address}
          setAddress={setAddress}
          onSwapTransactionChange={setSwapTransaction}
        />
      ),
      buttonText: refundButtonText(),
      buttonDisabled:
        !swapComplete &&
        (!swapTransaction ||
          !!swapTransaction.error ||
          !!swapTransaction.timeoutEta ||
          !address),
      onButtonClick: () => {
        if (swapComplete) {
          reset();
          return;
        }
        setLoading(true);
        startRefund(
          refundDetails!,
          address,
          swapTransaction!.transactionHex,
          boltzConfig
        ).subscribe({
          next: () => {},
          error: err => {
            setErrorMessage(getErrorMessage(err) || 'Refund failed');
            console.log('Refund failed:', err);
            setLoading(false);
            setActiveStep(prev => prev + 1);
          },
          complete: () => {
            removeRefundDetailsFromLocalStorage(refundDetails!.swapId);
            setLoading(false);
            setActiveStep(prev => prev + 1);
          },
        });
      },
    },
    {
      content: (
        <BoltzRefundResult
          swapId={refundDetails?.swapId}
          errorMessage={errorMessage}
        />
      ),
      buttonText: 'Refund Again',
      onButtonClick: reset,
    },
  ];

  const checkStatus = useMemo(
    () =>
      (swapId: string): void => {
        setLoading(true);
        from(
          fetch(BOLTZ_SWAP_STATUS_API_URL(apiEndpoint), {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify({ id: swapId }),
          })
        )
          .pipe(mergeMap(response => response.json()))
          .subscribe({
            next: status => {
              setSwapStatus(status);
              setLoading(false);
              setActiveStep(prev => prev + 1);
              if (
                SwapUpdateEvent.TransactionClaimed === status.status ||
                !!status.failureReason
              ) {
                return;
              }
              startListening(swapId, apiEndpoint, data => {
                setSwapStatus(data);
              });
            },
            error: err => {
              setErrorMessage(getErrorMessage(err) || 'Failed to get status');
              setLoading(false);
            },
          });
      },
    [apiEndpoint]
  );

  useEffect(() => {
    if (location.state?.swapId) {
      const refundDetails = getBoltzSwapsFromLocalStorage().find(
        swap => swap.swapId === location.state.swapId
      );
      if (!refundDetails) {
        return;
      }
      setRefundDetails(refundDetails);
      checkStatus(location.state.swapId);
    }
  }, [checkStatus, location.state?.swapId]);

  return (
    <Layout>
      <Grid container direction="column" wrap="nowrap" alignItems="center">
        <Title>CROSS-CHAIN DEX AGGREGATOR</Title>
        <Grid item container direction="column" wrap="nowrap">
          <CardComponent>
            <div className={classes.root}>
              <BoltzSwapStep
                title="Check status or refund"
                content={steps[activeStep].content}
                mainButtonVisible
                mainButtonDisabled={steps[activeStep].buttonDisabled}
                mainButtonLoading={loading}
                mainButtonText={steps[activeStep].buttonText}
                errorMessage={
                  activeStep === steps.length - 1 ? '' : errorMessage
                }
                onMainButtonClick={steps[activeStep].onButtonClick}
              />
            </div>
          </CardComponent>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default BoltzRefund;
