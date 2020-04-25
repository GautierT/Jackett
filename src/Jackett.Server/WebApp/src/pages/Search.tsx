import React, {ReactNode} from 'react';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from "react-router";
import filesize from "filesize";
import qs from "qs"
import {Store} from 'rc-field-form/lib/interface.d'
import {Card, Select, Table, Form, Input, Button, Tag, Row, Col, Modal} from 'antd';
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
    isResultsModalVisible: boolean
    isErrorModalVisible: boolean
    errorModalBody: ReactNode
    indexersOptions: ReactNode[]
    categoriesOptions: ReactNode[]
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
    indexersKeyMap: {[key: string]: string} = {};
    categoriesKeyMap: {[key: string]: string} = {};
    tableColumns: ColumnsType<any> = [
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

    constructor(props: Props) {
        super(props);
        this.state = {
            isLoading: false,
            isResultsModalVisible: false,
            isErrorModalVisible: false,
            errorModalBody: "",
            indexersOptions: [],
            categoriesOptions:[],
            searchResponse: {} as SearchResponse,
            searchResults: [],
            tableDataSource: []
        };
    }

    encodeKeyValueSelect = (key: string, value:string): string => {return key + "||" + value};
    decodeKeyValueSelect = (value: string): string => {return value.split("||")[0];}

    loadConfiguredIndexers = () => {
        // temporary dictionary with reversed key/value to sort by value
        let tmpDict: {[key: string]: string} = {};
        this.props.configuredIndexers.forEach(indexer => {
            tmpDict[indexer.name] = indexer.id;
        })
        let indexersKeyMap: {[key: string]: string} = {};
        let indexersOptions: ReactNode[] = [];
        Object.keys(tmpDict).sort().forEach(key => {
            const value = this.encodeKeyValueSelect(tmpDict[key], key);
            indexersKeyMap[tmpDict[key]] = value;
            indexersOptions.push(<Select.Option key={value} value={value}>{key}</Select.Option>);
        })
        this.indexersKeyMap = indexersKeyMap;
        this.setState({ indexersOptions: indexersOptions });
    }

    loadCategories = (selectIndexers: string[]) => {
        const selectedIndexers = selectIndexers.map((key: string) => this.decodeKeyValueSelect(key));
        let cats: {[key: string]: string} = {};
        this.props.configuredIndexers.forEach(indexer => {
            if (selectedIndexers.length === 0 || selectedIndexers.includes(indexer.id)) {
                indexer.caps.forEach(cat => {
                    if (parseInt(cat.ID) < 100000 || selectedIndexers.length === 1)
                        cats[cat.ID] = cat.Name;
                });
            }
        });
        let categoriesKeyMap: {[key: string]: string} = {};
        let categoriesOptions: ReactNode[] = [];
        Object.keys(cats).sort((a, b) => parseInt(a) - parseInt(b)).forEach(key => {
            const value = this.encodeKeyValueSelect(key, cats[key]);
            categoriesKeyMap[key] = value;
            const label = `(${key}) ${cats[key]}`;
            categoriesOptions.push(<Select.Option key={value} value={value}>{label}</Select.Option>)
        })
        this.categoriesKeyMap = categoriesKeyMap;
        this.setState({ categoriesOptions: categoriesOptions });
    }

    onIndexersChange = (values: string[]) => {
        this.loadCategories(values);
        // remove categories that have been removed from the list
        const form = this.formRef.current;
        if (form) {
            const searchCategories = form.getFieldValue("cats")
                .filter((cat: string) => this.decodeKeyValueSelect(cat) in this.categoriesKeyMap);
            form.setFieldsValue({
                cats: searchCategories
            });
        }
    }

    handleSubmit = (values: Store) => {
        if (this.state.isLoading)
            return;
        this.setState({ isLoading: true })

        // parse indexers and categories
        const indexers = values.indexers.map((key: string) => this.decodeKeyValueSelect(key));
        const cats = values.cats.map((key: string) => this.decodeKeyValueSelect(key));

        // perform search
        getSearchResults(this.props.apiKey, values.query, indexers, cats)
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
                // we always add query parameter (it's checked to perform the search when the page reloads)
                query: values.query || "",
                indexers: indexers,
                cats: cats
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

    handleShowResultsModal = () => {
        this.setState({isResultsModalVisible: true});
    }

    handleOnCloseResultsModal = () => {
        this.setState({isResultsModalVisible: false});
    }

    handleShowErrorModal = (id: string) => {
        const indexerResponse = this.state.searchResponse.Indexers.filter(indexer => indexer.ID === id)[0];

        this.setState({
            isErrorModalVisible: true,
            errorModalBody: <span>{indexerResponse.Name}<br/>{indexerResponse.Error}</span>
        });
    }

    handleOnCloseErrorModal = () => {
        this.setState({isErrorModalVisible: false});
    }

    componentDidMount() {
        // get form values from url
        const searchTerm = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).query;

        // indexers: remove the values not in the list and convert to key||value format
        let searchIndexers = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).indexers || [];
        this.loadConfiguredIndexers();
        searchIndexers = searchIndexers
            .filter((indexer: string) => indexer in this.indexersKeyMap)
            .map((indexer: string) => this.indexersKeyMap[indexer]);

        // categories: remove the values not in the list and convert to key||value format
        let searchCategories = qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).cats || [];
        this.loadCategories(searchIndexers);
        searchCategories = searchCategories
            .filter((cat: string) => cat in this.categoriesKeyMap)
            .map((cat: string) => this.categoriesKeyMap[cat]);

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

    render() {
        // TODO: fix grabs sorting (maybe more fields)


        const hasResponse = !!this.state.searchResponse.Indexers;

        // TODO: type
        let resultIndexersTable: object[] = [];
        let subHeaderStyle: object = {display: "none"};
        let subHeaderResult: ReactNode = "";
        if (hasResponse) {
            let subHeaderErrors: ReactNode[] = [];
            this.state.searchResponse.Indexers.forEach(indexer => {
                resultIndexersTable.push({
                    id: indexer.ID,
                    name: indexer.Name,
                    results: indexer.Error ? 100000: indexer.Results,
                    message: indexer.Error ? <b>Error</b> : `${indexer.Results} results`
                });

                if (indexer.Error) {
                    subHeaderErrors.push(
                        <Button key={indexer.ID} size="small" type="link" danger className={styles.subHeaderLink}
                                onClick={() => this.handleShowErrorModal(indexer.ID)}>{indexer.Name}</Button>
                    );
                }
            });
            const subHeaderError = subHeaderErrors.length > 0 ? <span> &nbsp;&nbsp;&nbsp; Errors {subHeaderErrors}</span> : "";

            subHeaderResult = <div>
                Found<Button type="link"  className={styles.subHeaderLink} onClick={() => this.handleShowResultsModal()}>
                {this.state.searchResponse.Results.length} results in {
                    this.state.searchResponse.Indexers.length} indexers</Button>
                {subHeaderError}
            </div>;
            subHeaderStyle = {};
        }


        return (
            <Card className="cardHeader" title={
                    <Row className={styles.headerRow}>
                        <Col span={4}>
                            Search
                        </Col>
                        <Col span={20} className={styles.headerFilter}>
                            <Form
                                layout="inline"
                                className={styles.formCustom}
                                onFinish={this.handleSubmit}
                                ref={this.formRef}
                            >
                                <Row className={styles.headerRow}>
                                    <Col span={6}>
                                        <Form.Item name="query" className={styles.formCustomInput}>
                                            <Input placeholder="Search term"/>
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                <Form.Item name="indexers" className={styles.formCustomInput}>
                                    <Select mode="multiple" placeholder="All indexers"
                                            onChange={(values: string[]) => this.onIndexersChange(values)}>
                                        {this.state.indexersOptions}
                                    </Select>
                                </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                <Form.Item name="cats" className={styles.formCustomInput}>
                                    <Select mode="multiple" placeholder="All categories">
                                        {this.state.categoriesOptions}
                                    </Select>
                                </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit" disabled={this.state.isLoading}>Search</Button>
                                </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                }>
                <Row className={styles.subHeaderRow} style={subHeaderStyle}>
                    <Col span={20}>
                        {subHeaderResult}
                    </Col>
                    <Col span={4} className={styles.subHeaderFilter}>
                        <TableFilter
                            inputData={this.state.searchResponse.Results}
                            filterColumns={["Tracker", "Title", "CategoryDesc"]}
                            resetTextOnDataChange={true}
                            onFilter={(outputData) => this.setState({tableDataSource: outputData})}
                            className={styles.subHeaderFilterInput}
                        />
                    </Col>
                </Row>
                <Table
                    dataSource={this.state.tableDataSource}
                    columns={this.tableColumns}
                    rowKey="Guid"
                    size="small"
                    className={styles.tableCustom}
                    bordered
                    pagination={{
                        position:["bottomLeft"],
                        showSizeChanger: true,
                        defaultPageSize: 20,
                        pageSizeOptions: ["10", "20", "50", "100", "1000"]
                    }}
                    showSorterTooltip={false}
                    loading={this.state.isLoading}
                />
                <Modal
                    visible={this.state.isResultsModalVisible}
                    centered
                    title={"Search results"}
                    onOk={this.handleOnCloseResultsModal}
                    onCancel={this.handleOnCloseResultsModal}
                >
                    <Table
                        dataSource={resultIndexersTable}
                        size="small"
                        rowKey="id"
                        className={styles.resultsModalCustom}
                        bordered
                        pagination={{
                            position:["bottomLeft"],
                            showSizeChanger: true,
                            defaultPageSize: 20,
                            pageSizeOptions: ["10", "20", "50", "100", "1000"]
                        }}
                        showSorterTooltip={false}
                    >
                        <Table.Column
                            title="Name"
                            dataIndex="name"
                            sorter={(a:any, b:any) => b.name.localeCompare(a.name)}
                        />
                        <Table.Column
                            title="Results"
                            dataIndex="results"
                            defaultSortOrder="descend"
                            sorter={(a:any, b:any) => a.results - b.results}
                            render={(text:string, record:any) => <span>{record.message}</span>}
                        />
                    </Table>
                </Modal>
                <Modal
                    visible={this.state.isErrorModalVisible}
                    centered
                    title={"Indexer error"}
                    width={"60%"}
                    onOk={this.handleOnCloseErrorModal}
                    onCancel={this.handleOnCloseErrorModal}
                >
                    {this.state.errorModalBody}
                </Modal>
            </Card>
        );
    }

}

export default withRouter(connect(mapStateToProps, null)(Search));
