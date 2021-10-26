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
  ScrollView,
  Modal as ModalRN,
  TextInput,
  ViewBase,
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
  Xgray,
  Mapsborder,
  BlockDestination,
  Arrowbackios,
} from "../../../assets/svg";
import { TabBar, TabView } from "react-native-tab-view";
import Modal from "react-native-modal";
import Ripple from "react-native-material-ripple";
import {
  Text,
  Button,
  StatusBar as Satbar,
  shareAction,
  FunImage,
  FunIcon,
  CopyLink,
  Truncate,
} from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import ListDesAnother from "../../../graphQL/Query/Destination/ListDesAnother";
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
import ImageSlide from "../../../component/src/ImageSlide";
import { default_image, search_button } from "../../../assets/png";
import normalize from "react-native-normalize";
const deviceId = DeviceInfo.getModel();

let PullToRefreshDist = 150;

const Index = (props) => {
  const { t, i18n } = useTranslation();

  /**
   * stats
   */

  let AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
  let { width, height } = Dimensions.get("screen");
  let Notch = DeviceInfo.hasNotch();
  let TabBarHeight = Platform.select({
    ios: Notch ? 40 : 40,
    android: 40,
  });
  let [unesco, setUnesco] = useState(0);
  let [tambahan, setTambahan] = useState(0);
  let [tambahan1, setTambahan1] = useState(0);
  let [tambahan2, setTambahan2] = useState(0);

  const HeaderHeight = Platform.select({
    ios: 457 + tambahan + tambahan1 + tambahan2 - unesco,
    android: 440 + tambahan + tambahan1 + tambahan2 - unesco,
  });

  // let TabBarHeight = 75;

  let SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: StatusBar.currentHeight,
  });

  // let hide = React.useRef(
  //   scrollY.interpolate({
  //     inputRange: [0, HEADER_SCROLL_DISTANCE],
  //     outputRange: [0, 1],
  //     extrapolate: "clamp",
  //   })
  // );
  // let SafeStatusBar = 0;

  let [newHeight, setNewHeight] = useState(0);
  let scrollRef = useRef();

  const [tabIndex, setIndex] = useState(0);
  //   const [routes] = useState([
  //     { key: "tab1", title: "General" },
  //     { key: "tab2", title: "Review" },
  //   ]);

  const [routes, setRoutes] = useState(Array(100).fill(0));
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

  let [more, setMore] = useState(false);
  let [lines, setLines] = useState(3);
  let [dataAnother, setDataAnother] = useState({});
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);
  const layoutText = (e) => {
    setMore(e.nativeEvent.lines.length > 3 && lines !== 0);
  };

  // const HeaderComponent = {
  //   headerShown: true,
  //   headerTransparent: true,
  //   headerTintColor: "white",
  //   headerTitle: data?.destinationById?.name,
  //   headerMode: "screen",
  //   headerStyle: {
  //     backgroundColor: "#209FAE",
  //     elevation: 0,
  //     borderBottomWidth: 0,
  //   },
  //   headerTitleStyle: {
  //     fontFamily: "Lato-Bold",
  //     fontSize: 18,
  //     color: "white",
  //   },
  //   headerLeftContainerStyle: {
  //     background: "#FFF",

  //     marginLeft: 10,
  //   },
  //   headerLeft: () => (
  //     <Button
  //       text={""}
  //       size="medium"
  //       type="circle"
  //       variant="transparent"
  //       onPress={() => props.navigation.goBack()}
  //       style={{
  //         height: 55,
  //       }}
  //     >
  //       <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
  //     </Button>
  //   ),
  // };

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
      tab.push({ key: "review", title: "Review" });

      data?.destinationById?.article_header.map((item, index) => {
        tab.push({
          key: item.title,
          title: item.title,
          data: item.content,
        });
      });

      setRoutes(tab);

      setDataDestination(data.destinationById);
    },
  });

  let [anotherDes, setAnotherDes] = useState([]);

  const [
    fetchDataAnotherDes,
    {
      data: dataDesAnother,
      loading: loadingDesAnother,
      error: errorDesAnother,
    },
  ] = useLazyQuery(ListDesAnother, {
    variables: { id: props.route.params.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setAnotherDes(dataDesAnother.destination_another_place);
    },
  });

  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        // syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },

      onPanResponderRelease: (evt, gestureState) => {
        // syncScrollOffset();
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        headerScrollY.setValue(scrollY._value);
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          // syncScrollOffset();
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        listRefArr.current.forEach((item) => {
          if (item.key !== routes[_tabIndex.current].key) {
            return;
          }
          if (item.value) {
            item.value.scrollToOffset({
              offset: -gestureState.dy + headerScrollStart.current,
              animated: false,
            });
          }
        });
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
    await fetchDataAnotherDes();

    let setsetting = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    // props.navigation.setOptions(HeaderComponent);
    loadAsync();
    const unsubscribe = props.navigation.addListener("focus", () => {});
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
  let hides = React.useRef(
    scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0],
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

  const [sharemodal, SetShareModal] = useState(false);
  const [shareuser, SetShareUser] = useState(false);
  const renderButton = () => {
    const x = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });

    <Animated.View
      style={{
        transform: [{ translateY: x }],
        top: SafeStatusBar,
        height: HeaderHeight + Dimensions.get("screen").height / 10,
        width: "100%",
        position: "absolute",
        backgroundColor: "#209FAE",
        borderWidth: 1,
      }}
    >
      <View
        style={{
          top: HeaderHeight + Dimensions.get("screen").height / 10,
          position: "absolute",
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
            <Love height={20} width={20} />
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
            <LikeEmpty height={20} width={20} />
          </Pressable>
        )}
        <TouchableOpacity
          onPress={() =>
            // shareAction({
            //   from: "destination",
            //   target: dataDestination.id,
            // })
            SetShareModal(true)
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
        </TouchableOpacity>
      </View>
    </Animated.View>;
  };

  let [layoutsAddress, setLayoutsAddress] = useState(0);
  let [layoutsOpen, setLayoutsOpen] = useState(0);
  let [layoutsWeb, setLayoutsWeb] = useState(0);
  let [layoutImage, setLayoutImage] = useState(0);
  let [layoutHeader, setLayoutHeader] = useState(0);
  let [layoutUnesco, setLayoutUnesco] = useState(0);

  const yButtonLikeShare = scrollY.interpolate({
    inputRange: [0, HeaderHeight],
    outputRange: [0, -HeaderHeight + 55],
    extrapolateRight: "clamp",
  });

  const opacityButtonLikeShare = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (layoutImage === 0) {
      Animated.timing(opacityButtonLikeShare, {
        toValue: 1,
        duration: 25000,
        useNativeDriver: true,
      }).start();
    }
  }, []);

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        pointerEvents="none"
        {...headerPanResponder.panHandlers}
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
            // height: HeaderHeight - 100,
          }}
        >
          {/* Image */}
          <Animated.Image
            onLayout={(event) => {
              let heights = event.nativeEvent.layout.height;
              setLayoutImage(heights);
            }}
            source={
              data &&
              data?.destinationById &&
              data?.destinationById?.images[0] &&
              data?.destinationById?.images[0].image
                ? { uri: data?.destinationById?.images[0].image }
                : default_image
            }
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
            onLayout={(event) => {
              let heights = event.nativeEvent.layout.height;
              setLayoutHeader(heights);
            }}
            style={{
              paddingTop: 10,
              paddingHorizontal: 18,
              width: Dimensions.get("screen").width,
              // height: 70,
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width * 0.7,
                justifyContent: "space-around",
              }}
            >
              <View style={{ width: "95%" }}>
                <Text size="header" type="black" numberOfLines={1}>
                  {data?.destinationById?.name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",
                    // padding: 3,
                    marginRight: 10,
                    height: 25,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="bold"
                    style={{ marginHorizontal: 10, marginBottom: 3 }}
                  >
                    {data?.destinationById?.type?.name}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",
                    // padding: 3,
                    flexDirection: "row",
                    marginRight: 10,
                    alignItems: "center",
                    height: 25,
                  }}
                >
                  <Star height={15} width={15} style={{ marginLeft: 10 }} />
                  <Text
                    size="description"
                    type="bold"
                    style={{ marginLeft: 5, marginRight: 10 }}
                  >
                    {data?.destinationById?.rating.substr(0, 3)}
                  </Text>
                </View>
                <View
                  style={{
                    borderRadius: 2,
                    height: 25,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{ color: "#209FAE" }}
                  >
                    {data?.destinationById?.count_review} {t("reviews")}
                  </Text>
                </View>
              </View>
            </View>

            {/* Button like and share */}
            {/* <View
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
                  <Love height={20} width={20} />
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
                  <LikeEmpty height={20} width={20} />
                </Pressable>
              )}
              <TouchableOpacity
                onPress={() =>
                  // shareAction({
                  //   from: "destination",
                  //   target: dataDestination.id,
                  // })
                  SetShareModal(true)
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
              </TouchableOpacity>
            </View> */}
            {/*End Button like and share */}
          </View>

          {/* Type */}
          {data?.destinationById?.movie_location?.length > 0 ||
          data?.destinationById?.type?.name.toLowerCase().substr(0, 6) ==
            "unesco" ? (
            <View
              onLayout={(event) => {
                let heights = event.nativeEvent.layout.height;
                setLayoutUnesco(heights);
              }}
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 18,
                height: 45,
                paddingVertical: 7,
                flexDirection: "row",
                backgroundColor: "#FFF",
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
                  paddingVertical: 8,
                  paddingHorizontal: 15,
                }}
              >
                <UnescoIcon height={27} width={27} style={{ marginRight: 5 }} />
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
                    borderRadius: 5,
                    backgroundColor: "#DAF0F2",
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                  }}
                >
                  <MovieIcon
                    height={30}
                    width={30}
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
            onLayout={(event) => {
              let heights = event.nativeEvent.layout.height;
              setLayoutsAddress(heights);
            }}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 18,
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width * 0.7,
                  marginVertical: 8,
                }}
              >
                <PinHijau
                  height={20}
                  width={20}
                  style={{ marginRight: 10, alignSelf: "center" }}
                />
                <Text
                  onTextLayout={(x) => {
                    let line = x.nativeEvent.lines.length;
                    let lines = line - 1;
                    setTambahan(lines * 20);
                  }}
                  size="label"
                  type="regular"
                  style={{ lineHeight: 18 }}
                  numberOfLines={2}
                >
                  {data?.destinationById?.address
                    ? data?.destinationById?.address
                    : "-"}
                </Text>
              </View>
              {/* {data?.destinationById?.address ? (
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
                  <Mapsborder height="25" width="25" />
                  
                </Ripple>
              ) : null} */}
            </View>
          </View>

          {/* View Time */}

          <View
            onLayout={(event) => {
              let heights = event.nativeEvent.layout.height;
              setLayoutsOpen(heights);
            }}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 18,
              backgroundColor: "#FFF",
              bottom: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderTopColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginVertical: 8,
                  width: Dimensions.get("screen").width * 0.7,
                }}
              >
                <Clock
                  height={20}
                  width={20}
                  style={{ marginRight: 10, aligmSelf: "center" }}
                />
                <Text
                  size="label"
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
              {/* {data?.destinationById?.openat ? (
                <Pressable
                  onPress={() => setModalTime(true)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#209FAE",
                      marginVertical: 8,
                      marginLeft: 10,
                    }}
                  >
                    {t("more")}
                  </Text>
                </Pressable>
              ) : null} */}
            </View>
          </View>

          {/* View Website */}

          <View
            onLayout={(event) => {
              let heights = event.nativeEvent.layout.height;
              setLayoutsWeb(heights);
            }}
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 18,
              backgroundColor: "#FFF",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopWidth: 1,
                borderBottomWidth: 1,
                borderTopColor: "#f6f6f6",
                borderBottomColor: "#f6f6f6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: Dimensions.get("screen").width * 0.7,
                  marginVertical: 8,
                }}
              >
                <Globe
                  height={20}
                  width={20}
                  style={{ marginRight: 10, alignSelf: "center" }}
                />
                <Text
                  size="label"
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
              {/* {data?.destinationById?.website ? (
                <Pressable
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
                    style={{
                      color: "#209FAE",
                      marginVertical: 8,
                      marginLeft: 10,
                    }}
                  >
                    {t("more")}
                  </Text>
                </Pressable>
              ) : null} */}
            </View>
          </View>
          {/* <View style={{ height: 5, backgroundColor: "#F1F1F1" }}></View> */}
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

  // const renderGeneral = ({ item, index, props }) => {
  //   return (
  //     <Generals data={item} props={props} addTo={addToPlan} token={token} />
  //   );
  // };

  const [
    mutationlikedAnother,
    {
      loading: loadingLikeAnother,
      data: dataLikeAnother,
      error: errorLikeAnother,
    },
  ] = useMutation(Liked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUnlikedAnother,
    {
      loading: loadingUnLikeAnother,
      data: dataUnLikeAnother,
      error: errorUnLikeAnother,
    },
  ] = useMutation(unLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _likedAnother = async (id) => {
    if (token && token !== "" && token !== null) {
      // var tempData = { ...dataAnother };
      // var index = tempData.another_place.findIndex((k) => k["id"] === id);
      // tempData.another_place[index].liked = true;
      // setDataAnother(tempData);
      try {
        let response = await mutationlikedAnother({
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
          fetchDataAnotherDes();
          if (
            response.data.setDestination_wishlist.code === 200 ||
            response.data.setDestination_wishlist.code === "200"
          ) {
            // var tempData = { ...dataAnother };
            // var index = tempData.another_place.findIndex((k) => k["id"] === id);
            // tempData.another_place[index].liked = true;
            // setDataAnother(tempData);
          } else {
            throw new Error(response.data.setDestination_wishlist.message);
          }
        }
      } catch (error) {
        // var tempData = { ...dataAnother };
        // var index = tempData.another_place.findIndex((k) => k["id"] === id);
        // tempData.another_place[index].liked = false;
        // setDataAnother(tempData);
        fetchDataAnotherDes();
        // alert("" + error);
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

  const _unlikedAnother = async (id) => {
    if (token && token !== "" && token !== null) {
      // var tempData = { ...dataAnother };
      // var index = tempData.another_place.findIndex((k) => k["id"] === id);
      // tempData.another_place[index].liked = false;
      // setDataAnother(tempData);
      try {
        let response = await mutationUnlikedAnother({
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
          fetchDataAnotherDes();
          if (
            response.data.unset_wishlist_destinasi.code === 200 ||
            response.data.unset_wishlist_destinasi.code === "200"
          ) {
            // var tempData = { ...dataAnother };
            // var index = tempData.another_place.findIndex((k) => k["id"] === id);
            // tempData.another_place[index].liked = false;
            // setDataAnother(tempData);
          } else {
            throw new Error(response.data.unset_wishlist_destinasi.message);
          }
        }
      } catch (error) {
        fetchDataAnotherDes();
        // var tempData = { ...dataAnother };
        // var index = tempData.another_place.findIndex((k) => k["id"] === id);
        // tempData.another_place[index].liked = true;
        // setDataAnother(tempData);
        // alert("" + error);
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
  let [indeks, setIndeks] = useState(0);

  const ImagesSlider = async (index, data) => {
    var tempdatas = [];
    var x = 0;

    for (var i in data) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data[i].image, (width, height) => {
        wid = width;
        hig = height;
      });
      tempdatas.push({
        key: i,
        url: data[i].image ? data[i].image : "",
        width: wid,
        height: hig,
        props: { source: data[i].image ? data[i].image : "" },
      });
      x++;
    }

    await setIndeks(index);
    await setGambar(tempdatas);
    await setModalss(true);
  };

  const renderGeneral = () => {
    return (
      <View>
        <ImageSlide
          index={indeks}
          show={modalss}
          dataImage={gambar}
          setClose={() => setModalss(false)}
        />
        {dataDestination?.description ? (
          <View
            style={{
              // minHeight: 30,
              marginTop: 15,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
            }}
          >
            <Text
              size="readable"
              type="regular"
              style={{
                lineHeight: 20,
                textAlign: "left",
              }}
              numberOfLines={lines}
              onTextLayout={layoutText}
            >
              {dataDestination?.description}
            </Text>
            {more && (
              <Text
                size="readable"
                type="regular"
                onPress={() => {
                  setMore(false);
                  setLines(0);
                }}
                style={{ color: "#209FAE" }}
              >
                {t("readMore")}
              </Text>
            )}
            {!more && (
              <Text
                size="readable"
                type="regular"
                onPress={() => {
                  setMore(true);
                  setLines(3);
                }}
                style={{ color: "#209FAE" }}
              >
                {t("readless")}
              </Text>
            )}
          </View>
        ) : null}

        {/* View GreatFor */}
        {dataDestination && dataDestination.greatfor.length > 0 ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop: 15,
            }}
          >
            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                minHeight: 60,
                justifyContent: "center",
                padding: 10,
                backgroundColor: "#FFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,

                elevation: 6,
              }}
            >
              <Text size="label" type="bold" style={{ textAlign: "center" }}>
                {t("GreatFor")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  // borderWidth: 1,
                }}
              >
                {dataDestination &&
                  dataDestination.greatfor.map((item, index) => {
                    return (
                      <View
                        key={"desk" + index}
                        style={{
                          // marginTop: 10,
                          width: (width - 50) / 4,
                          justifyContent: "center",
                          alignItems: "center",
                          // borderWidth: 1,
                        }}
                      >
                        <View
                          style={{
                            height: 60,
                            width: 60,
                            borderRadius: 30,
                            // backgroundColor: "#F6F6F6",
                            justifyContent: "center",
                            alignItems: "center",
                            // borderWidth: 1,
                          }}
                        >
                          <FunIcon icon={item?.icon} height={50} width={50} />
                        </View>
                        <Text
                          size="description"
                          type="regular"
                          style={{ marginTop: -5 }}
                        >
                          {item?.name}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
        ) : null}

        {/* View Facilites */}

        {dataDestination && dataDestination.core_facilities.length > 0 ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop:
                dataDestination && dataDestination.greatfor.length > 0 ? 0 : 15,
            }}
          >
            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                minHeight: 50,
                justifyContent: "center",
                padding: 10,
                backgroundColor: "#FFF",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 5,
                },
                shadowOpacity: 0.1,
                shadowRadius: 6.27,

                elevation: 6,
              }}
            >
              <Text size="label" type="bold" style={{ textAlign: "center" }}>
                {t("PublicFacility")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {dataDestination &&
                  dataDestination.core_facilities.map((item, index) => (
                    <View
                      key={"fac" + index}
                      style={{
                        // marginTop: 10,
                        width: (width - 50) / 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          height: 60,
                          width: 60,
                          borderRadius: 30,
                          // backgroundColor: "#F6F6F6",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FunIcon icon={item?.icon} height={50} width={50} />
                      </View>
                      <Text
                        // size="small"
                        type="light"
                        style={{ marginTop: -5 }}
                      >
                        {item?.name}
                      </Text>
                    </View>
                  ))}
              </View>
            </View>
          </View>
        ) : null}

        {/* Moview */}
        {dataDestination && dataDestination.movie_location.length > 0 ? (
          <>
            <View
              style={{
                width: Dimensions.get("screen").width,
                paddingHorizontal: 20,
                marginTop: 20,
                // borderWidth: 1,
              }}
            >
              <Text size="title" type="bold">
                {t("MovieLocation")}
              </Text>
              <Text
                size="description"
                type="regular"
                style={{ marginBottom: 3 }}
              >
                {t("WhereSubDestination")}
              </Text>
            </View>
            <ScrollView
              contentContainerStyle={{
                // width: Dimensions.get("screen").width,
                paddingLeft: 15,
                paddingRight: 10,
                // paddingBottom: 20,
                marginTop: 5,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {dataDestination &&
                dataDestination.movie_location.map((item, index) => (
                  <Pressable
                    onPress={() => {
                      props.navigation.push("TravelIdeaStack", {
                        screen: "Detail_movie",
                        params: {
                          movie_id: item.id,
                          token: token,
                        },
                      });
                    }}
                    key={"mov" + index}
                    style={{
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: "#F3F3F3",
                      // height: 150,
                      marginBottom: 10,
                      flexDirection: "row",
                      // width: Dimensions.get("screen").width * 0.9,
                      width: Dimensions.get("screen").width * 0.9,
                      // padding: 10,
                      backgroundColor: "#FFF",
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 5,
                      },
                      shadowOpacity: 0.1,
                      shadowRadius: 6.27,
                      elevation: 6,
                      marginRight: 5,
                    }}
                  >
                    <FunImage
                      source={
                        item?.cover ? { uri: item?.cover } : default_image
                      }
                      style={{
                        height: 150,
                        width: 120,
                        borderTopLeftRadius: 10,
                        borderBottomLeftRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        flex: 1,
                        height: "100%",
                        marginHorizontal: 10,
                        paddingVertical: 5,
                      }}
                    >
                      <Text size="label" type="bold">
                        {item?.title}
                      </Text>
                      <Text
                        size="description"
                        type="regular"
                        style={{
                          lineHeight: 18,
                          textAlign: "left",
                          marginTop: 5,
                        }}
                        numberOfLines={6}
                      >
                        {item?.description}
                        {item?.description}
                      </Text>
                    </View>
                  </Pressable>
                ))}
            </ScrollView>
          </>
        ) : null}

        {/* Photo */}
        {dataDestination && dataDestination.images ? (
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop: 5,
            }}
          >
            <View style={{ marginHorizontal: 5 }}>
              <Text size="title" type="bold">
                {t("photo")}
              </Text>
              <Text
                size="description"
                type="regular"
                style={{ marginBottom: 3 }}
              >
                {t("SubDestinationPhoto")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                marginTop: 5,
                width: "100%",
                height: 80,
              }}
            >
              {dataDestination
                ? dataDestination.images.map((item, index) => {
                    if (index < 3) {
                      return (
                        <Pressable
                          key={index + "2"}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            ImagesSlider(index, dataDestination.images)
                          }
                        >
                          <FunImage
                            key={index + "1"}
                            source={
                              item?.image ? { uri: item?.image } : default_image
                            }
                            style={{
                              // // width: Dimensions.get("screen").width * 0.15,
                              // width: Dimensions.get("screen").width * 0.22,
                              width: (Dimensions.get("screen").width - 40) / 4,
                              height: "100%",
                              marginLeft: 2,
                            }}
                          />
                        </Pressable>
                      );
                    } else if (
                      index === 3 &&
                      dataDestination.images.length > 4
                    ) {
                      return (
                        <Pressable
                          key={index + "2"}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={() =>
                            ImagesSlider(index, dataDestination.images)
                          }
                        >
                          <FunImage
                            key={index}
                            source={
                              item?.image ? { uri: item?.image } : default_image
                            }
                            style={{
                              opacity: 0.9,
                              // width: Dimensions.get("screen").width * 0.22,
                              width: (Dimensions.get("screen").width - 40) / 4,
                              height: "100%",
                              opacity: 0.32,
                              marginLeft: 2,
                              backgroundColor: "#000",
                            }}
                          />
                          <Text
                            size="title"
                            type="regular"
                            style={{
                              position: "absolute",
                              right: 40,
                              alignSelf: "center",
                              color: "#FFF",
                              top: 30,
                            }}
                          >
                            {"+" + (dataDestination.images.length - 4)}
                          </Text>
                        </Pressable>
                      );
                    } else if (index === 3) {
                      return (
                        <FunImage
                          key={index + "3"}
                          source={
                            item?.image ? { uri: item?.image } : default_image
                          }
                          style={{
                            // width: Dimensions.get("screen").width * 0.22,
                            width: (Dimensions.get("screen").width - 40) / 4,
                            height: "100%",
                            marginLeft: 2,
                          }}
                        />
                      );
                    } else {
                      null;
                    }
                  })
                : null}
            </View>
          </View>
        ) : null}
        {/* Another Place */}
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 15,
            marginTop: 15,
            marginBottom: 50,
          }}
        >
          <View style={{ marginHorizontal: 5 }}>
            {anotherDes?.length > 0 ? (
              <>
                <Text size="title" type="bold">
                  {t("NearbyPlace")}
                </Text>
                <Text
                  size="description"
                  type="regular"
                  style={{ marginBottom: 3 }}
                >
                  {t("gooddestinationtrip")}
                </Text>
              </>
            ) : null}
          </View>
          {anotherDes &&
            anotherDes?.map((item, index) =>
              dataDestination.id !== item.id ? (
                <Pressable
                  onPress={() =>
                    props.navigation.push("DestinationUnescoDetail", {
                      id: item.id,
                      name: item.name,
                      token: token,
                    })
                  }
                  key={"nir" + index}
                  style={{
                    borderWidth: 1,
                    borderColor: "#F3F3F3",
                    borderRadius: 10,
                    // height: 190,
                    height: Dimensions.get("screen").height / 4.7,
                    // padding: 10,
                    marginTop: 5,
                    width: "100%",
                    flexDirection: "row",
                    backgroundColor: "#FFF",
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
                  <View style={{ justifyContent: "center" }}>
                    {/* Image */}
                    <FunImage
                      source={
                        item?.images?.image
                          ? { uri: item?.images?.image }
                          : default_image
                      }
                      style={{
                        // width: 160,
                        width: Dimensions.get("screen").width / 2.7,
                        height: "100%",
                        borderBottomLeftRadius: 10,
                        borderTopLeftRadius: 10,
                      }}
                    />
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        position: "absolute",
                        top: 10,
                        right: 10,
                        left: 10,
                        width: "87%",
                        zIndex: 2,
                        // borderWidth: 3,
                        borderColor: "#209fae",
                      }}
                    >
                      {item.liked === true ? (
                        <Pressable
                          onPress={() => _unlikedAnother(item.id)}
                          style={{
                            backgroundColor: "#F3F3F3",
                            height: 30,
                            width: 30,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Love height={15} width={15} />
                        </Pressable>
                      ) : (
                        <Pressable
                          onPress={() => _likedAnother(item.id)}
                          style={{
                            backgroundColor: "#F3F3F3",
                            height: 30,
                            width: 30,
                            borderRadius: 17,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <LikeEmpty height={15} width={15} />
                        </Pressable>
                      )}
                      {item?.rating != 0 ? (
                        <View
                          style={{
                            flexDirection: "row",
                            backgroundColor: "#F3F3F3",
                            borderRadius: 3,
                            justifyContent: "center",
                            alignItems: "center",
                            paddingHorizontal: 5,
                            height: 25,
                          }}
                        >
                          <Star height={15} width={15} />
                          <Text size="description" type="bold">
                            {item.rating.substr(0, 3)}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>

                  {/* Keterangan */}
                  {/* rating */}
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 8,
                      paddingVertical: 7,
                      // height: 170,
                      justifyContent: "space-between",
                    }}
                  >
                    <View>
                      {/* Title */}
                      <View
                        style={{
                          flexDirection: "row",
                          paddingHorizontal: 3,
                          marginBottom: 5,
                          // alignItems: "center",
                        }}
                      >
                        <BlockDestination
                          height={16}
                          width={16}
                          style={{ marginTop: 5 }}
                        />
                        <Text
                          size="label"
                          type="bold"
                          numberOfLines={2}
                          style={{
                            marginLeft: 5,
                            flexWrap: "wrap",
                            width: "90%",
                            marginTop: 2,
                          }}
                        >
                          {item.name}
                        </Text>
                      </View>

                      {/* Maps */}
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginLeft: 5,
                        }}
                      >
                        <PinHijau height={15} width={15} />
                        <Text
                          size="description"
                          type="regular"
                          style={{ marginLeft: 5 }}
                          numberOfLines={1}
                        >
                          {item.cities.name}
                        </Text>
                      </View>
                    </View>
                    {/* Great for */}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        marginTop: 5,
                      }}
                    >
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "flex-end",
                          // borderWidth: 1,
                          paddingHorizontal: 7,
                        }}
                      >
                        <View
                          style={{
                            flexDirection: "row",
                          }}
                        >
                          {data?.destinationById?.movie_location?.length > 0 ? (
                            <UnescoIcon
                              height={28}
                              width={28}
                              style={{ marginRight: 5 }}
                            />
                          ) : null}
                          {data?.destinationById?.type?.name
                            .toLowerCase()
                            .substr(0, 6) == "unesco" ? (
                            <MovieIcon height={28} width={28} />
                          ) : null}
                        </View>
                        <View
                          style={{
                            marginBottom: item.greatfor.length > 0 ? 0 : 7,
                          }}
                        >
                          {item.greatfor.length > 0 ? (
                            <Text
                              size="description"
                              type="bold"
                              // style={{ marginLeft: 5 }}
                            >
                              {t("GreatFor") + " :"}
                            </Text>
                          ) : null}
                          <View
                            style={{
                              flexDirection: "row",
                              marginLeft: -5,
                            }}
                          >
                            {item.greatfor.length > 0
                              ? item.greatfor.map((item, index) => {
                                  return index < 3 ? (
                                    <FunIcon
                                      key={"grat" + index}
                                      icon={item.icon}
                                      fill="#464646"
                                      height={37}
                                      width={37}
                                    />
                                  ) : null;
                                })
                              : null}
                          </View>
                        </View>
                      </View>

                      <View
                        style={{
                          justifyContent: "flex-end",
                          width: 65,
                          paddingBottom: 5,
                          paddingRight: 5,
                          // height: 30,
                        }}
                      >
                        <Button
                          onPress={() => addToPlan(item)}
                          size="small"
                          text={"Add"}
                          style={{ height: 25 }}
                        />
                      </View>
                    </View>

                    {/* <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 50,
                        marginTop: 10,
                        alignItems: "flex-end",
                        borderWidth: 1,
                      }}
                    >
                      {data?.destinationById?.movie_location?.length > 0 ||
                      data?.destinationById?.type?.name
                        .toLowerCase()
                        .substr(0, 6) == "unesco" ? (
                        <View>
                          <Text>test</Text>
                        </View>
                      ) : null}
                      <View style={{ borderWidth: 1 }}>
                        <Text size="description" type="bold">
                          Great for :
                        </Text>
                        <View style={{ flexDirection: "row" }}>
                          {item.greatfor.length > 0 ? (
                            item.greatfor.map((item, index) => {
                              return index < 3 ? (
                                <FunIcon
                                  key={"grat" + index}
                                  icon={item.icon}
                                  fill="#464646"
                                  height={35}
                                  width={35}
                                />
                              ) : null;
                            })
                          ) : (
                            <Text>-</Text>
                          )}
                        </View>
                      </View>
                      <Button
                        onPress={() => addToPlan(item)}
                        size="small"
                        text={"Add"}
                        // style={{ marginTop: 15 }}
                      />
                    </View> */}
                  </View>
                </Pressable>
              ) : null
            )}
        </View>
      </View>
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
          paddingVertical: 10,
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
                  <View key={"artikel" + index}>
                    {i.type === "image" ? (
                      <View>
                        <View style={{ marginHorizontal: 5, marginBottom: 5 }}>
                          {i.title ? (
                            <Text
                              size="title"
                              type="bold"
                              style={{ textAlign: "left" }}
                            >
                              {i.title}
                            </Text>
                          ) : null}
                        </View>
                        <View
                          style={{
                            alignItems: "center",
                            marginBottom: 5,
                          }}
                        >
                          <FunImage
                            source={
                              i?.image ? { uri: i?.image } : default_image
                            }
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              borderColor: "#d3d3d3",

                              height: Dimensions.get("screen").width * 0.4,
                              width: "100%",
                            }}
                          />
                        </View>
                        <View style={{ marginHorizontal: 5, marginBottom: 15 }}>
                          <Text
                            size="description"
                            type="light"
                            style={{
                              textAlign: "left",
                              color: "#616161",
                            }}
                          >
                            {i.text ? i.text : ""}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View style={{ marginHorizontal: 5 }}>
                        {i.title ? (
                          <Text
                            size="title"
                            type="bold"
                            style={{
                              marginBottom: 5,
                              color: "#464646",
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}
                        <Text
                          size="title"
                          type="regular"
                          style={{
                            marginBottom: 15,
                            lineHeight: 22,
                            textAlign: "left",
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
            // borderBottomWidth: 1,
            // borderColor: "#d1d1d1",
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
                  // borderWidth: 1,
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  // borderBottomColor: index == tabIndex ? "#209fae" : "#FFFFFF",
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",
                  paddingHorizontal: 15,
                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 0.7,
                      // height: "100%",
                      borderBottomWidth: 0,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      // height: 35,
                      // paddingTop: 2,
                      // paddingLeft:
                      //   props.navigationState.routes.length < 2 ? 15 : null,
                      textTransform: "capitalize",
                      marginBottom: index == tabIndex ? 5 : 0,
                    },
                  ]}
                  size="h3"
                  type={index == tabIndex ? "bold" : "regular"}
                >
                  <Truncate
                    length="15"
                    text={item && item.key ? item.key : "-"}
                  />
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
    }, 3000);
  }),
    [];

  let [loadings, setLoadings] = useState(true);

  if (loading || loadings) {
    return <IndexSkeleton />;
  }

  if (loadings) {
    return <IndexSkeleton />;
  }

  return (
    <View style={styles.container}>
      <Satbar backgroundColor="#14646E" />
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          opacity: hides.current,
          flexDirection: "row",
          // justifyContent: "space-between",
          // borderWidth: 1,

          alignContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
          height: 55,
          width: Dimensions.get("screen").width - 40,
        }}
      >
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
          style={{
            height: 50,
            // marginLeft: 8,
          }}
        >
          <Animated.View
            style={{
              height: 35,
              width: 35,

              borderRadius: 30,
              backgroundColor: "rgba(0,0,0,0.5)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Platform.OS == "ios" ? (
              <Arrowbackios height={15} width={15}></Arrowbackios>
            ) : (
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            )}
          </Animated.View>
        </Button>
      </Animated.View>

      {/* jika scrollheader, animated show */}
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          opacity: hide.current,
          flexDirection: "row",
          // justifyContent: "space-between",
          // borderWidth: 1,
          alignContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
          height: 55,
          width: Dimensions.get("screen").width - 40,
        }}
      >
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => props.navigation.goBack()}
          style={{
            height: 50,
            // marginLeft: 8,
          }}
        >
          <Animated.View
            style={{
              height: 35,
              width: 35,

              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {Platform.OS == "ios" ? (
              <Arrowbackios height={15} width={15}></Arrowbackios>
            ) : (
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            )}
          </Animated.View>
        </Button>
        <Animated.Text
          // size="title"
          // type="bold"
          style={{
            opacity: hide.current,
            color: "#fff",
            marginLeft: 10,
            fontSize: 16,
            fontFamily: "Lato-Bold",
          }}
        >
          {data?.destinationById?.name}
        </Animated.Text>
      </Animated.View>

      {/* Button Like and Share*/}
      <Animated.View
        style={{
          position: "absolute",
          top:
            deviceId == "LYA-L29"
              ? normalize(layoutImage) + normalize(40)
              : normalize(layoutImage) + normalize(10),
          transform: [{ translateY: yButtonLikeShare }],
          right: 20,
          zIndex: 9999,
          opacity: hides.current,
          alignItems: "flex-end",
          justifyContent: "center",
          height: 55,
          // opacity: opacityButton,
          // opacity: opacityButtonLikeShare,
          // opacity: 0.5,
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            alignItems: "center",
            opacity: opacityButtonLikeShare,
            // opacity: opacityButton,
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
              <Love height={20} width={20} />
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
              <LikeEmpty height={20} width={20} />
            </Pressable>
          )}
          <TouchableOpacity
            onPress={() =>
              // shareAction({
              //   from: "destination",
              //   target: dataDestination.id,
              // })
              SetShareModal(true)
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
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* End Button Like and Share*/}

      {/* View SUb*/}
      <Animated.View
        style={{
          position: "absolute",
          marginTop:
            Platform.OS == "ios"
              ? Notch
                ? normalize(layoutImage) +
                  normalize(layoutHeader) +
                  normalize(layoutHeader) / normalize(4.3) +
                  normalize(layoutUnesco)
                : normalize(layoutImage) +
                  normalize(layoutHeader) +
                  normalize(layoutHeader) / normalize(3) +
                  normalize(layoutUnesco)
              : deviceId == "LYA-L29"
              ? normalize(layoutImage) +
                normalize(layoutHeader) +
                normalize(layoutUnesco) +
                normalize(50)
              : normalize(layoutImage) +
                normalize(layoutHeader) +
                normalize(layoutUnesco) +
                normalize(5),
          transform: [{ translateY: yButtonLikeShare }],
          zIndex: 100,
          opacity: hides.current,
          right: 20,
          width: Dimensions.get("screen").width / 8,
        }}
      >
        <Animated.View style={{ opacity: opacityButtonLikeShare }}>
          {data?.destinationById?.address ? (
            <Ripple
              style={{
                height: layoutsAddress,
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
              <Mapsborder
                height="25"
                width="25"
                style={{ marginVertical: 3 }}
              />
            </Ripple>
          ) : null}
        </Animated.View>

        {/* View Time */}

        <Animated.View style={{ opacity: opacityButtonLikeShare }}>
          {data?.destinationById?.openat ? (
            <Pressable
              onPress={() => setModalTime(true)}
              style={{
                height: layoutsOpen,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                size="description"
                type="regular"
                style={{
                  color: "#209FAE",
                  marginVertical: 8,
                }}
              >
                {t("more")}
              </Text>
            </Pressable>
          ) : null}
        </Animated.View>

        {/* View Website */}

        <Animated.View style={{ opacity: opacityButtonLikeShare }}>
          {data?.destinationById?.website ? (
            <Pressable
              onPress={() => setModalSosial(true)}
              style={{
                height: layoutsWeb,
                justifyContent: "center",
                alignItems: "center",
                // marginVertical: 5,
              }}
            >
              <Text
                size="description"
                type="regular"
                style={{
                  color: "#209FAE",
                  marginVertical: 8,
                }}
              >
                {t("more")}
              </Text>
            </Pressable>
          ) : null}
        </Animated.View>
      </Animated.View>

      {/* End BView SUb*/}

      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
      {/* BottomButton */}

      <BottomButton
        routed={_tabIndex.current}
        props={props}
        data={data?.destinationById}
        token={token}
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
      <ModalRN
        useNativeDriver={true}
        visible={modalTime}
        onRequestClose={() => setModalTime(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalTime(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 4,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: Dimensions.get("screen").width - 120,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 12, marginBottom: 15 }}
              >
                {t("OperationTime")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalTime(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 50,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <View style={{ marginHorizontal: 20 }}>
              {data && data.destinationById && data.destinationById.openat ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginBottom: 18, marginTop: 15 }}
                >
                  {data.destinationById.openat}
                </Text>
              ) : (
                <Text>-</Text>
              )}
            </View>
          </View>
        </View>
      </ModalRN>

      <ModalRN
        useNativeDriver={true}
        visible={modalSosial}
        onRequestClose={() => setModalSosial(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalSosial(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 4,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 5,
              width: Dimensions.get("screen").width - 120,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text
                size="title"
                type="bold"
                style={{ marginTop: 12, marginBottom: 15 }}
              >
                {t("information")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalSosial(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 50,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <Pressable
              onPress={() =>
                Linking.openURL(`tel:${data.destinationById.phone1}`)
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                paddingHorizontal: 20,
              }}
            >
              <TeleponHitam
                height={15}
                width={15}
                style={{ marginBottom: 18, marginTop: 15 }}
              />
              {data && data.destinationById && data.destinationById.phone1 ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginLeft: 10, marginBottom: 18, marginTop: 15 }}
                >
                  {data.destinationById.phone1}
                </Text>
              ) : (
                <Text style={{ marginLeft: 10 }}>-</Text>
              )}
            </Pressable>
            <Pressable
              onPress={async () => {
                const supported = await Linking.canOpenURL(
                  data.destinationById.website
                );
                if (supported) {
                  await Linking.openURL(`${data.destinationById.website}`);
                } else {
                  RNToasty.Show({
                    title: `Don't know how to open this URL: ${url}`,
                    position: "bottom",
                  });
                }
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                paddingHorizontal: 20,
                borderBottomWidth: 1,
              }}
            >
              <WebsiteHitam
                height={15}
                width={15}
                style={{ marginBottom: 18, marginTop: 15 }}
              />
              {data && data.destinationById && data.destinationById.website ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginLeft: 10, marginBottom: 18, marginTop: 15 }}
                >
                  {data.destinationById.website}
                </Text>
              ) : (
                <Text style={{ marginLeft: 10 }}>-</Text>
              )}
            </Pressable>
            <Pressable
              onPress={async () => {
                const supported = await Linking.canOpenURL(
                  data.destinationById.instagram
                );
                if (supported) {
                  await Linking.openURL(`${data.destinationById.instagram}`);
                } else {
                  RNToasty.Show({
                    title: `Don't know how to open this URL: ${data.destinationById.instagram}`,
                    position: "bottom",
                  });
                }
              }}
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                alignItems: "center",
              }}
            >
              <InstagramHitam
                height={15}
                width={15}
                style={{ marginBottom: 18, marginTop: 15 }}
              />
              {data &&
              data.destinationById &&
              data.destinationById.instagram ? (
                <Text
                  size="label"
                  type="reguler"
                  style={{ marginLeft: 10, marginBottom: 18, marginTop: 15 }}
                >
                  {data.destinationById.instagram}
                </Text>
              ) : (
                <Text style={{ marginLeft: 10 }}>-</Text>
              )}
            </Pressable>
          </View>
        </View>
      </ModalRN>

      {/* modal share */}
      <ModalRN
        useNativeDriver={true}
        visible={sharemodal}
        onRequestClose={() => SetShareModal(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => SetShareModal(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.8,
            borderWidth: 1,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              // paddingVertical: 10,
              // paddingHorizontal: 20,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              borderRadius: 5,
            }}
          >
            <Pressable
              onPress={() => SetShareModal(false)}
              style={{
                position: "absolute",
                right: 0,
                top: 0,
                height: 60,
                width: 60,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <View
              style={{
                paddingHorizontal: 20,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
            >
              <Text
                type="bold"
                size="title"
                style={{
                  marginBottom: 15,
                  marginTop: 12,
                }}
              >
                {t("share")}
              </Text>
              <Pressable
                onPress={() => SetShareModal(false)}
                style={{
                  position: "absolute",
                  right: 0,
                  width: 55,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 50,
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <TouchableOpacity
              style={{
                // paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                SetShareModal(false);
                props.navigation.navigate("SendDestination", {
                  destination: dataDestination,
                });
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  marginTop: 15,
                  marginBottom: 18,
                }}
              >
                {t("send_to")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                // paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                shareAction({
                  from: "destination",
                  target: dataDestination.id,
                });
                SetShareModal(false);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
              >
                {t("shareTo")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                CopyLink({
                  from: "destination",
                  target: dataDestination.id,
                });
                SetShareModal(false);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  marginTop: 15,
                  marginBottom: 18,
                }}
              >
                {t("copyLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalRN>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // header: {
  //   height: HeaderHeight,
  //   width: "100%",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   position: "absolute",
  //   backgroundColor: "#FFA088",
  // },
  //   label: { fontSize: 14, color: "#222" },
  indicator: { backgroundColor: "#209FAE" },
  label: { fontSize: 16, color: "#464646", fontFamily: "Lato-Regular" },
  labelActive: { fontSize: 16, color: "#209FAE", fontFamily: "Lato-Bold" },
});

export default Index;
