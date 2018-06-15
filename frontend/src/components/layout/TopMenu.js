import React, { Component } from 'react';
import {
  Button,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem } from 'reactstrap';

class TopMenu extends Component {
  constructor() {
    super();

    this.state = { prevOffset: 0, scrollClass: 'visible' };

    this.handleScroll = this.handleScroll.bind(this);
  }


  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    let currentOffset = window.pageYOffset;
    let scrollClass;
    if (currentOffset == 0) scrollClass = 'visible';
    if (currentOffset - this.state.prevOffset > 50) scrollClass = 'hidden';
    if (this.state.prevOffset - currentOffset > 50) scrollClass = 'up';

    if (scrollClass) {
      this.setState({
        prevOffset: currentOffset,
        scrollClass: scrollClass,
      });
    }
  }

  render() {
    const props = this.props;

    return (
      <Navbar className={this.state.scrollClass} id={props.id || ''}>
        <NavbarBrand href="/">Irrigation system</NavbarBrand>
        {props.user ?
          <Nav className="ml-auto" navbar>
            <NavItem>
              Hello, {props.user.username}!
            </NavItem>
            <NavItem>
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
}

export default TopMenu;
