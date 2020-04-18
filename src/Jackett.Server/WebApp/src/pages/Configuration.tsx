import React from 'react';
import {connect} from "react-redux";
import {Store} from 'rc-field-form/lib/interface.d'
import {Button, Card, Form, Input, InputNumber, notification, Select, Switch} from 'antd';

import {updateServerConfig} from "../store/thunks/serverConfig";
import {RootState} from "../store/reducers";
import {ServerConfig, UpdateServerConfig} from "../api/configuration";
import "./Configuration.css";

interface Props {
    config: ServerConfig
    isUpdating: boolean
    errorUpdate: string
    updateServerConfig: ((config: UpdateServerConfig) => void)
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config,
        isUpdating: state.config.isUpdating,
        errorUpdate: state.config.errorUpdate
    };
}

const mapDispatchToProps = {
    updateServerConfig: ((config: UpdateServerConfig) => updateServerConfig(config))
}

class Configuration extends React.Component<Props, {}> {
    proxyTypes: any = {
        "0": "HTTP",
        "1": "SOCKS4",
        "2": "SOCKS5"
    };
    waitingForUpdate = false;

    proxyTypeToValue(key: number) {
        return this.proxyTypes[key]
    }

    proxyTypeToKey(value: string) {
        const key = Object.keys(this.proxyTypes).find(key => this.proxyTypes[key] === value) || "0";
        return parseInt(key)
    }

    handleSubmit = (values: Store) => {
        notification.destroy();
        this.waitingForUpdate = true;

        const serverConfig: UpdateServerConfig = {
            basepathoverride: values.basePathOverride,
            blackholedir: values.blackholeDir,
            external: values.externalAccess,
            logging: values.enhancedLogging,
            omdbkey: values.omdbKey,
            omdburl: values.omdbURL,
            port: values.serverPort,
            prerelease: values.prerelease,
            proxy_password: values.proxyPassword,
            proxy_port: values.proxyPort,
            proxy_type: this.proxyTypeToKey(values.proxyType),
            proxy_url: values.proxyURL,
            proxy_username: values.proxyUsername,
            updatedisabled: values.updateDisabled
        };
        this.props.updateServerConfig(serverConfig);
    }

    componentDidUpdate() {
        if (this.props.errorUpdate) {
            notification.error({
                message: "Error updating the configuration",
                description: this.props.errorUpdate,
                placement: "bottomLeft",
                duration: 0
            });
        } else if (this.waitingForUpdate && !this.props.isUpdating) {
            notification.success({
                message: "Configuration updated",
                placement: "bottomLeft"
            });
            this.waitingForUpdate = false;
        }
    }

    render() {
        return (
            <Card title="General configuration" style={{ width: "100%" }}>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                    layout="horizontal"
                    className="config-form"
                    onFinish={this.handleSubmit}
                    initialValues={{
                        serverPort: this.props.config.port,
                        basePathOverride: this.props.config.basepathoverride,
                        externalAccess: this.props.config.external,
                        blackholeDir: this.props.config.blackholedir,
                        enhancedLogging: this.props.config.logging,
                        updateDisabled: this.props.config.updatedisabled,
                        prerelease: this.props.config.prerelease,
                        proxyType: this.proxyTypeToValue(this.props.config.proxy_type),
                        proxyURL: this.props.config.proxy_url,
                        proxyPort: this.props.config.proxy_port,
                        proxyUsername: this.props.config.proxy_username,
                        proxyPassword: this.props.config.proxy_password,
                        omdbURL: this.props.config.omdburl,
                        omdbKey: this.props.config.omdbkey
                    }}
                >
                    <h3 className="config-title">Server</h3>
                    <Form.Item label="Server port" name="serverPort">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Base Path Override" name="basePathOverride">
                        <Input placeholder="/jackett"/>
                    </Form.Item>
                    <Form.Item label="External access" name="externalAccess" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Manual download Blackhole directory" name="blackholeDir">
                        <Input placeholder="C:\torrents\" />
                    </Form.Item>
                    <Form.Item label="Enhanced logging" name="enhancedLogging" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <h3 className="config-title">Updates</h3>
                    <Form.Item label="Disable auto update" name="updateDisabled" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Update to pre-release" name="prerelease" valuePropName="checked">
                        <Switch />
                    </Form.Item>

                    <h3 className="config-title">Proxy</h3>
                    <Form.Item label="Proxy type" name="proxyType">
                        <Select>
                            {Object.values(this.proxyTypes).map((value: any) => (
                                <Select.Option key={value} value={value}>{value}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="Proxy URL" name="proxyURL">
                        <Input placeholder="Blank to disable"/>
                    </Form.Item>
                    <Form.Item label="Proxy port" name="proxyPort">
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item label="Proxy username" name="proxyUsername">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Proxy password" name="proxyPassword">
                        <Input />
                    </Form.Item>

                    <h3 className="config-title">Other</h3>
                    <Form.Item label="OMDB API URL" name="omdbURL">
                        <Input placeholder="Blank for default"/>
                    </Form.Item>
                    <Form.Item label="OMDB API key" name="omdbKey">
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                        <Button type="primary" htmlType="submit" disabled={this.props.isUpdating}>
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
