import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  Dimensions,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";
// import {
//   NavigationEvents,
//   StackActions,
//   NavigationActions,
// } from "react-navigation";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import { Text, Button } from "..";

export default function Count_Notification({ props, setCont }) {
  const { t, i18n } = useTranslation();

  let [token, setToken] = useState("");

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    NotifCount();
    datanotif && datanotif.count_notif
      ? setCont(datanotif.count_notif.count)
      : null;
    // console.log(tkn);
  };
  // if (token) {
  const [
    NotifCount,
    { data: datanotif, loading: loadingnotif, error: errornotif },
  ] = useLazyQuery(CountNotif, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  useEffect(() => {
    loadAsync();

    // }
  }, []);
  console.log(datanotif);
  return (
    <View>
      {/* <NavigationEvents
        onDidFocus={() =>
          datanotif && datanotif.count_notif
            ? setCont(datanotif.count_notif.count)
            : null
        }
      ></NavigationEvents> */}
    </View>
  );
}
