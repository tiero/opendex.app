import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import ChooseTradingPair, {
  ChooseTradingPairProps,
} from '../components/ChooseTradingPair';
import { CurrencyOptions } from '../constants/swap';

export default {
  title: 'Choose Trading Pair',
  component: ChooseTradingPair,
  argTypes: {
    sendCurrencyType: { defaultValue: CurrencyOptions[0] },
    receiveCurrencyType: { defaultValue: CurrencyOptions[3] },
    sendCurrencyValue: { defaultValue: 1 },
    receiveCurrencyValue: { defaultValue: 0 },
    handleSwapClick: { defaultValue: () => {} },
  },
};

const Template: Story<ChooseTradingPairProps> = (
  args: ChooseTradingPairProps
) => <ChooseTradingPair {...args} />;

export const Default = Template.bind({});
Default.parameters = {
  layout: 'centered',
};
