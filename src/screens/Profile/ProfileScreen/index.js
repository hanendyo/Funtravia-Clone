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
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import {
  Button,
  Sidebar,
  StatusBar as StaBar,
  Text,
  shareAction,
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
import {
  Album,
  Albumgreen,
  Allpost,
  Allpostgreen,
  Arrowbackwhite,
  Google,
  OptionsVertWhite,
  Sharegreen,
  Tag,
  Taggreen,
} from "../../../assets/svg";
import Post from "./Posting/Post";
import Albums from "./Posting/Album";
import Tags from "./Posting/Tag";
import Review from "./Review";
import Trip from "./Trip";
import ImageSlide from "../../../component/src/ImageSlide";
import FollowMut from "../../../graphQL/Mutation/Profile/FollowMut";
import UnfollowMut from "../../../graphQL/Mutation/Profile/UnfollowMut";
import DeviceInfo from "react-native-device-info";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});

const HeaderHeight = 310 - SafeStatusBar;
const PullToRefreshDist = 150;

export default function OtherProfile(props) {
  const { t } = useTranslation();
  let [showside, setshowside] = useState(false);
  let [token, setToken] = useState(null);
  const [dataPost, setdataPost] = useState([]);
  const [dataalbums, setdataalbums] = useState([]);
  const [dataReview, setdataReview] = useState([]);
  const [dataTrip, setdataTrip] = useState([]);
  let [users, setuser] = useState(null);
  let [id, seID] = useState(null);
  let [position, setposition] = useState(false);

  const loadAsync = async () => {
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    await setuser(user.user);

    if (!props.route.params.idUser) {
      await seID(user.user.id);

      await props.navigation.setParams({ idUser: user.user.id });
      setposition("profile");
    } else {
      if (props.route.params.idUser === user.user.id) {
        await seID(user.user.id);

        setposition("profile");
      } else {
        await seID(props.route.params.idUser);

        setposition("other");
      }
    }

    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);

    await LoadUserProfile();
  };

  const [
    Getdatapost,
    {
      data: dataposting,
      loading: loadingpost,
      error: errorpost,
      refetch: refetchpost,
    },
  ] = useLazyQuery(User_Post, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: {
      id: id,
    },
    onCompleted: () => {
      setdataPost(spreadData(dataposting.user_postbyid));
    },
  });

  const [
    Getdataalbum,
    {
      data: dataalbum,
      loading: loadingalbum,
      error: erroralbum,
      refetch: refetchalbum,
    },
  ] = useLazyQuery(album_post, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: {
      limit: 5,
      offset: 0,
      user_id: id,
    },
    onCompleted: () => {
      setdataalbums(dataalbum.user_post_album.datas);
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
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataReview(datareview.user_reviewbyid);
    },
  });

  const [
    LoadTrip,
    { data: datatrip, loading: loadingtrip, error: errortrip },
  ] = useLazyQuery(Itinerary, {
    fetchPolicy: "network-only",
    variables: {
      id: id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Alert.alert("" + error);
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
        Alert.alert("" + error);
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
    } catch (error) {
      console.error(error);
      // setLoading(false);
    }
  };

  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: "Post" },
    { key: "tab2", title: "Review" },
    { key: "tab3", title: "Trip" },
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

  const HeaderComponent = {
    headerShown: true,
    title: "",
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
      alignSelf: "center",
      // paddingLeft: Platform.select({
      //   // ios: 44,
      //   ios: 0,
      //   android: 40,
      // }),
    },
    headerLeftContainerStyle: {
      background: "#FFF",

      marginLeft: 10,
    },
    headerLeft: () => (
      <View>
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
      </View>
    ),
    headerRight: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => setshowside(true)}
        style={{
          marginRight: 10,
        }}
      >
        <OptionsVertWhite height={15} width={15}></OptionsVertWhite>
      </Button>
    ),
  };

  useEffect(() => {
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
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        onLayout={() => {
          props.navigation.setOptions(HeaderComponent);
        }}
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          top: SafeStatusBar,
          height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          backgroundColor: "#209fae",
        }}
      >
        {/* <Animated.Image
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
        /> */}
        {/* <TouchableOpacity
          onPress={() => {
            console.log("test", id);
            console.log("test", token);
            console.log("test");
            LoadTrip2();
          }}
        >
          <Text>tesssssssssssssssssssssssssssssssssssss</Text>
        </TouchableOpacity> */}

        <Animated.View
          style={{
            width: "100%",
            height: "80%",
            backgroundColor: "#fff",
            opacity: imageOpacity,
            // borderWidth: 1,
            justifyContent: "center",
            // paddingBottom: 10,
            // borderWidth: 2,
            // transform: [{ translateY: imageTranslate }],
            marginTop: 60,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "space-between",

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
                  alignSelf: "flex-start",
                  width: width / 4,
                  height: width / 4,
                  borderRadius: width / 8,
                  borderWidth: 2,
                  borderColor: "#FFF",
                  // position: "absolute",
                  // top: 70,
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

            {position && position === "profile" ? (
              <View
                style={{
                  width: width / 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                    width: width / 2,
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
                  width: width / 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
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
                      variant="bordered"
                      size="small"
                      color="black"
                      style={{
                        width: "48%",
                        borderColor: "#464646",
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
                      color={"secondary"}
                      variant={"normal"}
                      text={t("follow")}
                      style={{
                        width: "48%",
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

                <Button
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
                />
              </View>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: "row",
              width: Dimensions.get("screen").width,
              justifyContent: "space-between",
              paddingHorizontal: 20,
              alignItems: "center",
              alignContent: "center",
              marginTop: 10,
              // paddingTop: 30,
            }}
          >
            <Animated.View style={{ width: "50%", opacity: opacityfrom1 }}>
              <Text type="bold" size="label" style={{ marginRight: 10 }}>
                {`${data.first_name ? data.first_name : ""} ` +
                  `${data.last_name ? data.last_name : ""}`}
              </Text>
              <Text type="regular" size="description">{`${
                data.username ? "@" + data.username : ""
              } `}</Text>
            </Animated.View>

            <View
              style={{
                width: "50%",
                // marginTop: 10,
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "baseline",
                // width: Dimensions.get('window').width,
              }}
            >
              <TouchableOpacity
                style={{
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
              </TouchableOpacity>
              <TouchableOpacity
                style={{
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
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: 10,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 20,
              // borderWidth: 1,
            }}
          >
            <Text
              type="regular"
              size="description"
              style={{ textAlign: "justify" }}
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

  const renderPost = (tabPost, e) => {
    if (tabPost === 0) {
      return (
        <Post
          item={e.item}
          navigation={e.props.navigation}
          user={dataUser}
          dataPost={dataPost}
        />
      );
    } else if (tabPost === 1) {
      return Albums(e);
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
    switch (route.key) {
      case "tab1":
        numCols = tabPost === 2 ? 3 : 1;
        data = renderdataPost(tabPost);
        renderItem = (e) => renderPost(tabPost, e);
        paddingHorizontal = tabPost === 2 ? 2.5 : 0;
        break;
      case "tab2":
        numCols = 1;
        data = dataReview;
        renderItem = (e) => Review(e);
        paddingHorizontal = 0;
        break;
      case "tab3":
        numCols = 1;
        data = dataTrip;
        renderItem = (e) => Trip(e);
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
              ? HeaderHeight + TabBarHeight + 55
              : HeaderHeight + TabBarHeight,
          paddingHorizontal: paddingHorizontal,
          minHeight: height - SafeStatusBar + HeaderHeight,
          paddingBottom: 10,
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

  // hhhhh

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 55],
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
          style={{
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "white",
            height: TabBarHeight,
            borderBottomWidth: 2,
            borderBottomColor: "#daf0f2",
          }}
          renderLabel={renderLabel}
          indicatorStyle={{
            backgroundColor: "#209fae",
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
                width: "33.3%",
                alignItems: "center",
              }}
            >
              {tabPost === 0 ? (
                <Allpostgreen height={15} width={15} />
              ) : (
                <Allpost height={15} width={15} />
              )}
              <Text
                style={{
                  marginTop: 3,
                  color: tabPost === 0 ? "#209fae" : "#464646",
                }}
              >
                All Post
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
                <Albumgreen height={15} width={15} />
              ) : (
                <Album height={15} width={15} />
              )}
              <Text
                style={{
                  marginTop: 3,
                  color: tabPost === 1 ? "#209fae" : "#464646",
                }}
              >
                Album
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                settabPost(2);
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
                style={{
                  marginTop: 3,
                  color: tabPost === 2 ? "#209fae" : "#464646",
                }}
              >
                Tag
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
                    left: 55,
                    opacity: hides.current,
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
          Authorization: `Bearer ${token}`,
        },
      },
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        setDataUser(data.user_profilebyid);

        Getdatapost();
        Getdataalbum();
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

  const onSelect = async (data) => {
    var tempdatas = [];
    var x = 0;
    for (var i in data) {
      tempdatas.push({
        key: i,
        selected: i === 0 ? true : false,
        url: data[i] ? data[i] : "",
        width: Dimensions.get("screen").width,
        height: 300,
        props: {
          source: data[i] ? data[i] : "",
        },
      });
      x++;
    }

    if (tempdatas.length > 0) {
      await setDataImage(tempdatas);
      setModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <StaBar backgroundColor="#14646e" barStyle="light-content" />
      {renderTabView()}
      {renderHeader(dataUser)}
      {renderCustomRefresh()}
      <ImageSlide
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
                <Sharegreen height={15} width={15} />

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
