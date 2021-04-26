import React, { useState, useCallback, useEffect } from "react";
import { Container, Header, Content, List, ListItem, Right } from "native-base";
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { back_arrow_white } from "../../assets/png";
import { Nextpremier, Arrowbackwhite } from "../../assets/svg";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
const { width, height } = Dimensions.get("screen");

import { useLazyQuery, useQuery, useMutation } from "@apollo/react-hooks";
import UpdatePushNotif from "../../graphQL/Mutation/Setting/UpdatePushNotif";

export default function NotificationSettings(props) {
  const { t, i18n } = useTranslation();
  let [accountSwitch, setAccountSwitch] = useState(false);
  let [priceSwitch, setPriceSwitch] = useState(false);
  let [paymentStatusSwitch, setPaymentStatusSwitch] = useState(false);
  let [AccommodationSwitch, setAccommodationSwitch] = useState(false);
  let [promoSwitch, setPromoSwitch] = useState(false);
  let [reviewSwitch, setReviewSwitch] = useState(false);
  let [paymentReminderSwitch, setPaymentReminderSwitch] = useState(false);
  let [selected, setSelected] = useState();
  let [token, setToken] = useState();
  let [setting, setSetting] = useState(props.route.params.setting);
  const HeaderComponent = {
    headerTitle: t("accountInformation"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
      color: "white",
    },
    headerLeft: () => (
      <Button
        type="circle"
        size="small"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
      >
        <Arrowbackwhite height={20} width={20} />
      </Button>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },

    headerRight: () => {
      return null;
    },
  };
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
  };
  const [
    MutationsetNotif,
    { loading: loadingSet, data: dataSet, error: errorSet },
  ] = useMutation(UpdatePushNotif, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const Update_setting = async (tokens) => {
    if (tokens || tokens !== "") {
      try {
        let response = await MutationsetNotif({
          variables: {
            aktivasi_akun: setting.aktivasi_akun,
            price_notif: setting.price_notif,
            status_order_and_payment: setting.status_order_and_payment,
            hotels_and_flight_info: setting.hotels_and_flight_info,
            funtravia_promo: setting.funtravia_promo,
            review_response: setting.review_response,
            payment_remender: setting.payment_remender,
          },
        });
        // if (loadingLike) {
        // 	Alert.alert('Loading!!');
        // }
        // if (errorLike) {
        // 	throw new Error('Error Input');
        // }
        if (response.data) {
          if (
            response.data.update_notif_settings.code === 200 ||
            response.data.update_notif_settings.code === "200"
          ) {
            await AsyncStorage.setItem("setting", JSON.stringify(setting));
            await props.navigation.navigate("AccountStack", {
              screen: "settings",
            });
          } else {
            throw new Error(response.data.update_currency_settings.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const toggleSwitch = (value, type) => {
    let tempData = { ...setting };
    tempData[type] = value;
    setSetting(tempData);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
      }}
    >
      <ScrollView>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("accountActivation")}
            </Text>
            <Text size="small">{t("getActivityReport")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) => toggleSwitch(item, "aktivasi_akun")}
            value={setting.aktivasi_akun}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("priceNotification")}
            </Text>
            <Text size="small">{t("getPriceNotification")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) => toggleSwitch(item, "price_notif")}
            value={setting.price_notif}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("orderPaymentStatus")}
            </Text>
            <Text size="small">{t("informTheStatus")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) =>
              toggleSwitch(item, "status_order_and_payment")
            }
            value={setting.status_order_and_payment}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("hotelFlightInfo")}
            </Text>
            <Text size="small">{t("hotelFlightReminder")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) =>
              toggleSwitch(item, "hotels_and_flight_info")
            }
            value={setting.hotels_and_flight_info}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("funtraviaPromo")}
            </Text>
            <Text size="small">{t("getDeal")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) => toggleSwitch(item, "funtravia_promo")}
            value={setting.funtravia_promo}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("reviewSummary")}
            </Text>
            <Text size="small">{t("reviewNotification")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) => toggleSwitch(item, "review_response")}
            value={setting.review_response}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
            // marginBottom: 5,
            padding: 15,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View style={{ width: "80%" }}>
            <Text size="description" type="bold">
              {t("paymentReminder")}
            </Text>
            <Text size="small">{t("hotelFlightReminder")}</Text>
          </View>
          <Switch
            trackColor={{ false: "#9A9A9A", true: "#209FAE" }}
            thumbColor={"white"}
            ios_backgroundColor={"white"}
            onValueChange={(item) => toggleSwitch(item, "payment_remender")}
            value={setting.payment_remender}
          />
        </View>
      </ScrollView>
      <Button
        text="Simpan"
        type="box"
        color="secondary"
        size="medium"
        style={{
          width: width - 80,
          alignSelf: "center",
          marginBottom: 20,
        }}
        onPress={() => {
          Update_setting(token);
        }}
      />
    </View>
  );
}

NotificationSettings.navigationOptions = ({ navigation }) => ({
  headerTitle: (
    <Text size="label" style={{ color: "white" }}>
      Push Notification
    </Text>
  ),
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    fontSize: 50,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Bold",
    fontSize: 16,
    color: "white",
  },
  headerLeft: (
    <Button
      type="circle"
      size="small"
      variant="transparent"
      onPress={() => navigation.goBack()}
    >
      <Arrowbackwhite height={20} width={20} />
    </Button>
  ),
  headerLeftContainerStyle: {
    paddingLeft: 10,
  },

  headerRight: () => {
    return null;
  },
});
