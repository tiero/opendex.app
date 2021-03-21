import { Currency, SwapProvider, swapProviders } from '../constants/swap';

export const getSwapProvider = (
  baseAsset: Currency,
  quoteAsset: Currency
): SwapProvider | undefined => {
  for (const [key, value] of Object.entries(swapProviders)) {
    if (
      value.some(
        pair =>
          pair.includes(baseAsset) &&
          pair.includes(quoteAsset) &&
          (baseAsset !== quoteAsset || pair[0] === pair[1])
      )
    ) {
      return key as SwapProvider;
    }
  }
};
