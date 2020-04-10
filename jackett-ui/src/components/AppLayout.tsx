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
import Search from "../pages/Search";
import Configuration from "../pages/Configuration";

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

const theme = createMuiTheme({
    props: {/*
        MuiListItem: {
            dense: true,
        },*/
        MuiToolbar: {
            variant: 'dense',
        },
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
                            <Route path="/search" component={Search}/>
                            <Route path="/configuration" component={Configuration}/>
                            <Route path="/" component={Home}/>
                        </Switch>
                    </main>
                </div>
            </HashRouter>
        </ThemeProvider>
    );
}
