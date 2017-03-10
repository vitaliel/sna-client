import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
const { Router, browserHistory } = require('react-router');
import { syncHistoryWithStore } from 'react-router-redux';
const { ReduxAsyncConnect } = require('redux-connect');

import { configureStore } from './app/redux/store';
import routes from './app/routes';
import {getIndicators} from './app/redux/modules/indicator/index';

const store = configureStore(
  browserHistory,
  window.__INITIAL_STATE__,
);
const history = syncHistoryWithStore(browserHistory, store);
const connectedCmp = (props) => <ReduxAsyncConnect {...props} />;

ReactDOM.render(
  <Provider store={store} key="provider">
    <Router
      history={history}
      render={connectedCmp}>
      {routes}
    </Router>
  </Provider>,
  document.getElementById('app'),
);

window.setTimeout(() => {
  store.dispatch(getIndicators() as any);
}, 200);
