{
  /* <Text style={style.label}>Tanggal Mulai</Text>
<DatePicker
  style={{width: 200, margin: 15}}
  date={this.state.awal}
  mode="date"
  placeholder="Select Date"
  format="YYYY-MM-DD"
  minDate={this.state.thisDay}
  confirmBtnText="Confirm"
  cancelBtnText="Cancel"
  customStyles={{
    dateIcon: {
      position: 'absolute',
      left: 0,
      top: 4,
      marginLeft: 0,
    },
    dateInput: {
      marginLeft: 36,
    },
  }}
  onDateChange={date => {
    this.setState({awal: date});
  }}
/>
<Text style={style.label}>Tanggal Berakhir</Text>
<DatePicker
  style={{width: 200, margin: 15}}
  date={this.state.akhir}
  mode="date"
  placeholder="Select Date"
  format="YYYY-MM-DD"
  minDate={this.state.awal}
  maxDate={max}
  confirmBtnText="Confirm"
  cancelBtnText="Cancel"
  customStyles={{
    dateIcon: {
      position: 'absolute',
      left: 0,
      top: 4,
      marginLeft: 0,
    },
    dateInput: {
      marginLeft: 36,
    },
  }}
  onDateChange={date => {
    this.setState({akhir: date});
  }}
/> */
}

{
  /* <Text style={style.label}>Tanggal Mulai</Text>
<View>
  <TouchableOpacity
    style={style.date}
    onPress={this.showDatepicker.bind(this)}>
    <Icon
      style={style.icon}
      name="md-calendar"
      size={30}
      color="#779DCA"
    />
    <Text>{txt}</Text>
  </TouchableOpacity>
</View>
{this.state.show && (
  <DatePickers
    // date={this.state.awal}
    value={val}
    // min={this.state.thisDay}
    onChange={(event, date) => {
      this.setState({
        awal: moment(date).format('YYYY-MM-DD'),
        show: false,
      });
    }}
  />
)}


<Text style={style.label}>Tanggal Berakhir</Text>
<View>
  <TouchableOpacity
    style={style.date}
    onPress={this.showDatepicker.bind(this)}>
    <Icon
      style={style.icon}
      name="md-calendar"
      size={30}
      color="#779DCA"
    />
    <Text>{txt2}</Text>
  </TouchableOpacity>
</View>
{this.state.show && (
  <DatePickers
    // date={this.state.akhir}
    value={val2}
    max={max}
    // min={this.state.thisDay}
    onChange={(event, date) => {
      this.setState({
        akhir: moment(date).format('YYYY-MM-DD'),
        show: false,
      });
    }}
  />
)} */
}
