import React from 'react';
import MaterialTable from "material-table";
//import filesize from "filesize";

// TODO: add props & state
class Search extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            dataTable: []
        };
    }

    componentDidMount() {

        fetch('/api/v2.0/indexers/all/results?apikey=bszqtu44xg5j5ukfptaafrf57rknv9ud&Query=&Tracker%5B%5D=1337x')
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
                field: 'PublishDate',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Tracker',
                field: 'Tracker',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Name',
                field: 'Title',
                width: '100%',
                // render: rowData => <a href={rowData.Comments} target="_blank">{ rowData.Title }</a>
            },
            {
                title: 'Size',
                field: 'Size',
                searchable: false,
                width: '1px',
                // render: rowData => <span style={{ whiteSpace: "nowrap" }}>{ filesize(rowData.Size) }</span>
            },
            {
                title: 'Files',
                field: 'Files',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Category',
                field: 'CategoryDesc',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Grabs',
                field: 'Grabs',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Seeds',
                field: 'Seeders',
                searchable: false,
                width: '1px',
            },
            {
                title: 'Leechers',
                field: 'Peers',
                searchable: false,
                width: '1px',
            },
            {
                title: 'DF',
                field: 'DownloadVolumeFactor',
                searchable: false,
                width: '1px',
            },
            {
                title: 'UF',
                field: 'UploadVolumeFactor',
                searchable: false,
                width: '1px',
            },
            {
                title: 'DL',
                field: 'UploadVolumeFactor',
                searchable: false,
                width: '1px',
                //render: rowData => this.downloadLinks(rowData)
            }
        ];

        return (
            <MaterialTable
                title="Search"
                //size="small" aria-label="a dense table"
                //tableLayout = "fixed"
                columns={columns}
                data={ this.state.dataTable }
                options={{
                    sorting: true,
                    pageSize:20,
                    headerStyle:{ padding: '5px' },
                    //cellStyle:{ padding: '5px' },
                }}
            />
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

export default Search;
