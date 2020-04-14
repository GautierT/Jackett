import * as React from "react";
import {connect} from "react-redux";
import {Card, Table} from "antd";

import {RootState} from "../store/reducers";
import {IndexerConfig} from "../api/indexers";

interface Props {
    configuredIndexers: Array<IndexerConfig>
}

function mapStateToProps(state: RootState) {
    return {
        configuredIndexers: state.indexers.configuredIndexers
    };
}

class Indexers extends React.Component<Props, {}> {

    componentDidMount() {

        /*
        let results = [];

        this.props.indexers.forEach(indexer => {

            if (!indexer.configured)
                return;


            let classN = `label label-${indexer.type}`;

            let indexerRender = (
                <span>
          <a className="indexer-name" target="_blank" href={ indexer.site_link } title={ indexer.description }>{ indexer.name }</a>
          <span title={ indexer.type } className={ classN } style={{ textTransform: "capitalize" }}>{ indexer.type }</span>
          </span>
            );

            let actions = (
                <div className="indexer-buttons">

                    <Button variant="contained" size="small" disableElevation>Copy RSS Feed</Button>
                    <Button variant="contained" size="small" disableElevation>Copy Torznab Feed</Button>
                    <Button variant="contained" size="small" disableElevation disabled={!indexer.potatoenabled}>Copy Potato Feed</Button>

                    <Button variant="contained" size="small" disableElevation><FontAwesomeIcon icon={faSearch} /> Search</Button>
                    <Button variant="contained" size="small" disableElevation><FontAwesomeIcon icon={faWrench} /> Edit</Button>
                    <Button variant="contained" size="small" disableElevation><FontAwesomeIcon icon={faTrash} /> Remove</Button>

                    <Button variant="contained" size="small" disableElevation>Test</Button>

                </div>);

            results.push({
                indexer: indexer.name,
                indexerRender: indexerRender,
                actions: actions
            });


        });
        */
    }

    render() {

        const columns = [
            {
                title: 'Indexer',
                dataIndex: 'id',
                sorter: (a:any, b:any) => a.id.localeCompare(b.id)
                //render: rowData => rowData.indexerRender
            },
            {
                title: 'Actions',
                dataIndex: 'name',
                searchable: false,
                sorting: false,
                width: '80%',
                //render: rowData => rowData.actions
            }
        ];

        return (
            <Card title="Configured indexers" style={{ width: "100%" }}>
                <Table
                    bordered
                    dataSource={this.props.configuredIndexers}
                    columns={columns}
                    rowKey="id"
                    showSorterTooltip={false}
                    size="small"
                    pagination={{position:["bottomLeft"]}}/>
            </Card>
        );
    }
}

export default connect(mapStateToProps, null)(Indexers);
