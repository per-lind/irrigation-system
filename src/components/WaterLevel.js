import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CircularProgress from '@material-ui/core/CircularProgress';
import Pool from '@material-ui/icons/Pool';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
});

const WaterLevel = props => (
  <ExpansionPanel>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>Water level</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
        Tank water level: {props.loading ? <CircularProgress/> : props.value}
      </Typography>
    </ExpansionPanelDetails>
    <Divider />
    <ExpansionPanelActions>
      <Button color="primary" onClick={props.onClick} disabled={props.loading}>
        <Pool /> Get water level
      </Button>
    </ExpansionPanelActions>
  </ExpansionPanel>
);

export default withStyles(styles)(WaterLevel);
