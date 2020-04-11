import React from 'react';


import { Layout, Menu, Breadcrumb } from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    FileOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';

import logo from "../assets/jackett_logo.png";
import "./Sidebar.css";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {RootState} from "../store/reducers";
import {ServerConfig} from "../store/types/serverConfig";
import {updateServerConfig} from "../store/thunks/serverConfig";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

interface Props {
    config: ServerConfig
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config
    };
}

const mapDispatchToProps = {
}

class Sidebar extends React.Component<Props, {}> {
    state = {
        collapsed: false,
    };

    onCollapse = (collapsed: boolean) => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    render() {
        return (
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse} width={230}>
                <div className="jackett-logo">
                    <img src={logo}/>
                    <span>Jackett</span>
                </div>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                              <UserOutlined/>
                              <span>Indexers</span>
                            </span>
                        }
                    >
                        <Menu.Item key="1">
                            <DesktopOutlined/>
                            <span>Indexers</span>
                            <Link to="/" />
                        </Menu.Item>
                        <Menu.Item key="2">
                            <DesktopOutlined/>
                            <span>Add Indexer</span>
                            <Link to="/addindexer" />
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub2"
                        title={
                            <span>
                              <UserOutlined/>
                              <span>Search</span>
                            </span>
                        }
                    >
                        <Menu.Item key="3">
                            <DesktopOutlined/>
                            <span>Search</span>
                            <Link to="/search" />
                        </Menu.Item>
                        <Menu.Item key="4">
                            <DesktopOutlined/>
                            <span>Search cache</span>
                            <Link to="/cache" />
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub3"
                        title={
                            <span>
                              <UserOutlined/>
                              <span>Settings</span>
                            </span>
                        }
                    >
                        <Menu.Item key="5">
                            <DesktopOutlined/>
                            <span>General</span>
                            <Link to="/configuration" />
                        </Menu.Item>
                        <Menu.Item key="6">
                            <DesktopOutlined/>
                            <span>Security</span>
                            <Link to="/security" />
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu
                        key="sub4"
                        title={
                            <span>
                              <UserOutlined/>
                              <span>System</span>
                            </span>
                        }
                    >
                        <Menu.Item key="7">
                            <DesktopOutlined/>
                            <span>Status</span>
                            <Link to="/status" />
                        </Menu.Item>
                        <Menu.Item key="8">
                            <DesktopOutlined/>
                            <span>Updates</span>
                            <Link to="/updates" />
                        </Menu.Item>
                        <Menu.Item key="9">
                            <DesktopOutlined/>
                            <span>Logs</span>
                            <Link to="/logs" />
                        </Menu.Item>
                    </SubMenu>
                    <li>
                        <div className="jackett-version">
                            <a href="https://github.com/Jackett/Jackett" target="_blank">Version {this.props.config.app_version}</a>
                        </div>
                    </li>
                </Menu>
            </Sider>

        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);


/*


        <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor="left"
        >
            <List>
                <div className="logo">
                    <img src={logo}/>
                    <span>Jackett</span>
                </div>
            </List>
            <Divider />
            <List>
                <SideBarItem path='/' label='Home' icon={<InboxIcon/>}/>
                <SideBarItem path='/indexers' label='Indexers' icon={<InboxIcon/>}/>
                <SideBarItem path='/search' label='Search' icon={<InboxIcon/>}/>
                <SideBarItem path='/cache' label='Cache' icon={<InboxIcon/>}/>
                <SideBarItem path='/logs' label='Logs' icon={<InboxIcon/>}/>
                <SideBarItem path='/configuration' label='Configuration' icon={<InboxIcon/>}/>
            </List>
            <Divider/>
            <List>
                <SideBarItem path='/help' label='Help' icon={<InboxIcon/>}/>
                <SideBarItem path='/report' label='Report an issue' icon={<InboxIcon/>}/>
                <SideBarItem path='/update' label='Check for updates' icon={<InboxIcon/>}/>
            </List>
            <Divider/>
        </Drawer>
 */
