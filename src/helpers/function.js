import {ToastAndroid} from 'react-native';

export function ToastSuccess(who, process) {
  return ToastAndroid.showWithGravity(
    `${who} berhasil di ${process}`,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}

export function ToastError() {
  return ToastAndroid.showWithGravity(
    'Error, terjadi kesalahan',
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}

export function ToastErrorLogin() {
  return ToastAndroid.showWithGravity(
    'Email atau Password salah',
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}

export function ToastSuccessLogin() {
  return ToastAndroid.showWithGravity(
    'Login Berhasil',
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}

export function ToastEmpty(what) {
  return ToastAndroid.showWithGravity(
    `${what} belum diisi`,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}

export function ToastValid(what) {
  return ToastAndroid.showWithGravity(
    `${what} harus valid`,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}

export function ToastValidMin(what, min) {
  return ToastAndroid.showWithGravity(
    `${what} harus valid, min ${min}`,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
  );
}
