import React from 'react';
import AppLayout from "./components/AppLayout";
import './App.css';
import {connect} from "react-redux";
import {RootState} from "./store/reducers";
import fetchServerConfig from "./store/thunks/serverConfig";
import fetchIndexersConfig from "./store/thunks/indexersConfig";
import {ServerConfigState} from "./store/types/serverConfig";
import {IndexersConfigState} from "./store/types/indexersConfig";

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

    componentWillMount() {
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
            <h3>Loading...</h3>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
