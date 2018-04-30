import React, {Component} from 'react';
import Graph from './Graph';
import TopMenu from './TopMenu';
import LoginPopup from './LoginPopup';
import WaterLevel from './WaterLevel';
import Footer from './Footer';

import moment from 'moment';
import axios from 'axios'

import Typography from 'material-ui/Typography';
import { CircularProgress } from 'material-ui/Progress';
import Fade from 'material-ui/transitions/Fade';
import { withStyles } from 'material-ui/styles';
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import teal from 'material-ui/colors/teal';
import amber from 'material-ui/colors/amber';
import blueGrey from 'material-ui/colors/blueGrey';
import orange from 'material-ui/colors/orange';

const styles = theme => ({
  main: {
    padding: 20,
    width: '100%',
    maxWidth: 1000,
    margin: '100px auto 10px auto',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: amber,
  },
  status: {
    danger: orange[500],
    disabled: blueGrey[500],
  },
});

const settings = {
  led: { url: "/api/invoke?method=ToggleLED", key: 'led' },
  distance: { url: "/api/invoke?method=getDistance", key: 'waterLevel' },
}

class App extends Component {

  constructor(){
    super();
    this.state = {
      graphRangeFilter: 12,
      userName: 0,
      open: false,
      loading: false,
      loginPopupOpen: false,
      led: undefined,
      waterLevel: undefined,
    }

    this.toggleLoginPopup = this.toggleLoginPopup.bind(this);
    this.login = this.login.bind(this);
    this.setGraphRange = this.setGraphRange.bind(this);
  }

  setGraphRange(value) {
    this.setState({graphRangeFilter: value}, () => this.fetchData())
  }

  fetchData() {
    let fromDate = (moment().subtract(this.state.graphRangeFilter, 'hours')).toISOString()
    fetch('/api?fromDate=' + fromDate, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => this.setState({ hits: data }));
  }

  invokeFunction(type) {
    if(this.state.userName == 0) {
      this.toggleLoginPopup(true);
    }
    else {
      const url = settings[type].url;
      const key = settings[type].key;
      this.setState({ loading: true });
      axios
        .get(url, { credentials: 'same-origin' })
        .then(res => {
          this.setState({
            [key]: res.data.payload.Response,
            loading: false
          })
        })
    }
  }

  login(password) {
    axios
      .post('/login', { username: 'user1', password: password })
      .then(response => {
        this.setState({ loginPopupOpen: false })
        this.checkLogin()
      })
  }

  checkLogin() {
    fetch('/api/checkLogin', {
      credentials: "same-origin"
    })
    .then(response => { return response.json();})
    .then(responseData => {return responseData;})
    .then(data => {this.setState({"userName" : data});})
  }

  componentDidMount() {
    this.checkLogin()
    this.fetchData()
  }

  toggleLoginPopup(open) {
    this.setState({loginPopupOpen : open === true});
  }

  render () {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <TopMenu userName={this.state.userName} openLoginPopup={() => this.toggleLoginPopup(true)} />
        <LoginPopup open={this.state.loginPopupOpen} close={this.toggleLoginPopup} login={this.login} />
        <div className={this.props.classes.main}>
          <Typography variant='title' component='h1'>Irrigation system</Typography>
          <Graph data={this.state.hits} setRange={this.setGraphRange} selected={this.state.graphRangeFilter} />
          <Typography variant='title' component='h2'>Actions</Typography>
          <WaterLevel value={this.state.waterLevel} onClick={() => this.invokeFunction('distance')} loading={this.state.loading}/>
        </div>
        <Footer />
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App);
