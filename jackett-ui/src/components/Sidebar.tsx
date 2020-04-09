import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SideBarItem from "./SidebarItem";
import "./Sidebar.css"

const drawerWidth = 240;

// TODO: remove unused styles
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        },
    }),
);

export default function Sidebar() {
    const classes = useStyles();

    return (
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
                    <img src="/jacket_medium.png"/>
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
    );
}
