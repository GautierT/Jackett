import * as React from "react";
import {connect} from "react-redux";
import {RootState} from "../store/reducers";
import {IndexerConfig, IndexersConfig} from "../store/types/indexersConfig";
import MaterialTable from "material-table";

interface State {
    dataTable: Array<IndexerConfig>
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

class Indexers extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            dataTable: []
        };
    }

    componentDidMount() {

        this.setState({ dataTable: this.props.indexers.filter(indexer => indexer.configured) });

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

        if (this.state.dataTable.length === 0)
            return null;

        const columns = [
            {
                title: 'Indexer',
                field: 'name',
                searchable: true,
                width: '20%',
                //render: rowData => rowData.indexerRender
            },
            {
                title: 'Actions',
                field: 'name',
                searchable: false,
                sorting: false,
                width: '80%',
                //render: rowData => rowData.actions
            }
        ];

        return (
            <MaterialTable
                title="Indexers"
                //size="small" aria-label="a dense table"
                //tableLayout = "fixed"
                columns={columns}
                data={ this.state.dataTable }
                options={{
                    sorting: true,
                    pageSize: 15,
                    headerStyle:{ padding: '5px 30px' },
                    //cellStyle:{ padding: '5px 30px' },
                }}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Indexers);
