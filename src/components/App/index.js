import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { createStore } from 'redux';
import rootReducer from '../../combineReducers';
import createBrowserHistory from 'history/createBrowserHistory';
import { theme } from './theme';

//providers
import { createMuiTheme } from '@material-ui/core';
import HomePage from '../../pages/home';

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const history = createBrowserHistory();

function App() {
  return (
    <ThemeProvider theme={createMuiTheme(theme)}>
      <CssBaseline />
      <Provider store={store}>
        <Router history={history}>
          <HomePage />
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
