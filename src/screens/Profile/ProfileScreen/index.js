import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  Pressable,
  Modal as ModalRN,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  Button,
  Sidebar,
  StatusBar as StaBar,
  Text,
  shareAction,
  ModalLogin,
  // CardItinerary,
} from "../../../component";
import {
  Akunsaya,
  default_image,
  DefaultProfileSquare,
} from "../../../assets/png";
import Account from "../../../graphQL/Query/Profile/Other";
import User_Post from "../../../graphQL/Query/Profile/otherpost";
import album_post from "../../../graphQL/Query/Profile/albumPost";
import Reviews from "../../../graphQL/Query/Profile/otherreview";
import Itinerary from "../../../graphQL/Query/Profile/otheritinerary";
import Itinerary2 from "../../../graphQL/Query/Profile/itinerary";
import { useTranslation } from "react-i18next";
import { Bg_soon } from "../../../assets/png";
import {
  Album,
  Allpost,
  Allpostgreen,
  Arrowbackios,
  Arrowbackwhite,
  Google,
  Message,
  OptionsVertWhite,
  PostGreen,
  PostGray,
  SendMessage,
  Sharegreen,
  Tag,
  Taggreen,
  AlbumGray,
  AlbumGreen,
} from "../../../assets/svg";
import Post from "./Posting/Post";
import Albums from "./Posting/Album";
import Tags from "./Posting/Tag";
import Review from "./Review";
import CardItinerary from "../../../component/src/CardItinerary";
import Trip from "./Trip";
import ImageSlide from "../../../component/src/ImageSlide/sliderwithoutlist";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../../graphQL/Mutation/Profile/UnfollowMut";
import DeviceInfo from "react-native-device-info";
import { RNToasty } from "react-native-toasty";
import ListFotoAlbum from "../../../graphQL/Query/Itinerary/ListAlbum";
import ListFotoAlbumAll from "../../../graphQL/Query/Itinerary/ListAlbumAll";
import Ripple from "react-native-material-ripple";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
// const Notch = DeviceInfo.hasNotch();
// const SafeStatusBar = Platform.select({
//   ios: Notch ? 48 : 20,
//   android: StatusBar.currentHeight,
// });

// const HeaderHeight = 310 - SafeStatusBar + 100;
// const HeaderHeight = 310 - SafeStatusBar + 55;
const PullToRefreshDist = 150;

export default function OtherProfile(props) {
  let capHeight = useRef();

  const Notch = DeviceInfo.hasNotch();
  const SafeStatusBar = Platform.select({
    ios: Notch ? 48 : 20,
    android: StatusBar.currentHeight,
  });
  const [captionHeight, setCaptionHeight] = useState(0);
  const HeaderHeight = 310 - SafeStatusBar + 55;

  const { t } = useTranslation();
  let [soon, setSoon] = useState(false);
  let [modalLogin, setModalLogin] = useState(false);
  let [showside, setshowside] = useState(false);
  let [token, setToken] = useState(null);
  let [setting, setSetting] = useState("");
  const [dataPost, setdataPost] = useState([]);
  const [dataalbums, setdataalbums] = useState([]);
  const [dataReview, setdataReview] = useState([]);
  const [dataTrip, setdataTrip] = useState([]);
  let [users, setuser] = useState(null);
  let [id, seID] = useState(props.route.params.idUser);
  let [position, setposition] = useState(false);
  const captionHeightCalculation = (value) => {
    if (value <= 18) {
      return setCaptionHeight(10);
    } else if (value >= 19 && value <= 20) {
      return setCaptionHeight(20);
    } else if (value <= 35) {
      return setCaptionHeight(30);
    } else if (value >= 36 && value <= 40) {
      return setCaptionHeight(40);
    } else if (value <= 50) {
      return setCaptionHeight(50);
    } else if (value >= 51 && value <= 60) {
      return setCaptionHeight(60);
    } else if (value <= 66) {
      return setCaptionHeight(70);
    } else if (value >= 70 && value <= 80) {
      return setCaptionHeight(80);
    } else {
      return setCaptionHeight(90);
    }
  };

  const loadAsync = async () => {
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    await setuser(user?.user);

    if (!props.route.params.idUser) {
      await seID(user?.user?.id);

      await props.navigation.setParams({ idUser: user?.user?.id });
      setposition("profile");
    } else {
      if (props.route.params.idUser === user?.user?.id) {
        await seID(user?.user?.id);

        setposition("profile");
      } else {
        await seID(props.route.params.idUser);

        setposition("other");
      }
    }

    let tkn = await AsyncStorage.getItem("access_token");
    if (tkn === null) {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }

    await setToken(tkn);

    let settingData = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(settingData));

    await LoadUserProfile();
    await _refresh();
  };

  const [
    Getdatapost,
    { data: dataposting, loading: loadingpost, error: errorpost },
  ] = useLazyQuery(User_Post, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    variables: {
      id: id,
    },
    onCompleted: () => {
      setdataPost(spreadData(dataposting.user_postbyid));
    },
  });

  // const [
  //   Getdataalbum,
  //   { data: dataalbum, loading: loadingalbum, error: erroralbum },
  // ] = useLazyQuery(album_post, {
  //   fetchPolicy: "network-only",
  //   context: {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: token?`Bearer ${token}`:null,
  //     },
  //   },
  //   variables: {
  //     limit: 50,
  //     offset: 0,
  //     user_id: id,
  //     // user_id: props.route.params,
  //   },
  //   onCompleted: () => {
  //     setdataalbums(dataalbum.user_post_album_v2?.datas);
  //   },
  // });

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const [
    mutationUnliked,
    { loading: loadingUnLike, data: dataUnLike, error: errorUnLike },
  ] = useMutation(ItineraryUnliked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const [
    QueryFotoAlbum,
    { data: dataFotoAlbum, loading: loadingFotoAlbum, error: errorFotoAlbum },
  ] = useLazyQuery(ListFotoAlbumAll, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    variables: { user_id: props.route.params.idUser, keyword: "" },
    onCompleted: () => {
      setdataalbums(dataFotoAlbum?.list_all_albums);
    },
  });

  const [
    LoadReview,
    { data: datareview, loading: loadingreview, error: errorreview },
  ] = useLazyQuery(Reviews, {
    fetchPolicy: "network-only",
    variables: {
      id: id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    onCompleted: () => {
      setdataReview(datareview.user_reviewbyid);
    },
  });

  const [
    LoadTrip,
    {
      data: datatrip,
      loading: loadingtrip,
      error: errortrip,
      refetch: _refresh,
    },
  ] = useLazyQuery(Itinerary, {
    fetchPolicy: "network-only",
    variables: {
      id: id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    onCompleted: () => {
      setdataTrip(datatrip.user_tripbyid);
    },
  });

  const [
    LoadTrip2,
    { data: datatripX, loading: loadingtripX, error: errortripX },
  ] = useLazyQuery(Itinerary2, {
    fetchPolicy: "network-only",
    variables: {
      id: id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
    onCompleted: () => {
      setdataTrip(datatripX.user_trip);
    },
  });

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    let grid = 1;
    for (let val of data) {
      if (count < 3) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
        tmpArray.push({ grid: grid });
        grid++;
        if (grid == 4) {
          grid = 1;
        }
        tmpData.push(tmpArray);
        count = 1;
        tmpArray = [];
      }
    }
    if (tmpArray.length) {
      tmpData.push(tmpArray);
    }

    return tmpData;
  };

  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const [
    UnfollowMutation,
    { loading: loadUnfolMut, data: dataUnfolMut, error: errorUnfolMut },
  ] = useMutation(UnfollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : null,
      },
    },
  });

  const _unfollow = async (id) => {
    if (token || token !== "") {
      try {
        let response = await UnfollowMutation({
          variables: {
            id: id,
          },
        });

        if (errorUnfolMut) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.unfollow_user.code === 200 ||
            response.data.unfollow_user.code === "200"
          ) {
            loadAsync();
          } else {
            throw new Error(response.data.unfollow_user.message);
          }
        }
      } catch (error) {
        Alert.alert(t("somethingwrong"));
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _follow = async (id) => {
    if (token || token !== "") {
      try {
        let response = await FollowMutation({
          variables: {
            id: id,
          },
        });

        if (errorFollowMut) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.follow_user.code === 200 ||
            response.data.follow_user.code === "200"
          ) {
            loadAsync();
          } else {
            throw new Error(response.data.follow_user.message);
          }
        }
      } catch (error) {
        Alert.alert(t("somethingwrong"));
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _handlemessage = async (id, tokens) => {
    try {
      let response = await fetch(
        "https://scf.funtravia.com/api/personal/chat?receiver_id=" + id,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + tokens,
            "Content-Type": "application/json",
          },
          // body: formBodys,
        }
      );

      let responseJson = await response.json();

      if (responseJson) {
        if (responseJson.sender_id === users.id) {
          props.navigation.push("ChatStack", {
            screen: "RoomChat",
            params: {
              room_id: responseJson.id,
              receiver: responseJson.receiver.id,
              name:
                responseJson.receiver.first_name +
                " " +
                (responseJson.receiver.last_name
                  ? responseJson.receiver.last_name
                  : ""),
              picture: responseJson.receiver.picture,
            },
          });
        } else {
          props.navigation.push("ChatStack", {
            screen: "RoomChat",
            params: {
              room_id: responseJson.id,
              receiver: responseJson.sender.id,
              name:
                responseJson.sender.first_name +
                " " +
                (responseJson.sender.last_name
                  ? responseJson.sender.last_name
                  : ""),
              picture: responseJson.sender.picture,
            },
          });
        }
      }
    } catch (error) {}
  };

  const [tabThree, setTabThree] = useState(0);
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: t("profilePost") },
    { key: "tab2", title: t("review") },
    { key: "tab3", title: t("trip") },
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
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
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageOpacitys = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0, 0],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const imageTranslates = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 55 + SafeStatusBar],
    extrapolate: "clamp",
  });

  const imageTranslatesA = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 55 + SafeStatusBar + 15],
    extrapolate: "clamp",
  });

  const imageTrans = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.4],
    extrapolate: "clamp",
  });

  const imageTr = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [-width / 2 + 65, -width / 2 + 80],
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
  let hide2 = React.useRef(
    scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 1],
      extrapolate: "clamp",
    })
  );
  let hide0 = React.useRef(
    scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 1],
      extrapolate: "clamp",
    })
  );

  // const HeaderComponent = {
  //   headerShown: true,
  //   title: "",
  //   headerTransparent: true,
  //   headerTintColor: "white",
  //   headerTitle: "",
  //   headerMode: "screen",
  //   headerStyle: {
  //     backgroundColor: "#209FAE",
  //     elevation: 0,
  //     borderBottomWidth: 0,
  //   },
  //   headerTitleStyle: {
  //     fontFamily: "Lato-Bold",
  //     fontSize: 14,
  //     color: "white",
  //     alignSelf: "center",
  //     // paddingLeft: Platform.select({
  //     //   // ios: 44,
  //     //   ios: 0,
  //     //   android: 40,
  //     // }),
  //   },
  //   headerLeftContainerStyle: {
  //     background: "#FFF",

  //     marginLeft: 10,
  //   },
  //   headerLeft: () => (
  //     <View>
  //       <Button
  //         text={""}
  //         size="medium"
  //         type="circle"
  //         variant="transparent"
  //         onPress={() => props.navigation.goBack()}
  //         style={{
  //           height: 55,
  //         }}
  //       >
  //         <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
  //       </Button>
  //     </View>
  //   ),

  //   headerRight: () =>
  //     position && position === "other" ? (
  //       <Ripple
  //         onPress={() => _handlemessage(props.route.params.idUser, token)}
  //         text={""}
  //         size="medium"
  //         type="circle"
  //         variant="transparent"
  //         style={{
  //           zIndex: 99999999,
  //           height: 50,
  //           width: 50,
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}
  //       >
  //         <Message height={20} width={20}></Message>
  //       </Ripple>
  //     ) : null,
  // };

  useEffect(() => {
    QueryFotoAlbum();
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      loadAsync();
    });

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
      unsubscribe;
    };
  }, [routes, tabIndex, props.navigation]);

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
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
    loadAsync();
    refreshStatusRef.current = true;
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      refreshStatusRef.current = false;
    });
  };

  const renderHeader = (datas) => {
    let data = { ...datas };
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [
        0,
        -HeaderHeight +
          (captionHeight == 10
            ? Platform.OS === "ios"
              ? Notch
                ? 45
                : 65
              : 75
            : captionHeight == 20
            ? Platform.OS === "ios"
              ? Notch
                ? 5
                : 55
              : 15
            : captionHeight == 30
            ? Platform.OS === "ios"
              ? Notch
                ? 55
                : 55
              : 35
            : captionHeight == 40
            ? Platform.OS === "ios"
              ? Notch
                ? -5
                : 55
              : 10
            : captionHeight == 50
            ? Platform.OS === "ios"
              ? Notch
                ? 55
                : 55
              : 35
            : captionHeight == 60
            ? Platform.OS === "ios"
              ? Notch
                ? -25
                : 35
              : -15
            : captionHeight == 70
            ? Platform.OS === "ios"
              ? Notch
                ? 55
                : 55
              : 20
            : captionHeight == 80
            ? Platform.OS === "ios"
              ? Notch
                ? -35
                : 55
              : -30
            : captionHeight == 90
            ? Platform.OS === "ios"
              ? Notch
                ? -75
                : 21
              : -40
            : HeaderHeight),
      ],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        // onLayout={() => {
        //   props.navigation.setOptions(HeaderComponent);
        // }}
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          top: SafeStatusBar,
          // height:
          //   Platform.OS === "ios"
          //     ? Notch
          //       ? HeaderHeight
          //       : HeaderHeight - 40
          //     : HeaderHeight + 20,
          height:
            captionHeight == 10
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight
                  : HeaderHeight - 20
                : HeaderHeight - 20
              : captionHeight == 20
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 40
                  : HeaderHeight
                : HeaderHeight + 40
              : captionHeight == 30
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight
                  : HeaderHeight - 10
                : HeaderHeight + 20
              : captionHeight == 40
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 50
                  : HeaderHeight
                : HeaderHeight + 50
              : captionHeight == 50
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 40
                  : HeaderHeight
                : HeaderHeight + 20
              : captionHeight == 60
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 70
                  : HeaderHeight + 10
                : HeaderHeight + 70
              : captionHeight == 70
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 20
                  : HeaderHeight
                : HeaderHeight + 40
              : captionHeight == 80
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 80
                  : HeaderHeight
                : HeaderHeight + 90
              : captionHeight == 90
              ? Platform.OS === "ios"
                ? Notch
                  ? HeaderHeight + 120
                  : HeaderHeight + 20
                : HeaderHeight + 100
              : HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          // borderWidth: 2,
          position: "absolute",
          backgroundColor: "#209fae",
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            height:
              captionHeight == 10
                ? Platform.OS === "ios"
                  ? Notch
                    ? "87%"
                    : "90%"
                  : "85%"
                : captionHeight == 20
                ? Platform.OS === "ios"
                  ? Notch
                    ? "92%"
                    : "85%"
                  : "90%"
                : captionHeight == 30
                ? Platform.OS === "ios"
                  ? Notch
                    ? "85%"
                    : "90%"
                  : "85%"
                : captionHeight == 40
                ? Platform.OS === "ios"
                  ? Notch
                    ? "90%"
                    : "85%"
                  : "86%"
                : captionHeight == 50
                ? Platform.OS === "ios"
                  ? Notch
                    ? "85%"
                    : "85%"
                  : "85%"
                : captionHeight == 60
                ? Platform.OS === "ios"
                  ? Notch
                    ? "90%"
                    : "90%"
                  : "90%"
                : captionHeight == 70
                ? Platform.OS === "ios"
                  ? Notch
                    ? "85%"
                    : "85%"
                  : "85%"
                : captionHeight == 80
                ? Platform.OS === "ios"
                  ? Notch
                    ? "88%"
                    : "85%"
                  : "90%"
                : captionHeight == 90
                ? Platform.OS === "ios"
                  ? Notch
                    ? "90%"
                    : "88%"
                  : "87%"
                : "85%",
            backgroundColor: "#fff",
            opacity: imageOpacity,
            // borderWidth: 1,
            justifyContent: "center",
            paddingTop:
              captionHeight == 10
                ? Platform.OS === "ios"
                  ? Notch
                    ? "10%"
                    : "6%"
                  : "5%"
                : captionHeight == 20
                ? Platform.OS === "ios"
                  ? Notch
                    ? "3%"
                    : "5%"
                  : "2%"
                : captionHeight == 30
                ? Platform.OS === "ios"
                  ? Notch
                    ? "40%"
                    : "5%"
                  : "7%"
                : captionHeight == 40
                ? Platform.OS === "ios"
                  ? Notch
                    ? "5%"
                    : "10%"
                  : "8%"
                : captionHeight == 50
                ? Platform.OS === "ios"
                  ? Notch
                    ? "8%"
                    : "8%"
                  : "5%"
                : captionHeight == 60
                ? Platform.OS === "ios"
                  ? Notch
                    ? "5%"
                    : "5%"
                  : "5%"
                : captionHeight == 70
                ? Platform.OS === "ios"
                  ? Notch
                    ? "8%"
                    : "8%"
                  : "5%"
                : captionHeight == 80
                ? Platform.OS === "ios"
                  ? Notch
                    ? "5%"
                    : "5%"
                  : "0%"
                : captionHeight == 90
                ? Platform.OS === "ios"
                  ? Notch
                    ? "2%"
                    : "5%"
                  : "5%"
                : "5%",
            marginTop:
              captionHeight == 10
                ? Platform.OS === "ios"
                  ? Notch
                    ? "11%"
                    : "15%"
                  : "15%"
                : captionHeight == 20
                ? Platform.OS === "ios"
                  ? Notch
                    ? "15%"
                    : "40%"
                  : "18%"
                : captionHeight == 30
                ? Platform.OS === "ios"
                  ? Notch
                    ? "40%"
                    : "15%"
                  : "15%"
                : captionHeight == 40
                ? Platform.OS === "ios"
                  ? Notch
                    ? "13%"
                    : "10%"
                  : "13%"
                : captionHeight == 50
                ? Platform.OS === "ios"
                  ? Notch
                    ? "40%"
                    : "40%"
                  : "15%"
                : captionHeight == 60
                ? Platform.OS === "ios"
                  ? Notch
                    ? "12%"
                    : "15%"
                  : "17%"
                : captionHeight == 70
                ? Platform.OS === "ios"
                  ? Notch
                    ? "40%"
                    : "40%"
                  : "15%"
                : captionHeight == 80
                ? Platform.OS === "ios"
                  ? Notch
                    ? "13%"
                    : "6%"
                  : "15%"
                : captionHeight == 90
                ? Platform.OS === "ios"
                  ? Notch
                    ? "11%"
                    : "12%"
                  : "16%"
                : "15%",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              top: 0,

              // position: "absolute",
              // top: "32%",
              zIndex: 1,
              // borderWidth: 1,
              paddingHorizontal: 20,
              // paddingTop: 60,
            }}
          >
            {data.picture ? (
              <Animated.Image
                source={
                  data.picture ? { uri: data.picture } : DefaultProfileSquare
                }
                style={{
                  alignSelf: "center",
                  width: width / 3.8,
                  height: width / 3.8,
                  borderRadius: width / 6,
                  borderWidth: 2,
                  borderColor: "#FFF",
                  // position: "absolute",
                  top: data.bio == null ? 0 : 5,
                  zIndex: 1,
                  opacity: imageOpacitys,
                  transform: [
                    // {
                    //   translateY: Platform.select({
                    //     // ios: 48,
                    //     ios: imageTranslates,
                    //     android: imageTranslatesA,
                    //   }),
                    // },
                    // { translateX: imageTr },
                    { scale: imageTrans },
                  ],
                }}
              />
            ) : (
              <View
                style={{
                  width: width / 4,
                  height: width / 4,
                }}
              ></View>
            )}
          </View>

          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginTop: 10,

              // paddingTop: 30,
            }}
          >
            <Animated.View
              style={{
                width: "100%",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                alignSelf: "center",
                opacity: opacityfrom1,
              }}
            >
              <Text type="bold" size="title" style={{ marginRight: 10 }}>
                {`${data.first_name ? data.first_name : ""} ` +
                  `${data.last_name ? data.last_name : ""}`}
              </Text>
              <Text type="regular" size="label">{`${
                data.username ? "@" + data.username : ""
              } `}</Text>
            </Animated.View>
          </View>

          <View
            style={{
              width: "100%",
              marginVertical: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "baseline",

              // width: Dimensions.get('window').width,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                marginRight: 20,
              }}
              onPress={() => {
                if (position === "profile") {
                  props.navigation.push("ProfileStack", {
                    screen: "FollowerPage",
                  });
                } else {
                  props.navigation.push("otherFollower", {
                    idUser: props.route.params.idUser,
                  });
                }
              }}
            >
              <Text type="black" size="label">
                {`${data.count_follower ? data.count_follower : "0"} `}
              </Text>
              {/* {data.count_follower ? ( */}
              <Text
                type="regular"
                size="description"
                // style={{ color: '#B0B0B0' }}
              >
                {t("followers")}
              </Text>
              {/* ) : null} */}
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
              }}
              onPress={() => {
                if (position === "profile") {
                  props.navigation.push("ProfileStack", {
                    screen: "FollowingPage",
                  });
                } else {
                  props.navigation.push("otherFollowing", {
                    idUser: props.route.params.idUser,
                  });
                }
              }}
            >
              <Text type="black" size="label">
                {`${data.count_following ? data.count_following : "0"} `}
              </Text>
              {/* {data.count_following ? ( */}
              <Text
                type="regular"
                size="description"
                // style={{ color: '#B0B0B0' }}
              >
                {t("following")}
              </Text>
              {/* ) : null} */}
            </Pressable>
          </View>
          {/* button profil or follow */}
          <View>
            {position && position === "profile" ? (
              <View
                style={{
                  width: width,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Button
                  text={t("editprofile")}
                  onPress={() =>
                    props.navigation.push("profilesetting", {
                      token: token,
                      data: data,
                    })
                  }
                  variant="bordered"
                  size="small"
                  color="black"
                  style={{
                    width: "30%",
                    borderColor: "#464646",
                    alignSelf: "flex-end",
                    // margin: 15,
                  }}
                />
              </View>
            ) : null}

            {position && position === "other" ? (
              <View
                style={{
                  width: width,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                {!loadFollowMut && !loadUnfolMut ? (
                  data.status_following === true ? (
                    <Button
                      onPress={() => {
                        data.status_following = false;
                        setDataUser(data);
                        _unfollow(props.route.params.idUser);
                      }}
                      text={t("unfollow")}
                      // variant="normal"
                      size="small"
                      type="icon"
                      color="secondary"
                      style={{
                        // width: "30%",
                        // borderColor: "#464646",
                        alignSelf: "flex-end",
                        // margin: 15,
                      }}
                    />
                  ) : (
                    <Button
                      onPress={() => {
                        data.status_following = true;
                        setDataUser(data);
                        _follow(props.route.params.idUser);
                      }}
                      text={t("follow")}
                      size="small"
                      color="primary"
                      variant={"normal"}
                      text={t("follow")}
                      style={{
                        width: "30%",
                        alignSelf: "flex-end",
                        // margin: 15,
                      }}
                    />
                  )
                ) : (
                  <View
                    style={{
                      flex: 1,
                      //   borderWidth: 1,
                      //   borderColor: "#000",
                      backgroundColor: "#fff",
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <ActivityIndicator
                      animating={true}
                      color="#209fae"
                      size="small"
                    />
                  </View>
                )}

                {/* <Button
                  onPress={() =>
                    _handlemessage(props.route.params.idUser, token)
                  }
                  text={t("Message")}
                  variant="bordered"
                  size="small"
                  color="black"
                  style={{
                    width: "48%",
                    // width: width / 2,
                    borderColor: "#464646",
                    alignSelf: "flex-end",
                    // margin: 15,
                  }}
                /> */}
              </View>
            ) : null}
          </View>

          <View
            style={{
              marginVertical: "3%",
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
              // borderWidth: 1,
              // marginBottom: Platform.OS === "ios" ? null : null,
            }}
          >
            <Text
              onLayout={(e) => {
                captionHeightCalculation(
                  Math.ceil(e.nativeEvent.layout.height)
                );
                // setCaptionHeight(e.nativeEvent.layout.height);
              }}
              type="regular"
              size="description"
              style={{
                textAlign: "center",
                // borderWidth: 2,
              }}
            >
              {data.bio ? data.bio : ""}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
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
          size="title"
          style={{
            color: focused ? "#209FAE" : "#464646",
          }}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const renderPost = (tabPost, e) => {
    if (tabPost === 0) {
      return (
        <Post
          item={e.item}
          index={e.index}
          navigation={e.props.navigation}
          user={dataUser}
          dataPost={dataPost}
        />
      );
    } else if (tabPost === 1) {
      return (
        <Albums item={e.item} index={e.index} props={e.props} token={token} />
      ); // return Albums(e);
    } else {
      return Tags(e);
    }
  };

  const renderdataPost = (tabPost) => {
    if (tabPost === 0) {
      return dataPost;
    } else if (tabPost === 1) {
      return dataalbums;
    } else {
      return dataPost;
    }
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    let paddingHorizontal;
    let capHeight = captionHeight;
    switch (route.key) {
      case "tab1":
        numCols = tabPost === 2 ? 3 : 1;
        data = renderdataPost(tabPost);
        renderItem = (e) => renderPost(tabPost, e, capHeight);
        paddingHorizontal = tabPost === 2 ? 2.5 : 0;
        break;
      case "tab2":
        numCols = 1;
        data = dataReview;
        renderItem = (e) => Review(e, onSelect, props, token, t, capHeight);
        paddingHorizontal = 0;
        break;
      case "tab3":
        numCols = 1;
        data = dataTrip;
        renderItem = (e) =>
          Trip(
            e,
            capHeight,
            setting,
            data,
            modalLogin,
            setModalLogin,
            soon,
            setSoon,
            dataTrip,
            setdataTrip,
            mutationliked,
            mutationUnliked
          );
        paddingHorizontal = 15;
        break;
      default:
        return null;
    }
    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        // scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        key={"#" + numCols}
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
        ListHeaderComponent={() => <View style={{ height: 5 }}></View>}
        contentContainerStyle={{
          paddingTop:
            tabIndex === 0
              ? HeaderHeight +
                TabBarHeight +
                (captionHeight == 10
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 60
                      : 45
                    : 45
                  : captionHeight == 20
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 110
                      : 110
                    : 110
                  : captionHeight == 30
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 40
                      : 65
                    : 80
                  : captionHeight == 40
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 120
                      : 80
                    : 120
                  : captionHeight == 50
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 40
                      : 40
                    : 85
                  : captionHeight == 60
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 135
                      : 80
                    : 150
                  : captionHeight == 70
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 40
                      : 40
                    : 105
                  : captionHeight == 80
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 150
                      : 65
                    : 150
                  : captionHeight == 90
                  ? Platform.OS === "ios"
                    ? Notch
                      ? 170
                      : 85
                    : 170
                  : 50)
              : HeaderHeight + TabBarHeight,
          minHeight: height - SafeStatusBar + HeaderHeight,
          paddingBottom: 10,
          // paddingHorizontal: 15,
          // margin: Platform.OS === "ios" ? 10 : 5,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) =>
          renderItem({ position, token, props, item, index })
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        style={{}}
      />
    );
  };

  let [tabPost, settabPost] = useState(0);

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [
        HeaderHeight,
        captionHeight == 10
          ? Platform.OS === "ios"
            ? Notch
              ? 50
              : 60
            : 70
          : captionHeight == 20
          ? Platform.OS === "ios"
            ? Notch
              ? 0
              : 0
            : 10
          : captionHeight == 30
          ? Platform.OS === "ios"
            ? Notch
              ? 40
              : 40
            : 30
          : captionHeight == 40
          ? Platform.OS === "ios"
            ? Notch
              ? -15
              : 40
            : 10
          : captionHeight == 50
          ? Platform.OS === "ios"
            ? Notch
              ? 40
              : 40
            : 30
          : captionHeight == 60
          ? Platform.OS === "ios"
            ? Notch
              ? -25
              : 20
            : -30
          : captionHeight == 70
          ? Platform.OS === "ios"
            ? Notch
              ? 40
              : 40
            : 20
          : captionHeight == 80
          ? Platform.OS === "ios"
            ? Notch
              ? -40
              : 40
            : -25
          : captionHeight == 90
          ? Platform.OS === "ios"
            ? Notch
              ? -65
              : 20
            : -40
          : 50,
      ],

      // extrapolate: 'clamp',
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          // top: Platform.OS === "ios" ? (Notch ? "1%" : "-7%") : null,
          marginVertical:
            captionHeight == 10
              ? Platform.OS === "ios"
                ? Notch
                  ? "-2%"
                  : "-5%"
                : "-5%"
              : captionHeight == 20
              ? Platform.OS === "ios"
                ? Notch
                  ? "10%"
                  : "2%"
                : "10%"
              : captionHeight == 30
              ? Platform.OS === "ios"
                ? Notch
                  ? "10"
                  : "0%"
                : "5%"
              : captionHeight == 40
              ? Platform.OS === "ios"
                ? Notch
                  ? "13%"
                  : "5%"
                : "12%"
              : captionHeight == 50
              ? Platform.OS === "ios"
                ? Notch
                  ? "5%"
                  : "5%"
                : "5%"
              : captionHeight == 60
              ? Platform.OS === "ios"
                ? Notch
                  ? "16%"
                  : "5%"
                : "20%"
              : captionHeight == 70
              ? Platform.OS === "ios"
                ? Notch
                  ? "5%"
                  : "5%"
                : "10%"
              : captionHeight == 80
              ? Platform.OS === "ios"
                ? Notch
                  ? "20%"
                  : "0%"
                : "20%"
              : captionHeight == 90
              ? Platform.OS === "ios"
                ? Notch
                  ? "25%"
                  : "5%"
                : "25%"
              : "5%",
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
          style={{
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "white",
            height: TabBarHeight,
            borderBottomWidth: 1,
            borderBottomColor: "#d1d1d1",
          }}
          renderLabel={renderLabel}
          indicatorStyle={{
            backgroundColor: "#209fae",
            height: "5%",
            bottom: "-3%",
          }}
        />
        {tabIndex === 0 ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              backgroundColor: "#fff",
              borderBottomColor: "#d3d3d3",
              borderBottomWidth: 0.5,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                settabPost(0);
              }}
              style={{
                padding: 10,
                width: "34.4%",
                alignItems: "center",
              }}
            >
              {tabPost === 0 ? (
                <PostGreen height={15} width={15} />
              ) : (
                <PostGray height={15} width={15} />
              )}
              <Text
                type={tabPost === 0 ? "bold" : "regular"}
                style={{
                  marginTop: 6,
                  color: tabPost === 0 ? "#209fae" : "#464646",
                }}
              >
                {t("allPost")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                settabPost(1);
              }}
              style={{
                padding: 10,
                width: "33.3%",
                alignItems: "center",
              }}
            >
              {tabPost === 1 ? (
                <AlbumGreen height={15} width={15} />
              ) : (
                <AlbumGray height={15} width={15} />
              )}
              <Text
                type={tabPost === 1 ? "bold" : "regular"}
                style={{
                  marginTop: 6,
                  color: tabPost === 1 ? "#209fae" : "#464646",
                }}
              >
                Album
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSoon(true);
              }}
              style={{
                padding: 10,
                width: "33.3%",
                alignItems: "center",
              }}
            >
              {tabPost === 2 ? (
                <Taggreen height={15} width={15} />
              ) : (
                <Tag height={15} width={15} />
              )}
              <Text
                type={tabPost === 2 ? "bold" : "regular"}
                style={{
                  marginTop: 6,
                  color: tabPost === 2 ? "#209fae" : "#464646",
                }}
              >
                {t("tag")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
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

          // props.navigation.setOptions({
          //   headerLeft: () => (
          //     <View
          //       style={{
          //         flexDirection: "row",
          //         alignContent: "center",
          //         alignItems: "center",
          //       }}
          //     >
          //       <Button
          //         text={""}
          //         size="medium"
          //         type="circle"
          //         variant="transparent"
          //         onPress={() => props.navigation.goBack()}
          //         style={{
          //           height: 55,
          //         }}
          //       >
          //         <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          //       </Button>

          //       <Animated.View
          //         style={{
          //           position: "absolute",
          //           left: 55,
          //           opacity: hides.current,
          //         }}
          //       >
          //         <Text
          //           size="label"
          //           type="bold"
          //           style={{
          //             color: "#fff",
          //           }}
          //         >
          //           {t("profile")}
          //         </Text>
          //       </Animated.View>

          //       <Animated.Image
          //         source={
          //           data?.user_profilebyid?.picture
          //             ? { uri: data?.user_profilebyid?.picture }
          //             : DefaultProfileSquare
          //         }
          //         style={{
          //           width: width / 9,
          //           height: width / 9,
          //           borderRadius: width / 18,
          //           borderWidth: 2,
          //           borderColor: "#FFF",
          //           opacity: hide.current,
          //         }}
          //       />
          //     </View>
          //   ),
          //   headerTitle: (
          //     <View>
          //       <Animated.View
          //         style={{
          //           opacity: hide.current,
          //         }}
          //       >
          //         <Text
          //           type="bold"
          //           style={{
          //             color: "#fff",
          //           }}
          //         >
          //           {data?.user_profilebyid?.first_name}{" "}
          //           {data?.user_profilebyid?.last_name}
          //         </Text>
          //       </Animated.View>
          //     </View>
          //   ),
          // });
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
        <ActivityIndicator animating={true} color="#209fae" size="large" />
      </Animated.View>
    );
  };

  let [dataUser, setDataUser] = useState({});

  let [datas, setdatas] = useState(null);

  const [LoadUserProfile, { data, loading, error, refetch }] = useLazyQuery(
    Account,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : null,
        },
      },
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        setDataUser(data.user_profilebyid);

        Getdatapost();
        // Getdataalbum();
        QueryFotoAlbum();
        LoadReview();
        if (position === "profile") {
          LoadTrip2();
        } else {
          LoadTrip();
        }
        setdatas(1);

        props.navigation.setOptions({
          headerLeft: () => (
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}
            >
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

              <Animated.View
                style={{
                  position: "absolute",
                  opacity: hides.current,
                  left: 55,
                }}
              >
                <Text
                  size="label"
                  type="bold"
                  style={{
                    color: "#fff",
                  }}
                >
                  {t("profile")}
                </Text>
              </Animated.View>

              <Animated.Image
                source={
                  data?.user_profilebyid?.picture
                    ? { uri: data?.user_profilebyid?.picture }
                    : DefaultProfileSquare
                }
                style={{
                  width: width / 9,
                  height: width / 9,
                  borderRadius: width / 18,
                  borderWidth: 2,
                  borderColor: "#FFF",
                  opacity: hide.current,
                }}
              />
            </View>
          ),
          headerTitle: (
            <View>
              <Animated.View
                style={{
                  opacity: hide.current,
                }}
              >
                <Text
                  type="bold"
                  style={{
                    color: "#fff",
                  }}
                >
                  {data?.user_profilebyid?.first_name}{" "}
                  {data?.user_profilebyid?.last_name}
                </Text>
              </Animated.View>
            </View>
          ),
        });
      },
    }
  );

  let [modal, setModal] = useState(false);
  let [dataImage, setDataImage] = useState();

  const onSelect = async (data, inde) => {
    var tempdatas = [];
    var x = 0;
    for (var i in data) {
      if (data[i].id !== "camera") {
        let wid = 0;
        let hig = 0;
        if (data[i].type !== "video") {
          Image.getSize(data[i].image, (width, height) => {
            wid = width;
            hig = height;
          });
        } else {
          wid = 500;
          hig = 500;
        }

        tempdatas.push({
          key: i,
          id: data[i].post_id,
          selected: i === inde ? true : false,
          url: data[i]?.image ? data[i]?.image : "",
          width: wid,
          height: hig,
          props: {
            source: data[i]?.image ? data[i]?.image : "",
            type: data[i]?.type ? data[i]?.type : "image",
          },
          by: data[i]?.upload_by?.first_name
            ? data[i]?.upload_by?.first_name
            : "",
        });
        x++;
      }
    }

    if (tempdatas.length > 0) {
      await setDataImage(tempdatas);
      setModal(true);
    }
  };

  const renderAlert = () => {
    return (
      <>
        <ModalLogin
          modalLogin={modalLogin}
          setModalLogin={() => setModalLogin(false)}
          props={props}
        />
        <ModalRN
          useNativeDriver={true}
          visible={soon}
          onRequestClose={() => setSoon(false)}
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
              width: Dimensions.get("screen").width - 100,
              marginHorizontal: 50,
              zIndex: 15,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              borderRadius: 3,
              marginTop: Dimensions.get("screen").height / 3,
            }}
          >
            <View
              style={{
                // backgroundColor: "white",
                // width: Dimensions.get("screen").width - 100,
                padding: 20,
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 10,
              }}
            >
              <Image
                source={Bg_soon}
                style={{
                  height: Dimensions.get("screen").width - 180,
                  width: Dimensions.get("screen").width - 110,
                  borderRadius: 10,
                  position: "absolute",
                }}
              />
              <Text type="bold" size="h5">
                {t("comingSoon")}!
              </Text>
              <Text type="regular" size="label" style={{ marginTop: 5 }}>
                {t("soonUpdate")}.
              </Text>
              <Button
                text={"OK"}
                style={{
                  marginTop: 20,
                  width: Dimensions.get("screen").width - 300,
                }}
                type="box"
                onPress={() => setSoon(false)}
              ></Button>
            </View>
          </View>
        </ModalRN>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <StaBar backgroundColor="#209fae" barStyle="light-content" />

      {/* header before scroll */}
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          opacity: hides.current,
          flexDirection: "row",
          justifyContent: position === "other" ? "space-between" : null,
          alignContent: "flex-start",
          alignItems: "center",
          marginLeft: 10,
          height:
            captionHeight == 10
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 40
                : 55
              : captionHeight == 20
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 30
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 40
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 50
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 60
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 70
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 80
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 90
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : 55,

          width: Dimensions.get("screen").width,
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
            opacity: hides.current,
            color: "#fff",
            marginLeft: 10,
            width: "70%",
            textAlign: "left",
            fontSize: 16,
            fontFamily: "Lato-Bold",
          }}
        >
          {t("profile")}
        </Animated.Text>
        {position && position === "other" ? (
          <View
            style={{
              marginRight: 15,
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Ripple
              onPress={() => _handlemessage(props.route.params.idUser, token)}
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              style={{
                zIndex: 99999999,
                height: 50,
                width: 50,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Message height={20} width={20}></Message>
            </Ripple>
          </View>
        ) : null}
      </Animated.View>
      {/* header after scroll */}
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          opacity: hide.current,
          flexDirection: "row",
          alignContent: "center",
          justifyContent: position === "other" ? "space-between" : null,
          alignItems: "center",
          marginLeft: 10,
          height:
            captionHeight == 10
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 40
                : 55
              : captionHeight == 20
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 30
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 40
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 50
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 60
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 70
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 80
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : captionHeight == 90
              ? Platform.OS === "ios"
                ? Notch
                  ? 35
                  : 35
                : 55
              : 55,
          width: Dimensions.get("screen").width,
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
            marginRight: 10,
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
        <Animated.Image
          source={
            data?.user_profilebyid?.picture
              ? { uri: data?.user_profilebyid?.picture }
              : DefaultProfileSquare
          }
          style={{
            width: width / 10,
            height: width / 10,
            borderRadius: width / 18,
            borderWidth: 2,
            borderColor: "#FFF",
            marginRight: 10,
            opacity: hide.current,
          }}
        />
        <Animated.View
          style={{
            opacity: hide.current,
            width: "50%",
          }}
        >
          <Text
            // type="bold"
            style={{
              color: "#fff",

              fontFamily: "Lato-Bold",
              fontSize: 16,
            }}
          >
            {data?.user_profilebyid?.first_name}{" "}
            {data?.user_profilebyid?.last_name}
          </Text>
        </Animated.View>
        {position && position === "other" ? (
          <View
            style={{
              marginRight: 15,
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Ripple
              onPress={() => _handlemessage(props.route.params.idUser, token)}
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              style={{
                zIndex: 99999999,
                height: 50,
                width: 50,

                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Message height={20} width={20}></Message>
            </Ripple>
          </View>
        ) : null}
      </Animated.View>

      {renderAlert()}
      {renderTabView()}
      {renderHeader(dataUser)}
      {renderCustomRefresh()}
      {/* <ImageSlide
        show={modal}
        dataImage={dataImage}
        setClose={() => setModal(!modal)}
      /> */}
      <ImageSlide
        // index={indexs}
        // name="Funtravia Images"
        location={""}
        // {...props}
        show={modal}
        dataImage={dataImage}
        setClose={() => setModal(!modal)}
      />

      <Sidebar
        props={props}
        show={showside}
        Data={() => {
          return (
            <View
              style={{
                padding: 10,
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              <TouchableOpacity
                onPress={() => shareAction({ from: "profile", target: id })}
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 2,
                  alignItems: "center",
                }}
              >
                <Sharegreen height={20} width={20} />

                <Text
                  size="label"
                  type="regular"
                  style={{
                    marginLeft: 10,
                  }}
                >
                  {t("share")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        setClose={(e) => setshowside(false)}
      />
    </View>
  );
}

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
  label: { fontSize: 16, color: "#222" },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFCC80",
    height: TabBarHeight,
  },
  indicator: { backgroundColor: "#222" },
});
