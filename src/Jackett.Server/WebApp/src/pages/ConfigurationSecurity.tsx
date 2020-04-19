import React from 'react';
import {connect} from "react-redux";
import CopyToClipboard from 'react-copy-to-clipboard';
import {Store} from 'rc-field-form/lib/interface.d'
import {Button, Card, Form, Input, notification, Switch, Col, Row} from 'antd';
import {FormInstance} from "antd/lib/form";
import {CopyOutlined} from "@ant-design/icons";

import {updateAdminPassword} from "../store/thunks/serverConfig";
import {RootState} from "../store/reducers";
import {ServerConfig} from "../api/configuration";
import styles from "./Configuration.module.css";

interface State {
    fromChanged: boolean
    enablePassword: boolean
}

interface Props {
    config: ServerConfig
    isUpdating: boolean
    errorUpdate: string
    updateAdminPassword: ((adminPassword: string) => void)
}

function mapStateToProps(state: RootState) {
    return {
        config: state.config.config,
        isUpdating: state.config.isUpdating,
        errorUpdate: state.config.errorUpdate
    };
}

const mapDispatchToProps = {
    updateAdminPassword: ((adminPassword: string) => updateAdminPassword(adminPassword))
}

class ConfigurationSecurity extends React.Component<Props, State> {
    formRef = React.createRef<FormInstance>();
    waitingForUpdate = false;

    constructor (props: Props) {
        super(props);
        this.state = {
            fromChanged: false,
            enablePassword: !!this.props.config.password
        }
    }

    handleSubmit = (values: Store) => {
        this.waitingForUpdate = true;

        const adminPassword: string = values.enableAdminPasword ? values.adminPassword : "";
        this.props.updateAdminPassword(adminPassword);
    }

    onValuesChange = (changedValues: Store, values: Store) => {
        this.setState({
            fromChanged: true,
            enablePassword: values.enableAdminPasword
        });
    };

    checkAdminPassword = (rule: any, value: any) => {
        const form = this.formRef.current;
        if (!form)
            return;
        if (this.state.fromChanged && this.state.enablePassword && (!value || value.length < 8)) {
            return Promise.reject("Password must be at least 8 characters in length");
        }
        return Promise.resolve();
    };

    componentDidUpdate() {
        if (this.props.errorUpdate) {
            notification.error({
                message: "Error updating the configuration",
                description: this.props.errorUpdate,
                placement: "bottomRight",
                duration: 0
            });
        } else if (this.waitingForUpdate && !this.props.isUpdating) {
            notification.success({
                message: "Configuration updated",
                placement: "bottomRight"
            });
            this.waitingForUpdate = false;
            this.setState({fromChanged: false});
        }
        const form = this.formRef.current;
        if (form) {
            form.validateFields();
        }
    }

    render() {
        return (
            <Card title="Security configuration" style={{ width: "100%" }}>
                <div className={styles.configBody}>
                    <h3 className={styles.configTitle}>Admin password</h3>
                    <Form
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 10 }}
                        layout="horizontal"
                        onFinish={this.handleSubmit}
                        onValuesChange={this.onValuesChange}
                        className={styles.formCustom}
                        ref={this.formRef}
                        initialValues={{
                            enableAdminPasword: this.state.enablePassword
                        }}
                    >
                        <Form.Item label="Enable admin password" name="enableAdminPasword" valuePropName="checked">
                            <Switch />
                        </Form.Item>
                        <Form.Item label="Admin password" name="adminPassword" rules={[{ validator: this.checkAdminPassword }]}>
                            <Input.Password disabled={!this.state.enablePassword}/>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                            <Button type="primary" htmlType="submit" disabled={!this.state.fromChanged || this.props.isUpdating}>
                                Save
                            </Button>
                        </Form.Item>
                    </Form>
                    <h3 className={styles.configTitle}>API key</h3>
                    <Row>
                        <Col span={8} className="ant-form-item-label">
                            <label>Jackett API key</label>
                        </Col>
                        <Col span={10}>
                            <Row>
                                <Col span={20}>
                                    <Input disabled defaultValue={this.props.config.api_key}/>
                                </Col>
                                <Col span={4}>
                                    <CopyToClipboard text={this.props.config.api_key}
                                                     onCopy={() => notification.success({
                                                         message: "Copied to clipboard!",
                                                         placement: "bottomRight"
                                                     })}>
                                        <Button type="primary"><CopyOutlined /></Button>
                                    </CopyToClipboard>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </div>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigurationSecurity);
