import React from 'react';
import SideBarItem from './SideBarItem/SideBarItem';
import {Menu, Divider} from 'semantic-ui-react';
import './SideBar.scss';
import {SideBarHeader} from './SideBarHeader/SideBarHeader';
import {Subscriptions} from './Subscriptions/Subscriptions';
import {SideBarFooter} from './SideBarFooter/SideBarFooter';

export class SideBar extends React.Component {
  render() {
    return (
      <Menu borderless vertical stackable fixed='left' className='side-nav'>
        <SideBarItem path='/' label='Home' icon='home'/>
        <SideBarItem path='/indexers' label='Indexers' icon='fire'/>
        <SideBarItem path='/search' label='Search' icon='fire'/>
        <SideBarItem label='Followers' icon='spy'/>
        <Divider/>
        <SideBarItem label='Report history' icon='flag'/>
        <SideBarItem label='Help' icon='help circle'/>
        <SideBarItem label='Send feedback' icon='comment'/>
        <Divider/>
        <SideBarFooter/>
      </Menu>
    );
  }
}