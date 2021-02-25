import { BigNumber } from 'ethers';

/**
 * Formats from 10 ** -8 to an arbitrary amount of decimals
 *
 * @param {number} amount
 * @param {number} decimals
 *
 * @returns {BigNumber}
 */
export const formatTokenAmount = (amount, decimals) => {
  const amountBn = BigNumber.from(amount);

  if (decimals === 8) {
    return amountBn;
  } else {
    const exponent = BigNumber.from(10).pow(BigNumber.from(Math.abs(decimals - 8)));

    if (decimals > 8) {
      return amountBn.mul(exponent);
    } else {
      return amountBn.div(exponent);
    }
  }
};

/**
 * Normalizes an amount of tokens with arbitrary decimals to 10 ** -8
 *
 * @param {number} amount
 * @param {number} decimals
 *
 * @returns {number}
 */
export const normalizeTokenAmount = (amount, decimals) => {
  if (decimals === 8) {
    return amount.toNumber();
  } else {
    const exponent = BigNumber.from(10).pow(BigNumber.from(Math.abs(decimals - 8)));

    if (decimals > 8) {
      return amount.div(exponent).toNumber();
    } else {
      return amount.mul(exponent).toNumber();
    }
  }
}
