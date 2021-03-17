import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import SwapProvider, { SwapProviderProps } from '../components/SwapProvider';
import { SwapProvider as Provider } from '../constants/swap';

export default {
  title: 'Swap Provider',
  component: SwapProvider,
  argTypes: {
    provider: { defaultValue: Provider.BOLTZ },
  },
  parameters: {
    layout: 'padded',
  },
};

const Template: Story<SwapProviderProps> = (args: SwapProviderProps) => (
  <SwapProvider {...args} />
);

export const Default = Template.bind({});
