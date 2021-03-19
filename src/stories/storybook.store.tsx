import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';

const store = {
  getState: () => {
    return {
      swaps: {
        baseAsset: 'ETH',
        quoteAsset: 'BTC',
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
