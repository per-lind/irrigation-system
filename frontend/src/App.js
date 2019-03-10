import React, { Component } from 'react';
import TopMenu from './components/layout/TopMenu';
import Section from './components/layout/Section';
import LoginPopup from './components/LoginPopup';
import HardwareList from './components/HardwareList';
import Graph from './components/Graph';
import { getGraphData, logout, getHardwareList } from './actions';
import { auth } from './utilities';

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: undefined,
      dialog: undefined,
      hardware: [],
    }

    this.logout = this.logout.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialogs = this.closeDialogs.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.retrieveHardware = this.retrieveHardware.bind(this);
    this.retrieveGraphData = this.retrieveGraphData.bind(this);
  }

  openDialog(name) {
    this.setState({ dialog: name });
  }

  loadUser() {
    const user = auth.getUser();
    this.setState({ user });
    if (user) {
      this.retrieveHardware();
      this.retrieveGraphData();
    }
  }

  logout() {
    logout().then(response => {
      this.loadUser();
    });
  }

  closeDialogs() {
    this.setState({ dialog: undefined });
  }

  componentDidMount() {
    this.loadUser();
  }

  retrieveHardware() {
    getHardwareList()
      .then(hardware => this.setState({ hardware: hardware }))
      .catch(error => {
        console.log('Error retrieving list of hardware!')
        console.log(error)
      })
  }

  retrieveGraphData() {
    getGraphData()
      .then(data => this.setState({ data }))
      .catch(error => {
        console.log('Error retrieving data!')
        console.log(error)
      })
  }

  render() {
    const { hardware, user, data } = this.state;

    const userProps = {
      user: user,
      loadUser: this.loadUser,
      openLoginPopup: () => this.openDialog('login'),
      logout: this.logout,
    };
    const modalProps = (name) => ({
      isOpen: this.state.dialog === name,
      onClose: this.closeDialogs,
    });

    return (
      <div>
        <TopMenu {...userProps}/>
        <LoginPopup {...userProps} {...modalProps('login')} />
        {user &&
          <React.Fragment>
            <Section title={"Data"} >
              <Graph data={data} hardware={hardware} />
            </Section>
            <Section title={"Hardware"}>
              <HardwareList hardware={hardware} />
            </Section>
          </React.Fragment>
        }
      </div>
    );
  }
}

export default App;
