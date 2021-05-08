import { SwapProvider, swapProviders } from '../constants/swap';
import Currency from '../constants/currency';

export const getSwapProvider = (
  sendAsset: Currency,
  receiveAsset: Currency
): SwapProvider | undefined => {
  for (const [key, value] of Object.entries(swapProviders)) {
    if (
      value.some(
        pair =>
          pair.includes(sendAsset) &&
          pair.includes(receiveAsset) &&
          (sendAsset !== receiveAsset || pair[0] === pair[1])
      )
    ) {
      return key as SwapProvider;
    }
  }
};
