import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import HomePage, { HomePageProps } from '../pages/home';
import { storybookStore } from './storybook.store';

export default {
  title: 'Homepage',
  component: HomePage,
  decorators: [storybookStore],
};

const Template: Story<HomePageProps> = (args: HomePageProps) => (
  <HomePage {...args} />
);

export const Default = Template.bind({});
Default.parameters = {
  layout: 'fullscreen',
};
