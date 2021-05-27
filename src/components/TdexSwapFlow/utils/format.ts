import BigNumber from 'bignumber.js';
import CurrencyID from '../../../constants/currency';
import { CurrencyPair } from '../../../constants/rates';
import { CurrencyPairKey, LCAD_LBTC, USDT_LBTC } from '../constants';

const defaultPrecision = 8;

export function toSatoshi(fractional: number, precision: number = defaultPrecision): number {
  return new BigNumber(fractional).multipliedBy(new BigNumber(10).exponentiatedBy(precision)).toNumber();
}

export function fromSatoshi(
  sats: number,
  precision: number = defaultPrecision
): number {
  return new BigNumber(sats).dividedBy(new BigNumber(10).exponentiatedBy(precision)).toNumber();
}

export function fromKey(x: CurrencyPairKey): CurrencyPair {
  const [currencyA, currencyB] = x.split("#");
  return [currencyA as CurrencyID, currencyB as CurrencyID];
}


export function toKeys(x: CurrencyPair): CurrencyPairKey[] {
  const [currencyA, currencyB] = x;
  return [`${currencyA}#${currencyB}`, `${currencyB}#${currencyA}`];
}
