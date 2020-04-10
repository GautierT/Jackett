import {applyMiddleware, createStore, Middleware} from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger'
import {rootReducer} from './reducers';

export function configureStore() {
  const middleware: Array<Middleware> = [thunk];
  if (process.env.NODE_ENV !== 'production') {
      middleware.push(createLogger());
  }
  return createStore(rootReducer, applyMiddleware(...middleware));
}
