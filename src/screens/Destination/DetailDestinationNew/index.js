import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  StatusBar,
  ActivityIndicator,
  Linking,
  Image,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Arrowbackwhite,
  Star,
  LikeEmpty,
  ShareBlack,
  Love,
  UnescoIcon,
  MovieIcon,
  PinHijau,
  Clock,
  WebsiteHitam,
  Globe,
  Xhitam,
  TeleponHitam,
  InstagramHitam,
} from "../../../assets/svg";
import { TabBar, TabView } from "react-native-tab-view";
import Modal from "react-native-modal";
import Ripple from "react-native-material-ripple";
import {
  Text,
  Button,
  StatusBar as Satbar,
  shareAction,
} from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import { useMutation, useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Generals from "./Generals";
import Reviews from "./Reviews";
import { StackActions } from "@react-navigation/native";
import Liked from "../../../graphQL/Mutation/Destination/Liked";
import unLiked from "../../../graphQL/Mutation/Destination/UnLiked";
import BottomButton from "./BottomButton";
import ActivityModal from "./ActivityModal";
import FacilityModal from "./FacilityModal";
import ServiceModal from "./ServiceModal";
import DeviceInfo from "react-native-device-info";
import IndexSkeleton from "./IndexSkeleton";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";

let PullToRefreshDist = 150;

const Index = (props) => {
  const { t, i18n } = useTranslation();

  /**
   * stats
   */

  let [unesco, setUnesco] = useState(0);
  let [tambahan, setTambahan] = useState(0);
  let [tambahan1, setTambahan1] = useState(0);
  let [tambahan2, setTambahan2] = useState(0);
  let AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
  let { width, height } = Dimensions.get("screen");
  let TabBarHeight = 48;
  let Notch = DeviceInfo.hasNotch();
  // let SafeStatusBar = Platform.select({
  //   ios: Notch ? 48 : 20,
  //   android: StatusBar.currentHeight,
  // });

  let SafeStatusBar = 0;

  let HeaderHeight = Platform.select({
    ios: 457 + tambahan + tambahan1 + tambahan2 - unesco,
    android: 440 + tambahan + tambahan1 + tambahan2 - unesco,
  });
  let [newHeight, setNewHeight] = useState(0);
  let scrollRef = useRef();

  const [tabIndex, setIndex] = useState(0);
  //   const [routes] = useState([
  //     { key: "tab1", title: "General" },
  //     { key: "tab2", title: "Review" },
  //   ]);

  const [routes, setRoutes] = useState([]);
  const [canScroll, setCanScroll] = useState(true);
  const [tab1Data] = useState(Array(40).fill(0));
  const [tab2Data] = useState(Array(30).fill(0));
  const [modalActivity, setModalActivity] = useState(false);
  const [modalFacility, setModalFacility] = useState(false);
  const [modalService, setModalService] = useState(false);
  const [modalTime, setModalTime] = useState(false);
  const [modalSosial, setModalSosial] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);
  const [setting, setSetting] = useState("");
  const [token, setToken] = useState(props.route.params.token);
  let [dataDestination, setDataDestination] = useState(data);

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: true,
    headerTintColor: "white",
    headerTitle: "",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",

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
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const [fetchData, { data, loading, error }] = useLazyQuery(DestinationById, {
    variables: { id: props.route.params.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      let tab = [{ key: "general", title: "General" }];

      data?.destinationById?.article_header.map((item, index) => {
        tab.push({
          key: item.title,
          title: item.title,
          data: item.content,
        });
      });

      tab.push({ key: "review", title: "Review" });

      setRoutes(tab);

      setDataDestination(data.destinationById);
      props.navigation.setOptions({
        headerTitle: (
          // <Animated.View
          // style={{
          // }}
          // >
          <Animated.Text
            size="label"
            type="bold"
            style={{
              opacity: hide.current,
              color: "#fff",
            }}
          >
            {data?.destinationById?.name} testing
          </Animated.Text>
          // </Animated.View>
        ),
      });
    },
  });
  console.log("data", dataDestination);

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

  useEffect(() => {
    scrollY.addListener(({ value }) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });

    headerScrollY.addListener(({ value }) => {
      listRefArr.current.forEach((item) => {
        console.log("item", item);
        if (item.key !== routes[_tabIndex].key) {
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
          duration: 100,
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
  };

  const onScrollEndDrag = (e) => {
    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    // iOS only
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };

  const refresh = async () => {
    refreshStatusRef.current = true;
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      refreshStatusRef.current = false;
    });
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await fetchData();

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  //   console.log("des", dataDestination);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(unLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id) => {
    if (token && token !== "" && token !== null) {
      var tempData = { ...dataDestination };
      tempData.liked = true;
      setDataDestination(tempData);
      try {
        let response = await mutationliked({
          variables: {
            destination_id: id,
            qty: 1,
          },
        });
        if (loadingLike) {
          alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            var tempData = { ...dataDestination };
            tempData.liked = true;
            setDataDestination(tempData);
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataDestination };
        tempData.liked = false;
        setDataDestination(tempData);
        alert("" + error);
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const _unliked = async (id) => {
    if (token && token !== "" && token !== null) {
      var tempData = { ...dataDestination };
      tempData.liked = false;
      setDataDestination(tempData);
      try {
        let response = await mutationUnliked({
          variables: {
            destination_id: id,
          },
        });
        if (loadingUnLike) {
          alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.unset_wishlist_destinasi.code === 200 ||
            response.data.unset_wishlist_destinasi.code === "200"
          ) {
            var tempData = { ...dataDestination };
            tempData.liked = false;
            setDataDestination(tempData);
          } else {
            throw new Error(response.data.unset_wishlist_destinasi.message);
          }
        }
      } catch (error) {
        var tempData = { ...dataDestination };
        tempData.liked = false;
        setDataDestination(tempData);
        alert("" + error);
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  let HEADER_MAX_HEIGHT = HeaderHeight;
  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  let hide = React.useRef(
    scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 1],
      extrapolate: "clamp",
    })
  );

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -55],
    extrapolate: "clamp",
  });

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });

    return (
      <Animated.View
        // {...headerPanResponder.panHandlers}
        // style={[styles.header, { transform: [{ translateY: y }] }]}
        style={{
          transform: [{ translateY: y }],
          top: SafeStatusBar,
          height: HeaderHeight,
          width: "100%",
          position: "absolute",
          backgroundColor: "#209FAE",
        }}
      >
        <Animated.View
          style={{
            transform: [{ translateY: imageTranslate }],
            opacity: imageOpacity,
            // height:"100%",
            flex: 1,
          }}
        >
          {/* Image */}
          <Animated.Image
            source={{ uri: data?.destinationById?.images[0].image }}
            style={{
              flex: 1,
              // height: 180,
              width: "100%",
              opacity: imageOpacity,
              // transform: [{ translateY: imageTranslate }],
            }}
          />

          {/* Judul */}
          <View
            style={{
              paddingTop: 10,
              paddingHorizontal: 15,
              width: Dimensions.get("screen").width,
              // height: 70,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFF",
              bottom: 0,
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width * 0.7,
                justifyContent: "space-around",
              }}
            >
              <Text size="title" type="black" numberOfLines={1}>
                {data?.destinationById?.name}
              </Text>
              <View style={{ flexDirection: "row", marginTop: 2 }}>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",
                    padding: 3,
                    marginRight: 5,
                  }}
                >
                  <Text size="description" type="bold">
                    {data?.destinationById?.type?.name}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",
                    padding: 3,
                    flexDirection: "row",
                    marginRight: 5,
                    alignItems: "center",
                  }}
                >
                  <Star height={13} width={13} />
                  <Text
                    size="description"
                    type="bold"
                    style={{ marginLeft: 3 }}
                  >
                    {data?.destinationById?.rating.substr(0, 3)}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 2,
                    padding: 3,
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{ color: "#209FAE" }}
                  >
                    {data?.destinationById?.count_review} Reviews
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {dataDestination?.liked === true ? (
                <Pressable
                  style={{
                    backgroundColor: "#F6F6F6",
                    marginRight: 2,
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5,
                  }}
                  onPress={() => _unliked(dataDestination.id)}
                >
                  <Love height={18} width={18} />
                </Pressable>
              ) : (
                <Pressable
                  onPress={() =>
                    shareAction({
                      from: "destination",
                      target: dataDestination.id,
                    })
                  }
                  style={{
                    backgroundColor: "#F6F6F6",
                    marginRight: 2,
                    height: 34,
                    width: 34,
                    borderRadius: 17,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 5,
                  }}
                  onPress={() => _liked(dataDestination.id)}
                >
                  <LikeEmpty height={18} width={18} />
                </Pressable>
              )}
              <Pressable
                onPress={() =>
                  shareAction({
                    from: "destination",
                    target: dataDestination.id,
                  })
                }
                style={{
                  backgroundColor: "#F6F6F6",
                  marginRight: 2,
                  height: 34,
                  width: 34,
                  borderRadius: 17,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ShareBlack height={20} width={20} />
              </Pressable>
            </View>
          </View>

          {/* Type */}
          {data?.destinationById?.movie_location?.length > 0 ||
          data?.destinationById?.type?.name.toLowerCase().substr(0, 6) ==
            "unesco" ? (
            <View
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 15,
                // height: 40,
                padding: 5,
                flexDirection: "row",
                backgroundColor: "#FFF",
                bottom: 0,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 5,
                  marginRight: 5,
                  backgroundColor: "#DAF0F2",
                  padding: 5,
                }}
              >
                <UnescoIcon height={20} width={20} style={{ marginRight: 5 }} />
                <Text size="description" type="regular">
                  UNESCO
                </Text>
              </View>
              {data?.destinationById?.movie_location?.length > 0 ? (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 5,
                    borderRadius: 5,
                    backgroundColor: "#DAF0F2",
                  }}
                >
                  <MovieIcon
                    height={20}
                    width={20}
                    style={{ marginRight: 5 }}
                  />
                  <Text size="description" type="regular">
                    Movie Location
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View
              onLayout={() => setUnesco(40)}
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 15,
                // height: 0,
                paddingVertical: 5,
                flexDirection: "row",
                backgroundColor: "#FFF",
                bottom: 0,
              }}
            ></View>
          )}

          {/* View address */}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F6F6F6",
              width: Dimensions.get("screen").width,
              // minHeight: 40,
              paddingHorizontal: 15,
              backgroundColor: "#FFF",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              bottom: 0,
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width * 0.75,
              }}
            >
              <PinHijau
                height={18}
                width={18}
                style={{ marginRight: 10, alignSelf: "center" }}
              />
              <Text
                onTextLayout={(x) => {
                  let line = x.nativeEvent.lines.length;
                  let lines = line - 1;
                  setTambahan(lines * 20);
                }}
                size="description"
                type="regular"
                style={{ lineHeight: 18 }}
                numberOfLines={2}
              >
                {data?.destinationById?.address
                  ? data?.destinationById?.address
                  : "-"}
              </Text>
            </View>
            {data?.destinationById?.address ? (
              <Ripple
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  Linking.openURL(
                    Platform.OS == "ios"
                      ? "maps://app?daddr=" +
                          data?.destinationById?.latitude +
                          "+" +
                          data?.destinationById?.longitude
                      : "google.navigation:q=" +
                          data?.destinationById?.latitude +
                          "+" +
                          data?.destinationById?.longitude
                  );
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ color: "#209FAE" }}
                >
                  maps
                </Text>
              </Ripple>
            ) : null}
          </View>

          {/* View Time */}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F6F6F6",
              width: Dimensions.get("screen").width,
              // minHeight: 40,
              paddingHorizontal: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFF",
              bottom: 0,
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width * 0.75,
              }}
            >
              <Clock
                height={18}
                width={18}
                style={{ marginRight: 10, aligmSelf: "center" }}
              />
              <Text
                size="description"
                type="regular"
                style={{ lineHeight: 18 }}
                numberOfLines={2}
                onTextLayout={(x) => {
                  let line = x.nativeEvent.lines.length;
                  let lines = line - 1;
                  setTambahan1(lines * 20);
                }}
              >
                {data?.destinationById?.openat
                  ? data?.destinationById?.openat
                  : "-"}
              </Text>
            </View>
            {data?.destinationById?.openat ? (
              <Ripple
                onPress={() => setModalTime(true)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ color: "#209FAE" }}
                >
                  more
                </Text>
              </Ripple>
            ) : null}
          </View>

          {/* View Website */}

          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: "#F6F6F6",
              width: Dimensions.get("screen").width,
              // minHeight: 40,
              paddingHorizontal: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFF",
              bottom: 0,
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width * 0.75,
              }}
            >
              <Globe
                height={18}
                width={18}
                style={{ marginRight: 10, alignSelf: "center" }}
              />
              <Text
                size="description"
                type="regular"
                numberOfLines={2}
                style={{ lineHeight: 18 }}
                onTextLayout={(x) => {
                  let line = x.nativeEvent.lines.length;
                  let lines = line - 1;
                  setTambahan2(lines * 20);
                }}
              >
                {data?.destinationById?.website
                  ? data?.destinationById?.website
                  : "-"}
              </Text>
            </View>
            {data?.destinationById?.website ? (
              <Ripple
                onPress={() => setModalSosial(true)}
                style={{
                  // minHeight: 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ color: "#209FAE" }}
                >
                  more
                </Text>
              </Ripple>
            ) : null}
          </View>
          <View style={{ height: 5, backgroundColor: "#F1F1F1" }}></View>
        </Animated.View>
      </Animated.View>
    );
  };

  const addToPlan = (kiriman) => {
    if (token && token !== null && token !== "") {
      if (kiriman) {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: kiriman.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: kiriman.id,
                Position: "destination",
              },
            });
      } else {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: data?.destinationById.id,
                  token: token,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: data?.destinationById?.id,
                Position: "destination",
              },
            });
      }
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  const renderGeneral = ({ item, index, props }) => {
    return (
      <Generals data={item} props={props} addTo={addToPlan} token={token} />
    );
  };

  const renderReview = ({ item, props }) => {
    return <Reviews id={item?.id} props={props} />;
  };

  const renderArticle = (e, dataA) => {
    let render = [];
    render = dataA;

    return (
      <View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 5,
        }}
      >
        {render && render.length
          ? render.map((i, index) => {
              if (!i) {
                <View key={"content" + index} style={{ alignItems: "center" }}>
                  <Text
                    type="regular"
                    size="title"
                    style={{
                      textAlign: "justify",
                      color: "#464646",
                    }}
                  >
                    {t("noArticle")}
                  </Text>
                </View>;
              } else {
                return (
                  <View key={index}>
                    {i.type === "image" ? (
                      <View>
                        {i.title ? (
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              marginBottom: 5,
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}

                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={i.image ? { uri: i.image } : default_image}
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              borderColor: "#d3d3d3",
                              marginVertical: 10,
                              height: Dimensions.get("screen").width * 0.8,
                              width: "100%",
                            }}
                          />
                        </View>
                        <Text
                          size="readable"
                          type="regular"
                          style={{
                            textAlign: "justify",
                            lineHeight: 21,
                            // fontFamily: "Lato-Regular",
                            // fontSize: 13,
                            color: "#464646",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {i.title ? (
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              marginBottom: 10,

                              // marginVertical: 10,

                              color: "#464646",
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}
                        <Text
                          size="readable"
                          type="regular"
                          style={{
                            lineHeight: 21,
                            textAlign: "justify",
                            // fontFamily: "Lato-Regular",
                            // fontSize: 13,
                            color: "#464646",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }
            })
          : null}
      </View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "flex-end",
          width: Dimensions.get("screen").width / 3,
        }}
      >
        <Text
          type={focused ? "bold" : "regular"}
          size="label"
          style={{
            color: focused ? "#209FAE" : "#464646",
          }}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    let tempdataa = [];
    // console.log(route.data);
    tempdataa.push(dataDestination);
    switch (route.key) {
      case "general":
        numCols = 1;
        data = tempdataa;
        renderItem = (e) => renderGeneral(e);
        break;
      case "review":
        numCols = 1;
        data = tempdataa;
        renderItem = (e) => renderReview(e);
        break;
      default:
        data = tempdataa;
        renderItem = (e) => renderArticle(e, route.data);
        break;
    }

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
        // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        // ListHeaderComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight,
          // paddingHorizontal: 10,
          backgroundColor: "#FFF",
          minHeight: height - SafeStatusBar + HeaderHeight,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) => renderItem({ props, item, index })}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 55],
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
        <FlatList
          key={"listtabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            borderBottomWidth: 0.5,
          }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                _tabIndex.current = index;
                setIndex(index);
                scrollRef.current?.scrollToIndex({
                  // y: 0,
                  // x: 100,
                  index: index,
                  animated: true,
                });
              }}
            >
              <View
                style={{
                  borderBottomWidth: 2,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#FFFFFF",
                  alignContent: "center",
                  paddingHorizontal: 15,
                  width:
                    props.navigationState.routes.length < 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length < 3
                      ? Dimensions.get("screen").width * 0.5
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 0.7,
                      // borderWidth: 1,
                      borderBottomWidth: 0,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      height: 38,
                      paddingTop: 2,
                      // paddingLeft:
                      //   props.navigationState.routes.length < 2 ? 15 : null,
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  {item.key}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </Animated.View>

      //   <Animated.View
      //     style={{
      //       top: 0,
      //       zIndex: 1,
      //       position: "absolute",
      //       transform: [{ translateY: y }],
      //       width: "100%",
      //     }}
      //   >
      //     <TabBar
      //       {...props}
      //       onTabPress={({ route, preventDefault }) => {
      //         if (isListGliding.current) {
      //           preventDefault();
      //         }
      //       }}
      //       style={{
      //         elevation: 0,
      //         shadowOpacity: 0,
      //         backgroundColor: "white",
      //         height: TabBarHeight,
      //         borderBottomWidth: 2,
      //         borderBottomColor: "#daf0f2",
      //       }}
      //       renderLabel={renderLabel}
      //       indicatorStyle={{ backgroundColor: "#209fae" }}
      //     />
      //   </Animated.View>
    );
  };

  //   console.log("on", _tabIndex.current);

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
          scrollRef.current?.scrollToIndex({
            index: id,
            animated: true,
          });
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
      ),
    });
  };

  useEffect(() => {
    setTimeout(() => {
      setLoadings(false);
    }, 1000);
  }),
    [];

  let [loadings, setLoadings] = useState(true);

  if (loading) {
    return <IndexSkeleton />;
  }

  if (loadings) {
    return <IndexSkeleton />;
  }

  return (
    <View style={styles.container}>
      {/* <Satbar backgroundColor="#14646E" /> */}

      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
      {/* BottomButton */}
      <BottomButton
        routed={_tabIndex.current}
        props={props}
        data={data?.destinationById}
        addTo={addToPlan}
      />

      {/* Modal Activiy */}
      <ActivityModal
        setModalActivity={(e) => setModalActivity(e)}
        modals={modalActivity}
        data={data?.destinationById}
      />

      {/* Modal Facility */}
      <FacilityModal
        setModalFacility={(e) => setModalFacility(e)}
        modals={modalFacility}
        data={data?.destinationById}
      />

      {/* Modal Service */}
      <ServiceModal
        setModalService={(e) => setModalService(e)}
        modals={modalService}
        data={data?.destinationById}
      />

      {/* Modal Time */}
      <Modal
        isVisible={modalTime}
        onRequestClose={() => {
          setModalTime(false);
        }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          style={{
            backgroundColor: "#fff",
            minHeight: 150,
            // borderRadius: 5,
          }}
        >
          {/* Information */}
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              marginVertical: 20,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text size="title" type="bold">
              Operational (Local Time)
            </Text>
            <Ripple
              onPress={() => setModalTime(false)}
              style={{
                paddingVertical: 10,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xhitam height={15} width={15} />
            </Ripple>
          </View>

          {/* Detail Information */}
          <View
            style={{
              marginHorizontal: 15,
            }}
          >
            {data && data.destinationById && data.destinationById.openat ? (
              <Text size="label" type="reguler">
                {data.destinationById.openat}
              </Text>
            ) : (
              <Text>-</Text>
            )}
          </View>
          {/* <View
            style={{
              marginTop: 20,
              marginHorizontal: 15,
            }}
          >
            <Text size="label" type="reguler">
              Open 24 hours
            </Text>
          </View> */}
        </View>
      </Modal>

      {/* Modal Sosial */}
      <Modal
        isVisible={modalSosial}
        onRequestClose={() => {
          setModalSosial(false);
        }}
        animationIn="slideInUp"
        animationOut="slideOutDown"
      >
        <View
          style={{
            backgroundColor: "#fff",
            minHeight: 200,
            // borderRadius: 5,
          }}
        >
          {/* Information */}
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              justifyContent: "space-between",
              alignItems: "center",
              paddingVertical: 10,
            }}
          >
            <Text size="title" type="bold">
              Information
            </Text>
            <Ripple
              onPress={() => setModalSosial(false)}
              style={{
                paddingVertical: 10,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xhitam height={15} width={15} />
            </Ripple>
          </View>

          {/* Detail Information */}
          <View
            style={{
              marginHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              width: Dimensions.get("screen").width * 0.7,
            }}
          >
            <TeleponHitam height={15} width={15} style={{ marginRight: 10 }} />
            {data && data.destinationById && data.destinationById.phone1 ? (
              <Text size="label" type="reguler">
                {data.destinationById.phone1}
              </Text>
            ) : (
              <Text>-</Text>
            )}
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              width: Dimensions.get("screen").width * 0.7,
            }}
          >
            <WebsiteHitam height={15} width={15} style={{ marginRight: 10 }} />
            {data && data.destinationById && data.destinationById.website ? (
              <Text size="label" type="reguler">
                {data.destinationById.website}
              </Text>
            ) : (
              <Text>-</Text>
            )}
          </View>
          <View
            style={{
              marginTop: 20,
              marginHorizontal: 15,
              flexDirection: "row",
              alignItems: "center",
              width: Dimensions.get("screen").width * 0.7,
            }}
          >
            <InstagramHitam
              height={15}
              width={15}
              style={{ marginRight: 10 }}
            />
            {data && data.destinationById && data.destinationById.instagram ? (
              <Text size="label" type="reguler">
                {data.destinationById.instagram}
              </Text>
            ) : (
              <Text>-</Text>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  //   label: { fontSize: 14, color: "#222" },
  indicator: { backgroundColor: "#209FAE" },
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },
  labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },
});

export default Index;
