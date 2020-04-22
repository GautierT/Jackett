import React from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import filesize from "filesize";
import qs from "qs"
import {Store} from 'rc-field-form/lib/interface.d'
import {Card, Select, Table, Form, Input, Button, Tag, Row, Col} from 'antd';
import {ColumnsType} from "antd/lib/table/interface";
import {FormInstance} from "antd/lib/form";

import {RootState} from "../store/reducers";
import {IndexerConfig} from "../api/indexers";
import {getSearchResults, SearchResponse, SearchResult} from "../api/search";
import {jackettTimespan} from "../utils";
import TableFilter from "../components/TableFilter";
import MagnetIcon from "../assets/magnet.svg";
import DownloadIcon from "../assets/download.svg";
import UploadIcon from "../assets/upload.svg";
import styles from "./Search.module.css";

interface State {
    isLoading: boolean
    searchResponse: SearchResponse
    searchResults: Array<SearchResult>
    tableDataSource: any[]
}

interface Props extends RouteComponentProps {
    apiKey: string
    configuredIndexers: Array<IndexerConfig>
}

function mapStateToProps(state: RootState) {
    return {
        apiKey: state.config.config.api_key,
        configuredIndexers: state.indexers.configuredIndexers
    };
}

class Search extends React.Component<Props, State> {
    formRef = React.createRef<FormInstance>();

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            searchResponse: {} as SearchResponse,
            searchResults: [],
            tableDataSource: []
        };
    }

    componentDidMount() {
        // get form values from url
        const searchTerm = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).query;
        const searchIndexers = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).indexers;
        const searchCategories = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).cats;

        // TODO: check the values are in the list before adding
        const form = this.formRef.current;
        if (form) {
            // set form values
            form.setFieldsValue({
                query: searchTerm,
                indexers: searchIndexers,
                cats: searchCategories
            });

            // perform search
            if (typeof searchTerm !== 'undefined') {
                form.submit();
            }
        }
    }

    handleSubmit = (values: Store) => {
        if (this.state.isLoading)
            return;

        // TODO: add categories
        // perform search
        this.setState({ isLoading: true })
        getSearchResults(this.props.apiKey, values.query, values.indexers)
            .then(response => {
                this.setState({
                    isLoading: false,
                    searchResponse: response.data,
                    searchResults: response.data.Results
                })
            })
            .catch(error => {
                // TODO: show the error
                console.error(error);
                this.setState({ isLoading: false })
            });

        // change url params
        this.props.history.push({
            search: qs.stringify({
                query: values.query || "",  // we always add this parameter (it's checked to perform the search when the page reloads)
                indexers: values.indexers,
                cats: values.cats
            }, { arrayFormat: 'brackets' })
        });
    }

    generateDownloadLinks(record: SearchResult) {
        let torrent = record.Link ? <a href={record.Link}><img src={DownloadIcon} alt="Download torrent"/></a> : '';
        let magnet = record.MagnetUri ? <a href={record.MagnetUri}><img src={MagnetIcon} alt="Download magnet"/></a> : '';
        let blackHole = record.BlackholeLink ? <a href={record.BlackholeLink}><img src={UploadIcon} alt="Save in Blackhole directory"/></a> : '';

        return (
            <span className={styles.downloadIcons}>{torrent} {magnet} {blackHole}</span>
        );
    }

    // TODO: add banner & description tooltip
    // TODO: add tvrage and other values available in the response ?
    generateNameWithTags(record: SearchResult) {
        let labels = [];
/*
        var TitleTooltip = "";
        if (Banner)
            TitleTooltip += "<img src='" + Banner + "' /><br />";
        if (Description)
            TitleTooltip += Description;

        if (TitleTooltip) {
            TitleLink.data("toggle", "tooltip");
            TitleLink.tooltip({
                title: TitleTooltip,
                html: true
            });
        }
*/

        if (record.DownloadVolumeFactor === 0) {
            labels.push(<Tag color="green" key="dvf">FREELEECH</Tag>);
        } else if (record.DownloadVolumeFactor < 1) {
            labels.push(<Tag color="geekblue" key="dvf">{(record.DownloadVolumeFactor * 100).toFixed(0) + " % DL"}</Tag>);
        } else if (record.DownloadVolumeFactor > 1) {
            labels.push(<Tag color="red" key="dvf">{(record.DownloadVolumeFactor * 100).toFixed(0) + " % DL"}</Tag>);
        }

        if (record.UploadVolumeFactor === 0) {
            labels.push(<Tag color="volcano" key="uvf">NO UPLOAD</Tag>);
        } else if (record.UploadVolumeFactor !== 1) {
            labels.push(<Tag color="blue" key="uvf">{(record.UploadVolumeFactor * 100).toFixed(0) + " % UL"}</Tag>);
        }

        if (record.Imdb) {
            const imdbUrl = "http://www.imdb.com/title/tt" + ("0000000" + record.Imdb).slice(-8) + "/";
            labels.push(<Tag color="gold" key="imdb"><a href={imdbUrl} title="IMDB" target="_blank" rel="noopener noreferrer">IMDB</a></Tag>);
        }

        return (
            <span>
                <a href={record.Comments} target="_blank" rel="noopener noreferrer">{record.Title}</a>
                {" "}{[labels]}
            </span>
        )
    }

    render() {
        // TODO: remove df uf?
        const columns: ColumnsType<any> = [
            {
                title: 'Published',
                dataIndex: 'PublishDate',
                width: '1px',
                defaultSortOrder: 'ascend',
                sorter: (a:SearchResult, b:SearchResult) => b.PublishDate.localeCompare(a.PublishDate),
                render: (text:string, record:SearchResult) => <span style={{whiteSpace: "nowrap"}}>{jackettTimespan(record.PublishDate)}</span>
            },
            {
                title: 'Tracker',
                dataIndex: 'Tracker',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.Tracker.localeCompare(b.Tracker),
                render: (text:string, record:SearchResult) => <span style={{whiteSpace: "nowrap"}}>{record.Tracker}</span>
            },
            {
                title: 'DL',
                dataIndex: 'UploadVolumeFactor',
                width: '1px',
                render: (text:string, record:SearchResult) => this.generateDownloadLinks(record)
            },
            {
                title: 'Name',
                dataIndex: 'Title',
                width: '100%',
                sorter: (a:SearchResult, b:SearchResult) => a.Title.localeCompare(b.Title),
                render: (text:string, record:SearchResult) => this.generateNameWithTags(record)
            },
            {
                title: 'Size',
                dataIndex: 'Size',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.Size - b.Size,
                render: (text:string, record:SearchResult) => <span style={{whiteSpace: "nowrap"}}>{filesize(record.Size)}</span>
            },
            {
                title: 'Files',
                dataIndex: 'Files',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.Files - b.Files
            },
            {
                title: 'Category',
                dataIndex: 'CategoryDesc',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.CategoryDesc.localeCompare(b.CategoryDesc),
                render: (text:string, record:SearchResult) => <span style={{whiteSpace: "nowrap"}}>{record.CategoryDesc}</span>
            },
            {
                title: 'Grabs',
                dataIndex: 'Grabs',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.Grabs - b.Grabs
            },
            {
                title: 'Seeds',
                dataIndex: 'Seeders',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.Seeders - b.Seeders
            },
            {
                title: 'Leechers',
                dataIndex: 'Peers',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.Peers - b.Peers
            },
            {
                title: 'DF',
                dataIndex: 'DownloadVolumeFactor',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.DownloadVolumeFactor - b.DownloadVolumeFactor
            },
            {
                title: 'UF',
                dataIndex: 'UploadVolumeFactor',
                width: '1px',
                sorter: (a:SearchResult, b:SearchResult) => a.UploadVolumeFactor - b.UploadVolumeFactor
            }
        ];

        // TODO: dont keep state, check indexer addition
        const children = this.props.configuredIndexers.map(indexer => {
            return (<Select.Option key={indexer.id} value={indexer.id}>{indexer.name}</Select.Option>)
        })

        return (
            <Card title="Search" style={{ width: "100%" }}>
                <div>
                    <Form
                        layout="inline"
                        className={styles.formCustom}
                        onFinish={this.handleSubmit}
                        ref={this.formRef}
                    >
                        <Form.Item label="Query" name="query">
                            <Input placeholder="search term" style={{ width: '350px' }}/>
                        </Form.Item>
                        <Form.Item label="Indexers" name="indexers">
                            <Select
                                mode="multiple"
                                style={{ width: '350px' }}
                                placeholder="all indexers"
                            >
                                {children}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Categories" name="cats">
                            <Select
                                mode="multiple"
                                style={{ width: '350px' }}
                                placeholder="all categories"
                            >
                                {children}
                            </Select>
                        </Form.Item>
                        <Form.Item >
                            <Button type="primary" htmlType="submit" disabled={this.state.isLoading}>Search</Button>
                        </Form.Item>
                    </Form>
                </div>
                <Row className={styles.headerRow}>
                    <Col span={12}>
                       Result:
                    </Col>
                    <Col span={12} className={styles.headerFilter}>
                        <TableFilter
                            inputData={this.state.searchResponse.Results}
                            filterColumns={["Tracker", "Title", "CategoryDesc"]}
                            resetTextOnDataChange={true}
                            onFilter={(outputData) => this.setState({tableDataSource: outputData})}
                            className={styles.headerFilterInput}
                        />
                    </Col>
                </Row>
                <Table
                    dataSource={this.state.tableDataSource}
                    columns={columns}
                    rowKey="Guid"
                    size="small"
                    className={styles.tableCustom}
                    pagination={{
                        position:["bottomLeft"],
                        showSizeChanger: true,
                        defaultPageSize: 15,
                        pageSizeOptions: ["15", "30", "50", "100", "1000"]
                    }}
                    showSorterTooltip={false}
                    loading={this.state.isLoading}
                />
            </Card>
        );
    }

}

export default withRouter(connect(mapStateToProps, null)(Search));
