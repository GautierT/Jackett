import React, {Component} from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Home from './containers/Home/Home';
import Search from './containers/Search/Search';
import Indexers from './containers/Indexers/Indexers';

import {AppLayout} from './components/AppLayout/AppLayout';

import fetchConfig from './store/actions/config';
import {getConfigError, getConfig, getConfigPending} from './store/reducers/config';

import fetchIndexers from './store/actions/indexers';
import {getIndexersError, getIndexers, getIndexersPending} from './store/reducers/indexers';


import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

  }

  componentWillMount() {
    const {fetchConfig, fetchIndexers} = this.props;
    fetchConfig();
    fetchIndexers();
}


  render() {
    const {state} = this.props;

    if (state.config.pending || state.indexers.pending) {
      return (<h3 className="loading-indicator">Loading ...</h3>);
    }

    // TODO
    // 

    return (
      <AppLayout>
        <Switch>
          <Route path="/indexers" component={Indexers}/>
          <Route path="/search" component={Search}/>
          <Route path="/" component={Home}/>
        </Switch>
      </AppLayout>
    );
  }

}

function mapStateToProps(state) {
  return {
    state: state

    /*
    error: getIndexersError(state),
    products: getIndexers(state),
    pending: getIndexersPending(state)*/
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({fetchConfig, fetchIndexers}, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
