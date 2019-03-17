import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { formatter } from '../../utilities';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { Waves } from '@material-ui/icons';
import Divider from '@material-ui/core/Divider';

const styles = {
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  pos: {
    marginBottom: 12,
  },
  listItem: {
    padding: 2,
  },
  listIcon: {
    fontSize: 15,
  },
  avatar: {
    height: 25,
    width: 25,
  },
};

function Tooltip(props) {
  const { classes, label, payload, active } = props;
  if (!active) return null;
  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h5" component="h3">
          Huvudsta
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {formatter.longDateTime(label)}
        </Typography>
        <Divider />
        <List dense>
          {payload && payload.map(item => {
            const { dataKey, color, name, formatter, value } = item;
            return (
              <ListItem key={dataKey} className={classes.listItem}>
                <Avatar className={classes.avatar} style={{ backgroundColor: color }}>
                  <Waves className={classes.listIcon}/>
                </Avatar>
                <ListItemText primary={name} secondary={formatter(value)} />
              </ListItem>
            )
          })}
        </List>
      </CardContent>
    </Card>
  );
}

Tooltip.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Tooltip);

