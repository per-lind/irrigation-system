import React, { useContext } from 'react';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Slide from '@material-ui/core/Slide';
import { makeStyles } from '@material-ui/core/styles';
import { context } from '../../utilities';

const useStyles = makeStyles(theme => ({
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  icon: {
    marginRight: theme.spacing(1),
    opacity: 0.9,
  },
  closeIcon: {
    fontSize: 20,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

function Alert() {
  const classes = useStyles();
  const { alert, update } = useContext(context);

  return (
    <div>
      <Snackbar
        TransitionComponent={Slide}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!alert}
        onClose={() => update({ alert: undefined })}
      >
        <SnackbarContent
          className={classes.error}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              <ErrorIcon className={classes.icon} />
              {alert}
            </span>
          }
          action={[
            <IconButton key="close" aria-label="Close" color="inherit" onClick={() => update({ alert: undefined })}>
              <CloseIcon className={classes.closeIcon} />
            </IconButton>,
          ]}
        />
      </Snackbar>
    </div>
  );
}

export default Alert;
