/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";

// Wajib ada untuk mendapatkan registrasi notifikasi
const actionHandler = (message) => {
  console.log("message", message);
};

AppRegistry.registerHeadlessTask(
  "RNFirebaseBackgroundNotificationAction",
  actionHandler
);

AppRegistry.registerComponent(appName, () => App);
