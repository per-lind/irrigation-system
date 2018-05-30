import React, {Component} from 'react';
import Graph from './Graph';
import TopMenu from './TopMenu';
import LoginPopup from './LoginPopup';
import WaterLevel from './WaterLevel';
import Footer from './Footer';

import moment from 'moment';
import axios from 'axios'

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';
import amber from '@material-ui/core/colors/amber';
import blueGrey from '@material-ui/core/colors/blueGrey';
import orange from '@material-ui/core/colors/orange';

//import * as AzureStorage from 'azurestorage';

const styles = theme => ({
  main: {
    padding: 20,
    width: '100%',
    maxWidth: 1000,
    margin: '60px auto 10px auto',
  },
});

const theme = createMuiTheme({
  palette: {
    primary: blueGrey,
    secondary: amber,
    textSecondary: '#fff',
  },
  status: {
    danger: orange[500],
    disabled: blueGrey[500],
  },
});

const settings = {
  relay1: { url: "/api/invoke?method=ToggleRelay1", key: 'relay1' },
  relay2: { url: "/api/invoke?method=ToggleRelay2", key: 'relay2' },
  relay3: { url: "/api/invoke?method=ToggleRelay3", key: 'relay3' },
  pow1: { url: "/api/invoke?method=TogglePow1", key: 'pow1' },
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
      blobToken: undefined,
      blobTokenExp: undefined,
      blobURL: undefined,
    }

    this.toggleLoginPopup = this.toggleLoginPopup.bind(this);
    this.login = this.login.bind(this);
    this.setGraphRange = this.setGraphRange.bind(this);
    this.getSASToken = this.getSASToken.bind(this);
    this.getBlobUrl = this.getBlobUrl.bind(this);
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

  getSASToken() {
    return axios
      .get('/api/blobSAS', { credentials: 'same-origin' })
      .then(res => { return res.data });
  }

  async getBlobUrl() {
    if(!this.state.blobToken) {
      console.log('No token set, getting')
      const tokenResult = await this.getSASToken();
      this.state.blobToken = tokenResult.sasToken;
      this.state.blobTokenExp = tokenResult.sasExpiry;
    }
    else if(new Date(this.state.blobTokenExp) < (new Date()+10)) {
      console.log('Token found but expiering in 10min, renewing')
      const tokenResult = await this.getSASToken();
      this.state.blobToken = tokenResult.sasToken;
      this.state.blobTokenExp = tokenResult.sasExpiry;
    }
    console.log('Got valid token, continue')
    const containerName = 'iot-data'
    const filter = 'Huvudsta/' + moment().format('YYYYMMDD');
    const blobUri = "https://peliiot.blob.core.windows.net"
    const blobSAS = this.state.blobToken
    const blobService = AzureStorage.Blob.createBlobServiceWithSas(blobUri, blobSAS)
    blobService.listBlobsSegmentedWithPrefix(containerName, filter, null, {delimiter: "", maxResults : 10}, (err, result)=> {
      if (err) {
          console.log("Couldn't list blobs for container %s", containerName);
          console.error(err);
      } else {
          console.log('Successfully listed blobs for container %s', containerName);
          console.log(result.entries[0]);
          console.log(result.continuationToken);
          const blobURL = blobService.getUrl(containerName, result.entries[0].name, blobSAS);
          this.setState({blobURL: blobURL});
      }
      });
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
          
          <Graph data={this.state.hits} setRange={this.setGraphRange} selected={this.state.graphRangeFilter} />
          <Typography variant='title' component='h2'>Actions</Typography>
          <Button variant="raised" color="secondary" onClick={() => this.invokeFunction('relay1')}>Relay1</Button> 
          <Button variant="raised" color="secondary" onClick={() => this.invokeFunction('relay2')}>Relay2</Button> 
          <Button variant="raised" color="secondary" onClick={() => this.invokeFunction('relay3')}>Relay3</Button> 
          <Button variant="raised" color="secondary" onClick={() => this.invokeFunction('pow1')}>Pow1</Button> 
          <WaterLevel value={this.state.waterLevel} onClick={() => this.invokeFunction('distance')} loading={this.state.loading}/>
          <br/>
          <Button variant="raised" color="primary" onClick={() => this.getBlobUrl()}>BlobTest</Button>         
          <br/>
          <img width='400'src={this.state.blobURL}/>
        </div>
        <Footer />
      </MuiThemeProvider>
    )
  }
}

export default withStyles(styles)(App);
