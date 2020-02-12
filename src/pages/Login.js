import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import Button from '../components/Button';
import {openDatabase} from 'react-native-sqlite-storage';
import AsyncStorage from '@react-native-community/async-storage';
import CheckBox from '@react-native-community/checkbox';
import ValidationComponent from 'react-native-form-validator';
import {
  ToastErrorLogin,
  ToastSuccessLogin,
  ToastValid,
  ToastEmpty,
} from '../helpers/function';

let db = openDatabase({name: 'deptech6.db', createFromLocation: 1});

class Login extends ValidationComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      pass: true,
      checked: false,
    };
  }

  showpass() {
    this.setState(prevState => ({
      pass: !prevState.pass,
      checked: !prevState.checked,
    }));
  }

  login = () => {
    this.validate({
      email: {email: true},
    });

    let that = this;
    const {email, password} = this.state;
    if (email) {
      if (!this.isFieldInError('email')) {
        if (password) {
          db.transaction(txn => {
            txn.executeSql(
              'SELECT * FROM admin WHERE email = ? AND password = ?',
              [email, password],
              (tx, results) => {
                if (results.rows.length > 0) {
                  AsyncStorage.setItem('isLoggedIn', '1');
                  AsyncStorage.setItem(
                    'dt',
                    JSON.stringify(results.rows.item(0)),
                  );
                  ToastSuccessLogin();
                  that.props.navigation.navigate('Tab');
                } else {
                  ToastErrorLogin();
                }
              },
            );
          });
        } else {
          ToastEmpty('Password');
        }
      } else {
        ToastValid('Email');
      }
    } else {
      ToastEmpty('Email');
    }
  };

  render() {
    return (
      <View style={style.container}>
        <Text style={style.judul}>Login</Text>
        <Text style={style.label}>Email</Text>
        <TextInput
          ref="email"
          placeholder="Masukkan Email"
          style={style.input}
          onChangeText={email => this.setState({email})}
          keyboardType="email-address"
        />
        <Text style={style.label}>Password</Text>
        <TextInput
          secureTextEntry={this.state.pass}
          placeholder="Masukkan Password"
          style={style.input}
          onChangeText={password => this.setState({password})}
        />
        <View style={style.row}>
          <CheckBox
            value={this.state.checked}
            onChange={() => this.showpass()}
          />
          <Text>Show Password</Text>
        </View>
        <Button
          title="Login"
          color="#779DCA"
          icon="md-open"
          alignSelf="center"
          onPress={this.login.bind(this)}
          width="80%"
        />
      </View>
    );
  }
}

const style = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  judul: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderColor: 'grey',
    borderWidth: 1,
    marginTop: 20,
  },
  kosong: {
    fontSize: 20,
    color: 'grey',
    alignSelf: 'center',
    marginTop: '50%',
  },
});

export default Login;
