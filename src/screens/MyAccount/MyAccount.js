import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Pressable,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { default_image } from "../../assets/png";
import Ripple from "react-native-material-ripple";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Next, Help, Xgray, Nextpremier, Settings } from "../../assets/svg";
import Logout from "../../graphQL/Mutation/Login/Logout";
import { useTranslation } from "react-i18next";
import { Button, Text, Truncate } from "../../component";
import Account from "../../graphQL/Query/Home/Account";
import Toast from "react-native-fast-toast";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";
import { useDispatch, useSelector } from "react-redux";
import { setSettingUser, setTokenApps } from "../../redux/action";
import { useQuery } from "@apollo/client";
import GetSettingUser from "../../graphQL/Query/Settings/GetSettingUser";

export default function MyAccount(props) {
  let dispatch = useDispatch();
  let tokenApps = useSelector((data) => data.token);
  let setting = useSelector((data) => data.setting);
  // let [setting, setSetting] = useState("");
  const toastRef = useRef();
  const { width } = Dimensions.get("screen");
  const { t, i18n } = useTranslation();
  let [modalLogin, setModalLogin] = useState(false);
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "My Account",
    headerTintColor: "white",
    headerTitle: (
      <Text style={{ color: "#fff" }} size="header" type="bold">
        {t("myaccount")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
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
      marginLeft: 10,
    },

    // headerRight: () => (
    //   <TouchableOpacity
    //     onPress={() =>
    //       props.navigation.navigate("AccountStack", {
    //         screen: "settings",
    //         params: { datauser: datauser },
    //       })
    //     }
    //     style={{
    //       //   marginTop: 50,
    //       marginRight: 15,
    //       // zIndex: 5,
    //       // position: "absolute",
    //     }}
    //   >
    //     {/* <SettingsPutih height={22} width={22} style={{}} /> */}
    //   </TouchableOpacity>
    // ),
  };

  const loadAsync = async () => {
    if (tokenApps === null) {
      setModalLogin(true);
    } else {
      await LoadUserProfile();
    }
  };

  const [mutationlogout, { loading, data, error }] = useMutation(Logout, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const [userData, setUserData] = useState(null);

  const [
    LoadUserProfile,
    { data: datauser, loading: loadinguser, error: erroruser },
  ] = useLazyQuery(Account, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setUserData(datauser?.user_profile);
    },
  });

  const { data: datas, loading: loadings, error: errors } = useQuery(
    GetSettingUser,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenApps,
        },
      },
      onCompleted: () => {
        if (datas?.setting_data_user) {
          // setSetting(datas?.setting_data_user);

          AsyncStorage.setItem(
            "setting",
            JSON.stringify(datas?.setting_data_user)
          );
        }
      },
    }
  );

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation, HeaderComponent]);

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 1.5,
  };

  return (
    <View style={{ zIndex: -1 }}>
      <Modal
        visible={modalLogin}
        useNativeDriver={true}
        onRequestClose={() => true}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          // onPress={() => setModalLogin(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: Dimensions.get("screen").height / 4,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 120,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
                size="title"
                type="bold"
              >
                {t("LoginFirst")}
              </Text>
              <Pressable
                onPress={() => {
                  props.navigation.navigate("HomeScreen");
                  setModalLogin(false);
                }}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <View
              style={{
                alignItems: "center",
                marginHorizontal: 30,
                marginBottom: 15,
                marginTop: 12,
              }}
            >
              <Text style={{ marginBottom: 5 }} size="title" type="bold">
                {t("nextLogin")}
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 18 }}
                size="label"
                type="regular"
              >
                {t("textLogin")}
              </Text>
            </View>
            <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
              <Button
                style={{ marginBottom: 5 }}
                onPress={() => {
                  setModalLogin(false);
                  props.navigation.push("AuthStack", {
                    screen: "LoginScreen",
                  });
                }}
                type="icon"
                text={t("signin")}
              ></Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                  {t("or")}
                </Text>
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  size="label"
                  type="bold"
                  style={{ color: "#209FAE" }}
                  onPress={() => {
                    setModalLogin(false);
                    props.navigation.push("AuthStack", {
                      screen: "RegisterScreen",
                    });
                  }}
                >
                  {t("createAkunLogin")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 15,
            marginLeft: 15,
            marginRight: 15,
            marginBottom: 5,
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 10,
            borderRadius: 10,
            flexDirection: "row",
            shadowColor: "#FFF",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6.27,
            elevation: 2,
          }}
        >
          <View
            style={{
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <Pressable
              onPress={() => {
                props.navigation.push("ProfileStack", {
                  screen: "ProfileTab",
                  params: { token: tokenApps },
                });
              }}
              style={{
                zIndex: 999,
                borderColor: "white",
                borderRadius: 60,
                borderWidth: 1,
                backgroundColor: "#B8E0E5",
                height: normalize(100),
                width: normalize(100),
              }}
            >
              <Image
                source={
                  userData && userData.picture
                    ? { uri: userData.picture }
                    : default_image
                }
                style={{
                  borderRadius: 60,
                  resizeMode: "cover",
                  height: "100%",
                  width: "100%",
                }}
              />
            </Pressable>
          </View>
          <View
            style={{
              flex: 1,
              maxHeight: "90%",
              marginLeft: 15,
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <Text type="bold" size="title">
                {userData && userData.first_name ? userData.first_name : null}{" "}
                {userData && userData.last_name ? userData.last_name : null}
              </Text>
              <Text size="label" type="regular">
                @{userData && userData.username ? userData.username : null}
              </Text>
              <Pressable
                onPress={() => {
                  props.navigation.push("ProfileStack", {
                    screen: "ProfileTab",
                    params: { token: tokenApps },
                  });
                }}
                style={{
                  height: 20,
                  marginTop: 10,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text
                  size="description"
                  type="bold"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                    color: "#209fae",
                  }}
                >
                  {t("seemyprofile")}
                </Text>
                <Nextpremier
                  height={10}
                  width={10}
                  style={{
                    marginVertical: 10,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                />
              </Pressable>
            </View>
            <Pressable
              onPress={() =>
                props.navigation.navigate("AccountStack", {
                  screen: "settings",
                  params: {
                    userData: userData,
                    token: tokenApps,
                    setting: setting,
                  },
                })
              }
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Settings height={30} width={30} />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 5,
            marginLeft: 15,
            marginRight: 15,
            padding: 20,
            borderRadius: 10,
            // shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 5,
            // },
            // shadowOpacity: 0.1,
            // shadowRadius: 6.27,

            // elevation: 2,
            shadowColor: "#FFF",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6.27,

            elevation: 2,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 10 }}>
            {t("accountInformation")}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ marginTop: 0, marginBottom: 15 }}
            >
              {t("fullName")}
            </Text>
            <View style={{ width: "60%", marginBottom: 15 }}>
              <Text
                size="label"
                type="regular"
                numberOfLines={2}
                style={{ textAlign: "right" }}
              >
                {userData && userData.first_name ? userData.first_name : null}{" "}
                {userData && userData.last_name ? userData.last_name : null}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ marginTop: 12, marginBottom: 15 }}
            >
              {t("emailAddress")}
            </Text>
            <Text
              size="label"
              type="regular"
              style={{ marginTop: 12, marginBottom: 15 }}
            >
              <Truncate
                text={userData && userData.email ? userData.email : t("notSet")}
                length={30}
              />
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              style={{ marginTop: 12, marginBottom: 15 }}
              size="label"
              type="regular"
            >
              {t("phoneNumber")}
            </Text>
            <Text
              style={{ marginTop: 12, marginBottom: 15 }}
              size="label"
              type="regular"
            >
              {userData && userData.phone ? userData.phone : t("notSet")}
            </Text>
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#FFFFFF",
            marginTop: 10,
            marginRight: 15,
            marginLeft: 15,
            marginBottom: 10,
            padding: 20,
            borderRadius: 10,
            // shadowColor: "#000",
            // shadowOffset: {
            //   width: 0,
            //   height: 5,
            // },
            // shadowOpacity: 0.1,
            // shadowRadius: 6.27,

            // elevation: 2,
            shadowColor: "#FFF",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6.27,

            elevation: 2,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 10 }}>
            {t("favourites")}
          </Text>
          <Ripple
            onPress={() =>
              props.navigation.navigate("AccountStack", {
                screen: "Wishlist",
              })
            }
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ marginBottom: 15, marginTop: 5 }}
            >
              {t("wishlist")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text type="bold" size="label" style={{ marginRight: 10 }}>
                {userData && userData.count_wishlist
                  ? userData.count_wishlist + " " + "Wishlist"
                  : "0"}
              </Text>
              <Next width={15} height={15} />
            </View>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("ItineraryStack", {
                screen: "ItineraryFavorite",
              });
            }}
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ marginTop: 12, marginBottom: 15 }}
            >
              {t("itinerary")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text type="bold" size="label" style={{ marginRight: 10 }}>
                {userData && userData.count_itinerary_favorit
                  ? userData.count_itinerary_favorit + " " + "Itinerary"
                  : "0"}
              </Text>
              <Next width={15} height={15} />
            </View>
          </Ripple>
          <Ripple
            onPress={() => {
              props.navigation.navigate("JournalStackNavigation", {
                screen: "JournalFavorite",
              });
            }}
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              // paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d1d1d1",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ marginTop: 12, marginBottom: 15 }}
            >
              {t("journal")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text type="bold" size="label" style={{ marginRight: 10 }}>
                {userData && userData.count_journal_favorite
                  ? userData.count_journal_favorite + " " + t("journal")
                  : "0"}
              </Text>
              <Next width={15} height={15} />
            </View>
          </Ripple>
        </View>

        <TouchableOpacity
          onPress={() =>
            RNToasty.Show({
              title: "Coming Soon",
              position: "bottom",
            })
          }
          style={{
            flexDirection: "row",
            paddingVertical: 5,
            paddingHorizontal: 20,
          }}
        >
          <Help />
          <Text type="bold" style={{ marginLeft: 5 }}>
            {t("help")}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            alignItems: "center",
            marginBottom: 10,
            height: 150,
          }}
        >
          <Button
            variant="bordered"
            color="secondary"
            text={t("logout")}
            onPress={async () => {
              let pushTkn = await AsyncStorage.getItem("FCM_TOKEN");
              try {
                if (pushTkn == null || pushTkn == "") {
                  throw new Error("push token empty");
                }
                let response = await mutationlogout({
                  variables: { token: pushTkn },
                });

                if (response) {
                  await AsyncStorage.setItem("access_token", "");
                  await AsyncStorage.setItem("setting", JSON.stringify({}));
                  dispatch(setTokenApps(null));
                  dispatch(setSettingUser(null));

                  // await LoadUserProfile();
                  props.navigation.navigate("AuthStack", {
                    screen: "SplashScreen",
                  });
                }
              } catch (error) {
                RNToasty.Show({
                  title: t("somethingwrong"),
                  position: "bottom",
                });
                await AsyncStorage.setItem("access_token", "");
                await AsyncStorage.setItem("setting", JSON.stringify({}));
                // await LoadUserProfile();
                props.navigation.navigate("AuthStack", {
                  screen: "SplashScreen",
                });
              }
            }}
            style={{
              width: Dimensions.get("window").width - 30,
              marginVertical: 10,
            }}
          ></Button>
        </View>
      </ScrollView>
      <Toast ref={toastRef} />
    </View>
  );
}
