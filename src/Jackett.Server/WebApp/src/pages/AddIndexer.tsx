import * as React from "react";
import {connect} from "react-redux";

import {RootState} from "../store/reducers";
import {IndexerConfig} from "../api/indexers";

// TODO: review any types
interface State {

}

interface Props {
    unConfiguredIndexers: Array<IndexerConfig>
}

function mapStateToProps(state: RootState) {
    return {
        unConfiguredIndexers: state.indexers.unConfiguredIndexers
    };
}

const mapDispatchToProps = {
}

class AddIndexer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            dataTable: []
        };
    }

    render() {
        return (
            <h3>TODO</h3>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddIndexer);
