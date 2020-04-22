import * as React from "react";
import {ReactNode} from "react";
import {withRouter} from "react-router-dom";
import {RouteComponentProps} from "react-router";
import {connect} from "react-redux";
import CopyToClipboard from "react-copy-to-clipboard";
import {Button, Card, Col, Input, notification, Row, Table, Tag} from "antd";
import {CopyOutlined, DeleteOutlined, InfoCircleOutlined, SearchOutlined, SettingOutlined} from "@ant-design/icons";
import {ColumnsType} from "antd/lib/table/interface";
import qs from "qs";

import {resolveAbsoluteUrl} from "../utils";
import {RootState} from "../store/reducers";
import {getIndexerConfig, IndexerConfig, IndexerConfigFields, IndexerType} from "../api/indexers";
import {ServerConfig} from "../api/configuration";
import IndexerConfiguration from "../components/IndexerConfiguration";
import IndexerCapabilities from "../components/IndexerCapabilities";
import {deleteIndexerConfig, updateIndexerConfig} from "../store/thunks/indexersConfig";
import styles from "./Indexers.module.css";
import TableFilter from "../components/TableFilter";

enum FeedType {
    RSS,
    Torznab,
    Potato
}

interface State {
    tableDataSource: Array<IndexerConfig>
    modalComponent: ReactNode
    isLoadingModal: boolean
}

interface Props extends RouteComponentProps {
    config: ServerConfig
    configuredIndexers: Array<IndexerConfig>
    isUpdating: boolean
    errorUpdate: string
    updateIndexerConfig: ((id: string, indexerConfigFields: IndexerConfigFields) => void)
    deleteIndexerConfig: ((id: string) => void)
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config,
        configuredIndexers: state.indexers.configuredIndexers,
        isUpdating: state.indexers.isUpdating,
        errorUpdate: state.indexers.errorUpdate
    };
}

const mapDispatchToProps = {
    updateIndexerConfig: ((id: string, indexerConfigFields: IndexerConfigFields) => updateIndexerConfig(id, indexerConfigFields)),
    deleteIndexerConfig: ((id: string) => deleteIndexerConfig(id))
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
            width: '1px',
            render: (text:string, record:IndexerConfig) => this.renderColumnActions(record)
        },
        {
            title: 'Feeds',
            dataIndex: 'id',
            render: (text:string, record:IndexerConfig) => this.renderColumnFeeds(record)
        }
    ];
    waitingForUpdate = false;
    waitingForDelete = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            tableDataSource: this.props.configuredIndexers,
            modalComponent: null,
            isLoadingModal: false
        };
    }

    // TODO: is duplicate in add indexer
    renderColumnType = (record: IndexerConfig): ReactNode => {
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
    renderColumnActions = (record: IndexerConfig): ReactNode => {
        const searchButton = <Button title="Search" icon={<SearchOutlined />} size="small"
                                     onClick={() => this.actionSearch(record.id)}>Search</Button>;
        const capabilitiesButton = <Button title="Indexer capabilities" icon={<InfoCircleOutlined />} size="small"
                                           onClick={() => this.actionIndexerCapabilities(record.id)}>Caps</Button>;
        const configureButton = <Button title="Configure indexer" icon={<SettingOutlined />} size="small" className={styles.actionButtonBlue}
                                        onClick={() => this.actionConfigureIndexer(record.id)}>Config</Button>;
        const deleteButton = <Button title="Delete indexer" icon={<DeleteOutlined />} size="small" className={styles.actionButtonRed}
                                     onClick={() => this.actionDeleteIndexer(record.id)}>Delete</Button>;
        return (
            <div className={styles.actions}>{searchButton} {capabilitiesButton} {configureButton} {deleteButton}</div>
        );
    }

    renderColumnFeeds = (record: IndexerConfig): ReactNode => {
        const rssButton = this.renderCopyFeed(record.id, FeedType.RSS);
        const torznabButton = this.renderCopyFeed(record.id, FeedType.Torznab);
        const potatoButton = this.renderCopyFeed(record.id, FeedType.Potato, record.potatoenabled);
        return (
            <div className={styles.actions}>
                {rssButton} {torznabButton} {potatoButton}
            </div>
        );
    }

    renderCopyFeed = (id: string, type: FeedType, enabled: boolean = true) => {
        if (!enabled) {
            return "";
        }

        const basePath = this.props.config.basepathoverride;
        const apiKey = this.props.config.api_key;
        let message = "";
        let url = "";

        switch (type) {
            case FeedType.RSS:
                message = "Copy RSS Feed";
                url = resolveAbsoluteUrl(basePath + "/api/v2.0/indexers/" + id + "/results/torznab/api?apikey=" + apiKey + "&t=search&cat=&q=");
                break;
            case FeedType.Torznab:
                message = "Copy Torznab Feed";
                url = resolveAbsoluteUrl(basePath + "/api/v2.0/indexers/" + id + "/results/torznab/");
                break;
            case FeedType.Potato:
                message = "Copy Potato Feed";
                url = resolveAbsoluteUrl(basePath + "/api/v2.0/indexers/" + id + "/results/potato/");
                break;
            default:
                throw new Error("Not implemented!");
        }

        return (
            <CopyToClipboard
                text={url} // text copied
                onCopy={() => notification.success({
                    message: "Copied to clipboard!",
                    placement: "bottomRight"
                })}>
                <Button title={message} size="small" icon={<CopyOutlined />}>{message}</Button>
            </CopyToClipboard>
        )
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

    actionDeleteIndexer = (id: string) => {
        this.waitingForDelete = true;
        this.props.deleteIndexerConfig(id);
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
        this.props.updateIndexerConfig(indexerConfig.id, configFields);
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


    componentDidUpdate() {
        // TODO: do this logic in other components
        if (this.waitingForUpdate || this.waitingForDelete) {
            if (this.props.errorUpdate) {
                notification.error({
                    message: this.waitingForUpdate ? "Error updating the indexer" : "Error deleting the indexer",
                    description: this.props.errorUpdate,
                    placement: "bottomRight",
                    duration: 0
                });
                this.waitingForUpdate = false;
                this.waitingForDelete = false;
            } else if (!this.props.isUpdating) {
                notification.success({
                    message: this.waitingForUpdate ? "Indexer updated" : "Indexer deleted",
                    placement: "bottomRight"
                });
                this.waitingForUpdate = false;
                this.waitingForDelete = false;
                this.setState({
                    modalComponent: null
                });
            }
        }
    }

    render() {

        return (
            <Card className="cardHeader" title={
                    <Row className={styles.headerRow}>
                        <Col span={8}>
                            Configured indexers
                        </Col>
                        <Col span={8} className={styles.headerApiKey}>API key <Input
                            readOnly
                            defaultValue={this.props.config.api_key}
                            className={styles.headerApiKeyInput}
                            addonAfter={
                                <CopyToClipboard text={this.props.config.api_key}
                                                 onCopy={() => notification.success({
                                                     message: "Copied to clipboard!",
                                                     placement: "bottomRight"
                                                 })}>
                                    <span className={styles.headerApiKeyCopy}><CopyOutlined /></span>
                                </CopyToClipboard>
                            }
                        />
                        </Col>
                        <Col span={8} className={styles.headerFilter}>
                            <TableFilter
                                inputData={this.props.configuredIndexers}
                                filterColumns={["name", "type", "language"]}
                                resetTextOnDataChange={false}
                                onFilter={(outputData) => this.setState({tableDataSource: outputData})}
                                className={styles.headerFilterInput}
                            />
                        </Col>
                    </Row>
                }>
                <Table
                    dataSource={this.state.tableDataSource}
                    columns={this.tableColumns}
                    rowKey="id"
                    size="small"
                    className={styles.tableCustom}
                    pagination={{
                        position:["bottomLeft"],
                        showSizeChanger: true,
                        defaultPageSize: 15,
                        pageSizeOptions: ["15", "30", "50", "100", "1000"]
                    }}
                    showSorterTooltip={false}
                    loading={this.props.isUpdating || this.state.isLoadingModal}
                />
                {this.state.modalComponent}
            </Card>
        );
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Indexers));
