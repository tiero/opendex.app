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
    text: {
      primary: '#f2f2f2', // whiteish
      secondary: 'rgba(255, 255, 255, 0.7)', // lighter whiteish
    },
    background: {
      default: '#0c0c0c', // grayish
      paper: "#1a1817", // light grayish
    },
    primary: {
      main: "#f15a24", // orange
    },
    secondary: {
      main: "#f2f2f2", // whiteish
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
