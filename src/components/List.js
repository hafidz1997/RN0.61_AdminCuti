import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Button from './Button';

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
  } else if (props.cuti >= 0) {
    if (props.cuti !== null) {
      tampil = <Text style={style.email}>sisa {props.cuti} hari</Text>;
    } else {
      tampil = <Text style={style.email}>sisa 5 hari</Text>;
    }
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
      <>
        <Text style={style.email}>{props.hari} hari</Text>
        <Text style={style.email}>Mulai: {props.awal}</Text>
        <Text style={style.email}>Berakhir: {props.akhir}</Text>
      </>
    );
    tombol = (
      <View style={style.row}>
        <Button
          color="tomato"
          icon="ios-trash"
          onPress={props.hapus}
          width={40}
          height={40}
        />
        <Button
          color="#779DCA"
          icon="md-create"
          onPress={props.update}
          width={40}
          height={40}
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
  row: {
    flexDirection: 'row',
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

export default List;
