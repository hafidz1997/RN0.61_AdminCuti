import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import CheckBox from '@react-native-community/checkbox';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';

const style = StyleSheet.create({
  list: {
    flexDirection: 'row',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    justifyContent: 'space-between',
    padding: 10,
    margin: 10,
  },
  nama: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    color: 'grey',
    fontSize: 15,
  },
  detail: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#779DCA',
    padding: 10,
  },
});

const List = props => {
  let tampil;
  let tombol;
  if (props.email) {
    tampil = <Text style={style.email}>{props.email}</Text>;
    tombol = (
      <Button
        color="#779DCA"
        icon="md-open"
        onPress={props.onPress}
        width={50}
      />
    );
  } else if (props.cuti) {
    tampil = <Text style={style.email}>sisa {props.cuti} hari</Text>;
    tombol = (
      <Button
        color="#779DCA"
        icon="md-open"
        onPress={props.onPress}
        width={50}
      />
    );
  } else if (props.awal) {
    tampil = (
      <Text style={style.email}>
        {props.awal}-{props.akhir}
      </Text>
    );
    tombol = (
      <View style={{flexDirection: 'row'}}>
        <Button
          color="tomato"
          icon="ios-trash"
          onPress={props.hapus}
          width={40}
        />
        <Button
          color="#779DCA"
          icon="md-create"
          onPress={props.update}
          width={40}
        />
      </View>
    );
  }

  let judul;
  if (props.depan) {
    judul = (
      <Text style={style.nama}>
        {props.depan} {props.belakang}
      </Text>
    );
  } else {
    judul = <Text style={style.nama}>{props.alasan}</Text>;
  }

  return (
    <View style={style.list} key={props.keyval}>
      <View>
        {judul}
        {tampil}
      </View>
      {tombol}
    </View>
  );
};

export default List;
