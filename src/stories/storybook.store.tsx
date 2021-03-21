import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';

const store = {
  getState: () => {
    return {
      swaps: {
        baseAsset: 'ETH',
        quoteAsset: 'BTC',
        baseAmount: '0.01',
        quoteAmount: '0.002',
        rates: {},
      },
    };
  },
  subscribe: () => 0,
  dispatch: action('dispatch'),
};

export const storybookStore = story => (
  // @ts-ignore
  <Provider store={store}>{story()}</Provider>
);
