import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import AccountCircle from 'material-ui-icons/AccountCircle';
import ChevronRight from 'material-ui-icons/ChevronRight';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import SwipeableDrawer from 'material-ui/SwipeableDrawer';

const styles = theme => ({
  appbar: {
    backgroundColor: theme.palette.primary[200],
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
        <Toolbar>
          {isLoggedIn &&
            <IconButton color="inherit" aria-label="Menu" onClick={() => this.toggleMenu(true)}>
              <MenuIcon />
            </IconButton>
          }
          <div style={{ flex: 1 }}></div>
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
