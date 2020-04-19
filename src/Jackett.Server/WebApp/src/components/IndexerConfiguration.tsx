import * as React from "react";
// TODO: replace ReactNode with React.ReactNode1
import {ReactNode} from "react";
import {Form, Input, Select, Switch, Modal, Button, Alert} from "antd";
import {FormInstance} from "antd/lib/form";

import {
    IndexerConfig, ConfigFieldType, IndexerConfigField, IndexerConfigFields
} from "../api/indexers";
import styles from "./IndexerConfiguration.module.css";

interface Props {
    indexerConfig: IndexerConfig
    configFields: IndexerConfigFields
    onConfigured: ((indexerConfig: IndexerConfig, configFields: IndexerConfigFields) => void)
    onCancel: (() => void)
}

class IndexerConfiguration extends React.Component<Props, {}> {
    formRef = React.createRef<FormInstance>();

    renderModal = (): React.ReactNode => {
        let initialValues: {[key: string]: string} = {};
        this.props.configFields.forEach(configField => {
            initialValues[configField.id] = configField.value;
        });

        return (
            <Modal
                visible={true}
                style={{ marginTop: 30 }}
                centered
                title={"Configure " + this.props.indexerConfig.name}
                onCancel={this.handleOnCancel}
                footer={[
                    <Button key="back" onClick={this.handleOnCancel}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOnConfigured}>
                        Configure
                    </Button>,
                ]}
            >
                {this.props.indexerConfig.description ? <Alert message={this.props.indexerConfig.description} type="info" className={styles.alert} /> : ""}
                <Form
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    className={styles.formCustom}
                    initialValues={initialValues}
                    ref={this.formRef}
                >
                    {this.props.configFields.map(configField => {
                        return this.renderConfigField(configField);
                    })}
                </Form>
            </Modal>
        )
    }

    renderConfigField = (configField: IndexerConfigField): ReactNode => {
        switch (configField.type) {
            case ConfigFieldType.HiddenData:
            case ConfigFieldType.DisplayInfo:
                let components: Array<ReactNode> = [(
                    <Form.Item label={configField.name} name={configField.id} key={configField.id} className={styles.fieldHidden}>
                        <Input />
                    </Form.Item>
                )];
                if (configField.type === ConfigFieldType.DisplayInfo) {
                    components.push(<Alert
                        message={<div dangerouslySetInnerHTML={{__html: configField.name + "<br/>" + configField.value}}/>}
                        type="info"
                        className={styles.alert}
                    />);
                }
                return components;
            case ConfigFieldType.InputString:
                return (
                    <Form.Item label={configField.name} name={configField.id} key={configField.id}>
                        {configField.id.toLowerCase() === "password" ? <Input.Password /> : <Input />}
                    </Form.Item>
                );
            case ConfigFieldType.InputBool:
                return (
                    <Form.Item label={configField.name} name={configField.id} key={configField.id} valuePropName="checked">
                        <Switch />
                    </Form.Item>
                );/*
            case ConfigFieldType.InputCheckbox:
                return (
                    <Form.Item label={configField.name} name={configField.id} key={configField.id}>
                        <Input />
                    </Form.Item>
                );*/

            case ConfigFieldType.InputSelect:
                return (
                    <Form.Item label={configField.name} name={configField.id} key={configField.id}>
                        <Select>
                            {Object.keys(configField.options).map((key: string) => (
                                <Select.Option key={key} value={key}>{configField.options[key]}</Select.Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
                /*
            case ConfigFieldType.ReCaptcha:
                if (window.jackettIsLocal) {
                    var version = $el.find('.jackettrecaptcha').data("version");
                    switch (version) {
                        case "1":
                            var frameDoc = $("#jackettrecaptchaiframe")[0].contentDocument;
                            itemEntry.version = version;
                            itemEntry.challenge = $("#recaptcha_challenge_field", frameDoc).val()
                            itemEntry.value = $("#recaptcha_response_field", frameDoc).val()
                            break;
                        case "2":
                            itemEntry.value = $('.g-recaptcha-response').val();
                            break;
                    }
                } else {
                    itemEntry.cookie = $el.find(".setup-item-recaptcha input").val();
                }
                break;*/
            // TODO: default exception
        }

    }

    handleOnConfigured = () => {
        const form = this.formRef.current;
        // TODO: improve this kind of error handling
        if (!form)
            return;

        const configFields: IndexerConfigFields = this.props.configFields.map(configField => {
            return {
                ...configField,
                value: form.getFieldValue(configField.id)
            };
        });

        // call parent callback
        this.props.onConfigured(this.props.indexerConfig, configFields);
    }

    handleOnCancel = () => {
        // call parent callback
        this.props.onCancel();
    }

    /*
    renderConfigField = (configField: IndexerConfigField) => {
        switch (configField.type) {
            case ConfigFieldType.HiddenData:
                itemEntry.value = $el.find(".setup-item-hiddendata input").val();
                break;
            case ConfigFieldType.InputString:
                itemEntry.value = $el.find(".setup-item-inputstring input").val();
                break;
            case ConfigFieldType.InputBool:
                itemEntry.value = $el.find(".setup-item-inputbool input").is(":checked");
                break;
            case ConfigFieldType.InputCheckbox:
                itemEntry.values = [];
                $el.find(".setup-item-inputcheckbox input:checked").each(function () {
                    itemEntry.values.push($(this).val());
                });
                break;
            case ConfigFieldType.InputSelect:
                itemEntry.value = $el.find(".setup-item-inputselect select").val();
                break;
            case ConfigFieldType.ReCaptcha:
                if (window.jackettIsLocal) {
                    var version = $el.find('.jackettrecaptcha').data("version");
                    switch (version) {
                        case "1":
                            var frameDoc = $("#jackettrecaptchaiframe")[0].contentDocument;
                            itemEntry.version = version;
                            itemEntry.challenge = $("#recaptcha_challenge_field", frameDoc).val()
                            itemEntry.value = $("#recaptcha_response_field", frameDoc).val()
                            break;
                        case "2":
                            itemEntry.value = $('.g-recaptcha-response').val();
                            break;
                    }
                } else {
                    itemEntry.cookie = $el.find(".setup-item-recaptcha input").val();
                }
                break;
                // TODO: default exception
        }

    }*/

    render() {
        return this.renderModal();
    }
}

export default IndexerConfiguration;
