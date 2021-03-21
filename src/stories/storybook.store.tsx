import React from 'react';
import { Provider } from 'react-redux';
import { action } from '@storybook/addon-actions';
import { initialState } from '../store/swaps-slice';

const store = {
  getState: () => {
    return {
      swaps: {
        ...initialState,
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
