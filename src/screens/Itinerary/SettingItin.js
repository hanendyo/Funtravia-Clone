import React, { useState, useCallback, useEffect } from "react";
import { List, ListItem, Switch } from "native-base";
import {
  View,
  Dimensions,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Arrowbackios, Arrowbackwhite } from "../../assets/svg";
import EditPrivate from "../../graphQL/Mutation/Itinerary/EditPrivate";
import { useMutation } from "@apollo/react-hooks";
import { Button, Text } from "../../component";
import { useTranslation } from "react-i18next";
import SettingCurrency from "../Settings/SettingCurrency";
import CurrencyList from "../../graphQL/Query/Countries/CurrencyList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery } from "@apollo/react-hooks";
import { useSelector } from "react-redux";

export default function SettingItin(props) {
  const { t, i18n } = useTranslation();
  const settingApps = useSelector((data) => data.setting);
  const tokenApps = useSelector((data) => data.token);
  let [index, setIndex] = useState(0);
  const HeaderComponent = {
    headerShown: true,
    title: "Setting",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("setting")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      marginLeft: Platform.OS == "ios" ? null : -15,
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      // position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  const loadAsync = async () => {
    GetCurrencyList();
  };

  let [token, setToken] = useState(props.route.params.token);
  let [iditin, setId] = useState(props.route.params.iditin);
  let [isPrivate, setPrivate] = useState(props.route.params.isPrivate);
  const [modalSetCurrency, setModalSetCurrency] = useState(false);
  const [setting, setSetting] = useState(settingApps);

  useEffect(() => {
    props.navigation?.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    GetCurrencyList,
    { data: datacurrency, loading: loadingcurrency, error: errorcurrency },
  ] = useLazyQuery(CurrencyList);
  const languageToggle = async (value) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    await AsyncStorage.setItem("setting_language", value);
  };

  const [
    mutationEditPrivate,
    { loading: loadingPrivate, data: dataPrivate, error: errorPrivate },
  ] = useMutation(EditPrivate, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const savePrivate = async (x) => {
    setPrivate(!x);
    try {
      let response = await mutationEditPrivate({
        variables: {
          id: iditin,
        },
      });
      if (loadingPrivate) {
        Alert.alert("Loading!!");
      }
      if (errorPrivate) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.change_publication.code !== 200) {
          setPrivate(x);
          throw new Error(response.data.change_publication.message);
        }
        setPrivate(response.data.change_publication.isprivate);
      }
    } catch (error) {
      setPrivate(x);
      Alert.alert("" + error);
    }
  };

  return (
    <ScrollView>
      <List>
        <ListItem
          style={{
            width: Dimensions.get("screen").width - 40,
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <View style={styles.textView}>
            <Text
              size={"description"}
              type={"regular"}
              style={{ width: "70%" }}
            >
              {t("PublicItinerary")}
            </Text>
            <Text
              size={"small"}
              type={"regular"}
              style={{
                color: "#6C6C6C",
                width: "70%",
              }}
            >
              {t("makepublic")}
            </Text>
          </View>
          <Switch
            style={styles.switchView}
            onValueChange={() => savePrivate(isPrivate)}
            value={!isPrivate}
          />
        </ListItem>
        <ListItem
          style={{
            width: Dimensions.get("screen").width - 40,
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <View style={styles.textView}>
            <Text
              size={"description"}
              type={"regular"}
              style={{ width: "70%" }}
            >
              {t("ChatNotification")}
            </Text>
            <Text
              size={"small"}
              type={"regular"}
              style={{
                color: "#6C6C6C",

                width: "70%",
              }}
            >
              {t("getNotification")}
            </Text>
          </View>
          <Switch
            style={styles.switchView}
            // onValueChange={toggleAccountSwitch}
            // value={accountSwitch}
          />
        </ListItem>
        <ListItem
          style={{
            // width: Dimensions.get('screen').width - 40,
            justifyContent: "space-between",
          }}
        >
          <View style={styles.textView}>
            <Text size={"description"} type={"regular"}>
              {t("currency")}
            </Text>
            {/* <CustomText
								customTextStyle={{
									color: '#6C6C6C',
									fontSize: 12, width:'70%',
									fontFamily: 'Lato-Regular',
								}}>
								Get notify when you receive message from your travel buddy
							</CustomText> */}
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate("AccountStack", {
                  screen: "SettingCurrency",
                  params: {
                    props: props,
                    setting: setting,
                    token: token,
                    setSetting: (e) => setSetting(e),
                    index: 0,
                    data: datacurrency?.currency_list
                      ? datacurrency?.currency_list
                      : [],
                  },
                })
              }
            >
              <Text
                size="description"
                type="reguler"
                style={{
                  marginRight: 15,
                }}
              >
                {setting?.currency?.name}
              </Text>
            </TouchableOpacity>
          </View>
        </ListItem>
      </List>

      {/* {datacurrency && datacurrency.currency_list.length ? (
        <SettingCurrency
          modals={modalSetCurrency}
          setModelSetCurrency={(e) => setModalSetCurrency(e)}
          masukan={(e) => setSetting(e)}
          data={datacurrency.currency_list}
          selected={setting}
          token={token}
        />
      ) : null} */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  main: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  submitButtonView: {
    width: Dimensions.get("window").width * 0.85,

    alignSelf: "center",
    justifyContent: "center",

    marginTop: 150,
  },
  switchView: {
    // backgroundColor: '#209fae',
    // color: '#209fae',
    position: "absolute",
    right: 0,
    // alignItems: 'flex-end',
    height: 50,
    width: 50,
  },
  textView: {},
});
