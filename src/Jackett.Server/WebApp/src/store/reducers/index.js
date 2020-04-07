import {combineReducers} from 'redux';
import configReducer from './config';
import productsReducer from './indexers';

export default combineReducers({
  config: configReducer,
  indexers: productsReducer
});
