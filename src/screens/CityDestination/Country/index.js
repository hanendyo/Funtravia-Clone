import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Animated,
  PanResponder,
  FlatList,
  Alert,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
  Pressable,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  Arrowbackwhite,
  LikeEmpty,
  LikeRed,
  Logofuntravianew,
} from "../../../assets/svg";
import { default_image, search_button } from "../../../assets/png";
import { Input, Tab, Tabs } from "native-base";
import {
  Capital,
  Truncate,
  StatusBar as StaBar,
  RenderMaps,
  FunImage,
  FunMaps,
} from "../../../component";
import Ripple from "react-native-material-ripple";
import { Text, Button } from "../../../component";
import { FunIcon, Loading, Sidebar } from "../../../component";
// import Sidebar from "../../../component/src/Sidebar";
import CountrisInformation from "../../../graphQL/Query/Countries/Countrydetail";
import CountrisJournal from "../../../graphQL/Query/Countries/CountryJournal";
import { useTranslation } from "react-i18next";
import ImageSlider from "react-native-image-slider";
import { TouchableHighlight } from "react-native-gesture-handler";
import { TabBar, TabView } from "react-native-tab-view";
import likedJournal from "../../../graphQL/Mutation/Journal/likedJournal";
import unlikedJournal from "../../../graphQL/Mutation/Journal/unlikedJournal";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
const HeaderHeight = 300;
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});
const screenHeight = Dimensions.get("window").height;

let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
const PullToRefreshDist = 150;

export default function Country(props) {
  let [token, setToken] = useState("");
  const { t, i18n } = useTranslation();
  let [search, setTextc] = useState("");
  let [showside, setshowside] = useState(false);
  let [full, setFull] = useState(false);
  let scrollRef = useRef();

  const _tabIndex = useRef(0);
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const [tabIndex, setIndex] = useState(0);
  const [routes, setRoutes] = useState([1]);
  const [canScroll, setCanScroll] = useState(true);
  const [tabGeneral] = useState(Array(1).fill(0));
  const [tab2Data] = useState(Array(1).fill(0));
  const refreshStatusRef = useRef(false);

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  // for capturing header scroll on Android
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
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

  const [getPackageDetail, { loading, data, error }] = useLazyQuery(
    CountrisInformation,
    {
      fetchPolicy: "network-only",
      variables: {
        id: props.route.params.data.id,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
      onCompleted: () => {
        let tab = [{ key: "general", title: "General" }];

        data.country_detail.article_header.map((item, index) => {
          tab.push({
            key: item.title,
            title: item.title,
            data: item.content,
          });
        });

        setRoutes(tab);
      },
    }
  );

  let [list_journal, setListJournal] = useState({});
  const [
    getJournal,
    { loading: loadingJournal, data: dataJournal, error: errorJournal },
  ] = useLazyQuery(CountrisJournal, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.data.id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setListJournal(dataJournal.journal_by_country);
    },
  });

  const refresh = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getJournal();
    await getPackageDetail();
  };

  useEffect(() => {
    refresh();
    setTimeout(() => {
      setLoadings(false);
    }, 2000);
    const Journaldata = props.navigation.addListener("focus", () => {});
    return Journaldata;
  }, [props.navigation]);

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

  const Renderfact = ({ data, header, country }) => {
    var y = data.length;
    var x = 2;
    var z = 3;
    var remainder = y % x;
    var remainderz = y % z;
    return (
      <FlatList
        listKey={"renderFact"}
        numColumns={
          data.length && data.length > 1
            ? data.length === 2 && remainder === 0
              ? 2
              : 3
            : 1
        }
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <Ripple
              onPress={() => {
                props.navigation.push("ArticelCategory", {
                  id: item.id,
                  header: header,
                  country: country,
                });
              }}
              style={{
                width:
                  data.length && data.length > 1
                    ? data.length === 2 && remainder === 0
                      ? "50%"
                      : "33.33%"
                    : "100%",

                alignContent: "center",
                alignItems: "center",
                paddingVertical: 7,
                paddingHorizontal: 0,
                borderRightWidth:
                  index !== 8 &&
                  index !== 5 &&
                  index !== 2 &&
                  index !== data.length
                    ? 0.5
                    : 0,
                borderBottomWidth:
                  data.length > 3
                    ? index !== data.length &&
                      index !== data.length - 1 &&
                      index !== data.length - 2
                      ? 0.5
                      : 0
                    : 0,

                borderColor: "#209fae",
              }}
            >
              <Text
                size="description"
                type="bold"
                numberOfLines={1}
                style={{
                  textAlign: "center",
                  marginTop: 3,
                  width: "100%",
                }}
              >
                {item.name}
              </Text>
            </Ripple>
          );
        }}
      />
    );
  };

  const spreadData = (data) => {
    let tmpData = [];
    let count = 1;
    let tmpArray = [];
    for (let val of data) {
      if (count < 2) {
        tmpArray.push(val);
        count++;
      } else {
        tmpArray.push(val);
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

  // mutasi liked jurnal
  const [
    mutationlikedJournal,
    {
      loading: loadingLikeJournal,
      data: dataLikeJournal,
      error: errorLikeJournal,
    },
  ] = useMutation(likedJournal, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _likedjournal = async (id, index, item) => {
    if (token) {
      try {
        let response = await mutationlikedJournal({
          variables: {
            id: id,
            qty: 1,
          },
        });
        if (loadingLikeJournal) {
          Alert.alert("Loading!!");
        }
        if (errorLikeJournal) {
          throw new Error("Error Input");
        }
        if (response.data) {
          getJournal();
          if (
            response.data.like_journal.code === 200 ||
            response.data.like_journal.code === "200"
          ) {
          } else {
            throw new Error(response.data.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        getJournal();
        Alert.alert("" + error);
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

  // mutasi unliked jurnal
  const [
    mutationUnlikedJournal,
    {
      loading: loadingUnLikeJournal,
      data: dataUnLikeJournal,
      error: errorUnLikeJournal,
    },
  ] = useMutation(unlikedJournal, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _unlikedjournal = async (id, index) => {
    if (token) {
      try {
        let response = await mutationUnlikedJournal({
          variables: {
            id: id,
          },
        });
        if (loadingUnLikeJournal) {
          Alert.alert("Loading!!");
        }
        if (errorUnLikeJournal) {
          throw new Error("Error Input");
        }
        if (response.data) {
          getJournal();
          if (
            response.data.unlike_journal.code === 200 ||
            response.data.unlike_journal.code === "200"
          ) {
          } else {
            throw new Error(response.data.unlike_journal.message);
          }
        }
      } catch (error) {
        getJournal();
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

  // renderHeader
  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
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
              ></View>
            );
          }}
          setClose={(e) => setshowside(false)}
        />
        <Animated.Image
          style={{
            width: "100%",
            height: "80%",
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
          source={
            data && data.country_detail && data.country_detail.cover
              ? { uri: data.country_detail.cover }
              : default_image
          }
        />
        <Animated.View
          style={{
            height: 55,
            width: Dimensions.get("screen").width,
            backgroundColor: "#209fae",
            paddingHorizontal: 20,
            paddingVertical: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: "center",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
        >
          <View>
            <Text size="title" type="black" style={{ color: "white" }}>
              {data && data.country_detail ? (
                <Truncate
                  text={Capital({
                    text: data.country_detail.name,
                  })}
                  length={20}
                ></Truncate>
              ) : null}
            </Text>
          </View>
        </Animated.View>
        <Animated.View style={[styles.overlay]}>
          <Animated.View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              zIndex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.38)",
              top: 0,
              left: 0,
              // opacity: imageOpacity,
            }}
          ></Animated.View>
        </Animated.View>
      </Animated.View>
    );
  };
  // renderScene
  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let data;
    let renderItem;
    switch (route.key) {
      case "general":
        data = tabGeneral;
        renderItem = RenderGeneral;
        break;
      default:
        data = tab2Data;
        renderItem = (e) => RenderArticle(e, route.data);
        break;
    }
    return (
      <Animated.FlatList
        listkey={"jadja"}
        scrollToOverflowEnabled={true}
        scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
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
                    nativeEvent: {
                      contentOffset: { y: scrollY },
                    },
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
          minHeight: height - SafeStatusBar + HeaderHeight,
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
          key={"flatlisttabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={props.navigationState.routes.length < 3 ? false : true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            borderBottomWidth: 0.8,
            borderColor: "#d1d1d1",
          }}
          renderItem={({ item, index }) => (
            <Ripple
              onPress={() => {
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
                      : // : props.navigationState.routes.length < 3
                        // ? Dimensions.get("screen").width * 0.5
                        // : props.navigationState.routes.length < 4
                        // ? Dimensions.get("screen").width * 0.33
                        null,
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
                          ? "white"
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
            </Ripple>
          )}
        />
      </Animated.View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          borderBottomWidth: 2,
          borderBottomColor: focused ? "#209fae" : "white",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "flex-end",
          // borderWidth:1
        }}
      >
        <Text
          style={[
            focused ? styles.labelActive : styles.label,
            { opacity: focused ? 1 : 0.7, height: 38, paddingTop: 2 },
          ]}
        >
          {route.title}
        </Text>
      </View>
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

  // Render General
  const RenderGeneral = ({ item, index }) => {
    let render = [];
    render = data && data.country_detail ? data.country_detail : null;
    let renderjournal = [];
    renderjournal = list_journal;

    return (
      <View>
        {render && render.description ? (
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 5,
              flexDirection: "column",
            }}
          >
            <Text type="bold" size="label" style={{}}>
              {t("generalInformation")}
            </Text>
            {full == false && render.description.length > 120 ? (
              <Text
                size="readable"
                type="regular"
                style={{
                  textAlign: "justify",
                  lineHeight: 20,
                }}
              >
                <Truncate
                  text={render ? render.description : null}
                  length={120}
                />
              </Text>
            ) : (
              <Text
                size="readable"
                type="regular"
                style={{
                  textAlign: "justify",
                  lineHeight: 20,
                }}
              >
                {render ? render.description : null}
              </Text>
            )}
            {full == false && render.description.length > 120 ? (
              <TouchableOpacity
                onPress={() => {
                  setFull(true);
                }}
                style={{
                  height: 20,
                }}
              >
                <Text
                  size="readable"
                  type="regular"
                  style={{
                    color: "#209FAE",
                    lineHeight: 20,
                    marginTop: 5,
                  }}
                >
                  {t("readMore")}
                </Text>
              </TouchableOpacity>
            ) : full == true && render.description.length > 120 ? (
              <TouchableOpacity
                onPress={() => {
                  setFull(false);
                }}
              >
                <Text
                  size="readable"
                  type="regular"
                  style={{ color: "#209FAE" }}
                >
                  {t("readless")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : null}

        {/* Glance */}
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            width: "100%",
          }}
        >
          {i18n.language === "id" ? (
            <Text size="label" type="bold" style={{}}>
              {t("atGlance")}

              <Capital text={render ? render.name : null} />
            </Text>
          ) : (
            <Text size="label" type="bold" style={{}}>
              <Capital text={render ? render.name : null} />

              {t("atGlance")}
            </Text>
          )}
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
            <Tabs
              tabBarUnderlineStyle={{
                backgroundColor: "#209FAE",
              }}
              tabContainerStyle={{
                backgroundColor: "white",
                elevation: 0,
              }}
            >
              <Tab
                heading={t("map")}
                tabStyle={{
                  backgroundColor: "white",
                  elevation: 0,
                  borderBottomWidth: 1,
                  borderBottomColor: "#209FAE",
                }}
                activeTabStyle={{ backgroundColor: "white" }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: "#209FAE",
                }}
              >
                <FunMaps
                  icon={render?.map ? render.map : "mk-belitung"}
                  height={250}
                  width={width - 70}
                  style={{
                    bottom: -3,
                  }}
                />

                {/* <Image
                  source={render.map ? { uri: render.map } : default_image}
                  style={{
                    width: "100%",
                    height: width * 0.7,
                    resizeMode: "center",
                  }}
                ></Image> */}
              </Tab>
              <Tab
                heading={t("climate")}
                tabStyle={{
                  backgroundColor: "white",
                  borderBottomWidth: 1,
                  borderBottomColor: "#209FAE",
                }}
                activeTabStyle={{ backgroundColor: "white" }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: "#209FAE",
                }}
              >
                <Image
                  source={
                    render?.climate ? { uri: render.climate } : default_image
                  }
                  style={{
                    width: "100%",
                    height: width * 0.7,
                    resizeMode: "center",
                  }}
                ></Image>
              </Tab>
              <Tab
                heading={t("religion")}
                tabStyle={{
                  backgroundColor: "white",
                  borderBottomWidth: 1,
                  borderBottomColor: "#209FAE",
                }}
                activeTabStyle={{ backgroundColor: "white" }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: "#209FAE",
                }}
              >
                <Image
                  source={
                    render?.religion ? { uri: render.religion } : default_image
                  }
                  style={{
                    width: "100%",
                    height: width * 0.7,
                    resizeMode: "center",
                  }}
                ></Image>
              </Tab>
            </Tabs>
          </View>
        </View>

        {/* Travel Jurnal */}
        {renderjournal && renderjournal.length > 0 ? (
          <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              width: "100%",
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("traveljournal")}
            </Text>
            <Text size="description">{t("traveldiscovery")}</Text>
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
              {renderjournal ? (
                <ImageSlider
                  listkey={"imagesliderJournal"}
                  images={renderjournal ? spreadData(renderjournal) : []}
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,

                    backgroundColor: "#white",
                  }}
                  customSlide={({ index, item, style, width }) => (
                    <View key={"tetts" + index}>
                      {item.map((dataX, index) => {
                        return (
                          <Pressable
                            key={"keyjournal" + index}
                            onPress={() =>
                              props.navigation.push("JournalStackNavigation", {
                                screen: "DetailJournal",
                                params: {
                                  dataPopuler: dataX,
                                },
                              })
                            }
                            style={{
                              flexDirection: "row",
                              width: width - 70,
                              padding: 5,
                              height: width * 0.2,
                            }}
                          >
                            {dataX && dataX.picture ? (
                              <Image
                                source={
                                  item.picture
                                    ? {
                                        uri: dataX.picture,
                                      }
                                    : null
                                }
                                style={{
                                  height: width * 0.15,
                                  width: width * 0.15,
                                  borderRadius: 5,
                                  margin: 5,
                                }}
                              ></Image>
                            ) : (
                              <Logofuntravianew height={55} width={55} />
                            )}

                            <View
                              style={{
                                paddingHorizontal: 10,
                                width: width - (100 + width * 0.15),
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  width: "100%",
                                }}
                              >
                                <Text
                                  style={{
                                    width: "80%",
                                  }}
                                  type="bold"
                                >
                                  <Truncate text={dataX.title} length={28} />
                                </Text>
                                <Text>
                                  <Truncate text={dataX.text} length={60} />
                                </Text>
                              </View>
                              <View
                                style={{
                                  zIndex: 900,
                                  marginTop: 30,
                                }}
                              >
                                {dataX.liked === false ? (
                                  <Ripple
                                    style={{
                                      backgroundColor: "#F3F3F3",
                                      height: 30,
                                      width: 30,
                                      borderRadius: 17,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onPress={() =>
                                      _likedjournal(dataX.id, index)
                                    }
                                  >
                                    <LikeEmpty height={15} width={15} />
                                  </Ripple>
                                ) : (
                                  <Ripple
                                    style={{
                                      backgroundColor: "#F3F3F3",
                                      height: 30,
                                      width: 30,
                                      borderRadius: 17,
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                    onPress={() =>
                                      _unlikedjournal(dataX.id, index)
                                    }
                                  >
                                    <LikeRed height={15} width={15} />
                                  </Ripple>
                                )}
                              </View>
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                  customButtons={(position, move) => (
                    <View
                      style={{
                        paddingTop: 10,
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      {(renderjournal ? spreadData(renderjournal) : []).map(
                        (image, index) => {
                          return (
                            <TouchableHighlight
                              key={"keyjournal1" + index}
                              underlayColor="#f7f7f700"
                              // onPress={() => move(index)}
                            >
                              <View
                                style={{
                                  height: position === index ? 5 : 5,
                                  width: position === index ? 15 : 5,
                                  borderRadius: position === index ? 7 : 3,
                                  backgroundColor:
                                    position === index ? "#209fae" : "#d3d3d3",
                                  marginHorizontal: 3,
                                }}
                              ></View>
                            </TouchableHighlight>
                          );
                        }
                      )}
                    </View>
                  )}
                />
              ) : (
                <View
                  style={{
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text>Travel Journal Empty</Text>
                </View>
              )}
            </View>
          </View>
        ) : null}
        {render?.city ? (
          <View
            style={{
              paddingHorizontal: 15,
              paddingVertical: 10,
              flexDirection: "column",
            }}
          >
            <Text type="bold" size="label" style={{}}>
              {t("popularDestination")}
            </Text>
            <Text
              size="description"
              style={{
                textAlign: "justify",
              }}
            >
              {t("Goodplacegoodtrip")}
            </Text>
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
              <ImageSlider
                key={"imslider"}
                images={render?.city ? render.city : []}
                style={{
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  backgroundColor: "#white",
                  width: Dimensions.get("screen").width - 69,
                }}
                customSlide={({ index, item, style, width }) => (
                  <View
                    key={"aaas" + index}
                    style={{
                      width: Dimensions.get("screen").width - 69,
                      alignItems: "center",
                      alignContent: "center",
                    }}
                  >
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        textAlign: "center",
                        marginTop: 3,
                      }}
                    >
                      <Capital text={item.name} />
                    </Text>
                    <Ripple
                      onPress={() => {
                        props.navigation.navigate("CountryStack", {
                          screen: "CityDetail",
                          params: {
                            data: {
                              city_id: item.id,
                              city_name: item.name,
                            },
                            exParam: true,
                          },
                        });
                      }}
                      style={{
                        height: width * 0.4,
                        width: "100%",
                        borderRadius: 10,
                        marginVertical: 2,
                      }}
                    >
                      <Image
                        style={{
                          height: "100%",
                          width: "100%",
                          borderRadius: 10,
                        }}
                        source={
                          item.cover ? { uri: item.cover } : default_image
                        }
                      ></Image>
                    </Ripple>
                    <View
                      style={{
                        width: "100%",
                        flexWrap: "wrap",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                      }}
                    >
                      {item.destination && item.destination.length > 0 ? (
                        <FlatList
                          listKey={(item, index) => "D" + index.toString()}
                          data={item.destination}
                          numColumns={4}
                          renderItem={({ item, index }) => (
                            <Ripple
                              onPress={() => {
                                //   props.navigation.navigate("detailStack", {
                                //     id: item.id,
                                //     name: item.name,
                                //   });
                                // }}

                                props.navigation.push(
                                  "DestinationUnescoDetail",
                                  {
                                    id: item.id,
                                    name: item.name,
                                    token: token,
                                  }
                                );
                              }}
                              style={{
                                // width: (width - 60) / 4,
                                alignContent: "center",
                                alignItems: "center",
                                borderColor: "#209fae",
                                padding: 2,
                              }}
                            >
                              <Image
                                style={{
                                  borderRadius: 10,
                                  height: (width - 80) / 4,
                                  width: (width - 88) / 4,
                                }}
                                source={
                                  item.images
                                    ? {
                                        uri: item.images[0].image,
                                      }
                                    : default_image
                                }
                              ></Image>
                              <Text
                                size="small"
                                type="bold"
                                style={{
                                  textAlign: "center",
                                  marginTop: 3,
                                }}
                              >
                                <Truncate
                                  text={Capital({
                                    text: item.name,
                                  })}
                                  length={13}
                                />
                              </Text>
                            </Ripple>
                          )}
                        />
                      ) : (
                        <View
                          style={{
                            flex: 1,
                            paddingTop: 100,
                            alignContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text>{null}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
                customButtons={(position, move) => (
                  <View
                    style={{
                      paddingVertical: 10,
                      alignContent: "center",
                      alignItems: "center",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    {(render.city.length ? render.city : []).map(
                      (image, index) => {
                        return (
                          <TouchableHighlight
                            key={"keycity" + index}
                            underlayColor="#f7f7f700"
                            // onPress={() => move(index)}
                          >
                            <View
                              style={{
                                height: position === index ? 5 : 5,
                                width: position === index ? 15 : 5,
                                borderRadius: position === index ? 7 : 3,
                                backgroundColor:
                                  position === index ? "#209fae" : "#d3d3d3",
                                marginHorizontal: 3,
                              }}
                            ></View>
                          </TouchableHighlight>
                        );
                      }
                    )}
                  </View>
                )}
              />
            </View>
          </View>
        ) : null}

        {/*  artikel */}
        {render?.article_type && render.article_type.length > 0 ? (
          <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              flexDirection: "column",
            }}
          >
            <View>
              {i18n.language === "id" ? (
                <Text size="label" type="bold" style={{}}>
                  {t("uniquefacts")}

                  <Capital text={render?.name} />
                </Text>
              ) : (
                <Text size="label" type="bold" style={{}}>
                  <Capital text={render?.name} />

                  {t("uniquefacts")}
                </Text>
              )}

              <Text
                size="description"
                style={{
                  textAlign: "justify",
                }}
              >
                {t("Explorefindout")}
              </Text>
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  minHeight: 50,
                  justifyContent: "center",
                  //   padding: 10,
                  backgroundColor: "#FFF",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 5,
                  },
                  width: "100%",
                  shadowOpacity: 0.1,
                  shadowRadius: 6.27,
                  elevation: 6,
                }}
              >
                <Image
                  style={{
                    height: width * 0.4,
                    width: "100%",
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  }}
                  source={render ? { uri: render.cover_facts } : default_image}
                ></Image>
                <View
                  style={{
                    width: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    backgroundColor: "#209FAE",
                  }}
                >
                  <Text size="label" type="bold" style={{ color: "white" }}>
                    Indonesian Facts
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  <Renderfact
                    data={
                      render.article_type && render.article_type.length > 0
                        ? render.article_type
                        : []
                    }
                    header={render.name + " " + t("unique facts")}
                    country={props.route.params.data.id}
                  />
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* Essential with Tabs */}
        <View
          style={{
            paddingVertical: 10,
            paddingHorizontal: 15,
            width: "100%",
          }}
        >
          <Text size="label" type="bold" style={{}}>
            {t("essentials")}
          </Text>
          <Text size="description">{t("gooddestinationtrip")}</Text>
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
            <Tabs
              tabBarUnderlineStyle={{
                backgroundColor: "#209FAE",
              }}
              tabContainerStyle={{
                backgroundColor: "white",
                elevation: 0,
              }}
              // locked={false}
            >
              <Tab
                heading={t("About")}
                tabStyle={{
                  backgroundColor: "white",
                  elevation: 0,
                  borderBottomColor: "#209FAE",
                  borderBottomWidth: 0.5,
                }}
                activeTabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#209FAE",
                  borderBottomWidth: 0.5,
                }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: "#209FAE",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    paddingVertical: 10,
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  {render?.about.length > 0
                    ? render.about.map((item, index) => (
                        <Ripple
                          key={"keyabout" + index}
                          onPress={() => {
                            props.navigation.navigate("AboutCountry", {
                              active: item.id,
                              country_id: render.id,
                              indexcountry: index,
                            });
                          }}
                          style={{
                            width: "33.333%",
                            alignContent: "center",
                            alignItems: "center",
                            padding: 5,
                          }}
                        >
                          <View style={{ height: 45 }}>
                            <FunIcon
                              icon={item.icon ? item.icon : "w-fog"}
                              height={40}
                              width={40}
                              style={{
                                bottom: -3,
                              }}
                            />
                          </View>
                          <Text
                            size="small"
                            style={{
                              textAlign: "center",
                              marginTop: 5,
                            }}
                          >
                            {item.name}
                          </Text>
                        </Ripple>
                      ))
                    : null}
                </View>
              </Tab>

              <Tab
                heading={t("Practical")}
                tabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#209FAE",
                  borderBottomWidth: 0.5,
                }}
                activeTabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#209FAE",
                  borderBottomWidth: 0.5,
                }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 14,
                  color: "#209FAE",
                }}
              >
                <View
                  style={{
                    width: "100%",
                    paddingVertical: 20,
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  {render?.practical.length > 0
                    ? render.practical.map((item, index) => (
                        <Ripple
                          key={"keypractical" + index}
                          onPress={() => {
                            props.navigation.navigate("PracticalCountry", {
                              active: item.id,
                              country_id: render.id,
                              indexcountry: index,
                            });
                          }}
                          style={{
                            width: "33.333%",
                            alignContent: "center",
                            alignItems: "center",
                            padding: 5,
                          }}
                        >
                          <View style={{ height: 45 }}>
                            <FunIcon
                              icon={item.icon ? item.icon : "w-fog"}
                              height={40}
                              width={40}
                              style={{
                                bottom: -3,
                              }}
                            />
                          </View>
                          <Text
                            size="small"
                            style={{
                              textAlign: "center",
                              marginTop: 5,
                            }}
                          >
                            {item.name}
                          </Text>
                        </Ripple>
                      ))
                    : null}
                </View>
              </Tab>
            </Tabs>
          </View>
        </View>
      </View>
    );
  };
  const RenderArticle = (e, dataR) => {
    let render = [];
    render = dataR;
    return (
      <View
        // key={"art" + index}
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
                      <View style={{ marginVertical: 10 }}>
                        {i.title ? (
                          <Text size="label" type="bold">
                            {i.title}
                          </Text>
                        ) : null}

                        <View
                          style={{
                            alignItems: "center",
                            marginTop: i.title ? 20 : 0,
                          }}
                        >
                          <FunImage
                            source={i.image ? { uri: i.image } : default_image}
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              borderColor: "#d3d3d3",

                              height: Dimensions.get("screen").width * 0.4,
                              width: "100%",
                            }}
                          />
                        </View>
                        <Text
                          size="description"
                          type="light"
                          style={{
                            textAlign: "left",
                            marginTop: 5,
                            color: "#616161",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    ) : (
                      <View style={{ marginVertical: 10 }}>
                        {i.title ? (
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              // marginBottom: 5,
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
                            marginTop: i.title ? 20 : 0,
                            lineHeight: 20,
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
  // renderTabView
  const renderTabView = () => {
    return (
      <TabView
        key={"tabviews"}
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
          scrollRef.current?.scrollToIndex({
            // y: 0,
            // x: 100,
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

  let [loadings, setLoadings] = useState(true);

  if (loadings) {
    return (
      <SkeletonPlaceholder>
        <View
          style={{
            width: Dimensions.get("screen").width,
          }}
        >
          <View
            style={{
              width: "100%",
              height: 300,
            }}
          ></View>
          <View
            style={{
              width: "100%",
              height: 40,
            }}
          ></View>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              height: 50,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                width: 60,
                height: 10,
                marginTop: 20,
              }}
            ></View>
            <View
              style={{
                width: 60,
                height: 10,
                marginLeft: 20,
                marginTop: 20,
              }}
            ></View>
            <View
              style={{
                width: 60,
                height: 10,
                marginLeft: 20,
                marginTop: 20,
              }}
            ></View>
            <View
              style={{
                width: 60,
                height: 10,
                marginLeft: 20,
                marginTop: 20,
              }}
            ></View>
            <View
              style={{
                width: 60,
                height: 10,
                marginLeft: 20,
                marginTop: 20,
              }}
            ></View>
          </View>
          <View
            style={{
              width: "100%",
              height: 2,
            }}
          ></View>
          <View
            style={{
              width: "100%",
              // height:20,
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            <View
              style={{
                width: 120,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                marginTop: 10,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                height: 10,
              }}
            ></View>

            <View
              style={{
                width: 120,
                marginTop: 10,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                marginTop: 5,
                height: 10,
              }}
            ></View>
            <View
              style={{
                width: "100%",
                height: 200,
                marginTop: 10,
                borderRadius: 5,
              }}
            ></View>
          </View>
        </View>
      </SkeletonPlaceholder>
    );
  }
  return (
    <View style={styles.container}>
      <StaBar backgroundColor="#14646e" barStyle="light-content" />
      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          flexDirection: "row",
          justifyContent: "space-between",
          alignContent: "center",
          alignItems: "center",
          height: 55,
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
            marginLeft: 8,
          }}
        >
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        </Button>
        <TouchableOpacity
          onPress={(x) =>
            props.navigation.push("SearchPg", {
              idcountry: data.country_detail.id,
              searchInput: "",
              locationname: data?.country_detail?.name,
              aktifsearch: true,
            })
          }
          style={{
            width: Dimensions.get("screen").width - 90,
            backgroundColor: "rgba(0,0,0,0.2)",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Image
            source={search_button}
            style={{
              height: 20,
              width: 20,
              resizeMode: "contain",
              marginHorizontal: 10,
            }}
          ></Image>
          {/* <Input
            value={search}
            style={{
              height: 20,
              padding: 0,
              textAlign: "left",
              fontFamily: "Lato-Regular",
              fontSize: 14,
              color: "white",
            }}
            placeholderTextColor={"white"}
            underlineColorAndroid="transparent"
            onChangeText={(x) => setTextc(x)}
            placeholder={"Search in " + data?.country_detail?.name}
            returnKeyType="search"
            onSubmitEditing={(x) =>
              props.navigation.push("SearchPg", {
                idcountry: data.country_detail.id,
                searchInput: search,
                aktifsearch: true,
              })
            }
          /> */}
          <Text
            size="readable"
            type="bold"
            style={{
              color: "#FFFFFF",
            }}
          >
            {t("searchin") + data?.country_detail?.name}
          </Text>
        </TouchableOpacity>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          // onPress={() => setshowside(true)}
          style={{
            height: 50,
          }}
        >
          {/* <OptionsVertWhite height={20} width={20}></OptionsVertWhite> */}
        </Button>
      </Animated.View>
      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    height: Dimensions.get("screen").height,
    width: Dimensions.get("screen").width,
    flex: 1,
  },
  activeTextStyle: {
    fontFamily: "Lato-Bold",
    color: "#209FAE",
  },
  container: {
    flex: 1,
    height: screenHeight / 2,
  },
  // overlay: {
  // 	height: screenHeight / 2,
  // },
  textStyle: {
    marginLeft: 10,
    padding: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
    alignSelf: "flex-start",
    position: "absolute",
    fontFamily: "Lato-Regular",
  },
  balanceContainer: {
    padding: 10,
  },
  ImageView: {
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",

    backgroundColor: "rgba(20,20,20,0.4)",
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
  destinationMainImageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  destinationMainImage: {
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "black",
  },
  destinationImageView: {
    width: (Dimensions.get("window").width - 37) / 3,
    height: (Dimensions.get("window").width - 37) / 3,
    marginRight: 5,
    borderRadius: 10,
  },
  destinationImage: {
    resizeMode: "cover",
    borderRadius: 10,
  },

  fill: {
    flex: 1,
  },
  row: {
    height: 40,
    margin: 16,
    backgroundColor: "#D3D3D3",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: SafeStatusBar,
    left: 0,
    right: 0,
    backgroundColor: "#209fae",
    overflow: "hidden",
  },
  bar: {
    marginTop: 28,
    height: 32,
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    backgroundColor: "transparent",
    color: "white",
  },
  scrollViewContent: {
    marginTop: HEADER_MAX_HEIGHT,
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

  // Style terbaru
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  indicatormax: { backgroundColor: "#209FAE", height: 0 },
  indicatormin: { backgroundColor: "#209FAE", height: 2 },
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },

  labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },

  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFCC80",
    height: TabBarHeight,
  },
});
