import * as React from 'react';
import { Button, ScrollView, Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import {vibrate} from './utils';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

class SessionControl extends React.Component {
  render(){
    return(
      <View style={styles.control}>
        <Text style={styles.paragraph}>Session Length: </Text>
        <Button onPress={this.props.increment} title="^"></Button>
        <Text style={styles.paragraph}>{this.props.length}</Text>
        <Button onPress={this.props.decrement} title="v"></Button>
      </View>
    )
  }
}

class BreakControl extends React.Component {
  render(){
    return(
      <View style={styles.control}>
        <Text style={styles.paragraph}>Break Length: </Text>
        <Button onPress={this.props.increment} title="^"></Button>
        <Text style={styles.paragraph}>{this.props.length}</Text>
        <Button onPress={this.props.decrement} title="v"></Button>
      </View>
    )
  }
}

export default class App extends React.Component {
  constructor(){
    super();
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      count: 1500,
      break: false,
      textDisplay: "Press play to start",
      running: false,
      seconds: "00",
      minutes: "25",
    }
  }
  
  componentDidMount = () => {
    this.setState({
      count: this.state.sessionLength * 60,
    })
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  sessionIncrement = () => {
    clearInterval(this.interval);
    if(this.state.sessionLength < 60){
      this.setState( (prevState) => ({
        sessionLength: prevState.sessionLength + 1,
        minutes: String(prevState.sessionLength + 1),
        seonds: "00",
        count: (prevState.sessionLength*60) + 60,
        running: false,
        textDisplay: "Press play to start"
      }));
    }
  }
  sessionDecrement = ()=> {
    clearInterval(this.interval);
    if(this.state.sessionLength > 1){
      this.setState( (prevState)=> ({
        sessionLength: prevState.sessionLength - 1,
        minutes: String(prevState.sessionLength - 1),
        seconds: "00",
        count: (prevState.sessionLength*60) - 60,
        running: false,
        textDisplay: "Press play to start"
      }));
    }
  }
  breakIncrement = () => {
    clearInterval(this.interval);
    if(this.state.breakLength < 60){
      this.setState( (prevState) => ({
        breakLength: prevState.breakLength + 1,
        running: false,
        textDisplay: "Press play to start"
      }));
    }
  }
  breakDecrement = () => {
    clearInterval(this.interval);
    if(this.state.breakLength > 1){
      this.setState( (prevState)=> ({
        breakLength: prevState.breakLength - 1,
        running: false,
        textDisplay: "Press play to start"
      }));
    }
  }

  pause() {
    clearInterval(this.interval);
    this.setState({
      running: false,
      textDisplay: "Paused"
    });
  }

  togglePlayPause = () => {
    if(this.state.running){
      this.pause();
    } else {
      this.run();
    }
  }

  countDown = () => {
    // Count Down
    clearInterval(this.interval);
    // Run Every Second
    this.interval = setInterval( ()=> {
      // Conver seconds format to Seconds:Minutes
      let seconds = Math.floor(this.state.count % 60);
      let minutes = Math.floor(this.state.count / 60);
      let secondsString = String(seconds).padStart(2,0);
      let minutesString = String(minutes).padStart(2,0);
      
      this.setState({
        minutes: minutesString,
        seconds: secondsString,
        running: true,
      });
      // Check that timer hasn't run down
      if(this.state.count >= 1){
        this.setState(prevState => ({
          count: prevState.count - 1,
        }));
      } else {
        // Switch from session to break or vice versa
        vibrate();
        this.setState(prevState => ({
          break: !prevState.break,
        }));
        // Run Again
        this.run();
      }
    }, 100);
  }

  run = () => {
    // Update The Display Text
    if(this.state.break){
      this.setState({
        textDisplay: "Break",
        break: true,
        count: this.state.breakLength * 60,
      });
      this.countDown();
    } else {
      this.setState({
        textDisplay: "Session",
        break: false,
        count: this.state.sessionLength * 60,
      });
      this.countDown();
    }
  }

  reset = () => {
    clearInterval(this.interval);

    // Reset Other Stuff
    this.setState((prevState)=>({
      minutes: this.state.sessionLength,
      seconds: "00",
      textDisplay: "Press play to start",
      break: false,
      count: this.state.sessionLength * 60,
    }));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.rowContainer}>
          <SessionControl increment={this.sessionIncrement} decrement={this.sessionDecrement} length={this.state.sessionLength}></SessionControl>
          <BreakControl increment={this.breakIncrement} decrement={this.breakDecrement} length={this.state.breakLength}></BreakControl>
        </View>
        <Text style={styles.paragraph}>
          {this.state.textDisplay}
        </Text>
        <Text style={styles.main}>
          {this.state.minutes}:{this.state.seconds}
        </Text>
        <Button title="Start/pause" onPress={this.togglePlayPause}></Button>
        <Button title="Reset" onPress={this.reset}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  control: {
    margin: 'auto',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  paragraph: {
    margin: 12,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  main: {
    margin: 24,
    fontSize: 72,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
