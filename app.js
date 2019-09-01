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
      paused: true,
      seconds: "00",
      minutes: "25",
    }
  }
  
  componentDidMount = () => {

  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
  }

  sessionIncrement = () => {
    // No sessions longer than 60 minutes
    if(this.state.sessionLength < 60){
      // Check if session is active
      if(!this.state.break){
        clearInterval(this.interval);
        this.setState({
          seconds: "00",
          paused: true,
          textDisplay: "Press play to start",
        });
      }
      // Check if paused
      if(this.state.paused){
        this.setState(prevState => ({
          minutes: String(prevState.sessionLength + 5),
        }));
      }
      // Increment
      this.setState( (prevState) => ({
        sessionLength: prevState.sessionLength + 5,
      }));
    }
  }
  sessionDecrement = ()=> {
    if(this.state.sessionLength > 1){
      // Check if session is acive
      if(!this.state.break){
        clearInterval(this.interval);
        this.setState({
          seconds: "00",
          paused: true,
          textDisplay: "Press play to start",
        });
      }
      // Check if paused
      if(this.state.paused){
        this.setState( prevState => ({
          minutes: String(prevState.sessionLength - 5),
        }));
      }
      // Decrement
      this.setState( (prevState)=> ({
        sessionLength: prevState.sessionLength - 5,
      }));
    }
  }
  breakIncrement = () => {
    if(this.state.breakLength < 60){
      // Check if breaktime is active
      if(this.state.break){
        clearInterval(this.interval);
        this.setState({
          seconds: "00",
          paused: true,
          textDisplay: "Press play to start",
        });
      }
      this.setState( (prevState) => ({
        breakLength: prevState.breakLength + 1,
      }));
    }
  }
  breakDecrement = () => {
    if(this.state.breakLength > 1){
      // Check if breaktime is active
      if(this.state.break){
        clearInterval(this.interval);
        this.setState({
          seconds: "00",
          paused: true,
          textDisplay: "Press play to start",
        });
      }
      this.setState( (prevState)=> ({
        breakLength: prevState.breakLength - 1,
      }));
    }
  }

  pause() {
    clearInterval(this.interval);
    this.setState({
      paused: true,
      textDisplay: "Paused"
    });
  }

  togglePlayPause = () => {
    if(!this.state.paused){
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
      // Convert seconds format to Seconds:Minutes
      let seconds = Math.floor(this.state.count % 60);
      let minutes = Math.floor(this.state.count / 60);
      let secondsString = String(seconds).padStart(2,0);
      let minutesString = String(minutes).padStart(2,0);
      
      this.setState({
        minutes: minutesString,
        seconds: secondsString,
        paused: false,
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
        count: this.state.breakLength * 60,
      });
      this.countDown();
    } else {
      this.setState({
        textDisplay: "Session",
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
      paused: true,
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
    justifyContent: 'space-between',
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
