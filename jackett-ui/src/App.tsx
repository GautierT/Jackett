import React from 'react';
import AppLayout from "./components/AppLayout";
import './App.css';

class App extends React.Component<any, any> {

    constructor(props: any) {
        super(props);

        this.state = {
            serverConfig: null,
            indexers: null,
            isError: false,
            errorMsg : "",
        };
    }

    componentWillMount() {
        this.fetchServerConfig();
        this.fetchIndexers();
    }

    render() {
        if (this.isLoading()) {
            return (<h3>Loading ...</h3>);
        }

        return (
            <AppLayout/>
        );
    }

    isLoading() {
        // error
        if (this.state.isError)
            return false;

        // all data loaded correctly
        if (this.state.serverConfig != null && this.state.indexers != null)
            return false;

        return true;
    }

    fetchServerConfig() {
        fetch('/api/v2.0/server/config')
            .then(res => res.json())
            .then(res => {
                this.setState({ serverConfig: res });
            })
            .catch(error => {
                this.setState({ isError: true, errorMsg: "Error fetching server config API!" });
            });
    }

    fetchIndexers() {
        fetch('/api/v2.0/indexers')
            .then(res => res.json())
            .then(res => {
                this.setState({ indexers: res });
            })
            .catch(error => {
                this.setState({ isError: true, errorMsg: "Error fetching indexers API!" });
            });
    }
}

export default App;
