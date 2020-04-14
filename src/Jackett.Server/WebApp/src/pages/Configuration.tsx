import React from 'react';
import {connect} from "react-redux";
import {Store} from 'rc-field-form/lib/interface.d'
import {Button, Card, Cascader, Col, DatePicker, Form, Input, InputNumber, Row, Select, Switch, TreeSelect} from 'antd';

import {updateServerConfig} from "../store/thunks/serverConfig";
import {RootState} from "../store/reducers";
import {ServerConfig} from "../api/configuration";

interface State extends ServerConfig {
}

interface Props {
    config: ServerConfig
    updateServerConfig: (config: ServerConfig) => void
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config
    };
}

const mapDispatchToProps = {
    updateServerConfig: (config: ServerConfig) => updateServerConfig(config)
}

class Configuration extends React.Component<Props, State> {

    constructor (props: Props) {
        super(props);
        this.state = this.props.config;
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values: Store) {
        const config = JSON.parse(JSON.stringify(this.props.config));
        config.proxy_port = values.proxyPort;
        this.props.updateServerConfig(config)
    }

    componentDidMount() {

    }

    render() {

        return (
            <Card title="General configuration" style={{ width: "100%" }}>
            <Row>
                <Col span={12}>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={{
                        proxyPort: this.props.config.proxy_port
                    }}
                    onFinish={this.handleSubmit}
                >
                    <Form.Item label="Proxy port" name="proxyPort">
                        <InputNumber/>
                    </Form.Item>
                    <Form.Item label="Input" name="input">
                        <Input />
                    </Form.Item>
                    <Form.Item label="Select">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="TreeSelect">
                        <TreeSelect
                            treeData={[
                                { title: 'Light', value: 'light', children: [{ title: 'Bamboo', value: 'bamboo' }] },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Cascader">
                        <Cascader
                            options={[
                                {
                                    value: 'zhejiang',
                                    label: 'Zhejiang',
                                    children: [
                                        {
                                            value: 'hangzhou',
                                            label: 'Hangzhou',
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="DatePicker">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="Switch">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="">
                        <Button type="primary" htmlType="submit">
                            Save
                        </Button>
                    </Form.Item>
                </Form>
                </Col>
            </Row>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
