import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import VoiceInput from './components/VoiceInput';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#888',
    boxShadow: '0px 3px 3px 3px rgba(0,0,0,0.3)',
  },
  header: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: '#ffffee',
    color: '#000',
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Paper className={classes.header}>
        <Typography variant="h3" component="h3">
          Voice to Text App
        </Typography>
      </Paper>
      <VoiceInput/>
    </div>
  );
}

export default App;