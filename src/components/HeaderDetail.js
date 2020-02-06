import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const style = StyleSheet.create({
  header: {
    backgroundColor: '#779DCA',
    height: 60,
    paddingTop: 15,
    flexDirection: 'row',
    marginBottom: 15,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 15,
    marginRight: 15,
  },
});

const HeaderDetail = props => {
  return (
    <View style={style.header}>
      <TouchableOpacity onPress={props.onPress}>
        <Icon
          style={style.icon}
          name="ios-arrow-back"
          size={30}
          color="white"
        />
      </TouchableOpacity>
      <Text style={style.title}>{props.title}</Text>
    </View>
  );
};

export default HeaderDetail;
