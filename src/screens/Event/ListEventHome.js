import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  StatusBar,
  ActivityIndicator,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import DeviceInfo from "react-native-device-info";
import {
  Button,
  CustomImage,
  FunImageBackground,
  StatusBar as StaBar,
  Text,
  Truncate,
} from "../../component";
import {
  Arrowbackwhite,
  Bottom,
  Down,
  FilterBlack,
  LikeEmpty,
  LikeRed,
  Search,
  Xhitam,
} from "../../assets/svg";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import ListEventGQL from "../../graphQL/Query/Event/ListEvent2";
import CategoryEvent from "../../graphQL/Query/Event/FilterEvent";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";
import { default_image, CalenderGrey, MapIconGreen } from "../../assets/png";
import { dateFormatBetween } from "../../component/src/dateformatter";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const Notch = DeviceInfo.hasNotch();
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});
const tab1ItemSize = (width - 30) / 2;
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

export default function ListEventHome(props) {
  let [heightjudul, setheightjudul] = useState(150);
  let HeaderHeight = Dimensions.get("screen").height * 0.15 + heightjudul;
  let [heightview, setheight] = useState(0);
  const { t, i18n } = useTranslation();

  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: "All Event" },
    { key: "tab2", title: "Public Event" },
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const [tab1Data, setTab1] = useState([]);
  const [tab2Data, setTab2] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerScrollY = useRef(new Animated.Value(0)).current;
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);
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

  const HeaderComponent = {
    headerShown: true,
    title: "List Event",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Event",
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
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
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }
  };

  const refresh = async () => {
    // console.log("-- start refresh");
    refreshStatusRef.current = true;
    // await GetListEvent();
    // await GetEventCategory();
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      // console.log("-- refresh done!");
      refreshStatusRef.current = false;
    });
  };

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [heightview, HeaderHeight],
      outputRange: [0, -HeaderHeight + heightview],
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          // top: SafeStatusBar,
          height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "absolute",
          backgroundColor: "#fff",
          // marginTop: 50,
          // borderWidth: 1,
        }}
      >
        <Image
          source={default_image}
          style={{
            height: Dimensions.get("screen").height * 0.15,
            width: "100%",
            resizeMode: "cover",
          }}
        />
        <View
          onLayout={(events) => {
            var { x, y, width, height } = events.nativeEvent.layout;
            setheightjudul(height);
          }}
          style={{
            padding: 15,
          }}
        >
          <Text
            size="label"
            type="bold"
            style={{
              marginBottom: 15,
              textAlign: "justify",
            }}
          >
            Thousands of Events Worldwide Tailored to Your Passion. Discover
            experiences.
          </Text>
          <Text
            style={{
              textAlign: "justify",
            }}
          >
            From concerts to films to spa to theme parks to tours and various
            other enriching activities, discover experiences that suit your
            passions easily!
          </Text>
        </View>
      </Animated.View>
    );
  };

  const rednerTab1Item = ({ item, index }) => {
    return (
      <View
        style={{
          justifyContent: "center",
          //   flex: 1,
          //   width: "50%",
          width: (Dimensions.get("screen").width - 40) / 2,
          height: Dimensions.get("screen").width * 0.7,
          margin: 5,
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 5,
          shadowColor: "gray",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 3,
          elevation: 3,
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 15,
            left: 10,
            right: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            zIndex: 9999,
          }}
        >
          <View
            style={{
              // bottom: (9),
              height: 21,
              minWidth: 60,
              borderRadius: 11,
              alignSelf: "center",
              justifyContent: "center",
              backgroundColor: "rgba(226, 236, 248, 0.85)",
              paddingHorizontal: 10,
            }}
          >
            <Text
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              {item.category.name}
            </Text>
          </View>
          <View
            style={{
              height: 26,
              width: 26,
              borderRadius: 50,
              alignSelf: "center",
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
              backgroundColor: "rgba(226, 236, 248, 0.85)",
              // zIndex: 999,
            }}
          >
            {item.liked === false ? (
              <TouchableOpacity
                style={{
                  height: 26,
                  width: 26,
                  borderRadius: 50,
                  alignSelf: "center",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",

                  zIndex: 9999,
                }}
                onPress={() => _liked(item.id)}
              >
                <LikeEmpty height={13} width={13} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  height: 26,
                  width: 26,
                  borderRadius: 50,
                  alignSelf: "center",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",

                  zIndex: 9999,
                }}
                onPress={() => _unliked(item.id)}
              >
                <LikeRed height={13} width={13} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={() => eventdetail(item)}
          style={{
            height: Dimensions.get("window").width * 0.47 - 16,
          }}
        >
          <FunImageBackground
            key={item.id}
            source={
              item.images.length
                ? { uri: item.images[0].image }
                : { uri: default_image }
            }
            style={[styles.ImageView]}
            imageStyle={[styles.Image]}
          />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-around",
            height: 230,
            marginVertical: 5,
            marginHorizontal: 10,
          }}
        >
          <Text
            onPress={() => eventdetail(item)}
            size="label"
            type="bold"
            style={{}}
          >
            <Truncate text={item.name} length={27} />
          </Text>
          <View
            style={{
              height: "50%",
              flexDirection: "column",
              justifyContent: "space-around",
            }}
          >
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                width: "100%",
                borderColor: "grey",
              }}
            >
              <CustomImage
                customStyle={{
                  width: 15,
                  height: 15,
                  marginRight: 5,
                }}
                customImageStyle={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={MapIconGreen}
              />
              <Text
                size="small"
                style={{
                  width: "100%",
                }}
              >
                {item.city.name}
              </Text>
            </View>
            <View
              style={{
                // flex: 1,
                flexDirection: "row",
                width: "100%",
                marginBottom: 3,
              }}
            >
              <CustomImage
                customStyle={{
                  width: 15,
                  height: 15,
                  marginRight: 5,
                }}
                customImageStyle={{
                  width: 15,
                  height: 15,
                  resizeMode: "contain",
                }}
                source={CalenderGrey}
              />
              <Text
                size="small"
                style={{
                  paddingRight: 20,
                  width: "100%",
                }}
              >
                {dateFormatBetween(item.start_date, item.end_date)}
              </Text>
            </View>
          </View>
        </View>
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
          paddingTop: HeaderHeight + TabBarHeight + heightview,
          paddingHorizontal: 10,
          minHeight: height - SafeStatusBar + HeaderHeight + heightview,
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
      inputRange: [heightview, HeaderHeight],
      outputRange: [HeaderHeight, heightview],
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
          borderBottomWidth: 2,
          borderBottomColor: "#daf0f2",
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
            backgroundColor: "#fff",
            height: TabBarHeight,
          }}
          renderLabel={({ route, focused }) => (
            <Text
              size="label"
              type="bold"
              style={{ opacity: focused ? 1 : 0.5 }}
            >
              {route.title}
            </Text>
          )}
          indicatorStyle={{ backgroundColor: "#209fae" }}
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
      ),
    });
  };

  let [token, setToken] = useState("");
  let [show, setshow] = useState(true);
  let [dataFilterCategori, setdataFilterCategori] = useState([]);
  let [search, setSearch] = useState({
    type: null,
    tag: null,
    keyword: null,
  });

  const { data, loading, error } = useQuery(ListEventGQL, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search.keyword,
      type: search.type,
      cities:
        search.city && search.city.length > 0
          ? search.city
          : props.route.params && props.route.params.idcity
          ? [props.route.params.idcity]
          : null,
      countries:
        search.country && search.country.length > 0
          ? search.country
          : props.route.params && props.route.params.idcountries
          ? [props.route.params.idcountries]
          : null,
      price_start: null,
      price_end: null,
      date_from: null,
      date_until: null,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setTab1(data.event_list_v2);
    },
  });

  const { data: dataFillter, loading: loadingcat, error: errorcat } = useQuery(
    CategoryEvent,
    {
      fetchPolicy: "network-only",
      onCompleted: () => {
        setdataFilterCategori(dataFillter.event_filter.type);
      },
    }
  );

  const _setSearch = async (txt) => {
    let data = { ...search };
    data["keyword"] = txt;
    await setSearch(data);
  };

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
  ] = useMutation(UnLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const _liked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationliked({
          variables: {
            event_id: id,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.setEvent_wishlist.code === 200 ||
            response.data.setEvent_wishlist.code === "200"
          ) {
            var tempData = [...dataEvent];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = true;
            setDataEvent(tempData);
          } else {
            throw new Error(response.data.setEvent_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unliked = async (id) => {
    if (token || token !== "") {
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "event",
          },
        });
        if (loadingUnLike) {
          Alert.alert("Loading!!");
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
            // _Refresh();
            var tempData = [...dataEvent];
            var index = tempData.findIndex((k) => k["id"] === id);
            tempData[index].liked = false;
            setDataEvent(tempData);
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await refresh();
  };

  const eventdetail = (data) => {
    props.navigation.navigate("eventdetail", {
      data: data,
      // event_id: data.id,
      name: data.name,
      token: token,
    });
  };

  let HEADER_MAX_HEIGHT = HeaderHeight;
  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 30, 100],
    extrapolate: "clamp",
  });

  const _handleCheck = async (id, index, item) => {
    let tempe = [...dataFilterCategori];
    let items = { ...item };
    items.checked = !items.checked;
    tempe.splice(index, 1, items);
    await setdataFilterCategori(tempe);
  };

  const UpdateFilter = async () => {
    let hasil = [];
    for (var x of dataFilterCategori) {
      if (x.checked === true) {
        hasil.push(x.id);
      }
    }

    let data = { ...search };
    data["type"] = hasil;
    await console.log(data);
    await setSearch(data);
    await setshow(false);
  };

  const ClearAllFilter = async () => {
    let tempe = [...dataFilterCategori];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      data.checked = false;
      await tempes.push(data);
    }
    await setdataFilterCategori(tempes);

    await setSearch({
      type: null,
      tag: null,
      keyword: null,
    });
    await setshow(false);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <StaBar backgroundColor="#14646e" barStyle="light-content" /> */}
      {renderTabView()}
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setheight(height);
        }}
        style={{
          flexDirection: "row",
          zIndex: 5,
          padding: 15,
          backgroundColor: "#fff",
          position: "absolute",
          top: 0,
        }}
      >
        <Button
          size="small"
          type="icon"
          variant="bordered"
          color="black"
          onPress={() => {
            setshow(true);
          }}
          style={{
            marginRight: 10,
            // paddingHorizontal: 10,
          }}
        >
          <FilterBlack width={15} height={15} />
          <Text
            style={{
              fontFamily: "Lato-Regular",
              // color: "#464646",
              fontSize: 13,
              alignSelf: "center",
              marginLeft: 5,
            }}
          >
            {t("filter")}
          </Text>
        </Button>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            borderRadius: 5,
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            paddingHorizontal: 10,
          }}
        >
          <Search width={15} height={15} />

          <TextInput
            underlineColorAndroid="transparent"
            placeholder={t("search")}
            style={{
              width: "100%",
              // borderWidth: 1,
              marginLeft: 5,
              padding: 0,
            }}
            returnKeyType="search"
            onChangeText={(x) => _setSearch(x)}
            onSubmitEditing={(x) => _setSearch(x)}
          />
        </View>
      </View>
      {renderHeader()}
      {renderCustomRefresh()}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          alignContent: "center",
          alignItems: "center",
          transform: [{ translateY: imageOpacity }],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#209fae",
              borderWidth: 2,
              borderRightWidth: 0,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderBottomLeftRadius: 20,
              borderTopStartRadius: 20,
              borderColor: "#d1d1d1",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              width: Dimensions.get("screen").width * 0.25,
            }}
          >
            <Text
              size="label"
              numberOfLines={1}
              style={{
                marginRight: 10,
                color: "#fff",
              }}
            >
              Indonesia
            </Text>
            <Down width={10} height={10} style={{ marginTop: 5 }} />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: "#209fae",
              borderWidth: 2,
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderBottomRightRadius: 20,
              borderTopEndRadius: 20,
              borderColor: "#d1d1d1",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              width: Dimensions.get("screen").width * 0.25,
            }}
          >
            <Text
              size="label"
              numberOfLines={1}
              style={{
                marginRight: 10,
                color: "#fff",
              }}
            >
              Jun - 2020
            </Text>
            <Down width={10} height={10} style={{ marginTop: 5 }} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <Modal
        // onLayout={() => dataCountrySelect()}
        isVisible={show}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            height: 10,

            backgroundColor: "#209fae",
          }}
        ></View>
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.75,
            width: Dimensions.get("screen").width,
            backgroundColor: "white",
            // borderTopLeftRadius: 15,
            // borderTopRightRadius: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 15,
              paddingVertical: 20,
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                // fontSize: 20,
                // fontFamily: "Lato-Bold",
                color: "#464646",
              }}
            >
              Filter
            </Text>
            <TouchableOpacity
              style={{
                position: "absolute",
                backgroundColor: "with",
                height: 35,
                width: 32,
                top: 0,
                right: 0,
                justifyContent: "flex-end",
                alignContent: "flex-end",
                alignItems: "flex-start",
              }}
              onPress={() => setshow(false)}
            >
              <Xhitam height={15} width={15} />
            </TouchableOpacity>
          </View>
          {/* ==================garis========================= */}
          <View
            style={{
              borderBottomColor: "#D1D1D1",
              borderBottomWidth: 1,
            }}
          />
          {/* ==================garis========================= */}

          <ScrollView
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              paddingBottom: 70,
            }}
          >
            <Text
              type="bold"
              size="title"
              style={{
                // fontSize: 20,
                // fontFamily: "Lato-Bold",
                color: "#464646",
                marginTop: 10,
              }}
            >
              {t("categories")}
            </Text>
            <FlatList
              contentContainerStyle={{
                paddingVertical: 15,
                paddingRight: 10,
                width: width - 40,
              }}
              data={dataFilterCategori}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => _handleCheck(item["id"], index, item)}
                  style={{
                    flexDirection: "row",
                    backgroundColor: "white",
                    // borderColor: "#464646",
                    width: "49%",
                    marginRight: 3,
                    marginBottom: 20,
                    justifyContent: "flex-start",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CheckBox
                    onCheckColor="#FFF"
                    lineWidth={2}
                    onFillColor="#209FAE"
                    onTintColor="#209FAE"
                    boxType={"square"}
                    style={{
                      alignSelf: "center",
                      width: Platform.select({
                        ios: 30,
                        android: 35,
                      }),
                      transform: Platform.select({
                        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                        android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                      }),
                    }}
                    onValueChange={() => _handleCheck(item["id"], index, item)}
                    value={item["checked"]}
                  />

                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 0,
                      color: "#464646",
                    }}
                  >
                    {item["name"]}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              showsHorizontalScrollIndicator={false}
              scrollEnabled={false}
              // extraData={selected}
            ></FlatList>
            {/* <View
              style={{ borderBottomWidth: 1, borderBottomColor: "#D1D1D1" }}
            ></View> */}
          </ScrollView>
          <View
            style={{
              flex: 1,
              zIndex: 6,
              flexDirection: "row",
              height: 80,
              position: "absolute",
              bottom: 0,
              justifyContent: "space-around",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#ffffff",
              width: Dimensions.get("screen").width,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              padding: 10,
              paddingHorizontal: 10,
            }}
          >
            <Button
              variant="bordered"
              color="secondary"
              onPress={() => ClearAllFilter()}
              style={{ width: Dimensions.get("screen").width / 2 - 20 }}
              text={t("clearAll")}
            ></Button>
            <Button
              onPress={() => UpdateFilter()}
              style={{ width: Dimensions.get("screen").width / 2 - 20 }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
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
});
