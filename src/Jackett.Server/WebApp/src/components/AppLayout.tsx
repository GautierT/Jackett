import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';

import {ServerConfig} from "../api/configuration";
import Sidebar from "./Sidebar";
import Indexers from "../pages/Indexers";
import AddIndexer from "../pages/IndexersAddIndexer";
import Search from "../pages/Search";
import Configuration from "../pages/Configuration";
import Security from "../pages/ConfigurationSecurity";

export default function AppLayout() {
    // TODO: remove the hack serverConfig={{} as ServerConfig}
    return (
        <HashRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar serverConfig={{} as ServerConfig}/>
                <Layout className="site-layout">
                    <Layout.Content style={{ margin: '16px' }}>
                        <Switch>
                            <Route path="/addindexer" component={AddIndexer}/>
                            <Route path="/search" component={Search}/>
                            <Route path="/configuration" component={Configuration}/>
                            <Route path="/security" component={Security}/>
                            <Route path="/" component={Indexers}/>
                        </Switch>
                    </Layout.Content>
                </Layout>
            </Layout>
        </HashRouter>
    );
}
