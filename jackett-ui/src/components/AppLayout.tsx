import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import { Layout, Menu, Breadcrumb } from 'antd';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';


import Indexers from "../pages/Indexers";
import Home from "../pages/Home";
import Search from "../pages/Search";
import Configuration from "../pages/Configuration";
import Sidebar from "./Sidebar";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

export default function AppLayout() {

    return (
            <HashRouter>
                <Layout style={{ minHeight: '100vh' }}>
                    <Sidebar/>
                    <Layout className="site-layout">
                        {/*<Header className="site-layout-background" style={{ padding: 0 }} />*/}
                        <Content style={{ margin: '16px' }}>
                                <Switch>
                                    <Route path="/search" component={Search}/>
                                    <Route path="/configuration" component={Configuration}/>
                                    <Route path="/" component={Indexers}/>
                                </Switch>
                        </Content>
                    </Layout>
                </Layout>


            </HashRouter>
    );
}


/*

                <div className={classes.root}>
                    <CssBaseline />
                    <AppBar position="fixed" className={classes.appBar}>
                        <Toolbar>
                            <Typography variant="h6" noWrap>
                                Jackett
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <Sidebar />
                    <main className={classes.content}>
                        <Toolbar />
                        <Switch>
<Route path="/indexers" component={Indexers}/>
<Route path="/search" component={Search}/>
<Route path="/configuration" component={Configuration}/>
<Route path="/" component={Home}/>
</Switch>
</main>
</div>
 */
