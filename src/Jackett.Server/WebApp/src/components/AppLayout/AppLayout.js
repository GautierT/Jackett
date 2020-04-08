import React from 'react';
import './AppLayout.scss';
import HeaderNav from '../../containers/HeaderNav/HeaderNav';
import SideBar from '../../containers/SideBar/SideBar';

class AppLayout extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='app-layout'>
        <HeaderNav serverConfig={this.props.serverConfig}/>
        <SideBar serverConfig={this.props.serverConfig}/>
        <div className='app-container' id='app-container'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default AppLayout;
