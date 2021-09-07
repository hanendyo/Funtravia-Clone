import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Animated,
  SafeAreaView,
  RefreshControl,
  Image,
  Pressable,
  StyleSheet,
  Modal,
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  CustomImage,
  StatusBar,
  NavigateAction,
  FunImage,
} from "../../component";
import { search_black, sampul2, DefaultProfileSquare } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { useTranslation } from "react-i18next";
import PopularDestination from "./PopularDestination";
import Account from "../../graphQL/Query/Home/Account";
import MenuNew from "./MenuNew";
import DiscoverCard from "./DiscoverCard";
import FunFeed from "./FunFeed";
import CountNotif from "../../graphQL/Query/Notification/CountNotif";
import User_Post from "../../graphQL/Query/Profile/post";
import { NotificationBlue, ArrowRightHome, SearchHome } from "../../assets/svg";
import { RNToasty } from "react-native-toasty";

const { width, height } = Dimensions.get("screen");
export default function Home(props) {
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [refresh, setRefresh] = useState(false);
  let [data, setdata] = useState(null);
  let [shareId, setShareId] = useState(props.route.params.shareid);
  let [loadingModal, setLoadingModal] = useState(false);

  console.log("data :", data);
  // console.log(token);
  const [LoadUserProfile, { data: dataProfiles, loading }] = useLazyQuery(
    Account,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        setdata(dataProfiles.user_profile);
      },
    }
  );

  const [
    LoadPost,
    { data: datapost, loading: loadingpost, error: errorpost },
  ] = useLazyQuery(User_Post, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
      params: { token: token },
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
        Authorization: `Bearer ${token}`,
      },
    },
  });
  // useEffect(() => {
  //     messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  //     });
  // }, []);

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await NotifCount();
    await LoadUserProfile();
    await LoadPost();
  };

  const searchPage = () => {
    props.navigation.navigate("SearchPg", {
      token: token,
    });
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      console.log("masuk_focus");
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    if (
      props.route.params.shareid &&
      props.route.params.shareid !== "undefined"
    ) {
      setLoadingModal(true);
      NavigateAction(props.navigation, props.route.params.shareid);
      setTimeout(() => {
        setLoadingModal(false);
      }, 3000);
    }
  }, [props.route.params?.shareid]);

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
          marginTop: 20,
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
            }}
          >
            <View
              style={{
                width: 5,
                marginRight: 5,
                backgroundColor: "#209FAE",
                borderRadius: 20,
              }}
            ></View>
            <Text
              type="bold"
              size="label"
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
            size="small"
            style={{
              marginLeft: 10,
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
            size="small"
            style={{ color: "#209FAE" }}
          >
            {t("viewAll")}
          </Text>
        ) : null}
      </View>
    );
  }

  let [scrollY] = useState(new Animated.Value(0));

  const searchBG = scrollY.interpolate({
    inputRange: [0, height / 2, height],
    outputRange: [0, 1, 1],
    extrapolate: "clamp",
  });

  if (loadingModal) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
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
              opacity: searchBG,
              backgroundColor: "#FFF",
              width: width,
              height: 68,
              position: "absolute",
              top: 0,

              shadowColor: "#464646",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.5,
              elevation: 3,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => searchPage()}
              style={{
                alignItems: "center",
                justifyContent: "flex-start",
                height: 45,
                flexDirection: "row",
                backgroundColor: "#FFF",
                borderRadius: 5,
                borderWidth: 1.5,
                borderColor: "#FFF",
                alignSelf: "center",
                paddingHorizontal: 20,
                marginVertical: 7,
                width: Dimensions.get("window").width - 80,
                // shadowColor: "#464646",
                // shadowOffset: { width: 0.5, height: 1 },
                // shadowOpacity: 0.5,
                // shadowRadius: 2,
                // elevation: 4,
              }}
            >
              <View
                style={{
                  marginRight: 10,
                }}
              >
                {/* <CustomImage
                  source={searchHome}
                  customImageStyle={{ resizeMode: "cover" }}
                  customStyle={{
                    height: 15,
                    width: 15,
                    alignSelf: "center",
                    zIndex: 100,
                  }}
                /> */}
                <SearchHome height={15} width={15} />
              </View>
              <View>
                <Text
                  type="bold"
                  style={{
                    color: "#A9A9A9",
                  }}
                >
                  {t("searchHome")}
                </Text>
              </View>
            </TouchableOpacity>
            <Pressable
              onPress={() => props.navigation.navigate("Notification")}
              style={{ paddingLeft: 10 }}
            >
              <NotificationBlue
                height={30}
                width={30}
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
              {datanotif && datanotif.count_notif.count > 0 ? (
                <View
                  style={{
                    position: "absolute",
                    right: -3,
                    top: 4,
                    backgroundColor: "#D75995",
                    minWidth: 15,
                    borderWidth: 1,
                    borderColor: "white",
                    // height: 14,
                    borderRadius: 50,
                    // alignSelf: "center",
                  }}
                >
                  {datanotif.count_notif.count > 100 ? (
                    <Text
                      type="bold"
                      style={{
                        fontSize: 10,
                        color: "white",
                        alignSelf: "center",
                        paddingHorizontal: 2,
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
                        alignSelf: "center",
                        paddingHorizontal: 2,
                      }}
                    >
                      {datanotif.count_notif.count}
                    </Text>
                  )}
                </View>
              ) : null}
            </Pressable>
          </View>
        </View>

        <View
          style={{
            marginBottom: 25,
          }}
        >
          <View
            style={{
              width: width,
              height: ukuran + 25,
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
                position: "absolute",
                bottom: -15,
                // marginBottom: 5,
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
                  paddingVertical: 10,
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "flex-start",
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
                    {token !== null && token !== "" ? (
                      <TouchableOpacity
                        onPress={goToProfile}
                        style={{
                          elevation: 2,
                          shadowColor: "#464646",
                        }}
                      >
                        <FunImage
                          style={{
                            width: ukuran - 50,
                            height: ukuran - 50,
                            borderRadius: 50,
                            resizeMode: "cover",
                          }}
                          source={
                            data && data.picture
                              ? {
                                  uri: data.picture,
                                }
                              : DefaultProfileSquare
                          }
                        />
                      </TouchableOpacity>
                    ) : null}
                  </View>
                  {token !== null && token !== "" ? (
                    <View
                      style={{
                        // flexDirection: "row",
                        alignContent: "space-around",
                        justifyContent: "space-between",
                        width: "80%",
                        marginLeft: 10,
                        marginVertical: 5,
                      }}
                    >
                      <Text size="title" type="black">
                        {data && data.first_name ? `${data.first_name}` : null}
                        {data && data.last_name ? ` ${data.last_name}` : null}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          marginTop: 3,
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                          }}
                        >
                          {data && data.username ? `@${data.username}` : null}
                        </Text>
                        <TouchableOpacity
                          onPress={goToProfile}
                          style={{
                            flexDirection: "row",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            width: 75,
                          }}
                        >
                          <Text
                            style={{
                              color: "#209FAE",
                              fontWeight: "bold",
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
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 13,
                        }}
                      >
                        {t("helloTraveler")}
                        {","}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Lato",
                          fontSize: 18,
                          fontWeight: "bold",
                          color: "black",
                          marginTop: 3,
                        }}
                      >
                        {t("welcomeToFuntravia")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => login()}
                        style={{
                          position: "absolute",
                          right: 10,
                          top: 10,
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
                  height: ukuran - 50,
                  borderRadius: 5,
                  borderColor: "#209FAE",
                  borderWidth: 0.5,
                  backgroundColor: "#FFFFFF",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  // shadowColor: "#6F7273",
                  // shadowOffset: { width: 0, height: 1 },
                  // shadowOpacity: 1,
                  // shadowRadius: 1,
                  // elevation: 3,
                  padding: 10,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignContent: "center",
                      // marginLeft: 10,
                      height: "100%",
                      width: "100%",
                      // borderWidth: 1,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        width: Dimensions.get("window").width - 60,
                      }}
                    >
                      <TouchableOpacity
                        style={styles.statView}
                        onPress={() =>
                          props.navigation.navigate("BottomStack", {
                            screen: "TripBottomPlaning",
                            params: { screen: "TripPlaning" },
                          })
                        }
                      >
                        <Text
                          size="label"
                          type="black"
                          style={styles.statNumber}
                        >
                          {data ? data.count_my_itinerary : "-"}
                        </Text>
                        <Text
                          size="medium"
                          type="regular"
                          style={styles.statLabel}
                        >
                          {t("Itinerary")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.statView}
                        onPress={() =>
                          props.navigation.navigate("ProfileStack", {
                            screen: "FollowerPage",
                          })
                        }
                      >
                        <Text
                          size="label"
                          type="black"
                          style={styles.statNumber}
                        >
                          {data ? data.count_follower : "-"}
                        </Text>
                        <Text
                          size="medium"
                          type="regular"
                          style={styles.statLabel}
                        >
                          {t("followers")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.statView}
                        onPress={() =>
                          props.navigation.navigate("ProfileStack", {
                            screen: "FollowingPage",
                          })
                        }
                      >
                        <Text
                          size="label"
                          type="black"
                          style={styles.statNumber}
                        >
                          {data ? data.count_following : "-"}
                        </Text>
                        <Text
                          size="medium"
                          type="regular"
                          style={styles.statLabel}
                        >
                          {t("following")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
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
        <DiscoverCard props={props} token={token} />
        <HomeTitle
          title={t("funFeed")}
          label={t("homesubtitleFunfeed")}
          seeAll={false}
        />
        <FunFeed props={props} />
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
    width: (Dimensions.get("window").width - 10) / 4,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
});
