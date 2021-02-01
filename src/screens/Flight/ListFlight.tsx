import React, { useState, useEffect } from "react";
import {
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
} from "react-native";
import Modal from "react-native-modal";

import { back_arrow_white, default_image, Menuputih } from "../../../const/Png";
import {
  Arrowbackwhite,
  ArrowRight,
  FlightHeader,
  OptionsVertWhite,
  Xhitam,
  GA,
  ID,
  QG,
  JT,
  Edit,
  Filters,
  Sort,
  Bottom,
  Done,
} from "../../../const/Svg";

import { NavigationEvents } from "react-navigation";
import Truncate from "../../../utils/Truncate";
import { rupiah } from "../../../const/Rupiah";
import Loading from "../Loading";
import { FlatList } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";

export default function ListFlight(props) {
  let [loading, setLoading] = useState(false);

  let [dataFlight, setData] = useState(
    props.navigation.getParam("dataresult").data
  );
  let [dataFlightAll, setDataAll] = useState(
    props.navigation.getParam("dataresult").data
  );
  let [Datas, setKamus] = useState(
    props.navigation.getParam("dataresult").dictionaries
  );

  let [DataRequest, setRequest] = useState(
    props.navigation.getParam("request")
  );

  let [token, setToken] = useState(props.navigation.getParam("token"));
  let [currency, setCurrency] = useState("IDR");

  let [DataBulan, setDataBulan] = useState([]);
  let [DataBulanfilter, setDataBulanfilter] = useState([]);
  let [DataMonth, setDataMonth] = useState([]);
  let [bulanaktif, setBulanaktif] = useState("");
  let [Dateaktif, setDateAktif] = useState("");
  let [modalshow, setModalshow] = useState(false);
  let [modalfiltershow, setmodalfiltershow] = useState(false);
  let [modalsortshow, setmodalsortshow] = useState(false);

  let [FilterFlight, setFilterFlight] = useState([]);
  let [FilterDeparture, setFilterDeparture] = useState({
    earlymorning: false,
    morning: false,
    afternoon: false,
    evening: false,
  });
  let [FilterArrival, setFilterArrival] = useState({
    earlymorning: false,
    morning: false,
    afternoon: false,
    evening: false,
  });

  let [Sorting, setSortings] = useState(1);

  const setSorting = (n, data) => {
    setLoading(true);
    closePaneln();
    // 1 = price
    // 2 = eardeparture
    // 3 = latedeparture
    // 4 = eararrival
    // 4 = latearrival
    setSortings(n);

    if (!data) {
      data = [...dataFlight];
    }
    if (n === 1) {
      let sortedActivities = data.sort((a, b) => {
        return parseInt(a.price.total) - parseInt(b.price.total);
      });
      setData(sortedActivities);
    }

    if (n === 2) {
      let sortedActivities = data.sort((a, b) => {
        return (
          new Date(a.itineraries[0].segments[0].departure.at) -
          new Date(b.itineraries[0].segments[0].departure.at)
        );
      });
      setData(sortedActivities);
    }
    if (n === 3) {
      let sortedActivities = data.sort((a, b) => {
        return (
          new Date(b.itineraries[0].segments[0].departure.at) -
          new Date(a.itineraries[0].segments[0].departure.at)
        );
      });
      setData(sortedActivities);
    }
    if (n === 4) {
      let sortedActivities = data.sort((a, b) => {
        return (
          new Date(
            a.itineraries[0].segments[
              a.itineraries[0].segments.length - 1
            ].arrival.at
          ) -
          new Date(
            b.itineraries[0].segments[
              b.itineraries[0].segments.length - 1
            ].arrival.at
          )
        );
      });
      setData(sortedActivities);
    }
    if (n === 5) {
      let sortedActivities = data.sort((a, b) => {
        return (
          new Date(
            b.itineraries[0].segments[
              b.itineraries[0].segments.length - 1
            ].arrival.at
          ) -
          new Date(
            a.itineraries[0].segments[
              a.itineraries[0].segments.length - 1
            ].arrival.at
          )
        );
      });
      setData(sortedActivities);
    }

    setLoading(false);
  };

  const clearAll = () => {
    setFilterFlight([]);
    setFilterArrival({
      earlymorning: false,
      morning: false,
      afternoon: false,
      evening: false,
    });
    setFilterDeparture({
      earlymorning: false,
      morning: false,
      afternoon: false,
      evening: false,
    });

    setData(dataFlightAll);
    setmodalfiltershow(false);
  };

  const openPanel = () => {
    setmodalfiltershow(true);
  };

  const closePanel = () => {
    setmodalfiltershow(false);
  };

  const openPaneln = () => {
    setmodalsortshow(true);
  };

  const closePaneln = () => {
    setmodalsortshow(false);
  };

  Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
      for (var j = i + 1; j < a.length; ++j) {
        if (a[i] === a[j]) a.splice(j--, 1);
      }
    }

    return a;
  };

  const setFilter = () => {
    setLoading(true);

    let tgl = DataRequest.departure.fulldate.toISOString().split("T");
    tgl = tgl[0];
    let subuh = new Date(tgl + "T00:00:00");
    let subuh1 = new Date(tgl + "T06:00:00");

    let pagi = new Date(tgl + "T06:00:00");
    let pagi1 = new Date(tgl + "T12:00:00");

    let siang = new Date(tgl + "T12:00:00");
    let siang1 = new Date(tgl + "T18:00:00");

    let malam = new Date(tgl + "T18:00:00");
    let malam1 = new Date(tgl + "T23:59:00");

    var datafilter = [];

    // filter departure ==================================================================

    if (FilterDeparture.earlymorning === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(e.itineraries[0].segments[0].departure.at) >= subuh &&
          new Date(e.itineraries[0].segments[0].departure.at) <= subuh1
      );
      datafilter = datafilter.concat(hasil).unique();
    }
    if (FilterDeparture.morning === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(e.itineraries[0].segments[0].departure.at) >= pagi &&
          new Date(e.itineraries[0].segments[0].departure.at) <= pagi1
      );
      datafilter = datafilter.concat(hasil).unique();
    }
    if (FilterDeparture.afternoon === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(e.itineraries[0].segments[0].departure.at) >= siang &&
          new Date(e.itineraries[0].segments[0].departure.at) <= siang1
      );
      datafilter = datafilter.concat(hasil).unique();
    }
    if (FilterDeparture.evening === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(e.itineraries[0].segments[0].departure.at) >= malam &&
          new Date(e.itineraries[0].segments[0].departure.at) <= malam1
      );
      datafilter = datafilter.concat(hasil).unique();
    }

    if (FilterArrival.evening === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() >= malam.getHours() &&
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() <= malam1.getHours()
      );
      datafilter = datafilter.concat(hasil).unique();
    }

    if (FilterArrival.earlymorning === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() >= subuh.getHours() &&
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() <= subuh1.getHours()
      );
      datafilter = datafilter.concat(hasil).unique();
    }

    if (FilterArrival.morning === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() >= pagi.getHours() &&
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() <= pagi1.getHours()
      );
      datafilter = datafilter.concat(hasil).unique();
    }

    if (FilterArrival.afternoon === true) {
      let hasil = dataFlightAll.filter(
        (e) =>
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() >= siang.getHours() &&
          new Date(
            e.itineraries[0].segments[
              e.itineraries[0].segments.length - 1
            ].arrival.at
          ).getHours() <= siang1.getHours()
      );
      datafilter = datafilter.concat(hasil).unique();
    }

    // console.log(datafilter);

    if (datafilter.length > 0) {
      if (FilterFlight.length > 0) {
        // console.log(datafilter);

        var x = [...datafilter];
        datafilter = x.filter((e) =>
          FilterFlight.includes(e.itineraries[0].segments[0].carrierCode)
        );
      }
    } else {
      if (FilterFlight.length > 0) {
        // console.log(datafilter);

        var x = [...dataFlightAll];
        datafilter = x.filter((e) =>
          FilterFlight.includes(e.itineraries[0].segments[0].carrierCode)
        );
      }
    }

    if (datafilter.length > 0) {
      setLoading(false);
      setSorting(Sorting, datafilter);
    }
  };

  const getTime = (date) => {
    var x = date.split("T");
    var y = x[1].split(":");

    return "" + y[0] + ":" + y[1];
  };

  const getDuration = (Dur) => {
    var x = Dur.split("H");
    var y = x[0].split("PT");
    var z = x[1].split("M");
    return "" + y[1] + "j " + z[0] + "mnt";
  };

  const getdeparture = () => {
    var datereq = DataRequest.departure.fulldate.toISOString().split("T");
    return datereq[0];
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

  const filterdata = (datef) => {
    var datereq = DataRequest.departure.fulldate.toISOString().split("T");
    var datereqs = datereq[0].split("-");

    let datafilter = DataBulan.filter((e) => e.departureDate.includes(datef));
    setBulanaktif(datef);
    setDataBulanfilter([]);
    if (datafilter && datafilter.length) {
      const sortedActivities = datafilter.sort((a, b) => {
        return new Date(a.departureDate) - new Date(b.departureDate);
      });
      setDataBulanfilter(sortedActivities);
    }
  };

  const mont = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const _fetchData = async () => {
    setLoading(true);
    var datereq = DataRequest.departure.fulldate.toISOString().split("T");
    var datereqs = datereq[0].split("-");
    var hasi = datereqs[0] + "-" + datereqs[1];
    setBulanaktif(hasi);
    setDateAktif(datereqs[0] + "-" + datereqs[1] + "-" + datereqs[2]);

    try {
      let response = await fetch(
        "https://test.api.amadeus.com/v1/shopping/flight-dates?origin=" +
          DataRequest.from.code +
          "&destination=" +
          DataRequest.to.code +
          "&oneWay=true&nonStop=true&viewBy=DATE",

        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        }
      );
      let responseJson = await response.json();
      // console.log(responseJson);
      if (responseJson.data && responseJson.data.length > 0) {
        setDataBulan(responseJson.data);
        setCurrency(responseJson.meta.currency);
        var d = responseJson.meta.defaults.departureDate.split(",");
        var d1 = new Date(d[0]);
        var d2 = new Date(d[1]);
        var start = d[0].split("-");
        var end = d[1].split("-");
        var startYear = parseInt(start[0]);
        var endYear = parseInt(end[0]);
        var dates = [];
        for (var i = startYear; i <= endYear; i++) {
          var endMonth = i != endYear ? 11 : parseInt(end[1]) - 1;
          var startMon = i === startYear ? parseInt(start[1]) - 1 : 0;
          for (
            var j = startMon;
            j <= endMonth;
            j = j > 12 ? j % 12 || 11 : j + 1
          ) {
            var month = j + 1;
            var displayMonth = month < 10 ? "0" + month : month;
            dates.push([i, displayMonth].join("-"));
          }
        }
        setDataMonth(dates);
        let datafilter = responseJson.data.filter((e) =>
          e.departureDate.includes(dates[0])
        );
        // setBulanaktif(date);
        if (datafilter && datafilter.length) {
          const sortedActivities = datafilter.sort((a, b) => {
            return new Date(a.departureDate) - new Date(b.departureDate);
          });

          // console.log(sortedActivities);
          setDataBulanfilter(sortedActivities);
        }
      } else {
        // Alert.alert('Data pencarian kosong');
        // return false;
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const GetDates = ({ date }) => {
    var x = new Date(date);
    var dy = x.getDay();
    var tgl = x.getDate();
    return "" + tgl + " " + day[dy];
    // return date;
  };

  const GetBulan = () => {
    var c = bulanaktif.split("-");
    // console.log(c);
    // console.log(month[parseInt(c[1]) - 1]);

    return month[parseInt(c[1]) - 1].toUpperCase();
  };

  const RenderBulan = ({ data }) => {
    let tahunnya = "";
    return (
      <View>
        {DataMonth.map((item, index) => {
          let potongan = item.split("-");
          if (tahunnya !== potongan[0]) {
            tahunnya = potongan[0];
            return (
              <View
                key={index}
                style={{
                  width: Dimensions.get("screen").width,
                  alignItems: "center",
                  alignContent: "center",
                  borderWidth: 1,
                  padding: 10,
                  borderColor: "#d3d3d3",
                }}
              >
                <Text
                  style={{
                    alignSelf: "center",
                    fontFamily: "Lato-Bold",
                    fontSize: 18,
                    width: "80%",
                    textAlign: "center",
                    // borderWidth: 1,

                    // borderColor: '#d3d3d3',
                    borderBottomWidth: 1,
                    borderBottomColor: "#d3d3d3",
                  }}
                >
                  {tahunnya}
                </Text>
                <FlatList
                  nestedScrollEnabled
                  data={DataMonth}
                  numColumns={2}
                  renderItem={(xy, yy) => {
                    let potongans = xy.item.split("-");
                    if (potongan[0] === potongans[0]) {
                      return (
                        <TouchableOpacity
                          key={xy.index}
                          style={{
                            margin: 5,
                            paddingVertical: 20,
                            paddingHorizontal: 50,
                            // borderWidth: 1,
                          }}
                          onPress={() => {
                            filterdata(xy.item);
                            setModalshow(false);
                            // setBulanaktif(item);
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: "Lato-Bold",
                              fontSize: 18,
                            }}
                          >
                            {month[parseInt(potongans[1]) - 1]}
                          </Text>
                        </TouchableOpacity>
                      );
                    }
                  }}
                />
              </View>
            );
          }
          return <View></View>;
        })}
      </View>
    );
  };

  const getDatabaru = async (daten) => {
    setLoading(true);
    let tempdata = { ...DataRequest };

    var star = new Date(daten);
    // star.setDate(start.getDate());

    tempdata.departure = {
      fulldate: star,
      year: star.getFullYear(),
      month: month[star.getMonth()],
      day: day[star.getDay()],
      date: star.getDate(),
    };

    setRequest(tempdata);

    let datereqs = daten.split("-");
    let hasi = datereqs[0] + "-" + datereqs[1];
    setBulanaktif(hasi);
    setDateAktif(daten);

    try {
      let response = await fetch(
        "https://test.api.amadeus.com/v2/shopping/flight-offers?originLocationCode=" +
          DataRequest.from.code +
          "&destinationLocationCode=" +
          DataRequest.to.code +
          "&departureDate=" +
          daten +
          "&adults=" +
          DataRequest.passengers.adult +
          "&children=" +
          DataRequest.passengers.childern +
          "&infants=" +
          DataRequest.passengers.infant +
          "&&currencyCode=IDR&travelClass=" +
          DataRequest.class +
          "",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          // body: 'originLocationCode=SYD&destinationLocationCode=BKK',
        }
      );
      let responseJson = await response.json();
      // console.log(responseJson);
      if (responseJson.data && responseJson.data.length > 0) {
        setData(responseJson.data);
        setDataAll(responseJson.data);
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

  const Getairline = () => {
    return Datas && Datas.carriers
      ? Object.keys(Datas.carriers).map(function (keyName, keyIndex) {
          var inde = FilterFlight.findIndex((k) => k === keyName);
          var tempdata = [...FilterFlight];

          return (
            <TouchableOpacity
              onPress={() => {
                if (inde === -1) {
                  tempdata.push(keyName);
                  setFilterFlight(tempdata);
                  // console.log(tempdata);
                } else {
                  tempdata.splice(inde, 1);
                  setFilterFlight(tempdata);
                }
              }}
              style={{
                paddingVertical: 5,
                // width: '50%',
                flexDirection: "row",
                alignContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <CheckBox
                style={{
                  marginLeft: -10,

                  // backgroundColor: '#209FAE',
                  borderRadius: 5,
                  borderColor: "#464646",
                  alignSelf: "flex-start",
                }}
                // onPress={() => _handleCheck(item['id'], index)}
                checked={inde === -1 ? false : true}
                color="#209FAE"
              />
              <View
                style={{
                  marginLeft: 20,
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                  }}
                >
                  {Datas.carriers[keyName]}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })
      : null;
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationEvents onDidFocus={() => _fetchData()} />
      <Loading show={loading} />
      <ScrollView
        stickyHeaderIndices={[1]}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            // height: Dimensions.get('screen').height * 0.3,
            width: Dimensions.get("screen").width,
            backgroundColor: "#209fae",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <FlightHeader
            height={50}
            width={Dimensions.get("screen").width - 40}
          />
          <View
            style={{
              width: Dimensions.get("screen").width - 20,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              // borderWidth: 1,
              // paddingHorizontal: 20,
              justifyContent: "space-between",
            }}
          >
            <View>
              <View
                style={{
                  // width: Dimensions.get('screen').width,

                  flexDirection: "row",
                  justifyContent: "flex-start",
                  // paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  <Truncate text={DataRequest.from.city} length={10} />
                </Text>
                <ArrowRight
                  height={20}
                  width={20}
                  style={{ marginHorizontal: 10 }}
                />
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 18,
                    color: "white",
                  }}
                >
                  {" "}
                  <Truncate text={DataRequest.to.city} length={10} />
                </Text>
              </View>
              <View
                style={{
                  // width: Dimensions.get('screen').width,
                  alignItems: "center",
                  alignContent: "center",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  {DataRequest.departure.day},{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  {DataRequest.departure.date}{" "}
                </Text>
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  {DataRequest.departure.month}{" "}
                </Text>
                <View
                  style={{
                    width: 5,
                    height: 5,
                    backgroundColor: "white",
                    borderRadius: 5,
                    marginHorizontal: 5,
                  }}
                ></View>
                <Text
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "white",
                  }}
                >
                  {" "}
                  {DataRequest.class}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("Flighting");
              }}
              style={{
                // marginRight: 10,
                backgroundColor: "#209fae",
                borderWidth: 1,
                borderColor: "white",
                borderRadius: 5,
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: "row",
              }}
            >
              <Edit width={15} height={15} />
              <Text
                style={{
                  marginLeft: 5,
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "white",
                }}
              >
                Change Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            // minHeight: 20,
            backgroundColor: "#209fae",
            paddingVertical: 5,
          }}
        >
          {DataBulanfilter && DataBulanfilter.length > 0 ? (
            <View
              style={{
                marginTop: 10,
                marginBottom: 5,
                borderRadius: 5,
                width: Dimensions.get("screen").width - 20,
                // borderWidth: 1,
                shadowColor: "#464646",
                shadowOffset: { width: 2, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5,
                height: Dimensions.get("screen").width * 0.2,
                // marginVertical: 5,
                backgroundColor: "white",
                flexDirection: "row",
                // paddingHorizontal: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  // _fetchData();
                  setModalshow(true);
                }}
                style={{
                  // borderWidth: 1,
                  backgroundColor: "#d3d3d3",
                  borderColor: "#f6f6f6",
                  width: "10%",
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Lato-Bold",
                    fontSize: 14,
                    color: "#464646",
                    transform: [{ rotate: "-90deg" }],
                  }}
                >
                  {bulanaktif && bulanaktif !== "" ? <GetBulan /> : " "}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: "88%",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <FlatList
                  horizontal={true}
                  data={DataBulanfilter}
                  showsHorizontalScrollIndicator={false}
                  renderItem={(item, index) => {
                    // console.log(item);
                    return (
                      <TouchableOpacity
                        // key={item.index}
                        onPress={() => {
                          getDatabaru(item.item.departureDate);
                        }}
                        // key={index}
                        style={{
                          width: (Dimensions.get("screen").width - 50) / 4,
                          alignItems: "center",
                          alignContent: "center",
                          justifyContent: "center",
                          backgroundColor:
                            item &&
                            item.item &&
                            item.item.departureDate &&
                            item.item.departureDate === Dateaktif
                              ? "#e2ecf8"
                              : "white",
                          borderBottomWidth: 2,
                          borderBottomColor:
                            item &&
                            item.item &&
                            item.item.departureDate &&
                            item.item.departureDate === Dateaktif
                              ? "#d75995"
                              : "white",
                          borderLeftColor: "#f6f6f6",
                          borderLeftWidth: 1,
                          borderRightColor: "#f6f6f6",
                          borderRightWidth: 1,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "lato-light",
                            fontSize: 14,
                          }}
                        >
                          <GetDates
                            date={
                              item && item.item && item.item.departureDate
                                ? item.item.departureDate
                                : null
                            }
                          />
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Lato-Bold",
                            fontSize: 14,
                          }}
                        >
                          {currency}{" "}
                          {item &&
                          item.item &&
                          item.item.price &&
                          item.item.price.total
                            ? item.item.price.total
                            : "-"}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </View>
          ) : null}
        </View>
        {/* ============================= */}

        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          style={{}}
          contentContainerStyle={{
            paddingHorizontal: 10,
          }}
        >
          {dataFlight && dataFlight.length > 0
            ? dataFlight.map((data, index) => {
                // console.log(data.itineraries);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate("Flightdetail", {
                        data: data,
                        kamus: Datas,
                        request: DataRequest,
                        token: token,
                      });
                    }}
                    style={{
                      borderRadius: 5,
                      width: Dimensions.get("screen").width - 20,
                      // borderWidth: 1,
                      shadowColor: "#d3d3d3",
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: 1,
                      shadowRadius: 2,
                      elevation: 5,
                      height: Dimensions.get("screen").width * 0.25,
                      marginVertical: 5,
                      backgroundColor: "white",
                      flexDirection: "row",
                      paddingHorizontal: 5,
                    }}
                  >
                    {data.itineraries && data.itineraries.length > 0
                      ? data.itineraries.map((item, i) => {
                          // console.log(item);
                          return (
                            <View
                              style={{
                                width: "60%",
                                flexDirection: "row",
                              }}
                            >
                              {item.segments && item.segments.length > 0 ? (
                                <View
                                  style={{
                                    width: "50%",
                                  }}
                                >
                                  {item.segments.map((datas, inde) => {
                                    return (
                                      <View
                                        style={{
                                          padding: 10,
                                          justifyContent: "center",
                                          alignItems: "flex-start",
                                          alignContent: "flex-start",
                                          // borderWidth: 1,
                                          height:
                                            Dimensions.get("screen").width *
                                            0.25,
                                          // marginVertical: 10,
                                        }}
                                      >
                                        {/* <Text>{datas.carrierCode}</Text> */}
                                        {inde === 0 ? (
                                          <View>
                                            {datas.carrierCode ? (
                                              <View>
                                                {datas.carrierCode === "ID" ? (
                                                  <ID width={80} height={50} />
                                                ) : datas.carrierCode ===
                                                  "GA" ? (
                                                  <GA width={80} height={50} />
                                                ) : datas.carrierCode ===
                                                  "JT" ? (
                                                  <JT width={80} height={50} />
                                                ) : datas.carrierCode ===
                                                  "QG" ? (
                                                  <QG width={80} height={50} />
                                                ) : (
                                                  <Text
                                                    style={{
                                                      fontFamily:
                                                        "Lato-Regular",
                                                      fontSize: 10,
                                                    }}
                                                  >
                                                    {Datas.carriers &&
                                                    Datas.carriers[
                                                      datas.carrierCode
                                                    ]
                                                      ? Datas.carriers[
                                                          datas.carrierCode
                                                        ]
                                                      : "-"}
                                                  </Text>
                                                )}
                                              </View>
                                            ) : null}
                                            <View
                                              style={{
                                                flexDirection: "row",
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  fontFamily: "Lato-Regular",
                                                  fontSize: 14,
                                                }}
                                              >
                                                {/* <Truncate
																									text={
																										Datas.carriers &&
																										Datas.carriers[
																											datas.carrierCode
																										]
																											? Datas.carriers[
																													datas.carrierCode
																											  ]
																											: '-'
																									}
																									length={9}
																								/>{' '} */}
                                                {datas.carrierCode}
                                                {" - "}
                                              </Text>
                                              <Text
                                                style={{
                                                  fontFamily: "Lato-Regular",
                                                  fontSize: 14,
                                                }}
                                              >
                                                {datas.aircraft.code}
                                              </Text>
                                            </View>
                                          </View>
                                        ) : null}
                                      </View>
                                    );
                                  })}
                                </View>
                              ) : null}

                              <View
                                style={{
                                  width: "50%",
                                  alignItems: "flex-start",
                                  padding: 10,
                                }}
                              >
                                {item.segments && item.segments.length > 0 ? (
                                  <View
                                    style={{
                                      width: "100%",
                                      justifyContent: "flex-start",
                                      flexDirection: "row",
                                    }}
                                  >
                                    {item.segments.map((datas, inde) => {
                                      return (
                                        <View
                                          style={{
                                            // borderWidth: 1,
                                            // marginVertical: 10,
                                            flexDirection: "row",
                                          }}
                                        >
                                          {inde === 0 ? (
                                            <View>
                                              {/* <Text>Waktu berangkat</Text> */}
                                              <Text
                                                style={{
                                                  fontFamily: "Lato-Bold",
                                                  fontSize: 16,
                                                }}
                                              >
                                                {getTime(datas.departure.at)}
                                                {" - "}
                                              </Text>
                                            </View>
                                          ) : null}
                                          {inde === item.segments.length - 1 ? (
                                            <View>
                                              {/* <Text>Waktu tiba</Text> */}
                                              <Text
                                                style={{
                                                  fontFamily: "Lato-Bold",
                                                  fontSize: 16,
                                                }}
                                              >
                                                {getTime(datas.arrival.at)}
                                              </Text>
                                            </View>
                                          ) : null}
                                        </View>
                                      );
                                    })}
                                  </View>
                                ) : null}

                                <Text
                                  style={{
                                    fontFamily: "Lato-Regular",
                                    fontSize: 14,
                                  }}
                                >
                                  {getDuration(item.duration)}
                                </Text>

                                {item.segments && item.segments.length > 1 ? (
                                  <View>
                                    <Text
                                      style={{
                                        fontFamily: "Lato-Regular",
                                        fontSize: 14,
                                      }}
                                    >
                                      Transit
                                    </Text>
                                  </View>
                                ) : (
                                  <View>
                                    <Text
                                      style={{
                                        fontFamily: "Lato-Regular",
                                        fontSize: 14,
                                      }}
                                    >
                                      Langsung
                                    </Text>
                                  </View>
                                )}
                              </View>
                            </View>
                          );
                        })
                      : null}

                    {data.price && data.travelerPricings.length > 0
                      ? data.travelerPricings.map((itemss, ins) => {
                          // console.log(itemss);
                          return ins === 0 &&
                            itemss.travelerType === "ADULT" ? (
                            <View
                              style={{
                                width: "40%",
                                padding: 10,
                                justifyContent: "center",
                                alignItems: "center",
                                alignContent: "center",
                                // borderWidth: 1,
                                height: Dimensions.get("screen").width * 0.25,
                              }}
                            >
                              <Text
                                style={{
                                  fontFamily: "lato-semibold",
                                  fontSize: 12,
                                  // color: '#209fae',
                                }}
                              >
                                {DataRequest.class}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignContent: "flex-end",
                                  alignItems: "flex-end",
                                }}
                              >
                                <Text
                                  style={{
                                    fontFamily: "Lato-Bold",
                                    fontSize: 16,
                                    color: "#209fae",
                                  }}
                                >
                                  {itemss.price.currency +
                                    " " +
                                    rupiah(itemss.price.base)}
                                </Text>
                                <Text
                                  style={{
                                    fontFamily: "Lato-Regular",
                                    fontSize: 10,
                                    // color: '#209fae',
                                  }}
                                >
                                  {/* /org */}
                                </Text>
                              </View>
                            </View>
                          ) : null;
                        })
                      : null}
                  </TouchableOpacity>
                );
              })
            : null}

          {/* {Datas && Datas.carriers ? console.log(Datas) : null} */}
        </ScrollView>

        {/* ============================= */}
      </ScrollView>

      <View
        style={{
          height: 70,
          backgroundColor: "white",
          flexDirection: "row",
          borderTopWidth: 0.5,
          borderTopColor: "#d3d3d3",
          // shadowColor: '#464646',
          // shadowOffset: { width: 2, height: 2 },
          // shadowOpacity: 1,
          // shadowRadius: 2,
          // elevation: 5,
          paddingHorizontal: 20,
          justifyContent: "space-around",
          alignItems: "center",
          alignContent: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => setmodalfiltershow(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Filters height={15} width={15} />
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 16,
              marginLeft: 5,
            }}
          >
            Filter
          </Text>
        </TouchableOpacity>
        <View
          style={{
            borderLeftWidth: 1,
            height: 50,
            borderLeftColor: "#d3d3d3",
          }}
        ></View>
        <TouchableOpacity
          onPress={() => setmodalsortshow(true)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <Sort height={15} width={15} />
          <Text
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 16,
              marginLeft: 5,
            }}
          >
            Sort
          </Text>
        </TouchableOpacity>
      </View>

      {/* sort =================================== */}
      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalsortshow}
        avoidKeyboard={false}
        style={{
          // marginBottom: -10,
          // backgroundColor: 'rgba(0, 0, 0, 0.25)',
          justifyContent: "flex-end",
          alignItems: "center",
          alignContent: "center",
          margin: 0,
        }}
      >
        <Animated.View
          style={{
            height: 5,
            backgroundColor: "#209fae",
            // opacity: opacityn,
            width: Dimensions.get("screen").width,
          }}
        ></Animated.View>
        <View
          style={{
            // borderWidth: 1,
            backgroundColor: "white",
            maxHeight: Dimensions.get("screen").height - 50,
            width: Dimensions.get("screen").width,
          }}
        >
          <TouchableOpacity
            style={{
              // shadowColor: '#464646',
              // shadowOffset: { width: 2, height: 2 },
              // shadowOpacity: 1,
              // shadowRadius: 2,
              // elevation: 5,
              flexDirection: "row",
              // height: 30,
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
              width: "100%",
              backgroundColor: "white",
              // display: isPanelActive === true ? 'none' : 'flex',
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPressIn={() => {
              closePaneln();
            }}
            onPress={() => {
              closePaneln();
            }}
            onPressOut={() => {
              closePaneln();
            }}
            onLongPress={() => {
              closePaneln();
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              Sort
            </Text>
            <Xhitam />
          </TouchableOpacity>
          <View style={{ paddingBottom: 40 }}>
            <TouchableOpacity
              onPress={() => {
                setSorting(1);
              }}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                borderBottomWidth: 0.5,
                paddingHorizontal: 20,
                borderBottomColor: "#d3d3d3",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontFamily: "Lato-Regular", fontSize: 14 }}>
                Low to High Price
              </Text>
              {Sorting === 1 ? <Done height={20} width={20} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSorting(2);
              }}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                borderBottomWidth: 0.5,
                paddingHorizontal: 20,
                justifyContent: "space-between",
                borderBottomColor: "#d3d3d3",
              }}
            >
              <Text style={{ fontFamily: "Lato-Regular", fontSize: 14 }}>
                Earliest Departure
              </Text>
              {Sorting === 2 ? <Done height={20} width={20} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSorting(3);
              }}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                borderBottomWidth: 0.5,
                justifyContent: "space-between",
                paddingHorizontal: 20,
                borderBottomColor: "#d3d3d3",
              }}
            >
              <Text style={{ fontFamily: "Lato-Regular", fontSize: 14 }}>
                Latest Departure
              </Text>
              {Sorting === 3 ? <Done height={20} width={20} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSorting(4);
              }}
              style={{
                paddingVertical: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                borderBottomWidth: 0.5,
                paddingHorizontal: 20,
                borderBottomColor: "#d3d3d3",
              }}
            >
              <Text style={{ fontFamily: "Lato-Regular", fontSize: 14 }}>
                Earliest Arrival
              </Text>
              {Sorting === 4 ? <Done height={20} width={20} /> : null}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setSorting(5);
              }}
              style={{
                paddingVertical: 10,
                justifyContent: "space-between",
                flexDirection: "row",
                borderBottomWidth: 0.5,
                paddingHorizontal: 20,
                borderBottomColor: "#d3d3d3",
              }}
            >
              <Text style={{ fontFamily: "Lato-Regular", fontSize: 14 }}>
                Latest Arrival
              </Text>
              {Sorting === 5 ? <Done height={20} width={20} /> : null}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* filter ==================================== */}

      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalfiltershow}
        avoidKeyboard={false}
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          alignContent: "center",
          margin: 0,
        }}
      >
        <Animated.View
          style={{
            height: 5,
            backgroundColor: "#209fae",
            // opacity: opacityn,
            width: Dimensions.get("screen").width,
          }}
        ></Animated.View>
        <View
          style={{
            backgroundColor: "white",
            maxHeight: Dimensions.get("screen").height - 50,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              // shadowColor: '#464646',
              // shadowOffset: { width: 2, height: 2 },
              // shadowOpacity: 1,
              // shadowRadius: 2,
              // elevation: 5,
              flexDirection: "row",
              // height: 30,
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
              width: "100%",
              backgroundColor: "white",
              // display: isPanelActive === true ? 'none' : 'flex',
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPressIn={() => {
              closePanel();
            }}
            onPress={() => {
              closePanel();
            }}
            onPressOut={() => {
              closePanel();
            }}
            onLongPress={() => {
              closePanel();
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              Filter
            </Text>
            <Xhitam />
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            style={{
              padding: 20,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              Departure Time
            </Text>

            <View
              style={{
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  paddingVertical: 5,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setFilterDeparture({
                      ...FilterDeparture,
                      earlymorning: !FilterDeparture.earlymorning,
                    })
                  }
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() =>
                    // 	setFilterDeparture({
                    // 		...FilterDeparture,
                    // 		earlymorning: !FilterDeparture.earlymorning,
                    // 	})
                    // }
                    checked={FilterDeparture.earlymorning}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Early Morning
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      00:00 - 06:00
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFilterDeparture({
                      ...FilterDeparture,
                      morning: !FilterDeparture.morning,
                    })
                  }
                  style={{
                    // marginLeft: 30,
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterDeparture.morning}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Morning
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      06:00 - 12:00
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingVertical: 5,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setFilterDeparture({
                      ...FilterDeparture,
                      afternoon: !FilterDeparture.afternoon,
                    })
                  }
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterDeparture.afternoon}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Afternoon
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      12:00 - 18:00
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFilterDeparture({
                      ...FilterDeparture,
                      evening: !FilterDeparture.evening,
                    })
                  }
                  style={{
                    // marginLeft: 30,
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterDeparture.evening}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Evening
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      18:00 - 24:00
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              Arrival Time
            </Text>

            <View
              style={{
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  paddingVertical: 5,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setFilterArrival({
                      ...FilterArrival,
                      earlymorning: !FilterArrival.earlymorning,
                    })
                  }
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterArrival.earlymorning}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Early Morning
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      00:00 - 06:00
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFilterArrival({
                      ...FilterArrival,
                      morning: !FilterArrival.morning,
                    })
                  }
                  style={{
                    // marginLeft: 30,
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterArrival.morning}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Morning
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      06:00 - 12:00
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  paddingVertical: 5,
                  width: "100%",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    setFilterArrival({
                      ...FilterArrival,
                      afternoon: !FilterArrival.afternoon,
                    })
                  }
                  style={{
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterArrival.afternoon}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Afternoon
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      12:00 - 18:00
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    setFilterArrival({
                      ...FilterArrival,
                      evening: !FilterArrival.evening,
                    })
                  }
                  style={{
                    // marginLeft: 30,
                    width: "50%",
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <CheckBox
                    style={{
                      marginLeft: -10,

                      // backgroundColor: '#209FAE',
                      borderRadius: 5,
                      borderColor: "#464646",
                      alignSelf: "flex-start",
                    }}
                    // onPress={() => _handleCheck(item['id'], index)}
                    checked={FilterArrival.evening}
                    color="#209FAE"
                  />
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        fontSize: 14,
                      }}
                    >
                      Evening
                    </Text>
                    <Text
                      style={{
                        fontFamily: "lato-light",
                        fontSize: 14,
                      }}
                    >
                      18:00 - 24:00
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              Airlines
            </Text>
            <View
              style={{
                paddingVertical: 10,
              }}
            >
              <Getairline />
            </View>
            <View
              style={{
                height: 50,
              }}
            ></View>
          </ScrollView>

          <View
            style={{
              height: 70,
              backgroundColor: "white",
              flexDirection: "row",
              borderTopWidth: 0.5,
              borderTopColor: "#d3d3d3",
              paddingHorizontal: 20,
              // shadowColor: '#464646',
              // shadowOffset: { width: 2, height: 2 },
              // shadowOpacity: 1,
              // shadowRadius: 2,
              // elevation: 5,
              justifyContent: "space-around",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => clearAll()}
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {/* <Filters height={15} width={15} /> */}
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  marginLeft: 5,
                  color: "#D75995",
                }}
              >
                Clear All
              </Text>
            </TouchableOpacity>
            {/* <View
							style={{
								borderLeftWidth: 1,
								height: 50,
								borderLeftColor: '#d3d3d3',
							}}></View> */}
            <TouchableOpacity
              onPress={() => {
                setmodalfiltershow(false);
                setFilter();
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                backgroundColor: "#209fae",
                paddingHorizontal: 70,
                paddingVertical: 10,
                borderRadius: 5,
              }}
            >
              {/* <Sort height={15} width={15} /> */}
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  marginLeft: 5,
                  color: "white",
                }}
              >
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalshow}
        avoidKeyboard={false}
        style={{
          // marginBottom: -10,
          margin: 0,
          // backgroundColor: 'rgba(0, 0, 0, 0.25)',
          justifyContent: "flex-end",
          alignItems: "center",
          // alignSelf: 'center',
          alignContent: "center",
        }}
      >
        <Animated.View
          style={{
            height: 5,
            backgroundColor: "#209fae",
            // opacity: opacityn,
            width: Dimensions.get("screen").width,
          }}
        ></Animated.View>
        <View
          style={{
            backgroundColor: "white",
            maxHeight: Dimensions.get("screen").height - 50,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={{
              // shadowColor: '#464646',
              // shadowOffset: { width: 2, height: 2 },
              // shadowOpacity: 1,
              // shadowRadius: 2,
              // elevation: 5,
              flexDirection: "row",
              // height: 30,
              paddingVertical: 20,
              paddingHorizontal: 20,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
              width: "100%",
              backgroundColor: "white",
              // display: isPanelActive === true ? 'none' : 'flex',
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            onPressIn={() => {
              setModalshow(false);
            }}
            onPress={() => {
              setModalshow(false);
            }}
            onPressOut={() => {
              setModalshow(false);
            }}
            onLongPress={() => {
              setModalshow(false);
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 18,
              }}
            >
              Change Month
            </Text>
            <Xhitam />
          </TouchableOpacity>
          <ScrollView
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
          >
            <RenderBulan data={DataMonth} />
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

ListFlight.navigationOptions = (props) => ({
  // headerTransparent: true,
  headerTitle: "Search Result",
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
  headerRight: (
    <View style={{ flexDirection: "row" }}>
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
        onPress={() => Alert.alert("Coming soon!")}
      >
        <OptionsVertWhite height={20} width={20} />
      </TouchableOpacity>
    </View>
  ),
  headerRightStyle: {
    // paddingRight: 20,
  },
});
