import React, {Component} from 'react';
import Button from 'material-ui/Button';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import { CircularProgress } from 'material-ui/Progress';
import Pool from 'material-ui-icons/Pool';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';

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
