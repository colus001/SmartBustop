# SmartBustop
Korean bus station information reader with iBeacon
created with React-native for 12 hrs in a hackathon.

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

1. Make sure jsCodeLocation has been set properly AppDelegate.m<br/>
`// jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
  jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`


2. Run command below on terminal<br/>
`react-native bundle`

3. Run or build on xcode

### Run on Simulator

1. Make sure jsCodeLocation has been set properly AppDelegate.m<br/>
`  jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle"];
// jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];`

2. Run command below on terminal<br/>
`npm start`

3. Run or build on xcode

### DOING

1. Replace beacon to GPS

### TODO

1. Ad-mob integration
2. Detail view for each bus
3. Gyeonggi-bus integration
