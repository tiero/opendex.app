import { CurrencyID } from './currency';

export enum SwapProvider {
  BOLTZ = 'Boltz',
  COMIT = 'Comit',
  TDEX = 'TDex',
}

export const swapProviders = {
  [SwapProvider.BOLTZ]: [
    [CurrencyID.BTC, CurrencyID.LIGHTNING_BTC],
    [CurrencyID.BTC, CurrencyID.LIGHTNING_LTC],
    [CurrencyID.ETH, CurrencyID.LIGHTNING_BTC],
    [CurrencyID.ETH_USDT, CurrencyID.LIGHTNING_BTC],
    [CurrencyID.LTC, CurrencyID.LIGHTNING_BTC],
    [CurrencyID.LTC, CurrencyID.LIGHTNING_LTC],
  ],
  [SwapProvider.COMIT]: [[CurrencyID.BTC, CurrencyID.MONERO]],
  [SwapProvider.TDEX]: [
    [CurrencyID.LIQUID_BTC, CurrencyID.LIQUID_USDT],
    [CurrencyID.LIQUID_BTC, CurrencyID.LIQUID_CAD],
  ],
};

export enum SwapStep {
  CHOOSE_PAIR,
  SWAP_FLOW,
}
