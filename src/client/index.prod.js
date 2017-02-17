
import React from 'react';

import { browserHistory, Router } from 'react-router';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from '../redux/store';

const root = document.querySelector('#root');

const preloadedState = window.__PRELOADED_STATE__; // eslint-disable-line no-underscore-dangle

const store = configureStore(preloadedState);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

const mount = () => {
  // eslint-disable-next-line global-require,import/newline-after-import
  const routes = require('../routes').default;

  render(
    <AppContainer>
      <Provider store={store} >
        <div>
          <Router routes={routes} history={history} />
        </div>
      </Provider>
    </AppContainer>,
    root
  );
};

mount();

