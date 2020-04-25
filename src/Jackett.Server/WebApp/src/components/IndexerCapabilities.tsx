import * as React from "react";
import {Modal, Table} from "antd";

import {
    IndexerConfig, IndexerCaps
} from "../api/indexers";
import styles from "./IndexerCapabilities.module.css";

interface Props {
    indexerConfig: IndexerConfig
    onClose: (() => void)
}

class IndexerCapabilities extends React.Component<Props, {}> {

    renderModal = (): React.ReactNode => {
        return (
            <Modal
                visible={true}
                style={{ marginTop: 30 }}
                centered
                title={"Capabilities " + this.props.indexerConfig.name}
                onOk={this.handleOnClose}
                onCancel={this.handleOnClose}
            >
                <Table
                    dataSource={this.props.indexerConfig.caps}
                    size="small"
                    rowKey="ID"
                    className={styles.tableCustom}
                    bordered
                    pagination={{
                        position:["bottomLeft"],
                        showSizeChanger: true,
                        defaultPageSize: 20,
                        pageSizeOptions: ["10", "20", "50", "100", "1000"]
                    }}
                    showSorterTooltip={false}
                >
                    <Table.Column
                        title="Category"
                        dataIndex="ID"
                        sorter={(a:IndexerCaps, b:IndexerCaps) => b.ID.localeCompare(a.ID)}
                        width={120}
                    />
                    <Table.Column
                        title="Description"
                        dataIndex="Name"
                        sorter={(a:IndexerCaps, b:IndexerCaps) => b.Name.localeCompare(a.Name)}
                    />
                </Table>
            </Modal>
        )
    }

    handleOnClose = () => {
        // call parent callback
        this.props.onClose();
    }

    render() {
        return this.renderModal();
    }
}

export default IndexerCapabilities;
