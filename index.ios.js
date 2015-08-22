/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var { AppRegistry, StyleSheet, Text, TextInput, ListView, View, ScrollView, Image, TouchableHighlight, DeviceEventEmitter, ActivityIndicatorIOS, TouchableOpacity } = React;
// var Beacons = require('react-native-ibeacon');

var _ = require('underscore');
var styles = require('./index.style.js');

// var region = {
//   identifier: 'SmartBustop',
//   uuid: 'A495FF00-C5B1-4B44-B512-1370F02D74DE'
// };
//
// Beacons.requestAlwaysAuthorization();
// Beacons.startMonitoringForRegion(region);
// Beacons.startRangingBeaconsInRegion(region);
// Beacons.startUpdatingLocation();

var DEFAULT_POSITION_BODY = {
  radius: 300,
};

// Listen for beacon changes
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var SmartBustop = React.createClass({
  getInitialState: function () {
    // var subscription = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
    //   var nearestBeacon = data.beacons[0];
    //   if ( !nearestBeacon ) return;
    //   this.setState({ beacon: this._getStationIdFromBeacon(nearestBeacon) });
    //
    //   if ( this.state.isInitiating ) {
    //     this.onBeaconPress(this._getStationIdFromBeacon(nearestBeacon));
    //     this.setState({ isInitiating: false });
    //   }
    // });

    return {
      curText: '',
      beacon: '',
      isInitiating: true,
      isLoading: false,
      dataSource: ds.cloneWithRows([])
    }
  },

  watchID: (null: ?number),

  componentDidMount: function () {
    navigator.geolocation.getCurrentPosition(
      (initialPosition) => this._getDataByPosition(initialPosition, {initial: true}),
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
    this.watchID = navigator.geolocation.watchPosition((lastPosition) => {
      this.setState({lastPosition});
    });
  },

  componentWillUnmount: function() {
    navigator.geolocation.clearWatch(this.watchID);
  },

  render: function() {
    var listView = this._getListView();
    var resultSeparator = (this.state.stationTitle)
      ? (<View style={styles.resultSeparator} />)
      : (<View></View>);

    return (
      <View style={styles.container}>
        <Image
          style={styles.backgroundImage}
          source={require('image!background')}>
          <View style={styles.inputs}>
            <View style={styles.inputLeft}>
              <TextInput
                style={styles.textInput}
                onChangeText={this.handleOnChange}
                keyboardType="number-pad"
                autoFocus={true}
                placeholder="정류장 번호"
                value={this.state.value}
                />
              <View style={styles.inputSeparator}></View>
            </View>
            <View style={styles.inputRight}>
              <Text style={styles.beaconTitle}>가까운 정류장</Text>
              <TouchableOpacity
                style={styles.beacon}
                onPress={this.onSearchPress}>
                <Image
                  style={{width: 120, height: 50}}
                  source={require('image!BattenBefore')}>
                  <Text style={styles.beaconText}>
                    {this._beautifyStationId(this.state.value)}
                  </Text>
                </Image>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView style={styles.result}>
            <Text style={styles.resultTitle}>{this.state.stationTitle}</Text>
            {resultSeparator}
            {listView}
          </ScrollView>
        </Image>
      </View>
    );
  },

  onSearchPress: function () {
    navigator.geolocation.getCurrentPosition(
      (position) => this._getDataByPosition(position),
      (error) => console.log(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  },

  onBeaconPress: function (beacon) {
    beacon = (beacon) ? beacon : this.state.beacon
    this._getData(beacon);
  },

  handleOnChange: function (text) {
    // text = text.replace(/-/, '').replace(/(\d{2}?)/, '$1-');
    // this.setState({ value: text });
    //
    // var cleanText = text.replace(/-/, '');

    if (text.length < 6)
      this.setState({ value: text });

    if (text.length > 5 || text.length < 5)
      return this.setState({
        stationTitle: null,
        dataSource: ds.cloneWithRows([])
      });

    this._getData(text);
  },

  renderRow: function (rowData) {
    if (rowData.arrmsg1 === '운행종료') return (<View/>);

    var busStyleRaw = {
      fontSize: 28,
      marginRight: 10,
      fontFamily: 'NanumGothicBold',
    }
    switch (rowData.routeType) {
      case "3":
        busStyleRaw.color = '#176097';
        break;
      case "2":
      case "4":
        busStyleRaw.color = '#73B074';
        break;
      case "5":
        busStyleRaw.color = '#DBDF00';
        break;
      case "6":
      case "7":
        busStyleRaw.color = '#E62433';
        break;
      case "8":
        busStyleRaw.color = '#0D8B84';
        break;
      default:
        busStyleRaw.color = '#2D383E';
        break;
    }
    var busStyle = new StyleSheet.create({style: busStyleRaw});
    console.log ('nextBus:', rowData.nextBus)
    var lastBus = (rowData.isLast1 !== '0')
      ? (<Image
          style={styles.lastCall}
          source={require('image!makcha')} />)
      : (<View/>);
    return (
      <TouchableHighlight
        underlayColor='#dddddd'
        style={{marginLeft: 10, marginRight: 10}}>
        <View style={{marginLeft: 5, marginRight: 5}}>
          {{lastBus}}
          <View style={styles.row}>
            <Text style={busStyle.style}>
              {rowData.rtNm}
            </Text>
            <View style={styles.busInfo}>
              <Text style={styles.busMsg}>
                {rowData.arrmsg1}
              </Text>
              <Text style={styles.destination}>
                {rowData.stationNm1}행
              </Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    )
  },

  _getData: function (id) {
    this.setState({ isLoading: true });
    id = id.replace(/-/, '');

    fetch('http://m.bus.go.kr/mBus/bus/getStationByUid.bms?arsId='+id)
      .then((res) => res.text())
      .then((restext) => {
        var array = JSON.parse(restext).resultList;
        var sorted = _.sortBy(array, (elem) => parseInt(elem.traTime1));
        this.setState({
          stationTitle: array[0].stNm,
          dataSource: ds.cloneWithRows(sorted),
          isLoading: false
        });
      })
      .catch((err) => {
        console.warn('warn:', err);
        this.setState({ isLoading: false });
      });
  },

  _getDataByPosition: function (position, options) {
    if (!position) return;

    options = _.defaults(options || {}, {
      initial: false
    });

    var body = _.extend(DEFAULT_POSITION_BODY, {
      tmX: position.coords.longitude,
      tmY: position.coords.latitude,
    });

    this.setState({
      isLoading: true
    });

    fetch('http://m.bus.go.kr/mBus/bus/getStationByPos.bms', {
      method: 'post',
      headers: { 'Content-type': 'application/x-www-form-urlencoded;' },
      body: this._serialize(body)
    })
      .then((res) => res.text())
      .then((restext) => {
        var array = JSON.parse(restext).resultList;
        var sorted = _.chain(array).reject((e) => e.arsId === "0").sortBy((e) => parseInt(e.dist)).value();
        var nearest = _.first(sorted);

        if (nearest)
          this.setState({ value: nearest.arsId });
        else if (!options.initial)
          return alert('가까운 정류장이 없습니다.');

        this._getData(nearest.arsId)
      })
      .catch((err) => {
        console.warn('warn:', err);
        this.setState({ isLoading: false });
      });
  },

  _serialize: function (data) {
    return Object.keys(data).map(function (keyName) {
      return keyName + '=' + data[keyName]
    }).join('&');
  },


  _getStationIdFromBeacon: function (beacon) {
    var major = parseInt(beacon.major).toString(16);
    var minor = parseInt(beacon.minor).toString(16);
    var number = major+minor;
    var dec = parseInt(number, 16).toString();

    return dec;
  },

  _beautifyStationId: function (id) {
    if (!id || id.length === 0) return '찾기';
    return id.slice(0, 2)+'-'+id.slice(2, id.length)
  },

  _getListView: function () {
    if (this.state.stationTitle){
      return (
        <ListView
          scrollEnabled={false}
          automaticallyAdjustContentInsets={false}
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          />
      );
    } else if (this.state.isLoading) {
      return (
        <Image
          style={styles.loadingIndicator}
          source={require('image!windowLoading')}>
          <ActivityIndicatorIOS
            style={{top: 70, right: 75}}
            color='#4C358A'
            hidden='false'
            size='small' />
        </Image>
      );
    } else {
      return  (
        <Image
          style={styles.loadingIndicator}
          source={require('image!windowEmpty')} />
      );
    }
  },
});

AppRegistry.registerComponent('SmartBustop', () => SmartBustop);
