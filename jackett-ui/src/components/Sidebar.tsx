import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import SideBarItem from "./SidebarItem";

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            zIndex: theme.zIndex.drawer + 1,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },
        drawerContainer: {
            overflow: 'auto',
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
    }),
);

export default function Sidebar() {
    const classes = useStyles();

    return (
        <Drawer className={classes.drawer} variant="permanent" classes={{ paper: classes.drawerPaper }} >
            <Toolbar />
            <div className={classes.drawerContainer}>
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
            </div>
        </Drawer>
    );
}
