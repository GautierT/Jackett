import React from 'react';
import {connect} from "react-redux";
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Layout, notification} from 'antd';

import {RootState} from "../store/reducers";
import {ServerConfig} from "../api/configuration";
import Sidebar from "./Sidebar";
import Indexers from "../pages/Indexers";
import AddIndexer from "../pages/IndexersAddIndexer";
import Search from "../pages/Search";
import Configuration from "../pages/Configuration";
import Security from "../pages/ConfigurationSecurity";
import SystemStatus from "../pages/SystemStatus";
import SystemLogs from "../pages/SystemLogs";
import Help from "../pages/Help";
import HelpReport from "../pages/HelpReport";

interface Props {
    serverConfig: ServerConfig
}

function mapStateToProps(state: RootState) {
    return {
        serverConfig: state.config.config
    };
}

class AppLayout extends React.Component<Props, {}> {

    componentDidMount() {
        if (this.props.serverConfig.can_run_netcore) {
            notification.info({
                message: "Standalone version of Jackett is now available - Mono not required",
                description: (
                    <span>
                        Upgrading is straight forward, simply
                        <a href="https://github.com/Jackett/Jackett#install-on-linux-amdx64" target="_blank" rel="noopener noreferrer"> install the standalone version </a>
                        and your configuration will carry over.<br/>Benefits include: increased performance, improved
                        stability and no dependency on Mono.
                    </span>),
                placement: "bottomRight",
                duration: 0
            });
        }
        if (this.props.serverConfig.notices) {
            this.props.serverConfig.notices.forEach(notice => {
                notification.error({
                    message: notice,
                    placement: "bottomRight",
                    duration: 0
                })
            });
        }
    }

    render() {
        return (
            <HashRouter>
                <Layout style={{minHeight: '100vh'}}>
                    <Sidebar jackettVersion={this.props.serverConfig.app_version}/>
                    <Layout className="site-layout">
                        <Layout.Content style={{margin: '16px'}}>
                            <Switch>
                                <Route path="/addindexer" component={AddIndexer}/>
                                <Route path="/search" component={Search}/>
                                <Route path="/configuration" component={Configuration}/>
                                <Route path="/security" component={Security}/>
                                <Route path="/status" component={SystemStatus}/>
                                <Route path="/logs" component={SystemLogs}/>
                                <Route path="/help" component={Help}/>
                                <Route path="/report" component={HelpReport}/>
                                <Route path="/" component={Indexers}/>
                            </Switch>
                        </Layout.Content>
                    </Layout>
                </Layout>
            </HashRouter>
        );
    }
}

export default connect(mapStateToProps, null)(AppLayout);
