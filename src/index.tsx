import { Typography } from '@material-ui/core';
import is from 'is_js';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import './index.scss';
import * as serviceWorker from './serviceWorker';
import routes from './services/route/routes';

const isSupportedBrowser =
  is.chrome() || is.firefox() || is.safari() || is.ios();

const Layout = () => {
  if (!routes.map(r => r.path).includes(window.location.pathname)) {
    return (
      <div className="homepage_error_wrapper">
        <Typography variant="h3" component="h2" align="center">
          404 - Not Found
        </Typography>
        <Typography component="h2" align="center">
          The path you are trying to access does not exist
        </Typography>
      </div>
    );
  }

  if (isSupportedBrowser) {
    return <App />;
  }

  return (
    <div className="homepage_error_wrapper">
      <Typography variant="h3" component="h2" align="center">
        Browser not supported!
      </Typography>
      <Typography component="h2" align="center">
        Please use one of the following browsers: Chrome, Firefox or Safari
      </Typography>
    </div>
  );
};

ReactDOM.render(<Layout />, document.getElementById('root'));

serviceWorker.register();
