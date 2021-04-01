import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { RootState } from '../../store';

interface Props { }

const TdexSwapFlow: React.FC<Props> = () => {
  const {
    baseAmount,
    baseAsset,
    quoteAmount,
    quoteAsset
  } = useAppSelector((state: RootState) => state.swaps);

  return (
    <>
      <TdexSteps>

      </TdexSteps>
      <button onClick={console.log}> Connect with Marina </button>
      <p>or</p>
      <button onClick={console.log}> In-Browser wallet (not reccomended)</button>

    </>
  );

};

export default TdexSwapFlow;
