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
  Modal as ModalRN,
  FlatList,
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
  Labeltag,
  Xgray,
  Nextabu,
  Prevabu,
  Globe,
  Newglobe,
  Padlock,
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
  FunImageBackground,
  FunAnimatedImage,
  RenderMaps,
  FunMaps,
  shareAction,
  CopyLink,
} from "../../../component";
import { Input, Tab, Tabs } from "native-base";
import CityJournal from "../../../graphQL/Query/Cities/JournalCity";
import CityItinerary from "../../../graphQL/Query/Cities/ItineraryCity";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
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
import { isNonEmptyArray } from "@apollo/client/utilities";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");

const TabBarHeight = 45;
const Notch = DeviceInfo.hasNotch();
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
  ios: Notch ? 48 : 20,
  android: StatusBar.currentHeight,
});
const tab1ItemSize = (width - 30) / 2;
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

let HEADER_MAX_HEIGHT = Dimensions.get("screen").height * 0.3;
let HEADER_MIN_HEIGHT = 55;
let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function CityDetail(props) {
  const { t, i18n } = useTranslation();
  let [token, setToken] = useState("");
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

  let datenow = years + "-" + Bln1;

  const [tabIndex, setIndex] = useState(0);
  const [routes, setRoutes] = useState(Array(100).fill(0));
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

  const arrayShadow = {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
    shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
    elevation: Platform.OS == "ios" ? 3 : 3.5,
  };

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
    return (
      <View
        style={{
          flexDirection: "row",
          paddingTop: Platform.OS == "ios" ? 4 : null,
        }}
      >
        <Text size="description">
          {Difference_In_Days + 1 > 1
            ? Difference_In_Days + 1 + " " + t("days")
            : Difference_In_Days + 1 + " " + t("day")}{" "}
          {Difference_In_Days > 1
            ? Difference_In_Days + " " + t("nights")
            : Difference_In_Days + " " + t("night")}
        </Text>
      </View>
    );
  };

  const bulan = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Des",
  ];

  const Gettahun = () => {
    let x = new Date();
    x = x.getFullYear();
    return x;
  };

  useEffect(() => {
    refreshData();
    setTimeout(() => {
      setLoadings(false);
    }, 2000);
    const Journalitinerarydata = props.navigation.addListener("focus", () => {
      getJournalCity();
      getItineraryCity;
    });
    return Journalitinerarydata;
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
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getPackageDetail();
    await getJournalCity();
    await getItineraryCity();
  };

  let [listCity, setListCity] = useState([]);

  const [
    getPackageDetail,
    { loading: loadingCity, data: dataCity, error: errorCity },
  ] = useLazyQuery(CitiesInformation, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.data.city_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setListCity(dataCity.CitiesInformation);
      let tab = [{ key: "general", title: "General" }];

      dataCity.CitiesInformation.article_header.map((item, index) => {
        tab.push({
          key: item.title,
          title: item.title,
          data: item.content,
        });
      });

      setRoutes(tab);
      let loop = 0;
      let eventavailable = [];
      if (dataCity.CitiesInformation?.event) {
        dataCity.CitiesInformation?.event.map((item, index) => {
          if (item?.event && item?.event?.length && item?.event?.length > 0) {
            loop = loop + 1;

            if (item.month == datenow) {
              eventavailable = item;
            }
            if (loop == 1) {
              eventavailable = item;
            }
          }
        });
      }
      setdataevent(eventavailable);
      getJournalCity();
    },
  });

  // console.log("data", dataCity);

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

  let [list_journal, setList_journal] = useState({});
  const [
    getJournalCity,
    { loading: loadingjournal, data: dataJournal, error: errorjournal },
  ] = useLazyQuery(CityJournal, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.data.city_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setList_journal(dataJournal.journal_by_city);
    },
  });

  let [list_populer, setList_populer] = useState({});
  const [
    getItineraryCity,
    { loading: loadingitinerary, data: dataItinerary, error: errorItinerary },
  ] = useLazyQuery(CityItinerary, {
    fetchPolicy: "network-only",
    variables: {
      id: props.route.params.data.city_id,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    onCompleted: () => {
      setList_populer(dataItinerary.itinerary_populer_by_city);
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

  let [tutup, setTutup] = useState(true);

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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
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
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // liked journal
  const _likedjournal = async (id, index, item) => {
    let fiindex = await list_journal.findIndex((k) => k["id"] === id);
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
          getJournalCity();
          if (
            response.data.like_journal.code === 200 ||
            response.data.like_journal.code === "200"
          ) {
            // list_journal[fiindex].liked = true;
          } else {
            throw new Error(response.data.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        getJournalCity();
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

  // unliked journal
  const _unlikedjournal = async (id, index) => {
    let fiindex = await list_journal.findIndex((k) => k["id"] === id);
    if (token) {
      // list_journal[fiindex].liked = false;
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
          getJournalCity();
          if (
            response.data.unlike_journal.code === 200 ||
            response.data.unlike_journal.code === "200"
          ) {
            list_journal[fiindex].liked = false;
          } else {
            throw new Error(response.data.unlike_journal.message);
          }
        }
      } catch (error) {
        getJournalCity();
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

  const _likeditinerary = async (id, index) => {
    if (token) {
      try {
        let response = await mutationliked({
          variables: {
            id: id,
            qty: 1,
          },
        });
        if (loadingLike) {
          Alert.alert("Loading!!");
        }
        if (errorLike) {
          throw new Error("Error Input");
        }
        if (response.data) {
          getItineraryCity();
          if (
            response.data.setItineraryFavorit.code === 200 ||
            response.data.setItineraryFavorit.code === "200"
          ) {
          } else {
            throw new Error(response.data.setItineraryFavorit.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        getItineraryCity();
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

  const _unlikeditinerary = async (id, index) => {
    if (token) {
      getItineraryCity();
      try {
        let response = await mutationUnliked({
          variables: {
            id: id,
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
            response.data.unsetItineraryFavorit.code === 200 ||
            response.data.unsetItineraryFavorit.code === "200"
          ) {
          } else {
            throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        getItineraryCity();
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

  // RenderGeneral
  const RenderGeneral = ({}) => {
    let render = [];
    render =
      dataCity && dataCity.CitiesInformation
        ? dataCity.CitiesInformation
        : null;

    let renderjournal = [];
    renderjournal = list_journal;

    let renderItinerary = list_populer;

    return (
      // Deskripsi
      <View
        style={{
          // padding render auto 10
          marginTop: 5,
        }}
      >
        {render && render.description ? (
          <View
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
                  size="readable"
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
                  size="readable"
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
                    size="readable"
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
                    size="readable"
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
        {/* Activities */}
        {render && render.destination_type.length > 0 ? (
          <View
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
                {t("activities&Experience")}
              </Text>
              <Text size="description">{t("exprole&inspiredtrip")}</Text>
            </View>

            <View
              style={{
                marginTop: 10,
                borderRadius: 10,
                paddingBottom: 5,
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
              <View
                style={{
                  width: "100%",
                  paddingVertical: 10,
                  flexWrap: "wrap",
                  paddingHorizontal: 10,
                  flexDirection: "row",
                }}
              >
                {tutup == true
                  ? render.destination_type.map((item, index) => {
                      return index < 8 ? (
                        <Ripple
                          key={"keydestination" + index}
                          onPress={() => {
                            props.navigation.push("DestinationList", {
                              idtype: item.id_type,
                              idcity: render.id,
                              token: token,
                            });
                          }}
                          style={{
                            width: "25%",
                            alignContent: "center",
                            alignItems: "center",
                            padding: 5,
                          }}
                        >
                          {loadings ? (
                            <View
                              style={{
                                width: width,
                                justifyContent: "center",
                                alignItems: "center",
                                height: 60,
                                marginTop: 5,
                              }}
                            >
                              <ActivityIndicator
                                color="#209FAE"
                                animating={true}
                              />
                            </View>
                          ) : (
                            <View
                              style={{
                                height: 60,
                                marginVertical: 10,
                              }}
                            >
                              <View
                                style={{
                                  height: 60,
                                  width: 60,
                                  borderRadius: 40,
                                  backgroundColor: "#F6F6F6",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  alignSelf: "center",
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
                                  marginTop: 3,
                                }}
                              >
                                {item.name}
                              </Text>
                            </View>
                          )}
                        </Ripple>
                      ) : null;
                    })
                  : render.destination_type.map((item, index) => {
                      return (
                        <Ripple
                          key={"keydestination1" + index}
                          onPress={() => {
                            props.navigation.push("DestinationList", {
                              idtype: item.id,
                              idcity: render.id,
                            });
                          }}
                          style={{
                            width: "25%",
                            alignContent: "center",
                            alignItems: "center",
                            padding: 5,
                          }}
                        >
                          <View
                            style={{
                              height: 80,
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
                            <Text
                              size="description"
                              style={{
                                textAlign: "center",
                                marginTop: 3,
                              }}
                            >
                              {item.name}
                            </Text>
                          </View>
                        </Ripple>
                      );
                    })}
                <View
                  style={{
                    width: "100%",
                    marginTop: 10,
                    alignItems: "center",
                    alignContent: "center",
                  }}
                >
                  {tutup == true && render.destination_type.length > 7 ? (
                    <TouchableOpacity
                      onPress={() => {
                        setTutup(false);
                      }}
                      style={{ flexDirection: "row" }}
                    >
                      <Text style={{ color: "#209FAE" }}>{t("showmore")} </Text>
                      <Showmore
                        height={12}
                        width={12}
                        style={{ marginTop: 3 }}
                      />
                    </TouchableOpacity>
                  ) : null}

                  {tutup == false ? (
                    <TouchableOpacity
                      onPress={() => {
                        setTutup(true);
                      }}
                      style={{ flexDirection: "row" }}
                    >
                      <Text style={{ color: "#209FAE" }}>{t("showless")} </Text>
                      <Showless
                        height={12}
                        width={12}
                        style={{ marginTop: 3 }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* at Glance with Tabs */}
        <View
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
                    height={260}
                    width={width - 40}
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
                      render?.countries?.climate
                        ? { uri: render.countries.climate }
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
                      render?.countries?.religion
                        ? { uri: render.countries.religion }
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
                  key={"imagesliderjournalsdsd"}
                  images={renderjournal ? spreadData(renderjournal) : []}
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,

                    backgroundColor: "#white",
                  }}
                  customSlide={({ index, item, style, width }) => (
                    <View key={"ky" + index}>
                      {item.map((dataX, indeks) => {
                        return (
                          <Pressable
                            key={"jrnla" + indeks}
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
                              key={"keys" + index}
                              underlayColor="#f7f7f700"
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
        {/* Essential with Tabs */}
        {render?.practical?.length > 0 || render?.about?.length > 0 ? (
          <View
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
                            key={"keyabout" + index}
                            onPress={() => {
                              props.navigation.navigate("Abouts", {
                                active: item.id,
                                city_id: render.id,
                                indexcity: index,
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
                            key={"keypractical" + index}
                            onPress={() => {
                              props.navigation.navigate(
                                "PracticalInformation",
                                {
                                  active: item.id,
                                  city_id: render.id,
                                  indexcity: index,
                                }
                              );
                            }}
                            style={{
                              width: "33.333%",
                              alignContent: "center",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <View
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
        {/* Event */}
        <View
          style={{
            flexDirection: "column",
            paddingTop: 15,
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 5,
              }}
            >
              <Text type="bold" size="title" style={{ marginBottom: 3 }}>
                {t("festival&event")}
              </Text>
              <Ripple
                onPress={() => {
                  props.navigation.navigate("listevent", {
                    idcity: render.id,
                    // idcountries:
                  });
                }}
              ></Ripple>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                paddingHorizontal: 5,
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  width: "75%",
                }}
              >
                <Text
                  size="description"
                  style={{
                    textAlign: "justify",
                    // marginBottom: 5,
                  }}
                >
                  {t("exprolefestival&eventcity")}
                </Text>
              </View>

              <Text
                type="bold"
                size="description"
                style={{
                  color: "#209fae",
                }}
              >
                {t("viewAll")}
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                width: "100%",
                shadowColor: "#000",
                borderRadius: 10,
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
                listkey={"imgsldrevent"}
                images={
                  dataevent?.event?.length > 0
                    ? dataevent?.event
                    : [
                        {
                          cover: null,
                          images: [],
                        },
                      ]
                }
                style={{
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                  // width: Dimensions.get('screen').width - 40,
                }}
                customSlide={({ index, item, style, width }) => (
                  <Ripple
                    onPress={() => {
                      Goto(item);
                    }}
                    key={index}
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                    }}
                  >
                    <ImageBackground
                      source={
                        item?.cover
                          ? { uri: item?.cover }
                          : item?.images?.length > 0
                          ? { uri: item?.images[0]?.image }
                          : default_image
                      }
                      style={{
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        height: Dimensions.get("screen").width * 0.4,
                        width: Dimensions.get("screen").width - 30,
                        alignContent: "center",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                      imageStyle={{
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        height: Dimensions.get("screen").width * 0.4,
                        width: Dimensions.get("screen").width - 30,
                        // resizeMode: "cover",
                      }}
                    ></ImageBackground>
                  </Ripple>
                )}
                customButtons={(position, move) => (
                  <View>
                    {/* hide custom bottom */}
                    <View
                      style={{
                        width: width - 40,
                        position: "absolute",
                        bottom: 10,
                        borderWidth: 1,
                        display: "none",
                        left: 0,
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      {(dataevent?.event?.length > 0
                        ? dataevent?.event
                        : [default_image]
                      ).map((item, index) => {
                        return (
                          <TouchableHighlight
                            key={"keyevent" + index}
                            underlayColor="#f7f7f700"
                            onPress={() => move(index)}
                          >
                            <View
                              style={{
                                height: position === index ? 7 : 5,
                                width: position === index ? 7 : 5,
                                borderRadius: position === index ? 7 : 3,
                                backgroundColor:
                                  position === index ? "#209fae" : "white",
                                marginHorizontal: 2,
                              }}
                            ></View>
                          </TouchableHighlight>
                        );
                      })}
                      {/* show title event and move position */}
                    </View>
                    {(dataevent?.event?.length > 0
                      ? dataevent?.event
                      : [default_image]
                    ).map((item, index) => (
                      <View>
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
                                paddingHorizontal: 25,
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
                                {dataevent?.event?.length > 0 && index !== 0 ? (
                                  <Ripple onPress={() => move(position - 1)}>
                                    <Prevabu height={15} width={15} />
                                  </Ripple>
                                ) : null}
                              </View>

                              <View style={{}}>
                                {dataevent?.event?.length > 0 ? (
                                  <Text
                                    size="title"
                                    type="bold"
                                    style={{
                                      textAlign: "center",
                                    }}
                                  >
                                    <Truncate text={item.name} length={35} />
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
                                {dataevent?.event?.length > 0 &&
                                index !== dataevent?.event?.length - 1 ? (
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
              />

              <View
                style={{
                  width: "100%",
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                {render?.event
                  ? render?.event.map((item, index) => {
                      return (
                        <Ripple
                          key={"keyevent1" + index}
                          onPress={() => {
                            setdataevent(item);
                          }}
                          style={{
                            backgroundColor:
                              dataevent.month === item.month ? "#DAF0F2" : null,
                            // borderWidth: 1,
                            width: "33.3%",
                            height: 38,
                            // justifyContent: '',
                            alignContent: "center",
                            alignItems: "center",
                            padding: 7,
                            borderBottomWidth:
                              dataevent.month === item.month ? 2 : 0,
                            borderBottomColor:
                              dataevent.month === item.month
                                ? "#209fae"
                                : "#646464",
                            borderTopWidth: 0.5,
                            borderLeftWidth:
                              index !== 0 &&
                              index !== 3 &&
                              index !== 6 &&
                              index !== 9
                                ? 0.5
                                : 0,
                            // borderRightWidth: 0.5,
                            borderColor: "#d1d1d1",
                          }}
                        >
                          <Text
                            size="title"
                            type={
                              dataevent.month === item.month
                                ? "bold"
                                : "regular"
                            }
                            style={{
                              color:
                                dataevent.month === item.month
                                  ? "#209fae"
                                  : "#646464",
                              textAlign: "center",
                              marginTop: 3,
                            }}
                          >
                            {bulan[index]}
                          </Text>
                        </Ripple>
                      );
                    })
                  : bulan.map((item, index) => {
                      return (
                        <Ripple
                          key={"keybulan" + index}
                          style={{
                            width: "33.3%",
                            alignContent: "center",
                            alignItems: "center",
                            padding: 7,
                            borderTopWidth: 0.5,
                            borderLeftWidth:
                              index !== 0 && index !== 3 && index !== 7
                                ? 0.5
                                : 0,
                            borderColor: "#209fae",
                          }}
                        >
                          <Text
                            size="description"
                            type="bold"
                            style={{
                              textAlign: "center",
                              marginTop: 3,
                            }}
                          >
                            {item}
                          </Text>
                        </Ripple>
                      );
                    })}
              </View>
            </View>
          </View>
        </View>
        {/* Itinerary Terbaru */}
        {renderItinerary.length > 0 ? (
          <View
            style={{
              paddingTop: 15,
              flexDirection: "column",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",

                paddingHorizontal: 5,
              }}
            >
              <Text type="bold" size="title" style={{}}>
                {t("Itinerary")}
              </Text>
              <Ripple
                onPress={() => {
                  props.navigation.navigate("ItineraryStack", {
                    screen: "ItineraryCategory",
                    params: {
                      typeCategory: null,
                      idcity: render.id,
                      typeOrder: null,
                    },

                    // idcountries:
                  });
                }}
              >
                <Text
                  type="bold"
                  size="description"
                  style={{
                    color: "#209fae",
                  }}
                >
                  {t("viewAll")}
                </Text>
              </Ripple>
            </View>
            {loadingCity ? (
              <View style={{ marginVertical: 20 }}>
                <ActivityIndicator animating={true} color="#209FAE" />
              </View>
            ) : renderItinerary.length > 0 ? (
              <FlatList
                data={renderItinerary}
                keyExtractor={(item) => item.id}
                horizontal={true}
                contentContainerStyle={{
                  paddingLeft: 2,
                  paddingVertical: 15,
                }}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      height: 145,

                      marginTop: 0,
                      width: Dimensions.get("screen").width - 35,
                      marginRight: 5,
                    }}
                  >
                    <View
                      style={{
                        borderRadius: 10,
                        backgroundColor: "#FFF",
                        shadowColor: "#000",
                        shadowOffset: {
                          width: 0,
                          height: 5,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 6.27,
                        elevation: 6,
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Pressable
                        onPress={() =>
                          props.navigation.navigate("ItineraryStack", {
                            screen: "itindetail",
                            params: {
                              itintitle: item.name,
                              country: item.id,
                              token: token,
                              status: "favorite",
                              index: 0,
                            },
                          })
                        }
                        style={{
                          backgroundColor: "#FFFFFF",
                          height: "80%",
                          flexDirection: "row",
                          zIndex: -1,
                          borderWidth: 1,
                          borderTopLeftRadius: 10,
                          borderTopRightRadius: 10,
                          borderColor: "#d1d1d1",
                        }}
                      >
                        <View
                          style={{
                            width: "40%",
                          }}
                        >
                          <Image
                            source={
                              item && item.cover
                                ? {
                                    uri: item.cover,
                                  }
                                : default_image
                            }
                            style={{
                              height: "100%",
                              width: "100%",
                              borderTopLeftRadius: 10,
                            }}
                          />
                          <View
                            style={{
                              position: "absolute",
                              height: 30,
                              marginTop: 10,
                              // borderWidth: 1,
                              margin: 5,
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              style={{
                                height: 30,
                                width: 30,
                                borderRadius: 16,
                                borderColor: "rgba(52, 52, 52, 0.75)",
                                zIndex: 1,
                              }}
                              source={
                                item &&
                                item.user_created &&
                                item.user_created.picture
                                  ? {
                                      uri: item.user_created.picture,
                                    }
                                  : default_image
                              }
                            />
                            <Text
                              size="description"
                              type="bold"
                              style={{
                                zIndex: 0,
                                paddingLeft: 10,
                                paddingRight: 8,
                                backgroundColor: "rgba(52, 52, 52, 0.8)",
                                borderRadius: 5,
                                color: "white",
                                marginLeft: -5,
                                padding: 2,
                              }}
                            >
                              {Truncate({
                                text: item?.user_created?.first_name
                                  ? item?.user_created?.first_name
                                  : "user_deleted",
                                length: 17,
                              })}
                            </Text>
                          </View>
                        </View>

                        <View
                          style={{
                            width: "60%",
                            backgroundColor: "#FFFFFF",
                            borderTopRightRadius: 10,
                            paddingVertical: 10,
                            overflow: "hidden",
                          }}
                        >
                          <View
                            style={{
                              paddingHorizontal: 10,
                              height: "100%",
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",

                                alignItems: "center",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#DAF0F2",
                                    borderWidth: 0.5,
                                    borderRadius: 3,
                                    borderColor: "#209FAE",
                                    paddingHorizontal: 5,
                                    paddingVertical: 2,
                                  }}
                                >
                                  <Text
                                    type="regular"
                                    size="description"
                                    style={{
                                      color: "#209FAE",
                                    }}
                                  >
                                    {item?.categori?.name
                                      ? item?.categori?.name
                                      : "No Category"}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    height: 5,
                                    width: 5,
                                    borderRadius: 5,
                                    backgroundColor: "#000000",
                                    marginHorizontal: 10,
                                    alignSelf: "center",
                                  }}
                                />
                                <View
                                  style={{
                                    alignSelf: "center",
                                  }}
                                >
                                  {item.isprivate == false ? (
                                    <Newglobe width={20} height={20} />
                                  ) : (
                                    <Padlock width={20} height={20} />
                                  )}
                                </View>
                              </View>

                              <View>
                                {item.liked === false ? (
                                  <Ripple
                                    onPress={() =>
                                      _likeditinerary(item.id, index)
                                    }
                                  >
                                    <LikeEmpty height={12} width={12} />
                                  </Ripple>
                                ) : (
                                  <Ripple
                                    onPress={() =>
                                      _unlikeditinerary(item.id, index)
                                    }
                                  >
                                    <LikeRed height={12} width={12} />
                                  </Ripple>
                                )}
                              </View>
                            </View>
                            <View
                              style={{
                                justifyContent: "space-between",

                                height: "90%",
                              }}
                            >
                              <View
                                style={{
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text
                                  size="readable"
                                  type="black"
                                  style={{
                                    marginTop: 5,
                                  }}
                                >
                                  <Truncate text={item.name} length={40} />
                                </Text>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginTop: 5,
                                  }}
                                >
                                  <PinHijau width={15} height={15} />
                                  <Text
                                    style={{
                                      marginLeft: 5,
                                    }}
                                    size="description"
                                    type="regular"
                                  >
                                    {item?.country?.name}
                                  </Text>
                                  <Text>,</Text>
                                  <Text
                                    size="description"
                                    type="regular"
                                    style={{
                                      marginLeft: 3,
                                    }}
                                  >
                                    {item?.city?.name}
                                  </Text>
                                </View>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginTop: 20,
                                  marginBottom: Platform.OS == "ios" ? 5 : 10,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",

                                    marginLeft: 5,
                                  }}
                                >
                                  <Calendargrey
                                    width={10}
                                    height={10}
                                    style={{
                                      marginRight: 5,
                                    }}
                                  />

                                  <Text size="description" type="regular">
                                    {item.start_date && item.end_date
                                      ? getDN(item.start_date, item.end_date)
                                      : null}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: 15,
                                  }}
                                >
                                  <User
                                    width={10}
                                    height={10}
                                    style={{
                                      marginRight: 5,
                                    }}
                                  />
                                  {item.buddy_count > 1 ? (
                                    <Text size="description" type="regular">
                                      {(item && item.buddy_count
                                        ? item.buddy_count
                                        : null) +
                                        " " +
                                        t("persons")}
                                    </Text>
                                  ) : (
                                    <Text size="description" type="regular">
                                      {(item && item.buddy_count
                                        ? item.buddy_count
                                        : null) +
                                        " " +
                                        t("person")}
                                    </Text>
                                  )}
                                </View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                      <View
                        style={{
                          height: "22%",
                          width: "100%",
                          flexDirection: "row",
                          backgroundColor: "#FFFFFF",
                          borderBottomLeftRadius: 10,
                          borderBottomRightRadius: 10,
                          marginRight: 10,
                          justifyContent: "space-between",
                        }}
                      >
                        <Pressable
                          onPress={() =>
                            props.navigation.navigate("ItineraryStack", {
                              screen: "itindetail",
                              params: {
                                itintitle: item.name,
                                country: item.id,
                                token: token,
                                status: "favorite",
                                index: 1,
                              },
                            })
                          }
                          style={{
                            width: "50%",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            borderLeftWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "#d1d1d1",
                            borderBottomLeftRadius: 10,
                            // borderRightWidth: 1,
                            borderColor: "#D1D1D1",
                            // marginBottom: 5,
                          }}
                        >
                          <TravelAlbum
                            style={{
                              marginRight: 5,
                            }}
                            height={12}
                            width={12}
                          />
                          <Text
                            size="description"
                            type="bold"
                            style={{
                              color: "#209FAE",
                            }}
                          >
                            Travel Album
                          </Text>
                        </Pressable>
                        <View
                          style={{
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <View
                            style={{
                              height: "100%",
                              width: 1,
                              backgroundColor: "#d1d1d1",
                              borderBottomWidth: 1,
                              borderBottomColor: "#D1D1D1",
                            }}
                          />
                        </View>
                        <Pressable
                          onPress={() =>
                            props.navigation.navigate("ItineraryStack", {
                              screen: "itindetail",
                              params: {
                                itintitle: item.name,
                                country: item.id,
                                token: token,
                                status: "favorite",
                                index: 2,
                              },
                            })
                          }
                          style={{
                            width: "49%",
                            flexDirection: "row",
                            alignItems: "center",
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "#d1d1d1",
                            borderBottomRightRadius: 10,
                            justifyContent: "center",
                            // marginBottom: 5,
                          }}
                        >
                          <TravelStories
                            style={{
                              marginRight: 5,
                            }}
                            height={12}
                            width={12}
                          />
                          <Text
                            size="description"
                            type="bold"
                            style={{
                              color: "#209FAE",
                            }}
                          >
                            Travel Stories
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                )}
              />
            ) : null}
          </View>
        ) : null}
      </View>
    );
  };
  const RenderArticle = (e, dataR) => {
    let render = [];
    render = dataR;

    return (
      <View
        style={{
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
      </View>
    );
  };
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
        {...headerPanResponder.panHandlers}
        style={[styles.header, { transform: [{ translateY: y }] }]}
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
            height: "85%",
            resizeMode: "cover",
            opacity: imageOpacity,
            transform: [{ translateY: imageTranslate }],
          }}
          source={
            dataCity && dataCity.CitiesInformation.cover
              ? { uri: dataCity.CitiesInformation.cover }
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
                {dataCity && dataCity.CitiesInformation ? (
                  <Truncate
                    text={Capital({
                      text: dataCity.CitiesInformation.name,
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
                  <PinHijau height={12} width={12} />
                  <Text size="label" type="regular" style={{ marginLeft: 10 }}>
                    {dataCity && dataCity.CitiesInformation
                      ? dataCity.CitiesInformation.countries.name
                      : "-"}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    marginLeft: 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Labeltag height={12} width={12} />
                  {i18n.language === "id" ? (
                    <Text
                      size="label"
                      type="regular"
                      style={{ marginLeft: 10 }}
                    >
                      {t("cityof")} {t("province")}{" "}
                      {dataCity && dataCity.CitiesInformation
                        ? dataCity.CitiesInformation.province.name
                        : "-"}
                    </Text>
                  ) : (
                    <Text
                      size="description"
                      type="regular"
                      style={{ marginLeft: 10 }}
                    >
                      {t("cityof")}{" "}
                      {dataCity && dataCity.CitiesInformation
                        ? dataCity.CitiesInformation.province.name
                        : "-"}{" "}
                      {t("province")}
                    </Text>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Pressable
                onPress={() => SetShareModal(true)}
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
                <ShareBlack height={15} width={15} />
              </Pressable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    // let numCols;

    let data;
    let renderItem;
    switch (route.key) {
      case "general":
        // numCols = 2;
        data = tabGeneral;
        renderItem = RenderGeneral;
        break;
      default:
        // numCols = 3;
        data = tab2Data;
        renderItem = (e) => RenderArticle(e, route.data);
        break;
    }
    return (
      <Animated.FlatList
        listkey={"flatcity"}
        scrollToOverflowEnabled={true}
        scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        // numColumns={numCols}

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
          minHeight: height - SafeStatusBar + HeaderHeight,
          paddingHorizontal: 15,
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
          key={"listtabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
            borderBottomWidth: 1,
            borderColor: "#d1d1d1",
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
                  borderBottomWidth: 2,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#FFFFFF",
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
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 0.7,
                      borderBottomWidth: 0,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  <Truncate text={item.key} length={15} />
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

  /// Skeletonanimated

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
                height: 130,
                marginTop: 10,
                borderRadius: 5,
                borderWidth: 0.5,
                borderColor: "#dedede",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 10,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    padding: 10,
                  }}
                ></View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 30,
                  }}
                ></View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 30,
                  }}
                ></View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 30,
                  }}
                ></View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingVertical: 10,
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    padding: 10,
                  }}
                ></View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 30,
                  }}
                ></View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 30,
                  }}
                ></View>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    marginLeft: 30,
                  }}
                ></View>
              </View>
            </View>
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
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          </Animated.View>
        </Button>
        <TouchableOpacity
          onPress={(x) =>
            props.navigation.push("SearchPg", {
              idcity: dataCity.CitiesInformation.id,
              searchInput: "",
              locationname: listCity.name,
              aktifsearch: true,
            })
          }
          style={{
            width: Dimensions.get("screen").width - 130,
            backgroundColor: "rgba(0,0,0,0.3)",
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
            placeholder={"Search in " + listCity.name}
            returnKeyType="search"
            onSubmitEditing={(x) =>
              props.navigation.push("SearchPg", {
                idcity: dataCity.CitiesInformation.id,
                searchInput: search,
                aktifsearch: true,
              })
            }
          /> */}
          <View>
            <Text
              size="readable"
              type="bold"
              style={{
                color: "#FFFFFF",
              }}
            >
              {t("searchin") + listCity.name}
            </Text>
          </View>
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
          <Animated.View
            style={{
              height: 35,
              width: 35,

              borderRadius: 30,
              backgroundColor: "rgba(0,0,0,0.3)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
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
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          </Animated.View>
        </Button>
        <TouchableOpacity
          onPress={(x) =>
            props.navigation.push("SearchPg", {
              idcity: dataCity.CitiesInformation.id,
              searchInput: "",
              locationname: listCity.name,
              aktifsearch: true,
            })
          }
          style={{
            width: Dimensions.get("screen").width - 130,
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

          <View>
            <Text
              size="readable"
              type="bold"
              style={{
                color: "#FFFFFF",
              }}
            >
              {t("searchin") + listCity.name}
            </Text>
          </View>
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
          <OptionsVertWhite height={20} width={20}></OptionsVertWhite>
        </Button>
      </Animated.View>

      {renderTabView()}
      {renderHeader()}
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
            marginTop: Dimensions.get("screen").height / 4,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              // paddingHorizontal: 20,
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
                // height: 50,
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
                // height: 50,
                borderColor: "#d1d1d1",
              }}
              onPress={() => {
                SetShareModal(false);
                props.navigation.push("CountryStack", {
                  screen: "SendCity",
                  params: {
                    city: dataCity.CitiesInformation,
                  },
                });
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
                  from: "city",
                  target: dataCity.CitiesInformation.id,
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
                  from: "city",
                  target: dataCity.CitiesInformation.id,
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

      {/* <ModalRN
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
            borderRadius: 3,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 100,
              paddingVertical: 10,
              paddingHorizontal: 20,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
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
                // borderWidth: 1,
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderBottomWidth: 0.5,
                borderBottomColor: "d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                type="bold"
                style={{
                  marginBottom: 10,
                }}
              >
                {t("share")}
              </Text>
            </View>

            <TouchableOpacity
              style={{
                // paddingVertical: 10,
                paddingHorizontal: 20,
                // borderBottomWidth: 0.5,
                borderBottomColor: "d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                SetShareModal(false);
                props.navigation.push("CountryStack", {
                  screen: "SendCity",
                  params: {
                    city: dataCity.CitiesInformation,
                  },
                });
              }}
            >
              <Text
                size="description"
                type="regular"
                style={{
                  marginTop: 20,
                  marginBottom: 10,
                }}
              >
                {t("send_to")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                // paddingVertical: 10,
                paddingHorizontal: 20,
                // borderBottomWidth: 0.5,
                borderBottomColor: "d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                shareAction({
                  from: "city",
                  target: dataCity.CitiesInformation.id,
                });
                SetShareModal(false);
              }}
            >
              <Text
                size="description"
                type="regular"
                style={{
                  margin: 10,
                }}
              >
                {t("shareTo")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                // borderBottomWidth: 0.5,
                borderBottomColor: "d1d1d1",
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                CopyLink({
                  from: "city",
                  target: dataCity.CitiesInformation.id,
                });
                SetShareModal(false);
              }}
            >
              <Text
                size="description"
                type="regular"
                style={{
                  marginTop: 10,
                  marginBottom: 20,
                }}
              >
                {t("copyLink")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ModalRN>
     */}
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
    backgroundColor: "#FFA088",
  },
  Image: {
    resizeMode: "cover",
    height: Dimensions.get("window").width * 0.47 - 16,

    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    overflow: "hidden",
  },
  label: { fontSize: 16, color: "#464646", fontFamily: "Lato-Regular" },
  labelActive: { fontSize: 16, color: "#209FAE", fontFamily: "Lato-Bold" },
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
