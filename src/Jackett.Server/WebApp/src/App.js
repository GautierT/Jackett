import React from 'react';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import Home from './containers/Home/Home';
import Search from './containers/Search/Search';
import Indexers from './containers/Indexers/Indexers';

import AppLayout from './components/AppLayout/AppLayout';

import fetchConfig from './store/actions/config';
import {getConfigError, getConfig, getConfigPending} from './store/reducers/config';

import fetchIndexers from './store/actions/indexers';
import {getIndexersError, getIndexers, getIndexersPending} from './store/reducers/indexers';


import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      serverConfig: null,
      indexers: null,
      isError: false,
      errorMsg : "",
    };
  }

  componentWillMount() {
    this.fetchServerConfig();
    this.fetchIndexers();
  }

  render() {
    if (this.isLoading()) {
      return (<h3>Loading ...</h3>);
    }

    return (
      <AppLayout serverConfig={this.state.serverConfig} indexers={this.state.indexers}>
        <Switch>
          <Route path="/indexers" render={(props) => <Indexers {...props} indexers={this.state.indexers} />}/>
          <Route path="/search" component={Search}/>
          <Route path="/" component={Home}/>
        </Switch>
      </AppLayout>
    );
  }

  isLoading() {
    // error
    if (this.state.isError)
      return false;

    // all data loaded correctly
    if (this.state.serverConfig != null && this.state.indexers != null)
      return false;

    return true;
  }

  fetchServerConfig() {
    fetch('/api/v2.0/server/config')
    .then(res => res.json())
    .then(res => {
      this.setState({ serverConfig: res });
    })
    .catch(error => {
      this.setState({ isError: true, errorMsg: "Error fetching server config API!" });
    });
  }

  fetchIndexers() {
    fetch('/api/v2.0/indexers')
    .then(res => res.json())
    .then(res => {
      this.setState({ indexers: res });
    })
    .catch(error => {
      this.setState({ isError: true, errorMsg: "Error fetching indexers API!" });
    });
  }
}

export default App;
