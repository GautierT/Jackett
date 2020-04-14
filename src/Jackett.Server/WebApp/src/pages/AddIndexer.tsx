import * as React from "react";
import {connect} from "react-redux";

import {RootState} from "../store/reducers";
import {IndexersConfig} from "../store/types/indexersConfig";

// TODO: review any types
interface State {

}

interface Props {
    indexers: IndexersConfig
}

function mapStateToProps(state: RootState) {
    return {
        indexers: state.indexers.indexers
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
