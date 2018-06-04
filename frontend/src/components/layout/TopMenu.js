import React from 'react';
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem } from 'reactstrap';

const TopMenu = props =>  {
  return (
    <Navbar>
      <NavbarBrand href="/">Irrigation system</NavbarBrand>
      {props.user ?
        <Nav className="ml-auto" navbar>
          <NavItem>
            Hello, {props.user.username}!{'  '}
            <Button className='navbar-btn' onClick={props.logout}>Logout</Button>
          </NavItem>
        </Nav>
        :
        <Nav className="ml-auto" navbar>
          <NavItem>
            <Button className='navbar-btn' onClick={props.openLoginPopup}>Login</Button>
          </NavItem>
        </Nav>
      }
    </Navbar>
  );
}

export default TopMenu;
