import React from 'react';
import {connect} from "react-redux";
import {Store} from 'rc-field-form/lib/interface.d'
import {Button, Card, Form, Input, notification, Switch} from 'antd';
import {FormInstance} from "antd/lib/form";

import {updateAdminPassword} from "../store/thunks/serverConfig";
import {RootState} from "../store/reducers";
import {ServerConfig} from "../api/configuration";
import "./Configuration.css";

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

class Security extends React.Component<Props, State> {
    formRef = React.createRef<FormInstance>();
    waitingForUpdate = false;

    constructor (props: Props) {
        super(props);
        this.state = {
            fromChanged: false,
            enablePassword: !!this.props.config.password
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values: Store) {
        notification.destroy();
        this.waitingForUpdate = true;

        const adminPassword: string = values.enableAdminPasword ? values.adminPassword : "";
        this.props.updateAdminPassword(adminPassword);
    }

    onValuesChange = (changedValues: Store, values: Store) => {
        this.setState({
            fromChanged: true,
            enablePassword: values.enableAdminPasword
        });
        const form = this.formRef.current;
        if (form) {
            form.validateFields();
        }
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

    render() {
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
            this.setState({fromChanged: false});
        }

        return (
            <Card title="Security configuration" style={{ width: "100%" }}>
                <Form
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 10 }}
                    layout="horizontal"
                    className="config-form"
                    onFinish={this.handleSubmit}
                    onValuesChange={this.onValuesChange}
                    ref={this.formRef}
                    initialValues={{
                        enableAdminPasword: this.state.enablePassword,
                        apiKey: this.props.config.api_key
                    }}
                >
                    <h3 className="config-title">Admin password</h3>
                    <Form.Item label="Enable admin password" name="enableAdminPasword">
                        <Switch defaultChecked={this.state.enablePassword}/>
                    </Form.Item>
                    <Form.Item label="Change admin password" name="adminPassword" rules={[{ validator: this.checkAdminPassword }]}>
                        <Input.Password disabled={!this.state.enablePassword}/>
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 10, offset: 8 }}>
                        <Button type="primary" htmlType="submit" disabled={!this.state.fromChanged || this.props.isUpdating}>
                            Save
                        </Button>
                    </Form.Item>

                    <h3 className="config-title">API key</h3>
                    <Form.Item label="Jackett API key" name="apiKey">
                        <Input disabled/>
                    </Form.Item>
                </Form>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Security);
