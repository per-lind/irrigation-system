import React, { Component } from 'react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Observations from './components/Observations';
import Action from './components/Action';
import Gallery from './components/Gallery';
import LoginPopup from './components/LoginPopup';
import request from './utilities/request';
import auth from './utilities/auth';
import './styles/main.scss';

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: undefined,
      dialog: undefined,
    }

    this.logout = this.logout.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialogs = this.closeDialogs.bind(this);
    this.loadUser = this.loadUser.bind(this);
  }

  openDialog(name) {
    this.setState({ dialog: name });
  }

  loadUser() {
    this.setState({user: auth.getUser()})
  }

  logout() {
    request({
      url: '/api/logout',
    }).then(response => {
      auth.clearAppStorage();
      this.loadUser();
    });
  }

  closeDialogs() {
    this.setState({ dialog: undefined });
  }

  componentDidMount() {
    this.loadUser();
  }

  render() {
    const userProps = {
      user: this.state.user,
      loadUser: this.loadUser,
      openLoginPopup: () => this.openDialog('login'),
      logout: this.logout,
    };
    const modalProps = (name) => ({
      isOpen: this.state.dialog === name,
      onClose: this.closeDialogs,
    });

    return (
      <div className="App">
        <Header {...userProps} />
        <main>
          <h2>Observations</h2>
          <Observations />
          {this.state.user &&
            <div>
              <h2>Actions</h2>
              <Action method='ToggleRelay1' {...userProps} />
              <Action method='ToggleRelay2' {...userProps} />
              <Action method='ToggleRelay3' {...userProps} />
              <Action method='TogglePow1' {...userProps} />
              <Action method='getDistance' {...userProps} />
              <h2>Gallery</h2>
              <Gallery {...userProps} />
          <br/>
          <img width='400'src={this.state.blobURL}/>
            </div>
          }
        </main>
        <Footer/>
        <LoginPopup {...{...userProps, ...modalProps('login')}} />
      </div>
    );
  }
}

export default App;
