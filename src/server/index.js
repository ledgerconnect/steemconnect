
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import express from 'express';
import compression from 'compression';
import path from 'path';
import React from 'react';
import RouterContext from 'react-router/lib/RouterContext';
import createMemoryHistory from 'react-router/lib/createMemoryHistory';
import match from 'react-router/lib/match';

import configureStore from '../redux/store';

import template from './template';
import routes from '../routes';

const clientAssets = require(KYT.ASSETS_MANIFEST); // eslint-disable-line import/no-dynamic-require
const app = express();

// Remove annoying Express header addition.
app.disable('x-powered-by');

// Compress (gzip) assets in production.
app.use(compression());

// Setup the public directory so that we can serve static assets.
app.use(express.static(path.join(process.cwd(), KYT.PUBLIC_DIR)));

// Setup server side routing.
app.use((request, response) => {
  const history = createMemoryHistory(request.originalUrl);

  match({ routes, history }, (error, redirectLocation, renderProps) => {
    if (error) {
      response.status(500).send(error.message);
    } else if (redirectLocation) {
      response.redirect(302, `${redirectLocation.pathname}${redirectLocation.search}`);
    } else if (renderProps) {
      const store = configureStore();

      // Grab the initial state from our Redux store
      const initialState = JSON.stringify(store.getState());

      // When a React Router route is matched then we render
      // the components and assets into the template.
      response.status(200).send(template({
        root: renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
          ),
        cssBundle: clientAssets.main.css,
        jsBundle: clientAssets.main.js,
        initialState,
      }));
    } else {
      response.status(404).send('Not found');
    }
  });
});

app.listen(parseInt(KYT.SERVER_PORT, 10));
