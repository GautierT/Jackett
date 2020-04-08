import React from 'react';
import {HashRouter, Route, Switch} from 'react-router-dom';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Sidebar from "./Sidebar";
import Indexers from "../pages/Indexers";
import Home from "../pages/Home";

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

const theme = createMuiTheme({
    props: {
        /*
        MuiListItem: {
            dense: true,
        },
        MuiToolbar: {
            variant: 'dense',
        },*/
    },
    palette: {
        type: 'light', // dark
    },
});

export default function AppLayout() {
    const classes = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <HashRouter>
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
                            {/*<Route path="/indexers" render={(props) => <Indexers {...props} indexers={this.state.indexers} />}/>*/}
                            <Route path="/indexers" component={Indexers}/>
                            <Route path="/" component={Home}/>
                        </Switch>
                    </main>
                </div>
            </HashRouter>
        </ThemeProvider>
    );
}
