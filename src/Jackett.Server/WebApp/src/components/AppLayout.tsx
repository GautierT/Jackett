import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';

import {ServerConfig} from "../store/types/serverConfig";
import Sidebar from "./Sidebar";
import Search from "../pages/Search";
import Configuration from "../pages/Configuration";
import AddIndexer from "../pages/AddIndexer";
import Indexers from "../pages/Indexers";

export default function AppLayout() {
    // TODO: remove the hack serverConfig={{} as ServerConfig}
    return (
        <HashRouter>
            <Layout style={{ minHeight: '100vh' }}>
                <Sidebar serverConfig={{} as ServerConfig}/>
                <Layout className="site-layout">
                    <Layout.Content style={{ margin: '16px' }}>
                            <Switch>
                                <Route path="/search" component={Search}/>
                                <Route path="/configuration" component={Configuration}/>
                                <Route path="/addindexer" component={AddIndexer}/>
                                <Route path="/" component={Indexers}/>
                            </Switch>
                    </Layout.Content>
                </Layout>
            </Layout>
        </HashRouter>
    );
}
