import React, { useState, useCallback, useEffect } from "react";
import { Xblue, Xgray, Arrowbackwhite, Xhitam } from "../../../assets/svg";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Modal from "react-native-modal";
import DatePicker from "react-native-modern-datepicker";
import { getToday } from "react-native-modern-datepicker";
import { dateFormats } from "../../../component/src/dateformatter";
import { default_image } from "../../../assets/png";
import { Item, Input, Label } from "native-base";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import CreateItinerary from "../../../graphQL/Mutation/Itinerary/CreateItinerary";
import Country from "../../../graphQL/Query/Itinerary/Country";
import City from "../../../graphQL/Query/Itinerary/City";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { Truncate, Loading, Button, Text } from "../../../component";
import { useTranslation } from "react-i18next";

const boxWidth = Dimensions.get("screen").width / 1.09;

export default function Trip(props) {
  const HeaderComponent = {
    title: "Trip Planing",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Trip Planing",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Regular",
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
        onPress={() => props.navigation.navigate("HomeScreen")}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  let [country, setCountry] = useState("");
  let [countrys, setCountrys] = useState("");
  let [modalcountry, setModalcountry] = useState(false);
  let [modalcity, setModalcity] = useState(false);
  let [modaltravel, setModaltravel] = useState(false);
  let [city, setCity] = useState("");
  let [citys, setCitys] = useState("");
  let [travelWith, setTravelWith] = useState("");
  let [travelWiths, setTravelWiths] = useState("");
  let [withSelected, setWithSelected] = useState([]);
  let [idwithSelected, setIdwithSelected] = useState([]);
  let [idCountry, setIdCountry] = useState("");
  let [idCity, setIdCity] = useState("");

  let [title, setTitle] = useState("");
  let [loadingApp, setLoadingApp] = useState(false);
  let [selected, setSelected] = useState(new Map());
  let [startDate, setStartDate] = useState(null);
  let [endDate, setEndDate] = useState(null);
  let [duration, setDuration] = useState(0);
  let [privateToggle, setPrivateToggle] = useState(true);
  let [publicToggle, setPublicToggle] = useState(false);
  let [minimum, setMinimum] = useState("");
  let [token, setToken] = useState("");

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
    // console.log(tkn);
    if (tkn !== null) {
      setToken(tkn);
      query();
      querycity();
      querywith();
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
        // console.log(response);
        props.navigation.navigate("itindetail", {
          itintitle: title,
          country: response.data.create_itinerary.id,
          dateitin: dateFormats(startDate) + " - " + dateFormats(endDate),
          token: token,
        });
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
    await setIdCity(id);
    await setModalcity(false);
    await setCity(name);
    await setsearchcity([]);
  };

  const settravel = async (item) => {
    setLoadingApp(true);
    // setModaltravel(false);
    await setTravelWith(item.first_name);
    await setsearchtravel([]);
    var tempdata = [...withSelected];
    var inde = tempdata.findIndex((k) => k["id"] === item.id);
    // console.log(inde);
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
      // setTravelWith('');
      // setTravelWiths('');
      setLoadingApp(false);
    } else {
      Alert.alert(item.first_name + " already with you");
      setLoadingApp(false);
    }
  };

  const setstart = async (x) => {
    await setStartDate(x);
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

  const parseDate = (str) => {
    var mdy = str.split("/");
    return new Date(mdy[1], mdy[0] - 1, mdy[2]);
  };

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

  const onSelect = useCallback(
    (id) => {
      let newSelected = new Map(selected);
      newSelected.set(id, !selected.get(id));
      setSelected(newSelected);
    },
    [selected]
  );

  const togglePublic = () => {
    var x = publicToggle;
    var y = privateToggle;
    setPrivateToggle(!y);
    setPublicToggle(!x);
  };
  const togglePrivate = () => {
    var x = privateToggle;
    var y = publicToggle;
    setPublicToggle(!y);
    setPrivateToggle(!x);
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
    } else {
      Create();
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

      <ScrollView
        style={{
          zIndex: 100,
          // position: 'absolute',
          // top: 0,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height - 50,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            alignItems: "center",
            // height: Dimensions.get('screen').height,
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
              // shadowOffset: { width: 1, height: 3 },
              // shadowOpacity: 0.5,
              // shadowRadius: 3,
              // elevation: 3,
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
                    width: Dimensions.get("screen").width,
                    // height: 15,
                    padding: 5,
                    backgroundColor: "#209fae",
                    borderTopEndRadius: 5,
                    borderTopLeftRadius: 5,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      alignSelf: "flex-end",
                      height: 30,
                      width: 30,
                      zIndex: 999,
                      // marginBottom: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onPress={() => setModalcountry(false)}
                  >
                    <Xhitam height={15} width={15} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    width: Dimensions.get("screen").width,
                    minHeight: Dimensions.get("screen").height * 0.5,
                    backgroundColor: "white",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                  }}
                >
                  <Item floatingLabel style={{}}>
                    <Label
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      {t("Search Country")}
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
                          <Text
                            size="title"
                            type="regular"
                            style={
                              {
                                // fontFamily: 'Lato-Regular',
                                // fontSize: 16,
                              }
                            }
                          >
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : null}
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
                  <Label
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 14,
                    }}
                  >
                    {t("City")}
                  </Label>
                  <Input
                    editable={false}
                    autoCorrect={false}
                    value={city}
                    // onChangeText={(text) => setCity(text)}
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
                ) : null}
              </View>
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
                    width: Dimensions.get("screen").width,
                    // height: 15,
                    padding: 5,
                    backgroundColor: "#209fae",
                    borderTopEndRadius: 5,
                    borderTopLeftRadius: 5,
                  }}
                >
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
                    width: Dimensions.get("screen").width,
                    minHeight: Dimensions.get("screen").height * 0.5,

                    // height: Dimensions.get('screen').width - 40,
                    backgroundColor: "white",
                    // borderRadius: 5,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    paddingHorizontal: 20,
                    // paddingVertical: 10,
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
                        // position: 'absolute',
                        // top: 60,
                        width: "100%",
                        maxHeight: Dimensions.get("screen").width - 40,

                        // height: '100%',
                      }}
                      showsVerticalScrollIndicator={false}
                      keyExtractor={(item, index) => `${index}`}
                      data={datacity.cities_search}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={{
                            // backgroundColor: 'white',
                            width: "100%",
                            padding: 10,
                          }}
                          onPress={() => setcity(item.id, item.name)}
                        >
                          <Text size="title" type="regular" style={{}}>
                            {item.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  ) : null}
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
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modal}
                style={{
                  // backgroundColor: 'rgba(47, 47, 47, 0.75)',
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                  // width: Dimensions.get('screen').width,
                  // height: Dimensions.get('screen').height,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    alignContent: "center",
                    width: Dimensions.get("screen").width - 40,
                    // height: Dimensions.get('screen').width - 40,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  {/* <TouchableOpacity
										style={{
											alignSelf: 'flex-end',
											height: 30,
											width: 30,
											zIndex: 999,
											marginBottom: 20,
											alignItems: 'center',
											justifyContent: 'center',
										}}
										onPress={() => setModal(false)}>
										<Xgray height={20} width={20} />
									</TouchableOpacity> */}
                  <DatePicker
                    options={{}}
                    current={startDate ? startDate : getToday()}
                    selected={startDate ? startDate : getToday()}
                    minimumDate={getToday()}
                    maximumDate={endDate}
                    onDateChange={(x) => setstart(x)}
                    mode="calendar"
                    minuteInterval={30}
                    style={{ borderRadius: 10 }}
                  />
                </View>
              </Modal>
              {/* date end */}
              <Modal
                onRequestClose={() => setModalEnd(false)}
                onBackdropPress={() => setModalEnd(false)}
                animationIn="slideInUp"
                animationOut="slideOutDown"
                isVisible={modalEnd}
                style={{
                  // backgroundColor: 'rgba(47, 47, 47, 0.75)',
                  justifyContent: "center",
                  alignItems: "center",
                  alignSelf: "center",
                  alignContent: "center",
                  // width: Dimensions.get('screen').width,
                  // height: Dimensions.get('screen').height,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    alignSelf: "center",
                    alignContent: "center",
                    width: Dimensions.get("screen").width - 40,
                    // height: Dimensions.get('screen').width - 40,
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  {/* <TouchableOpacity
										style={{
											alignSelf: 'flex-end',
											height: 30,
											width: 30,
											zIndex: 999,
											marginBottom: 20,
											alignItems: 'center',
											justifyContent: 'center',
										}}
										onPress={() => setModalEnd(false)}>
										<Xgray height={20} width={20} />
									</TouchableOpacity> */}
                  <DatePicker
                    options={{}}
                    current={endDate ? endDate : minimum}
                    selected={endDate ? endDate : minimum}
                    minimumDate={minimum}
                    onDateChange={(x) => setEnd(x)}
                    mode="calendar"
                    minuteInterval={30}
                    style={{ borderRadius: 10 }}
                  />
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
                <View style={{ width: "40%" }}>
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
                      {t("EndDate")}
                    </Label>
                    <Input
                      autoCorrect={false}
                      editable={false}
                      value={endDate ? dateFormats(endDate) : ""}
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
                    onPress={() => (startDate ? setModalEnd(true) : null)}
                  ></TouchableOpacity>
                </View>
              </View>
              <View
                style={{
                  marginVertical: 15,
                  width: "100%",
                  flexDirection: "row",
                  alignContent: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={
                    {
                      // color: 'E4E4E4',
                    }
                  }
                >
                  {t("duration")}
                </Text>
                <Text
                  size="description"
                  type="regular"
                  style={{
                    color: duration > 0 ? "#464646" : "#E4E4E4",
                  }}
                >
                  {duration} {t("day")}
                </Text>
              </View>
              <View style={[styles.halfContainer, { marginVertical: 10 }]}>
                <Button
                  color={privateToggle ? "secondary" : "tertiary"}
                  type={"circle"}
                  onPress={() => togglePrivate()}
                  text={t("private")}
                  style={{ width: "49%" }}
                />
                <Button
                  color={privateToggle ? "tertiary" : "secondary"}
                  type={"circle"}
                  onPress={() => togglePublic()}
                  text="Public"
                  style={{ width: "49%" }}
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
                <KeyboardAvoidingView
                  style={{
                    flex: 1,
                    width: Dimensions.get("screen").width,
                    // height: '100%',
                    height: Dimensions.get("screen").height,
                  }}
                  // behavior={Platform.OS === 'ios' ? 'position' : null}
                  // keyboardVerticalOffset={30}
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
                      }}
                    >
                      <Text
                        type={"regular"}
                        size={"description"}
                        style={{
                          color: "white",
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
                    ) : null}
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
