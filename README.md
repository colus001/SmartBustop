# SmartBustop
Korean bus station information reader with iBeacon
Created with React-Native

### Provided free-use fonts
This app is made with fonts provided by companies below
- Hanna 12 years Old from 우아한형제들
- NanumGothic from NHN

### Dependencies
- react-native
- react-native-ibeacon
- react-native-device

### Install dependencies
`npm install`

### Run on Device

1. Make sure jsCodeLocation has been set properly AppDelegate.m
`
//  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
`

2. Run command below on terminal
`react-native bundle`

3. Run or build on xcode

### Run on Simulator

1. Make sure jsCodeLocation has been set properly AppDelegate.m
`
  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
//  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
`

2. Run command below on terminal
`npm start`

3. Run or build on xcode
