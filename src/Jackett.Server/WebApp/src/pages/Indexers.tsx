import * as React from "react";
import {ReactNode} from "react";
import {withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import {Card, notification, Table, Tag} from "antd";
import {InfoCircleOutlined, SettingOutlined, SearchOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/lib/table/interface";
import qs from "qs";

import {RootState} from "../store/reducers";
import {getIndexerConfig, IndexerConfig, IndexerConfigFields, IndexerType} from "../api/indexers";
import IndexerConfiguration from "../components/IndexerConfiguration";
import IndexerCapabilities from "../components/IndexerCapabilities";
import {addIndexerConfig} from "../store/thunks/indexersConfig";
import styles from "./Indexers.module.css";

interface State {
    modalComponent: ReactNode
    isLoadingModal: boolean
}

interface Props extends RouteComponentProps {
    configuredIndexers: Array<IndexerConfig>
    isUpdating: boolean
    errorUpdate: string
    addIndexerConfig: ((id: string, indexerConfigFields: IndexerConfigFields) => void)
}

function mapStateToProps(state: RootState) {
    return {
        configuredIndexers: state.indexers.configuredIndexers,
        isUpdating: state.indexers.isUpdating,
        errorUpdate: state.indexers.errorUpdate
    };
}

const mapDispatchToProps = {
    addIndexerConfig: ((id: string, indexerConfigFields: IndexerConfigFields) => addIndexerConfig(id, indexerConfigFields))
}

class Indexers extends React.Component<Props, State> {
    tableColumns: ColumnsType<any> = [
        {
            title: 'Indexer',
            dataIndex: 'name',
            width: '1px',
            defaultSortOrder: 'descend',
            sorter: (a:IndexerConfig, b:IndexerConfig) => b.name.localeCompare(a.name),
            render: (text:string, record:IndexerConfig) => (
                <span style={{whiteSpace: "nowrap"}}>
                    <a href={record.site_link} target="_blank" rel="noopener noreferrer">{record.name}</a>
                </span>)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: '1px',
            sorter: (a:IndexerConfig, b:IndexerConfig) => b.type.localeCompare(a.type),
            render: (text:string, record:IndexerConfig) => this.renderColumnType(record)
        },
        {
            title: 'Language',
            dataIndex: 'language',
            width: '1px',
            sorter: (a:IndexerConfig, b:IndexerConfig) => b.language.localeCompare(a.language)
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            render: (text:string, record:IndexerConfig) => this.renderColumnActions(record)
        }
    ];
    waitingForUpdate = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            modalComponent: null,
            isLoadingModal: false
        };
    }

    // TODO: is duplicate in add indexer
    renderColumnType = (record:IndexerConfig): ReactNode => {
        switch(record.type) {
            case IndexerType.Private:
                return <Tag color="red" key="private">{record.type}</Tag>;
            case IndexerType.SemiPrivate:
                return <Tag color="orange" key="semi-private">{record.type}</Tag>;
            default:
                return <Tag color="green" key="public">{record.type}</Tag>;
        }
    }

    // TODO: create a component or actions
    renderColumnActions = (record:IndexerConfig): ReactNode => {
        const searchButton = <Tag title="Search" onClick={() => this.actionSearch(record.id)}><SearchOutlined /> Search</Tag>;
        const capabilitiesButton = <Tag title="Indexer capabilities" onClick={() => this.actionIndexerCapabilities(record.id)}><InfoCircleOutlined /> Caps</Tag>;
        const configureButton = <Tag title="Configure indexer" onClick={() => this.actionConfigureIndexer(record.id)}><SettingOutlined /> Config</Tag>;
        return (
            <div className={styles.actions}>{searchButton} {capabilitiesButton} {configureButton}</div>
        );
    }

    actionSearch = (id: string) => {
        // redirect to search component
        this.props.history.push({
            pathname: "/search",
            search: qs.stringify({
                indexers: [id]
            }, { arrayFormat: 'brackets' })
        });
    }

    actionConfigureIndexer = (id: string) => {
        this.setState({isLoadingModal: true});

        getIndexerConfig(id)
            .then(response => {
                // TODO: index this.props.unConfiguredIndexers by id
                let indexerConfig = this.props.configuredIndexers
                    .filter(indexer => indexer.id === id)[0];

                this.setState({
                    modalComponent: (
                        <IndexerConfiguration
                            indexerConfig={indexerConfig}
                            configFields={response.data}
                            onConfigured={this.onConfigModalConfigured}
                            onCancel={this.onConfigModalCancel}
                        />
                    )
                });

                // this.waitingForUpdate = true;
                // this.props.addIndexerConfig(id, response.data);
            })
            .catch(error => {
                // TODO: show the error
                console.error(error);
            })
            .finally(() => {
                this.setState({isLoadingModal: false});
            })
    }

    onConfigModalConfigured = (indexerConfig: IndexerConfig, configFields: IndexerConfigFields): void => {
        this.waitingForUpdate = true;
        this.props.addIndexerConfig(indexerConfig.id, configFields);
    }

    onConfigModalCancel = (): void => {
        this.setState({modalComponent: null});
    }

    actionIndexerCapabilities = (id: string) => {
        // TODO: index this.props.unConfiguredIndexers by id
        let indexerConfig = this.props.configuredIndexers
            .filter(indexer => indexer.id === id)[0];
        this.setState({
            modalComponent: (
                <IndexerCapabilities
                    indexerConfig={indexerConfig}
                    onClose={this.onCapabilitiesModalClose}
                />
            )
        });
    }

    onCapabilitiesModalClose = (): void => {
        this.setState({modalComponent: null});
    }

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

    componentDidUpdate() {
        // TODO: do this logic in other components
        if (this.waitingForUpdate) {
            if (this.props.errorUpdate) {
                notification.error({
                    message: "Error updating the indexer",
                    description: this.props.errorUpdate,
                    placement: "bottomRight",
                    duration: 0
                });
                this.waitingForUpdate = false;
            } else if (!this.props.isUpdating) {
                notification.success({
                    message: "Indexer updated",
                    placement: "bottomRight"
                });
                this.waitingForUpdate = false;
                this.setState({
                    modalComponent: null
                });
            }
        }
    }

    render() {
        return (
            <Card title="Configured indexers" style={{ width: "100%" }}>
                <Table
                    dataSource={this.props.configuredIndexers}
                    columns={this.tableColumns}
                    rowKey="id"
                    size="small"
                    className={styles.tableCustom}
                    pagination={{position:["bottomLeft"]}}
                    showSorterTooltip={false}
                    loading={this.props.isUpdating || this.state.isLoadingModal}
                />
                {this.state.modalComponent}
            </Card>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Indexers));
