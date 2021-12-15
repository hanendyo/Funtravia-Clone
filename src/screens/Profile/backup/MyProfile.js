import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useQuery } from "@apollo/react-hooks";
import { Akunsaya, default_image } from "../../../assets/png";
import { Kosong } from "../../../assets/svg";
import { Button, Text, Truncate } from "../../../component";
import { useTranslation } from "react-i18next";
import Account from "../../../graphQL/Query/Home/Account";
import User_Post from "../../../graphQL/Query/Profile/post";
import Reviews from "../../../graphQL/Query/Profile/review";
import Itinerary from "../../../graphQL/Query/Profile/itinerary";
import { TabBar, TabView } from "react-native-tab-view";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = width + 5;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

export default function MyProfile({ navigation, route }) {
  let [token, setToken] = useState(route.params.token);
  let [canScroll, setCanScroll] = useState(true);
  const { t } = useTranslation();
  const HeaderComponent = {
    title: null,
    headerTintColor: "white",
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 12,
      color: "black",
    },
  };
  /**
   * stats
   */
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "post", title: "Post" },
    { key: "review", title: "Review" },
    { key: "mytrip", title: "My Trip" },
  ]);

  /**
   * ref
   */
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  // for capturing header scroll on Android
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderEnd: (evt, gestureState) => {
        handlePanReleaseOrEnd(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        const curListRef = listRefArr.current.find(
          (ref) => ref.key === routes[_tabIndex.current].key
        );
        const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
        if (curListRef.value) {
          // scroll up
          if (headerScrollOffset > 0) {
            curListRef.value.scrollToOffset({
              offset: headerScrollOffset,
              animated: false,
            });
            // start pull down
          } else {
            if (Platform.OS === "ios") {
              curListRef.value.scrollToOffset({
                offset: headerScrollOffset / 3,
                animated: false,
              });
            } else if (Platform.OS === "android") {
              if (!refreshStatusRef.current) {
                headerMoveScrollY.setValue(headerScrollOffset / 1.5);
              }
            }
          }
        }
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    })
  ).current;

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    })
  ).current;

  /**
   * effect
   */
  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    scrollY.addListener(({ value }) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });

    headerScrollY.addListener(({ value }) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return;
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation();
          syncScrollOffset();
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          });
        }
      });
    });
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const startRefreshAction = () => {
    if (Platform.OS === "ios") {
      listRefArr.current.forEach((listRef) => {
        listRef.value.scrollToOffset({
          offset: -50,
          animated: true,
        });
      });
      refresh().finally(() => {
        syncScrollOffset();
        // do not bounce back if user scroll to another position
        if (scrollY._value < 0) {
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      });
    } else if (Platform.OS === "android") {
      Animated.timing(headerMoveScrollY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      refresh().finally(() => {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePanReleaseOrEnd = (evt, gestureState) => {
    // console.log('handlePanReleaseOrEnd', scrollY._value);
    syncScrollOffset();
    headerScrollY.setValue(scrollY._value);
    if (Platform.OS === "ios") {
      if (scrollY._value < 0) {
        if (scrollY._value < -PullToRefreshDist && !refreshStatusRef.current) {
          startRefreshAction();
        } else {
          // should bounce back
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      } else {
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset();
        });
      }
    } else if (Platform.OS === "android") {
      if (
        headerMoveScrollY._value < 0 &&
        headerMoveScrollY._value / 1.5 < -PullToRefreshDist
      ) {
        startRefreshAction();
      } else {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
    // console.log('onMomentumScrollEnd');
  };

  const onScrollEndDrag = (e) => {
    syncScrollOffset();
    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEndDrag', offsetY);
    // iOS only
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };

  const refresh = async () => {
    console.log("-- start refresh");
    refreshStatusRef.current = true;
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      console.log("-- refresh done!");
      refreshStatusRef.current = false;
    });
  };

  /**
   * render Helper
   */

  const { data, loading, error } = useQuery(Account, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const { data: dataPost, loading: loadingPost, error: errorPost } = useQuery(
    User_Post,
    {
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : null,
        },
      },
    }
  );

  const {
    data: dataReview,
    loading: loadingReview,
    error: errorReview,
  } = useQuery(Reviews, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const { data: dataTrip, loading: loadingTrip, error: errorTrip } = useQuery(
    Itinerary,
    {
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : null,
        },
      },
    }
  );

  const renderHeader = () => {
    let rData = data.user_profile;
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={[styles.header, { transform: [{ translateY: y }] }]}
      >
        <View>
          <Image
            source={Akunsaya}
            style={{ width: width, height: HeaderHeight - 125 }}
          />
        </View>
        <View>
          <View>
            <Image
              source={{ uri: rData.picture }}
              style={{
                position: "absolute",
                top: -50,
                left: 25,
                width: width / 4,
                height: width / 4,
                borderRadius: width / 8,
                borderWidth: 2,
                borderColor: "#FFF",
              }}
            />
            <Button
              text={t("editprofile")}
              onPress={() =>
                navigation.push("profilesetting", {
                  token: token,
                  data: data.user_profile,
                })
              }
              variant="bordered"
              size="small"
              color="black"
              style={{
                width: width / 2,
                borderColor: "#464646",
                alignSelf: "flex-end",
                margin: 15,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 5,
            }}
          >
            <View
              style={{
                width: width / 2,
                paddingLeft: 25,
              }}
            >
              <Text size="label" type="bold">
                {rData.first_name +
                  (rData.last_name ? " " + rData.last_name : "")}
              </Text>
              <Text size="label">{"@" + rData.username}</Text>
            </View>
            <View style={{ flexDirection: "row", width: width / 2 }}>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  width: width / 4,
                }}
                onPress={() =>
                  navigation.push("ProfileStack", {
                    screen: "FollowerPage",
                  })
                }
              >
                <Text type="black" size="label">
                  {`${rData.count_follower ? rData.count_follower : 0} `}
                </Text>
                <Text type="regular" size="description">
                  {t("followers")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  width: width / 4,
                }}
                onPress={() =>
                  navigation.push("ProfileStack", {
                    screen: "FollowingPage",
                  })
                }
              >
                <Text type="black" size="label">
                  {`${rData.count_following ? rData.count_following : 0} `}
                </Text>
                <Text type="regular" size="description">
                  {t("following")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {rData.bio ? (
            <View
              style={{
                paddingHorizontal: 25,
                paddingTop: 10,
                paddingBottom: 25,
              }}
            >
              <Text size="description" style={{ textAlign: "justify" }}>
                <Truncate text={rData.bio} length={250} ending="..." />
              </Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
    );
  };

  let grid = 0;
  const renderPost = ({ item, index }) => {
    if (grid === 0) {
      grid++;
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            key={index + "_1"}
            onPress={() =>
              navigation.push("myfeed", {
                token: token,
                data: dataPost.user_post,
                index: index,
                datauser: data.user_profile,
              })
            }
          >
            <Image
              style={{
                margin: 2,
                width: (width * 2) / 3 - 4,
                height: (width * 2) / 3 - 4,
              }}
              source={
                item[0].assets
                  ? { uri: item[0].assets[0].filepath }
                  : default_image
              }
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              key={index + "_2"}
              onPress={() =>
                navigation.push("myfeed", {
                  token: token,
                  data: dataPost.user_post,
                  index: index,
                  datauser: data.user_profile,
                })
              }
            >
              <Image
                style={{
                  margin: 2,
                  width: (width * 2) / 3 / 2 - 4,
                  height: (width * 2) / 3 / 2 - 4,
                }}
                source={
                  item[1].assets
                    ? { uri: item[1].assets[0].filepath }
                    : default_image
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              key={index + "_3"}
              onPress={() =>
                navigation.push("myfeed", {
                  token: token,
                  data: dataPost.user_post,
                  index: index,
                  datauser: data.user_profile,
                })
              }
            >
              <Image
                style={{
                  margin: 2,
                  width: (width * 2) / 3 / 2 - 4,
                  height: (width * 2) / 3 / 2 - 4,
                }}
                source={
                  item[2].assets
                    ? { uri: item[2].assets[0].filepath }
                    : default_image
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
    if (grid === 1) {
      grid++;
      return (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            key={index + "_1"}
            onPress={() =>
              navigation.push("myfeed", {
                token: token,
                data: dataPost.user_post,
                index: index,
                datauser: data.user_profile,
              })
            }
          >
            <Image
              style={{
                margin: 2,
                width: width / 3 - 4,
                height: width / 3 - 4,
              }}
              source={
                item[0].assets
                  ? { uri: item[0].assets[0].filepath }
                  : default_image
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            key={index + "_2"}
            onPress={() =>
              navigation.push("myfeed", {
                token: token,
                data: dataPost.user_post,
                index: index,
                datauser: data.user_profile,
              })
            }
          >
            <Image
              style={{
                margin: 2,
                width: width / 3 - 4,
                height: width / 3 - 4,
              }}
              source={
                item[1].assets
                  ? { uri: item[1].assets[0].filepath }
                  : default_image
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            key={index + "_3"}
            onPress={() =>
              navigation.push("myfeed", {
                token: token,
                data: dataPost.user_post,
                index: index,
                datauser: data.user_profile,
              })
            }
          >
            <Image
              style={{
                margin: 2,
                width: width / 3 - 4,
                height: width / 3 - 4,
              }}
              source={
                item[2].assets
                  ? { uri: item[2].assets[0].filepath }
                  : default_image
              }
            />
          </TouchableOpacity>
        </View>
      );
    }
    if (grid === 2) {
      grid = 0;
      return (
        <View style={{ flexDirection: "row" }}>
          <View>
            <TouchableOpacity
              key={index + "_2"}
              onPress={() =>
                navigation.push("myfeed", {
                  token: token,
                  data: dataPost.user_post,
                  index: index,
                  datauser: data.user_profile,
                })
              }
            >
              <Image
                style={{
                  margin: 2,
                  width: (width * 2) / 3 / 2 - 4,
                  height: (width * 2) / 3 / 2 - 4,
                }}
                source={
                  item[0].assets
                    ? { uri: item[0].assets[0].filepath }
                    : default_image
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              key={index + "_3"}
              onPress={() =>
                navigation.push("myfeed", {
                  token: token,
                  data: dataPost.user_post,
                  index: index,
                  datauser: data.user_profile,
                })
              }
            >
              <Image
                style={{
                  margin: 2,
                  width: (width * 2) / 3 / 2 - 4,
                  height: (width * 2) / 3 / 2 - 4,
                }}
                source={
                  item[1].assets
                    ? { uri: item[1].assets[0].filepath }
                    : default_image
                }
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            key={index + "_1"}
            onPress={() =>
              navigation.push("myfeed", {
                token: token,
                data: dataPost.user_post,
                index: index,
                datauser: data.user_profile,
              })
            }
          >
            <Image
              style={{
                margin: 2,
                width: (width * 2) / 3 - 4,
                height: (width * 2) / 3 - 4,
              }}
              source={
                item[2].assets
                  ? { uri: item[2].assets[0].filepath }
                  : default_image
              }
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  const renderReview = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: index % 3 === 0 ? 0 : 10,
          borderRadius: 16,
          width: tab2ItemSize,
          height: tab2ItemSize,
          backgroundColor: "#aaa",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{index}</Text>
      </View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 0.7 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {databuddy.map((value, i) => {
          if (i < 3) {
            return (
              <View key={i}>
                <Image
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 20,
                    width: 20,
                    borderRadius: 15,
                  }}
                  // customStyle={{
                  // 	height: 20,
                  // 	width: 20,
                  // 	borderRadius: 15,
                  // 	marginLeft: -10,
                  // }}
                />
              </View>
            );
          }
        })}

        {databuddy.length > 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Regular",
                fontSize: 12,
                color: "white",
              }}
            >
              {" "}
              {/* {t('with')}{' '} */}
              With{" "}
              <Truncate
                text={
                  databuddy[1].user && databuddy[1].user.first_name
                    ? databuddy[1].user.first_name
                    : ""
                }
                length={5}
              />
              {databuddy.length > 2
                ? " + " + (databuddy.length - 2) + " Others"
                : " "}
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const getDN = (start, end) => {
    var x = start;
    var y = end,
      start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return (
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            fontFamily: "Lato-Regular",
            color: "white",
          }}
        >
          {Difference_In_Days + 1} days{" "}
        </Text>
        <Text
          style={{
            fontFamily: "Lato-Regular",
            color: "white",
          }}
        >
          {Difference_In_Days} night
        </Text>
      </View>
    );
  };

  const renderTrip = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push("tripalbum", {
            iditinerary: item.id,
            token: token,
            position: "profile",
          })
        }
        style={{
          width: (Dimensions.get("screen").width - 15) * 0.5,
          margin: 2,
        }}
      >
        <ImageBackground
          source={item.cover ? { uri: item.cover } : default_image}
          style={[
            {
              borderRadius: 5,
            },
          ]}
          imageStyle={[
            {
              borderRadius: 5,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.38)",
              height: Dimensions.get("window").width * 0.25,
              borderRadius: 5,
              padding: 10,
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 16,
                  color: "white",
                }}
              >
                <Truncate text={item.name} length={17} />
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Text
                // {...props}
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "white",
                }}
              >
                <Truncate text={item.city ? item.city.name : ""} length={7} />,{" "}
              </Text>
              {item.start_date && item.end_date
                ? getDN(item.start_date, item.end_date)
                : null}
            </View>
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: 10,
                left: 20,
              }}
            >
              {item.buddy.length ? (
                <RenderBuddy databuddy={item.buddy} />
              ) : null}
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    return tmpData;
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let dataR;
    let renderItem;
    let flex;
    switch (route.key) {
      case "post":
        numCols = null;
        flex = null;
        dataR = dataPost ? spreadData(dataPost.user_post) : null;
        renderItem = renderPost;
        break;
      case "review":
        numCols = 3;
        flex = null;
        dataR = dataReview ? dataReview.user_review : null;
        renderItem = renderReview;
        break;
      case "mytrip":
        numCols = 2;
        flex = 0.5;
        dataR = dataTrip ? dataTrip.user_trip : null;
        renderItem = renderTrip;
        break;
      default:
        return null;
    }
    if (dataR && dataR.length > 0) {
      return (
        <Animated.FlatList
          scrollToOverflowEnabled={true}
          scrollEnabled={canScroll}
          {...listPanResponder.panHandlers}
          numColumns={numCols}
          ref={(ref) => {
            if (ref) {
              const found = listRefArr.current.find((e) => e.key === route.key);
              if (!found) {
                listRefArr.current.push({
                  key: route.key,
                  value: ref,
                });
              }
            }
          }}
          scrollEventThrottle={16}
          onScroll={
            focused
              ? Animated.event(
                  [
                    {
                      nativeEvent: { contentOffset: { y: scrollY } },
                    },
                  ],
                  { useNativeDriver: true }
                )
              : null
          }
          onMomentumScrollBegin={onMomentumScrollBegin}
          onScrollEndDrag={onScrollEndDrag}
          onMomentumScrollEnd={onMomentumScrollEnd}
          contentContainerStyle={{
            paddingTop: HeaderHeight + TabBarHeight,
            minHeight: height - SafeStatusBar + HeaderHeight,
            flex: flex,
          }}
          showsHorizontalScrollIndicator={false}
          data={dataR}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
      );
    } else {
      return (
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
            paddingTop: HeaderHeight,
            minHeight: height - SafeStatusBar + HeaderHeight,
          }}
        >
          <Kosong height={width} width={width} />
        </View>
      );
    }
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 0],
      // extrapolate: 'clamp',
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: "absolute",
          transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <TabBar
          {...props}
          onTabPress={({ route, preventDefault }) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
        />
      </Animated.View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: width,
        }}
      />
    );
  };

  const renderCustomRefresh = () => {
    // headerMoveScrollY
    return Platform.select({
      ios: (
        <AnimatedIndicator
          style={{
            top: -50,
            position: "absolute",
            alignSelf: "center",
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [120, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
          animating
        />
      ),
      android: (
        <Animated.View
          style={{
            transform: [
              {
                translateY: headerMoveScrollY.interpolate({
                  inputRange: [-300, 0],
                  outputRange: [150, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
            backgroundColor: "#FFF",
            height: 38,
            width: 38,
            borderRadius: 19,
            borderWidth: 2,
            borderColor: "#209FAE",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            top: -50,
            position: "absolute",
          }}
        >
          <ActivityIndicator animating />
        </Animated.View>
      ),
    });
  };

  if ((loading && loadingPost && loadingReview, loadingTrip)) {
    console.log("loading");
  }

  if ((error && errorPost && errorReview, errorTrip)) {
    console.log("Error");
  }

  if (data && dataPost && dataReview && dataTrip) {
    console.log(data, dataPost, dataReview, dataTrip);
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: HeaderHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFF",
  },
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },
  labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: TabBarHeight,
  },
  indicator: { backgroundColor: "#209FAE", height: 3 },
});
