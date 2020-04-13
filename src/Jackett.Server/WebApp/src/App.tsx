import React from 'react';
import {connect} from "react-redux";
import {RootState} from "./store/reducers";
import {fetchServerConfig} from "./store/thunks/serverConfig";
import {fetchIndexersConfig} from "./store/thunks/indexersConfig";
import {ServerConfigState} from "./store/types/serverConfig";
import {IndexersConfigState} from "./store/types/indexersConfig";
import AppLayout from "./components/AppLayout";

import {Spin} from "antd";
import 'antd/dist/antd.css';
import './App.css';

interface Props {
    serverConfigState: ServerConfigState
    indexersConfigState: IndexersConfigState
    fetchServerConfig: () => void
    fetchIndexersConfig: () => void
}

function mapStateToProps(state: RootState) {
    return {
        serverConfigState: state.config,
        indexersConfigState: state.indexers
    };
}

const mapDispatchToProps = {
    fetchServerConfig: fetchServerConfig,
    fetchIndexersConfig: fetchIndexersConfig
}

class App extends React.Component<Props, {}> {

    componentDidMount() {
        this.props.fetchServerConfig();
        this.props.fetchIndexersConfig();
    }

    render() {
        // any error
        if (this.props.serverConfigState.error || this.props.indexersConfigState.error) {
            return (
                <h3>Error loading!</h3>
            );
        }

        // all loaded
        if (this.props.serverConfigState.isLoaded && this.props.indexersConfigState.isLoaded) {
            return (
                <AppLayout/>
            );
        }

        // loading...
        return (
            <div className="loading">
                <Spin size="large"/>
            </div>

        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
