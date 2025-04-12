
import { AppRegistry } from 'react-native';
import App from './src/App'; // Assurez-vous que le chemin est correct
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);