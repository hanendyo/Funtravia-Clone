import { Item, Label, Input } from "native-base";
import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import Modal from "react-native-modal";

// import { arrow_bot, arrow_top } from "../../../const/Png";
import {
  Arrowbackwhite,
  FlightHeader,
  Xhitam,
  Calendargrey,
  Arrow,
} from "../../../const/Svg";
import { Airport } from "../../../const/Airport";
import { NavigationEvents } from "react-navigation";
import Loading from "../Loading";
import { FlatList } from "react-native-gesture-handler";

export default function Flight(props) {
  let [Datas, setData] = useState(Airport);
  let [type, setType] = useState("One");
  let [modalcity, setModalcity] = useState(false);
  let [modalpos, setModalpos] = useState("from");
  let [dataFilter, setDataFilter] = useState([]);
  let [texts, settext] = useState("");
  let kiriman = props.navigation.getParam("kiriman");

  let [state, setState] = useState({});
  let [loading, setLoading] = useState(false);

  const filterData = (x) => {
    settext(x);
    var datafilter = Datas.filter((item) => item.city.includes(x));
    if (datafilter) {
      setDataFilter(datafilter);
    }
  };

  const month = [
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
    "Dec",
  ];

  const day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const [people, setPeople] = useState([0]);

  const getDataNumber = () => {
    var tempdata = [...people];
    for (var i = 0; i < 100; i++) {
      tempdata.push(i);
      if (i == 99) setPeople(tempdata);
    }
  };

  const kelas = [
    { name: "ECONOMY", label: "Economy" },
    { name: "PREMIUM_ECONOMY", label: "Premium" },
    { name: "BUSINESS", label: "Business" },
    { name: "FIRST", label: "First Class" },
  ];
  // tsst

  const gettanggal = (y = 0) => {
    var x = new Date();
    x.setDate(x.getDate() + y);
    var tgl = x.getDate();
    var bln = x.getMonth();
    var hari = x.getDay();
    var thn = x.getFullYear();
    return {
      fulldate: x,
      year: thn,
      month: month[bln],
      date: tgl,
      day: day[hari],
    };
  };

  var params = {
    grant_type: "client_credentials",
    client_id: "KmJPGfGNGye8uskuksMBg6jf1n7Kn6Xm",
    client_secret: "3XUAp7fldVhNUPjY",
  };

  let formBody = [];

  for (let property in params) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(params[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  var formBodys = formBody.join("&");

  const _fetchToken = async () => {
    setLoading(true);

    try {
      let response = await fetch(
        "https://test.api.amadeus.com/v1/security/oauth2/token",
        {
          method: "POST",
          headers: {
            // Accept: 'application/json',
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formBodys,
        }
      );

      let responseJson = await response.json();

      if (responseJson.access_token) {
        _fetchData(responseJson.access_token);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const checkAuthentication = async () => {
    getDataNumber();
    // console.log('test');
    if (kiriman && kiriman.from && kiriman.to) {
      setState(kiriman);
    } else {
      setState({
        round: false,
        from: {
          name: "Soekarno-hatta",
          city: "Jakarta",
          code: "CGK",
        },
        to: {
          name: "Ngurah Rai",
          city: "Denpasar",
          code: "DPS",
        },
        departure: gettanggal(),
        return: gettanggal(5),
        passengers: {
          adult: 1,
          childern: 0,
          infant: 0,
        },
        class: "ECONOMY",
      });
    }
  };

  const getdeparture = () => {
    // var x = state.departure.fulldate;
    var datereq = state.departure.fulldate.toISOString().split("T");
    return datereq[0];
  };

  const _fetchData = async (token) => {
    // setLoading(true);
    // 'https://test.api.amadeus.com/v1/shopping/flight-dates?origin=CGK&destination=DPS&departureDate=2020-11-20&oneWay=false&duration=1&nonStop=true',
    try {
      let response = await fetch(
        "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" +
          state.from.code +
          "&destinationLocationCode=" +
          state.to.code +
          "&departureDate=" +
          getdeparture() +
          "&adults=" +
          state.passengers.adult +
          "&children=" +
          state.passengers.childern +
          "&infants=" +
          state.passengers.infant +
          "&&currencyCode=IDR&travelClass=" +
          state.class +
          "",
        // 'https://test.api.amadeus.com/v2/shopping/flight-offers',
        {
          method: "GET",
          // method: 'POST',
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          // body: JSON.stringify(
          // 	{
          // 	currencyCode: 'IDR',
          // 	originDestinations: [
          // 		{
          // 			id: '1',
          // 			originLocationCode: 'CGK',
          // 			destinationLocationCode: 'DPS',
          // 			departureDateTimeRange: {
          // 				date: '2021-02-01',
          // 				time: '10:00:00',
          // 			},
          // 		},
          // 		// {
          // 		// 	id: '2',
          // 		// 	originLocationCode: 'DPS',
          // 		// 	destinationLocationCode: 'CGK',
          // 		// 	departureDateTimeRange: {
          // 		// 		date: '2021-02-05',
          // 		// 		time: '17:00:00',
          // 		// 	},
          // 		// },
          // 	],
          // 	travelers: [
          // 		{
          // 			id: '1',
          // 			travelerType: 'ADULT',
          // 		},
          // 		{
          // 			id: '3',
          // 			travelerType: 'ADULT',
          // 		},
          // 		{
          // 			id: '2',
          // 			travelerType: 'CHILD',
          // 		},
          // 	],
          // 	sources: ['GDS'],
          // 	searchCriteria: {
          // 		// maxFlightOffers: 2,
          // 		// flightFilters: {
          // 		// 	cabinRestrictions: [
          // 		// 		{
          // 		// 			cabin: 'BUSINESS',
          // 		// 			coverage: 'MOST_SEGMENTS',
          // 		// 			originDestinationIds: ['1'],
          // 		// 		},
          // 		// 	],
          // 		// 	carrierRestrictions: {
          // 		// 		excludedCarrierCodes: ['AA', 'TP', 'AZ'],
          // 		// 	},
          // 		// },
          // 	},
          // }
          // ),
        }
      );
      let responseJson = await response.json();
      // console.log(responseJson);
      if (responseJson.data && responseJson.data.length > 0) {
        // setDataFlight(responseJson.data);
        // setData(responseJson.dictionaries);
        props.navigation.navigate("ListFlight", {
          dataresult: responseJson,
          request: state,
          token: token,
        });
      } else {
        Alert.alert("Data pencarian kosong");
        // return false;
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const openModal = (from) => {
    settext("");
    setModalcity(true);
    setModalpos(from);
  };
  // console.log(state);

  const change = (item, pos) => {
    var tempdata = { ...state };
    if (pos === "adult") {
      tempdata.passengers.adult = item;
    } else if (pos === "child") {
      tempdata.passengers.childern = item;
    } else if (pos === "infant") {
      tempdata.passengers.infant = item;
    }
    setState(tempdata);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Loading show={loading} />
      <NavigationEvents onDidFocus={() => checkAuthentication()} />
      <View
        style={{
          height: Dimensions.get("screen").height * 0.3,
          backgroundColor: "#209fae",
        }}
      ></View>
      <View
        style={{
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
          position: "absolute",

          // backgroundColor: 'white',
        }}
      >
        <View
          style={{
            height: Dimensions.get("screen").height - 70,
            width: "100%",
            // borderWidth: 1,
            // borderColor: 'red',
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {state && state.from && state.to ? (
            <ScrollView
              style={{
                width: "100%",
                // borderWidth: 1
              }}
              contentContainerStyle={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              showsVerticalScrollIndicator={false}
            >
              <FlightHeader
                height={50}
                width={Dimensions.get("screen").width - 40}
              />

              <View
                style={{
                  flexDirection: "row",
                  // height: 32,
                  width: Dimensions.get("screen").width - 40,
                  // borderRadius: 27.5,
                  backgroundColor: "white",
                  marginVertical: 10,
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                  padding: 5,
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      state.round === false ? "#209fae" : "white",
                    height: 30,
                    // borderRadius: 25,
                    width: "50%",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setState({ ...state, round: false })}
                    style={{
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        color: state.round === false ? "white" : "#d3d3d3",
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      One Way
                    </Text>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    backgroundColor: state.round === true ? "#209fae" : "white",
                    height: 30,
                    // borderRadius: 25,
                    width: "50%",
                    alignItems: "center",
                    alignContent: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity
                    onPress={() => setState({ ...state, round: true })}
                    style={{
                      alignItems: "center",
                      alignContent: "center",
                      justifyContent: "center",
                      height: "100%",
                      width: "100%",
                    }}
                  >
                    <Text
                      style={{
                        color: state.round === true ? "white" : "#d3d3d3",
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Round Trip
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View
                style={{
                  borderWidth: 0.5,
                  borderColor: "#d3d3d3",
                  width: Dimensions.get("screen").width - 40,
                  backgroundColor: "white",
                  borderRadius: 5,
                  paddingHorizontal: 20,
                  paddingVertical: 10,
                  paddingBottom: 20,
                  shadowColor: "#d3d3d3",
                  shadowOffset: { width: 2, height: 2 },
                  shadowOpacity: 1,
                  shadowRadius: 2,
                  elevation: 5,
                }}
              >
                {/* ========================= from */}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#f3f3f3",
                    paddingBottom: 10,
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      width: (Dimensions.get("screen").width - 80) * 0.43,
                      // borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Bold",
                        fontSize: 14,
                        color: "#464646",
                      }}
                    >
                      From
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // openModal('from');
                        props.navigation.navigate("searchFlight", {
                          history: state,
                          position: "Destination",
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 16,
                          color: "#209fae",
                        }}
                      >
                        {state.from.city} {"("}
                        {state.from.code}
                        {")"}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "lato-light",
                          fontSize: 12,
                        }}
                      >
                        {state.from.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <Arrow />
                  </View>
                  <View
                    style={{
                      width: (Dimensions.get("screen").width - 80) * 0.43,
                      // borderWidth: 1,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Bold",
                        fontSize: 14,
                        color: "#464646",
                      }}
                    >
                      To
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        // openModal('from');
                        props.navigation.navigate("searchFlight", {
                          history: state,
                          position: "Arrival",
                        });
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 16,
                          color: "#209fae",
                        }}
                      >
                        {state.to.city} {"("}
                        {state.to.code}
                        {")"}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "lato-light",
                          fontSize: 12,
                        }}
                      >
                        {state.to.name}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* ========================= departure */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    borderBottomWidth: 1,
                    borderBottomColor: "#f3f3f3",
                    paddingBottom: 10,
                    marginVertical: 10,
                  }}
                >
                  <View
                    style={{
                      width: (Dimensions.get("screen").width - 80) * 0.43,
                      // borderWidth: 1,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Bold",
                          fontSize: 14,
                          color: "#464646",
                          marginRight: 10,
                        }}
                      >
                        Departure
                      </Text>
                      <Calendargrey />
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        props.navigation.navigate("calendar", {
                          history: state,
                          position: "departure",
                        })
                      }
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 16,
                          color: "#209fae",
                        }}
                      >
                        {state.departure.date} {state.departure.month}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "lato-light",
                          fontSize: 12,
                        }}
                      >
                        {state.departure.day} {state.departure.year}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>{/* <Text>test</Text> */}</View>
                  <View
                    style={{
                      width: (Dimensions.get("screen").width - 80) * 0.43,
                      // borderWidth: 1,
                    }}
                  >
                    {state.round === true ? (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Lato-Bold",
                              fontSize: 14,
                              color: "#464646",
                              marginRight: 10,
                            }}
                          >
                            Return
                          </Text>
                          <Calendargrey />
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            props.navigation.navigate("calendar", {
                              history: state,
                              position: "return",
                            })
                          }
                        >
                          <Text
                            style={{
                              fontFamily: "Lato-Regular",
                              fontSize: 16,
                              color: "#209fae",
                            }}
                          >
                            {state.return.date} {state.return.month}
                          </Text>
                          <Text
                            style={{
                              fontFamily: "lato-light",
                              fontSize: 12,
                            }}
                          >
                            {state.return.day} {state.return.year}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Lato-Bold",
                              fontSize: 14,
                              color: "#464646",
                              marginRight: 10,
                            }}
                          >
                            Return
                          </Text>
                          <Calendargrey />
                        </View>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 16,
                            color: "#d3d3d3",
                          }}
                        >
                          Month
                        </Text>
                        <Text
                          style={{
                            fontFamily: "lato-light",
                            fontSize: 12,
                            color: "#d3d3d3",
                          }}
                        >
                          Day
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* ========================= people */}
                <View
                  style={{
                    marginVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f3f3f3",
                    paddingBottom: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Lato-Bold",
                      fontSize: 14,
                      color: "#464646",
                    }}
                  >
                    Passengers
                  </Text>
                  <View
                    style={{
                      // marginVertical: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // justifyContent: 'space-between',
                      // width: Dimensions.get('screen').width - 80,
                      // borderWidth: 1,
                    }}
                  >
                    <View
                      style={{
                        // borderWidth: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 15,
                            color: "#209fae",
                            marginRight: 0,
                          }}
                        >
                          Adult
                        </Text>
                        <Text
                          style={{
                            fontFamily: "lato-light",
                            fontSize: 10,
                          }}
                        >
                          12+ years
                        </Text>
                      </View>
                      <View
                        style={{
                          // width: '40%',
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            padding: 3,
                            // borderWidth: 1,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            let tempdata = { ...state };
                            tempdata.passengers.adult =
                              state.passengers.adult === ""
                                ? 1
                                : parseInt(state.passengers.adult) + 1;
                            setState(tempdata);
                          }}
                        >
                          {/* <Image
                            style={{
                              width: 10,
                              height: 10,
                              resizeMode: "contain",
                              alignSelf: "center",
                              // marginLeft: -5,
                            }}
                            source={arrow_top}
                          /> */}
                        </TouchableOpacity>

                        <Input
                          // ref={refBox1}
                          style={{
                            margin: 0,
                            padding: 0,
                            fontFamily: "lato reg",
                            color: "#209fae",
                            // borderWidth: 1,
                            textAlign: "center",
                          }}
                          // autoFocus={true}
                          // customTextStyle={styles.numberInputText}
                          keyboardType="number-pad"
                          maxLength={2}
                          blurOnSubmit={false}
                          value={"" + state.passengers.adult}
                          defaultValue={"1"}
                          onChangeText={(e) => {
                            let tempdata = { ...state };
                            tempdata.passengers.adult =
                              parseInt(e) <= 1 ? 1 : e;
                            setState(tempdata);
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            padding: 3,
                            // borderWidth: 1,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            let tempdata = { ...state };
                            tempdata.passengers.adult =
                              state.passengers.adult === "" ||
                              state.passengers.adult <= 1
                                ? 1
                                : parseInt(state.passengers.adult) - 1;
                            setState(tempdata);
                          }}
                        >
                          <Image
                            style={{
                              width: 8,
                              height: 8,
                              alignSelf: "center",
                              resizeMode: "contain",
                              // marginLeft: -5,
                            }}
                            source={arrow_bot}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        // borderWidth: 1,

                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 15,
                            color: "#209fae",
                            marginRight: 0,
                          }}
                        >
                          Children
                        </Text>
                        <Text
                          style={{
                            fontFamily: "lato-light",
                            fontSize: 10,
                          }}
                        >
                          2-12 years
                        </Text>
                      </View>

                      <View
                        style={{
                          // width: '40%',
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            padding: 3,
                            // borderWidth: 1,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            let tempdata = { ...state };
                            tempdata.passengers.childern =
                              state.passengers.childern === ""
                                ? 1
                                : parseInt(state.passengers.childern) + 1;
                            setState(tempdata);
                          }}
                        >
                          {/* <Image
                            style={{
                              width: 8,
                              height: 8,
                              resizeMode: "contain",
                              alignSelf: "center",
                              // marginLeft: -15,
                            }}
                            source={arrow_top}
                          /> */}
                        </TouchableOpacity>
                        <Input
                          style={{
                            margin: 0,
                            padding: 0,
                            fontFamily: "lato reg",
                            color: "#209fae",
                            textAlign: "center",
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                          blurOnSubmit={false}
                          value={"" + state.passengers.childern}
                          defaultValue={"0"}
                          onChangeText={(e) => {
                            let tempdata = { ...state };
                            tempdata.passengers.childern =
                              parseInt(e) <= 0 ? 0 : e;
                            setState(tempdata);
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            padding: 3,
                            // borderWidth: 1,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            let tempdata = { ...state };
                            tempdata.passengers.childern =
                              state.passengers.childern === "" ||
                              state.passengers.childern <= 0
                                ? 0
                                : parseInt(state.passengers.childern) - 1;
                            setState(tempdata);
                          }}
                        >
                          <Image
                            style={{
                              width: 8,
                              height: 8,
                              alignSelf: "center",
                              resizeMode: "contain",
                              // marginLeft: -15,
                            }}
                            source={arrow_bot}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View
                      style={{
                        // borderWidth: 1,

                        flexDirection: "row",
                        alignItems: "center",
                        alignContent: "center",
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 15,
                            color: "#209fae",
                            marginRight: 0,
                          }}
                        >
                          Infant
                        </Text>
                        <Text
                          style={{
                            fontFamily: "lato-light",
                            fontSize: 10,
                          }}
                        >
                          0-2 years
                        </Text>
                      </View>
                      <View
                        style={{
                          // width: '40%',
                          alignContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            padding: 3,
                            // borderWidth: 1,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            let tempdata = { ...state };
                            tempdata.passengers.infant =
                              state.passengers.infant === ""
                                ? 1
                                : parseInt(state.passengers.infant) + 1;
                            setState(tempdata);
                          }}
                        >
                          {/* <Image
                            style={{
                              width: 8,
                              height: 8,
                              resizeMode: "contain",
                              alignSelf: "center",
                              // marginLeft: -5,
                            }}
                            source={arrow_top}
                          /> */}
                        </TouchableOpacity>
                        <Input
                          style={{
                            margin: 0,
                            padding: 0,
                            fontFamily: "lato reg",
                            color: "#209fae",
                            textAlign: "center",
                          }}
                          keyboardType="number-pad"
                          maxLength={2}
                          blurOnSubmit={false}
                          value={"" + state.passengers.infant}
                          defaultValue={"0"}
                          onChangeText={(e) => {
                            let tempdata = { ...state };
                            tempdata.passengers.infant =
                              parseInt(e) <= 0 ? 0 : e;
                            setState(tempdata);
                          }}
                        />
                        <TouchableOpacity
                          style={{
                            padding: 3,
                            // borderWidth: 1,
                            paddingHorizontal: 20,
                          }}
                          onPress={() => {
                            let tempdata = { ...state };
                            tempdata.passengers.infant =
                              state.passengers.infant === "" ||
                              state.passengers.infant <= 0
                                ? 0
                                : parseInt(state.passengers.infant) - 1;
                            setState(tempdata);
                          }}
                        >
                          <Image
                            style={{
                              width: 8,
                              height: 8,
                              alignSelf: "center",
                              resizeMode: "contain",
                              // marginLeft: -5,
                            }}
                            source={arrow_bot}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
                {/* ========================= class */}
                <View
                  style={{
                    marginBottom: 10,
                    paddingTop: 10,
                    paddingBottom: 20,
                    width: Dimensions.get("screen").width - 80,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f3f3f3",
                  }}
                >
                  <View
                    style={{
                      // marginVertical:
                      width: Dimensions.get("screen").width - 80,
                      flexDirection: "row",
                    }}
                  >
                    <FlatList
                      data={kelas}
                      // numColumns={3}
                      showsHorizontalScrollIndicator={false}
                      horizontal
                      renderItem={({ item }) => {
                        return (
                          <View
                            style={{
                              margin: 3,
                              width: Dimensions.get("screen").width * 0.3,
                              height: 35,
                              borderRadius: 17.5,
                              backgroundColor:
                                item.name === state.class
                                  ? "#209fae"
                                  : "#e9e9e9",
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() => {
                                setState({ ...state, class: item.name });
                              }}
                              style={{
                                width: "100%",
                                height: "100%",
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "Lato-Regular",
                                  fontSize: 14,
                                  color:
                                    item.name === state.class
                                      ? "white"
                                      : "black",
                                }}
                              >
                                {item.label}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    />
                    {/* </View> */}
                  </View>
                  {/* <View
										style={{
											marginVertical: 5,
											width: Dimensions.get('screen').width - 80,
											alignItems: 'center',
											alignContent: 'center',
										}}>
										<Text>Expand</Text>
									</View> */}
                </View>

                <TouchableOpacity
                  onPress={() => _fetchToken()}
                  style={{
                    width: Dimensions.get("screen").width - 80,
                    borderRadius: 5,
                    padding: 15,
                    marginVertical: 10,
                    backgroundColor: "#D75995",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Lato-Bold",
                      color: "white",
                    }}
                  >
                    Search Flight
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 100 }}></View>
            </ScrollView>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // marginTop: 22,
  },
  modalView: {
    // margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    height: Dimensions.get("screen").width * 0.5,
    width: Dimensions.get("screen").width - 40,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});

Flight.navigationOptions = (props) => ({
  // headerTransparent: true,
  headerTitle: "Search Flight",
  headerMode: "screen",
  headerStyle: {
    backgroundColor: "#209FAE",
    elevation: 0,
    borderBottomWidth: 0,
    // fontSize: 50,
    // justifyContent: 'center',
    // flex:1,
  },
  headerTitleStyle: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "white",
    alignSelf: "center",
  },
  headerLeft: (
    <TouchableOpacity
      style={{
        height: 40,
        width: 40,
        // borderWidth:1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        // backgroundColor:'white'
      }}
      onPress={() => props.navigation.goBack()}
    >
      <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
    </TouchableOpacity>
  ),
  headerLeftContainerStyle: {
    // paddingLeft: 20,
  },
  headerRight: <View style={{ flexDirection: "row" }}></View>,
  headerRightStyle: {
    // paddingRight: 20,
  },
});
