import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {RouteComponentProps} from "react-router";
import {Layout, Menu} from 'antd';
import {
    CloudDownloadOutlined, DesktopOutlined, FileAddOutlined, FileSearchOutlined, FileTextOutlined, GithubOutlined,
    QuestionCircleOutlined, SafetyCertificateOutlined, SearchOutlined, SettingOutlined, StarOutlined
} from "@ant-design/icons";

import JackettLogo from "../assets/jackett_logo.png";
import styles from "./Sidebar.module.css";

interface SidebarSubMenu {
    label: string
    icon: React.ReactElement
    path: string
}

interface SidebarMenu {
    label: string
    icon: React.ReactElement
    subMenus: Array<SidebarSubMenu>
}

interface Props extends RouteComponentProps {
    jackettVersion: string
}

interface State {
    lastPath: string
    lastOpenKey: string
    openKeys: Array<string>
    selectedKeys: Array<string>
}

class Sidebar extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            lastPath: "unknown",
            lastOpenKey: "",
            openKeys: [] as Array<string>,
            selectedKeys: [] as Array<string>
        };
    }

    sidebarMenu:Array<SidebarMenu> = [
        {
            label: "Indexers",
            icon: <StarOutlined />,
            subMenus: [
                {
                    label: "Indexers",
                    icon: <StarOutlined />,
                    path: "/"
                },
                {
                    label: "Add Indexer",
                    icon: <FileAddOutlined />,
                    path: "/addindexer"
                }
            ]
        },
        {
            label: "Search",
            icon: <SearchOutlined />,
            subMenus: [
                {
                    label: "Search",
                    icon: <SearchOutlined />,
                    path: "/search"
                },
                {
                    label: "Search cache",
                    icon: <FileSearchOutlined />,
                    path: "/searchcache"
                }
            ]
        },
        {
            label: "Settings",
            icon: <SettingOutlined />,
            subMenus: [
                {
                    label: "General",
                    icon: <SettingOutlined />,
                    path: "/configuration"
                },
                {
                    label: "Security",
                    icon: <SafetyCertificateOutlined />,
                    path: "/security"
                }
            ]
        },
        {
            label: "System",
            icon: <DesktopOutlined/>,
            subMenus: [
                {
                    label: "Status",
                    icon: <DesktopOutlined/>,
                    path: "/status"
                },
                {
                    label: "Logs",
                    icon: <FileTextOutlined />,
                    path: "/logs"
                },
                {
                    label: "Updates",
                    icon: <CloudDownloadOutlined />,
                    path: "/updates"
                }
            ]
        },
        {
            label: "Help",
            icon: <QuestionCircleOutlined />,
            subMenus: [
                {
                    label: "Help",
                    icon: <QuestionCircleOutlined />,
                    path: "/help"
                },
                {
                    label: "Report an issue",
                    icon: <GithubOutlined />,
                    path: "/report"
                }
            ]
        }
    ];

    handleOnOpenChange = (openKeys: string[]) => {
        if (openKeys.length > 1) {
            const last = openKeys.pop() as string;
            this.setState({
                lastOpenKey: last,
                openKeys: [last],
                selectedKeys: [last + "_0"]
            });
            const firstSubmenuPath = this.sidebarMenu[parseInt(last)].subMenus[0].path;
            this.props.history.push(firstSubmenuPath);
        } else {
            this.setState({
                openKeys: [this.state.lastOpenKey]
            });
        }
    }

    handleOnClick = (params: any) => {
        const { key } = params;
        this.setState({
            selectedKeys: [key]
        });
    };

    loadPathFromRouter() {
        const {pathname} = this.props.location;
        if (pathname === this.state.lastPath)
            return;

        let lastOpenKey = "0";
        let defaultOpenKeys = ["0"];
        let defaultSelectedKeys = ["0_0"];
        this.sidebarMenu.forEach((menu, a) => {
            menu.subMenus.forEach((subMenu, b) => {
                if (subMenu.path === pathname) {
                    lastOpenKey = a.toString();
                    defaultOpenKeys = [a.toString()];
                    defaultSelectedKeys = [a.toString() + "_" + b.toString()];
                }
            })
        });

        this.setState({
            lastPath: pathname,
            lastOpenKey: lastOpenKey,
            openKeys: defaultOpenKeys,
            selectedKeys: defaultSelectedKeys
        });
    }

    componentDidMount() {
        this.loadPathFromRouter();
    }

    componentDidUpdate() {
        this.loadPathFromRouter();
    }

    render() {
        return (
            <Layout.Sider width={230}>
                <div className={styles.jackettLogo}>
                    <img src={JackettLogo} alt="Jackett logo"/>
                    <span>Jackett</span>
                </div>
                <Menu
                    theme="dark"
                    onOpenChange={this.handleOnOpenChange}
                    openKeys={this.state.openKeys}
                    selectedKeys={this.state.selectedKeys}
                    onClick={this.handleOnClick}
                    mode="inline">

                    {this.sidebarMenu.map((menu, a) => {
                        return (
                            <Menu.SubMenu
                                key={a.toString()}
                                title={
                                    <span>
                                        {menu.icon}
                                        <span>{menu.label}</span>
                                    </span>
                                }>

                                {menu.subMenus.map((subMenu, b) => {
                                    return (
                                        <Menu.Item key={a.toString() + "_" + b.toString()}>
                                            {subMenu.icon}
                                            <span>{subMenu.label}</span>
                                            <Link to={{pathname: subMenu.path}} />
                                        </Menu.Item>
                                    )
                                })}
                            </Menu.SubMenu>
                        )
                    })}

                    <li>
                        <div className={styles.jackettVersion}>
                            <a href="https://github.com/Jackett/Jackett" target="_blank" rel="noopener noreferrer">
                                Version {this.props.jackettVersion}
                            </a>
                        </div>
                    </li>
                </Menu>
            </Layout.Sider>
        );
    }
}

export default withRouter(Sidebar);
