import React from 'react';
import {connect} from "react-redux";
import {RootState} from "../store/reducers";
import {IndexerConfig, IndexersConfig} from "../store/types/indexersConfig";
import {Card, Select, Table, Form, Input, Button } from 'antd';
import {Store} from 'rc-field-form/lib/interface.d'
//import filesize from "filesize";

// TODO: add props & state
interface State {
    dataTable: Array<IndexerConfig>
}

interface Props {
    apiKey: string
    indexers: IndexersConfig
}

function mapStateToProps(state: RootState) {
    return {
        apiKey: state.config.config.api_key,
        indexers: state.indexers.indexers
    };
}

const mapDispatchToProps = {
}

class Search extends React.Component<Props, State> {

    constructor(props: any) {
        super(props);
        this.state = {
            dataTable: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {


        /*
        fetch(`/api/v2.0/indexers/all/results?apikey=${this.props.apiKey}&Query=&Tracker%5B%5D=1337x`)
            .then(res => res.json())
            .then((data) => {
                this.setState({ dataTable: data.Results })
            })
            .catch(console.error)
*/
    }

    // TODO: move to utils
    encodeQueryData(data: Array<Array<string>>) {
        let ret: Array<string> = [];
        data.forEach((d: Array<string>) => {
            ret.push(encodeURIComponent(d[0]) + '=' + encodeURIComponent(d[1]));
        });
        return ret.join('&');
    }

    handleSubmit(values: Store) {
        let qc: Array<Array<string>> = [];
        qc.push(["apikey", this.props.apiKey]);

        let searchTerm = values.query ? values.query : "";
        qc.push(["Query", searchTerm]);

        if (values.trackers) {
            values.trackers.forEach((tracker: string) => {
                qc.push(["Tracker[]", tracker]);
            })
        }

        fetch("/api/v2.0/indexers/all/results?" + this.encodeQueryData(qc))
            .then(res => res.json())
            .then((data) => {
                this.setState({ dataTable: data.Results })
            })
            .catch(console.error)

    }

    render() {
        const columns = [
            {
                title: 'Published',
                dataIndex: 'PublishDate',
                searchable: false,
                width: '1px',
                sorter: (a:any, b:any) => a.PublishDate.localeCompare(b.PublishDate)
            },
            {
                title: 'Tracker',
                dataIndex: 'Tracker',
                searchable: false,
                width: '1px',
                sorter: (a:any, b:any) => a.Tracker.localeCompare(b.Tracker)
            },
            {
                title: 'Name',
                dataIndex: 'Title',
                width: '100%',
                sorter: (a:any, b:any) => a.Title.localeCompare(b.Title)
                // render: rowData => <a href={rowData.Comments} target="_blank">{ rowData.Title }</a>
            },
            {
                title: 'Size',
                dataIndex: 'Size',
                searchable: false,
                width: '1px',
                // render: rowData => <span style={{ whiteSpace: "nowrap" }}>{ filesize(rowData.Size) }</span>
            },
            {
                title: 'Files',
                dataIndex: 'Files',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Category',
                dataIndex: 'CategoryDesc',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Grabs',
                dataIndex: 'Grabs',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Seeds',
                dataIndex: 'Seeders',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Leechers',
                dataIndex: 'Peers',
                searchable: false,
                width: '1px',
            },
            {
                title: 'DF',
                dataIndex: 'DownloadVolumeFactor',
                searchable: false,
                width: '1px',
            },
            {
                title: 'UF',
                dataIndex: 'UploadVolumeFactor',
                searchable: false,
                width: '1px',
            },
            {
                title: 'DL',
                dataIndex: 'UploadVolumeFactor',
                searchable: false,
                width: '1px',
                //render: rowData => this.downloadLinks(rowData)
            }
        ];

        // TODO: dont keep state, check indexer addition
        const children = this.props.indexers.filter(indexer => indexer.configured).map(indexer => {
            return (<Select.Option key={indexer.id} value={indexer.id}>{indexer.name}</Select.Option>)
        })



        return (
            <Card title="Search" extra={<a href="#">More</a>} style={{ width: "100%" }}>
                <div>
                    <Form
                        layout="inline"
                        style={{marginBottom: "16px"}}
                        onFinish={this.handleSubmit}
                    >
                        <Form.Item label="Query" name="query">
                            <Input placeholder="search term" style={{ width: '350px' }}/>
                        </Form.Item>
                        <Form.Item label="Trackers" name="trackers">
                            <Select
                                mode="multiple"
                                style={{ width: '350px' }}
                                placeholder="all trackers"
                            >
                                {children}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Categories" name="categories">
                            <Select
                                mode="multiple"
                                style={{ width: '350px' }}
                                placeholder="all categories"
                            >
                                {children}
                            </Select>
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit">Search</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Table dataSource={this.state.dataTable} columns={columns} size="small" pagination={{position:["bottomLeft"]}}/>
            </Card>
        );
    }
/*
    downloadLinks(rawData: any) {
        let torrent = rawData.Link ? <a class="downloadlink" title="Download locally" target="_blank" href={rawData.Link}>Down</a> : '';
        let magnet = rawData.MagnetUri ? <a class="downloadlink" title="Download locally (magnet)" target="_blank" href={rawData.MagnetUri}>Magnet</a> : '';
        let blackhole = rawData.BlackholeLink ? <a class="downloadlink jacketdownloadserver" title="Save to server blackhole directory" target="_blank" href={rawData.BlackholeLink}>Blackhole</a> : '';

        return (
            <span>{torrent} {magnet} {blackhole}</span>
        );
    }*/
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
