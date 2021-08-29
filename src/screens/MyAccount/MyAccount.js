import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Alert,
  Pressable,
  Image,
  Platform,
  TouchableOpacity,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import { Akunsaya, default_image } from "../../assets/png";
import Ripple from "react-native-material-ripple";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import { Next, Help, SettingsPutih, Xgray } from "../../assets/svg";
import Logout from "../../graphQL/Mutation/Login/Logout";
import { useTranslation } from "react-i18next";
import { Button, Text, Truncate } from "../../component";
import Account from "../../graphQL/Query/Home/Account";
import Toast from "react-native-fast-toast";
import { RNToasty } from "react-native-toasty";

export default function MyAccount(props) {
  const toastRef = useRef();
  const { width } = Dimensions.get("screen");
  const { t, i18n } = useTranslation();
  let [modalLogin, setModalLogin] = useState(false);
  let [token, setToken] = useState("");
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "My Account",
    headerTintColor: "white",
    headerTitle: t("myaccount"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
      color: "white",
    },

    headerRight: () => (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate("AccountStack", {
            screen: "settings",
            params: { datauser: datauser },
          })
        }
        style={{
          //   marginTop: 50,
          marginRight: 15,
          // zIndex: 5,
          // position: "absolute",
        }}
      >
        <SettingsPutih height={22} width={22} style={{}} />
      </TouchableOpacity>
    ),
  };

  const [mutationlogout, { loading, data, error }] = useMutation(Logout, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
    if (tkn === null) {
      setModalLogin(true);
    } else {
      await LoadUserProfile();
    }
  };

  const [
    LoadUserProfile,
    { data: datauser, loading: loadinguser, error: erroruser },
  ] = useLazyQuery(Account, {
    fetchPolicy: "network-only",
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
        useNativeDriver={true}
        visible={modalLogin}
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
            marginTop: 10,
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

            elevation: 6,
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
                // console.log(datauser.user_profile.id);
                props.navigation.push("ProfileStack", {
                  screen: "ProfileTab",
                  params: { token: token },
                });
              }}
              style={{
                zIndex: 999,
                borderColor: "white",
                borderRadius: 60,
                borderWidth: 3,
                backgroundColor: "#B8E0E5",
                height: 100,
                width: 100,
              }}
            >
              <Image
                source={
                  datauser && datauser.user_profile.picture
                    ? { uri: datauser.user_profile.picture }
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
              width: 200,
              height: 120,
              marginLeft: 15,
              // borderWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text type="bold" size="label">
              {datauser && datauser.user_profile.first_name
                ? datauser.user_profile.first_name
                : null}{" "}
              {datauser && datauser.user_profile.last_name
                ? datauser.user_profile.last_name
                : null}
            </Text>
            <Text>
              @
              {datauser && datauser.user_profile.username
                ? datauser.user_profile.username
                : null}
            </Text>
            <Button
              text={t("seemyprofile")}
              size="small"
              style={{
                width: "60%",
                height: "25%",
                marginTop: 15,
              }}
              onPress={() => {
                // console.log(datauser.user_profile.id);
                props.navigation.push("ProfileStack", {
                  screen: "ProfileTab",
                  params: { token: token },
                });
              }}
            ></Button>
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

            // elevation: 6,
            shadowColor: "#FFF",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6.27,

            elevation: 6,
          }}
        >
          <Text type="bold" size="label" style={{ marginBottom: 10 }}>
            {t("accountInformation")}
          </Text>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("fullName")}</Text>
            <Text>
              {datauser && datauser.user_profile.first_name
                ? datauser.user_profile.first_name
                : null}{" "}
              {datauser && datauser.user_profile.last_name
                ? datauser.user_profile.last_name
                : null}
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("emailAddress")}</Text>
            <Text>
              <Truncate
                text={
                  datauser &&
                  datauser.user_profile &&
                  datauser.user_profile.email
                    ? datauser.user_profile.email
                    : t("notSet")
                }
                length={30}
              />
            </Text>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              flexDirection: "row",
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("phoneNumber")}</Text>
            <Text>
              {datauser && datauser.user_profile && datauser.user_profile.phone
                ? datauser.user_profile.phone
                : t("notSet")}
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

            // elevation: 6,
            shadowColor: "#FFF",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.1,
            shadowRadius: 6.27,

            elevation: 6,
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
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("wishlist")}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text type="bold" style={{ marginRight: 10 }}>
                {datauser &&
                datauser.user_profile &&
                datauser.user_profile.count_wishlist
                  ? datauser.user_profile.count_wishlist + " " + "Wishlist"
                  : "No Wishlist"}
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
              paddingVertical: 10,
              borderBottomWidth: 0.5,
              borderBottomColor: "#d3d3d3",
            }}
          >
            <Text>{t("itenerariFavorit")}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text type="bold" style={{ marginRight: 10 }}>
                {datauser &&
                datauser.user_profile &&
                datauser.user_profile.count_itinerary_favorit
                  ? datauser.user_profile.count_itinerary_favorit +
                    " " +
                    "Itinerary"
                  : "No Itinerary"}
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
                // console.log(response);
                // if (loading) {
                //     Alert.alert("Loading!!");
                // }

                if (error) {
                  throw new Error("Error mutation");
                }
                if (response) {
                  await AsyncStorage.setItem("access_token", "");
                  await AsyncStorage.setItem("setting", "");
                  // await LoadUserProfile();
                  props.navigation.navigate("AuthStack", {
                    screen: "SplashScreen",
                  });
                }
              } catch (error) {
                RNToasty.Show({
                  title: error,
                  position: "bottom",
                });
                await AsyncStorage.setItem("access_token", "");
                await AsyncStorage.setItem("setting", "");
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
