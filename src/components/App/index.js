import { createMuiTheme } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import React from "react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import "../../styles/global.scss";
import Homepage from "../../views/homepage";
import { renderRoutes } from "../../services/route/routeService";
import { createStore } from "redux";
import rootReducer from "../../combineReducers";
import createBrowserHistory from "history/createBrowserHistory";
import routes from "../../services/route/routes";

//providers
import { UtilsProvider } from "../../context/UtilsContext";
import { StepsProvider } from "../../context/StepsContext";

export const opendexTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: "#0c0c0c",
    },
    secondary: {
      main: "#f15a24",
    },
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        html: {
          WebkitFontSmoothing: "auto",
          padding: "0",
          margin: "0",
        },
        body: {
          color: "#f2f2f2",
          "background-color": "#0c0c0c",
        },
        a: {
          color: "#f15a24",
          "text-decoration": "none",
        },
      },
    },
  },
});

const store = createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const history = createBrowserHistory();

function App() {
  return (
    <ThemeProvider theme={opendexTheme}>
      <CssBaseline />
      <Provider store={store}>
        <Router history={history}>
          <UtilsProvider>
            <StepsProvider>
              <Homepage>{renderRoutes(routes)}</Homepage>
            </StepsProvider>
          </UtilsProvider>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
