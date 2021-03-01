import React from 'react';
import { connect } from 'react-redux';
import Submarine from '../Submarine';
import { fetchPairs } from '../../actions/submarineActions';
import { ThemeProvider } from "@material-ui/styles";
import './style.scss';
import { createMuiTheme } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";

export const opendexTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: '#f15a24',
    },
  },
});

function App({ dispatch }) {
  dispatch(fetchPairs());

  return (
    <ThemeProvider theme={opendexTheme}>
      <CssBaseline />
      <div className="App">
        <header className="App-header">
          <Submarine />
        </header>
      </div>
    </ThemeProvider>
  );
}

export default connect()(App);
