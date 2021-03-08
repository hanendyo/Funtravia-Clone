import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import { Text, CustomImage, StatusBar as Statcom } from "../../../component";
import { default_image, Akunsaya } from "../../../assets/png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@apollo/client";
import Account from "../../../graphQL/Query/Profile/Other";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab1ItemSize = (width - 30) / 2;
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

export default function OtherProfile(props) {
  const { t, i18n } = useTranslation();

  let [token, setToken] = useState(null);
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  /**
   * stats
   */
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: "Tab1" },
    { key: "tab2", title: "Tab2" },
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const [tab1Data] = useState(Array(40).fill(0));
  const [tab2Data] = useState(Array(30).fill(0));

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

  let HEADER_MAX_HEIGHT = HeaderHeight;
  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });
  const positionImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT - 30, 7],
    extrapolate: "clamp",
  });

  const borderImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [3, 1],
    extrapolate: "clamp",
  });

  const positionLeftImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 50],
    extrapolate: "clamp",
  });
  const heightImage = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [100, 40],
    extrapolate: "clamp",
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const opacityto1 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const opacityfrom1 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

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
  const renderHeader = (item) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55 + SafeStatusBar],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "absolute",
          backgroundColor: "#209fae",
          paddingTop: SafeStatusBar,
        }}
      >
        {/* <Statcom backgroundColor="red" barStyle="light-content" /> */}

        <Animated.Image
          style={{
            // position: "absolute",
            // top: 0,
            // left: 0,
            // right: 0,
            width: "100%",
            height: "50%",
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
          source={Akunsaya}
        />
        <Animated.View
          style={{
            width: "100%",
            height: "50%",
            backgroundColor: "#fff",
            opacity: imageOpacity,
            // transform: [{ translateY: imageTranslate }],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width,
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
              alignContent: "center",
              marginTop: 5,
              // borderWidth: 1,
            }}
          >
            <Animated.View style={{ width: "50%", opacity: opacityfrom1 }}>
              <Text type="bold" size="label" style={{ marginRight: 10 }}>
                {`${item.user_profilebyid.firstname} ` +
                  `${item.user_profilebyid.lastname}`}
              </Text>
              <Text
                type="regular"
                size="description"
              >{`@${item.user_profilebyid.username} `}</Text>
            </Animated.View>

            <View
              style={{
                width: "50%",
                // marginTop: 10,
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "baseline",
                // width: Dimensions.get('window').width,
              }}
            >
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  alignContent: "center",
                }}
                onPress={() =>
                  props.navigation.push("otherFollower", {
                    idUser: idUser,
                  })
                }
              >
                <Text type="black" size="label">
                  {/* {`${data ? data.user_profilebyid.count_follower : 0} `} */}
                </Text>
                <Text
                  type="regular"
                  size="description"
                  // style={{ color: '#B0B0B0' }}
                >
                  {t("followers")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  alignContent: "center",
                }}
                onPress={() =>
                  props.navigation.push("otherFollowing", {
                    idUser: idUser,
                  })
                }
              >
                <Text type="black" size="label">
                  {/* {`${data ? data.user_profilebyid.count_following : 0} `} */}
                </Text>
                <Text
                  type="regular"
                  size="description"
                  // style={{ color: '#B0B0B0' }}
                >
                  {t("following")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              marginTop: 15,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
            }}
          >
            <Text
              type="regular"
              size="description"
              style={{ textAlign: "justify" }}
            >
              {/* {initbio ? initbio : "-"} */}
            </Text>
          </View>
        </Animated.View>
        <Animated.View
          style={{
            width: "100%",
            justifyContent: "space-between",
            flexDirection: "row",
            position: "absolute",
            // top: positionImage,
            // left: positionLeftImage,
            // marginTop: -30,
            // paddingHorizontal: 20,
            alignItems: "center",
            zIndex: 2,
            top: "45%",
            left: 25,
          }}
        >
          <Animated.View
            style={{
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 4,
              alignSelf: "center",
              borderColor: "white",
              borderWidth: 2,
              backgroundColor: "#B8E0E5",
              width: width / 4,
              height: width / 4,
              borderRadius: width / 8,
              opacity: imageOpacity,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={
                item.user_profilebyid.picture
                  ? { uri: item.user_profilebyid.picture }
                  : default_image
              }
              style={{
                borderRadius: 60,
                resizeMode: "cover",
                height: "100%",
                width: "100%",
              }}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    );
  };

  const rednerTab1Item = ({ item, index }) => {
    return (
      <View
        style={{
          borderRadius: 16,
          marginLeft: index % 2 === 0 ? 0 : 10,
          width: tab1ItemSize,
          height: tab1ItemSize,
          backgroundColor: "#aaa",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{index}</Text>
      </View>
    );
  };

  const rednerTab2Item = ({ item, index }) => {
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
      <Text style={[styles.label, { opacity: focused ? 1 : 0.5 }]}>
        {route.title}
      </Text>
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case "tab1":
        numCols = 2;
        data = tab1Data;
        renderItem = rednerTab1Item;
        break;
      case "tab2":
        numCols = 3;
        data = tab2Data;
        renderItem = rednerTab2Item;
        break;
      default:
        return null;
    }
    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        // scrollEnabled={canScroll}
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
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight,
          paddingHorizontal: 10,
          minHeight: height - SafeStatusBar + HeaderHeight + 55,
          paddingBottom: 20,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 55 + SafeStatusBar],
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
    return (
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
          backgroundColor: "#eee",
          height: 38,
          width: 38,
          borderRadius: 19,
          borderWidth: 2,
          borderColor: "#ddd",
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          top: -50,
          position: "absolute",
        }}
      >
        <ActivityIndicator animating />
      </Animated.View>
    );
  };

  const Datauser = () => {
    const { data, loading, error, refetch } = useQuery(Account, {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      variables: {
        id: props.route.params.idUser,
      },
    });

    if (loading) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            alignContent: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator animating={true} color="#209fae" size="large" />
        </View>
      );
    }

    return (
      <SafeAreaView style={styles.container}>
        {renderTabView()}
        {renderHeader(data)}
        {renderCustomRefresh()}
      </SafeAreaView>
    );
  };

  if (token) {
    return <Datauser />;
  } else {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator animating={true} color="#209fae" size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HeaderHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFA088",
  },
  label: { fontSize: 16, color: "#222" },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFCC80",
    height: TabBarHeight,
  },
  indicator: { backgroundColor: "#222" },
});
