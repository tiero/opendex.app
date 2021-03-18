import React from 'react';
import AssetSelector from '../components/AssetSelector';
import { CurrencyOptions } from '../constants/swap';

export default {
  title: 'AssetSelector',
  component: AssetSelector,
  argTypes: {
    label: { defaultValue: 'You send' },
    value: { defaultValue: undefined },
    selectedAsset: { defaultValue: CurrencyOptions[0] },
    onAmountChange: { defaultValue: () => {} },
    onAssetChange: { defaultValue: () => {} },
    onKeyPress: { defaultValue: () => {} },
  },
};

const Template = args => <AssetSelector {...args} />;

export const YouSend = Template.bind({});
YouSend.args = {};

export const YouReceive = Template.bind({});
YouReceive.args = {
  label: 'You receive',
  selectedAsset: CurrencyOptions[2],
};
