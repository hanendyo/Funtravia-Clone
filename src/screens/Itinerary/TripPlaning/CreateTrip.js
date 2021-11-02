import React, { useState, useCallback, useEffect } from "react";
import {
  Xblue,
  Xgray,
  Arrowbackwhite,
  Xhitam,
  Bottom,
  Arrowbackios,
  Check,
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
} from "react-native";
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
} from "../../../component";
import { useTranslation } from "react-i18next";
import DropDownPicker from "react-native-dropdown-picker";
import Category from "../../../graphQL/Query/Itinerary/ItineraryCategory";
import { StackActions } from "@react-navigation/routers";
import { gql } from "apollo-boost";

const boxWidth = Dimensions.get("screen").width / 1.09;

export default function Trip(props) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("TripPlanning")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
  let [token, setToken] = useState("");
  let [dataCategories, setdataCategories] = useState([]);
  let [category_id, setcategory_id] = useState(null);

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
      for (var i of dataCategory.category_journal) {
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
        Authorization: `Bearer ${token}`,
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
  });

  const [
    querycity,
    { loading: loadingcity, data: datacity, error: errorcity },
  ] = useLazyQuery(City, {
    variables: {
      fetchPolicy: "network-only",
      keyword: citys,
      countries_id: idCountry,
    },
    onCompleted: (e) => {
      console.log("searh", e);
    },
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
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    if (tkn !== null) {
      setToken(tkn);
      query();
      querywith();
      getkategori();
      querycity();
    } else {
      setToken("");
    }
  };

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

  const [search, setsearch] = useState([]);
  const [searchcity, setsearchcity] = useState([]);
  const [searchtravel, setsearchtravel] = useState([]);

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

  const setcont = async (id, name) => {
    await setIdCountry(id);
    await setModalcountry(false);
    await setCountry(name);
    await setsearch([]);
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
    setLoadingApp(true);
    await setTravelWith(item.first_name);
    await setsearchtravel([]);
    var tempdata = [...withSelected];
    var inde = tempdata.findIndex((k) => k["id"] === item.id);
    if (inde === -1) {
      tempdata.push({
        id: item.id,
        name: item.first_name,
        image: item.picture,
      });
      await setWithSelected(tempdata);
      var tempdatas = [...idwithSelected];
      tempdatas.push(item.id);
      await setIdwithSelected(tempdatas);

      setLoadingApp(false);
    } else {
      Alert.alert(item.first_name + " already with you");
      setLoadingApp(false);
    }
  };

  const setstart = async (x) => {
    await setStartDate(x);
    await setEndDate(x);
    await setMinimum(x);
    await setModal(false);
    {
      endDate ? setdur(x, endDate) : null;
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
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days;
  };

  const setdur = async (start, end) => {
    var x = await (datediff(start, end) + 1);
    setDuration(x);
  };

  const createItinerary = () => {
    setLoadingApp(true);
    if (!idCountry) {
      Alert.alert("Country is not valid!");
      setLoadingApp(false);
    } else if (!idCity) {
      Alert.alert("City is not valid!");
      setLoadingApp(false);
    } else if (!title) {
      Alert.alert("Title is not valid!");
      setLoadingApp(false);
    } else if (!startDate) {
      Alert.alert("Start Date is not valid!");
      setLoadingApp(false);
    } else if (!endDate) {
      Alert.alert("End Date is not valid!");
      setLoadingApp(false);
    } else if (!category_id) {
      Alert.alert("Category is not valid!");
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
          padding: 0,
          backgroundColor: "#209FAE",
          height: Dimensions.get("screen").height * 0.2,
          width: Dimensions.get("screen").width,
        }}
      ></View>

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
                      fontSize: 14,
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
                swipeDirection="down"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalcountry}
                style={{
                  marginBottom: -10,
                  justifyContent: "flex-end",
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    height: Dimensions.get("screen").height * 0.6,
                    width: Dimensions.get("screen").width,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    backgroundColor: "white",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 15,
                      paddingTop: 15,
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
                    }}
                  />
                  <View
                    style={{
                      width: Dimensions.get("screen").width,
                      minHeight: Dimensions.get("screen").height * 0.5,
                      backgroundColor: "white",

                      paddingHorizontal: 20,
                      paddingBottom: 10,
                    }}
                  >
                    <Item floatingLabel style={{ marginTop: 10 }}>
                      <Label
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 14,
                        }}
                      >
                        {t("SearchCountry")}
                      </Label>
                      <Input
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 16,
                        }}
                        autoCorrect={false}
                        value={countrys}
                        onChangeText={(text) => Searchcountry(text)}
                        returnKeyType="search"
                        keyboardType="default"
                      />
                    </Item>
                    {datacountry && datacountry.country_search.length > 0 ? (
                      <FlatList
                        style={{
                          width: "100%",
                          maxHeight: Dimensions.get("screen").width - 50,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${index}`}
                        data={datacountry.country_search}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              // backgroundColor: 'white',
                              width: "100%",
                              padding: 10,
                            }}
                            onPress={() => setcont(item.id, item.name)}
                          >
                            <View
                              style={{
                                flexDirection: "row",
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
                                    shadowColor: "#000",
                                    shadowOffset: {
                                      width: 0,
                                      height: 3,
                                    },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 2.65,
                                    width: 25,

                                    elevation: 7,
                                  }}
                                >
                                  <FunIcon
                                    icon={item.flag}
                                    width={25}
                                    height={20}
                                  />
                                </View>
                                <Text
                                  size="title"
                                  type="regular"
                                  style={{
                                    textTransform: "capitalize",
                                    paddingLeft: 15,
                                  }}
                                >
                                  {item.name}
                                </Text>
                              </View>
                              {item.id == idCountry ? (
                                <View>
                                  <Check width={20} height={15} />
                                </View>
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    ) : null}
                  </View>
                </View>
              </Modal>

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
                  {idCountry ? (
                    <Label
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                        color: "#000",
                        opacity: 0.7,
                      }}
                    >
                      {t("City")}
                    </Label>
                  ) : (
                    <Label
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                        color: "#dedede",
                      }}
                    >
                      {t("City")}
                    </Label>
                  )}

                  <Input
                    editable={false}
                    autoCorrect={false}
                    value={city}
                    label=""
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 16,
                    }}
                    keyboardType="default"
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
              {/* modal alert */}
              <Peringatan
                aler={aler}
                setClose={() =>
                  showAlert({ ...aler, show: false, judul: "", detail: "" })
                }
              />
              {/* <Modal
                useNativeDriver={true}
                visible={modalalert}
                onRequestClose={() => setModalAlert(false)}
                transparent={true}
                animationType="fade"
                style={{
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Pressable
                  onPress={() => setModalAlert(false)}
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
                      <Text
                        size="title"
                        type="bold"
                        style={{ marginVertical: 15 }}
                      >
                        {t("Oops")}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => setModalAlert(false)}
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
                    <Text
                      size="title"
                      type="regular"
                      style={{ marginVertical: 20, textAlign: "center" }}
                    >
                      {t(textalert)}
                    </Text>
                  </View>
                </View>
              </Modal> */}

              {/* modal city */}
              <Modal
                onRequestClose={() => setModalcity(false)}
                onBackdropPress={() => setModalcity(false)}
                onSwipeComplete={() => setModalcity(false)}
                swipeDirection="down"
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalcity}
                style={{
                  marginBottom: -10,
                  // backgroundColor: 'rgba(0, 0, 0, 0.25)',
                  justifyContent: "flex-end",
                  alignItems: "center",
                  // alignSelf: 'center',
                  alignContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "column",
                    height: Dimensions.get("screen").height * 0.6,
                    width: Dimensions.get("screen").width,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
                    backgroundColor: "white",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      paddingHorizontal: 15,
                      paddingTop: 15,
                      marginBottom: 15,
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
                    }}
                  />
                  <View
                    style={{
                      width: Dimensions.get("screen").width,
                      minHeight: Dimensions.get("screen").height * 0.5,
                      backgroundColor: "white",
                      paddingHorizontal: 20,
                    }}
                  >
                    <Item floatingLabel style={{ marginTop: 10 }}>
                      <Label
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 14,
                        }}
                      >
                        {t("SearchCity")}
                      </Label>
                      <Input
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 16,
                        }}
                        returnKeyType="search"
                        autoCorrect={false}
                        value={citys}
                        onChangeText={(text) => {
                          Searchcity(text);
                        }}
                        // onSubmitEditing={}
                        keyboardType="default"
                      />
                    </Item>
                    {datacity && datacity.cities_search.length > 0 ? (
                      <FlatList
                        style={{
                          width: "100%",
                          maxHeight: Dimensions.get("screen").width - 40,
                        }}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item, index) => `${index}`}
                        data={datacity.cities_search}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={{
                              width: "100%",
                              padding: 10,
                            }}
                            onPress={() => setcity(item.id, item.name)}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              <Text
                                size="title"
                                type="regular"
                                style={{ textTransform: "capitalize" }}
                              >
                                {item.name}
                              </Text>
                              {item.id == idCity ? (
                                <Check width={20} height={15} />
                              ) : null}
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    ) : null}
                  </View>
                </View>
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
                    fontSize: 14,
                  }}
                >
                  {t("TitleofyourTrip")}
                </Label>
                <Input
                  autoCorrect={false}
                  value={title}
                  onChangeText={(text) => setTitle(text)}
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 16,
                  }}
                  keyboardType="default"
                />
              </Item>
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
                  <Text size="description" type="bold" style={{}}>
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
                          let dat = new Date(startDate);

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
                        fontSize: 14,
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
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    size="label"
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
                      size="label"
                      type="regular"
                      style={{
                        color: startDate ? "#464646" : "#dedede",
                      }}
                    >
                      {duration} {t("days")}
                    </Text>
                    <Text
                      size="description"
                      style={{
                        color: "#d3d3d3",
                      }}
                    >
                      Max. 30 {t("days")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginTop: 10,
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
                    {withSelected && withSelected.length
                      ? withSelected.map((value, i) => {
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
                      : null}
                    {withSelected && withSelected.length > 0 ? (
                      <View
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text type="regular" size="description" style={{}}>
                          {"    "}
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
              {/* modal travel */}
              <Modal
                onRequestClose={() => setModaltravel(false)}
                animationIn="slideInRight"
                animationOut="slideOutRight"
                isVisible={modaltravel}
                style={{
                  margin: 0,
                  // backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
                      // height: '100%',
                      height: Dimensions.get("screen").height,
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
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            setModaltravel(false);
                          }}
                        >
                          <Arrowbackwhite width={20} height={20} />
                        </TouchableOpacity>
                        <Text
                          type={"bold"}
                          size={"label"}
                          style={{
                            color: "white",
                            marginLeft: 10,
                          }}
                        >
                          {t("Searchpeople")}
                        </Text>
                      </View>
                      <View style={{ height: 50, justifyContent: "center" }}>
                        <Button
                          // variant='bordered'
                          color="secondary"
                          onPress={() => setModaltravel(false)}
                          text={t("save")}
                          size="small"
                          // type='circle'
                          style={
                            {
                              // height: 50,
                              // width: 80,
                            }
                          }
                        ></Button>
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
                      {withSelected.length > 0 ? (
                        <View style={{ paddingVertical: 10 }}>
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
                                      marginLeft: 5,
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
                          backgroundColor: "white",
                          // borderTopWidth: 1,
                          // borderColor: '#d3d3d3',
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
                              fontSize: 14,
                            }}
                          >
                            {t("Searchpeople")}
                          </Label>
                          <Input
                            style={{
                              fontFamily: "Lato-Regular",
                              fontSize: 16,
                            }}
                            autoCorrect={false}
                            value={travelWiths}
                            onChangeText={(text) => {
                              SearchWith(text);
                            }}
                            // onSubmitEditing={SearchWith}
                            keyboardType="default"
                          />
                        </Item>
                        {/* list selected */}
                      </View>
                      {/* </list> */}
                      {datawith && datawith.search_travelwith.length > 0 ? (
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
                                  height: 30,
                                  width: 30,
                                  borderRadius: 15,
                                }}
                              ></Image>
                              <Text type="regular" size="title" style={{}}>
                                {item.first_name}
                              </Text>
                            </TouchableOpacity>
                          )}
                        />
                      ) : null}
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
