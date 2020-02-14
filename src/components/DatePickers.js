import React, {useState} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const DatePickers = props => {
  let coba;
  if (props.max && !props.min) {
    coba = (
      <DateTimePicker
        value={moment(props.value).toDate()}
        onChange={props.onChange}
        maximumDate={moment(props.max).toDate()}
      />
    );
  } else if (props.min && !props.max) {
    coba = (
      <DateTimePicker
        value={moment(props.value).toDate()}
        onChange={props.onChange}
        minimumDate={moment(props.min).toDate()}
      />
    );
  } else if (!props.max && !props.min) {
    coba = (
      <DateTimePicker
        // value={props.value}
        value={moment(props.value).toDate()}
        onChange={props.onChange}
      />
    );
  } else {
    coba = (
      <DateTimePicker
        value={moment(props.value).toDate()}
        onChange={props.onChange}
        minimumDate={moment(props.min).toDate()}
        maximumDate={moment(props.max).toDate()}
      />
    );
  }
  return <View>{coba}</View>;
};

export default DatePickers;
