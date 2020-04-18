import React from 'react';
import {connect} from "react-redux";
import {Spin} from "antd";
import 'antd/dist/antd.css';

import {RootState} from "./store/reducers";
import {ServerConfig} from "./api/configuration";
import {fetchServerConfig} from "./store/thunks/serverConfig";
import {fetchIndexersConfig} from "./store/thunks/indexersConfig";
import {ServerConfigState} from "./store/types/serverConfig";
import {IndexersConfigState} from "./store/types/indexersConfig";
import AppLayout from "./components/AppLayout";
import {checkLogin, configureLoginInterceptor} from "./api/login";
import Login from "./pages/Login";
import style from './App.module.css';

interface Props {
    serverConfigState: ServerConfigState
    indexersConfigState: IndexersConfigState
    fetchServerConfig: () => void
    fetchIndexersConfig: () => void
}

interface State {
    isLoginRequired: boolean
    isLoginError: boolean
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

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoginRequired: false,
            isLoginError: false
        };
    }

    componentDidMount() {
        checkLogin()
            .then(response => {
                const responseURL = response.request.responseURL;
                if (responseURL != null && responseURL.includes("/UI/Login")) {
                    this.setState({ isLoginRequired: true });
                } else {
                    // if we are logged in, start loading the data
                    configureLoginInterceptor();
                    this.props.fetchServerConfig();
                    this.props.fetchIndexersConfig();
                }
            })
            .catch(() => {
                this.setState({ isLoginError: true });
            });
    }

    render() {
        // show login form
        if (this.state.isLoginRequired) {
            return (
                <Login/>
            );
        }

        // TODO: improve error message
        // any error
        if (this.state.isLoginError || this.props.serverConfigState.error || this.props.indexersConfigState.error) {
            return (
                <h3>Error loading!</h3>
            );
        }

        // all loaded
        if (this.props.serverConfigState.isLoaded && this.props.indexersConfigState.isLoaded) {
            return (
                <AppLayout serverConfig={{} as ServerConfig}/>
            );
        }

        // loading...
        return (
            <div className={style.appLoading}>
                <Spin size="large"/>
            </div>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(App);
