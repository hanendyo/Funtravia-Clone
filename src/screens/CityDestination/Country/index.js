import { useLazyQuery, useMutation } from "@apollo/client";
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
  Image,
  ActivityIndicator,
  Pressable,
  ImageBackground,
  FlatList,
  Modal as ModalRN,
  NativeModules,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import CitiesInformation from "../../../graphQL/Query/Cities/Citiesdetail";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Arrowbackwhite,
  OptionsVertWhite,
  PinWhite,
  LikeEmpty,
  Showmore,
  Showless,
  PinHijau,
  Calendargrey,
  User,
  TravelAlbum,
  TravelStories,
  LikeRed,
  Logofuntravianew,
  ShareBlack,
  Xgray,
  Nextabu,
  Prevabu,
  Arrowbackios,
} from "../../../assets/svg";
import { TouchableHighlight } from "react-native-gesture-handler";
import { default_image, search_button } from "../../../assets/png";
import {
  Button,
  Capital,
  Sidebar,
  StatusBar as StaBar,
  Truncate,
  Text,
  FunIcon,
  FunImage,
  FunMaps,
  CopyLink,
  shareAction,
} from "../../../component";
import { Tab, Tabs } from "native-base";

import CountrisInformation from "../../../graphQL/Query/Countries/Countrydetail";
import CountrisJournal from "../../../graphQL/Query/Countries/CountryJournal";
import { useTranslation } from "react-i18next";

import Ripple from "react-native-material-ripple";
import ImageSlider from "react-native-image-slider";
import likedJournal from "../../../graphQL/Mutation/Journal/likedJournal";
import unlikedJournal from "../../../graphQL/Mutation/Journal/unlikedJournal";
import LinearGradient from "react-native-linear-gradient";
import ItineraryLiked from "../../../graphQL/Mutation/Itinerary/ItineraryLike";
import ItineraryUnliked from "../../../graphQL/Mutation/Itinerary/ItineraryUnlike";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { Props } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import categoryArticle from "../../../graphQL/Query/Countries/Articlecategory";
import { useSelector } from "react-redux";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = Platform.OS == "ios" ? 44 : 40;
const Notch = DeviceInfo.hasNotch();
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: NativeModules.StatusBarManager.HEIGHT,
});
const deviceId = DeviceInfo.getModel();
const NotchAndro = NativeModules.StatusBarManager.HEIGHT > 24;

const PullToRefreshDist = 150;

let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function Country(props) {
  const [modalLogin, setModalLogin] = useState(false);
  const { t, i18n } = useTranslation();
  // let [token, setToken] = useState("");
  const token = useSelector((data) => data.token);
  let [search, setTextc] = useState("");
  let [showside, setshowside] = useState(false);
  let [dataevent, setdataevent] = useState({ event: [], month: "" });
  const [sharemodal, SetShareModal] = useState(false);
  let Bln = new Date().getMonth();
  let Bln1 = 0;
  if (Bln < 10) {
    Bln1 = "0" + (Bln + 1);
  } else {
    Bln1 = Bln + 1;
  }

  // let Bln1 = Bln + 1;
  let years = new Date().getFullYear();

  const [tabIndex, setIndex] = useState(0);
  const [routes, setRoutes] = useState(Array(1).fill(0));
  const [canScroll, setCanScroll] = useState(true);
  const [tabGeneral] = useState(Array(1).fill(0));
  const [tab2Data] = useState(Array(1).fill(0));

  let scrollRef = useRef();
  let [full, setFull] = useState(false);
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
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

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

  useEffect(() => {
    refreshData();

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

  const refreshData = async () => {
    await getJournal();
    await getPackageDetail();
    await getCountryfact();
  };

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
          Authorization: token,
        },
      },
      onCompleted: () => {
        let tab = [{ key: "general", title: "General" }];

        data?.country_detail?.article_header.map((item, index) => {
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
        Authorization: token,
      },
    },
    onCompleted: () => {
      setListJournal(dataJournal?.journal_by_country);
    },
  });

  // get article country facts

  let [countryfact, setCountryfact] = useState([]);
  const [
    getCountryfact,
    {
      loading: loadingcountryfact,
      data: datacountryfact,
      error: errorcountryfact,
    },
  ] = useLazyQuery(categoryArticle, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.data.id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    onCompleted: () => {
      setCountryfact(datacountryfact?.category_article_bycountry);
    },
  });

  const Goto = (item) => {
    if (item?.id) {
      props.navigation.navigate("eventdetail", {
        event_Id: item.id,
        data: item,
        name: item.name,
        token: token,
      });
    }
  };

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

  const [
    mutationliked,
    { loading: loadingLike, data: dataLike, error: errorLike },
  ] = useMutation(ItineraryLiked, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
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
        Authorization: token,
      },
    },
  });

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
        Authorization: token,
      },
    },
  });

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
        Authorization: token,
      },
    },
  });

  // liked journal
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
      setModalLogin(true);
      // props.navigation.navigate("AuthStack", {
      //   screen: "LoginScreen",
      // });
      // RNToasty.Show({
      //   title: t("pleaselogin"),
      //   position: "bottom",
      // });
    }
  };

  // unliked journal
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
      setModalLogin(true);
      // props.navigation.navigate("AuthStack", {
      //   screen: "LoginScreen",
      // });
      // RNToasty.Show({
      //   title: t("pleaselogin"),
      //   position: "bottom",
      // });
    }
  };

  const Renderfact = ({ datas, header, country }) => {
    let data = countryfact;
    var y = data.length;
    var x = 2;
    var z = 3;
    var remainder = y % x;
    var remainderz = y % z;
    return (
      <FlatList
        listKey={"render-fact"}
        numColumns={
          data.length && data.length > 1
            ? data.length === 2 && remainder === 0
              ? 2
              : 3
            : 1
        }
        data={data}
        keyExtractor={(item, index) => `key-${index}-render-fact`}
        renderItem={({ item, index }) => {
          return (
            <Ripple
              onPress={() => {
                props.navigation.push("ArticelCategory", {
                  id: item.id,
                  indexArc: index,
                  header: header,
                  country: country,
                  article: item.article,
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
                padding: 10,
                paddingHorizontal: 5,
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

                borderColor: "#d1d1d1",
              }}
            >
              <Text
                size="readable"
                type="regular"
                numberOfLines={1}
                style={{
                  textAlign: "center",
                  padding: 2,
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

  // Render General
  const RenderGeneral = ({ item, index }) => {
    let render = [];
    render = data && data?.country_detail ? data?.country_detail : null;
    let renderjournal = [];
    renderjournal = list_journal;

    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, 55],
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        key={`general-parent-1`}
        style={{
          marginBottom: 70,
          transform: [{ translateY: y }],
        }}
      >
        {render && render.description ? (
          <View
            key={`general-parent-2`}
            style={{
              justifyContent: "flex-start",
              paddingHorizontal: 5,
            }}
          >
            <View>
              <Text type="bold" size="title" style={{ marginBottom: 5 }}>
                {t("generalInformation")}
              </Text>
              {full == false && render.description.length > 120 ? (
                <Text
                  size="label"
                  type="regular"
                  style={{
                    textAlign: "left",
                    lineHeight: 20,
                  }}
                >
                  <Truncate
                    text={render ? render.description : null}
                    length={160}
                  />
                </Text>
              ) : (
                <Text
                  size="label"
                  type="regular"
                  style={{
                    textAlign: "left",
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
                    size="label"
                    type="regular"
                    style={{
                      color: "#209FAE",
                      lineHeight: 20,
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
                    size="label"
                    type="regular"
                    style={{ color: "#209FAE" }}
                  >
                    {t("readless")}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* at Glance with Tabs */}
        <View
          key={`general-parent-3`}
          style={{
            paddingTop: 15,
            width: "100%",
          }}
        >
          <View
            style={{
              paddingHorizontal: 5,
            }}
          >
            {i18n.language === "id" ? (
              <Text size="title" type="bold" style={{ marginBottom: 3 }}>
                {t("atGlance")}

                <Capital text={render ? render.name : ""} />
              </Text>
            ) : (
              <Text size="title" type="bold" style={{ marginBottom: 3 }}>
                <Capital text={render ? render.name : ""} />

                {t("atGlance")}
              </Text>
            )}
            <Text size="description">{t("geography&religion")}</Text>
          </View>
          <View
            style={{
              marginTop: 10,
              borderRadius: 10,
              paddingBottom: 10,
              minHeight: 50,
              justifyContent: "center",
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
                height: 2,
              }}
              tabContainerStyle={{
                backgroundColor: "white",
                elevation: 0,
                height: 45,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              }}
            >
              <Tab
                heading={t("Map")}
                tabStyle={{
                  backgroundColor: "white",
                  elevation: 0,
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                  borderTopLeftRadius: 10,
                }}
                activeTabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                  borderTopLeftRadius: 10,
                }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 16,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 16,
                  color: "#209FAE",
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                  }}
                >
                  <FunMaps
                    icon={render?.map ? render?.map : "mk-belitung"}
                    height={250}
                    width={width - 50}
                    style={{
                      bottom: -3,
                    }}
                  />
                </View>
              </Tab>

              <Tab
                heading={t("climate")}
                tabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                }}
                activeTabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 16,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 16,
                  color: "#209FAE",
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                  }}
                >
                  <Image
                    source={
                      render?.climate ? { uri: render?.climate } : default_image
                    }
                    style={{
                      width: "100%",
                      height: width * 0.7,
                      resizeMode: "center",
                    }}
                  ></Image>
                </View>
              </Tab>
              <Tab
                heading={t("religion")}
                tabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#d1d1d1",
                  borderTopRightRadius: 10,
                  borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                }}
                activeTabStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "#d1d1d1",
                  borderTopRightRadius: 10,
                  borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                }}
                textStyle={{
                  fontFamily: "Lato-Regular",
                  fontSize: 16,
                  color: "#6C6C6C",
                }}
                activeTextStyle={{
                  fontFamily: "Lato-Bold",
                  fontSize: 16,
                  color: "#209FAE",
                }}
              >
                <View
                  style={{
                    marginHorizontal: 10,
                  }}
                >
                  <Image
                    source={
                      render?.religion
                        ? { uri: render?.religion }
                        : default_image
                    }
                    style={{
                      width: "100%",
                      height: width * 0.7,
                      resizeMode: "center",
                    }}
                  ></Image>
                </View>
              </Tab>
            </Tabs>
          </View>
        </View>

        {/* Travel Jurnal */}
        {renderjournal && renderjournal.length > 0 ? (
          <View
            key={`general-parent-4`}
            style={{
              paddingTop: 15,
              width: "100%",
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              <Text size="title" type="bold" style={{ marginBottom: 3 }}>
                {t("traveljournal")}
              </Text>
              <Text size="description">{t("traveldiscovery")}</Text>
            </View>

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
                  key={"image-slider-journal"}
                  images={renderjournal ? spreadData(renderjournal) : []}
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,

                    backgroundColor: "#white",
                  }}
                  customSlide={({ index, item, style, width }) => (
                    <View key={`key-${index}-image-slider-1`}>
                      {item.map((dataX, indeks) => {
                        return (
                          <Pressable
                            key={`key-${indeks}-image-slider-2`}
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
                              width: width - 50,
                              height: width * 0.2,
                              padding: 5,
                              alignItems: "center",
                            }}
                          >
                            {dataX && dataX.userby ? (
                              <FunImage
                                source={
                                  item.picture
                                    ? {
                                        uri: dataX.userby.picture,
                                      }
                                    : null
                                }
                                style={{
                                  height: width * 0.15,
                                  width: width * 0.15,
                                  borderRadius: 5,
                                  margin: 5,
                                }}
                              />
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
                                  numberOfLines={1}
                                  size="label"
                                  style={{
                                    width: "100%",
                                    color: "#209fae",
                                    marginBottom: 3,
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
                                  marginTop: 15,
                                  marginLeft: 10,
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
                                      _likedjournal(dataX.id, indeks, item)
                                    }
                                  >
                                    <LikeEmpty height={12} width={12} />
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
                                      _unlikedjournal(dataX.id, indeks, item)
                                    }
                                  >
                                    <LikeRed height={12} width={12} />
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
                              key={`key-${index}-image-slider-1`}
                              underlayColor="#f7f7f700"
                            >
                              <View
                                key={`key-${index}-image-slider-child`}
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
            key={`general-parent-5`}
            style={{
              paddingTop: 15,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              <Text type="bold" size="title" style={{ marginBottom: 3 }}>
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
            </View>

            <View
              key={`img-sldr-prnt`}
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
                  backgroundColor: "#FFF",
                  width: Dimensions.get("screen").width,
                  // flex: 1,
                  marginBottom: -5,
                }}
                customButtons={(position, move) => (
                  <View
                    key={`custom-button-${position}`}
                    style={{
                      alignContent: "center",
                      alignItems: "center",
                      marginLeft: 2,
                      position: "absolute",
                      flexDirection: "row",
                      justifyContent: "center",
                      width: Dimensions.get("screen").width - 55,
                    }}
                  >
                    {(render?.city?.length > 0
                      ? render?.city
                      : [default_image]
                    ).map((item, index) => (
                      <View key={`key-${index}-image-slider-3`}>
                        {position == index ? (
                          <View
                            style={{
                              width: "100%",
                              alignContent: "center",
                              alignItems: "center",

                              flexDirection: "row",
                              height: 40,
                              backgroundColor: "#FFFFFF",
                            }}
                          >
                            <View
                              style={{
                                width: "100%",
                                paddingHorizontal: 5,
                                flexDirection: "row",
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  alignContent: "center",
                                  alignItems: "center",
                                  flexDirection: "row",
                                  width: 15,
                                }}
                              >
                                {render?.city?.length > 0 && index !== 0 ? (
                                  <Ripple onPress={() => move(position - 1)}>
                                    <Prevabu height={15} width={15} />
                                  </Ripple>
                                ) : null}
                              </View>

                              <View style={{}}>
                                {render?.city?.length > 0 ? (
                                  <Text
                                    size="title"
                                    type="bold"
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    <Truncate
                                      text={item?.name ? item.name : "-"}
                                      length={35}
                                    />
                                  </Text>
                                ) : (
                                  <Text
                                    size="title"
                                    type="bold"
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    {"Tidak ada event bulan ini"}
                                  </Text>
                                )}
                              </View>
                              <View
                                style={{
                                  alignContent: "center",
                                  alignItems: "center",
                                  flexDirection: "row",
                                }}
                              >
                                {render?.city?.length > 0 &&
                                index !== render?.city?.length - 1 ? (
                                  <Ripple onPress={() => move(position + 1)}>
                                    <Nextabu height={15} width={15} />
                                  </Ripple>
                                ) : null}
                              </View>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ))}
                  </View>
                )}
                customSlide={({ index, item, style, width }) => (
                  <View
                    key={"aaas" + index}
                    style={{
                      width: Dimensions.get("screen").width,
                      marginTop: 40,
                      alignItems: "center",
                      alignContent: "center",
                      flex: 1,
                    }}
                  >
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
                        height: width * 0.5,
                        width: "100%",
                        borderRadius: 10,
                        marginLeft: 2,
                        marginVertical: 2,
                      }}
                    >
                      <Image
                        style={{
                          height: "100%",
                          width: Dimensions.get("screen").width - 57,
                          marginLeft: 2,
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
                        marginTop: 10,
                        justifyContent: "flex-start",
                      }}
                    >
                      {item.destination && item.destination.length > 0 ? (
                        <FlatList
                          listKey={`key-${item.destination.length}`}
                          data={item.destination}
                          keyExtractor={(item, index) => `key-${index}`}
                          numColumns={4}
                          renderItem={({ item, index }) => (
                            <Ripple
                              onPress={() => {
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
                                marginLeft: 2,
                                marginHorizontal: 10,
                                alignContent: "center",
                                alignItems: "center",
                                borderColor: "#209fae",
                              }}
                            >
                              <Image
                                style={{
                                  borderRadius: 10,
                                  height: (width - 110) / 4,
                                  width: (width - 110) / 4,
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
                                size="description"
                                type="bold"
                                style={{
                                  textAlign: "center",
                                  marginVertical: 10,
                                }}
                              >
                                <Truncate
                                  text={Capital({
                                    text: item?.name ? item.name : "",
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
              />
            </View>
          </View>
        ) : null}

        {/*  artikel */}
        {render?.article_type && render.article_type.length > 0 ? (
          <View
            key={`general-parent-6`}
            style={{
              marginTop: 15,
              flexDirection: "column",
            }}
          >
            <View>
              <View
                style={{
                  paddingHorizontal: 5,
                }}
              >
                {i18n.language === "id" ? (
                  <Text size="title" type="bold" style={{ marginBottom: 3 }}>
                    {t("uniquefacts")}

                    <Capital text={render?.name} />
                  </Text>
                ) : (
                  <Text size="title" type="bold" style={{ marginBottom: 3 }}>
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
              </View>
              <View
                style={{
                  marginTop: 10,
                  borderRadius: 10,
                  minHeight: 50,
                  justifyContent: "center",

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
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
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
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: 0.5,
                    // backgroundColor: "#209FAE",
                  }}
                >
                  <Text size="title" type="bold" style={{ color: "#464646" }}>
                    {render?.name} Facts
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
        {/* Essential with Tabs */}
        {render?.practical?.length > 0 || render?.about?.length > 0 ? (
          <View
            key={`general-parent-7`}
            style={{
              paddingTop: 15,
              paddingBottom: 15,
              width: "100%",
            }}
          >
            <View
              style={{
                paddingHorizontal: 5,
              }}
            >
              <Text size="title" type="bold" style={{ marginBottom: 3 }}>
                {t("essentials")}
              </Text>
              <Text size="description">{t("gooddestinationtrip")}</Text>
            </View>

            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                paddingBottom: 10,
                minHeight: 50,
                justifyContent: "center",
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
                  height: 2,
                }}
                tabContainerStyle={{
                  backgroundColor: "white",
                  elevation: 0,
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}
                style={{}}
                // locked={false}
              >
                <Tab
                  heading={t("About")}
                  tabStyle={{
                    backgroundColor: "white",
                    elevation: 0,
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                    borderTopLeftRadius: 10,
                  }}
                  activeTabStyle={{
                    backgroundColor: "white",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                    borderTopLeftRadius: 10,
                  }}
                  textStyle={{
                    fontFamily: "Lato-Regular",
                    fontSize: 16,
                    color: "#6C6C6C",
                  }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
                    color: "#209FAE",
                  }}
                >
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 10,
                      flexWrap: "wrap",
                      paddingHorizontal: 10,
                      flexDirection: "row",
                    }}
                  >
                    {render.about.length > 0
                      ? render.about.map((item, index) => (
                          <Ripple
                            key={`key-${index}-about`}
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
                            <View
                              key={`key-${index}-about-child`}
                              style={{
                                height: 45,
                              }}
                            >
                              <FunIcon
                                icon={item.icon ? item.icon : "w-fog"}
                                height={50}
                                width={50}
                                style={{
                                  bottom: -3,
                                }}
                              />
                            </View>
                            <Text
                              size="description"
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
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                    borderTopRightRadius: 10,
                  }}
                  activeTabStyle={{
                    backgroundColor: "white",
                    borderBottomColor: "#d1d1d1",
                    borderBottomWidth: Platform.OS == "ios" ? 0 : 1,
                    borderTopRightRadius: 10,
                  }}
                  textStyle={{
                    fontFamily: "Lato-Regular",
                    fontSize: 16,
                    color: "#6C6C6C",
                  }}
                  activeTextStyle={{
                    fontFamily: "Lato-Bold",
                    fontSize: 16,
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
                    {render.practical.length > 0
                      ? render.practical.map((item, index) => (
                          <Ripple
                            key={`key-${index}-practical`}
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
                            <View
                              key={`key-${index}-practical-child`}
                              style={{
                                height: 45,
                              }}
                            >
                              <FunIcon
                                icon={item.icon ? item.icon : "w-fog"}
                                height={45}
                                width={45}
                                style={{
                                  bottom: -3,
                                }}
                              />
                            </View>
                            <Text
                              size="description"
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
        ) : null}
      </Animated.View>
    );
  };
  const RenderArticle = (e, dataR) => {
    let render = [];
    render = dataR;

    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, 55],
      extrapolateRight: "clamp",
    });

    return (
      <Animated.View
        key={`key-coba-render-article`}
        style={{
          paddingTop: 5,
          paddingBottom: 60,
          transform: [{ translateY: y }],
        }}
      >
        {render && render.length
          ? render.map((i, index) => {
              if (!i) {
                <View
                  key={`key-${index}-render-article`}
                  style={{ alignItems: "center" }}
                >
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
                  <View key={`key-${index}-render-article`}>
                    {i.type === "image" ? (
                      <View>
                        {i.title ? (
                          <Text
                            size="title"
                            type="bold"
                            style={{
                              marginBottom: 5,
                              paddingHorizontal: 5,
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}

                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <FunImage
                            source={i.image ? { uri: i.image } : default_image}
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              marginTop: i.title ? 5 : 0,
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
                            marginBottom: 15,
                            color: "#616161",
                            paddingHorizontal: 5,
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {i.title ? (
                          <Text
                            size="title"
                            type="bold"
                            style={{
                              marginBottom: 5,
                              paddingHorizontal: 5,

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
                            lineHeight: 22,
                            textAlign: "left",
                            color: "#464646",
                            marginBottom: 15,

                            paddingHorizontal: 5,
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
  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex?.current]?.key;

    listRefArr?.current?.forEach((item) => {
      if (item?.key !== curRouteKey) {
        if (scrollY?._value < HeaderHeight && scrollY?._value >= 0) {
          if (item?.value) {
            item?.value?.scrollToOffset({
              offset: scrollY?._value,
              animated: false,
            });
            listOffset.current[item?.key] = scrollY?._value;
          }
        } else if (scrollY?._value >= HeaderHeight) {
          if (
            listOffset.current[item?.key] < HeaderHeight ||
            listOffset.current[item?.key] == null
          ) {
            if (item?.value) {
              item?.value?.scrollToOffset({
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
        {...headerPanResponder.panHandlers}
        // style={[styles.header, { transform: [{ translateY: y }] }]}
        style={{
          transform: [{ translateY: y }],
          top: deviceId == "LYA-L29" ? SafeStatusBar : SafeStatusBar + 3,
          height: HeaderHeight - 3,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          backgroundColor: "#14646e",
        }}
        pointerEvents="none"
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
            height: "82%",
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
          source={
            data && data?.country_detail?.cover
              ? { uri: data?.country_detail?.cover }
              : default_image
          }
        />
        <Animated.View
          style={{
            // height: 55,
            width: Dimensions.get("screen").width,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            alignContent: "center",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
        >
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingTop: 10,
                display: "flex",
              }}
            >
              <Text size="title" type="bold">
                {data && data?.country_detail ? (
                  <Truncate
                    text={Capital({
                      text: data?.country_detail?.name
                        ? data?.country_detail?.name
                        : "",
                    })}
                    length={20}
                  ></Truncate>
                ) : null}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                  marginTop: 5,
                  marginBottom: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <PinHijau height={14} width={14} />
                  <Text size="label" type="regular" style={{ marginLeft: 5 }}>
                    {data && data?.country_detail
                      ? data?.country_detail?.continent?.name
                      : "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderShare = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 55],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        style={{
          transform: [{ translateY: y }],
          top: SafeStatusBar + 255,
          right: 20,
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
        }}
      >
        <Animated.View
          style={{
            height: 41,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            alignContent: "center",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
        >
          <Pressable
            onPress={() => (token ? SetShareModal(true) : setModalLogin(true))}
            style={{
              backgroundColor: "#F6F6F6",
              marginRight: 2,
              height: 30,
              width: 30,
              borderRadius: 17,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ShareBlack height={20} width={20} />
          </Pressable>
        </Animated.View>
      </Animated.View>
    );
  };

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
        listkey={"flat-city"}
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
          paddingHorizontal: 15,
          minHeight: height - SafeStatusBar + HeaderHeight,
        }}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, indexC) => `key-${indexC}-flat-city`}
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
          listKey={"list-tab-bar"}
          keyExtractor={(item, index) => `key-${index}-list-tab-bar`}
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
            <Ripple
              // key={"tabx" + index}
              onPress={() => {
                _tabIndex.current = id;
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
                  paddingHorizontal: Platform.OS === "ios" ? 10 : null,
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
                  numberOfLines={1}
                >
                  {/* <Truncate
                    text={item?.key ? item.key : ""}
                    length={Platform.OS === "ios" ? 15 : 15}
                  /> */}
                  {item?.key ? item.key : ""}
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
    }, 2000);
  }, []);

  let [loadings, setLoadings] = useState(true);

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
      <StaBar backgroundColor="#14646e" barStyle="light-content" />
      <ModalRN
        useNativeDriver={true}
        visible={modalLogin}
        onRequestClose={() => true}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalLogin(false)}
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
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: Dimensions.get("screen").height / 3,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 120,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
                size="title"
                type="bold"
              >
                {t("LoginFirst")}
              </Text>
              <Pressable
                onPress={() => setModalLogin(false)}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <View
              style={{
                alignItems: "center",
                marginHorizontal: 30,
                marginBottom: 15,
                marginTop: 12,
              }}
            >
              <Text style={{ marginBottom: 5 }} size="title" type="bold">
                {t("nextLogin")}
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 18 }}
                size="label"
                type="regular"
              >
                {t("textLogin")}
              </Text>
            </View>
            <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
              <Button
                style={{ marginBottom: 5 }}
                onPress={() => {
                  setModalLogin(false);
                  props.navigation.push("AuthStack", {
                    screen: "LoginScreen",
                  });
                }}
                type="icon"
                text={t("signin")}
              ></Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                  {t("or")}
                </Text>
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  size="label"
                  type="bold"
                  style={{ color: "#209FAE" }}
                  onPress={() => {
                    setModalLogin(false);
                    props.navigation.push("AuthStack", {
                      screen: "RegisterScreen",
                    });
                  }}
                >
                  {t("createAkunLogin")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ModalRN>

      <Animated.View
        style={{
          position: "absolute",
          top: SafeStatusBar,
          zIndex: 9999,
          opacity: hides.current,
          flexDirection: "row",
          justifyContent: "space-between",
          height: 52,
          alignContent: "center",
          alignItems: "center",
          marginHorizontal: 15,
          width: Dimensions.get("screen").width - 35,
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
        <TouchableOpacity
          onPress={(x) =>
            props.navigation.push("SearchPg", {
              idcountry: data?.country_detail?.id,
              searchInput: "",
              locationname: data?.country_detail?.name,
              aktifsearch: true,
            })
          }
          style={{
            width: Dimensions.get("screen").width - 90,
            backgroundColor: "rgba(0,0,0,0.5)",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            height: 35,
          }}
        >
          <Image
            source={search_button}
            style={{
              height: 15,
              width: 15,
              resizeMode: "contain",
              marginHorizontal: 10,
            }}
          ></Image>

          <View>
            <Text
              size="readable"
              type="regular"
              style={{
                color: "#FFFFFF",
              }}
            >
              <Truncate
                text={
                  data?.country_detail?.name
                    ? t("searchin") + data?.country_detail?.name
                    : ""
                }
                length={25}
              />
            </Text>
          </View>
        </TouchableOpacity>
        {/* <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          // onPress={() => setshowside(true)}
          style={{
            height: 50,
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
            <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
          </Animated.View>
        </Button> */}
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

          height: 55,
          alignContent: "center",
          alignItems: "center",
          paddingLeft: 15,
          paddingRight: 20,

          width: Dimensions.get("screen").width,
          backgroundColor: "#209fae",
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
        <TouchableOpacity
          onPress={(x) =>
            props.navigation.push("SearchPg", {
              idcountry: data?.country_detail?.id,
              searchInput: "",
              locationname: data?.country_detail?.name,
              aktifsearch: true,
            })
          }
          style={{
            width: Dimensions.get("screen").width - 90,
            backgroundColor: "rgba(0,0,0,0.3)",
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            height: 35,
          }}
        >
          <Image
            source={search_button}
            style={{
              height: 15,
              width: 15,
              resizeMode: "contain",
              marginHorizontal: 10,
            }}
          ></Image>

          <View>
            <Text
              size="readable"
              type="bold"
              style={{
                color: "#FFFFFF",
              }}
            >
              <Truncate
                text={
                  data?.country_detail?.name
                    ? t("searchin") + data?.country_detail?.name
                    : ""
                }
                length={25}
              />
            </Text>
          </View>
        </TouchableOpacity>
        {/* <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          // onPress={() => setshowside(true)}
          style={{
            height: 50,
          }}
        >
          <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
        </Button> */}
      </Animated.View>

      {renderTabView()}
      {renderHeader()}
      {renderShare()}
      {renderCustomRefresh()}

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
            opacity: 0.7,
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
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
                alignItems: "center",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                backgroundColor: "#f6f6f6",
                justifyContent: "center",
              }}
            >
              <Text size="title" type="bold" style={{ marginVertical: 15 }}>
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => SetShareModal(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 60,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                token
                  ? (SetShareModal(false),
                    // props.navigation.push("CountryStack", {
                    //   screen: "SendCountry",
                    //   params: {
                    //     country: data.country_detail,
                    //   },
                    // })
                    props.navigation.navigate("ChatStack", {
                      screen: "SendToChat",
                      params: {
                        dataSend: {
                          id: data?.country_detail?.id,
                          cover: data?.country_detail?.cover,
                          name: data?.country_detail?.name,
                          description: data?.country_detail?.description,
                        },
                        title: t("country"),
                        tag_type: "tag_country",
                      },
                    }))
                  : (setModalLogin(true), SetShareModal(false));
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("send_to")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                shareAction({
                  from: "country",
                  target: data?.country_detail?.id,
                });
                SetShareModal(false);
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("share")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                CopyLink({
                  from: "country",
                  target: data?.country_detail?.id,
                  success: t("successCopyLink"),
                  failed: t("failedCopyLink"),
                });
                SetShareModal(false);
              }}
            >
              <Text size="label" type="regular" style={{ marginVertical: 15 }}>
                {t("copyLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalRN>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    height: HeaderHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#14646e",
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
