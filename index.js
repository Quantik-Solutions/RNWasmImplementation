import './shim.js';
import crypto from 'crypto';
if (!global.crypto) {
  global.crypto = {};
}

if (!global.crypto.getRandomValues) {
  global.crypto.getRandomValues = function (arr) {
    const buffer = crypto.randomBytes(arr.length);

    return buffer.reduce((arr, value, index) => {
      arr[index] = value;

      return arr;
    }, arr);
  };
}
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
