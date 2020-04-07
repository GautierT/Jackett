import React from 'react';
import './AppLayout.scss';
import HeaderNav from '../../containers/HeaderNav/HeaderNav';
import {SideBar} from '../../containers/SideBar/SideBar';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

export function AppLayout(props) {
  return (
    <ScrollToTop>
      <link
  rel="stylesheet"
  href="https://fonts.googleapis.com/icon?family=Material+Icons"
/>
      <div className='app-layout'>
        <HeaderNav/>
        <SideBar/>
        <div className='app-container' id='app-container'>
          {props.children}
        </div>
      </div>
    </ScrollToTop>
  );
}