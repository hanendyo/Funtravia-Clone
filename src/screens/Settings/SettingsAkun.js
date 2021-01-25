import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { View, Dimensions, StyleSheet, Platform, Alert } from "react-native";
import Modal from "react-native-modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OptionsVertBlack, Arrowbackwhite } from "../../assets/svg";
import CountryList from "../../graphQL/Query/Countries/CountryList";
import CurrencyList from "../../graphQL/Query/Countries/CurrencyList";
import GetSetting from "../../graphQL/Query/Settings/GetSetting";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { dateFormat } from "../../component/src/dateformatter.js";
import { Truncate } from "../../component";
import DatePicker from "react-native-modern-datepicker";

export default function SettingsAkun(props) {
  const { t, i18n } = useTranslation();
  const [modalEmail, setModalEmail] = useState(false);
  const [modalPhone, setModalPhone] = useState(false);
  const [modalBirth, setModalBirth] = useState(false);
  let [date, setDate] = useState();
  let [token, setToken] = useState("");
  let [setLanguage] = useState(i18n.language);
  let [setting, setSetting] = useState(props.route.params.setting);

  console.log(date);

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

  const [
    GetDataSetting,
    { data: datas, loading: loadings, error: errors },
  ] = useLazyQuery(GetSetting, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await GetDataSetting();
    await GetCountryList();
    await GetCurrencyList();
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  const [GetCountryList, { data, loading, error }] = useLazyQuery(CountryList);
  const [
    GetCurrencyList,
    { data: datacurrency, loading: loadingcurrency, error: errorcurrency },
  ] = useLazyQuery(CurrencyList);
  const languageToggle = async (value) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    await AsyncStorage.setItem("setting_language", value);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  const setstart = (x) => {
    setDate(x);
  };

  return (
    <ScrollView
      style={{
        backgroundColor: "#F6F6F6",
      }}
    >
      {/*Modal Email */}
      <View style={styles.centeredView}>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={modalEmail}
          onRequestClose={() => setModalEmail(false)}
          onBackdropPress={() => {
            setModalEmail(false);
          }}
          // style={{ height: Dimensions.get("screen").width * 0.2 }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalViewEmail}>
              <Text
                type="bold"
                size="label"
                onPress={() => {
                  setModalEmail(false),
                    props.navigation.navigate("SettingEmailChange");
                }}
              >
                Change Email
              </Text>
            </View>
          </View>
        </Modal>
      </View>

      {/*Modal Phone */}
      <View style={styles.centeredView}>
        <Modal
          animationIn="fadeIn"
          animationOut="fadeOut"
          isVisible={modalPhone}
          onRequestClose={() => setModalPhone(false)}
          onBackdropPress={() => {
            setModalPhone(false);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{ color: "#D75995", marginBottom: 20 }}
                size="label"
                type="bold"
              >
                Delete Phone Number
              </Text>
              <Text
                type="bold"
                size="label"
                onPress={() => {
                  setModalPhone(!modalPhone);
                }}
                onPress={() => {
                  setModalPhone(false),
                    props.navigation.navigate("SettingPhoneChange");
                }}
              >
                Change Phone Number
              </Text>
            </View>
          </View>
        </Modal>
      </View>

      {/* Modal Birth Date */}

      <Modal
        onRequestClose={() => setModalBirth(false)}
        onBackdropPress={() => setModalBirth(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalBirth}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
            width: Dimensions.get("screen").width - 40,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <DatePicker
            options={{}}
            // current={startDate ? startDate : getToday()}
            // selected={startDate ? startDate : getToday()}
            onDateChange={(x) => setstart(x)}
            mode="calendar"
            style={{ borderRadius: 10 }}
          />
        </View>
      </Modal>

      {/* <NavigationEvents onDidFocus={() => loadAsync()} /> */}
      <View
        style={{
          flexDirection: "column",
          marginTop: 5,
          backgroundColor: "#FFFFFF",
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            paddingTop: 13,
          }}
        >
          <Text size="label" type="bold">
            {t("personalData")}
          </Text>
        </View>
        <Ripple
          rippleCentered={true}
          // onPress={() => setModelSetNegara(true)}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text size="description" type="regular">
              {t("firstName")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                <Truncate
                  text={
                    setting.user.first_name
                      ? setting.user.first_name
                      : "Not Set"
                  }
                  length={30}
                />
              </Text>
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          // onPress={() => setModelSetNegara(true)}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text size="description" type="regular">
              {t("lastName")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                <Truncate
                  text={
                    setting && setting.user && setting.user.last_name
                      ? setting.user.last_name
                      : "Not Set"
                  }
                  length={30}
                />
              </Text>
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text size="description" type="regular">
              {t("gender")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                {setting && setting.user && setting.user.gender
                  ? setting.user.gender
                  : "Not Set"}
              </Text>
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={() => setModalBirth(true)}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text size="description" type="regular">
              {t("birthdate")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                {setting && setting.user && setting.user.birth_date
                  ? dateFormat(setting.user.birth_date)
                  : "Not Set"}
              </Text>
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          // onPress={() => setModelSetCurrency(true)}
          style={{
            paddingHorizontal: 15,
            paddingVertical: 13,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
            }}
          >
            <Text size="description" type="regular">
              {t("cityOfRecidence")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text size="description" type="light" style={{}}>
                {"Not Set"}
              </Text>
            </View>
          </View>
        </Ripple>
      </View>
      <View
        style={{
          flexDirection: "column",
          marginTop: 4,
          paddingHorizontal: 15,
          paddingVertical: 13,
          backgroundColor: "#FFFFFF",
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
        }}
      >
        <Text
          size="label"
          type="bold"
          style={{
            marginBottom: 5,
          }}
        >
          {t("email")}
        </Text>
        {setting && setting.user && setting.user.email ? (
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width - 50,
              }}
            >
              <View
                style={{
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  type="regular"
                  size="description"
                  style={{
                    alignSelf: "flex-start",
                  }}
                >
                  {setting && setting.user && setting.user.email
                    ? setting.user.email
                    : "Not Set"}
                </Text>
                <Text type="regular" size="small">
                  {t("emailUsed")}
                </Text>
              </View>
            </View>
            <OptionsVertBlack
              width={20}
              height={20}
              onPress={() => {
                setModalEmail(true);
              }}
            />
          </View>
        ) : (
          <Button
            type="box"
            size="medium"
            color="tertiary"
            text={t("AddEmail")}
            onPress={() =>
              props.navigation.navigate("SettingEmail", {
                dataEmail: setting.user,
              })
            }
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "column",
          marginTop: 4,
          paddingHorizontal: 15,
          paddingVertical: 13,
          backgroundColor: "#FFFFFF",
          shadowColor: "gray",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: arrayShadow.shadowOpacity,
          shadowRadius: arrayShadow.shadowRadius,
          elevation: arrayShadow.elevation,
        }}
      >
        <Text
          size="label"
          type="bold"
          style={{
            marginBottom: 5,
          }}
        >
          {t("phoneNumber")}
        </Text>
        {setting && setting.user && setting.user.email ? (
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width - 50,
              }}
            >
              <View
                style={{
                  alignContent: "flex-start",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  type="regular"
                  size="description"
                  style={{
                    alignSelf: "flex-start",
                  }}
                >
                  {setting.user.phone}
                </Text>
                <Text type="regular" size="small">
                  {t("phoneUsed")}
                </Text>
              </View>
            </View>
            <OptionsVertBlack
              width={20}
              height={20}
              onPress={() => {
                setModalPhone(true);
              }}
            />
          </View>
        ) : (
          <Button
            type="box"
            size="medium"
            color="tertiary"
            text={t("addPhoneNumber")}
            onPress={() => props.navigation.navigate("SettingPhone")}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  nextArrowView: {
    position: "absolute",
    right: 15,
    alignItems: "flex-end",
    height: 50,
    width: 50,
  },
  nextArrowImage: {
    resizeMode: "contain",
    height: 15,
    width: 15,
  },
  logOutView: {
    width: Dimensions.get("window").width - 30,
    alignSelf: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  anotherNextArrowView: {
    height: 15,
    width: 15,
  },
  rightText: {
    position: "absolute",
    right: 15,
    height: 50,
    width: 150,
    justifyContent: "center",
    flexDirection: "row",
  },
  languageButton: {
    height: 25,
    width: 85,
    backgroundColor: "#F1F1F1",
    borderColor: "#F1F1F1",
    borderWidth: 1,
    borderRadius: 4,
  },
  langButtonFont: {
    fontSize: 16,
  },

  // testt modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    width: Dimensions.get("screen").width * 0.7,
    height: Dimensions.get("screen").width * 0.4,
    alignItems: "center",
    justifyContent: "center",
  },
  modalViewEmail: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    width: Dimensions.get("screen").width * 0.7,
    height: Dimensions.get("screen").width * 0.2,
    alignItems: "center",
    justifyContent: "center",
  },
});
