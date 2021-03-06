import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Platform,
  Modal,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  StatusBar,
  NavigateAction,
  FunImage,
  ModalLogin,
  Button,
} from "../../component";
import { DefaultProfileSquare } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import PopularDestination from "./PopularDestination";
import Account from "../../graphQL/Query/Home/Account";
import MenuNew from "./MenuNew";
import DiscoverCard from "./DiscoverCard";
import FunFeed from "./FunFeed";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";
import {
  NotificationBlue,
  ArrowRightHome,
  SearchHome,
  Errors,
  Xgray,
} from "../../assets/svg";
import { RNToasty } from "react-native-toasty";
import normalize from "react-native-normalize";
import { useDispatch, useSelector } from "react-redux";
import {
  setSettingUser,
  setTokenApps,
  setNotifApps,
  setCountMessage,
  setSearchInput,
} from "../../redux/action";
import { CHATSERVER } from "../../config";

const { width, height } = Dimensions.get("screen");
export default function Home(props) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const tokenApps = useSelector((data) => data.token);
  const notifApps = useSelector((data) => data.notif);
  const settingApps = useSelector((data) => data.setting);
  const searchInput = useSelector((data) => data.searchInput);
  let [refresh, setRefresh] = useState(false);
  let [data, setdata] = useState(null);
  let [shareId, setShareId] = useState(props.route.params.shareid);
  let [loadingModal, setLoadingModal] = useState(false);
  let [modalLogin, setModalLogin] = useState(false);
  let [modalBlocked, setModalBlocked] = useState(false);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    let sttng = await AsyncStorage.getItem("setting");
    if (tkn) {
      dispatch(setTokenApps(`Bearer ${tkn}`));
      dispatch(setSettingUser(JSON.parse(sttng)));
      await NotifCount();
      await LoadUserProfile();
    }

    if (props?.route?.params?.authBlocked) {
      setModalBlocked(true);
    }
  };

  const [
    LoadUserProfile,
    { data: dataProfiles, loading: loadingProfiles },
  ] = useLazyQuery(Account, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setdata(dataProfiles?.user_profile);
    },
  });

  const login = () => {
    props.navigation.navigate("AuthStack", { screen: "LoginScreen" });
  };

  const signUp = () => {
    props.navigation.navigate("AuthStack", { screen: "RegisterScreen" });
  };

  const goToProfile = (target) => {
    props.navigation.navigate("ProfileStack", {
      screen: "ProfileTab",
      params: { token: tokenApps },
    });
  };

  const ukuran = 100;

  const [
    NotifCount,
    { data: datanotif, loading: loadingnotif, error: errornotif },
  ] = useLazyQuery(CountNotif, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const searchPage = () => {
    dispatch(
      setSearchInput({ active_src: "", aktifsearch: false, search_input: "" })
    );
    props.navigation.navigate("SearchPg", {
      token: tokenApps,
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const loadNavigate = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    let setting = await AsyncStorage.getItem("setting");
    if (tkn) {
      dispatch(setTokenApps(`Bearer ${tkn}`));
    }
    if (setting) {
      dispatch(setSettingUser(JSON.parse(setting)));
    }
    if (notifApps) {
      switch (notifApps.data.page) {
        case "comment":
          await AsyncStorage.setItem("dataNotification", "");
          await props.navigation.navigate("FeedStack", {
            screen: "CommentPost",
            params: {
              post_id: notifApps.data.post_id,
              token: tokenApps,
            },
          });
          await dispatch(setNotifApps(""));
          break;
        case "notification":
          await AsyncStorage.setItem("dataNotification", "");
          await props.navigation.navigate("Notification", {
            token: tkn,
          });
          await dispatch(setNotifApps(""));
          break;
        case "chatPersonal":
          await AsyncStorage.setItem("dataNotification", "");
          await props.navigation.navigate("ChatStack", {
            screen: "RoomChat",
            params: {
              room_id: notifApps.data.Room,
              receiver: notifApps.data.Receiver,
              name: notifApps.data.Name,
              picture: notifApps.data.Picture,
            },
          });
          await dispatch(setNotifApps(""));
          break;
        case "chatGroup":
          await AsyncStorage.setItem("dataNotification", "");
          await props.navigation.navigate("ChatStack", {
            screen: "GroupRoom",
            params: {
              room_id: notifApps.data.Room,
              name: notifApps.data.Name,
              picture: notifApps.data.Picture,
              from:
                notifApps.data.Picture.substr(0, 9) == "itinerary"
                  ? "itinerary"
                  : "group",
            },
          });
          await dispatch(setNotifApps(""));
          break;
        default:
        // code block
      }
    }
  };

  useEffect(() => {
    loadNavigate();
  }, [notifApps]);

  useEffect(() => {
    if (
      props.route.params &&
      props.route.params?.shareid &&
      props.route.params?.shareid !== "undefined"
    ) {
      setLoadingModal(true);
      NavigateAction(props.navigation, props.route.params?.shareid);
      setTimeout(() => {
        setLoadingModal(false);
      }, 3000);
    }
  }, [props.route.params]);

  let currentCount = 0;
  const backAction = useCallback(() => {
    if (currentCount < 1) {
      currentCount += 1;
      RNToasty.Show({
        title: t("closeDouble"),
        position: "bottom",
      });
    } else {
      BackHandler.exitApp();
    }
    setTimeout(() => {
      currentCount = 0;
    }, 1000);
    return true;
  }, []);

  useEffect(() => {
    props.navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    });
  }, []);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [backAction]);

  const wait = (timeout) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
  };
  const onRefresh = React.useCallback(() => {
    setRefresh(true);
    loadAsync();
    wait(1000).then(() => setRefresh(false));
  }, []);

  function HomeTitle({ title, label, seeAll }) {
    return (
      <View
        style={{
          marginTop: normalize(20),
          marginHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              padding: 0,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 15,
                marginRight: 5,
                width: 5,
                backgroundColor: "#209fae",
                borderRadius: 5,
              }}
            ></View>
            <Text
              type="bold"
              size="title"
              style={{
                alignSelf: "flex-start",
                padding: 0,
                margin: 0,
              }}
            >
              {title}
            </Text>
          </View>
          <Text
            type="regular"
            size="description"
            style={{
              marginLeft: 12,
              marginTop: 1,
            }}
          >
            {label}
          </Text>
        </View>
        {seeAll ? (
          <Text
            onPress={() =>
              props.navigation.navigate("CountryStack", {
                screen: "AllDestination",
              })
            }
            type="bold"
            size="description"
            style={{ color: "#209FAE" }}
          >
            {t("viewAll")}
          </Text>
        ) : null}

        {/* modal login */}
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
              opacity: 0.4,
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

        {/* modal blocked */}
        <Modal visible={modalBlocked} transparent={true}>
          <Pressable
            style={{
              height: Dimensions.get("screen").height,
              width: Dimensions.get("screen").width,
              backgroundColor: "'rgba(0, 0, 0, 0.5)'",
              // opacity: 0.7,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                backgroundColor: "#F6F6F6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                size="label"
                type="bold"
                style={{
                  marginTop: 13,
                  marginBottom: 15,
                }}
              >
                Oops
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "white",
                alignItems: "center",
                alignContent: "center",
                // height: 100,
                width: Dimensions.get("screen").width - 100,
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                paddingVertical: 20,
                paddingHorizontal: 15,
              }}
            >
              <Errors height={80} width={80} />
              <Text
                type="b  // onPress={() => {
                //   setmodalerrors(false);
                // }}old"
                size="title"
                style={{
                  marginTop: 20,
                }}
              >
                {t("titleSuspend")}
              </Text>

              <View
                style={{
                  marginTop: 20,
                  backgroundColor: "#f3f3f3",
                  padding: 20,
                }}
              >
                <Text size="label">{t("descriptSuspend")}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setModalBlocked(false);
                  props.navigation.navigate("AuthStack", {
                    screen: "OnBoardScreen",
                  });
                }}
                style={{
                  paddingTop: 20,
                }}
              >
                <Text
                  type="bold"
                  size="label"
                  style={{
                    color: "#209fae",
                  }}
                >
                  {t("understand")}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  let [scrollY] = useState(new Animated.Value(0));

  const shadowBG = scrollY.interpolate({
    inputRange: [0, height / 4],
    outputRange: [0, 0.5],
    extrapolate: "clamp",
  });

  const elevationBG = scrollY.interpolate({
    inputRange: [0, height / 4],
    outputRange: [0, 3],
    extrapolate: "clamp",
  });

  const colorBG = scrollY.interpolate({
    inputRange: [0, height / 4],
    outputRange: ["rgba(231, 247, 247, 255)", "rgba(255, 255, 255, 1)"],
  });

  const searchBG = scrollY.interpolate({
    inputRange: [0, height / 4],
    outputRange: ["#FFF", "#f9f9f9"],
  });

  // if (loadingModal) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center" }}>
  //       <ActivityIndicator size="large" color="#209FAE" />
  //     </View>
  //   );
  // }

  let [timeNotification, setTimeNotification] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setTimeNotification(false);
    }, 1000);
  }, []);
  if (
    (notifApps && timeNotification) ||
    (props.route.params?.shareid && loadingModal)
  ) {
    return (
      <View
        style={{
          position: "absolute",
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
          backgroundColor: "#fff",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#209FAE" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar backgroundColor="#14646e" barStyle="light-content" />

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: { y: scrollY },
              },
            },
          ],
          { useNativeDriver: false }
        )}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View
          style={{
            backgroundColor: "rgba(231, 247, 247, 255)",
          }}
        >
          <Animated.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              // paddingHorizontal: 20,
              paddingLeft: 20,
              paddingRight: 15,
              paddingTop: 10,
              paddingBottom: 10,
              backgroundColor: colorBG,
              shadowColor: "#464646",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: shadowBG,
              elevation: elevationBG,
              // borderWidth: 3,
            }}
          >
            <Animated.View
              style={{
                backgroundColor: searchBG,
                paddingHorizontal: Platform.OS === "ios" ? 20 : 10,
                marginVertical: Platform.OS === "ios" ? 7 : 3,
                // backgroundColor: "red",
                width: Dimensions.get("window").width - 80,
                borderRadius: 3,
                borderWidth: 1.5,
                borderColor: searchBG,
              }}
            >
              <TouchableOpacity
                onPress={() => searchPage()}
                style={{
                  alignItems: "center",
                  justifyContent: "flex-start",
                  height: Platform.OS === "ios" ? 45 : 34,
                  flexDirection: "row",
                  borderColor: "#F6F6F6",
                  alignSelf: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    marginRight: 10,
                  }}
                >
                  <SearchHome height={20} width={20} />
                </View>
                <View style={{ width: "90%" }}>
                  <Text
                    type="bold"
                    numberOfLines={1}
                    style={{
                      color: "#a1a1a1",
                    }}
                  >
                    {t("searchHome")}
                  </Text>
                </View>
              </TouchableOpacity>
            </Animated.View>

            <Pressable
              onPress={() => {
                tokenApps
                  ? props.navigation.navigate("Notification", {
                      token: tokenApps,
                    })
                  : setModalLogin(true);
              }}
              style={{
                alignItems: "flex-end",
                flex: 1,
                // borderWidth: 1,
              }}
            >
              <NotificationBlue
                height={29}
                width={29}
                color={"#1F99A7"}
                fill={"#1F99A7"}
                style={{
                  shadowColor: "#464646",
                  shadowOffset: {
                    width: 0.5,
                    height: 0.5,
                  },
                  shadowRadius: 0.2,
                  shadowOpacity: 0.2,
                }}
              />
              {datanotif && datanotif?.count_notif?.count > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    left: 27,
                    top: -5,
                    backgroundColor: "#D75995",
                    borderWidth: 1,
                    borderColor: "white",
                    height: 20,
                    minWidth: 20,
                    borderRadius: 20,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 5,
                  }}
                >
                  {datanotif?.count_notif?.count > 100 ? (
                    <Text
                      type="bold"
                      style={{
                        fontSize: 10,
                        marginBottom: Platform.OS == "ios" ? 0 : 1,
                        color: "white",
                      }}
                    >
                      99+
                    </Text>
                  ) : (
                    <Text
                      type="bold"
                      style={{
                        fontSize: 10,
                        color: "white",
                        marginBottom: Platform.OS == "ios" ? 0 : 1,
                      }}
                    >
                      {datanotif?.count_notif?.count}
                    </Text>
                  )}
                </View>
              ) : null}
            </Pressable>
          </Animated.View>
        </View>

        <View
          style={{
            marginBottom: Platform.OS === "ios" ? 15 : 10,
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width,
              // height: Platform.OS === "ios" ? ukuran + 25 : ukuran + 7,
              height: Platform.OS === "ios" ? ukuran + 18 : ukuran,
              alignSelf: "flex-start",
              justifyContent: "flex-end",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(231, 247, 247, 255)",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                bottom: -15,
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  height: ukuran - 27,
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  // paddingVertical: normalize(10),
                  marginBottom: Platform.OS === "ios" ? 15 : 5,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    flexWrap: "wrap",
                  }}
                >
                  <View
                    style={{
                      height: "100%",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    {tokenApps ? (
                      <TouchableOpacity
                        onPress={goToProfile}
                        style={{
                          elevation: 2,
                          shadowColor: "#464646",
                        }}
                      >
                        {loadingProfiles ? null : data ? (
                          <FunImage
                            style={{
                              width:
                                Platform.OS === "ios"
                                  ? normalize(ukuran - 50)
                                  : normalize(ukuran - 55),
                              height:
                                Platform.OS === "ios"
                                  ? normalize(ukuran - 50)
                                  : normalize(ukuran - 55),
                              borderRadius: 50,
                              resizeMode: "cover",
                            }}
                            source={
                              data && data?.picture
                                ? {
                                    uri: data?.picture,
                                  }
                                : DefaultProfileSquare
                            }
                          />
                        ) : null}
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  {tokenApps ? (
                    <View
                      style={{
                        // flexDirection: "row",
                        alignContent: "space-around",
                        justifyContent: "space-between",
                        width: Platform.OS === "ios" ? "83%" : "85%",
                        marginLeft: 10,
                        marginVertical: Platform.OS === "ios" ? 5 : 7,
                      }}
                    >
                      {loadingProfiles ? null : data ? (
                        <Text size="title" type="black">
                          {data && data.first_name ? `${data.first_name}` : ""}
                          {data && data.last_name ? ` ${data.last_name}` : ""}
                        </Text>
                      ) : null}
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: Platform.OS === "ios" ? 3 : 0,
                          justifyContent: "space-between",
                        }}
                      >
                        {loadingProfiles ? null : data ? (
                          <Text size="description" type="regular">
                            {data && data.username ? `@${data.username}` : ""}
                          </Text>
                        ) : null}
                        <TouchableOpacity
                          onPress={goToProfile}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            width: 110,
                          }}
                        >
                          {loadingProfiles ? null : data ? (
                            <>
                              <Text
                                size="description"
                                type="bold"
                                style={{
                                  color: "#209FAE",
                                  // fontWeight: "bold",
                                  marginRight: 5,
                                }}
                              >
                                {t("viewProfile")}
                              </Text>
                              <ArrowRightHome
                                width={6}
                                height={8}
                                style={{ marginTop: 2 }}
                              />
                            </>
                          ) : null}
                        </TouchableOpacity>
                      </View>

                      {/* ) : null} */}
                    </View>
                  ) : (
                    <View
                      style={{
                        width: Dimensions.get("window").width - 35,
                        height: "100%",
                        padding: 3,
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View>
                        <Text size="description" type="regular">
                          {`${t("helloTraveler")},`}
                        </Text>
                        <Text size="title" type="bold">
                          {t("welcomeToFuntravia")}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => login()}
                        style={{
                          borderWidth: 1,
                          borderColor: "#209fae",
                          borderRadius: 3,
                          paddingHorizontal: 22,
                          paddingVertical: 7,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Lato",
                            fontSize: 12,
                            fontWeight: "bold",
                            color: "#209FAE",
                          }}
                        >
                          {t("signin")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  height: Platform.OS === "ios" ? ukuran - 54 : ukuran - 57,
                  borderRadius: 3,
                  borderColor: "#209FAE",
                  borderWidth: 0.5,
                  backgroundColor: "#FFFFFF",
                  justifyContent: "space-between",
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={styles.statView}
                  onPress={() => {
                    tokenApps
                      ? props.navigation.navigate("BottomStack", {
                          screen: "TripBottomPlaning",
                          params: { screen: "TripPlaning" },
                        })
                      : setModalLogin(true);
                  }}
                >
                  <Text size="label" type="bold" style={styles.statNumber}>
                    {data ? data.count_my_itinerary : "-"}
                  </Text>
                  <Text size="label" type="regular" style={styles.statLabel}>
                    {t("Itinerary")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statView}
                  onPress={() => {
                    tokenApps
                      ? props.navigation.navigate("ProfileStack", {
                          screen: "FollowerPage",
                          params: { token: tokenApps },
                        })
                      : setModalLogin(true);
                  }}
                >
                  <Text size="label" type="bold" style={styles.statNumber}>
                    {data ? data.count_follower : "-"}
                  </Text>
                  <Text size="label" type="regular" style={styles.statLabel}>
                    {t("followers")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.statView}
                  onPress={() => {
                    tokenApps
                      ? props.navigation.navigate("ProfileStack", {
                          screen: "FollowingPage",
                          params: { token: tokenApps },
                        })
                      : setModalLogin(true);
                  }}
                >
                  <Text size="label" type="bold" style={styles.statNumber}>
                    {data ? data.count_following : "-"}
                  </Text>
                  <Text size="label" type="regular" style={styles.statLabel}>
                    {t("following")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <MenuNew props={props} />
        <HomeTitle
          title={t("popularCityDestination")}
          label={t("homesubtitleDesPopuler")}
          seeAll={true}
        />
        <PopularDestination props={props} />
        <HomeTitle
          title={t("discover")}
          label={t("homesubtitleDiscover")}
          seeAll={false}
        />
        <DiscoverCard props={props} token={tokenApps} />
        <HomeTitle
          title={t("funFeed")}
          label={t("homesubtitleFunfeed")}
          seeAll={false}
        />
        <FunFeed props={props} tokenApps={tokenApps} />
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  accountButton: {
    width: Dimensions.get("window").width / 4,
    borderRadius: 5,
    height: 30,
  },
  pointButtonView: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    height: 20,
    width: 100,
    backgroundColor: "#B8E0E5",
    borderRadius: 5,
  },
  pointButtonStyle: {
    alignSelf: "center",
    height: "100%",
    width: "80%",
    backgroundColor: "#B8E0E5",
  },
  pointButtonText: {
    fontSize: 14,
    color: "#464646",
  },
  statNumber: {
    textAlign: "left",
    color: "#434343",
  },
  statLabel: {
    // color: '#B0B0B0',
    paddingLeft: 5,
  },
  statView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
