import React from 'react';
import {Card, Col, notification, Row, Table} from 'antd';
import {ColumnsType} from "antd/lib/table/interface";

import {getLogs, LogsResponse, LogTrace} from "../api/configuration";
import TableFilter from "../components/TableFilter";
import styles from "./System.module.css";

interface State {
    isLoading: boolean
    logsResponse: LogsResponse
    tableDataSource: LogsResponse
}

class SystemLogs extends React.Component<{}, State> {
    tableColumns: ColumnsType<any> = [
        {
            title: 'Date',
            dataIndex: 'When',
            width: '1px',
            defaultSortOrder: 'ascend',
            render: (text:string, record:LogTrace) => <span style={{whiteSpace: "nowrap"}}>{record.When.split(".")[0]}</span>,
            sorter: (a:LogTrace, b:LogTrace) => b.When.localeCompare(a.When)
        },
        {
            title: 'Level',
            dataIndex: 'Level',
            width: '1px',
            sorter: (a:LogTrace, b:LogTrace) => b.Level.localeCompare(a.Level),
            render: (text:string, record:LogTrace) => <span style={{textTransform: "uppercase"}}>{record.Level}</span>,
        },
        {
            title: 'Message',
            dataIndex: 'Message',
            render: (text:string, record:LogTrace) => <pre>{record.Message.trim()}</pre>
        }
    ];

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: false,
            logsResponse: [],
            tableDataSource: []
        };
    }

    loadLogs = () => {
        this.setState({ isLoading: true })
        getLogs()
            .then(response => {
                this.setState({
                    isLoading: false,
                    logsResponse: response.data
                })
            })
            .catch(error => {
                notification.error({
                    message: "Error collecting the logs",
                    description: error,
                    placement: "bottomRight"
                });
                this.setState({ isLoading: false })
            });
    }

    componentDidMount() {
        this.loadLogs();
    }

    render() {
        return (
            <Card className="cardHeader" title={
                <Row className={styles.logsHeaderRow}>
                    <Col span={12}>
                        System logs
                    </Col>
                    <Col span={12} className={styles.logsHeaderFilter}>
                        <TableFilter
                            inputData={this.state.logsResponse}
                            filterColumns={["Level", "Message"]}
                            resetTextOnDataChange={false}
                            onFilter={(outputData) => this.setState({tableDataSource: outputData})}
                            className={styles.logsHeaderFilterInput}
                        />
                    </Col>
                </Row>
            }>
                <Table
                    dataSource={this.state.tableDataSource}
                    columns={this.tableColumns}
                    rowKey="When"
                    size="small"
                    className={styles.logsTableCustom}
                    bordered
                    rowClassName={ (record: LogTrace) => record.Level === "Error" ? styles.logsRowError : "" }
                    pagination={{
                        position:["bottomLeft"],
                        showSizeChanger: true,
                        defaultPageSize: 20,
                        pageSizeOptions: ["10", "20", "50", "100", "1000"]
                    }}
                    showSorterTooltip={false}
                    loading={this.state.isLoading}
                />
            </Card>
        )
    }
}

export default SystemLogs;
