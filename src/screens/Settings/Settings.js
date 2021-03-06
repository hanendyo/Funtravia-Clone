import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  View,
  Dimensions,
  StyleSheet,
  Platform,
  Image,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Nextpremier, Arrowbackwhite, Arrowbackios } from "../../assets/svg";
import SettingNegara from "./SettingNegara";
import SettingCurrency from "./SettingCurrency";
import CountryList from "../../graphQL/Query/Countries/CountryList";
import CurrencyList from "../../graphQL/Query/Countries/CurrencyList";
import GetSetting from "../../graphQL/Query/Settings/GetSetting";
import GetSettingUser from "../../graphQL/Query/Settings/GetSettingUser";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import Ripple from "react-native-material-ripple";
import { useDispatch, useSelector } from "react-redux";
import { setSettingUser, setTokenApps } from "../../redux/action";

export default function Settings(props) {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // let [token, setToken] = useState(props.route.params.token);
  // let [setting, setSetting] = useState(props.route.params.setting);
  let token = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);
  let [language, setLanguage] = useState(i18n.language);
  let [modsettingnegara, setModelSetNegara] = useState(false);
  let [modsettingcurrency, setModelSetCurrency] = useState(false);
  let [country, setCountry] = useState([]);
  let [index, setIndex] = useState(0);

  const HeaderComponent = {
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
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
      position: "absolute",
      zIndex: 999,
      marginLeft: 15,
    },
    headerLeft: () => (
      <Button
        type="circle"
        size="small"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
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
    let tkn = await AsyncStorage.getItem("access_token");
    // await setToken(tkn);
    // dispatch(setTokenApps(`Bearer ${tkn}`));
    await GetCountryList();
    await GetCurrencyList();
    await getSettingUser();
    let setsetting = await AsyncStorage.getItem("setting");
    // setSetting(JSON.parse(setsetting));
    dispatch(setSettingUser(JSON.parse(setsetting)));
  };

  const [GetCountryList, { data, loading, error }] = useLazyQuery(CountryList, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      if (data) {
        const tempData = [...data?.country_list];
        let index = tempData.findIndex(
          (k) => k["id"] === setting?.countries?.id
        );
        setIndex(index);
        setCountry(data?.country_list);
      }
    },
  });

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
    getSettingUser,
    { data: datas, loading: loadings, error: errors },
  ] = useLazyQuery(GetSettingUser, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    onCompleted: () => {
      // if (datas.setting_data.user) {
      // setSetting(datas?.setting_data_user);
      AsyncStorage.setItem("setting", JSON.stringify(datas?.setting_data_user));
      dispatch(setSettingUser(datas?.setting_data_user));
      // }
    },
  });

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
  return (
    <ScrollView
      style={{
        backgroundColor: "#F6F6F6",
      }}
    >
      {/* <NavigationEvents onDidFocus={() => loadAsync()} /> */}
      <View
        style={{
          marginTop: 15,
          marginHorizontal: 15,
          backgroundColor: "#FFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <Text
            size="title"
            type="bold"
            style={{
              marginBottom: 10,
            }}
          >
            {t("profileSetting")}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text size="label" type="regular">
              {t("languages")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Button
                size="small_light"
                color={language == "en" ? "primary" : "green"}
                variant="normal"
                onPress={() => {
                  languageToggle("en"),
                    props?.navigation.setOptions({
                      headerTitle: (
                        <Text
                          type="bold"
                          size="header"
                          style={{ color: "#fff" }}
                        >
                          {" "}
                          {t("setting")}
                        </Text>
                      ),
                    });
                }}
                text={
                  <Text
                    size="readable"
                    // type={language == "en" ? "bold" : "light"}
                    style={{
                      color: language == "en" ? "#FFF" : "#464646",
                      // fontWeight: language == "en" ? "900" : "100",
                    }}
                  >
                    English
                  </Text>
                }
              ></Button>
              <Button
                // type="box"
                size="small_light"
                color={language == "id" ? "primary" : "green"}
                variant="normal"
                onPress={() => {
                  languageToggle("id"),
                    props?.navigation.setOptions({
                      headerTitle: (
                        <Text
                          type="bold"
                          size="header"
                          style={{ color: "#fff" }}
                        >
                          {" "}
                          {t("setting")}
                        </Text>
                      ),
                    });
                }}
                // text="Indonesia"
                text={
                  <Text
                    size="readable"
                    // type={language == "id" ? "bold" : "light"}
                    style={{
                      color: language == "id" ? "#FFF" : "#464646",
                      // fontWeight: language == "id" ? "900" : "100",
                    }}
                  >
                    Indonesia
                  </Text>
                }
                style={{ marginLeft: 5 }}
              ></Button>
            </View>
          </View>
        </View>
        <Ripple
          rippleCentered={true}
          // onPress={() => setModelSetNegara(true)}
          onPress={() =>
            props.navigation.navigate("AccountStack", {
              screen: "SettingCountry",
              params: {
                props: props,
                // setting: setting,
                // token: token,
                // setSetting: (e) => setSetting(e),
                index: index,
                country: country,
              },
            })
          }
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
              {t("country")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                size="label"
                type="light"
                style={{
                  marginRight: 15,
                }}
              >
                {setting?.countries?.name}
              </Text>
              <Nextpremier width={12} height={12} />
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={async () =>
            (await datacurrency) && datacurrency?.currency_list
              ? props.navigation.navigate("AccountStack", {
                  screen: "SettingCurrency",
                  params: {
                    props: props,
                    // setting: setting,
                    // token: token,
                    // setSetting: (e) => setSetting(e),
                    index: index,
                    data: datacurrency?.currency_list
                      ? datacurrency?.currency_list
                      : [],
                  },
                })
              : null
          }
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 12,
              marginBottom: 15,
              // borderWidth: 1,
            }}
          >
            <Text size="label" type="regular">
              {t("currency")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text
                size="label"
                type="light"
                style={{
                  marginRight: 15,
                }}
              >
                {setting?.currency?.name}
              </Text>
              <Nextpremier width={12} height={12} />
            </View>
          </View>
        </Ripple>
      </View>
      <View
        style={{
          marginTop: 15,
          marginHorizontal: 15,
          backgroundColor: "#FFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 5,
        }}
      >
        <Ripple
          rippleCentered={true}
          onPress={() =>
            props.navigation.navigate("SettingsAkun", {
              setting: setting,
              token: token,
            })
          }
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text size="label" type="regular">
              {t("accountInformation")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Nextpremier width={12} height={12} />
            </View>
          </View>
        </Ripple>
      </View>
      <View
        style={{
          marginVertical: 15,
          marginHorizontal: 15,
          backgroundColor: "#FFF",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,
          elevation: 2,
          borderRadius: 10,
        }}
      >
        <View
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginTop: 13,
              marginBottom: 15,
            }}
          >
            <Text type="regular" size="label">
              {t("appVersion")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text type="light" size="description" style={{}}>
                1.0.29
              </Text>
            </View>
          </View>
        </View>
        <Ripple
          rippleCentered={true}
          onPress={() => {
            props.navigation.navigate("about", {
              params: "about",
            });
          }}
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text type="regular" size="label">
              {t("aboutFuntravia")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Nextpremier width={12} height={12} />
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={() => {
            props.navigation.navigate("bantuan");
          }}
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text type="regular" size="label">
              {t("help")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Nextpremier width={12} height={12} />
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={() => {
            props.navigation.navigate("privacy");
          }}
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
            borderBottomColor: "#D1D1D1",
            borderBottomWidth: 0.5,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text type="regular" size="label">
              {t("privacyPolicy")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Nextpremier width={12} height={12} />
            </View>
          </View>
        </Ripple>
        <Ripple
          rippleCentered={true}
          onPress={() => {
            props.navigation.navigate("FAQ");
          }}
          style={{
            paddingHorizontal: 15,
            // paddingVertical: 13,
          }}
        >
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              marginBottom: 15,
              marginTop: 13,
            }}
          >
            <Text type="regular" size="label">
              {t("faq")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Nextpremier width={15} height={15} />
            </View>
          </View>
        </Ripple>
      </View>

      {/* {datacurrency && datacurrency.currency_list.length ? (
        <SettingCurrency
          modals={modsettingcurrency}
          setModelSetCurrency={(e) => setModelSetCurrency(e)}
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
});
