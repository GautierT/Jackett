import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {configureStore} from './store/configureStore';
import * as serviceWorker from './serviceWorker';
import App from './App';

import './index.css';

const store = configureStore();

// TODO: enable React.StrictMode when antd fix the issues
// https://github.com/ant-design/ant-design/issues/22493
ReactDOM.render(
  // <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
  // </React.StrictMode>
  ,document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
