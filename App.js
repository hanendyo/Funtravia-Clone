import React, { useEffect, useState, useRef } from "react";
import "react-native-gesture-handler";
import MainStackNavigator from "./src/navigation";
import { ApolloProvider } from "@apollo/client";
import messaging from "@react-native-firebase/messaging";
import SplashScreen from "react-native-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API, END_POINT_NOTIFY, END_POINT_INFO } from "./src/config";
import { mascot_black } from "./src/assets/png";
import { SafeAreaView, Image, Dimensions, Platform } from "react-native";
import "./src/i18n";
import { useTranslation } from "react-i18next";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import { relayStylePagination } from "@apollo/client/utilities";
import { createUploadLink } from "apollo-upload-client";
import { Provider } from "react-redux";
import { storeState } from "./src/redux";
import RNRestart from "react-native-restart";

if (Platform.OS === "ios") {
  PushNotificationIOS.cancelAllLocalNotifications();
} else {
  PushNotification.cancelAllLocalNotifications();
}

// PushNotification.configure({
//   onRegister: function(token) {
//   },
//   onNotification: async function(notification) {
//     console.log("NOTIFICATION:", notification);
//     if (notification.userInteraction == true) {
//       await AsyncStorage.setItem(
//         "dataNotification",
//         JSON.stringify(notification)
//       );
//       if (notification.foreground == true) {
//         await RNRestart.Restart();
//       }
//     }
//   },
//   onAction: function(notification) {
//     console.log("ONACTION:", notification);
//   },
//   onRegistrationError: function(err) {
//     console.log(err.message, err);
//   },
//   permissions: {
//     alert: true,
//     badge: true,
//     sound: true,
//   },
//   onMessage: function(notification) {
//     console.log("onmessage:", notification);
//   },
//   popInitialNotification: true,
//   requestPermissions: true,
// });

PushNotification.configure({
  onNotification: async function(notification) {
    console.log("NOTIFICATIONSS:", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);

    if (notification.userInteraction == true) {
      await AsyncStorage.setItem(
        "dataNotification",
        JSON.stringify(notification)
      );

      if (notification.foreground == true) {
        await RNRestart.Restart();
      }
      if (Platform.OS == "ios") {
        RNRestart.Restart();
      }
    }

    let storage = JSON.parse(await AsyncStorage.getItem("dataNotification"));
  },
});

function App() {
  const { t, i18n } = useTranslation();
  const { width } = Dimensions.get("screen");
  let [authStat, setAuthStat] = useState(null);
  let [authBlocked, setAuthBlocked] = useState(false);
  let [appLoading, setAppLoading] = useState(true);
  let [appToken, setAppToken] = useState(null);
  const [firstScreen, setFirstScreen] = useState(null);
  let [dataNotifikasi, setDataNotifikasi] = useState(null);

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    if (enabled && enabled !== -1) {
      await getToken();
    } else {
      await requestPermission();
    }
  };

  const getToken = async () => {
    let fcmToken = await AsyncStorage.getItem("FCM_TOKEN");
    let setting = await AsyncStorage.getItem("setting_language");
    await i18n.changeLanguage(setting);
    if (!fcmToken) {
      await messaging().registerDeviceForRemoteMessages();
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        await fetch(END_POINT_NOTIFY, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: fcmToken,
          }),
        });
        await AsyncStorage.setItem("FCM_TOKEN", fcmToken);
      }
    }
  };

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      await getToken();
    } catch (error) {
      console.log("permission rejected");
    }
  };

  const initializeFunction = async () => {
    let token = await AsyncStorage.getItem("access_token");
    setAppToken(token);
    let result = await fetch(END_POINT_INFO, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    let resultData = await result.json();
    if (resultData.status) {
      await setAuthBlocked(resultData.data.is_blocked);
      await setAuthStat(true);
    } else {
      await AsyncStorage.removeItem("access_token");
    }
    await setAppLoading(false);
  };

  const astor = async () => {
    const isFirst = await AsyncStorage.getItem("isFirst");
    setFirstScreen(isFirst);
  };

  useEffect(() => {
    astor();
    checkPermission();
    initializeFunction();
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("A new FCM message arrived! Foreground", remoteMessage);
    });

    return unsubscribe;
  }, []);

  const loadAsync = async () => {
    let notif = JSON.parse(await AsyncStorage.getItem("dataNotification"));
    await setDataNotifikasi(notif);
  };

  useEffect(() => {
    PushNotification.configure({
      onRegister: function(token) {
        // console.log("TOKEN:", token);
      },
      // onNotification: async function(notification) {
      //   console.log("NOTIFICATIONSS:", notification);
      //   notification.finish(PushNotificationIOS.FetchResult.NoData);
      //   if (notification.userInteraction == true) {
      //     await setDataNotifikasi(notification);
      //     await AsyncStorage.setItem(
      //       "dataNotification",
      //       JSON.stringify(notification)
      //     );
      //     if (notification.foreground == true) {
      //       await RNRestart.Restart();
      //     }
      //   }
      // },
      onAction: function(notification) {
        console.log("ONACTION:", notification.action);
      },
      onRegistrationError: function(err) {
        console.log(err.message, err);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      onMessage: function(notification) {
        console.log("onmessage:", notification);
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      await RNRestart.Restart();
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      );
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
        }
      });

    loadAsync();
  }, []);

  if (appLoading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: "#FFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{
            resizeMode: "contain",
            width: width / 1.5,
            height: width / 1.5,
          }}
          source={mascot_black}
        />
      </SafeAreaView>
    );
  }

  const client = new ApolloClient({
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            streetNames: relayStylePagination(),
          },
        },
      },
    }),
    link: createUploadLink({ uri: API }),
  });

  return (
    <ApolloProvider client={client}>
      <Provider store={storeState}>
        <MainStackNavigator
          authorizeStatus={authStat}
          authBlocked={authBlocked}
          dNotify={dataNotifikasi}
          isFirst={firstScreen}
          token={appToken}
        />
      </Provider>
    </ApolloProvider>
  );
}
export default App;
