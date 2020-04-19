// TODO: replace ReactNode with React.ReactNode1
import * as React from "react";
import {ReactNode} from "react";
import {Alert, Button, Checkbox, Form, Input, Modal, Select, Switch} from "antd";
import {FormInstance} from "antd/lib/form";

import {ConfigFieldType, IndexerConfig, IndexerConfigField, IndexerConfigFields} from "../api/indexers";
import {getKeyByValue} from "../utils";
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
        let initialValues: {[key: string]: string | string[]} = {};
        let hasReCaptcha = false;
        this.props.configFields.forEach(configField => {
            if (configField.type === ConfigFieldType.InputCheckbox) {
                // this is a special case, InputCheckbox has field values instead of value
                // we have to convert the values into Ant Checkbox format
                // "values": ["2", "3"],
                // "options": {"0": "Undefined", "2": "MPEG-2", "3": "VC-1", "1": "H.264"}
                // expected => initialValues: ["MPEG-2", "VC-1"]
                initialValues[configField.id] = configField.values.map(value => configField.options[value])
            } else if (configField.type === ConfigFieldType.ReCaptcha) {
                // this is deprecated and should be removed after it's removed from the backend
                // https://github.com/Jackett/Jackett/issues/8268
                // ReCaptcha is not working since long time, we are using the header cookie as a workaround
                const cookieHeaderList = this.props.configFields.filter(configField => configField.id === "cookieheader");
                initialValues[configField.id] = cookieHeaderList.length > 0 ? cookieHeaderList[0].value : "";
                hasReCaptcha = true;
            } else {
                initialValues[configField.id] = configField.value;
            }
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
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 18 }}
                    layout="horizontal"
                    className={styles.formCustom}
                    initialValues={initialValues}
                    ref={this.formRef}
                >
                    {
                        // skip username and password if there is a ReCaptcha
                        this.props.configFields
                            .filter(configField => !((configField.id === 'username' || configField.id === 'password') && hasReCaptcha))
                            .map(configField => {
                                const renderField = this.renderConfigField(configField);
                                if (configField.id === "sitelink" && this.props.indexerConfig.alternativesitelinks.length > 0) {
                                    return [renderField, this.renderAlternativeSiteLinks()];
                                } else {
                                    return renderField;
                                }
                            })
                    }
                </Form>
            </Modal>
        )
    }

    renderConfigField = (configField: IndexerConfigField): ReactNode => {
        switch (configField.type) {
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
                );
            case ConfigFieldType.InputCheckbox:
                const checkboxOptions = Object.values(configField.options).map((value: string) => value)
                return (
                    <Form.Item label={configField.name} name={configField.id} key={configField.id}>
                        <Checkbox.Group options={checkboxOptions} />
                    </Form.Item>
                );
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
            case ConfigFieldType.DisplayImage:
                // TODO: not tested, try XSpeeds with Captcha
                return (
                    <img src={configField.value} alt={configField.name} key={configField.id}/>
                );
            case ConfigFieldType.DisplayInfo:
                let infoMsg = configField.name ? `<i>${configField.name}:</i><br/>` : "";
                infoMsg += configField.value;
                return (
                    <Alert
                        message={<div dangerouslySetInnerHTML={{__html: infoMsg}}/>}
                        type="info"
                        className={styles.alert}
                        key={configField.id}
                    />
                );
            case ConfigFieldType.HiddenData:
                // we don't need to render hidden fields, they are skipped later
                return "";
            case ConfigFieldType.ReCaptcha:
                // this is deprecated and should be removed after it's removed from the backend
                // https://github.com/Jackett/Jackett/issues/8268
                return (
                    <div key={configField.id}>
                        <Alert
                            message={<p>This site requires you to solve a ReCaptcha. It's no longer possible to solve
                                the captcha in Jackett. Please enter the cookie for the site manually.
                                <a href="https://github.com/Jackett/Jackett/wiki/Finding-cookies" target="_blank" rel="noopener noreferrer"> See here </a>
                                on how get the cookies.</p>}
                            type="info"
                            className={styles.alert}
                        />
                        <Form.Item label="Cookie header" name={configField.id}>
                            <Input />
                        </Form.Item>
                    </div>
                );
            default:
                throw new Error("Not implemented!");
        }

    }

    renderAlternativeSiteLinks = () => {
        return (
            <Alert
                message={
                    <div>
                        This indexer has multiple known URLs:
                        <ul>
                            {this.props.indexerConfig.alternativesitelinks.map(siteLink =>
                                <li key={siteLink}>
                                    <Button
                                        type="link"
                                        size="small"
                                        onClick={() => this.changeSiteLink(siteLink)}
                                    >{siteLink}</Button>
                                </li>
                            )}
                        </ul>
                        Click on an URL to copy it to the Site Link field.
                    </div>
                }
                type="info"
                className={styles.alert}
                key="alternativeSiteLinks"
            />
        );
    }

    changeSiteLink = (siteLink: string) => {
        const form = this.formRef.current;
        // TODO: improve this kind of error handling
        if (!form)
            return;
        form.setFieldsValue({sitelink: siteLink});
    }

    handleOnConfigured = () => {
        const form = this.formRef.current;
        // TODO: improve this kind of error handling
        if (!form)
            return;

        let configFields: IndexerConfigFields = this.props.configFields.map(configField => {
            const fieldValue = form.getFieldValue(configField.id);
            if (fieldValue) { // ignore fields that are not in the form (DisplayInfo, DisplayImage...)
                if (configField.type === ConfigFieldType.InputCheckbox) {
                    // this is a special case, InputCheckbox has field values instead of value
                    // we have to convert the values into Ant Checkbox format
                    // fieldValue: ["MPEG-2", "VC-1"],
                    // "options": {"0": "Undefined", "2": "MPEG-2", "3": "VC-1", "1": "H.264"}
                    // expected => values: ["2", "3"]
                    return {
                        ...configField,
                        values: fieldValue.map((value: string) => getKeyByValue(configField.options, value) as string)
                    }
                } else if (configField.type === ConfigFieldType.ReCaptcha) {
                    // this is a special case, ReCaptcha has field cookie instead of value
                    return {
                        ...configField,
                        cookie: fieldValue
                    }
                } else {
                    return {
                        ...configField,
                        value: fieldValue
                    }
                }
            }
            return configField;
        });

        // call parent callback
        this.props.onConfigured(this.props.indexerConfig, configFields);
    }

    handleOnCancel = () => {
        // call parent callback
        this.props.onCancel();
    }

    render() {
        return this.renderModal();
    }
}

export default IndexerConfiguration;
