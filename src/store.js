import { createStore } from 'redux';

if (process.env.ENABLE_LOGGER &&
  process.env.IS_BROWSER &&
  process.env.NODE_ENV !== 'production') {
}

const store = createStore(
  window.devToolsExtension && window.devToolsExtension(),
);

export default store;
