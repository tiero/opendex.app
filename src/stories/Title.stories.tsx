import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import Title, { TitleProps } from '../components/Title';

export default {
  title: 'Title',
  component: Title,
};

const Template: Story<TitleProps> = (args: TitleProps) => (
  <Title {...args}>CROSS-CHAIN DEX AGGREGATOR</Title>
);

export const Default = Template.bind({});
