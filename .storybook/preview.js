import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { addDecorator } from '@storybook/react';
import { withThemes } from '@react-theming/storybook-addon';
import { theme } from '../src/components/App/theme';
import storybookTheme from './theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import '../src/index.scss';

const providerFn = ({ theme, children }) => {
  const muTheme = createMuiTheme(theme);
  return (
    <ThemeProvider theme={muTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
};

addDecorator(withThemes(null, [theme], { providerFn }));

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  docs: {
    theme: storybookTheme,
  },
  layout: 'centered',
};
