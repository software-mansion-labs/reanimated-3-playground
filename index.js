/**
 * @format
 */
import {AppRegistry, Platform} from 'react-native';
import {registerRootComponent} from 'expo';
import App from './App';
import {name as appName} from './app.json';

if (Platform.OS === 'web') {
  registerRootComponent(App);
} else {
  AppRegistry.registerComponent(appName, () => App);
}
