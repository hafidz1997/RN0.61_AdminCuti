import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AddButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={style.add}>
      <Ionicons name="md-add" size={40} color="white" />
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  add: {
    backgroundColor: '#779DCA',
    borderRadius: 50,
    position: 'absolute',
    bottom: 20,
    right: 20,
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
});

export default AddButton;
