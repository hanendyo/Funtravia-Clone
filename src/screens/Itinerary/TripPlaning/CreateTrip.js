import React, { useState, useCallback, useEffect } from "react";
import {
  Xblue,
  Xgray,
  Arrowbackwhite,
  Xhitam,
  Bottom,
  Arrowbackios,
  Check,
  Search,
} from "../../../assets/svg";
import {
  Dimensions,
  Platform,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
  Picker,
  Pressable,
  TextInput,
  Animated,
  ActivityIndicator,
  NativeModules,
} from "react-native";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import DatePicker from "react-native-modern-datepicker";
import { getToday } from "react-native-modern-datepicker";
import { dateFormats } from "../../../component/src/dateformatter";
import { default_image } from "../../../assets/png";
import { Item, Input, Label } from "native-base";
import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import CreateItinerary from "../../../graphQL/Mutation/Itinerary/CreateItinerary";
import Country from "../../../graphQL/Query/Itinerary/Country";
import City from "../../../graphQL/Query/Itinerary/City";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import {
  Truncate,
  Loading,
  Button,
  Text,
  FunIcon,
  Peringatan,
  StatusBar,
} from "../../../component";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import { StackActions } from "@react-navigation/routers";
import { gql } from "apollo-boost";
import Ripple from "react-native-material-ripple";
import { useSelector } from "react-redux";
import normalize from "react-native-normalize";
import CityCursorBased from "../../../graphQL/Query/Itinerary/CityCursorBased";

const boxWidth = Dimensions.get("screen").width / 1.09;

export default function Trip(props) {
  const { t, i18n } = useTranslation();
  const Notch = DeviceInfo.hasNotch();
  const NotchAndro = NativeModules.StatusBarManager.HEIGHT > 24;

  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("TripPlanning")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      shadowOpacity: 0, // remove shadow on iOS
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      marginLeft: Platform.OS == "ios" ? null : -15,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height:
        Platform.OS == "ios"
          ? Notch
            ? NativeModules.StatusBarManager.HEIGHT
            : 45
          : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? (Notch ? 7 : 9) : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        // onPress={() => props.navigation.navigate("HomeScreen")}
        onPress={() => props.navigation.goBack()}
        style={{
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

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [country, setCountry] = useState("");
  let [countrys, setCountrys] = useState("");
  let [modalcountry, setModalcountry] = useState(false);
  let [modalcity, setModalcity] = useState(false);
  let [modaltravel, setModaltravel] = useState(false);
  let [modalalert, setModalAlert] = useState(false);
  let [textalert, setTextAlert] = useState("");
  let [city, setCity] = useState("");
  let [citys, setCitys] = useState("");
  let [travelWith, setTravelWith] = useState("");
  let [travelWiths, setTravelWiths] = useState("");
  let [withSelected, setWithSelected] = useState([]);
  let [idwithSelected, setIdwithSelected] = useState([]);
  let [idCountry, setIdCountry] = useState("");
  let [idCity, setIdCity] = useState("");
  let [opens, setOpens] = useState(0);
  let [title, setTitle] = useState("");
  let [loadingApp, setLoadingApp] = useState(false);
  let [selected, setSelected] = useState(new Map());
  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);
  let [duration, setDuration] = useState(1);
  let [privateToggle, setPrivateToggle] = useState(true);
  let [publicToggle, setPublicToggle] = useState(false);
  let [minimum, setMinimum] = useState("");
  const token = useSelector((data) => data.token);
  let [dataCategories, setdataCategories] = useState([]);
  let [category_id, setcategory_id] = useState(null);
  let [countryData, setCountryData] = useState();

  const jam = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];

  const [
    getkategori,
    { data: dataCategory, loading: loadingCategory, error: errorCategory },
  ] = useLazyQuery(Category, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
      },
    },
    onCompleted: () => {
      let tempdata = [];
      for (var i of dataCategory?.category_journal) {
        tempdata.push({
          label: i.name,
          value: i.id,
        });
      }
      setdataCategories(tempdata);
    },
  });

  const [mutation, { loading, data, error }] = useMutation(CreateItinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });
  const [
    query,
    { loading: loadingcountry, data: datacountry, error: errorcountry },
  ] = useLazyQuery(Country, {
    fetchPolicy: "network-only",
    variables: {
      keyword: countrys,
    },
    onCompleted: () => {
      setCountryData(datacountry?.country_search);
    },
  });

  // const [
  //   querycity,
  //   { loading: loadingcity, data: datacity, error: errorcity },
  // ] = useLazyQuery(CityCursorBased, {
  //   variables: {
  //     fetchPolicy: "network-only",
  //     keyword: citys,
  //     countries_id: idCountry,
  //   },
  //   onCompleted: (e) => {
  //     console.log(`CITY E: --> `, e);
  //     console.log(`DATACITY: ---> `, datacity);
  //     console.log(`ERROR: --->  `, errorcity);
  //   },
  // });

  const {
    loading: loadingcity,
    data: datacity,
    error: errorcity,
    fetchMore,
    refetch,
    networkStatus,
  } = useQuery(CityCursorBased, {
    variables: {
      keyword: citys,
      countries_id: idCountry,
      first: 15,
      after: "",
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
    options: {
      fetchPolicy: "network-only",
      errorPolicy: "ignore",
    },
    // pollInterval: 5500,
    notifyOnNetworkStatusChange: true,
    onCompleted: (e) => {},
  });

  const [
    querywith,
    { loading: loadingwith, data: datawith, error: errorwith },
  ] = useLazyQuery(TravelWith, {
    variables: {
      fetchPolicy: "network-only",

      keyword: travelWiths,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const loadAsync = async () => {
    if (token) {
      query();
      querywith();
      getkategori();
      // querycity();
      refetch();
    }
  };
  const [isFocusedTitle, setIsFocusedTitle] = useState(false);
  const [isFocusedCountry, setIsFocusedCountry] = useState(false);
  const [isFocusedCity, setIsFocusedCity] = useState(false);
  const [isFocusedStartDate, setIsFocusedStartDate] = useState(false);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const SearchWith = async (text) => {
    setTravelWiths(text);
    querywith();
  };

  const Searchcountry = async (text) => {
    setCountrys(text);
    query();
  };

  const Searchcity = async (text) => {
    setCitys(text);
    querycity();
  };

  const Create = async () => {
    try {
      let response = await mutation({
        variables: {
          countries_id: idCountry,
          cities_id: idCity,
          name: title,
          start_date: startDate,
          end_date: endDate,
          isprivate: privateToggle,
          itinerary_buddy: idwithSelected,
          category_id: category_id,
        },
      });
      if (loading) {
        setLoadingApp(true);
      }
      if (error) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.create_itinerary.code !== 200) {
          throw new Error(response.data.create_itinerary.message);
        }
        props.navigation.dispatch(
          StackActions.replace("ItineraryStack", {
            screen: "itindetail",
            params: {
              itintitle: title,
              country: response.data.create_itinerary.id,
              dateitin: dateFormats(startDate) + " - " + dateFormats(endDate),
              token: token,
            },
          })
        );
      }
      setLoadingApp(false);
    } catch (error) {
      Alert.alert("" + error);
      setLoadingApp(false);
    }
  };

  const [searchcity, setsearchcity] = useState([]);
  const [searchtravel, setsearchtravel] = useState([]);
  const [titleFocused, setTitleFocused] = useState(false);

  const delselect = async (id, name) => {
    setLoadingApp(true);
    var tempData = [...withSelected];
    var inde = tempData.findIndex((k) => k["id"] === id);
    tempData.splice(inde, 1);
    await setWithSelected(tempData);

    var tempDatas = [...idwithSelected];
    var indes = tempDatas.findIndex((kk) => kk["id"] === id);
    tempDatas.splice(indes, 1);
    await setIdwithSelected(tempDatas);
    setLoadingApp(false);
  };

  const setcount = async (id, name) => {
    await setIdCountry(id);
    await setModalcountry(false);
    await setCountry(name);
  };

  const setcity = async (id, name) => {
    let namecity = name.toLowerCase().split(" ");
    for (let i = 0; i < namecity.length; i++) {
      namecity[i] = namecity[i].charAt(0).toUpperCase() + namecity[i].slice(1);
    }
    await setIdCity(id);
    await setModalcity(false);
    await setCity(namecity.join(" "));
    await setsearchcity([]);
  };

  const settravel = async (item) => {
    // setLoadingApp(true);

    setTravelWith(item.first_name);
    setsearchtravel([]);
    var tempdata = [...withSelected];
    var inde = tempdata.findIndex((k) => k["id"] === item.id);
    if (inde === -1) {
      tempdata.push({
        id: item.id,
        name: item.first_name,
        image: item.picture,
      });
      setWithSelected(tempdata);
      var tempdatas = [...idwithSelected];
      tempdatas.push(item.id);
      setIdwithSelected(tempdatas);

      // setLoadingApp(false);
    } else {
      Alert.alert(item.first_name + " already with you");
      setLoadingApp(false);
    }
  };

  const setstart = async (data) => {
    await setStartDate(data);
    await setEndDate(data);
    await setMinimum(data);
    await setModal(false);
    {
      endDate ? setdur(data, endDate) : null;
    }
  };

  const setEnd = async (x) => {
    await setEndDate(x);
    await setModalEnd(false);
    {
      startDate ? setdur(startDate, x) : null;
    }
  };
  let [modal, setModal] = useState(false);
  let [modalEnd, setModalEnd] = useState(false);

  const datediff = (start, end) => {
    start = start.replace(/\//g, "-");
    end = end.replace(/\//g, "-");
    // start = start.split(" ");
    // end = end.split(" ");
    var date1 = new Date(start + "T00:00:00Z");
    var date2 = new Date(end + "T00:00:00Z");
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days < 0 ? 0 : Difference_In_Days;
  };

  const setdur = async (start, end) => {
    var x = await (datediff(start, end) + 1);
    setDuration(x);
  };

  const createItinerary = () => {
    setLoadingApp(true);
    if (!idCountry) {
      _ShowAlert("countryValid");
      setLoadingApp(false);
    } else if (!idCity) {
      _ShowAlert("cityValid");
      setLoadingApp(false);
    } else if (!title) {
      _ShowAlert("titleValid");
      setLoadingApp(false);
    } else if (!startDate) {
      _ShowAlert("startDateValid");
      setLoadingApp(false);
    } else if (!endDate) {
      _ShowAlert("endDateValid");
      setLoadingApp(false);
    } else if (!category_id) {
      _ShowAlert("categoryValid");
      setLoadingApp(false);
    } else {
      Create();
    }
  };

  const _ShowAlert = (text) => {
    showAlert({
      ...aler,
      show: true,
      judul: text,
      detail: error ? "" + error : 0,
    });
    // setTextAlert(text);
    // setModalAlert(true);
  };

  const onUpdate = (prev, { fetchMoreResult }) => {
    if (!fetchMoreResult) return prev;
    const { pageInfo } = fetchMoreResult.city_search_cursor_based;
    const edges = [
      ...prev.city_search_cursor_based.edges,
      ...fetchMoreResult.city_search_cursor_based.edges,
    ];
    const feedback = Object.assign({}, prev, {
      city_search_cursor_based: {
        __typename: prev.city_search_cursor_based.__typename,
        pageInfo,
        edges,
      },
    });
    return feedback;
  };
  const handleOnEndReached = () => {
    if (
      datacity?.city_search_cursor_based?.pageInfo.hasNextPage &&
      !loadingcity
    ) {
      return fetchMore({
        updateQuery: onUpdate,
        variables: {
          first: 15,
          after: datacity?.city_search_cursor_based.pageInfo?.endCursor,
        },
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : null}
      // behavior='padding'
      enabled
      style={{
        flex: 1,
      }}
    >
      <Loading show={loadingApp}></Loading>
      <View
        style={{
          position: "absolute",
          zIndex: 1,
          top: 0,
          backgroundColor: "#209FAE",
          height: Dimensions.get("screen").height * 0.2,
          width: Dimensions.get("screen").width,
        }}
      ></View>
      {/* modal alert */}
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />

      <ScrollView
        style={{
          zIndex: 100,

          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height - 50,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              padding: 20,
              marginBottom: 20,
              width: Dimensions.get("screen").width - 40,
              backgroundColor: "#ffff",
              borderRadius: 5,
              alignItems: "center",
              shadowColor: "#209fae",

              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: Platform.OS == "ios" ? 0.22 : 0,
              shadowRadius: Platform.OS == "ios" ? 2.22 : 0,
              elevation: Platform.OS == "ios" ? 3 : 8,
            }}
          >
            <Text
              size="h4"
              type="black"
              style={{
                marginBottom: 5,
                textAlign: "left",
                alignSelf: "flex-start",
                width: "80%",
              }}
            >
              {t("Whereareyougoing")} ?
            </Text>

            <View
              style={{
                alignContent: "center",
                width: "100%",
              }}
            >
              {/* render country */}
              <View
                style={{
                  alignContent: "center",
                  width: "100%",
                }}
              >
                <Item
                  floatingLabel
                  style={{
                    marginVertical: 10,
                  }}
                >
                  <Label
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize:
                        country.length !== 0 || isFocusedCountry === true
                          ? 12
                          : 14,
                    }}
                  >
                    {t("country")}
                  </Label>

                  <Input
                    editable={false}
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 16,
                    }}
                    autoCorrect={false}
                    value={country}
                    keyboardType="default"
                    onFocus={() => setIsFocusedCountry(true)}
                    onBlur={() => setIsFocusedCountry(false)}
                  />
                </Item>
                <TouchableOpacity
                  style={{
                    alignContent: "center",
                    top: 0,
                    left: 0,
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                  onPress={() => setModalcountry(true)}
                ></TouchableOpacity>
              </View>

              {/* modal country */}
              <Modal
                onRequestClose={() => setModalcountry(false)}
                onBackdropPress={() => setModalcountry(false)}
                onSwipeComplete={() => setModalcountry(false)}
                propagateSwipe={true}
                swipeDirection="down"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalcountry}
                avoidKeyboard={true}
                style={{
                  marginBottom: -10,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <KeyboardAvoidingView
                  // behavior={Platform.OS === "ios" ? "padding" : "padding"}
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    bottom: Platform.OS == "ios" ? (Notch ? -80 : -80) : -50,
                    width: Dimensions.get("screen").width,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    backgroundColor: "white",
                  }}
                  // enabled
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 20,
                      paddingTop: 20,
                      paddingBottom: 15,
                      // height: 100
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        type="bold"
                        size="title"
                        style={{
                          color: "#464646",
                        }}
                      >
                        {t("SearchCountry")}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        alignSelf: "flex-end",
                        height: 30,
                        width: 30,
                        zIndex: 999,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => setModalcountry(false)}
                    >
                      <Xhitam height={15} width={15} />
                    </TouchableOpacity>
                  </View>
                  {/* garis bottom */}
                  <View
                    style={{
                      borderBottomColor: "#D1D1D1",
                      borderBottomWidth: 1,
                      marginBottom: 5,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  />
                  <View
                    style={{
                      // backgroundColor: "green",
                      // borderRadius: 3,
                      flex: 1,
                      flexDirection: "row",
                      alignSelf: "center",
                      alignItems: "center",
                      // paddingHorizontal: 10,
                      // marginVertical: 5,
                      maxHeight: 45,
                      width: "90%",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#f6f6f6",
                        borderRadius: 3,
                        flex: 1,
                        flexDirection: "row",
                        alignSelf: "center",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        marginVertical: 5,
                        height: 35,
                      }}
                    >
                      <Search width={15} height={15} />

                      <TextInput
                        value={countrys}
                        underlineColorAndroid="transparent"
                        placeholder={t("search")}
                        style={{
                          width: "85%",
                          marginLeft: 5,
                          padding: 0,
                        }}
                        returnKeyType="search"
                        autoCorrect={false}
                        onChangeText={(text) => Searchcountry(text)}
                        // onSubmitEditing={(text) => Searchcountry(text)}
                      />
                      {countrys.length !== 0 ? (
                        <TouchableOpacity
                          onPress={() => {
                            // _setSearch(null);
                            setCountrys("");
                          }}
                        >
                          <Xblue
                            width="20"
                            height="20"
                            style={{
                              alignSelf: "center",
                              marginLeft: 10,
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                  {datacountry && datacountry?.country_search.length > 0 ? (
                    <>
                      <FlatList
                        // ref={slider}
                        // getItemLayout={(data, index) => ({
                        //   length: Platform.OS == "ios" ? rippleHeight : 46,
                        //   offset: Platform.OS == "ios" ? rippleHeight * index : 46 * index,
                        //   index,
                        // })}

                        showsVerticalScrollIndicator={false}
                        data={countryData}
                        renderItem={({ item, index }) => (
                          <Ripple
                            key={index + "bruh"}
                            // onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
                            onPress={() => setcount(item.id, item.name)}
                            style={{
                              marginLeft: 20,
                              paddingVertical: 15,
                              paddingLeft: 0,
                              borderBottomWidth: 0.5,
                              borderBottomColor: "#d1d1d1",
                              flexDirection: "row",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "90%",
                            }}
                          >
                            <View
                              style={{
                                marginRight: 15,
                                flexDirection: "row",
                                justifyContent: "center",
                                elevation: 1,
                              }}
                            >
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: "#d1d1d1",
                                  backgroundColor: "black",
                                  alignSelf: "center",
                                  alignContent: "center",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  overflow: "hidden",
                                  // width: 35,
                                  // height: 25,
                                  // paddingTop: 0,
                                }}
                              >
                                <FunIcon
                                  icon={item.flag}
                                  width={37}
                                  height={25}
                                />
                              </View>

                              <Text
                                size="description"
                                type="regular"
                                style={{
                                  paddingLeft: 15,
                                  color:
                                    item.id == idCountry ? "#209fae" : "#000",
                                }}
                              >
                                {item.name
                                  .toString()
                                  .toLowerCase()
                                  .replace(/\b[a-z]/g, function(letter) {
                                    return letter.toUpperCase();
                                  })}
                              </Text>
                            </View>
                            <View>
                              {item.id == idCountry ? (
                                <Check width={20} height={15} />
                              ) : null}
                            </View>
                          </Ripple>
                        )}
                        keyExtractor={(item) => item.id}
                      />
                      {/* biar bisa scroll ampe bawah */}
                      <View style={{ marginTop: 100 }}></View>
                    </>
                  ) : (
                    <View style={{ alignSelf: "center" }}>
                      <Text>{t("noData")}</Text>
                    </View>
                  )}
                </KeyboardAvoidingView>
              </Modal>

              {/* render city */}
              <View
                style={{
                  alignContent: "center",
                  width: "100%",
                }}
              >
                <Item
                  floatingLabel
                  style={{
                    marginVertical: 10,
                  }}
                >
                  <Label
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize:
                        city.length !== 0 || isFocusedCity === true ? 12 : 14,
                    }}
                  >
                    {t("City")}
                  </Label>

                  <Input
                    editable={false}
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 16,
                    }}
                    autoCorrect={false}
                    value={city}
                    keyboardType="default"
                    onFocus={() => setIsFocusedCity(true)}
                    onBlur={() => setIsFocusedCity(false)}
                  />
                </Item>
                {idCountry ? (
                  <TouchableOpacity
                    style={{
                      alignContent: "center",
                      top: 0,
                      left: 0,
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                    }}
                    onPress={() => setModalcity(true)}
                  ></TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={{
                      alignContent: "center",
                      top: 0,
                      left: 0,
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                    }}
                    onPress={() => _ShowAlert("selectcountryfirst")}
                  ></TouchableOpacity>
                )}
              </View>

              {/* modal city */}
              <Modal
                onRequestClose={() => setModalcity(false)}
                onBackdropPress={() => setModalcity(false)}
                onSwipeComplete={() => setModalcity(false)}
                propagateSwipe={true}
                swipeDirection="down"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalcity}
                avoidKeyboard={false}
                style={{
                  marginBottom: -10,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <KeyboardAvoidingView
                  // behavior={Platform.OS === "ios" ? "padding" : "position"}
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    bottom: Platform.OS == "ios" ? (Notch ? -80 : -80) : -50,
                    width: Dimensions.get("screen").width,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    backgroundColor: "white",
                  }}
                  // enabled
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 20,
                      paddingTop: 20,
                      paddingBottom: 15,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        type="bold"
                        size="title"
                        style={{
                          color: "#464646",
                        }}
                      >
                        {t("SearchCity")}
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={{
                        alignSelf: "flex-end",
                        height: 30,
                        width: 30,
                        zIndex: 999,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      onPress={() => setModalcity(false)}
                    >
                      <Xhitam height={15} width={15} />
                    </TouchableOpacity>
                  </View>

                  <View
                    style={{
                      borderBottomColor: "#D1D1D1",
                      borderBottomWidth: 1,
                      marginBottom: 5,
                      width: "90%",
                      alignSelf: "center",
                    }}
                  />
                  <View
                    style={{
                      alignSelf: "center",
                      alignContent: "center",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 15,

                      // borderWidth: 1,
                      maxHeight: 50,
                      flexDirection: "row",
                      width: "98%",

                      // width: Dimensions.get("screen").width,
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "#f6f6f6",
                        borderRadius: 3,
                        flex: 1,
                        flexDirection: "row",
                        alignSelf: "center",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        marginVertical: 5,
                        height: 35,
                      }}
                    >
                      <Search width={15} height={15} />

                      <TextInput
                        value={citys}
                        underlineColorAndroid="transparent"
                        placeholder={t("search")}
                        style={{
                          width: "85%",
                          marginLeft: 5,
                          padding: 0,
                        }}
                        returnKeyType="search"
                        autoCorrect={false}
                        onChangeText={(text) => Searchcity(text)}
                        // onSubmitEditing={(text) => Searchcity(text)}
                      />
                      {citys.length !== 0 ? (
                        <TouchableOpacity
                          onPress={() => {
                            // _setSearch(null);
                            setCitys("");
                          }}
                        >
                          <Xblue
                            width="20"
                            height="20"
                            style={{
                              alignSelf: "center",
                              marginLeft: 10,
                            }}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                  {datacity &&
                  datacity.city_search_cursor_based.edges.length > 0 ? (
                    <>
                      <FlatList
                        // ref={slider}
                        // getItemLayout={(data, index) => ({
                        //   length: normalize(50),
                        //   offset: normalize(50),
                        //   index,
                        // })}
                        showsVerticalScrollIndicator={false}
                        data={datacity.city_search_cursor_based.edges}
                        renderItem={({ item, index }) => (
                          <Ripple
                            key={`key-${index}`}
                            // onLayout={(e) => setRippleHeight(e.nativeEvent.layout.height)}
                            onPress={() =>
                              setcity(item.node.id, item.node.name)
                            }
                            style={{
                              marginLeft: 20,
                              paddingVertical: 15,
                              paddingLeft: 0,
                              borderBottomWidth: 0.5,
                              borderBottomColor: "#d1d1d1",
                              flexDirection: "row",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "space-between",
                              width: "90%",
                            }}
                          >
                            <View
                              style={{
                                marginRight: 15,
                                flexDirection: "row",
                                elevation: 1,
                              }}
                            >
                              <Text
                                size="description"
                                type="regular"
                                style={{
                                  paddingLeft: 15,
                                  color:
                                    item.node.id == idCity ? "#209fae" : "#000",
                                }}
                              >
                                {item.node.name
                                  .toString()
                                  .toLowerCase()
                                  .replace(/\b[a-z]/g, function(letter) {
                                    return letter.toUpperCase();
                                  })}
                              </Text>
                            </View>
                            <View>
                              {item.node.id == idCity ? (
                                <Check width={20} height={15} />
                              ) : null}
                            </View>
                          </Ripple>
                        )}
                        keyExtractor={(item) => item.node.id}
                        initialNumToRender={15}
                        onEndReachedThreshold={1}
                        onEndReached={handleOnEndReached}
                        ListFooterComponent={
                          loadingcity ? (
                            <View
                              style={{
                                // position: "absolute",
                                // bottom: 0,
                                // height: 20,
                                width: Dimensions.get("screen").width,
                                justifyContent: "center",
                                alignItems: "center",
                                marginTop: 30,
                              }}
                            >
                              <ActivityIndicator
                                animating={loadingcity}
                                size="large"
                                color="#209fae"
                              />
                            </View>
                          ) : null
                        }
                      />
                      {/* biar bisa scroll ampe bawah */}
                      <View style={{ marginTop: 100 }}></View>
                    </>
                  ) : (
                    <View style={{ alignSelf: "center" }}>
                      <Text>{t("noData")}</Text>
                    </View>
                  )}
                </KeyboardAvoidingView>
              </Modal>

              <Item
                floatingLabel
                style={{
                  marginVertical: 10,
                }}
              >
                <Label
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize:
                      title.length !== 0 || isFocusedTitle === true ? 12 : 14,
                  }}
                >
                  {t("TitleofyourTrip")}
                </Label>
                <Input
                  on
                  autoCorrect={false}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 16,
                  }}
                  keyboardType="default"
                  maxLength={50}
                  onFocus={() => setIsFocusedTitle(true)}
                  onBlur={() => setIsFocusedTitle(false)}
                />
              </Item>
              {isFocusedTitle && title.length === 50 && (
                <Text
                  type="regular"
                  size="small"
                  style={{
                    color: "#D75995",
                    position: "absolute",
                    bottom: 200,
                  }}
                >
                  {t("max50Char")}
                </Text>
              )}
              {/* date start */}
              <Modal
                onRequestClose={() => setModal(false)}
                onBackdropPress={() => setModal(false)}
                onDismiss={() => setModal(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modal}
                style={{
                  // backgroundColor: 'rgba(47, 47, 47, 0.75)',
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",

                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 20,
                }}
              >
                <DatePicker
                  options={{}}
                  current={startDate ? startDate : getToday()}
                  selected={startDate ? startDate : getToday()}
                  minimumDate={getToday()}
                  // maximumDate={endDate}
                  onDateChange={(x) => setstart(x)}
                  mode="calendar"
                  minuteInterval={30}
                  style={{ borderRadius: 10 }}
                />
                {/* </View> */}
              </Modal>
              {/* date end */}
              <Modal
                onRequestClose={() => setModalEnd(false)}
                onBackdropPress={() => setModalEnd(false)}
                onSwipeComplete={() => setModalEnd(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalEnd}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    width: Dimensions.get("screen").width - 20,
                    backgroundColor: "white",
                    marginBottom: 70,
                    paddingTop: 60,
                    paddingHorizontal: 20,
                    paddingBottom: 30,
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      top: 20,
                      left: 20,
                    }}
                    onPress={() => setModalEnd(false)}
                  >
                    <Xhitam width={15} height={15} />
                  </TouchableOpacity>
                  <Text size="small" type="bold" style={{}}>
                    {t("duration")}
                  </Text>
                  <View
                    style={{
                      width: "100%",
                      // borderWidth: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ width: "50%" }}>
                      <Picker
                        iosIcon={
                          <View>
                            <Bottom />
                          </View>
                        }
                        iosHeader="Select Hours"
                        note
                        mode="dropdown"
                        selectedValue={duration}
                        textStyle={{ fontFamily: "Lato-Regular" }}
                        itemTextStyle={{ fontFamily: "Lato-Regular" }}
                        itemStyle={{ fontFamily: "Lato-Regular" }}
                        placeholderStyle={{ fontFamily: "Lato-Regular" }}
                        headerTitleStyle={{
                          fontFamily: "Lato-Regular",
                        }}
                        style={{
                          color: "#209fae",
                          fontFamily: "Lato-Regular",
                        }}
                        onValueChange={(itemValue, itemIndex) => {
                          let dateChanged = startDate.replace(/\//g, "-");
                          let dat = new Date(dateChanged + "T00:00:00Z");
                          console.log("dat", dat);

                          dat.setDate(dat.getDate() + (itemValue - 1));

                          let bln = parseFloat(dat.getMonth()) + 1;
                          let hr = dat.getDate();

                          let hasil =
                            "" +
                            dat.getFullYear() +
                            "/" +
                            (bln < 10 ? "0" + bln : bln) +
                            "/" +
                            (hr < 10 ? "0" + hr : hr);

                          setEndDate(hasil);
                          setDuration(itemValue);
                          setModalEnd(false);
                        }}
                      >
                        {jam.map((item, index) => {
                          return (
                            <Picker.Item
                              key={""}
                              label={item + " " + t("days")}
                              value={item}
                            />
                          );
                        })}
                      </Picker>
                    </View>
                  </View>
                </View>
              </Modal>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <View
                  style={{
                    width: "40%",
                    //  marginTop: 10
                  }}
                >
                  <Item
                    floatingLabel
                    style={{
                      marginVertical: 10,
                    }}
                  >
                    <Label
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize:
                          startDate !== null || isFocusedStartDate === true
                            ? 12
                            : 14,
                        color: "#464646",
                      }}
                    >
                      {t("StartDate")}
                    </Label>
                    <Input
                      autoCorrect={false}
                      editable={false}
                      value={startDate ? dateFormats(startDate) : ""}
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 16,
                      }}
                      keyboardType="default"
                      onFocus={() => setIsFocusedStartDate(true)}
                      onBlur={() => setIsFocusedStartDate(false)}
                    />
                  </Item>

                  <TouchableOpacity
                    style={{
                      top: 0,
                      left: 0,
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                    }}
                    onPress={() => setModal(true)}
                  ></TouchableOpacity>
                </View>

                <View
                  style={{
                    width: "40%",
                    height: 70,
                    paddingTop: 5,
                    justifyContent: "space-around",
                  }}
                >
                  <Text
                    size="small"
                    type="regular"
                    style={
                      {
                        // color: 'E4E4E4',
                      }
                    }
                  >
                    {t("duration")}
                  </Text>
                  <TouchableOpacity
                    onPress={() =>
                      startDate ? setModalEnd(true) : _ShowAlert("setstartdate")
                    }
                  >
                    <Text
                      size="description"
                      type="regular"
                      style={{
                        color: startDate ? "#464646" : "#dedede",
                      }}
                    >
                      {duration} {t("days")}
                    </Text>
                    <Text
                      size="small"
                      style={{
                        color: "#d3d3d3",
                      }}
                    >
                      {t("max")} 30 {t("days")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginTop: 10,
                  marginBottom: 5,
                  paddingBottom: opens,
                }}
              >
                <DropDownPicker
                  onOpen={() => setOpens(150)}
                  onClose={() => setOpens(0)}
                  items={dataCategories}
                  defaultValue={null}
                  containerStyle={{ height: 40 }}
                  style={{ backgroundColor: "#fafafa" }}
                  itemStyle={{
                    justifyContent: "flex-start",
                  }}
                  showArrow={false}
                  dropDownStyle={{
                    backgroundColor: "#fafafa",
                    height: 150,
                  }}
                  placeholder={t("selectCategory")}
                  onChangeItem={(item) => setcategory_id(item.value)}
                />
              </View>

              <View
                style={{
                  alignContent: "center",
                  width: "100%",
                }}
              >
                <View
                  // floatingLabel
                  style={{
                    marginVertical: 10,
                    borderBottomColor: "rgba(0, 0, 0, 0.2)",
                    borderBottomWidth: 1,
                    // borderColor: 'gray',
                    overflow: "hidden",
                  }}
                >
                  <Label
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 14,
                      color: "gray",
                    }}
                  >
                    {t("TravelWith")}
                  </Label>
                  <View
                    style={{
                      flexDirection: "row",
                      paddingVertical: 20,
                    }}
                  >
                    {withSelected && withSelected.length ? (
                      withSelected.map((value, i) => {
                        if (i < 3) {
                          return (
                            <View>
                              <Image
                                source={
                                  value.image
                                    ? { uri: value.image }
                                    : default_image
                                }
                                style={{
                                  resizeMode: "cover",
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,

                                  marginLeft: i > 0 ? -10 : 0,
                                }}
                              />
                            </View>
                          );
                        } else {
                          null;
                        }
                      })
                    ) : (
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          color: "#D3D3D3",
                          position: "absolute",
                          top: 15,
                        }}
                      >
                        {t("optional")}
                      </Text>
                    )}
                    {withSelected && withSelected.length > 0 ? (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          maxWidth: "85%",
                        }}
                      >
                        <Text
                          type="regular"
                          size="description"
                          numberOfLines={2}
                          style={{ marginLeft: "5%" }}
                        >
                          {""}
                          {t("with")} {withSelected[0].name}{" "}
                          {withSelected.length - 1 !== 0
                            ? "+ " + (withSelected.length - 1) + " Other(s)"
                            : ""}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  style={{
                    alignContent: "center",
                    top: 0,
                    left: 0,
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                  }}
                  onPress={() => setModaltravel(true)}
                ></TouchableOpacity>
              </View>
              {/* modal travel with*/}
              <Modal
                onRequestClose={() => setModaltravel(false)}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                isVisible={modaltravel}
                style={{
                  marginTop: NotchAndro ? 0 : 0,
                  marginBottom: -40,
                  backgroundColor: "#14646e",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                }}
              >
                <SafeAreaView>
                  <KeyboardAvoidingView
                    style={{
                      flex: 1,
                      width: Dimensions.get("screen").width,
                      height: Dimensions.get("screen").height,
                      // borderWidth: 10,
                    }}
                    enabled
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        // alignSelf: 'flex-start',
                        justifyContent: "space-between",
                        alignItems: "center",
                        alignContent: "center",
                        backgroundColor: "#209fae",
                        height: 55,
                        width: Dimensions.get("screen").width,
                        // marginBottom: 20,
                        marginTop: Platform.OS === "ios" ? 0 : 0,
                        paddingHorizontal: 20,
                      }}
                    >
                      <View
                        style={{
                          height: 50,
                          justifyContent: "center",
                          alignContent: "center",
                          alignItems: "center",
                          flexDirection: "row",
                          flex: 1,
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setModaltravel(false);
                          }}
                        >
                          {Platform.OS == "ios" ? (
                            <Arrowbackios height={15} width={15}></Arrowbackios>
                          ) : (
                            <Arrowbackwhite
                              height={20}
                              width={20}
                            ></Arrowbackwhite>
                          )}
                        </TouchableOpacity>
                        <View
                          style={{
                            flex: 1,
                            // marginLeft: Platform.OS == "ios" ? null : 10,
                            // alignItems: "center",
                            alignItems:
                              Platform.OS == "ios" ? "center" : "flex-start",
                          }}
                        >
                          <Text
                            type={"bold"}
                            size={"title"}
                            style={{
                              color: "white",
                              marginLeft: 15,
                            }}
                          >
                            {t("SearchAccount")}
                          </Text>
                        </View>
                        <View
                          style={{
                            height: 50,
                            justifyContent: "center",
                            marginRight: 5,
                          }}
                        >
                          <Button
                            color="secondary"
                            onPress={() => setModaltravel(false)}
                            text={t("save")}
                            size="small"
                          ></Button>
                        </View>
                      </View>
                    </View>
                    {/* awal */}
                    <View
                      style={{
                        width: Dimensions.get("screen").width,
                        backgroundColor: "white",
                        paddingTop: 10,
                        // paddingHorizontal: 10,
                        paddingBottom: 10,
                        // borderWidth: 1,
                      }}
                    >
                      {withSelected.length > 0 ? (
                        <View
                          style={{
                            marginHorizontal: "3%",
                            marginBottom: 1,
                            paddingBottom: 5,
                            // paddingTop: 6,
                            // borderWidth: 2
                          }}
                        >
                          <Text
                            type="regular"
                            size="description"
                            style={{ paddingVertical: 5 }}
                          >
                            {t("with")} :
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              width: "100%",
                              flexWrap: "wrap",
                              // borderWidth: 1,
                            }}
                          >
                            {withSelected.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  style={{
                                    maxWidth: 130,
                                    flexDirection: "row",
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#f6f6f6",
                                    borderRadius: 5,
                                    padding: 5,
                                    marginRight: 2.5,
                                    marginBottom: 5,
                                  }}
                                  onPress={() => delselect(item.id, item.name)}
                                >
                                  <Image
                                    source={
                                      item.image
                                        ? { uri: item.image }
                                        : default_image
                                    }
                                    style={{
                                      marginRight: 5,
                                      resizeMode: "cover",
                                      height: 25,
                                      width: 25,
                                      borderRadius: 15,
                                    }}
                                  ></Image>
                                  <Text
                                    type="regular"
                                    size="description"
                                    style={{}}
                                  >
                                    <Truncate text={item.name} length={8} />
                                  </Text>
                                  <Xblue
                                    width="20"
                                    height="20"
                                    style={{
                                      alignSelf: "center",
                                      marginLeft: 10,
                                    }}
                                  />
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ) : (
                        <View></View>
                      )}
                      <View
                        style={{
                          backgroundColor: "#f6f6f6",
                          borderRadius: 3,
                          // flex: 1,
                          flexDirection: "row",
                          alignSelf: "center",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          // marginVertical: 0,
                          width: "90%",
                          height: 40,
                        }}
                      >
                        <Search width={15} height={15} />

                        <TextInput
                          value={travelWiths}
                          underlineColorAndroid="transparent"
                          placeholder={t("SearchAccount")}
                          style={{
                            width: "85%",
                            marginLeft: 5,
                            padding: 0,
                          }}
                          returnKeyType="search"
                          autoCorrect={false}
                          onChangeText={(text) => {
                            SearchWith(text);
                          }}
                          onSubmitEditing={SearchWith}
                        />
                        {travelWiths.length !== 0 ? (
                          <TouchableOpacity
                            onPress={() => {
                              // _setSearch(null);
                              setTravelWiths("");
                            }}
                          >
                            <Xblue
                              width="20"
                              height="20"
                              style={{
                                alignSelf: "center",
                                marginLeft: 10,
                              }}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </View>
                    <ScrollView
                      showsVerticalScrollIndicator={false}
                      stickyHeaderIndices={[1]}
                      style={{
                        width: Dimensions.get("screen").width,
                        // height: '100%',
                        height: Dimensions.get("screen").height,
                        backgroundColor: "white",
                        // paddingTop: 20,
                        paddingHorizontal: 10,
                        paddingBottom: 20,
                      }}
                    >
                      {/* {withSelected.length > 0 ? (
                        <View
                          style={{
                            paddingVertical: 10,
                            marginHorizontal: "3%",
                          }}
                        >
                          <Text
                            type="regular"
                            size="description"
                            style={{ paddingVertical: 10 }}
                          >
                            {t("with")} :
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              width: "100%",
                              flexWrap: "wrap",
                              // borderWidth: 1,
                            }}
                          >
                            {withSelected.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  style={{
                                    maxWidth: 130,
                                    flexDirection: "row",
                                    alignContent: "center",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: "#f6f6f6",
                                    borderRadius: 5,
                                    padding: 5,
                                    marginRight: 2.5,
                                    marginBottom: 5,
                                  }}
                                  onPress={() => delselect(item.id, item.name)}
                                >
                                  <Image
                                    source={
                                      item.image
                                        ? { uri: item.image }
                                        : default_image
                                    }
                                    style={{
                                      marginRight: 5,
                                      resizeMode: "cover",
                                      height: 25,
                                      width: 25,
                                      borderRadius: 15,
                                    }}
                                  ></Image>
                                  <Text
                                    type="regular"
                                    size="description"
                                    style={{}}
                                  >
                                    <Truncate text={item.name} length={8} />
                                  </Text>
                                  <View
                                    style={{
                                      height: 15,
                                      width: 15,
                                      marginLeft: 10,
                                    }}
                                  >
                                    <Xblue height={15} width={15} />
                                  </View>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        </View>
                      ) : (
                        <View></View>
                      )}
                      <View
                        style={{
                          backgroundColor: "#f6f6f6",
                          borderRadius: 3,
                          flex: 1,
                          flexDirection: "row",
                          alignSelf: "center",
                          alignItems: "center",
                          paddingHorizontal: 10,
                          marginTop: 20,
                          marginBottom: 5,
                          height: 40,
                          width: "90%",
                        }}
                      >
                        <View
                          style={{
                            backgroundColor: "#f6f6f6",
                            borderRadius: 3,
                            flex: 1,
                            flexDirection: "row",
                            alignSelf: "center",
                            alignItems: "center",
                            paddingHorizontal: 5,
                            marginVertical: 5,
                            width: "100%",
                            height: 35,
                          }}
                        >
                          <Search width={15} height={15} />

                          <TextInput
                            value={travelWiths}
                            underlineColorAndroid="transparent"
                            placeholder={t("SearchAccount")}
                            style={{
                              width: "85%",
                              marginLeft: 5,
                              padding: 0,
                            }}
                            returnKeyType="search"
                            autoCorrect={false}
                            onChangeText={(text) => {
                              SearchWith(text);
                            }}
                            onSubmitEditing={SearchWith}
                          />
                          {travelWiths.length !== 0 ? (
                            <TouchableOpacity
                              onPress={() => {
                                // _setSearch(null);
                                SearchWith("");
                              }}
                            >
                              <Xblue
                                width="20"
                                height="20"
                                style={{
                                  alignSelf: "center",
                                  marginLeft: 10,
                                }}
                              />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View> */}

                      {/* </list> */}
                      {datawith && datawith?.search_travelwith?.length > 0 ? (
                        <>
                          <FlatList
                            style={{
                              // position: 'absolute',
                              // top: 65,
                              width: "100%",
                              height: "100%",
                            }}
                            showsVerticalScrollIndicator={false}
                            keyExtractor={(item, index) => `${index}`}
                            data={datawith.search_travelwith}
                            renderItem={({ item }) => (
                              <TouchableOpacity
                                style={{
                                  backgroundColor: "white",
                                  width: "100%",
                                  padding: 10,
                                  paddingHorizontal: 20,
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                                onPress={() => settravel(item)}
                              >
                                <Image
                                  source={
                                    item.picture
                                      ? { uri: item.picture }
                                      : default_image
                                  }
                                  style={{
                                    marginRight: 10,
                                    resizeMode: "cover",
                                    height: normalize(50),
                                    width: normalize(50),
                                    borderRadius: normalize(50),
                                  }}
                                ></Image>
                                <Text
                                  type="black"
                                  size="description"
                                  style={{
                                    width: Dimensions.get("screen").width / 1.5,
                                  }}
                                  // numberOfLines={1}
                                >
                                  {item.first_name}{" "}
                                  {item.last_name ? item.last_name : ""}
                                </Text>
                              </TouchableOpacity>
                            )}
                          />
                          {/* biar bisa scroll ampe bawah */}
                          <View style={{ marginTop: 100 }}></View>
                        </>
                      ) : (
                        <View style={{ alignSelf: "center" }}>
                          <Text>{t("noData")}</Text>
                        </View>
                      )}
                    </ScrollView>
                  </KeyboardAvoidingView>
                </SafeAreaView>
              </Modal>
            </View>
          </View>
          <Button
            color="secondary"
            style={{
              width: boxWidth - 25,
              marginBottom: Platform.OS === "ios" ? 70 : 40,
            }}
            onPress={createItinerary}
            text={t("CreateNewPlan")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: "center",
  },

  halfButton: {
    width: "45%",
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    borderBottomLeftRadius: 23,
    borderBottomRightRadius: 23,
    height: 40,
    backgroundColor: "#D75995",
  },
  buttonTextStyle: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
  },
  halfContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  textinput: {
    marginTop: 30,
    backgroundColor: "#DDDDDD",
    height: 40,
    width: 200,
  },
});
