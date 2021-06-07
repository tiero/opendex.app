import { Link } from '@material-ui/core';
import { ReactElement, useMemo } from 'react';
import { boltzPairsMap } from '../../../../constants/boltzRates';
import { SwapStep } from '../../../../constants/swap';
import { useBlockExplorers } from '../../../../context/NetworkContext';
import { useAppDispatch, useAppSelector } from '../../../../store/hooks';
import { selectSendAsset, setSwapStep } from '../../../../store/swaps-slice';
import BoltzSwapResult from '../BoltzSwapResult';
import BoltzSwapStep from '../BoltzSwapStep';

type BoltzReverseSwapResultProps = {
  errorMessage?: string;
  transactionId?: string;
};

const BoltzReverseSwapResult = (
  props: BoltzReverseSwapResultProps
): ReactElement => {
  const { errorMessage, transactionId } = props;
  const dispatch = useAppDispatch();
  const explorers = useBlockExplorers();
  const sendCurrency = useAppSelector(selectSendAsset);

  const explorer = useMemo(() => explorers.get(boltzPairsMap(sendCurrency)), [
    sendCurrency,
    explorers,
  ]);

  const blockExplorerLink = `${explorer!.transaction}${transactionId}`;

  return (
    <BoltzSwapStep
      title=""
      content={
        <>
          <BoltzSwapResult errorMessage={errorMessage} />
          {!errorMessage && (
            <Link
              href={blockExplorerLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              See on block explorer
            </Link>
          )}
        </>
      }
      mainButtonVisible={!errorMessage}
      mainButtonText={'Swap again'}
      onMainButtonClick={() => dispatch(setSwapStep(SwapStep.CHOOSE_PAIR))}
    />
  );
};

export default BoltzReverseSwapResult;
