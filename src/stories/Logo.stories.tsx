import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import Logo, { OpendexLogoProps } from '../components/Logo';

export default {
  title: 'Logo',
  component: Logo,
};

const Template: Story<OpendexLogoProps> = (args: OpendexLogoProps) => (
  <Logo {...args} />
);

export const Opendex = Template.bind({});
