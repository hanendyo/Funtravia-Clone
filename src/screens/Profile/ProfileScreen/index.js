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
import User_Post from "../../../graphQL/Query/Profile/post";
import PostCursorBased from "../../../graphQL/Query/Profile/postCursorBased";
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
import { useDispatch, useSelector } from "react-redux";
import { setTokenApps } from "../../../redux/action";
import normalize from "react-native-normalize";

const Notch = DeviceInfo.hasNotch();
const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 42;

const tab1ItemSize = (width - 30) / 2;
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function OtherProfile(props) {
  const [dataPost, setdataPost] = useState([]);
  const [dataFeedBased, setdataFeedBased] = useState([]);
  const [dataalbums, setdataalbums] = useState([]);
  const [dataReview, setdataReview] = useState([]);
  const [dataTrip, setdataTrip] = useState([]);
  let [heightbio, setHeightBio] = useState(0);
  let [heightname, setHeightName] = useState(0);
  let [heightusername, setHeightUsername] = useState(0);

  let [soon, setSoon] = useState(false);
  let [modalLogin, setModalLogin] = useState(false);

  // const HeaderHeight = 260 + heightbio + heightname;
  const SafeStatusBar = Platform.select({
    ios: Notch ? 42 : 20,
    android: StatusBar.currentHeight,
  });

  const HeaderHeight = Platform.select({
    ios: Notch
      ? normalize(290) + heightname + heightbio - 20
      : normalize(338) + heightname + heightbio - 20,

    android: normalize(378) + heightname + heightbio - StatusBar.currentHeight,
  });

  let [datas, setdatas] = useState(null);
  let [setting, setSetting] = useState("");
  let [users, setuser] = useState(null);
  let [id, seID] = useState(props.route.params.idUser);
  let [dataUser, setDataUser] = useState({});
  let dispatch = useDispatch();
  let tokenApps = props.route.params.token;
  let [position, setposition] = useState(false);
  const { t } = useTranslation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;

  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);
  let hides = React.useRef(
    scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 0],
      extrapolate: "clamp",
    })
  );

  let hide = React.useRef(
    scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, 1],
      extrapolate: "clamp",
    })
  );

  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: t("profilePost") },
    { key: "tab2", title: t("review") },
    { key: "tab3", title: t("trip") },
  ]);

  let tkn = AsyncStorage.getItem("access_token");
  if (tkn === null) {
    props.navigation.navigate("AuthStack", {
      screen: "LoginScreen",
    });
    RNToasty.Show({
      title: t("pleaselogin"),
      position: "bottom",
    });
  }

  // OPACITY IMAGE
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

  const imageTrans = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.4],
    extrapolate: "clamp",
  });

  const opacityfrom1 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // header pan responder
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

  // listpan responder
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

  // mutation liked & unlike
  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
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
  ] = useMutation(ItineraryUnliked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
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

  // refetch feed
  const {
    loading: loadingFeed,
    data: dataFeed,
    error: errorFeed,
    fetchMore: fetchMoreFeed,
    refetch: refetchFeed,
    networkStatus: networkStatusFeed,
  } = useQuery(PostCursorBased, {
    variables: {
      user_id: props.route.params.idUser,
      first: 18,
      after: "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    notifyOnNetworkStatusChange: true,
    onCompleted: () => {
      setdataFeedBased(spreadData(dataFeed?.user_post_cursor_based?.edges));
      setdataPost(dataFeed?.user_post_cursor_based?.edges);
    },
  });

  useEffect(() => {
    QueryFotoAlbum();
    const unsubscribe = props.navigation.addListener("focus", (data) => {
      refetchFeed();
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
  }, [routes, tabIndex, props.navigation, tokenApps, heightbio, HeaderHeight]);

  // load data review
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
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setdataReview(datareview.user_reviewbyid);
    },
  });

  // load foto album
  const [
    QueryFotoAlbum,
    { data: dataFotoAlbum, loading: loadingFotoAlbum, error: errorFotoAlbum },
  ] = useLazyQuery(ListFotoAlbumAll, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
    variables: { user_id: props.route.params.idUser, keyword: "" },
    onCompleted: () => {
      setdataalbums(dataFotoAlbum?.list_all_albums);
    },
  });

  // load data user profile
  const [LoadUserProfile, { data, loading, error, refetch }] = useLazyQuery(
    Account,
    {
      fetchPolicy: "network-only",
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: tokenApps,
        },
      },
      variables: {
        id: id,
      },
      onCompleted: (data) => {
        setDataUser(data.user_profilebyid);

        QueryFotoAlbum();
        LoadReview();
        if (position === "profile") {
          LoadTrip2();
        } else {
          LoadTrip();
        }
        setdatas(1);
      },
    }
  );

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
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
    onCompleted: () => {
      setdataTrip(datatripX.user_trip);
    },
  });

  console.log("user", dataUser);

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
    dispatch(setTokenApps(`Bearer ${tkn}`));
    let settingData = await AsyncStorage.getItem("setting");
    await setSetting(JSON.parse(settingData));
    await LoadUserProfile();
  };

  //load follow mutation
  const [
    FollowMutation,
    { loading: loadFollowMut, data: dataFollowMut, error: errorFollowMut },
  ] = useMutation(FollowMut, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
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
        Authorization: tokenApps,
      },
    },
  });

  // render data post
  const renderdataPost = (tabPost) => {
    if (tabPost === 0) {
      return dataFeedBased;
    } else if (tabPost === 1) {
      return dataalbums;
    } else {
      return dataFeedBased;
    }
  };

  // render post
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
      return (
        <Albums
          item={e.item}
          index={e.index}
          props={e.props}
          token={tokenApps}
        />
      ); // return Albums(e);
    } else {
      return Tags(e);
    }
  };

  // render header
  const renderHeader = (datas) => {
    let data = { ...datas };

    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          top: SafeStatusBar,
          paddingTop: Platform.select({
            ios: Notch ? 10 : 20,
            android: 10,
          }),
          paddingBottom: 3,
          // height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          backgroundColor: "#209fae",
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            // height: HeaderHeight,
            // borderWidth: 1,
            top: SafeStatusBar,
            paddingTop: Platform.select({
              ios: Notch ? 10 : 20,
              android: 10,
            }),

            backgroundColor: "#fff",
            opacity: imageOpacity,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",

              zIndex: 1,
              paddingHorizontal: 20,
            }}
          >
            {/* foto profile */}
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
                  top: 5,
                  zIndex: 1,
                  opacity: imageOpacitys,
                  transform: [{ scale: imageTrans }],
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
          {/* name & username */}
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
              <Text
                onTextLayout={(x) => {
                  let line = x.nativeEvent.lines.length;
                  console.log("line", line);
                  if (line == 0) {
                    Platform.OS == "ios"
                      ? Notch
                        ? setHeightName(0)
                        : setHeightName(0)
                      : setHeightName(line * 11);
                  } else {
                    Platform.OS == "ios"
                      ? Notch
                        ? setHeightName(line * 10)
                        : setHeightName(line - 20)
                      : setHeightName(line);
                  }
                }}
                type="bold"
                size="title"
                style={{ marginRight: 10 }}
              >
                {`${data.first_name ? data.first_name : ""} ` +
                  `${data.last_name ? data.last_name : ""}`}
              </Text>
              <Text type="regular" size="label">{`${
                data.username ? "@" + data.username : ""
              } `}</Text>
            </Animated.View>
          </View>

          {/* follower & following */}
          <View
            style={{
              width: "100%",
              marginVertical: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "baseline",
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
                    params: { token: tokenApps },
                  });
                } else {
                  props.navigation.push("otherFollower", {
                    idUser: props.route.params.idUser,
                    token: tokenApps,
                  });
                }
              }}
            >
              <Text type="black" size="label">
                {`${data.count_follower ? data.count_follower : "0"} `}
              </Text>

              <Text type="regular" size="description">
                {t("followers")}
              </Text>
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
                    params: { token: tokenApps },
                  });
                } else {
                  props.navigation.push("otherFollowing", {
                    idUser: props.route.params.idUser,
                    token: tokenApps,
                  });
                }
              }}
            >
              <Text type="black" size="label">
                {`${data.count_following ? data.count_following : "0"} `}
              </Text>

              <Text type="regular" size="description">
                {t("following")}
              </Text>
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
                      token: tokenApps,
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
                      size="small"
                      type="icon"
                      color="secondary"
                      style={{
                        alignSelf: "flex-end",
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
              </View>
            ) : null}
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              // borderWidth: 1,
              paddingTop: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text
              onTextLayout={(x) => {
                let line = x.nativeEvent.lines.length;

                if (line == 0) {
                  Platform.OS == "ios"
                    ? Notch
                      ? setHeightBio(10)
                      : setHeightBio(10)
                    : setHeightBio(line * 11);
                } else {
                  Platform.OS == "ios"
                    ? Notch
                      ? setHeightBio(line * 25)
                      : setHeightBio(line * 20)
                    : setHeightBio(line);
                }
              }}
              type="regular"
              size="description"
              style={{
                textAlign: "center",
                // paddingBottom: 10,
              }}
            >
              {data.bio ? data.bio : ""}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  // render scene
  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    let paddingHorizontal;
    let capHeight = 0;
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
        renderItem = (e) => Review(e, onSelect, props, tokenApps, t, capHeight);
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

    const handleOnEndReached = (e) => {
      console.log("e", e);
      // if (status == 0) {
      //   if (dataPost?.post_cursor_based?.pageInfo.hasNextPage && !loadingPost) {
      //     return fetchMore({
      //       updateQuery: onUpdate,
      //       variables: {
      //         first: 5,
      //         after: dataPost?.post_cursor_based.pageInfo?.endCursor,
      //       },
      //     });
      //   }
      // } else {
      //   setModalLogin(true);
      // }
    };

    // let heightTotal = HeaderHeight + SafeStatusBar + TabBarHeight - 55;

    let heightTotal = Platform.select({
      ios: Notch
        ? HeaderHeight + SafeStatusBar + TabBarHeight - 55
        : HeaderHeight + SafeStatusBar + TabBarHeight - 40,
    });

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
          marginTop:
            Platform.OS === "ios"
              ? tabIndex === 0
                ? heightTotal + 85
                : tabIndex === 1
                ? heightTotal + 20
                : heightTotal - 50
              : tabIndex === 0
              ? heightTotal + 55
              : tabIndex === 1
              ? heightTotal - 10
              : heightTotal - 25,
          borderWidth: 1,
          minHeight: height - SafeStatusBar + HeaderHeight,
          paddingBottom: Platform.OS === "ios" ? 120 : 70,
          // paddingHorizontal: 15,
          // margin: Platform.OS === "ios" ? 10 : 5,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={({ item, index }) =>
          renderItem({ position, tokenApps, props, item, index })
        }
        initialNumToRender={10}
        onEndReachedThreshold={1}
        onEndReached={(e) => handleOnEndReached(e)}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        style={{}}
      />
    );
  };

  // render Tab view
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

  let [tabPost, settabPost] = useState(0);
  // render tabbar
  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 45],

      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          // top: -10,
          // borderWidth: 1,
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

  // render label
  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 1, height: "100%", marginTop: 2 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  // render all source
  return (
    <View style={styles.container}>
      <StaBar backgroundColor="#14646e" barStyle="light-content" />

      {/* header before scroll */}
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          // borderWidth: 1,
          backgroundColor: "#209FAE",
          opacity: hides.current,
          flexDirection: "row",
          justifyContent: "space-between",
          height: 52,
          alignContent: "center",
          alignItems: "center",
          width: Dimensions.get("screen").width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: -20,
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
              height: 50,
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
        </View>
        {position && position === "other" ? (
          <View
            style={{
              marginRight: 15,
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Ripple
              onPress={() =>
                _handlemessage(props.route.params.idUser, tokenApps)
              }
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
          backgroundColor: "#209FAE",
          opacity: hide.current,
          flexDirection: "row",
          justifyContent: "space-between",
          height: 52,
          alignContent: "center",
          alignItems: "center",
          width: Dimensions.get("screen").width,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginHorizontal: -20,
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
        </View>
        {position && position === "other" ? (
          <View
            style={{
              marginRight: 15,
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <Ripple
              onPress={() =>
                _handlemessage(props.route.params.idUser, tokenApps)
              }
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
      {renderTabView()}
      {renderHeader(dataUser)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },

  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
  label: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFCC80",
    height: TabBarHeight,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT + 55,
    resizeMode: "cover",
  },
  indicatormax: { backgroundColor: "#209FAE", height: 0 },
  indicatormin: { backgroundColor: "#209FAE", height: 2 },
});
