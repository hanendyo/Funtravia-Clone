import React, { useState, useEffect, useRef, useCallback } from "react";
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
  BackHandler,
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
  TeleponHitam,
  InstagramHitam,
  Xgray,
  Mapsborder,
  Arrowbackios,
} from "../../../assets/svg";
import { TabView } from "react-native-tab-view";
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
  ModalLogin,
  CardDestination,
} from "../../../component";
import DestinationById from "../../../graphQL/Query/Destination/DestinationById";
import ListDesAnother from "../../../graphQL/Query/Destination/ListDesAnother";
import { useMutation, useLazyQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { default_image } from "../../../assets/png";
import normalize from "react-native-normalize";
const deviceId = DeviceInfo.getModel();

let PullToRefreshDist = 150;
import { useSelector } from "react-redux";

const Index = (props) => {
  const NotchAndro = StatusBar.currentHeight > 24;
  const { t } = useTranslation();
  let tokenApps = useSelector((data) => data.token);
  const [modalLogin, setModalLogin] = useState(false);
  let AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
  let { width, height } = Dimensions.get("screen");
  let Notch = DeviceInfo.hasNotch();
  let TabBarHeight = Platform.select({
    ios: Notch ? 40 : 40,
    android: 40,
  });

  // dinamis height tambahan header
  let [HeightJudul, setHeightJudul] = useState(0);
  let [Heightunesco, setHeightUnesco] = useState(0);
  let [HeightAddress, setHeightAddress] = useState(0);
  let [HeightTime, setHeightTime] = useState(0);
  let [HeightWeb, setHeightWeb] = useState(0);

  const HeaderHeight = Platform.select({
    ios: Notch
      ? normalize(198) +
        HeightJudul +
        Heightunesco +
        HeightAddress +
        HeightTime +
        HeightWeb -
        20
      : normalize(215) +
        HeightJudul +
        Heightunesco +
        HeightAddress +
        HeightTime +
        HeightWeb -
        20,

    android:
      deviceId == "LYA-L29"
        ? normalize(235) +
          HeightJudul +
          Heightunesco +
          HeightAddress +
          HeightTime +
          HeightWeb -
          StatusBar.currentHeight
        : deviceId == "CPH2127"
        ? normalize(215) +
          HeightJudul +
          Heightunesco +
          HeightAddress +
          HeightTime +
          HeightWeb -
          StatusBar.currentHeight
        : NotchAndro
        ? normalize(210) +
          HeightJudul +
          Heightunesco +
          HeightAddress +
          HeightTime +
          HeightWeb -
          StatusBar.currentHeight
        : normalize(198) +
          HeightJudul +
          Heightunesco +
          HeightAddress +
          HeightTime +
          HeightWeb -
          StatusBar.currentHeight,
  });

  let SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: StatusBar.currentHeight,
  });

  let [newHeight, setNewHeight] = useState(0);
  let scrollRef = useRef();

  const [tabIndex, setIndex] = useState(
    props?.route?.params?.indexscroll ? props?.route.params.indexscroll : 0
  );

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
  // let [dataDestination, setDataDestination] = useState(data);
  let [dataDestination, setDataDestination] = useState();
  let [more, setMore] = useState(false);
  let [lines, setLines] = useState(3);
  let [dataAnother, setDataAnother] = useState({});
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);
  const layoutText = (e) => {
    setMore(e.nativeEvent.lines.length > 3 && lines == 0);
  };

  const [fetchData, { data, loading, error }] = useLazyQuery(DestinationById, {
    variables: { id: props.route.params.id },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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

      setDataDestination(data?.destinationById);
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
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setAnotherDes(dataDesAnother?.destination_another_place);
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
    await fetchData();
    await fetchDataAnotherDes();
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
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
  });

  const _liked = async (id) => {
    if (tokenApps) {
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
        // if (loadingLike) {
        //   alert("Loading!!");
        // }
        // if (errorLike) {
        //   throw new Error("Error Input");
        // }
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
      setModalLogin(true);
    }
  };

  const _unliked = async (id) => {
    if (tokenApps) {
      var tempData = { ...dataDestination };
      tempData.liked = false;
      setDataDestination(tempData);
      try {
        let response = await mutationUnliked({
          variables: {
            destination_id: id,
          },
        });
        // if (loadingUnLike) {
        //   alert("Loading!!");
        // }
        // if (errorUnLike) {
        //   throw new Error("Error Input");
        // }
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
      setModalLogin(true);
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
          <TouchableOpacity
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
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            // onPress={() =>
            //   shareAction({
            //     from: "destination",
            //     target: dataDestination.id,
            //   })
            // }
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
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() =>
            tokenApps
              ? // shareAction({
                //   from: "destination",
                //   target: dataDestination.id,
                // })
                SetShareModal(true)
              : setModalLogin(true)
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

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const activeTouches = evt.nativeEvent.changedTouches.length;
        if (activeTouches === 1) {
          pan.setValue({ y: gestureState.dy });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {},
    })
  ).current;

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
          backgroundColor: "#209fae",
        }}
      >
        <Animated.Image
          style={{
            width: "100%",
            height: 200,
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
          source={
            dataDestination?.cover
              ? { uri: dataDestination?.cover }
              : default_image
          }
        />
        <Animated.View
          style={{
            width: Dimensions.get("screen").width,
            backgroundColor: "#FFFFFF",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
        >
          {/* Judul dan bintang review */}
          <View
            onLayout={(event) => {
              let { x, y, width, height } = event.nativeEvent.layout;

              setHeightJudul(height);
            }}
            style={{
              paddingHorizontal: 15,
              paddingTop: 15,
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
                  {dataDestination?.name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <View
                  style={{
                    borderRadius: 3,
                    backgroundColor: "#F4F4F4",

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
                    {dataDestination?.type?.name}
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
                    {dataDestination?.rating.substr(0, 3)}
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
                    {dataDestination?.count_review} {t("reviews")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* type movie unesco */}
          {dataDestination?.movie_location?.length > 0 ||
          dataDestination?.type?.name.toLowerCase().substr(0, 6) == "unesco" ? (
            <View
              onLayout={(event) => {
                let { x, y, width, height } = event.nativeEvent.layout;
                setHeightUnesco(height);
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
              {dataDestination &&
              dataDestination?.type?.name.toLowerCase().substr(0, 6) ==
                "unesco" ? (
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
                  <UnescoIcon
                    height={27}
                    width={27}
                    style={{ marginRight: 5 }}
                  />
                  <Text size="description" type="regular">
                    UNESCO
                  </Text>
                </View>
              ) : null}
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
                    {t(`MovieLocation`)}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : (
            <View
              onLayout={(event) => {
                let { x, y, width, height } = event.nativeEvent.layout;
                setHeightUnesco(height);
              }}
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
              let { x, y, width, height } = event.nativeEvent.layout;

              setHeightAddress(height);
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
                  size="label"
                  type="regular"
                  style={{ lineHeight: 18 }}
                  numberOfLines={2}
                >
                  {dataDestination?.address ? dataDestination?.address : "-"}
                </Text>
              </View>
            </View>
          </View>
          {/* View Time */}
          <View
            onLayout={(event) => {
              let { x, y, width, height } = event.nativeEvent.layout;

              setHeightTime(height);
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
                >
                  {dataDestination?.openat ? dataDestination?.openat : "-"}
                </Text>
              </View>
            </View>
          </View>
          {/* View Website */}
          <View
            onLayout={(event) => {
              let { x, y, width, height } = event.nativeEvent.layout;

              setHeightWeb(height);
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
                >
                  {dataDestination?.website &&
                  dataDestination.website !== "null"
                    ? dataDestination?.website
                    : "-"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", hardwareBack);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", hardwareBack);
    };
  }, [props.navigation, hardwareBack]);

  const hardwareBack = useCallback(() => {
    props.navigation.goBack();
    return true;
  }, []);

  const addToPlan = (kiriman) => {
    if (tokenApps) {
      if (kiriman) {
        props?.route?.params && props?.route?.params?.iditinerary
          ? props.navigation.dispatch(
              StackActions.replace("ItineraryStack", {
                screen: "ItineraryChooseday",
                params: {
                  Iditinerary: props?.route?.params?.iditinerary,
                  Kiriman: kiriman.id,
                  token: tokenApps,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                  parent: props.route.params?.parent,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: kiriman.id,
                Position: "destination",
                data_from: props.route.params?.parent ?? "detail_destination",
                token: tokenApps,
                parent: props.route.params?.parent,
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
                  token: tokenApps,
                  Position: "destination",
                  datadayaktif: props.route.params.datadayaktif,
                  parent: props.route.params?.parent,
                },
              })
            )
          : props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPlaning",
              params: {
                idkiriman: data?.destinationById?.id,
                Position: "destination",
                data_from: props.route.params?.parent ?? "detail_destination",
                token: tokenApps,
                parent: props.route.params?.parent,
              },
            });
      }
    } else {
      setModalLogin(true);
    }
  };

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
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
  });

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
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, 55],
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          transform: [{ translateY: y }],
        }}
      >
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
              size="label"
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
                size="label"
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
                size="label"
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
                          token: tokenApps,
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
          <CardDestination
            data={anotherDes}
            props={props}
            setData={(e) => setAnotherDes(e)}
            token={tokenApps}
            dataFrom="detail_destination"
            dataFromId={dataDestination?.id}
          />
        </View>
      </Animated.View>
    );
  };

  const renderReview = ({ item, props }) => {
    return (
      <Reviews
        id={item?.id}
        props={props}
        HeaderHeight={HeaderHeight}
        token={tokenApps}
      />
    );
  };

  const renderArticle = (e, dataA) => {
    let render = [];
    render = dataA;
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, 55],
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: HEADER_MIN_HEIGHT,
          transform: [{ translateY: y }],
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
      </Animated.View>
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
          }}
          renderItem={({ item, index }) => (
            <Ripple
              key={"tabx" + index}
              onPress={() => {
                setIndex(index);
                scrollRef.current?.scrollToIndex({
                  index: index,
                  animated: true,
                });
              }}
            >
              <View
                style={{
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",

                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingHorizontal: Platform.OS === "ios" ? 15 : null,
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 1,
                      borderBottomWidth: 0,
                      // borderWidth: 1,
                      marginBottom: index == tabIndex ? 0 : 1,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  <Truncate
                    text={item?.key ? item.key : ""}
                    length={Platform.OS === "ios" ? 13 : 15}
                  />
                </Text>
              </View>
            </Ripple>
          )}
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
    }, 2900);
  }),
    [];

  let [loadings, setLoadings] = useState(true);

  // if (loadings) {
  //   return <IndexSkeleton />;
  // }

  return (
    <View style={styles.container}>
      {loadings ? (
        <View
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            position: "absolute",
            backgroundColor: "#FFF",
            zIndex: 1000000,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#209fae" />
        </View>
      ) : null}
      <Satbar backgroundColor="#14646E" />
      <ModalLogin
        modalLogin={modalLogin}
        setModalLogin={() => setModalLogin(false)}
        props={props}
      />
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
        <Text
          size="header"
          type="bold"
          style={{
            flex: 1,
            // opacity: hide.current,
            color: "#fff",
            marginLeft: 10,
            // fontSize: 20,
            // fontFamily: "Lato-Bold",
          }}
        >
          {dataDestination?.name}
        </Text>
      </Animated.View>
      {/* Button Like and Share*/}
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar + 200 + HeightJudul / 4,
          right: 20,
          zIndex: 9999,
          alignItems: "flex-end",
          transform: [{ translateY: yButtonLikeShare }],
          opacity: hides.current,
          height: 55,
        }}
      >
        <Animated.View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {dataDestination?.liked === true ? (
            <TouchableOpacity
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
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // onPress={() =>
              //   shareAction({
              //     from: "destination",
              //     target: dataDestination.id,
              //   })
              // }
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
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() =>
              // shareAction({
              //   from: "destination",
              //   target: dataDestination.id,
              // })
              tokenApps ? SetShareModal(true) : setModalLogin(true)
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
      {/* location icon */}
      {HeightAddress > 0 ? (
        <Animated.View
          style={{
            position: "absolute",
            top:
              SafeStatusBar +
              200 +
              HeightJudul +
              Heightunesco +
              HeightAddress / 10,
            zIndex: 100,
            transform: [{ translateY: yButtonLikeShare }],
            opacity: hides.current,
            right: 20,
            alignItems: "flex-end",
            width: Dimensions.get("screen").width / 8,
          }}
        >
          <Animated.View>
            {data?.destinationById?.address ? (
              <Ripple
                style={{
                  height: layoutsAddress,
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  height: "100%",
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
        </Animated.View>
      ) : null}
      {HeightTime > 0 ? (
        <Animated.View
          style={{
            position: "absolute",
            top:
              SafeStatusBar +
              200 +
              HeightJudul +
              Heightunesco +
              HeightAddress +
              HeightTime / 20,
            transform: [{ translateY: yButtonLikeShare }],
            zIndex: 100,
            opacity: hides.current,
            right: 20,
            alignItems: "flex-end",
            width: Dimensions.get("screen").width / 8,
          }}
        >
          <Animated.View>
            {data?.destinationById?.openat ? (
              <Pressable
                onPress={() => setModalTime(true)}
                style={{
                  height: layoutsOpen,
                  justifyContent: "center",
                  alignItems: "center",
                  // borderWidth: 1,
                  height: "100%",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: "#209FAE",
                    // borderWidth: 1,
                    marginVertical: 8,
                  }}
                >
                  {t("more")}
                </Text>
              </Pressable>
            ) : null}
          </Animated.View>
        </Animated.View>
      ) : null}

      {HeightWeb > 0 ? (
        <Animated.View
          style={{
            position: "absolute",
            top:
              SafeStatusBar +
              200 +
              HeightJudul +
              Heightunesco +
              HeightAddress +
              HeightTime +
              HeightWeb / 15,
            transform: [{ translateY: yButtonLikeShare }],
            zIndex: 100,
            opacity: hides.current,
            right: 20,
            alignItems: "flex-end",
            width: Dimensions.get("screen").width / 8,
          }}
        >
          <Animated.View>
            {data?.destinationById?.website ? (
              <Pressable
                onPress={() => setModalSosial(true)}
                style={{
                  height: layoutsWeb,
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
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
      ) : null}

      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
      {/* BottomButton */}
      {!loadings ? (
        <BottomButton
          routed={tabIndex}
          props={props}
          data={data?.destinationById}
          token={tokenApps}
          addTo={addToPlan}
        />
      ) : null}

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
            marginTop: Dimensions.get("screen").height / 3,
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
                  type="regular"
                  style={{ marginBottom: 18, marginTop: 15 }}
                >
                  {data?.destinationById?.openat}
                </Text>
              ) : (
                <Text>-</Text>
              )}
            </View>
          </View>
        </View>
      </ModalRN>
      {/* End Modal Time */}

      {/* End Modal Website */}

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
            marginTop: Dimensions.get("screen").height / 3,
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
              {data &&
              data.destinationById &&
              data.destinationById.phone1 &&
              data.destinationById.phone1 !== "null" ? (
                <Text
                  size="label"
                  type="regular"
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
              {data &&
              data.destinationById &&
              data.destinationById.website &&
              data.destinationById.website !== "null" ? (
                <Text
                  size="label"
                  type="regular"
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
              data.destinationById.instagram &&
              data.destinationById.instagram !== "null" ? (
                <Text
                  size="label"
                  type="regular"
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
      {/* End Modal Website */}

      {/* Modal Share */}
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
                // props.navigation.navigate("SendDestination", {
                //   destination: dataDestination,
                // });
                props.navigation.navigate("ChatStack", {
                  screen: "SendToChat",
                  params: {
                    dataSend: {
                      id: dataDestination?.id,
                      cover: dataDestination?.cover,
                      name: dataDestination?.name,
                      description: dataDestination?.description,
                      rating: dataDestination?.rating,
                      destination_type: dataDestination?.destination_type,
                      cities: dataDestination?.cities,
                      images: dataDestination?.images,
                    },
                    title: t("destination"),
                    tag_type: "tag_destination",
                  },
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
                {t("send_to")}...
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
                {t("shareTo")}...
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
                  success: t("successCopyLink"),
                  failed: t("failedCopyLink"),
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

      {/* Modal Share */}
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
  label: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Regular",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
});

export default Index;
