import React from 'react';
import { spacing } from '@material-ui/system';
import Box from '@material-ui/core/Box';

import MaterialTable from "material-table";
import Button from '@material-ui/core/Button';
import {Route, Switch, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faWrench, faTrash } from '@fortawesome/free-solid-svg-icons';

import fetchIndexers from '../../store/actions/indexers';
import {getIndexersError, getIndexers, getIndexersPending} from '../../store/reducers/indexers';


import './Indexers.scss';

class Indexers extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      dataTable: []
    };
  }

  componentDidMount() {
      let results = [];

      this.props.indexers.forEach(tracker => {

        if (!tracker.configured)
          return;


        let classN = `label label-${tracker.type}`;

        let indexerRender = (
          <span>
          <a className="indexer-name" target="_blank" href={ tracker.site_link } title={ tracker.description }>{ tracker.name }</a>
          <span title={ tracker.type } className={ classN } style={{ textTransform: "capitalize" }}>{ tracker.type }</span>
          </span>
        );

        let actions = (
          <div className="indexer-buttons">
            
            <Button variant="contained" size="small" disableElevation>Copy RSS Feed</Button>
            <Button variant="contained" size="small" disableElevation>Copy Torznab Feed</Button>
            <Button variant="contained" size="small" disableElevation disabled={!tracker.potatoenabled}>Copy Potato Feed</Button> 
       
            <Button variant="contained" size="small" disableElevation><FontAwesomeIcon icon={faSearch} /> Search</Button>
            <Button variant="contained" size="small" disableElevation><FontAwesomeIcon icon={faWrench} /> Edit</Button>
            <Button variant="contained" size="small" disableElevation><FontAwesomeIcon icon={faTrash} /> Remove</Button>

            <Button variant="contained" size="small" disableElevation>Test</Button>

        </div>);

        results.push({
          indexer: tracker.name,
          indexerRender: indexerRender,
          actions: actions
        });


      });

     this.setState({ dataTable: results });
  }

  render() {

    if (this.state.dataTable.length == 0)
      return null;

    return (
      <MaterialTable
      title="Indexers"
      size="small" aria-label="a dense table"
      tableLayout = "fixed"
      columns={[
        {
          title: 'Indexer',
          field: 'indexer',
          searchable: true,
          width: '20%',
          render: rowData => rowData.indexerRender
        },
        {
          title: 'Actions',
          field: 'actions',
          searchable: false,
          sorting: false,
          width: '80%',
          render: rowData => rowData.actions
        }
      ]}
      data={ this.state.dataTable }
      options={{
        sorting: true,
        pageSize: 15,
        headerStyle:{ padding: '5px 30px' },
        cellStyle:{ padding: '5px 30px' },
      }}
    />
    );
  }
}

export default Indexers;
