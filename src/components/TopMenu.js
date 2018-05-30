import React, {Component} from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  appbar: {
    backgroundColor: theme.palette.primary[200],
  },
  toolbar: {
    justifyContent: 'space-between',
  },
});

class TopMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false,
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu(open) {
    this.setState({
      menuOpen: open === true,
    });
  };

  render () {
    const isLoggedIn = Boolean(this.props.userName);

    return (
      <AppBar position="fixed" elevation={0} className={this.props.classes.appbar}>
        <Toolbar className={this.props.classes.toolbar}>
          {isLoggedIn ?
            <IconButton color="inherit" aria-label="Menu" onClick={() => this.toggleMenu(true)}>
              <MenuIcon />
            </IconButton>
            :
            <div></div>
          }
          <Typography variant='title' component='h1' color='textSecondary'>Irrigation system</Typography>
          {isLoggedIn ?
            <Button color="inherit" onClick={this.props.logout}>Logout</Button>
            :
            <Button color="inherit" onClick={this.props.openLoginPopup}>Login</Button>
          }
        </Toolbar>
        <SwipeableDrawer
          open={this.state.menuOpen}
          onClose={this.toggleMenu}
          onOpen={() => this.toggleMenu(true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleMenu}
            onKeyDown={this.toggleMenu}
          >
            <List component="nav">
              <ListItem button>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <ListItemText primary="Action 1" />
              </ListItem>
              <ListItem button>
                <ListItemIcon>
                  <ChevronRight />
                </ListItemIcon>
                <ListItemText primary="Action 2" />
              </ListItem>
            </List>
          </div>
        </SwipeableDrawer>
      </AppBar>
    );
  }
}

export default withStyles(styles)(TopMenu);
