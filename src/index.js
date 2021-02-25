import is from 'is_js';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import createBrowserHistory from 'history/createBrowserHistory';
import './index.scss';
import Homepage from './views/homepage';
import rootReducer from './combineReducers';
import { faqUrl } from './constants/environment';
import * as serviceWorker from './serviceWorker';
import routes from '../src/services/route/routes';
import { renderRoutes } from './services/route/routeService';

//providers
import { UtilsProvider } from './context/UtilsContext';
import { StepsProvider } from './context/StepsContext';

const isSupportedBrowser = is.chrome() || is.firefox() || is.safari() || is.ios();

const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const history = createBrowserHistory();

const Layout = () => {
    // Redirect the "/faq" page to the Notion document
    if (window.location.pathname.endsWith("/faq")) {
        window.location.replace(faqUrl);
    }


    if (!routes.map(r => r.path).includes(window.location.pathname)) {
        return (
            <div className="homepage_error_wrapper">
                <Typography variant="h3" component="h2" align="center">404 - Not Found</Typography>
                <Typography variant="div" component="h2" align="center">The path you are trying to access does not exist</Typography>
            </div>
        )
    }

    if (isSupportedBrowser) {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <UtilsProvider>
                        <StepsProvider>
                            <Homepage>
                                {renderRoutes(routes)}
                            </Homepage>
                        </StepsProvider>
                    </UtilsProvider>
                </Router>
            </Provider>
        );
    }
    return (
        <div className="homepage_error_wrapper">
            <Typography variant="h3" component="h2" align="center">Browser not supported!</Typography>
            <Typography variant="div" component="h2" align="center">Please use one of the following browsers: Chrome, Firefox or Safari</Typography>
        </div>
    )

}

ReactDOM.render(
    <Layout />,
    document.getElementById('root')
);

serviceWorker.register();
