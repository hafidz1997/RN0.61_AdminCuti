import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const style = StyleSheet.create({
  button: {
    borderRadius: 8,
    // width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 8,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 5,
  },
});

const Button = props => {
  let tampil;
  if (props.title) {
    tampil = <Text style={style.text}>{props.title}</Text>;
  }
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[
        style.button,
        {backgroundColor: props.color, width: props.width},
      ]}>
      <Ionicons style={style.icon} name={props.icon} size={20} color="white" />
      {tampil}
    </TouchableOpacity>
  );
};

export default Button;
