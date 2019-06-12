import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { context } from '../../utilities';

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

function TopMenu() {
  const classes = useStyles();
  const { user, openDialog, disconnect } = useContext(context);

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" color="inherit" className={classes.grow}>
            Irrigation system
          </Typography>
          {user ?
            <Button color="inherit" onClick={disconnect}>Logout</Button>
            :
            <Button color="inherit" onClick={() => openDialog('login')}>Login</Button>
          }
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopMenu;
