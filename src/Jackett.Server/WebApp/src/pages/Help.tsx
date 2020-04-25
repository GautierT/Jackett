import React from 'react';
import {Button, Card, Tag} from 'antd';
import {CopyOutlined} from "@ant-design/icons";

import styles from "./Help.module.css";
import {connect} from "react-redux";
import {ServerConfig} from "../api/configuration";
import {RootState} from "../store/reducers";

interface Props {
    serverConfig: ServerConfig
}

function mapStateToProps(state: RootState) {
    return {
        serverConfig: state.config.config
    };
}

class Help extends React.Component<Props, {}> {

    render() {
        return (
            <Card className="cardHeader" title="Help">
                <div className={styles.helpBody}>
                    <h3  className={styles.helpTitle}>Adding a Jackett indexer in Sonarr or Radarr</h3>
                    <ol>
                        <li>
                            Go to <b>Settings > Indexers > Add > Torznab > Custom</b>
                        </li>
                        <li>Click on the indexers corresponding
                            <Button size="small" icon={<CopyOutlined />} className={styles.helpButton}>Torznab Feed</Button>
                            button and paste it into the Sonarr/Radarr <b>URL</b> field
                        </li>
                        <li>For the <b>API key</b> use
                            <Tag className={styles.helpApiKey}>{this.props.serverConfig.api_key}</Tag>
                        </li>
                        <li>Configure the correct category IDs via the <b>(Anime) Categories</b> options. See the
                            Jackett indexer capabilities for a list of supported categories
                        </li>
                    </ol>

                    <h3  className={styles.helpTitle}>Adding a Jackett indexer in CouchPotato</h3>
                    <ol>
                        <li>
                            Go to <b>Settings > Searchers</b>
                        </li>
                        <li>
                            Enable <b>TorrentPotato</b>
                        </li>
                        <li>
                            Click on the indexers corresponding
                            <Button size="small" icon={<CopyOutlined />} className={styles.helpButton}>Potato Feed</Button>
                            button and paste it into the CouchPotato <b>Host</b> field
                        </li>
                        <li>
                            For the <b>Passkey</b> use
                            <Tag className={styles.helpApiKey}>{this.props.serverConfig.api_key}</Tag>
                        </li>
                        <li>
                            Leave the <b>Username</b> field blank
                        </li>
                    </ol>

                    <h3  className={styles.helpTitle}>Adding a Jackett indexer to RSS clients (RSS feed)</h3>
                    <ol>
                        <li>
                            Click on the indexers corresponding
                            <Button size="small" icon={<CopyOutlined />} className={styles.helpButton}>RSS Feed</Button>
                            button and paste it into the <b>URL</b> field of the RSS client
                        </li>
                        <li>
                            You can adjust the <b>q</b> (search string) and <b>cat</b> (categories) arguments
                            accordingly<br/>
                            E.g. <b>...&cat=2030,2040&q=big+buck+bunny</b> will search for "big buck bunny" in the
                            Movies/SD (2030) and Movies/HD (2040) categories<br/>
                            See the Jackett indexer capabilities for available categories
                        </li>
                    </ol>
                </div>
            </Card>
        )
    }
}

export default connect(mapStateToProps, null)(Help);
