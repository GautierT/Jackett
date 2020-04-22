import React from 'react';
import {connect} from "react-redux";
import {Card} from 'antd';

import {RootState} from "../store/reducers";
import {ServerConfig} from "../api/configuration";
import {IndexersConfigState} from "../store/types/indexersConfig";
import {IndexerType} from "../api/indexers";

interface Props {
    config: ServerConfig
    indexers: IndexersConfigState
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config,
        indexers: state.indexers,
    };
}

class SystemStatus extends React.Component<Props, {}> {

    render() {
        let numPrivate = 0;
        let numSemiPrivate = 0;
        let numPublic = 0;
        this.props.indexers.configuredIndexers.forEach(indexer => {
            switch (indexer.type) {
                case IndexerType.Private:
                    numPrivate++;
                    break;
                case IndexerType.SemiPrivate:
                    numSemiPrivate++;
                    break;
                default:
                    numPublic++;
            }
        });

        return (
            <Card className="cardHeader" title="System status">
                {this.props.indexers.configuredIndexers.length} indexers configured
                ({numPublic} public, {numSemiPrivate} semi-private, {numPrivate} private)
            </Card>
        )
    }
}

export default connect(mapStateToProps, null)(SystemStatus);
