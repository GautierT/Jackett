import * as React from "react";
import {ReactNode} from "react";
import {connect} from "react-redux";
import {Button, Card, notification, Table, Tag} from "antd";
import {ColumnsType} from "antd/lib/table/interface";
import {
    InfoCircleOutlined, PlusCircleOutlined, SettingOutlined
} from "@ant-design/icons";

import {RootState} from "../store/reducers";
import {addIndexerConfig} from "../store/thunks/indexersConfig";
import {
    getIndexerConfig,
    IndexerCaps, IndexerConfig, IndexerConfigFields, IndexerType
} from "../api/indexers";
import IndexerConfiguration from "../components/IndexerConfiguration";
import styles from "./Indexers.module.css";
import IndexerCapabilities from "../components/IndexerCapabilities";

interface TableRow {
    id: string
    siteLink: string
    name: string
    description: string
    language: string
    type: IndexerType
    mainCats: string
}

interface State {
    tableDataSource: Array<TableRow>
    modalComponent: ReactNode
    isLoadingModal: boolean
}

interface Props {
    unConfiguredIndexers: Array<IndexerConfig>
    isUpdating: boolean
    errorUpdate: string
    addIndexerConfig: ((id: string, indexerConfigFields: IndexerConfigFields) => void)
}

function mapStateToProps(state: RootState) {
    return {
        unConfiguredIndexers: state.indexers.unConfiguredIndexers,
        isUpdating: state.indexers.isUpdating,
        errorUpdate: state.indexers.errorUpdate
    };
}

const mapDispatchToProps = {
    addIndexerConfig: ((id: string, indexerConfigFields: IndexerConfigFields) => addIndexerConfig(id, indexerConfigFields))
}

class IndexersAddIndexer extends React.Component<Props, State> {
    tableColumns: ColumnsType<any> = [
        {
            title: 'Indexer',
            dataIndex: 'name',
            width: '1px',
            defaultSortOrder: 'descend',
            sorter: (a:TableRow, b:TableRow) => b.name.localeCompare(a.name),
            render: (text:string, record:TableRow) => (
                <span style={{whiteSpace: "nowrap"}}>
                    <a href={record.siteLink} target="_blank" rel="noopener noreferrer">{record.name}</a>
                </span>)
        },
        {
            title: 'Type',
            dataIndex: 'type',
            width: '1px',
            sorter: (a:TableRow, b:TableRow) => b.type.localeCompare(a.type),
            render: (text:string, record:TableRow) => this.renderColumnType(record)
        },
        {
            title: 'Language',
            dataIndex: 'language',
            width: '1px',
            sorter: (a:TableRow, b:TableRow) => b.language.localeCompare(a.language)
        },
        {
            title: 'Actions',
            dataIndex: 'id',
            width: '1px',
            render: (text:string, record:TableRow) => this.renderColumnActions(record)
        },
        {
            title: 'Categories',
            dataIndex: 'mainCats',
            width: '1px',
            sorter: (a:TableRow, b:TableRow) => b.mainCats.localeCompare(a.mainCats),
            render: (text:string, record:TableRow) => <span style={{whiteSpace: "nowrap"}}>{record.mainCats}</span>
        },
        {
            title: 'Description',
            dataIndex: 'description',
            className: styles.largeText,
            render: (text:string, record:TableRow) => <span title={record.description}>{record.description}</span>
        }
    ];
    waitingForUpdate = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            tableDataSource: this.generateTableDataSource(),
            modalComponent: null,
            isLoadingModal: false
        };
    }

    generateTableDataSource = () => {
        const tableDataSource: Array<TableRow> = this.props.unConfiguredIndexers.map(indexer => {
            const row: TableRow = {
                id: indexer.id,
                siteLink: indexer.site_link,
                name: indexer.name,
                description: indexer.description,
                type: indexer.type,
                language: indexer.language,
                mainCats: this.computeMainCats(indexer.caps)
            };
            return row;
        });
        return tableDataSource;
    }

    computeMainCats = (caps: Array<IndexerCaps>): string => {
        const mainCats = caps.filter(function(c) {
            return parseInt(c.ID) < 100000;
        }).map(function(c) {
            return c.Name.split("/")[0];
        });
        // make the list values unique
        const mainCatsUnique = Array.from(new Set(mainCats));
        return mainCatsUnique.join(", ");
    }

    renderColumnType = (record:TableRow): ReactNode => {
        switch(record.type) {
            case IndexerType.Private:
                return <Tag color="red" key="private">{record.type}</Tag>;
            case IndexerType.SemiPrivate:
                return <Tag color="orange" key="semi-private">{record.type}</Tag>;
            default:
                return <Tag color="green" key="public">{record.type}</Tag>;
        }
    }

    renderColumnActions = (record:TableRow): ReactNode => {
        const capabilitiesButton = <Button title="Indexer capabilities" icon={<InfoCircleOutlined />} size="small"
                                     onClick={() => this.actionIndexerCapabilities(record.id)}>Caps</Button>;
        const configureButton = <Button title="Configure indexer" icon={<SettingOutlined />} size="small" className={styles.actionButtonBlue}
                                        onClick={() => this.actionConfigureIndexer(record.id)}>Config</Button>;
        const addButton = record.type === IndexerType.Public ?
            <Button title="Add indexer" icon={<PlusCircleOutlined />} size="small" className={styles.actionButtonGreen}
                    onClick={() => this.actionAddIndexer(record.id)}>Add</Button> : "";
        return (
            <div className={styles.actions}>{capabilitiesButton} {configureButton} {addButton}</div>
        );
    }

    // TODO: merge action add with action configure
    actionAddIndexer = (id: string) => {
        this.setState({isLoadingModal: true});

        getIndexerConfig(id)
            .then(response => {
                this.waitingForUpdate = true;
                this.props.addIndexerConfig(id, response.data);
            })
            .catch(error => {
                // TODO: show the error
                console.error(error);
            })
            .finally(() => {
                this.setState({isLoadingModal: false});
            })
    }

    actionConfigureIndexer = (id: string) => {
        this.setState({isLoadingModal: true});

        getIndexerConfig(id)
            .then(response => {
                // TODO: index this.props.unConfiguredIndexers by id
                let indexerConfig = this.props.unConfiguredIndexers
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
        let indexerConfig = this.props.unConfiguredIndexers
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
        if (this.waitingForUpdate) {
            if (this.props.errorUpdate) {
                notification.error({
                    message: "Error adding the indexer",
                    description: this.props.errorUpdate,
                    placement: "bottomRight",
                    duration: 0
                });
                this.waitingForUpdate = false;
            } else if (!this.props.isUpdating) {
                notification.success({
                    message: "Indexer added",
                    placement: "bottomRight"
                });
                this.waitingForUpdate = false;
                this.setState({
                    tableDataSource: this.generateTableDataSource(),
                    modalComponent: null
                });
            }
        }
    }

    render() {
        return (
            <Card title="Add indexer" style={{ width: "100%" }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(IndexersAddIndexer);
