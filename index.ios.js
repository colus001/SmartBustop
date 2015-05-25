/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  ListView,
  View,
  TouchableHighlight,
  DeviceEventEmitter,
  ActivityIndicatorIOS
} = React;
var Beacons = require('react-native-ibeacon');
var _ = require('underscore');

var region = {
  identifier: 'SmartBustop',
  uuid: 'A495FF00-C5B1-4B44-B512-1370F02D74DE'
};

Beacons.requestAlwaysAuthorization();
Beacons.startMonitoringForRegion(region);
Beacons.startRangingBeaconsInRegion(region);
Beacons.startUpdatingLocation();

// Listen for beacon changes
var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

var SmartBustop = React.createClass({
  getInitialState: function () {
    var subscription = DeviceEventEmitter.addListener('beaconsDidRange', (data) => {
        var nearestBeacon = data.beacons[0];
        this.setState({ beacon: this._getStationIdFromBeacon(nearestBeacon) });

        if ( this.state.isInitiating ) {
          this.onBeaconPress(this._getStationIdFromBeacon(nearestBeacon));
          this.setState({ isInitiating: false });
        }
      }
    );

    return {
      curText: '',
      beacon: '',
      isInitiating: true,
      isLoading: false,
      dataSource: ds.cloneWithRows([])
    }
  },

  render: function() {
    var listView = this.state.isLoading
      ? ( <ActivityIndicatorIOS hidden='true' size='large' /> )
      : ( <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderRow}
      /> );

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          정류장 번호를 입력하세요
        </Text>
        <View style={styles.inputs}>
          <TextInput
            style={styles.textInput}
            onChangeText={this.handleOnChange}
            keyboardType="number-pad"
            autoFocus={true}
            value={this.state.beacon}
            />
          <TouchableHighlight
            style={styles.beacon}
            onPress={this.onBeaconPress}
            underlayColor="#48BBEC">
            <View>
            <Text style={styles.beaconTitle}>현재위치:</Text>
              <Text style={styles.beaconText}>{this._beautifyStationId(this.state.beacon)}</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View style={styles.result}>
          {listView}
        </View>
      </View>
    );
  },

  onBeaconPress: function (beacon) {
    beacon = (beacon) ? beacon : this.state.beacon
    this._getData(beacon);
  },

  handleOnChange: function (text) {
    if (text.length > 5 || text.length < 5)
      return this.setState({ dataSource: ds.cloneWithRows([]) });
    this._getData(text);
  },

  renderRow: (rowData) => {
    return (
      <TouchableHighlight
        underlayColor='#dddddd'>
        <View>
          <View style={styles.row}>
            <Text style={styles.busNumber}>
              {rowData.rtNm}
            </Text>
            <Text style={styles.busMsg}>
              {rowData.arrmsg1}
            </Text>
            <Text style={styles.destination}>
              {rowData.stationNm1}행
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={{flex: 1}}>
              { (rowData.nextBus === "Y") ? "막차" : ""}
            </Text>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    )
  },

  _getData: function (id) {
    this.setState({ isLoading: true });

    fetch('http://m.bus.go.kr/mBus/bus/getStationByUid.bms?arsId='+id)
      .then((res) => res.text())
      .then((restext) => {
        var array = JSON.parse(restext).resultList;
        var sorted = _.sortBy(array, (elem) => parseInt(elem.traTime1));
        this.setState({
          dataSource: ds.cloneWithRows(sorted),
          isLoading: false
        });
      })
      .catch((err) => {
        console.warn('warn:', err);
        this.setState({ isLoading: false });
      });
  },

  _getStationIdFromBeacon: function (beacon) {
    var major = parseInt(beacon.major).toString(16);
    var minor = parseInt(beacon.minor).toString(16);
    var number = major+minor;
    var dec = parseInt(number, 16).toString();

    return dec;
  },

  _beautifyStationId: function (id) {
    return id.slice(0, 2)+'-'+id.slice(2, id.length)
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    // alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    flex: 1
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputs: {
    flexDirection: 'row',
    flex: 1
  },
    textInput: {
      flex: 1,
      height: 50,
      textAlign: 'center',
      fontSize: 25,
      paddingLeft: 18,
      borderColor: 'gray',
      borderWidth: 1,
      marginLeft: 5,
      marginRight: 5,
    },
    beacon: {
      height: 50,
      padding: 5,
      flex: 1,
    },
    beaconTitle: {
      fontSize: 14,
      color: "#AAA"
    },
    beaconText: {
      fontSize: 20,
    },
  result: {
    flex: 10,
    marginTop: 10,
  },
    busNumber: {
      flex: 2,
      color: '#900'
    },
    busMsg: {
      flex: 3
    },
    destination: {
      flex: 4
    },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },

  row: {
    flexDirection: "row",
    padding: 10,
  }
});

AppRegistry.registerComponent('SmartBustop', () => SmartBustop);
