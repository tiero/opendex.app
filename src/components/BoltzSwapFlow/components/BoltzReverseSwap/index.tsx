import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import {
  BoltzSwapResponse,
  ClaimDetails,
  StatusResponse,
  SwapUpdateEvent,
} from '../../../../constants/boltzSwap';
import {
  addReverseSwapDetailsToLocalStorage,
  claimSwap,
} from '../../../../utils/boltzReverseSwap';
import { useBoltzConfiguration } from '../../../../context/NetworkContext';
import { startListening } from '../../../../utils/boltzSwapStatus';
import BoltzReverseDestination from './../../components/BoltzReverseDestination';
import BoltzReverseSend from './../../components/BoltzReverseSend';
import BoltzReverseSwapResult from './../../components/BoltzReverseSwapResult';
import { useAppSelector } from '../../../../store/hooks';
import { selectReceiveAsset } from '../../../../store/swaps-slice';
import { boltzPairsMap } from '../../../../constants/boltzRates';
import { removeRefundDetailsFromLocalStorage } from '../../../../utils/boltzRefund';

const BoltzReverseSwap = (): ReactElement => {
  const receiveCurrency = useAppSelector(selectReceiveAsset);
  const [activeStep, setActiveStep] = useState(0);
  const [claimTransactionId, setClaimTransactionId] = useState('');
  const [swapDetails, setSwapDetails] =
    useState<BoltzSwapResponse | undefined>(undefined);
  const [swapStatus, setSwapStatus] =
    useState<StatusResponse | undefined>(undefined);
  const [error, setError] = useState('');
  const { apiEndpoint, bitcoinConstants, litecoinConstants } =
    useBoltzConfiguration();

  const network = useMemo(
    () =>
      boltzPairsMap(receiveCurrency) === 'BTC'
        ? bitcoinConstants
        : litecoinConstants,
    [bitcoinConstants, litecoinConstants, receiveCurrency]
  );

  const proceedToNext = useCallback(
    () => setActiveStep(oldValue => oldValue + 1),
    [setActiveStep]
  );

  const destinationComplete = useMemo(
    () => (swapDetails: BoltzSwapResponse, claimDetails: ClaimDetails) => {
      addReverseSwapDetailsToLocalStorage({
        ...claimDetails,
        swapId: swapDetails.id,
        redeemScript: swapDetails.redeemScript!,
      });
      setSwapDetails(swapDetails);
      proceedToNext();
      startListening(swapDetails.id, apiEndpoint, (data, stream) => {
        setSwapStatus(data);
        if (
          (claimDetails.instantSwap &&
            SwapUpdateEvent.TransactionMempool === data.status) ||
          SwapUpdateEvent.TransactionConfirmed === data.status
        ) {
          claimSwap(
            claimDetails,
            data,
            swapDetails,
            receiveCurrency,
            network,
            apiEndpoint,
            transaction => setClaimTransactionId(transaction.getId())
          ).subscribe({
            next: () => {},
            error: err => {
              console.log(err);
              stream.close();
              setError('Failed to claim the funds.');
              proceedToNext();
            },
            complete: () => {
              stream.close();
              proceedToNext();
              removeRefundDetailsFromLocalStorage(swapDetails.id);
            },
          });
        } else if (data.failureReason) {
          stream.close();
        }
      });
    },
    [proceedToNext, apiEndpoint, network, receiveCurrency]
  );

  const steps = [
    <BoltzReverseDestination proceedToNext={destinationComplete} />,
    <BoltzReverseSend swapDetails={swapDetails} swapStatus={swapStatus} />,
    <BoltzReverseSwapResult
      errorMessage={error || swapStatus?.failureReason}
      transactionId={claimTransactionId}
    />,
  ];

  return steps[activeStep];
};

export default BoltzReverseSwap;
