import React, {Component} from 'react';
import TopMenu from './TopMenu';

class Header extends Component {
  render () {
    return (
      <header className="App-header">
        <TopMenu {...this.props}/>
      </header>
    );
  }
}

export default Header;
