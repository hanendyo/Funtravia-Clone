import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  PanResponder,
  Platform,
  StatusBar,
  StyleSheet,
  View,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { unesco } from "../../../assets/png";
import {
  Kosong,
  Select,
  Arrowbackwhite,
  PinHijau,
  Arrowbackios,
} from "../../../assets/svg";
import {
  Button,
  Text,
  StatusBar as StaBar,
  Truncate,
} from "../../../component";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import ListDestinationByUnesco from "../../../graphQL/Query/TravelIdeas/ListDestinationByUnesco";
import CountrySrc from "./CountrySrc";
import CountryListSrcUnesco from "../../../graphQL/Query/Countries/CountryListSrcUnesco";
import DeviceInfo from "react-native-device-info";
import BannerApps from "../../../graphQL/Query/Home/BannerApps";
import normalize from "react-native-normalize";
const Notch = DeviceInfo.hasNotch();

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 40;
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});

const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;
const deviceId = DeviceInfo.getModel();

export default function Unesco({ navigation, route }) {
  let [tambahantitle, setTambahanTitle] = useState(0);
  let [tambahan, setTambahan] = useState(0);
  let [token, setToken] = useState(route.params.token);
  let [canScroll, setCanScroll] = useState(true);
  let [modalcountry, setModelCountry] = useState(false);
  const HeaderHeight = Platform.select({
    ios: Notch
      ? normalize(355) + tambahantitle + tambahan - 48
      : normalize(342) + tambahantitle + tambahan - 20,
    android:
      deviceId == "LYA-L29"
        ? normalize(330) + tambahantitle + tambahan - StatusBar.currentHeight
        : normalize(342) + tambahantitle + tambahan - StatusBar.currentHeight,
  });

  let HEADER_MAX_HEIGHT = Platform.select({
    ios: Notch
      ? normalize(347) + tambahantitle + tambahan - 48
      : normalize(342) + tambahantitle + tambahan - 20,
    android:
      normalize(380) + tambahantitle + tambahan - StatusBar.currentHeight,
  });

  let [selectedCountry, SetselectedCountry] = useState({
    // id: "98b224d6-6df0-4ea7-94c3-dbeb607bea1f",
    // name: "Indonesia",
  });
  const { t } = useTranslation();
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "culture", title: t("Culture") },
    { key: "natural", title: t("NaturalSite") },
    { key: "mix", title: t("Mix") },
  ]);

  const {
    data: datacountry,
    loading: loadingcountry,
    error: errorcountry,
    refetch: refetchcountry,
  } = useQuery(CountryListSrcUnesco, {
    variables: {
      continent_id: null,
      keyword: "",
    },
    onCompleted: () => {
      SetselectedCountry({
        id: datacountry.list_country_src_unesco[0].id,
        name: datacountry.list_country_src_unesco[0].name,
      });
      if (selectedCountry) {
        getUnesco();
      }
    },
  });

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

  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

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

  const [getUnesco, { data, loading, error, refetch }] = useLazyQuery(
    ListDestinationByUnesco,
    {
      variables: {
        countries_id: selectedCountry.id,
      },
      context: {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );

  let listdestinasi_unesco = [];
  if (data && data.listdestinasi_unesco) {
    listdestinasi_unesco = data.listdestinasi_unesco;
  }

  /**
   * PanResponder for header
   */
  const [Banner, SetDataBanner] = useState();
  const {
    data: dataBanner,
    loading: loadingBanner,
    error: errorBanner,
  } = useQuery(BannerApps, {
    variables: {
      page_location: "Unesco",
    },
    // fetchPolicy: "network-only",
    onCompleted: () => {
      SetDataBanner(dataBanner.get_banner);
    },
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
    // navigation.setOptions(HeaderComponent);
    // navigation.setOptions(HeaderComponentCustom);
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

  /**
   * render Helper
   */

  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        pointerEvents={"box-none"}
        // style={[styles.header, { transform: [{ translateY: y }] }]}
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
        <Animated.View
          style={{
            opacity: imageOpacity,
            flex: 1,
            width: width,
          }}
        >
          {Banner && Banner.banner_asset.length > 0 ? (
            <Animated.Image
              style={{
                flex: 1,
                // height: 180,
                width: "100%",
                opacity: imageOpacity,
                // transform: [{ translateY: imageTranslate }],
              }}
              source={{ uri: Banner.banner_asset[0].filepath }}
            />
          ) : (
            <Animated.Image
              style={{
                flex: 1,
                width: "100%",
                opacity: imageOpacity,
              }}
              source={unesco}
            />
          )}
          <Animated.View
            pointerEvents="box-none"
            style={{
              // flex: 1,
              marginTop: 0,

              paddingTop: Platform.OS == "ios" ? 25 : 20,
              paddingHorizontal: 15,
              paddingBottom: 0,
              opacity: imageOpacity,
              zIndex: -10,
              backgroundColor: "#fff",

              // width: width,
              // transform: [{ translateY: imageTranslate }],
            }}
          >
            <Text
              onTextLayout={(x) => {
                let line = x.nativeEvent.lines.length;
                let lines = +line;
                if (+lines % 3 == 0) {
                  Platform.OS == "ios"
                    ? Notch
                      ? setTambahanTitle(lines * 3)
                      : setTambahanTitle(lines * -6)
                    : setTambahanTitle(lines * 1);
                  // setTambahanJudul(lines * 12);
                } else {
                  Platform.OS == "ios"
                    ? Notch
                      ? setTambahanTitle(lines * -10)
                      : setTambahanTitle(lines * -20)
                    : setTambahanTitle(lines * 1);
                }
              }}
              size="title"
              type="bold"
              style={{
                textAlign: "left",
                paddingBottom: 5,
                flexShrink: 0,
                // borderWidth: 2,
              }}
              // wordWra
            >
              {t("UnescoTitle")}
            </Text>
            <Text
              onTextLayout={(x) => {
                let line = x.nativeEvent.lines.length;
                let lines = line - 1;
                // setTambahanDeskripsi(lines * 32);
                if (+lines % 3 == 0) {
                  Platform.OS == "ios"
                    ? Notch
                      ? setTambahan(lines * 15)
                      : setTambahan(lines * 17)
                    : setTambahan(lines * 11);
                  // setTambahanDeskripsi(lines * 12);
                } else {
                  Platform.OS == "ios"
                    ? Notch
                      ? setTambahan(lines * 16)
                      : setTambahan(lines - 20)
                    : setTambahan(lines);
                }
              }}
              size="label"
              type="regular"
              style={{
                textAlign: "left",
                // paddingHorizontal:
                // marginBottom: Platform.OS == "ios" ? (Notch ? 10 : 15) : 10,
              }}
            >
              {t("UnescoDescription")} {selectedCountry?.name}.
            </Text>
          </Animated.View>
        </Animated.View>

        {/* FILTER COUNTRY */}
        <Animated.View
          style={{
            position: "absolute",
            // top: normalize(190),
            top: Platform.select({
              ios: Notch ? normalize(190) : normalize(220),
              android: normalize(186),
            }),
            alignItems: "center",
            width: "100%",
            height: normalize(44),
            opacity: imageOpacity,
            // transform: [{ translateY: imageTranslate }],
          }}
        >
          <Pressable
            onPress={() => setModelCountry(true)}
            style={({ pressed }) => [
              {
                height: normalize(45),
                borderRadius: 50,
                borderWidth: 1,
                borderColor: "#d8d8d8",
                paddingVertical: 10,
                paddingHorizontal: 0,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                backgroundColor: pressed ? "#F6F6F7" : "white",
                flexDirection: "row",
                width: "35%",
              },
            ]}
          >
            {loadingcountry ? (
              <ActivityIndicator
                animating
                size="small"
                color="#209fae"
                style={{
                  paddingTop: 10,
                  paddingHorizontal: 10,
                }}
              />
            ) : (
              <Text
                size="label"
                type="bold"
                style={{
                  marginRight: 10,
                  marginBottom: 5,
                }}
              >
                {selectedCountry?.name}
              </Text>
            )}
            <Select height={10} width={10} />
          </Pressable>
        </Animated.View>
        {/* END FILTER COUNTRY */}
      </Animated.View>
    );
  };

  const renderCulture = ({ item, index }) => {
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
        <Pressable
          key={index.toString()}
          onPress={() =>
            navigation.navigate("DestinationUnescoDetail", {
              id: item.id,
              name: item.name,
              token: token,
            })
          }
          style={{
            flexDirection: "row",
            marginHorizontal: 15,
            marginVertical: 5,
            flex: 1,
            backgroundColor: "#FFF",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.27,
            shadowRadius: 4.65,
            elevation: 6,
            borderRadius: 5,
            // borderWidth: 1,
          }}
        >
          <View
            style={{
              width: 140,
              height: 110,
            }}
          >
            <Image
              source={{ uri: item.images.image }}
              style={{
                width: 140,
                height: 110,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}
              resizeMode="cover"
            />
          </View>
          <View
            style={{
              marginHorizontal: 10,
              marginTop: 5,
              width: "60%",
              justifyContent: "space-between",
              flex: 1,
              marginBottom: 8,
            }}
          >
            <View>
              <Text type="bold" size="label" numberOfLines={1}>
                {item.name}
              </Text>
              <Text
                numberOfLines={2}
                style={{ lineHeight: 26 }}
                size="label"
                type="regular"
              >
                (1999)
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <PinHijau height={18} width={18} style={{ marginRight: 5 }} />
              <Text numberOfLines={1} size="description" type="regular">
                {item.cities.name}, {item.province.name}
              </Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          {
            opacity: focused ? 1 : 0.8,
          },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let dataR;
    let renderItem;
    let flex;
    switch (route.key) {
      case "culture":
        numCols = null;
        flex = null;
        dataR = listdestinasi_unesco;
        renderItem = renderCulture;
        break;
      case "natural":
        numCols = null;
        flex = null;
        dataR = listdestinasi_unesco;
        renderItem = renderCulture;
        break;
      case "mix":
        numCols = null;
        flex = null;
        dataR = listdestinasi_unesco;
        renderItem = renderCulture;
        break;
      default:
        return null;
    }
    if (dataR && dataR.length > 0) {
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
          contentContainerStyle={{
            paddingTop: HeaderHeight + TabBarHeight,
            minHeight: height - SafeStatusBar + HeaderHeight,
            flex: flex,
            backgroundColor: "#F6F6F6",
          }}
          showsHorizontalScrollIndicator={false}
          data={dataR}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={
            loading ? (
              <View
                style={{
                  width: width,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 30,
                }}
              >
                <ActivityIndicator
                  animating={loadingPost}
                  size="large"
                  color="#209fae"
                />
              </View>
            ) : null
          }
          ListHeaderComponent={
            <View
              style={{
                marginBottom: 5,
                marginTop: 15,
                marginHorizontal: 20,
              }}
            >
              <Text size="title" type="bold">
                {dataR.length > 1 && dataR.length != 0
                  ? `${dataR.length} sites`
                  : `${dataR.length} site`}
              </Text>
            </View>
          }
        />
      );
    } else {
      return (
        <View
          style={{
            justifyContent: "flex-start",
            alignItems: "center",
            alignContent: "center",
            paddingTop: HeaderHeight,
            minHeight: height - SafeStatusBar + HeaderHeight,
          }}
        >
          <Kosong height={width} width={width} />
        </View>
      );
    }
  };

  let scrollRef = useRef();
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
            backgroundColor: "#FFF",
            height: 38,
            width: 38,
            borderRadius: 19,
            borderWidth: 2,
            borderColor: "#209FAE",
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

  if (loading) {
    <View style={{ marginTop: 20, backgroundColor: "#FFF" }}>
      <ActivityIndicator size="small" animating="true" />
    </View>;
  }

  return (
    <View style={styles.container}>
      <StaBar barStyle="light-content" style={{ flex: 1, zIndex: 99999 }} />
      <CountrySrc
        selectedCountry={selectedCountry}
        SetselectedCountry={(e) => SetselectedCountry(e)}
        modalshown={modalcountry}
        setModelCountry={(e) => setModelCountry(e)}
      />

      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          opacity: hides.current,
          flexDirection: "row",
          justifyContent: "space-between",
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
          onPress={() => navigation.goBack()}
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
          justifyContent: "space-between",
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
          onPress={() => navigation.goBack()}
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
        <View
          style={{
            width: Dimensions.get("screen").width - 95,
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            padding: 10,
          }}
        >
          <Text
            size="title"
            type="bold"
            style={{
              color: "#FFFFFF",
            }}
          >
            {t("UnescoTitle")}
          </Text>
        </View>
      </Animated.View>

      {/* {renderNavigation()} */}
      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height:
      Platform.OS == "ios"
        ? Notch
          ? normalize(420) - 48
          : normalize(360) - 20
        : normalize(340) - StatusBar.currentHeight,
    width: "100%",
    alignItems: "center",
    // justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFF",
  },
  label: { fontSize: 16, color: "#464646", fontFamily: "Lato-Regular" },
  labelActive: {
    fontSize: 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",

    justifyContent: "center",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    // height: TabBarHeight + 5,
    height: Platform.OS == "ios" ? TabBarHeight : TabBarHeight,

    // borderWidth: 2,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});
