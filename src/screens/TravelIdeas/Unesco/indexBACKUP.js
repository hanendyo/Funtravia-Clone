import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  PanResponder,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import {
  Akunsaya,
  default_image,
  unesco,
  tropical_rainforest,
  badak_jawa,
  lorenz,
  comodo,
  sangiran,
  prambanan,
  ombilin,
  cultural_lanscape,
  borobudur,
} from "../../../assets/png";
import {
  Kosong,
  Pin,
  Select,
  PinHitam,
  Arrowbackwhite,
  PinHijau,
  Arrowbackios,
} from "../../../assets/svg";
import { Button, Text, Truncate, FunImageBackground } from "../../../component";
import { useTranslation } from "react-i18next";
import { TabBar, TabView } from "react-native-tab-view";
import Ripple from "react-native-material-ripple";
import ListDestinationByUnesco from "../../../graphQL/Query/TravelIdeas/ListDestinationByUnesco";
import CountrySrc from "./CountrySrc";
import CountryListSrcUnesco from "../../../graphQL/Query/Countries/CountryListSrcUnesco";
import DeviceInfo from "react-native-device-info";
import BannerApps from "../../../graphQL/Query/Home/BannerApps";
import normalize from "react-native-normalize";
const Notch = DeviceInfo.hasNotch();

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 50;
// const HeaderHeight = width - 100;
// const SafeStatusBar = Platform.select({
//   ios: 44,
//   android: StatusBar.currentHeight,
// });
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});
const HeaderHeight = Platform.select({
  ios: Notch ? 360 - 48 : 360 - 20,
  // android: 305 - StatusBar.currentHeight,
  // android: 320 - StatusBar.currentHeight,
  android: 340 - StatusBar.currentHeight,
});

const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

const data_unesco = [
  {
    id: "1",
    name: "Borobudur Temple Compounds",
    year: "1991",
    address: "Magelang, Central Java",
    type: "culture",
    cover: borobudur,
  },
  {
    id: "2",
    name: "Cultural Landscape of Bali Province: the Subak System ",
    year: "2012",
    address: "East Nusa Tenggara Province",
    type: "culture",
    cover: cultural_lanscape,
  },
  {
    id: "3",
    name: "Ombilin Coal Mining",
    year: "2019",
    address: "Kota Sawahlunto, Sumatera Barat",
    type: "culture",
    cover: ombilin,
  },
  {
    id: "4",
    name: "Prambanan Temple",
    year: "1991",
    address: "Magelang, Central Java",
    type: "culture",
    cover: prambanan,
  },
  {
    id: "5",
    name: "Sangiran Early Man Site",
    year: "1996",
    address: "Magelang, Central Java",
    type: "culture",
    cover: sangiran,
  },
  {
    id: "6",
    name: "Komodo National Park",
    year: "1991",
    address: "East Nusa Tenggara Province",
    type: "natural",
    cover: comodo,
  },
  {
    id: "7",
    name: "Lorentz National Park ",
    year: "1999",
    address: "Kota Sawahlunto, Sumatera Barat",
    type: "natural",
    cover: lorenz,
  },
  {
    id: "8",
    name: "Tropical Rainforest Heritage of Sumatra",
    year: "2004",
    address: "West Sumatera",
    type: "natural",
    cover: tropical_rainforest,
  },
  {
    id: "9",
    name: "Ujung Kulon National Park",
    year: "1991",
    address: "Banten",
    type: "natural",
    cover: badak_jawa,
  },
];

const data_unesco_nature = [
  {
    id: "6",
    name: "Komodo National Park",
    year: "1991",
    address: "East Nusa Tenggara Province",
    type: "natural",
    cover: comodo,
  },
  {
    id: "7",
    name: "Lorentz National Park ",
    year: "1999",
    address: "Kota Sawahlunto, Sumatera Barat",
    type: "natural",
    cover: lorenz,
  },
  {
    id: "8",
    name: "Tropical Rainforest Heritage of Sumatra",
    year: "2004",
    address: "West Sumatera",
    type: "natural",
    cover: tropical_rainforest,
  },
  {
    id: "9",
    name: "Ujung Kulon National Park",
    year: "1991",
    address: "Banten",
    type: "natural",
    cover: badak_jawa,
  },
];

const data_unesco_culture = [
  {
    id: "1",
    name: "Borobudur Temple Compounds",
    year: "1991",
    address: "Magelang, Central Java",
    type: "culture",
    cover: borobudur,
  },
  {
    id: "2",
    name: "Cultural Landscape of Bali Province: the Subak System ",
    year: "2012",
    address: "East Nusa Tenggara Province",
    type: "culture",
    cover: cultural_lanscape,
  },
  {
    id: "3",
    name: "Ombilin Coal Mining",
    year: "2019",
    address: "Kota Sawahlunto, Sumatera Barat",
    type: "culture",
    cover: ombilin,
  },
  {
    id: "4",
    name: "Prambanan Temple",
    year: "1991",
    address: "Magelang, Central Java",
    type: "culture",
    cover: prambanan,
  },
  {
    id: "5",
    name: "Sangiran Early Man Site",
    year: "1996",
    address: "Magelang, Central Java",
    type: "culture",
    cover: sangiran,
  },
];

export default function Unesco({ navigation, route }) {
  let [token, setToken] = useState(route.params.token);
  let [canScroll, setCanScroll] = useState(true);
  let [modalcountry, setModelCountry] = useState(false);
  let [selectedCountry, SetselectedCountry] = useState({
    // id: "98b224d6-6df0-4ea7-94c3-dbeb607bea1f",
    // name: "Indonesia",
  });
  const { t } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarLabel: "Unesco",
    headerTintColor: "white",
    headerTitle: "UNESCO World Heritage",
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
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => navigation.goBack()}
        style={{
          marginLeft: 10,
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };
  /**
   * stats
   */
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "culture", title: "Culture" },
    { key: "natural", title: "Natural site" },
    { key: "mix", title: "Mix" },
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

  let HEADER_MAX_HEIGHT = HeaderHeight;
  let HEADER_MIN_HEIGHT = 55;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const PosisiCountry = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    // outputRange: [HeaderHeight - 125, 50, TabBarHeight + 10],
    outputRange: [HeaderHeight - 135, -10, -100],
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

  console.log("listdestinasi_unesco", listdestinasi_unesco);

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
    navigation.setOptions(HeaderComponent);
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
      outputRange: [0, -HeaderHeight - 5],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={[styles.header, { transform: [{ translateY: y }] }]}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: width,
            height: HeaderHeight - 150,
          }}
        >
          {Banner && Banner.banner_asset.length > 0 ? (
            <FunImageBackground
              source={{ uri: Banner.banner_asset[0].filepath }}
              style={{
                width: width,
                height: HeaderHeight - 120,
              }}
              resizeMode="cover"
            />
          ) : (
            <ImageBackground
              source={unesco}
              style={{
                width: width,
                height: HeaderHeight - 120,
              }}
              resizeMode="cover"
            />
          )}
        </View>
        <View
          style={{
            flex: 1,
            marginTop: 55,
            paddingHorizontal: 20,
            zIndex: -10,
          }}
        >
          <Text size="title" type="bold" style={{ marginBottom: 5 }}>
            {Banner && Banner.title
              ? Banner.title
              : "UNESCO World Heritage Centre"}
          </Text>
          <Text
            size="label"
            style={{
              textAlign: "left",
              lineHeight: 22,
            }}
          >
            {Banner && Banner.description
              ? Banner.description
              : "The UNESCO (United Nations Educational, Scientific and Cultural Organization) has designated nine World Heritage Sites in"}{" "}
            {selectedCountry?.name}.
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: HeaderHeight - 160,
            // top: height - (Platform.OS == "ios" ? (Notch ? 745 : 488) : 630),
            // transform: [{ translateY: PosisiCountry }],
            alignItems: "center",
            width: "100%",
            height: 44,
            // backgroundColor: "#FFFFFF",
            zIndex: 100,
          }}
        >
          <Pressable
            onPress={() => setModelCountry(true)}
            style={({ pressed }) => [
              {
                height: 50,
                borderRadius: 25,
                // borderWidth: 1,
                borderColor: "grey",
                paddingVertical: 10,
                paddingHorizontal: 30,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                // bottom: -22,
                // left: "30%",
                backgroundColor: pressed ? "#F6F6F7" : "white",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.22,
                shadowRadius: 1.46,
                elevation: 3,
                flexDirection: "row",
                // position: "absolute",
                // transform: [{ translateY: PosisiCountry }],
                // alignItems: "center",
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
                size="title"
                type="bold"
                style={{
                  marginRight: 10,
                  // borderWidth: 1,
                  marginBottom: 5,
                }}
              >
                {selectedCountry?.name}
              </Text>
            )}
            <Select height={10} width={10} />
          </Pressable>
        </View>
      </Animated.View>
    );
  };

  const renderCulture = ({ item, index }) => {
    console.log("item", item);
    return (
      <Pressable
        // onPress={() => {
        //   navigation.navigate("detailStack", {
        //     id: item.id,
        //     name: item.name,
        //   });
        // }}
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
            {/* <Text numberOfLines={2} style={{ lineHeight: 16 }}>
              {item.description}
            </Text> */}
            <Text
              numberOfLines={2}
              style={{ lineHeight: 16 }}
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
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          {
            opacity: focused ? 1 : 0.7,
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
                {dataR.length} sites
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

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      // outputRange: [HeaderHeight - 6, 0],
      outputRange:
        Platform.OS == "ios" ? [HeaderHeight, 0] : [HeaderHeight - 6, 0],
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
          style={styles.tab}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
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
    <SafeAreaView style={styles.container}>
      <CountrySrc
        selectedCountry={selectedCountry}
        SetselectedCountry={(e) => SetselectedCountry(e)}
        modalshown={modalcountry}
        setModelCountry={(e) => setModelCountry(e)}
      />

      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    height: HeaderHeight,
    width: "100%",
    alignItems: "center",
    // justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFF",
  },
  label: { fontSize: normalize(14), color: "#464646", fontFamily: "Lato-Bold" },
  labelActive: {
    fontSize: normalize(14),
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    // height: TabBarHeight + 5,
    height: Platform.OS == "ios" ? TabBarHeight + 5 : TabBarHeight,

    // borderWidth: 2,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});