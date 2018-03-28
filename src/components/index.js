import React, {Component} from 'react';
import {render} from 'react-dom';
import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import AccountCircle from 'material-ui-icons/AccountCircle';

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
     invokeResult : {status: "", payload: ""}, loading: false, anchorEl: null,
    }

    this.handleClickOpen = this.handleClickOpen.bind(this);
    this.handleMenu = this.handleMenu.bind(this),
    this.handleClose = this.handleClose.bind(this);
    this.handleClose2 = this.handleClose2.bind(this);
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
    this.invokeFunction(url);
    //.then(response => { console.log(this.state.invokeResult);
    this.setState({ open: true });
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

  dateFormat(tickItem) {
    return moment(tickItem).format('ddd HH:mm')
  }

  loginForm() {
    if(this.state.userName == 0) {
      return(
      <form action="/login" method="post">
        <input type="hidden" name="username" defaultValue="user1"/>
        <input type="password" name="password"/>
        <input type="submit" value="Submit"/></form>)
    }
    else {
      return(
        <div>
        <a href="/logout">Logout</a><br/>
        </div>
      )
    }
  }


  handleMenu(event) {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose2() {
    this.setState({ anchorEl: null });
  };

  render () {
    const open = Boolean(this.state.anchorEl);
    return (
      <MuiThemeProvider theme={theme}>
      <div style={styles.container}>
        <CssBaseline />
        <div className={styles.root}>
          <AppBar position="static">
            <Toolbar>
              <IconButton className={styles.menuButton} color="inherit" aria-label="Menu">
                <MenuIcon />
              </IconButton>
              <Typography variant="title" color="inherit" className={styles.flex}>
                Title
              </Typography>
              {!this.state.userName == 0 && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : null}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={this.state.anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={open}
                  onClose={this.handleClose2}
                >
                  <MenuItem onClick={this.handleClose2}>Profile</MenuItem>
                  <MenuItem onClick={this.handleClose2}>My account</MenuItem>
                </Menu>
              </div>
            )}
            </Toolbar>
          </AppBar>
        </div>
        <div>
        <br/>
        <ComposedChart width={700} height={500} data={this.state.hits}>
          <XAxis dataKey="timestamp" name="Date" reversed={true} tickFormatter={this.dateFormat}/>
          <YAxis yAxisId="left" type="number" domain={[10,35]}/>
          <YAxis yAxisId="left2"/>
          <YAxis yAxisId="right" orientation="right" type="number" domain={[975,1025]}/>
          <Tooltip formatter={this.props.drawTooltip} /> 
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="1 1"/>
          <Bar yAxisId="left2" name="Light" isAnimationActive={false} dataKey="measures.light" barSize={40} fill="#ffcc66"/> 
          <Line yAxisId="left" name="Temp" isAnimationActive={false} type="monotone" dataKey="measures.temperature1" stroke="#8884d8" unit="C" dot={false}/>
          <Line yAxisId="left" name="Humidity" isAnimationActive={false} type="monotone" dataKey="measures.humidity" legendType="square" stroke="#82ca9d" unit="%" dot={false}/>
          <Line yAxisId="right" name="Pressure" isAnimationActive={false} type="monotone" dataKey="measures.sealevelpressure" legendType="cross" stroke="#FF0000" unit="hPa" dot={false}/>
      </ComposedChart>
      </div>
      <div>
        <button id='24' onClick={this.setGraphRange}>24h</button>
        <button id='72' onClick={this.setGraphRange}>3 days</button>
        <button id='168' onClick={this.setGraphRange}>7 days</button>
      </div>
      <div>
        {this.loginForm()}
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
