import React, { useState, useEffect, useRef } from "react";
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
import { NotificationBlue } from "../../assets/svg";

const { width, height } = Dimensions.get("screen");
export default function Home(props) {
  const { t } = useTranslation();
  let [token, setToken] = useState("");
  let [refresh, setRefresh] = useState(false);
  let [data, setdata] = useState(null);
  let [shareId, setShareId] = useState(props.route.params?.shareid);
  let [loadingModal, setLoadingModal] = useState(false);
  console.log(token);
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
    if (shareId && shareId !== "undefined") {
      setLoadingModal(true);
      NavigateAction(props.navigation, shareId);
      setTimeout(() => {
        setLoadingModal(false);
      }, 3000);
    }
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

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
              // borderWidth: 1,
              flexDirection: "row",
              // alignContent: "flex-end",
              // alignItems: "flex-end",
              padding: 0,
            }}
          >
            <View
              style={{
                width: 5,
                // height: 15,
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
        stickyHeaderIndices={[1]}
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
            backgroundColor: "#daf0f2",
          }}
        >
          <ImageBackground
            source={sampul2}
            style={{
              width: width,
              height: width / 1.5,
              alignSelf: "flex-start",
              justifyContent: "flex-end",
              alignContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <View
              style={{
                position: "absolute",
                bottom: -15,
                marginBottom: 7,
              }}
            >
              <View
                style={{
                  width: Dimensions.get("window").width - 40,
                  height: ukuran,
                  borderRadius: 5,
                  borderColor: "#209FAE",
                  borderWidth: 1.5,
                  backgroundColor: "#FFFFFF",
                  alignContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  justifyContent: "center",
                  shadowColor: "#6F7273",
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 1,
                  shadowRadius: 1,
                  elevation: 3,
                  padding: 10,
                  marginBottom: 10,
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
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowRadius: 0.5,
                          shadowOpacity: 0.5,
                          borderRadius: 10,
                        }}
                      >
                        <FunImage
                          style={{
                            width: ukuran - 15,
                            height: ukuran - 15,
                            borderRadius: 10,
                            borderWidth: 3,
                            borderColor: "#fff",
                            resizeMode: "cover",
                          }}
                          // defaultSource={DefaultProfileSquare}
                          source={
                            data && data.picture
                              ? {
                                  uri: data.picture,
                                }
                              : DefaultProfileSquare
                          }
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          elevation: 2,
                          shadowColor: "#464646",
                          shadowOffset: {
                            width: 0,
                            height: 0,
                          },
                          shadowRadius: 0.5,
                          shadowOpacity: 0.5,
                          borderRadius: 10,
                        }}
                      >
                        <Image
                          style={{
                            width: ukuran - 15,
                            height: ukuran - 15,
                            borderRadius: 10,
                            resizeMode: "cover",
                            borderWidth: 3,
                            borderColor: "white",
                          }}
                          source={DefaultProfileSquare}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  {token !== null && token !== "" ? (
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
                          alignContent: "space-around",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Text
                          size="label"
                          type="black"
                          style={{ marginLeft: 10 }}
                        >
                          {data && data.first_name
                            ? `${data.first_name}`
                            : "User Funtravia"}
                          {data && data.last_name ? ` ${data.last_name}` : null}
                        </Text>
                        <Pressable
                          onPress={() =>
                            props.navigation.navigate("Notification")
                          }
                          style={{
                            paddingRight: 10,
                          }}
                        >
                          <NotificationBlue
                            height={20}
                            width={20}
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
                                right: 5,
                                backgroundColor: "#D75995",
                                minWidth: 14,
                                borderWidth: 0.5,
                                borderColor: "white",
                                height: 14,
                                borderRadius: 7,
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
                        {/* ) : null} */}
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "baseline",
                          width: Dimensions.get("window").width,
                          marginTop: 10,
                        }}
                      >
                        <TouchableOpacity
                          style={styles.statView}
                          onPress={() =>
                            props.navigation.push("ProfileStack", {
                              screen: "myfeed",
                              params: {
                                token: token,
                                datauser: data ? data : null,
                              },
                            })
                          }
                        >
                          <Text
                            size="label"
                            type="black"
                            style={styles.statNumber}
                          >
                            {data ? data.count_post : 0}
                          </Text>
                          <Text
                            size="small"
                            type="regular"
                            style={styles.statLabel}
                          >
                            {t("post")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.statView}
                          onPress={() =>
                            props.navigation.navigate("TripPlaning")
                          }
                        >
                          <Text
                            size="label"
                            type="black"
                            style={styles.statNumber}
                          >
                            {data ? data.count_my_itinerary : 0}
                          </Text>
                          <Text
                            size="small"
                            type="regular"
                            style={styles.statLabel}
                          >
                            {t("trip")}
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
                            {data ? data.count_follower : 0}
                          </Text>
                          <Text
                            size="small"
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
                            {data ? data.count_following : 0}
                          </Text>
                          <Text
                            size="small"
                            type="regular"
                            style={styles.statLabel}
                          >
                            {t("following")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        paddingLeft: 12,
                        paddingTop: 5,
                        height: "100%",
                        width: "100%",
                      }}
                    >
                      <Text size="description" type="bold">
                        {t("createAnAccount")}
                      </Text>
                      <Text size="description" type="bold">
                        {t("enjoyTheTrip")}
                      </Text>
                      <View
                        style={{
                          marginTop: 10,
                          marginBottom: 20,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => signUp()}
                          style={{
                            paddingVertical: 7,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            backgroundColor: "#209fae",
                          }}
                        >
                          <Text
                            type="bold"
                            style={{
                              color: "#FFF",
                            }}
                          >
                            {t("signUp")}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => login()}
                          style={{
                            marginLeft: 10,
                            paddingVertical: 7,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            backgroundColor: "#D75995",
                          }}
                        >
                          <Text
                            type="bold"
                            style={{
                              color: "#FFF",
                            }}
                          >
                            {t("signIn")}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            // shadowColor: "#FFF",
            // shadowOffset: { width: 0, height: 1 },
            // shadowOpacity: 1,
            // shadowRadius: 1,
            // marginTop: 10,
            // elevation: 2,
            backgroundColor: "#daf0f2",
            // borderWidth: 1,
          }}
        >
          <Animated.View
            style={{
              opacity: searchBG,
              backgroundColor: "#FFF",
              width: width,
              paddingVertical: 5,
              height: 58,
              position: "absolute",
              shadowColor: "#464646",
              shadowOffset: { width: 1, height: 1 },
              shadowOpacity: 0.5,
              elevation: 3,
            }}
          />
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
              borderColor: "#209fae",
              alignSelf: "center",
              paddingHorizontal: 20,
              marginVertical: 5,
              width: Dimensions.get("window").width - 40,
              shadowColor: "#464646",
              shadowOffset: { width: 0.5, height: 1 },
              shadowOpacity: 0.5,
              shadowRadius: 2,
              elevation: 4,
            }}
          >
            <View
              style={{
                marginRight: 10,
              }}
            >
              <CustomImage
                source={search_black}
                customImageStyle={{ resizeMode: "cover" }}
                customStyle={{
                  height: 15,
                  width: 15,
                  alignSelf: "center",
                  zIndex: 100,
                }}
              />
            </View>
            <View>
              <Text
                size="small"
                type="bold"
                style={{
                  color: "#464646",
                }}
              >
                {t("searchHome")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <MenuNew props={props} />
        <HomeTitle
          title={t("popularCityDestination")}
          label={"Good Place Good Trip"}
          seeAll={true}
        />
        <PopularDestination props={props} />
        <HomeTitle
          title={"Discover"}
          label={"Start Your Journey Here"}
          seeAll={false}
        />
        <DiscoverCard props={props} token={token} />
        <HomeTitle
          title={"Fun Feed"}
          label={"Collect Moments from Your Trip"}
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
    fontSize: 13,
    color: "#464646",
  },
  statNumber: {
    textAlign: "left",
    color: "#434343",
  },
  statLabel: {
    // color: '#B0B0B0',
  },
  statView: {
    width: (Dimensions.get("window").width - 30) / 6,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
