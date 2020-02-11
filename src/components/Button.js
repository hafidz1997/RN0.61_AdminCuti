import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
        {
          backgroundColor: props.color,
          width: props.width,
          height: props.height,
          alignSelf: props.alignSelf,
        },
      ]}>
      <Ionicons style={style.icon} name={props.icon} size={20} color="white" />
      {tampil}
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 10,
    margin: 10,
    marginLeft: 20,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    justifyContent: 'center',
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

export default Button;
