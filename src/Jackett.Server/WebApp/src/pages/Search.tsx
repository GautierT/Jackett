import React from 'react';
import {connect} from "react-redux";
import {RootState} from "../store/reducers";
import {IndexersConfig} from "../store/types/indexersConfig";
import {Card, Select, Table, Form, Input, Button, Tag} from 'antd';
import {Store} from 'rc-field-form/lib/interface.d'
import filesize from "filesize";
import moment from "moment";
import {ColumnsType} from "antd/lib/table/interface";
import MagnetIcon from "../assets/magnet.svg";
import DownloadIcon from "../assets/download.svg";
import UploadIcon from "../assets/upload.svg";
import "./Search.css";
import {getSearchResults, SearchResponse, SearchResult} from "../api/search";


// TODO: add props & state
interface State {
    searchResponse: SearchResponse
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

    constructor(props: Props) {
        super(props);
        this.state = {
            searchResponse: {} as SearchResponse
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

    handleSubmit(values: Store) {
        // TODO: add categories
        getSearchResults(this.props.apiKey, values.query, values.trackers)
            .then(response => {
                this.setState({ searchResponse: response.data })
            })
            .catch(error => {
                console.error(error);
            });
    }

    jackettTimespan(date: string) {
        const now = moment();
        const from = moment(date);
        const timeSpan = moment.duration(now.diff(from));

        const minutes = timeSpan.asMinutes();
        if (minutes < 120) {
            return Math.round(minutes) + 'm ago';
        }

        const hours = timeSpan.asHours();
        if (hours < 48) {
            return Math.round(hours) + 'h ago';
        }

        const days = timeSpan.asDays();
        if (days < 365) {
            return Math.round(days) + 'd ago';
        }

        const years = timeSpan.asYears();
        return Math.round(years) + 'y ago';
    }

    downloadLinks(record: SearchResult) {
        let torrent = record.Link ? <a href={record.Link}><img src={DownloadIcon} alt="Download torrent"/></a> : '';
        let magnet = record.MagnetUri ? <a href={record.MagnetUri}><img src={MagnetIcon} alt="Download magnet"/></a> : '';
        let blackhole = record.BlackholeLink ? <a href={record.BlackholeLink}><img src={UploadIcon} alt="Save in Blackhole directory"/></a> : '';

        return (
            <span className="download-icons">{torrent} {magnet} {blackhole}</span>
        );
    }

    // TODO: add banner & description tooltip
    // TODO: add tvrage y otros valores que no están en jackett ?
    releaseTags(record: SearchResult) {
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
            labels.push(<Tag color="green">FREELEECH</Tag>);
        } else if (record.DownloadVolumeFactor < 1) {
            labels.push(<Tag color="geekblue">{(record.DownloadVolumeFactor * 100).toFixed(0) + " % DL"}</Tag>);
        } else if (record.DownloadVolumeFactor > 1) {
            labels.push(<Tag color="red">{(record.DownloadVolumeFactor * 100).toFixed(0) + " % DL"}</Tag>);
        }

        if (record.UploadVolumeFactor === 0) {
            labels.push(<Tag color="volcano">NO UPLOAD</Tag>);
        } else if (record.UploadVolumeFactor != 1) {
            labels.push(<Tag color="blue">{(record.UploadVolumeFactor * 100).toFixed(0) + " % UL"}</Tag>);
        }

        if (record.Imdb) {
            const imdbUrl = "http://www.imdb.com/title/tt" + ("0000000" + record.Imdb).slice(-8) + "/";
            labels.push(<Tag color="gold"><a href={imdbUrl} title="IMDB" target="_blank" rel="noopener noreferrer">IMDB</a></Tag>);
        }

        return (
            [labels]
        )
    }

    render() {
        const columns: ColumnsType<any> = [
            {
                title: 'Published',
                dataIndex: 'PublishDate',
                width: '1px',
                defaultSortOrder: 'ascend',
                sorter: (a:SearchResult, b:SearchResult) => b.PublishDate.localeCompare(a.PublishDate),
                render: (text:string, record:SearchResult) => <span style={{whiteSpace: "nowrap"}}>{this.jackettTimespan(record.PublishDate)}</span>
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
                render: (text:string, record:SearchResult) => this.downloadLinks(record)
            },
            {
                title: 'Name',
                dataIndex: 'Title',
                width: '100%',
                sorter: (a:SearchResult, b:SearchResult) => a.Title.localeCompare(b.Title),
                render: (text:string, record:SearchResult) => <span><a href={record.Comments} target="_blank" rel="noopener noreferrer">{record.Title}</a> {this.releaseTags(record)}</span>
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
        const children = this.props.indexers.filter(indexer => indexer.configured).map(indexer => {
            return (<Select.Option key={indexer.id} value={indexer.id}>{indexer.name}</Select.Option>)
        })



        return (
            <Card title="Search" style={{ width: "100%" }}>
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
                <Table
                    dataSource={this.state.searchResponse.Results}
                    columns={columns}
                    size="small"
                    pagination={{position:["bottomLeft"]}}
                    showSorterTooltip={false}
                />
            </Card>
        );
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
