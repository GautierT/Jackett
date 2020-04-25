import React from 'react';
import {Card, Tag} from 'antd';
import {GithubOutlined} from "@ant-design/icons";

import styles from "./Help.module.css";

class HelpReport extends React.Component<{}, {}> {

    render() {
        return (
            <Card className="cardHeader" title="Report an issue">
                <div className={styles.helpBody}>
                    <p>
                        If you have found a bug in Jackett you can open an issue on GitHub.
                        Developers will fix it as soon as possible and all users will benefit.
                    </p>
                    <p>
                        Please take some time to complete all the information required on the template.
                        If it is incomplete we will not be able to help you and the issue will be closed.
                    </p>
                    <p>
                        <Tag icon={<GithubOutlined />} className={styles.reportButton}>
                            <a href="https://github.com/Jackett/Jackett/issues/new" target="_blank" rel="noopener noreferrer">
                                New Issue in Github
                            </a>
                        </Tag>
                    </p>
                </div>
            </Card>
        )
    }
}

export default HelpReport;
