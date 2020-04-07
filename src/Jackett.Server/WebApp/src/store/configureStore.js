import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'

import reducer from './reducers';

export function configureStore() {
  const middlewares = [thunk];
  if (process.env.NODE_ENV !== 'production') {
    middlewares.push(createLogger());
  }
  const store = createStore(reducer, applyMiddleware(...middlewares));
  return store;
}
