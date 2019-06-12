import React, { Component } from 'react';

import TopMenu from './components/layout/TopMenu';
import Section from './components/layout/Section';
import Loader from './components/layout/Loader';
import Alert from './components/layout/Alert';
import LoginPopup from './components/LoginPopup';
import HardwareList from './components/HardwareList';
import Graph from './components/Graph';
import Events from './components/Events';
import { websocket, context, auth } from './utilities';

const initialState = {
  user: undefined,
  socket: undefined,
  dialog: undefined,
  hardware: [],
  data: [],
  loading: false,
  alert: undefined,
  events: [],
};

class App extends Component {
  constructor() {
    super()

    this.state = {
      ...initialState,
      openDialog: dialog => this.setState({ dialog }),
      closeDialogs: () => this.setState({ dialog: undefined }),
      connect: this.connect,
      disconnect: this.disconnect,
      update: this.update,
    }
  }

  componentDidMount() {
    this.connect();
  }

  update = (state) => {
    this.setState(state);
  }

  connect = () => {
    // Load user
    const user = auth.getUser();
    this.setState({ user });
    // Websocket connection
    if (user) {
      websocket(this.update);
    }
  }

  disconnect = () => {
    // Empty local store
    auth.clearAppStorage();
    // Disconnect socket
    if (this.state.socket) this.state.socket.disconnect();
    // Reset state
    this.setState(initialState);
  }

  render() {
    const { user, socket, hardware } = this.state;

    return (
      <context.Provider value={this.state}>
        <TopMenu />
        <LoginPopup />
        {user && socket &&
          <React.Fragment>
            <Section title={"Data"} >
              <Graph hardware={hardware} />
            </Section>
            <Section title={"Hardware"}>
              <HardwareList />
            </Section>
            <Section title={"Irrigation history"}>
              <Events />
            </Section>
          </React.Fragment>
        }
        <Loader />
        <Alert />
      </context.Provider>
    );
  }
}

export default App;
