import * as React from "react";
import {ReactNode} from "react";
import {connect} from "react-redux";
import {Card, notification, Table, Tag} from "antd";
import {
    PlusSquareOutlined, SettingOutlined
} from "@ant-design/icons/lib";
import {ColumnsType} from "antd/lib/table/interface";

import {RootState} from "../store/reducers";
import {addIndexerConfig} from "../store/thunks/indexersConfig";
import {
    getIndexerConfig,
    IndexerCaps, IndexerConfig, IndexerConfigFields, IndexerType
} from "../api/indexers";
import IndexerConfiguration from "../components/IndexerConfiguration";
import styles from "./Indexers.module.css";

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
            title: 'Actions',
            dataIndex: 'id',
            width: '1px',
            render: (text:string, record:TableRow) => this.renderColumnActions(record)
        },
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
            title: 'Categories',
            dataIndex: 'mainCats',
            sorter: (a:TableRow, b:TableRow) => b.mainCats.localeCompare(a.mainCats)
        },
        {
            title: 'Description',
            dataIndex: 'description'
        }
    ];
    waitingForUpdate = false;

    constructor(props: Props) {
        super(props);
        this.state = {
            tableDataSource: this.generateTableDataSource(),
            modalComponent: null
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
        const configureButton = <Tag title="Configure indexer" onClick={() => this.configureIndexer(record.id)}><SettingOutlined /></Tag>;
        const addButton = record.type === IndexerType.Public ? <Tag title="Add indexer" onClick={() => this.addIndexer(record.id)}><PlusSquareOutlined /></Tag> : '';
        return (
            <div className={styles.actions}>{configureButton} {addButton}</div>
        );
    }

    addIndexer = (id: string) => {
        getIndexerConfig(id)
            .then(response => {
                this.waitingForUpdate = true;
                this.props.addIndexerConfig(id, response.data);
            })
            .catch(error => {
                // TODO: show the error
                console.error(error);
            });
    }

    configureIndexer = (id: string) => {
        getIndexerConfig(id)
            .then(response => {
                // TODO: index this.props.unConfiguredIndexers by id
                let indexerConfig = this.props.unConfiguredIndexers
                    .filter(indexer => indexer.id === id)[0];

                this.setState({
                    modalComponent: (
                        <div>
                        <IndexerConfiguration
                            indexerConfig={indexerConfig}
                            configFields={response.data}
                            onConfigured={this.onModalConfigured}
                            onCancel={this.onModalCancel}
                        />

                           {/*<div className="indexer-caps">*/}
                           {/*    <h4>Capabilities</h4>*/}
                           {/*    <table className="dataTable compact cell-border hover stripe">*/}
                           {/*        <thead>*/}
                           {/*        <tr>*/}
                           {/*            <th>Category</th>*/}
                           {/*            <th>Description</th>*/}
                           {/*        </tr>*/}
                           {/*        </thead>*/}
                           {/*        <tbody>*/}
                           {/*            {indexerConfig.caps.map(cap => {*/}
                           {/*                return (*/}
                           {/*                    <tr>*/}
                           {/*                        <td>{cap.ID}</td>*/}
                           {/*                        <td>{cap.Name}</td>*/}
                           {/*                    </tr>*/}
                           {/*                )})*/}
                           {/*            }*/}
                           {/*        </tbody>*/}
                           {/*    </table>*/}
                           {/*</div>*/}
                        </div>
                   )
                });

                // this.waitingForUpdate = true;
                // this.props.addIndexerConfig(id, response.data);
            })
            .catch(error => {
                // TODO: show the error
                console.error(error);
            });
    }

    onModalConfigured = (indexerConfig: IndexerConfig, configFields: IndexerConfigFields): void => {
        this.waitingForUpdate = true;
        this.props.addIndexerConfig(indexerConfig.id, configFields);
    }

    onModalCancel = (): void => {
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
                    pagination={{position:["bottomLeft"]}}
                    showSorterTooltip={false}
                    loading={this.props.isUpdating}
                />
                {this.state.modalComponent}
            </Card>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexersAddIndexer);
