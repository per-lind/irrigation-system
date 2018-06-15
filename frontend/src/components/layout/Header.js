import React, { Component } from 'react';
import Logo from './Logo';

class Header extends Component {
  render () {
    return (
      <header className="App-header">
        <Logo size={60} />
        <h1>Irrigation system</h1>
      </header>
    );
  }
}

export default Header;
