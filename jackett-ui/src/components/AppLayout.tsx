import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';

import Sidebar from "./Sidebar";
import Indexers from "../pages/Indexers";
import Search from "../pages/Search";
import Configuration from "../pages/Configuration";

export default function AppLayout() {

    return (
            <HashRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sidebar/>
                    <Layout className="site-layout">
                        <Layout.Content style={{ margin: '16px' }}>
                                <Switch>
                                    <Route path="/search" component={Search}/>
                                    <Route path="/configuration" component={Configuration}/>
                                    <Route path="/" component={Indexers}/>
                                </Switch>
                        </Layout.Content>
                    </Layout>
                </Layout>


            </HashRouter>
    );
}
