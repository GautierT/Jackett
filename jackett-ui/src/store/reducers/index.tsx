import {combineReducers} from 'redux';
import configReducer from './serverConfig';
import productsReducer from './indexersConfig';

export const rootReducer = combineReducers({
  config: configReducer,
  indexers: productsReducer
});

export type RootState = ReturnType<typeof rootReducer>
