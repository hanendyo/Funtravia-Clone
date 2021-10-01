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
  Pressable,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import DeviceInfo from "react-native-device-info";
import {
  Button,
  Capital,
  CustomImage,
  FunIcon,
  FunImageBackground,
  FunImage,
  StatusBar as StaBar,
  Text,
  Truncate,
} from "../../component";
import {
  Arrowbackios,
  Arrowbackwhite,
  Bottom,
  Check,
  Down,
  FilterBlack,
  FilterIcon,
  Filternewbiru,
  LikeEmpty,
  LikeRed,
  Search,
  SearchWhite,
  Xhitam,
} from "../../assets/svg";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import ListEventGQL from "../../graphQL/Query/Event/ListEvent2";
import ListEventPublic from "../../graphQL/Query/Event/ListEventPublic";
import CategoryEvent from "../../graphQL/Query/Event/FilterEvent";
import BannerApps from "../../graphQL/Query/Home/BannerApps";
import Liked from "../../graphQL/Mutation/Event/likedEvent";
import UnLiked from "../../graphQL/Mutation/unliked";
import {
  default_image,
  CalenderGrey,
  MapIconGreen,
  Eventcover,
} from "../../assets/png";
import { dateFormatBetween } from "../../component/src/dateformatter";
import Modal from "react-native-modal";
import CheckBox from "@react-native-community/checkbox";
import { Alert } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { RNToasty } from "react-native-toasty";
import { color } from "react-native-reanimated";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 60;
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
  const HeaderHeightCustom = Platform.select({
    ios: Notch ? 360 - 48 : 360 - 20,
    // android: 305 - StatusBar.currentHeight,
    // android: 320 - StatusBar.currentHeight,
    android: 340 - StatusBar.currentHeight,
  });
  let [heightview, setheight] = useState(0);
  const { t, i18n } = useTranslation();

  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: t("allevent") },
    { key: "tab2", title: t("publicevent") },
  ]);
  const [canScroll, setCanScroll] = useState(true);
  const [dataEvent, setdataEvent] = useState([]);
  const [dataEventPublic, setdataEventPublic] = useState([]);
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
    // title: "List Event",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: t("event"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
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
        {Platform.OS == "ios" ? (
          <Arrowbackios height={20} width={20}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
    headerRight: () => (
      <TouchableOpacity
        style={styles.searchWhite}
        // hitSlop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        onPress={() => props.navigation.navigate("searchListEventHome")}
      >
        <SearchWhite width="20" height="20" />
      </TouchableOpacity>
    ),
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    // loadAsync();
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

  useEffect(() => {
    // props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

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

  let [gerakan, setgerakan] = useState(new Animated.Value(0));

  const displays = gerakan.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  let [y, sety] = useState(0);

  const onMomentumScrollBegin = (e) => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
  };

  const onScrollEndDrag = (e) => {
    const positionX = e.nativeEvent.contentOffset.x;
    const positionY = e.nativeEvent.contentOffset.y;
    if (positionY < y) {
      sety(positionY);
      Animated.timing(gerakan, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else if (positionY > y) {
      sety(positionY);
      Animated.timing(gerakan, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }

    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }
  };

  const refresh = async () => {
    refreshStatusRef.current = true;
    await getdataEvent();
    await getdataEventPublic();
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      refreshStatusRef.current = false;
    });
  };

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [heightview, HeaderHeight],
      outputRange:
        Platform.OS == "ios"
          ? [heightview, -HeaderHeight - 40]
          : [heightview, -HeaderHeight - 40],
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={{
          position: "absolute",
          transform: [{ translateY: y }],
          // height: Platform.OS == "ios" ? 270 : 222,
          height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "flex-start",
          backgroundColor: "white",
          zIndex: Platform.OS == "ios" ? 1 : 0,
        }}
      >
        {Banner && Banner.banner_asset.length > 0 ? (
          <FunImage
            source={{ uri: Banner.banner_asset[0].filepath }}
            style={{
              height:
                Platform.OS == "ios"
                  ? Notch
                    ? Dimensions.get("screen").height * 0.2
                    : Dimensions.get("screen").height * 0.22
                  : Dimensions.get("screen").height * 0.2,
              // height: 0.1,
              width: "100%",
              resizeMode: "cover",
              marginBottom: 0,
            }}
          />
        ) : (
          <Image
            source={Eventcover}
            style={{
              height: Dimensions.get("screen").height * 0.2,
              width: "100%",
              resizeMode: "cover",
              position: "absolute",
            }}
          />
        )}
        <View
          onLayout={(events) => {
            var { x, y, width, height } = events.nativeEvent.layout;
            setheightjudul(height);
          }}
          style={{
            paddingHorizontal: 20,
            paddingTop: 35,
            backgroundColor: "white",
            // borderWidth: 2,
            // height: Platform.OS == "ios" ? 120 : 125
          }}
        >
          <Text
            size="label"
            type="bold"
            style={{
              textAlign: "justify",
              paddingBottom: 5,
            }}
          >
            {Banner && Banner.title
              ? Banner.title
              : "Thousands of Events Worldwide Tailored to Your Passion. Discover experiences."}
          </Text>
          <Text
            style={{
              textAlign: "justify",
              marginBottom: Platform.OS == "ios" ? (Notch ? 10 : 15) : 10,
            }}
          >
            {Banner && Banner.description
              ? Banner.description
              : "From concerts to films to spa to theme parks to tours and various other enriching activities, discover experiences that suit your passions easily!"}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            // top: HeaderHeightCustom - 160,
            top:
              HeaderHeightCustom -
              (Platform.OS == "ios" ? (Notch ? 155 : 215) : 183),
            // paddingBottom: 20,
            // marginTop: Platform.OS == "ios" ? 158 : 135,
            // marginTop: Platform.OS == "ios" ? 158 : 160,

            // zIndex: 1
          }}
        >
          <TouchableOpacity
            onPress={() => setModelSetNegara(true)}
            style={{
              backgroundColor: "#209fae",
              borderWidth: 2,
              borderRightWidth: 0,
              // paddingVertical: 10,
              paddingHorizontal: 20,
              borderBottomLeftRadius: 20,
              borderTopStartRadius: 20,
              borderColor: "#d1d1d1",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: Dimensions.get("screen").width * 0.3,
            }}
          >
            <Text
              size="label"
              numberOfLines={1}
              style={{
                marginRight: 10,
                color: "#fff",
                paddingBottom: 5,
              }}
            >
              {Capital({ text: country?.name })}
            </Text>
            <Down width={10} height={10} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModaldate(true);
            }}
            style={{
              backgroundColor: "#209fae",
              borderWidth: 2,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderBottomRightRadius: 20,
              borderTopEndRadius: 20,
              borderColor: "#d1d1d1",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: Dimensions.get("screen").width * 0.3,
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
              {month}
            </Text>
            <Down width={10} height={10} style={{ marginTop: 5 }} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    );
  };

  const handlerepeat = (date) => {
    let dates = date.split("-");
    return t("setiap") + " " + monthNames[parseFloat(dates[0]) - 1];
  };

  const rederTab1Item = ({ item, index }, position) => {
    return (
      <View
        style={{
          justifyContent: "center",
          width: (Dimensions.get("screen").width - 40) / 2,
          height: Dimensions.get("screen").width * 0.7,
          margin: 5,
          flexDirection: "column",
          backgroundColor: "white",
          borderRadius: 5,
          shadowColor: "gray",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.5,
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
                onPress={() => _liked(item.id, item, position)}
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
                onPress={() => _unliked(item.id, item, position)}
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
              item.cover
                ? { uri: item.cover }
                : item.images.length > 0
                ? { uri: item.images[0].image }
                : { default_image }
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
                alignContent: "center",
                alignItems: "center",
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
              {item.is_repeat === true ? (
                <Text
                  size="small"
                  style={{
                    paddingRight: 20,
                    width: "100%",
                  }}
                >
                  {handlerepeat(item.start_date, item.end_date)}
                </Text>
              ) : (
                <Text
                  size="small"
                  style={{
                    paddingRight: 20,
                    width: "100%",
                  }}
                >
                  {dateFormatBetween(item.start_date, item.end_date)}
                </Text>
              )}
            </View>
          </View>
        </View>
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
        data = dataEvent;
        renderItem = (e) => rederTab1Item(e, "all");
        break;
      case "tab2":
        numCols = 2;
        data = dataEvent;
        data = dataEventPublic;
        renderItem = (e) => rederTab1Item(e, "public");
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
                    nativeEvent: {
                      contentOffset: { y: scrollY },
                    },
                  },
                ],
                { useNativeDriver: true }
              )
            : null
        }
        onMomentumScrollBegin={(e) => onMomentumScrollBegin(e)}
        onScrollEndDrag={(e) => onScrollEndDrag(e)}
        onMomentumScrollEnd={onMomentumScrollEnd}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        // ListHeaderComponent={() => <View style={{ height: -100 }} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight - 15,
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
      inputRange: [heightview - 10, HeaderHeight],
      outputRange: [HeaderHeight, heightview - 40],
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          zIndex: Platform.OS == "ios" ? 1 : 1,
          transform: [{ translateY: y }],
          width: "100%",
          borderBottomWidth: 2,
          borderBottomColor: "#daf0f2",
          marginTop: Platform.OS == "ios" ? (Notch ? 40 : 35) : 30,
          marginBottom: Platform.OS == "ios" ? -45 : -45,
          // paddingTop: 3,
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
            // backgroundColor: "#fff",
            backgroundColor: "white",
            height: TabBarHeight,

            // marginBottom: Platform.OS == "ios" ? -40 : 0
          }}
          renderLabel={({ route, focused }) => (
            <Text
              size="label"
              type="bold"
              style={{
                opacity: focused ? 1 : 0.5,
                marginTop: 12,
              }}
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

  const renderFilterAndSearchHeader = () => {
    return (
      <View
        onLayout={(event) => {
          var { x, y, width, height } = event.nativeEvent.layout;
          setheight(height);
        }}
        style={{
          flexDirection: "row",
          zIndex: 5,
          paddingHorizontal: 15,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: "#fff",
          position: "absolute",
          top: 0,
        }}
      >
        <Button
          size="small"
          type="icon"
          variant="bordered"
          color="primary"
          onPress={() => {
            setshow(true);
          }}
          style={{
            marginRight: 5,
            borderRadius: 3,
            paddingHorizontal: 10,
            borderColor: "#209FAE",
            paddingBottom: 0,
          }}
        >
          <Filternewbiru width={18} height={18} />
          {cekData() > 0 ? (
            <View
              style={{
                backgroundColor: "#209fae",
                marginLeft: 10,
                width: 20,
                paddingHorizontal: 5,
                borderRadius: 2,
              }}
            >
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  color: "#ffff",
                  fontSize: 15,
                }}
              >
                {cekData(dataFilterCategori)}
              </Text>
            </View>
          ) : null}
        </Button>
        <View
          style={{
            backgroundColor: "#F0F0F0",
            borderRadius: 3,
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

  const renderCountryAndMonthModal = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 100,
          width: "100%",
          alignContent: "center",
          alignItems: "center",
          marginBottom: 460,
          // transform: [{ translateY: displays }],
        }}
      >
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 20,
            top: HeaderHeight - 160,
          }}
        >
          <TouchableOpacity
            onPress={() => setModelSetNegara(true)}
            style={{
              backgroundColor: "#209fae",
              borderWidth: 2,
              borderRightWidth: 0,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderBottomLeftRadius: 20,
              borderTopStartRadius: 20,
              borderColor: "#d1d1d1",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: Dimensions.get("screen").width * 0.3,
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
              {Capital({ text: country?.name })}
            </Text>
            <Down width={10} height={10} style={{ marginTop: 5 }} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModaldate(true);
            }}
            style={{
              backgroundColor: "#209fae",
              borderWidth: 2,
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderBottomRightRadius: 20,
              borderTopEndRadius: 20,
              borderColor: "#d1d1d1",
              alignItems: "center",
              alignContent: "center",
              flexDirection: "row",
              justifyContent: "space-between",
              width: Dimensions.get("screen").width * 0.3,
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
              {month}
            </Text>
            <Down width={10} height={10} style={{ marginTop: 5 }} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFilterCategory = () => {
    return (
      <Modal
        // onLayout={() => dataCountrySelect()}
        onBackdropPress={() => {
          setshow(false);
        }}
        onRequestClose={() => setshow(false)}
        onDismiss={() => setshow(false)}
        isVisible={show}
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
      >
        <View
          style={{
            flexDirection: "column",
            height: Dimensions.get("screen").height * 0.6,
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

          <View
            style={{
              flexDirection: "row",
              flex: 1,
              borderTopWidth: 0.5,
              borderColor: "#d1d1d1",
            }}
          >
            <View
              style={{
                width: "35%",
                borderRightWidth: 0.5,
                borderColor: "#d1d1d1",
              }}
            >
              <View
                style={{
                  backgroundColor: "#f6f6f6",
                  paddingBottom: 5,
                }}
              >
                <View
                  style={{
                    borderLeftColor: "#209fae",
                    borderLeftWidth: 5,
                    marginLeft: 5,
                    justifyContent: "center",
                    paddingVertical: 15,
                    paddingHorizontal: 10,
                    backgroundColor: "#ffff",
                  }}
                >
                  <Text
                    type="bold"
                    size="title"
                    style={{
                      // fontSize: 20,
                      // fontFamily: "Lato-Bold",
                      color: "#464646",
                      // marginTop: 10,
                    }}
                  >
                    {t("categories")}
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  padding: 15,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#daf0f2",
                    borderRadius: 5,
                    // flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    alignContent: "center",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
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
                    // returnKeyType="search"
                    onChangeText={(x) => searchkategori(x)}
                    onSubmitEditing={(x) => searchkategori(x)}
                  />
                </View>
              </View>
              <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 15,
                }}
              >
                {dataFilterCategoris.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
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
                      lineWidth={4}
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
                      onValueChange={() =>
                        Platform.OS == "ios"
                          ? null
                          : _handleCheck(item["id"], index, item)
                      }
                      value={item["checked"]}
                    />

                    <Text
                      size="label"
                      type="regular"
                      style={{
                        marginLeft: 0,
                        marginRight: -10,
                        color: "#464646",
                        marginTop: Platform.OS == "ios" ? -5 : -2,
                        // borderWidth: 5,
                      }}
                    >
                      {item["name"]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

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
              style={{ width: "30%", borderColor: "#ffff" }}
              text={t("clearAll")}
            ></Button>
            <Button
              onPress={() => UpdateFilter()}
              style={{ width: "65%" }}
              text={t("apply")}
            ></Button>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCountryFilter = () => {
    return (
      <Modal
        onRequestClose={() => {
          setModelSetNegara(false);
        }}
        onBackdropPress={() => {
          setModelSetNegara(false);
        }}
        onDismiss={() => setModelSetNegara(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modals}
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height: 55,
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? 20 : -20,
            }}
          >
            <Button
              type="circle"
              color="tertiary"
              size="large"
              variant="transparent"
              onPress={() => setModelSetNegara(false)}
            >
              {Platform.OS == "ios" ? (
                <Arrowbackios height={20} width={20}></Arrowbackios>
              ) : (
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
              )}
            </Button>
            <Text
              size="label"
              style={{
                color: "white",
              }}
            >
              {t("country")}
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "white",
              paddingBottom: 15,
            }}
          >
            <View
              // onLayout={event => {
              //   var { x, y, width, height } = event.nativeEvent.layout;
              //   setheight(height);
              // }}
              style={{
                flexDirection: "row",
                zIndex: 5,
                paddingHorizontal: 15,
                paddingTop: 15,
                paddingBottom: 0,
                backgroundColor: "#fff",
                // position: "absolute",
                top: 0,
              }}
            >
              <View
                style={{
                  backgroundColor: "#F0F0F0",
                  borderRadius: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  height: 30,

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
                  onChangeText={(x) => searchCountry(x)}
                  onSubmitEditing={(x) => searchCountry(x)}
                />
              </View>
            </View>
            {filterCountry.length > 0
              ? filterCountry.map((item, index) => (
                  <Pressable
                    onPress={() => handlecountry(item, index)}
                    style={{
                      paddingVertical: 15,
                      paddingHorizontal: 20,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#D1D1D1",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          marginRight: 15,
                          elevation: 1,
                          height: 30,
                          width: 42,
                          backgroundColor: "#fff",
                          // borderWidth: 1,
                        }}
                      >
                        <FunIcon
                          icon={item.flag}
                          height={30}
                          width={42}
                          variant="f"
                          style={
                            {
                              // elevation: 1,
                            }
                          }
                        />
                      </View>
                      <View style={{ paddingTop: 5 }}>
                        <Text size="description">{item.name}</Text>
                      </View>
                    </View>
                    <View>
                      {item.checked && item.checked === true ? (
                        <Check width={20} height={15} />
                      ) : null}
                    </View>
                  </Pressable>
                ))
              : datacountry.map((item, index) => (
                  <Pressable
                    onPress={() => handlecountry(item, index)}
                    style={{
                      paddingVertical: 15,
                      paddingHorizontal: 20,
                      borderBottomWidth: 0.5,
                      borderBottomColor: "#D1D1D1",
                      flexDirection: "row",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                      }}
                    >
                      <View
                        style={{
                          marginRight: 15,
                          elevation: 1,
                          height: 30,
                          width: 42,
                          backgroundColor: "#fff",
                          // borderWidth: 1,
                        }}
                      >
                        <FunIcon
                          icon={item.flag}
                          height={30}
                          width={42}
                          variant="f"
                          style={
                            {
                              // elevation: 1,
                            }
                          }
                        />
                      </View>
                      <View style={{ paddingTop: 5 }}>
                        <Text size="description">{item.name}</Text>
                      </View>
                    </View>
                    <View>
                      {item.checked && item.checked === true ? (
                        <Check width={20} height={15} />
                      ) : null}
                    </View>
                  </Pressable>
                ))}
          </View>
        </View>
      </Modal>
    );
  };

  const renderMonthFilter = () => {
    return (
      <Modal
        onRequestClose={() => {
          setModaldate(false);
        }}
        onBackdropPress={() => {
          setModaldate(false);
        }}
        onDismiss={() => setModaldate(false)}
        onRequestClose={() => setModaldate(false)}
        onBackdropPress={() => setModaldate(false)}
        onDismiss={() => setModaldate(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={Modaldate}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            // height: 100,
            width: Dimensions.get("screen").width - 30,
            borderRadius: 5,
          }}
        >
          <DatePicker
            mode="monthYear"
            style={{
              borderRadius: 5,
            }}
            selectorStartingYear={2000}
            onMonthYearChange={(selectedDate) => _handledate(selectedDate)}
          />
        </View>
      </Modal>
    );
  };

  let [token, setToken] = useState("");
  let [show, setshow] = useState(false);
  let [modals, setModelSetNegara] = useState(false);
  let [Modaldate, setModaldate] = useState(false);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getdate = () => {
    let month = new Date().getMonth();
    return monthNames[month];
  };

  let [month, setmonth] = useState(" - ");
  let [country, setcountry] = useState({
    __typename: "DestinationCountryResponse",
    checked: true,
    code: "IDN",
    flag: "f-indonesia",
    id: "98b224d6-6df0-4ea7-94c3-dbeb607bea1f",
    name: "Indonesia",
    show: false,
    sugestion: true,
  });
  let [dataFilterCategori, setdataFilterCategori] = useState([]);
  let [dataFilterCategoris, setdataFilterCategoris] = useState([]);
  let [datacountry, setdatacountry] = useState([]);
  let [search, setSearch] = useState({
    type: null,
    tag: null,
    keyword: null,
    countries: null,
    date_from: null,
    date_until: null,
  });

  const [getdataEvent, { data, loading, error }] = useLazyQuery(ListEventGQL, {
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
        search.country && search.country.length > `0`
          ? search.country
          : props.route.params && props.route.params.idcountries
          ? [props.route.params.idcountries]
          : null,
      price_start: null,
      price_end: null,
      date_from: search.date_from,
      date_until: search.date_until,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataEvent(data.event_list_v2);
    },
  });

  const [
    getdataEventPublic,
    { data: dataPublic, loading: loadingPublic, error: errorPublic },
  ] = useLazyQuery(ListEventPublic, {
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
      date_from: search.date_from,
      date_until: search.date_until,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setdataEventPublic(dataPublic.event_list_public);
    },
  });

  const { data: dataFillter, loading: loadingcat, error: errorcat } = useQuery(
    CategoryEvent,
    {
      fetchPolicy: "network-only",
      onCompleted: () => {
        setdataFilterCategori(dataFillter.event_filter.type);
        setdataFilterCategoris(dataFillter.event_filter.type);
        setdatacountry(dataFillter.event_filter.country);
      },
    }
  );

  const [Banner, SetDataBanner] = useState();
  const {
    data: dataBanner,
    loading: loadingBanner,
    error: errorBanner,
  } = useQuery(BannerApps, {
    variables: {
      page_location: "Event",
    },
    // fetchPolicy: "network-only",
    onCompleted: () => {
      SetDataBanner(dataBanner.get_banner);
    },
  });

  const _setSearch = async (txt) => {
    let data = { ...search };
    data["keyword"] = txt;
    setSearch(data);
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

  const _liked = async (id, item, position) => {
    if (token && token !== "" && token !== null) {
      let items = { ...item };
      items.liked = true;

      if (position === "all") {
        var tempData = [...dataEvent];
        var index = tempData.findIndex((k) => k["id"] === id);
        tempData.splice(index, 1, items);
        await setdataEvent(tempData);
      } else {
        var tempData = [...dataEventPublic];
        var index = tempData.findIndex((k) => k["id"] === id);
        tempData.splice(index, 1, items);
        await setdataEventPublic(tempData);
      }

      try {
        let response = await mutationliked({
          variables: {
            event_id: id,
          },
        });
        if (loadingLike) {
          Alert.alert(t("somethingwrong"));
        }
        if (errorLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.setEvent_wishlist.code === 200 ||
            response.data.setEvent_wishlist.code === "200"
          ) {
          } else {
            throw new Error(response.data.setEvent_wishlist.message);
          }
        }
      } catch (error) {
        items.liked = false;
        if (position === "all") {
          tempData.splice(index, 1, items);
          await setdataEvent(tempData);
        } else {
          tempData.splice(index, 1, items);
          await setdataEventPublic(tempData);
        }

        Alert.alert(t("somethingwrong"));
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

  const _unliked = async (id, item, position) => {
    if (token && token !== "" && token !== null) {
      let items = { ...item };
      items.liked = false;

      if (position === "all") {
        var tempData = [...dataEvent];
        var index = tempData.findIndex((k) => k["id"] === id);
        tempData.splice(index, 1, items);
        await setdataEvent(tempData);
      } else {
        var tempData = [...dataEventPublic];
        var index = tempData.findIndex((k) => k["id"] === id);
        tempData.splice(index, 1, items);
        await setdataEventPublic(tempData);
      }
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
            type: "event",
          },
        });
        if (loadingUnLike) {
          Alert.alert(t("somethingwrong"));
        }
        if (errorUnLike) {
          throw new Error("Error Input");
        }

        if (response.data) {
          if (
            response.data.unset_wishlist.code === 200 ||
            response.data.unset_wishlist.code === "200"
          ) {
          } else {
            throw new Error(response.data.unset_wishlist.message);
          }
        }
      } catch (error) {
        items.liked = true;
        if (position === "all") {
          tempData.splice(index, 1, items);
          await setdataEvent(tempData);
        } else {
          tempData.splice(index, 1, items);
          await setdataEventPublic(tempData);
        }
        Alert.alert(t("somethingwrong"));
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

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await refresh();
  };

  const eventdetail = (data) => {
    props.navigation.navigate("eventdetail", {
      // data: data,
      event_id: data.id,
      name: data.name,
      token: token,
    });
  };

  let HEADER_MAX_HEIGHT = HeaderHeight;
  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 100, 100],
    extrapolate: "clamp",
  });

  const _handleCheck = async (id, index, item) => {
    let tempe = [...dataFilterCategori];
    let items = { ...item };
    items.checked = !items.checked;
    let inde = tempe.findIndex((key) => key.id === id);
    tempe.splice(inde, 1, items);
    await setdataFilterCategori(tempe);
    await setdataFilterCategoris(tempe);
  };

  const handlecountry = async (item) => {
    let hasil = [];

    let tempe = [...datacountry];
    let tempes = [];
    for (var x of tempe) {
      let data = { ...x };
      if (x !== item) {
        data.checked = false;
      } else {
        data.checked = true;
        hasil.push(item.id);
      }
      await tempes.push(data);
    }
    await setdatacountry(tempes);
    await setFilterCountry(tempes);

    let data = { ...search };
    data["country"] = hasil;
    await setSearch(data);

    await setModelSetNegara(false);
    await setcountry(item);
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

    await setSearch(data);
    await setshow(false);
    getdataEvent();
    getdataEventPublic();
  };

  const _handledate = async (selected) => {
    let data = selected.split(" ");
    let month = data[1]; // January
    let awal = new Date(data[0], parseFloat(month) - 1, 1);
    let akhir = new Date(data[0], parseFloat(month), 1);

    let datas = { ...search };
    datas["date_from"] = awal;
    datas["date_until"] = akhir;
    await setSearch(datas);
    await setModaldate(false);
    await setmonth(monthNames[parseFloat(month - 1)]);
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
    await setdataFilterCategoris(tempes);

    await setSearch({
      type: null,
      tag: null,
      keyword: null,
      countries: null,
      date_from: null,
      date_until: null,
    });
    await setshow(false);
    await setmonth(" - ");
  };

  const searchkategori = async (teks) => {
    let searching = new RegExp(teks, "i");

    let b = dataFilterCategori.filter((item) => searching.test(item.name));

    setdataFilterCategoris(b);
  };

  const [filterCountry, setFilterCountry] = useState([]);
  const searchCountry = async (teks) => {
    let searching = new RegExp(teks, "i");
    let b = datacountry.filter((item) => searching.test(item.name));

    setFilterCountry(b);
  };

  const cekData = (data) => {
    let dat = dataFilterCategori.filter((k) => k.checked === true);

    return dat.length;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <StaBar backgroundColor="#14646e" barStyle="light-content" /> */}
      {renderTabView()}
      {/* {renderFilterAndSearchHeader()} */}
      {renderHeader()}
      {renderCustomRefresh()}
      {/* {renderCountryAndMonthModal()} */}
      {renderFilterCategory()}
      {renderCountryFilter()}
      {renderMonthFilter()}
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
  searchWhite: {
    marginRight: 25,
    marginTop: Platform.OS == "ios" ? 0 : 5,
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
