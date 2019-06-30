import React, { Component } from 'react';

import TopMenu from './components/layout/TopMenu';
import Section from './components/layout/Section';
import Loader from './components/layout/Loader';
import Alert from './components/layout/Alert';
import LoginPopup from './components/LoginPopup';
import HardwareList from './components/HardwareList';
import Graph from './components/Graph';
import CancelJobs from './components/CancelJobs';
import Events from './components/Events';
import { websocket, context, auth } from './utilities';
import _ from 'lodash';

const initialState = {
  user: undefined,
  socket: undefined,
  dialog: undefined,
  hardware: [],
  data: [],
  loading: false,
  alerts: [],
  irrigation: [],
  events: {},
};

class App extends Component {
  constructor() {
    super()

    this.state = {
      ...initialState,
      openDialog: dialog => this.setState({ dialog }),
      closeDialogs: () => this.setState({ dialog: undefined }),
      addAlert: this.addAlert,
      popAlert: () => this.setState({ alerts: _.drop(this.state.alerts) }),
      connect: this.connect,
      disconnect: this.disconnect,
      update: this.update,
      addEvent: this.addEvent,
    }
  }

  componentDidMount() {
    this.connect();
  }

  update = (state) => {
    this.setState(state);
  }

  addAlert = message => this.setState({ alerts: [...this.state.alerts, message] })

  addEvent = event => this.setState({ events: _.merge(this.state.events, event) })

  connect = () => {
    // Load user
    const user = auth.getUser();
    this.setState({ user });
    // Websocket connection
    if (user) {
      websocket(this.update, this.addAlert, this.addEvent);
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
            <Section>
              <Graph
                hardware={hardware}
                methods={['read_light', 'read_humidity', 'read_pressure']}
              />
            </Section>
            <Section title={"Cancel jobs"} >
              <CancelJobs />
            </Section>
            <Section title={"Hardware"}>
              <HardwareList />
            </Section>
            <Section title={"Soil moisture"} >
              <Graph
                hardware={hardware}
              methods={['read_water_level', 'read_mcp3008_soil_moisture']}
              />
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
