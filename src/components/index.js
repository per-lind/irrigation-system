import React, {Component} from 'react';
import {render} from 'react-dom';
import Graph from './Graph';
import TopMenu from './TopMenu';
import LoginPopup from './LoginPopup';
var moment = require('moment');

//Materual-ui-next
import Button from 'material-ui/Button';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';
import { CircularProgress } from 'material-ui/Progress';
import Fade from 'material-ui/transitions/Fade';
import { withStyles } from 'material-ui/styles';
import CssBaseline from 'material-ui/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import green from 'material-ui/colors/green';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },
  container: {
    paddingTop: 200,
  },
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: green,
  },
  status: {
    danger: 'orange',
  },
});


class App extends Component {

  constructor(){
    super();
    this.state = {graphRangeFilter: 12, userName: 0, open: false, 
     invokeResult : {status: "", payload: ""}, loading: false,
     openLoginPopup: false,
    }

    this.openLoginPopup = this.openLoginPopup.bind(this);
    this.closeLoginPopup = this.closeLoginPopup.bind(this);
    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.setGraphRange = this.setGraphRange.bind(this);
  }

  setGraphRange(event) {
    this.setState({graphRangeFilter: event.target.id}, () => {
      this.fetchData();
    })
  }

  fetchData() {
    let fromDate = (moment().subtract(this.state.graphRangeFilter, 'hours')).toISOString()
    fetch('/api?fromDate=' + fromDate, {
      credentials: "same-origin"
    })
      .then(response => response.json())
      .then(data => this.setState({ hits: data }));
  }
  
  invokeFunction(url) {
    this.setState({loading: true});
    fetch(url, {
      credentials: "same-origin"
    })
    .then(response => response.json())
    .then(responseData => responseData)
    .then(data => {
      this.setState({
        invokeResult: data,
        loading: false
      })
    })
  }

  handleClickOpen(url) {
    if(this.state.userName == 0) {
      this.openLoginPopup();
    }
    else {
      this.invokeFunction(url);
      this.setState({ open: true });
    }
  };

  handleClose() {
    this.setState({
      open: false,
      invokeResult: {status: "", payload: ""}
    });
  };

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

  openLoginPopup() {
    this.setState({openLoginPopup : true});
  }

  closeLoginPopup() {
    this.setState({openLoginPopup : false});
  }

  render () {
    
    return (
      <MuiThemeProvider theme={theme}>
      <LoginPopup open={this.state.openLoginPopup} close={this.closeLoginPopup}/>
      <div style={styles.container}>
        <CssBaseline />
        <div>
          <TopMenu styles={styles} userName={this.state.userName} openLoginPopup={this.openLoginPopup} closeLoginPopup={this.closeLoginPopup}/>
        <br/>
        <Graph data={this.state.hits}/>
      </div>
      <div>
        <button id='24' onClick={this.setGraphRange}>24h</button>
        <button id='72' onClick={this.setGraphRange}>3 days</button>
        <button id='168' onClick={this.setGraphRange}>7 days</button>
      </div>
      <div>
        <Button variant="raised" color="primary" onClick={() => this.handleClickOpen("/api/invoke?method=getDistance")}>Get tank water level</Button>
        <br/>
        <Button variant="raised" color="secondary" onClick={() => this.handleClickOpen("/api/invoke?method=ToggleLED")}>Toggle LED</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-tsitle"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"IOT Hub result"}</DialogTitle>
          <DialogContent>
            <div>
              <div>
                <Fade
                  in={this.state.loading}
                  style={{
                    transitionDelay: this.state.loading ? '100ms' : '0ms',
                  }}
                  unmountOnExit
                >
                  <div>Loading <CircularProgress /></div>
                </Fade>
              </div>
              <p>Result: {this.state.invokeResult.payload.Response}</p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
    </MuiThemeProvider>
    )
  }
}

render(<App/>, document.getElementById('app'));
