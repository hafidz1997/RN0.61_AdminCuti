import React, {Component} from 'react';
import Route from './src/router';
import {StatusBar} from 'react-native';
// import PushNotification from 'react-native-push-notification';
// import {Text} from 'react-native';

class App extends Component {
  // async componentDidMount() {
  //   PushNotification.configure({
  //     onNotification: function(notification) {
  //       console.warn('NOTIFICATION:', notification);
  //     },
  //   });
  // }
  render() {
    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <Route />
        {/* <Text
          style={{
            color: 'black',
            flex: 1,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          notifikasi
        </Text> */}
      </>
    );
  }
}

export default App;
