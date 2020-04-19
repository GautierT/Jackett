import React from 'react';
import {Store} from 'rc-field-form/lib/interface.d'
import {Button, Form, Input, Alert} from 'antd';
import {LockOutlined, UserOutlined} from "@ant-design/icons";

import {doLogin} from "../api/login";
import JackettLogo from "../assets/jackett_logo.png";
import styles from "./Login.module.css"

interface State {
    isLoading: boolean
    isLoginWrong: boolean
    isLoginError: boolean
}

class Login extends React.Component<{}, State> {

    constructor (props: any) {
        super(props);
        this.state = {
            isLoading: false,
            isLoginWrong: false,
            isLoginError: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values: Store) {
        this.setState({ isLoading: true, isLoginWrong: false, isLoginError: false });

        doLogin(values.password)
            .then(response => {
                const responseURL = response.request.responseURL;
                if (responseURL != null && responseURL.includes("/UI/Login")) {
                    this.setState({ isLoading: false, isLoginWrong: true });
                } else {
                    // TODO: we can do better than this
                    window.location.reload();
                }
            })
            .catch(() => {
                this.setState({ isLoading: false, isLoginError: true });
            });
    }

    render() {
        return (
            <div className={styles.centerScreen}>
                <div className={styles.jackettLogo}>
                    <img src={JackettLogo} alt="Jackett logo"/>
                    <span>Jackett</span>
                </div>
                <Form
                    name="normal_login"
                    className={styles.formCustom}
                    initialValues={{
                        username: "Admin"
                    }}
                    onFinish={this.handleSubmit}
                >
                    {this.state.isLoginWrong && <Alert message="The password is incorrect!" type="error" showIcon className={styles.alert} />}
                    {this.state.isLoginError && <Alert message="Unknown error. Please, reload the page." type="error" showIcon className={styles.alert} />}
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Please input your Username!' }]}
                    >
                        <Input prefix={<UserOutlined />} placeholder="Username" disabled />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your Password!' }]}
                    >
                        <Input
                            prefix={<LockOutlined />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" loading={this.state.isLoading} className={styles.buttonCustom}>
                            Log in
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default Login;
