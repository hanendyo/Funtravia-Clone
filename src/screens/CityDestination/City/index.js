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
  SafeAreaView,
  Pressable,
  ImageBackground,
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
  PinHijau,
  Calendargrey,
  User,
  TravelAlbum,
  TravelStories,
  LikeRed,
} from "../../../assets/svg";
import {
  TouchableHighlight,
} from "react-native-gesture-handler"
import {
  default_image,
  search_button,
  logo_funtravia,
} from "../../../assets/png";
import { Button, Capital, Sidebar , StatusBar as StaBar, Truncate,Text, FunIcon} from "../../../component";
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

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const HeaderHeight = 300;
const SafeStatusBar = Platform.select({
  ios: 44,
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

  const [tabIndex, setIndex] = useState(0);
  const [routes, setRoutes] = useState([1]);
  const [canScroll, setCanScroll] = useState(true);
  const [tabGeneral] = useState(Array(1).fill(0));
  const [tab2Data] = useState(Array(1).fill(0));
 

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
      <View style={{ flexDirection: "row" }}>
        <Text size="small">
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

  useEffect(()=> {
    refreshData();
  }, []);


  const refreshData = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    await getPackageDetail();
    await getJournalCity();
    await getItineraryCity();
  };
 
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
      let tab = [{ key: "general", title: "General" }];

      dataCity.CitiesInformation.article_header.map((item, index) => {
        tab.push({ key: item.title, title: item.title });
      });

      setRoutes(tab);
    }
  });
  
  const Goto = (item) => {
    if (item.id) {
      props.navigation.navigate("eventdetail", {
        data: item,
        name: item.name,
        token: token,
      });
    }
  };
  
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
  });

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
  });

  let list_populer = [];
  if (dataItinerary && dataItinerary.itinerary_populer_by_city) {
    list_populer = dataItinerary.itinerary_populer_by_city;
  }

  let list_journal = [];
  if (dataJournal && dataJournal.journal_by_city) {
    list_journal = dataJournal.journal_by_city;
  }

  /**
   * PanResponder for header
   */
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

  let [tutup, setTutup] = useState(true);
  const RenderType = ({ item }) => {
    return tutup == true
      ? item.map((item, index) => {
          return index < 8 ? (
            <Ripple
              onPress={() => {
                props.navigation.push("DestinationList", {
                  idtype: item.id,
                  idcity: render.id,
                });
              }}
              style={{
                // borderWidth: 1,
                width: "25%",
                // justifyContent: '',
                alignContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <View
                style={{
                  height: 60,
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
                  size="small"
                  style={{ textAlign: "center", marginTop: 3 }}
                >
                  {item.name}
                </Text>
              </View>
            </Ripple>
          ) : null;
        })
      : item.map((item, index) => {
          return (
            <Ripple
              onPress={() => {
                props.navigation.push("DestinationList", {
                  idtype: item.id,
                  idcity: render.id,
                });
              }}
              style={{
                // borderWidth: 1,
                width: "25%",
                // justifyContent: '',
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
                  size="small"
                  style={{ textAlign: "center", marginTop: 3 }}
                >
                  {item.name}
                </Text>
              </View>
            </Ripple>
          );
        });
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
  const _likedjournal = async (id, index) => {
    if (token || token !== "") {
      list_journal[index].liked = true;
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
          if (
            response.data.like_journal.code === 200 ||
            response.data.like_journal.code === "200"
          ) {
            list_journal[index].liked = true;
          } else {
            throw new Error(response.data.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        list_journal[index].liked = false;
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  // unliked journal
  const _unlikedjournal = async (id, index) => {
    if (token || token !== "") {
      list_journal[index].liked = false;
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
        }renderjournal
        // console.log("data unlike journal : ", response.data);
        if (response.data) {
          if (
            response.data.unlike_journal.code === 200 ||
            response.data.unlike_journal.code === "200"
          ) {
            list_journal[index].liked = false;
          } else {
            throw new Error(response.data.unlike_journal.message);
          }
        }
      } catch (error) {
        list_journal[index].response_count =
        list_journal[index].response_count - 1;
        list_journal[index].liked = true;
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _likeditinerary = async (id, index) => {
    if (token || token !== "") {
      list_populer[index].liked = true;
      list_populer[index].response_count =
        list_populer[index].response_count - 1;
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
          if (
            response.data.setItineraryFavorit.code === 200 ||
            response.data.setItineraryFavorit.code === "200"
          ) {
            list_populer[index].liked = true;
          } else {
            throw new Error(response.data.setItineraryFavorit.message);
          }

          // Alert.alert('Succes');
        }
      } catch (error) {
        list_populer[index].liked = false;
        list_populer[index].response_count =
          list_populer[index].response_count + 1;
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
  };

  const _unlikeditinerary = async (id, index) => {
    if (token || token !== "") {
      list_populer[index].liked = false;
      list_populer[index].response_count =
        list_populer[index].response_count + 1;
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
            list_populer[index].liked = false;
          } else {
            throw new Error(response.data.unsetItineraryFavorit.message);
          }
        }
      } catch (error) {
        list_populer[index].liked = true;
        list_populer[index].response_count =
          list_populer[index].response_count - 1;
      }
    } else {
      Alert.alert("Please Login");
    }
  };
  // RenderGeneral
  const RenderGeneral=({})=>{
    let render=[];
    render = dataCity && dataCity.CitiesInformation ? dataCity.CitiesInformation : null;

    let renderjournal=[];
    renderjournal = list_journal;

    let renderItinerary = list_populer;
    return (
      // Deskripsi
      <View >
    {render && render.description ? (     
      <View
        style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        flexDirection: "column",
      }}
      >
         <View>
         <Text type="bold" size="label" style={{}}>
          {t("generalInformation")}
        </Text>
        <Text
          size="readable"
          style={{
            textAlign: "justify",
          }}
        >
          {render ? render.description : null}
        </Text>
      </View>
      </View>
       ):null}
         {/* Activities */}
         {render.destination_type && render.destination_type.length > 0 ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{}}>
                {t("Activities & Experience")}
              </Text>
              <Text size="description">
                Explore and get inspired for your next trip
              </Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  // height: 100,
                  width: "100%",
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 5,
                  padding: 20,
                }}
              >
                <View
                  style={{
                    width: "100%",
                    // borderWidth: 1,
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  <RenderType item={render.destination_type} />

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
                          setTutup(!tutup);
                        }}
                        style={{ flexDirection: "row" }}
                      >
                        <Text style={{ color: "#209FAE" }}>Show More </Text>
                        <Showmore
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
              {/* Travel Jurnal */}
              {renderjournal && renderjournal.length > 0 ? (
            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: "100%",
              }}
            >
              <Text size="label" type="bold" style={{}}>
                Travel Journal
                {/* {t("TravelJurnal")} */}
              </Text>
              <Text size="description">
                Traveller Adventures, Stories, Memories and Discovery
              </Text>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  height: width * 0.52,
                  width: "100%",
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 5,
                  padding: 10,
                }}
              >
                {renderjournal ? (
                  <ImageSlider
                    images={renderjournal ? spreadData(renderjournal) : []}
                    style={{
                      borderTopLeftRadius: 5,
                      borderTopRightRadius: 5,
                      backgroundColor: "#white",
                    }}
                    customSlide={({ index, item, style, width }) => (
                      <View key={"ky" + index}>
                        {item.map((dataX, index) => {
                          return (
                            <Pressable
                              onPress={() =>
                                props.navigation.push(
                                  "JournalStackNavigation",
                                  {
                                    screen: "DetailJournal",
                                    params: {
                                      dataPopuler: dataX,
                                    },
                                  }
                                )
                              }
                              style={{
                                flexDirection: "row",
                                width: width - 80,
                                height: width * 0.2,
                              }}
                            >
                              <Image
                                source={
                                  item.picture
                                    ? { uri: dataX.picture }
                                    : logo_funtravia
                                }
                                style={{
                                  height: width * 0.15,
                                  width: width * 0.15,
                                  borderRadius: 5,
                                }}
                              ></Image>
                              <View
                                style={{
                                  paddingHorizontal: 10,
                                  width: width - (100 + width * 0.15),
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <View style={{ width: "100%" }}>
                                  <Text style={{ width: "80%" }} type="bold">
                                    <Truncate text={dataX.title} length={30} />
                                  </Text>
                                  <Text>
                                    <Truncate text={dataX.text} length={30} />
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    zIndex: 900,
                                  }}
                                >
                                  {dataX.liked === false ? (
                                    <Ripple
                                      onPress={() =>
                                        _likedjournal(dataX.id, index)
                                      }
                                    >
                                      <LikeEmpty height={15} width={15} />
                                    </Ripple>
                                  ) : (
                                    <Ripple
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
                            console.log("IndexJurnal", index);
                            return (
                              <TouchableHighlight
                                key={"keys" + index}
                                underlayColor="#f7f7f700"
                                // onPress={() => move(index)}
                              >
                                <View
                                  style={{
                                    height: position === index ? 5 : 5,
                                    width: position === index ? 15 : 5,
                                    borderRadius: position === index ? 7 : 3,
                                    backgroundColor:
                                      position === index
                                        ? "#209fae"
                                        : "#d3d3d3",
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
            <View
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              width: "100%",
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("Essentials")}
            </Text>
            <Text size="description">Good destination for your trip</Text>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "white",
                width: "100%",
                shadowColor: "#d3d3d3",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 2,
                borderRadius: 5,
                padding: 20,
              }}
            >
              <Tabs
                tabBarUnderlineStyle={{ backgroundColor: "#209FAE" }}
                tabContainerStyle={{ backgroundColor: "white", elevation: 0 }}
                // locked={false}
              >
                <Tab
                  heading={t("About")}
                  tabStyle={{ backgroundColor: "white", elevation: 0 }}
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
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 20,
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    {render.about.length > 0
                      ? render.about.map((item, index) => (
                          <Ripple
                            onPress={() => {
                              props.navigation.navigate("Abouts", {
                                active: item.id,
                                city_id: render.id,
                                indexcity : index,
                              });
                            }}
                            style={{
                              width: "33.333%",
                              alignContent: "center",
                              alignItems: "center",
                              padding: 5,
                            }}
                          >
                            <View style={{ height: 55 }}>
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
                              size="small"
                              style={{ textAlign: "center", marginTop: 5 }}
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
                  tabStyle={{ backgroundColor: "white" }}
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
                  <View
                    style={{
                      width: "100%",
                      paddingVertical: 20,
                      flexWrap: "wrap",
                      flexDirection: "row",
                    }}
                  >
                    {render.practical.length > 0
                      ? render.practical.map((item, index) => (
                          <Ripple
                            onPress={() => {
                              props.navigation.navigate(
                                "PracticalInformation",
                                {
                                  active: item.id,
                                  city_id: render.id,
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
                            <View style={{ height: 55 }}>
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
                              size="small"
                              style={{ textAlign: "center", marginTop: 5 }}
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
           {/* Event */}
           <View
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              flexDirection: "column",
            }}
          >
            <View>
              <Text type="bold" size="label" style={{}}>
                {"Festival and Event"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  size="description"
                  style={{
                    textAlign: "justify",
                  }}
                >
                  <Truncate
                    text={
                      "Explore The Festival or Event That Being Held In This City"
                    }
                    length={50}
                  ></Truncate>
                </Text>
                <Ripple
                  onPress={() => {
                    props.navigation.navigate("listevent", {
                      idcity: render.id,
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
                    View All
                  </Text>
                </Ripple>
              </View>
              <View
                style={{
                  marginTop: 10,
                  backgroundColor: "white",
                  // height: 100,
                  width: "100%",
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 2,
                  borderRadius: 5,
                }}
              >
                <ImageSlider
                  images={
                    dataevent.event.length > 0
                      ? dataevent.event
                      : [default_image]
                  }
                  style={{
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
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
                          item.images && item.images.length
                            ? { uri: item.images[0].image }
                            : default_image
                        }
                        style={{
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          height: Dimensions.get("screen").width * 0.4,
                          width: Dimensions.get("screen").width - 40,
                          alignContent: "center",
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                        imageStyle={{
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          height: Dimensions.get("screen").width * 0.4,
                          width: Dimensions.get("screen").width - 40,
                          resizeMode: "cover",
                        }}
                      >
                        <LinearGradient
                          colors={["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0)"]}
                          start={{ x: 0, y: 1 }}
                          end={{ x: 0, y: 0 }}
                          style={{
                            height: "50%",
                            width: "100%",
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            padding: 25,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              textAlign: "center",
                            }}
                          >
                            {item.name ? item.name : ""}
                          </Text>
                        </LinearGradient>
                      </ImageBackground>
                    </Ripple>
                  )}
                  customButtons={(position, move) => (
                    <View
                      style={{
                        width: width - 40,
                        position: "absolute",
                        bottom: 10,
                        left: 0,
                        alignContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        justifyContent: "center",
                      }} // onPress={() => {
                      //   props.navigation.navigate("Abouts");
                      // }}
                    >
                      {(dataevent.event.length > 0
                        ? dataevent.event
                        : [default_image]
                      ).map((image, index) => {
                        return (
                          <TouchableHighlight
                            key={index}
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
                    </View>
                  )}
                />
                <View
                  style={{
                    width: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 40,
                    backgroundColor: "#209fae",
                  }}
                >
                  <Text size="label" type="bold" style={{ color: "white" }}>
                    <Gettahun />
                  </Text>
                </View>
                <View
                  style={{
                    width: "100%",
                    flexWrap: "wrap",
                    flexDirection: "row",
                  }}
                >
                  {render.event
                    ? render.event.map((item, index) => {
                        return (
                          <Ripple
                            onPress={() => {
                              setdataevent(item);
                            }}
                            style={{
                              backgroundColor:
                                dataevent.month === item.month
                                  ? "#DAF0F2"
                                  : null,
                              // borderWidth: 1,
                              width: "33.3%",
                              // justifyContent: '',
                              alignContent: "center",
                              alignItems: "center",
                              padding: 7,
                              borderTopWidth: 0.5,
                              borderLeftWidth:
                                index !== 0 &&
                                index !== 3 &&
                                index !== 6 &&
                                index !== 9
                                  ? 0.5
                                  : 0,
                              // borderRightWidth: 0.5,
                              borderColor: "#209fae",
                            }}
                          >
                            <Text
                              size="description"
                              type="bold"
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
                // paddingHorizontal: 20,
                paddingVertical: 5,
                flexDirection: "column",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // borderWidth: 1,
                  paddingHorizontal: 10,
                }}
              >
                <Text type="bold" size="label" style={{}}>
                  {t("Itinerary")}
                </Text>
                <Ripple>
                  <Text
                    type="bold"
                    size="description"
                    style={{
                      color: "#209fae",
                    }}
                  >
                    View All
                  </Text>
                </Ripple>
              </View>
              <Text
                size="description"
                style={{
                  textAlign: "justify",
                  paddingHorizontal: 20,
                }}
              >
                {/* Bali is an Indonesian island known for its forested volcanic
              mountains, iconic rice paddies, mountains, iconic rice */}
              </Text>

              {loadingCity ? (
                <View style={{ marginVertical: 20 }}>
                  <ActivityIndicator animating={true} color="#209FAE" />
                </View>
              ) : renderItinerary.length > 0 ? (
                <FlatList
                  // initialScrollIndex
                  data={renderItinerary}
                  keyExtractor={(item) => item.id}
                  horizontal={true}
                  contentContainerStyle={{
                    paddingLeft: 20,
                    paddingVertical: 15,
                  }}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        height: 145,
                        marginTop: 0,
                        width: Dimensions.get("screen").width - 40,
                        marginRight: 5,
                      }}
                    >
                      <View
                        style={{
                          borderRadius: 5,
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: arrayShadow.shadowOpacity,
                          shadowRadius: arrayShadow.shadowRadius,
                          elevation: arrayShadow.elevation,
                          justifyContent: "space-between",
                          backgroundColor: "#F7F7F7",
                          overflow: "hidden",
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
                            height: "77%",
                            borderTopLeftRadius: 5,
                            borderTopRightRadius: 5,
                            flexDirection: "row",
                            zIndex: -1,
                            // borderWidth: 2,
                            // widht: Dimensions.get("screen").width * 0.33,
                          }}
                        >
                          <View
                            style={{
                              width: "35%",
                            }}
                          >
                            <Image
                              source={
                                item && item.cover
                                  ? { uri: item.cover }
                                  : default_image
                              }
                              style={{
                                height: "100%",
                                width: "100%",
                                borderTopLeftRadius: 5,
                              }}
                            />
                            <View
                              style={{
                                position: "absolute",
                                height: 30,
                                marginTop: 10,
                                margin: 5,
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                style={{
                                  height: 32,
                                  width: 32,
                                  borderRadius: 16,
                                  borderColor: "rgba(52, 52, 52, 0.75)",
                                  zIndex: 1,
                                }}
                                source={
                                  item &&
                                  item.user_created &&
                                  item.user_created.picture
                                    ? { uri: item.user_created.picture }
                                    : default_image
                                }
                              />
                              <Text
                                size="small"
                                type="bold"
                                style={{
                                  zIndex: 0,
                                  paddingLeft: 5,
                                  backgroundColor: "rgba(52, 52, 52, 0.8)",
                                  borderRadius: 2,
                                  color: "white",
                                  marginLeft: -5,
                                  padding: 2,
                                }}
                              >
                                {Truncate({
                                  text: item?.user_created?.first_name
                                    ? item?.user_created?.first_name
                                    : "user_deleted",
                                  length: 13,
                                })}
                              </Text>
                            </View>
                          </View>

                          <View
                            style={{
                              width: "65%",
                              paddingHorizontal: 10,
                              backgroundColor: "#FFFFFF",
                              marginVertical: 2,
                              // borderWidth: 1,
                              overflow: "hidden",
                            }}
                          >
                            <View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <View
                                  style={{
                                    backgroundColor: "#DAF0F2",
                                    borderWidth: 1,
                                    borderRadius: 3,
                                    borderColor: "#209FAE",
                                    paddingHorizontal: 5,
                                  }}
                                >
                                  <Text
                                    type="bold"
                                    size="description"
                                    style={{ color: "#209FAE" }}
                                  >
                                    {item?.categori?.name
                                      ? item?.categori?.name
                                      : "No Category"}
                                  </Text>
                                </View>
                                <View>
                                  {item.liked === false ? (
                                    <Ripple
                                      onPress={() =>
                                        _likeditinerary(item.id, index)
                                      }
                                    >
                                      <LikeEmpty height={15} width={15} />
                                    </Ripple>
                                  ) : (
                                    <Ripple
                                      onPress={() =>
                                        _unlikeditinerary(item.id, index)
                                      }
                                    >
                                      <LikeRed height={15} width={15} />
                                    </Ripple>
                                  )}
                                </View>
                              </View>
                              <Text
                                size="label"
                                type="black"
                                style={{ marginTop: 5 }}
                              >
                                <Truncate text={item.name} length={40} />
                              </Text>
                              <View></View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 5,
                                }}
                              >
                                <PinHijau width={15} height={15} />
                                <Text
                                  style={{ marginLeft: 5 }}
                                  size="small"
                                  type="regular"
                                >
                                  {item?.country?.name}
                                </Text>
                                <Text>,</Text>
                                <Text
                                  size="small"
                                  type="regular"
                                  style={{ marginLeft: 3 }}
                                >
                                  {item?.city?.name}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginTop: 20,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginLeft: 3,
                                  }}
                                >
                                  <Calendargrey
                                    width={10}
                                    height={10}
                                    style={{ marginRight: 5 }}
                                  />
                                  <Text
                                    style={{ marginLeft: 3 }}
                                    size="small"
                                    type="regular"
                                  >
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
                                    style={{ marginRight: 5 }}
                                  />
                                  {item.buddy_count > 1 ? (
                                    <Text size="small" type="regular">
                                      {(item && item.buddy_count
                                        ? item.buddy_count
                                        : null) +
                                        " " +
                                        t("persons")}
                                    </Text>
                                  ) : (
                                    <Text size="small" type="regular">
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
                              borderRightWidth: 1,
                              borderColor: "#D1D1D1",
                              marginBottom: 5,
                            }}
                          >
                            <TravelAlbum
                              style={{ marginRight: 5 }}
                              height={10}
                              width={10}
                            />
                            <Text
                              size="small"
                              type="bold"
                              style={{ color: "#209FAE" }}
                            >
                              Travel Album
                            </Text>
                          </Pressable>
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
                              width: "50%",
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "center",
                              marginBottom: 5,
                            }}
                          >
                            <TravelStories
                              style={{ marginRight: 5 }}
                              height={10}
                              width={10}
                            />
                            <Text
                              size="small"
                              type="bold"
                              style={{ color: "#209FAE" }}
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
      
   
    )

    

  }
  const RenderArticle=({})=>{
    console.log("tabartikel", tabIndex);
    let render=[];
      render = dataCity && dataCity.CitiesInformation.article_header[tabIndex-1] ? dataCity.CitiesInformation.article_header[tabIndex-1] : null;
      console.log("datarticle",render);
    return (
      <View style={{ 
        paddingHorizontal: 15,
        paddingVertical: 5,
      }}>
        {render &&
        render.content.length
          ? render.content.map((i, index) => {
              console.log("item", i);
              if (!i) {
                <View style={{ alignItems: "center" }}>
                  <Text
                    type="regular"
                    size="title"
                    style={{
                      textAlign: "justify",
                      // fontFamily: "Lato-Regular",
                      // fontSize: 18,
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
                            size="label"
                            type="bold"
                            style={{
                              marginBottom: 5,
                              // fontFamily: "Lato-Bold",
                            }}
                          >
                            {i.title}
                          </Text>
                        ) : null}

                        <View style={{ alignItems: "center" }}>
                          <Image
                            source={
                              i.image ? { uri: i.image } : default_image
                            }
                            resizeMode={"cover"}
                            style={{
                              borderWidth: 0.4,
                              borderColor: "#d3d3d3",
                              marginVertical: 10,
                              height: Dimensions.get("screen").width * 0.4,
                              width: "100%",
                            }}
                          />
                        </View>
                        <Text
                          size="readable"
                          type="regular"
                          style={{
                            textAlign: "justify",
                            lineHeight: 21,
                            // fontFamily: "Lato-Regular",
                            // fontSize: 13,
                            color: "#464646",
                          }}
                        >
                          {i.text ? i.text : ""}
                        </Text>
                      </View>
                    ) : (
                      <View>
                        {i.title ? (
                          <Text
                            size="label"
                            type="bold"
                            style={{
                              marginBottom: 10,

                              // marginVertical: 10,

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
                            lineHeight: 21,
                            textAlign: "justify",
                            // fontFamily: "Lato-Regular",
                            // fontSize: 13,
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
   
    )
  }
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
    // console.log('handlePanReleaseOrEnd', scrollY._value);
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
    // console.log('onMomentumScrollEnd');
  };

  const onScrollEndDrag = (e) => {
    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEndDrag', offsetY);
    // iOS only
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };

  const refresh = async () => {
    console.log("-- start refresh");
    refreshStatusRef.current = true;
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      console.log("-- refresh done!");
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
        // {...headerPanResponder.panHandlers}
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
        
        
          <Animated.Image
            style={{
              // position: "absolute",
              // top: 0,
              // left: 0,
              // right: 0,
              width: "100%",
              height: "80%",
              resizeMode: "cover",
              opacity: imageOpacity,
              transform: [{ translateY: imageTranslate }],
            }}
            source={
              dataCity && dataCity.CitiesInformation.cover
                ? { uri: dataCity.CitiesInformation.cover.image }
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
              transform: [{ translateY: imageTranslate }]
                
              }}
            >
              <View>
                <Text size="title" type="black" style={{ color: "white" }}>
                  {dataCity && dataCity.CitiesInformation ? (
                    <Truncate
                      text={Capital({ text: dataCity.CitiesInformation.name })}
                      length={20}
                    ></Truncate>
                  ) : null}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "center",
                    alignItems: "center",
                    marginTop: 2,
                  }}
                >
                  <PinWhite height={15} width={15} />
                  <Text
                    size="description"
                    type="regular"
                    style={{ marginLeft: 5, color: "white" }}
                  >
                    {dataCity && dataCity.CitiesInformation
                      ? dataCity.CitiesInformation.countries.name.toUpperCase()
                      : "-"}
                  </Text>
                </View>
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
            >
            </Animated.View>
            
          </Animated.View>
        
      </Animated.View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
    <View
    style={{
      borderBottomWidth:1,
      borderBottomColor:focused?"#209fae":"white",
      alignContent: "center",
					alignItems: "center",
					justifyContent: "flex-end",
    }}
    >
      {/* <Text
					type={focused ? "" : "regular"}
					size="label"
					style={{
						color: focused ? "#209FAE" : "#464646",
					}}
				>
					{route.title}
				</Text> */}

      <Text
				style={[
					focused ? styles.labelActive : styles.label,
					{ opacity: focused ? 1 : 0.7 },
				]}
			>
				{route.title}
			</Text>
      </View>    
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    console.log("renderScene", routes[tabIndex].key);
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case "general":
        numCols = 2;
        data = tabGeneral;
        renderItem = RenderGeneral;
        break;
      default:
        case !"general":
        numCols = 3;
        data = tab2Data;
        renderItem = RenderArticle;
        break;
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
        
      <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      style={{
        backgroundColor: "white",
        borderBottomColor:"#209FAE",
        borderBottomWidth:1,
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
						borderBottomColor: "#daf0f2",
					}}
          renderLabel={renderLabel}
          indicatorStyle={styles.indicator}
      
        />
        </ScrollView>
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
          <ActivityIndicator animating />
        </Animated.View>
      ),
    });
  };

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
            <View
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
                <Input
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
                placeholder="Search"
                returnKeyType="search"
                onSubmitEditing={(x) =>
                  props.navigation.navigate("SearchTab", {
                    searchInput: search,
                  })
                }
              />

            </View>
            <Button
              text={""}
              size="medium"
              type="circle"
              variant="transparent"
              onPress={() => setshowside(true)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white"
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
  label: { fontSize: 14, color: "#464646", fontFamily: "Lato-Bold" },
	labelActive: { fontSize: 14, color: "#209FAE", fontFamily: "Lato-Bold" },
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
  indicator: { backgroundColor: "#209FAE", height: 0 },
});


