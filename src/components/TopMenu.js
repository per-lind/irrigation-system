import React, {Component} from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import Menu, { MenuItem } from 'material-ui/Menu';
import { ListItemIcon, ListItemText } from 'material-ui/List';
import AccountCircle from 'material-ui-icons/AccountCircle';
import ArrowForward from 'material-ui-icons/ArrowForward';
import Button from 'material-ui/Button';

module.exports = class TopMenu extends Component {
    constructor(props) {
      super(props);
      this.state = { anchorEl: null, anchorElProfile: null, };

      this.handleMenu = this.handleMenu.bind(this);
      this.handleMenuClose = this.handleMenuClose.bind(this);
      this.handleProfileMenu = this.handleProfileMenu.bind(this);
      this.handleProfileMenuClose = this.handleProfileMenuClose.bind(this);
    }

    handleMenu(event) {
        this.setState({ anchorEl: event.currentTarget });
      };
    
    handleMenuClose() {
        this.setState({ anchorEl: null });
    };

    handleProfileMenu(event) {
        this.setState({ anchorElProfile: event.currentTarget });
      };
    
    handleProfileMenuClose() {
        this.setState({ anchorElProfile: null });
    };
    
    render () {
      const { anchorEl } = this.state;
      const { anchorElProfile } = this.state;
      const openMenu = Boolean(anchorEl);
      const openProfileMenu = Boolean(anchorElProfile);
      const isLoggedIn = Boolean(this.props.userName);

      return(  
        <AppBar position="static">
        <Toolbar>
        <IconButton className={this.props.styles.menuButton} color="inherit" aria-label="Menu" 
            aria-owns={openMenu ? 'menu-appbar' : null}
            aria-haspopup="true"
            onClick={this.handleMenu}
        >
            <MenuIcon />
        </IconButton>
        <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            getContentAnchorEl={null}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            open={openMenu}
            onClose={this.handleMenuClose}
            >
            <MenuItem onClick={this.handleMenuClose}>
              <ListItemIcon>
                <ArrowForward />
              </ListItemIcon>
              <ListItemText inset primary="Mau" />
            </MenuItem>
            <MenuItem onClick={this.handleMenuClose} disabled={!isLoggedIn}>
              <ListItemIcon>
                <ArrowForward />
              </ListItemIcon>
              <ListItemText inset primary="Self destruct" />
            </MenuItem>
            <MenuItem onClick={this.handleMenuClose} disabled={!isLoggedIn}>
              <ListItemIcon>
                <ArrowForward />
              </ListItemIcon>
              <ListItemText inset primary="Run pump" />
            </MenuItem>
        </Menu>

        <Typography variant="title" color="inherit" className={this.props.styles.flex} style={{ flex: 1 }}>
            Water Irrigation System
        </Typography>
        {!this.props.userName == 0 && (
        <div>
            <IconButton
            aria-owns={openProfileMenu ? 'menu-appbar-profile' : null}
            aria-haspopup="true"
            onClick={this.handleProfileMenu}
            color="inherit"
            >
            <AccountCircle />
            </IconButton>
            <Menu
            id="menu-appbar-profile"
            anchorEl={anchorElProfile}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            getContentAnchorEl={null}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={openProfileMenu}
            onClose={this.handleProfileMenuClose}
            >
            <MenuItem onClick={this.handleProfileMenuClose}><a href="/logout">Logout</a></MenuItem>
            </Menu>
        </div>
        )}
        {this.props.userName == 0 && (
        <div>
          <Button color="inherit" onClick={this.props.openLoginPopup}>Login</Button>        
        </div>
        )}

        </Toolbar>
        </AppBar>
      )
    }
}