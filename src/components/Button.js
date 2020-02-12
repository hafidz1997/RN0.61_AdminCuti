import React from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
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
      <View style={style.row}>
        <Ionicons
          style={style.icon}
          name={props.icon}
          size={20}
          color="white"
        />
        {tampil}
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  row: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
  button: {
    borderRadius: 8,
    padding: 10,
    margin: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Button;
