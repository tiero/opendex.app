import { Story } from '@storybook/react/types-6-0';
import React from 'react';
import HomePage, { HomePageProps } from '../pages/home';

export default {
  title: 'Homepage',
  component: HomePage,
};

const Template: Story<HomePageProps> = (args: HomePageProps) => (
  <HomePage {...args} />
);

export const Default = Template.bind({});
Default.parameters = {
  layout: 'fullscreen',
};
