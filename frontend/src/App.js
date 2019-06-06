import React, { Component } from 'react';
import TopMenu from './components/layout/TopMenu';
import Section from './components/layout/Section';
import Loader from './components/layout/Loader';
import Alert from './components/layout/Alert';
import LoginPopup from './components/LoginPopup';
import HardwareList from './components/HardwareList';
import Graph from './components/Graph';
import { logout, getHardwareList } from './actions';
import { auth } from './utilities';

class App extends Component {
  constructor() {
    super()

    this.state = {
      user: undefined,
      dialog: undefined,
      hardware: [],
      loading: false,
      alert: undefined,
    }

    this.logout = this.logout.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.closeDialogs = this.closeDialogs.bind(this);
    this.loadUser = this.loadUser.bind(this);
    this.retrieveHardware = this.retrieveHardware.bind(this);
    this.setLoading = this.setLoading.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  openDialog(name) {
    this.setState({ dialog: name });
  }

  loadUser() {
    const user = auth.getUser();
    this.setState({ user });
    if (user) {
      this.retrieveHardware();
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

  setLoading(loading) {
    this.setState({ loading });
  }

  setAlert(message) {
    this.setState({ alert: message });
  }

  closeAlert() {
    this.setState({ alert: undefined });
  }

  render() {
    const { hardware, user, loading, alert } = this.state;

    const userProps = {
      user: user,
      loadUser: this.loadUser,
      openLoginPopup: () => this.openDialog('login'),
      logout: this.logout,
    };
    const loaderProps = {
      loading,
      setLoading: this.setLoading,
    }
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
              <Graph hardware={hardware} />
            </Section>
            <Section title={"Hardware"}>
              <HardwareList setAlert={this.setAlert} hardware={hardware} {...loaderProps} />
            </Section>
          </React.Fragment>
        }
        <Loader loading={loading} />
        <Alert message={alert} onClose={this.closeAlert} />
      </div>
    );
  }
}

export default App;
