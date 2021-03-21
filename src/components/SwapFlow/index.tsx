import React, { ReactElement } from 'react';
import { SwapProvider } from '../../constants/swap';
import { useAppSelector } from '../../store/hooks';
import { selectSwapProvider } from '../../store/swaps-slice';
import BoltzSwapFlow from '../BoltzSwapFlow';
import CardComponent from '../Card';
import ComitSwapFlow from '../ComitSwapFlow';
import TdexSwapFlow from '../TdexSwapFlow';

const flows = {
  [SwapProvider.BOLTZ]: <BoltzSwapFlow />,
  [SwapProvider.COMIT]: <ComitSwapFlow />,
  [SwapProvider.TDEX]: <TdexSwapFlow />,
};

const SwapFlow = (): ReactElement => {
  const swapProvider = useAppSelector(selectSwapProvider);

  return <CardComponent>{flows[swapProvider!]}</CardComponent>;
};

export default SwapFlow;
