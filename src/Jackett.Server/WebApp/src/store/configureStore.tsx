import {applyMiddleware, createStore, Middleware} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './reducers';

export function configureStore() {
  const middleware: Array<Middleware> = [thunk];
  if (process.env.NODE_ENV !== 'production') {
      // don't use import { createLogger } from 'redux-logger' because it will be included in production build
      let rl = require('redux-logger');
      middleware.push(rl.createLogger());
  }
  return createStore(rootReducer, applyMiddleware(...middleware));
}
