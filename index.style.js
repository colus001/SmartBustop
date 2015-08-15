'use strict';

var React = require('react-native');
var Device = require('react-native-device');
var { StyleSheet } = React;

var styles = StyleSheet.create({
  container: {
    flex: 1,
  },
    backgroundImage: {
      flex: 1,
      width: Device.width,
      height: Device.height,
      top: 20,
      paddingBottom: 40,
      backgroundColor: 'transparent'
    },
  loadingIndicator: {
    width: 718/2.2,
    height: 509/2.2,
    marginVertical: 50,
    right: -20,
    position: 'absolute'
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  inputs: {
    flexDirection: 'row',
    height: 65,
    paddingHorizontal: 10,
  },
    inputLeft: {
      flex: 1
    },
      textInput: {
        flex: 1,
        height: 50,
        textAlign: 'center',
        color: '#59595B',
        fontSize: 25,
        paddingTop: 20,
        marginLeft: 5,
        marginRight: 5,
        fontFamily: 'NanumGothicBold',
      },
      inputSeparator: {
        height: 3,
        backgroundColor: '#4C358A'
      },
    inputRight: {
      flexDirection: 'column',
      width: 130,
    },
      beacon: {
        flex: 1,
      },
      beaconTitle: {
        fontSize: 10,
        marginTop: 2,
        marginLeft: 10,
        marginBottom: 4,
        fontFamily: 'NanumGothicBold',
        color: "#AAA"
      },
      beaconText: {
        paddingTop: 8,
        paddingLeft: 15,
        color: '#4C358A',
        backgroundColor: "transparent",
        fontFamily: 'NanumGothicBold',
        fontSize: 20,
      },
  result: {
    flex: 1,
    padding: 20,
  },
    resultTitle: {
      marginLeft: 20,
      marginTop: 5,
      marginBottom: 25,
      fontSize: 40,
      fontFamily: 'BM HANNA 11yrs old OTF',
      color: '#59595B',
    },
    resultSeparator: {
      height: 2,
      backgroundColor: '#AAA',
      marginBottom: 20,
    },
    busInfo: {
      flexDirection: 'column',
      flex: 1,
    },
      busMsg: {
        marginBottom: 5,
        color: '#DF6135',
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'NanumGothic',
      },
      destination: {
        textAlign: 'right',
        fontSize: 13,
        fontFamily: 'NanumGothic',
      },
    separator: {
      height: 1,
      backgroundColor: '#CCCCCC',
    },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  lastCall: {
    width: 15,
    height: 30,
    top: 10,
    left: -15,
    position: 'absolute',
  }
});

module.exports = styles;
