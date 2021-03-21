import { Currency, SwapProvider } from '../../constants/swap';
import { getSwapProvider } from '../../utils/swapProvider';

describe('getSwapProvider', () => {
  test('returns matching provider regardless of order of input assets', () => {
    expect(getSwapProvider(Currency.L_BTC, Currency.BTC)).toEqual(
      SwapProvider.TDEX
    );
    expect(getSwapProvider(Currency.BTC, Currency.L_BTC)).toEqual(
      SwapProvider.TDEX
    );
    expect(getSwapProvider(Currency.MONERO, Currency.BTC)).toEqual(
      SwapProvider.COMIT
    );
    expect(getSwapProvider(Currency.BTC, Currency.MONERO)).toEqual(
      SwapProvider.COMIT
    );
    expect(getSwapProvider(Currency.LIGHTNING_BTC, Currency.BTC)).toEqual(
      SwapProvider.BOLTZ
    );
    expect(getSwapProvider(Currency.BTC, Currency.LIGHTNING_BTC)).toEqual(
      SwapProvider.BOLTZ
    );
  });

  test('returns undefined if input assets are the same', () => {
    expect(getSwapProvider(Currency.USD_TETHER, Currency.USD_TETHER)).toEqual(
      undefined
    );
    expect(getSwapProvider(Currency.BTC, Currency.BTC)).toEqual(undefined);
  });

  test('returns undefined if no match', () => {
    expect(getSwapProvider(Currency.USD_TETHER, Currency.L_BTC)).toEqual(
      undefined
    );
    expect(getSwapProvider(Currency.LTC, Currency.BTC)).toEqual(undefined);
  });
});
