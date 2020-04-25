import React from 'react';
import {connect} from "react-redux";
import {Button, Card, Col, notification, Row} from 'antd';
import {CloudDownloadOutlined} from "@ant-design/icons";

import {RootState} from "../store/reducers";
import {postUpdate, ServerConfig} from "../api/configuration";
import {IndexersConfigState} from "../store/types/indexersConfig";
import styles from "./System.module.css";

interface Props {
    config: ServerConfig
    indexers: IndexersConfigState
}

interface State {
    isLoading: boolean
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config,
        indexers: state.indexers,
    };
}

class System extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }

    handleUpdate = () => {
        this.setState({ isLoading: true })
        postUpdate()
            .then(() => {
                notification.success({
                    message: "Checking for updates",
                    description: "Updater triggered see log for details",
                    placement: "bottomRight"
                });
                this.setState({isLoading: false})
            })
            .catch(error => {
                notification.error({
                    message: "Error checking for updates",
                    description: error,
                    placement: "bottomRight"
                });
                this.setState({ isLoading: false })
            });
    }

    render() {
        const totalIndexers = this.props.indexers.unConfiguredIndexers.length
            + this.props.indexers.configuredIndexers.length;
        // TODO: i'm not sure about this.props.config.can_run_netcore
        const framework = this.props.config.can_run_netcore ? "Mono" : ".Net Core"
        const proxy = this.props.config.proxy_url ? "Yes" : "No"

        return (
            <Card className="cardHeader" title="System status">
                <div className={styles.configBody}>
                    <Row>
                        <Col span={8} className="ant-form-item-label">
                            <label>Jackett version</label>

                        </Col>
                        <Col span={10}>
                            <label className={styles.configLabel}>
                                {this.props.config.app_version + " "}
                                <Button size="small" type="primary" icon={<CloudDownloadOutlined />}
                                        className={styles.updateButton} onClick={() => this.handleUpdate()}
                                        disabled={this.state.isLoading}>
                                    Check for updates
                                </Button>
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="ant-form-item-label">
                            <label>Framework</label>
                        </Col>
                        <Col span={10}>
                            <label className={styles.configLabel}>
                                {framework}
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="ant-form-item-label">
                            <label>Indexers</label>
                        </Col>
                        <Col span={10}>
                            <label className={styles.configLabel}>
                                {totalIndexers} supported / {this.props.indexers.configuredIndexers.length} configured
                            </label>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={8} className="ant-form-item-label">
                            <label>Using proxy</label>
                        </Col>
                        <Col span={10}>
                            <label className={styles.configLabel}>
                                {proxy}
                            </label>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }
}

export default connect(mapStateToProps, null)(System);
