import React, { ReactElement, useCallback, useMemo, useState } from 'react';
import {
  BoltzSwapResponse,
  StatusResponse,
  SwapUpdateEvent,
} from '../../../../constants/boltzSwap';
import { useBoltzConfiguration } from '../../../../context/NetworkContext';
import { removeRefundDetailsFromLocalStorage } from '../../../../utils/boltzRefund';
import { isFinal, startListening } from '../../../../utils/boltzSwapStatus';
import BoltzSubmarineDestination from '../BoltzSubmarineDestination';
import BoltzSubmarineSend from '../BoltzSubmarineSend';
import BoltzSubmarineSwapStatus from './../../components/BoltzSubmarineSwapStatus';

const BoltzSubmarineSwap = (): ReactElement => {
  const [activeStep, setActiveStep] = useState(0);
  const [swapDetails, setSwapDetails] = useState<BoltzSwapResponse | undefined>(
    undefined
  );
  const [swapStatus, setSwapStatus] = useState<StatusResponse | undefined>(
    undefined
  );
  const { apiEndpoint } = useBoltzConfiguration();

  const proceedToNext = useCallback(
    () => setActiveStep(oldValue => oldValue + 1),
    [setActiveStep]
  );

  const destinationComplete = useMemo(
    () => (swapDetails: BoltzSwapResponse) => {
      setSwapDetails(swapDetails);
      proceedToNext();
      startListening(swapDetails.id, apiEndpoint, (data, stream) => {
        setSwapStatus(data);
        if (isFinal(data)) {
          stream.close();
          if (SwapUpdateEvent.TransactionClaimed === data.status) {
            removeRefundDetailsFromLocalStorage(swapDetails.id);
          }
        }
      });
    },
    [proceedToNext, apiEndpoint]
  );

  const steps = [
    <BoltzSubmarineDestination proceedToNext={destinationComplete} />,
    <BoltzSubmarineSend
      swapDetails={swapDetails!}
      swapStatus={swapStatus}
      proceedToNext={proceedToNext}
    />,
    <BoltzSubmarineSwapStatus
      swapStatus={swapStatus!}
      swapId={swapDetails?.id}
    />,
  ];

  return steps[activeStep];
};

export default BoltzSubmarineSwap;
