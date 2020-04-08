import React from 'react';
import SideBarItem from './SideBarItem/SideBarItem';
import {Menu, Divider} from 'semantic-ui-react';
import './SideBar.scss';
import {SideBarHeader} from './SideBarHeader/SideBarHeader';
import {Subscriptions} from './Subscriptions/Subscriptions';

class SideBar extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Menu borderless vertical stackable fixed='left' className='side-nav'>
        <SideBarItem path='/' label='Home' icon='home'/>
        <SideBarItem path='/indexers' label='Indexers' icon='fire'/>
        <SideBarItem path='/search' label='Search' icon='fire'/>
        <SideBarItem path='/cache' label='Cache' icon='fire'/>
        <SideBarItem path='/logs' label='Logs' icon='fire'/>
        <SideBarItem path='/configuration' label='Configuration' icon='fire'/>
        <Divider/>
        <SideBarItem label='Help' icon='help circle'/>
        <SideBarItem label='Report an issue' icon='flag'/>
        <SideBarItem path='/update' label='Check for updates' icon='fire'/>
        <Divider/>
        <div className='footer-block'>
          <div><a href="https://github.com/Jackett/Jackett" target="_blank" title="Jackett on GitHub">Jackett</a></div>
          <div>{this.props.serverConfig.app_version}</div>
        </div>
      </Menu>
    );
  }
}

export default SideBar;
