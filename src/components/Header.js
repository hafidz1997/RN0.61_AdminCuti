import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Header = props => {
  return (
    <View style={style.header}>
      <Text style={style.title}>{props.title}</Text>
    </View>
  );
};

const style = StyleSheet.create({
  header: {
    backgroundColor: '#779DCA',
    height: 60,
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;
