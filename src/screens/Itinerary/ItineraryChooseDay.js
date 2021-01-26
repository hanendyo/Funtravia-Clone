import React, { useState, useEffect } from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  Alert,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { back_arrow_white, default_image } from "../../assets/png";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import { CheckBox } from "native-base";
import ItineraryDetails from "../../graphQL/Query/Itinerary/ItineraryDetails";
import { dateFormat, dateFormats } from "../../component/src/dateformatter";
import AddDay from "../../graphQL/Mutation/Itinerary/AddDay";
import AddDestination from "../../graphQL/Mutation/Itinerary/AddDestination";
import AddGoogle from "../../graphQL/Mutation/Itinerary/AddGoogle";
import AddEvent from "../../graphQL/Mutation/Itinerary/AddEvent";
import { Button, Text, Truncate, Loading } from "../../component";
import { Arrowbackwhite } from "../../assets/svg";
import { useTranslation } from "react-i18next";

export default function ItineraryChooseday(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Choose day",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Choose day",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
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
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  const { t, i18n } = useTranslation();
  let [Iditinerary, setId] = useState(props.route.params.Iditinerary);
  let [Kiriman, setIdDes] = useState(props.route.params.Kiriman);
  let [token, setToken] = useState(props.route.params.token);
  let [dataSelected, setDataSelected] = useState([]);
  let [loading, setLoading] = useState(false);
  let [ArrayDay, setArrayDay] = useState([]);

  console.log(Kiriman);
  const [
    GetListEvent,
    { data: dataItinerary, loading: loadingdetail, error: errordetail },
  ] = useLazyQuery(ItineraryDetails, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: Iditinerary },
  });

  const wait = (timeout) => {
    return new Promise((resolve) => {
      setTimeout(resolve, timeout);
    });
  };

  const [refreshing, setRefreshing] = React.useState(false);

  const _Refresh = React.useCallback(() => {
    let datadayaktif = props.route.params.datadayaktif;
    if (datadayaktif) {
      let tempdata = { ...datadayaktif };
      tempdata["checked"] = true;
      tempdata["daywajib"] = true;
      let datasel = [...dataSelected];
      datasel.push(tempdata);
      setDataSelected(datasel);
    }
    setRefreshing(true);
    GetListEvent();
    wait(5000).then(() => {
      setRefreshing(false);
    });
  }, []);

  let [Position, setPosition] = useState(props.route.params.Position);

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormat(x[0]);
  };

  const [
    mutationAddDay,
    { loading: Loadingday, data: dataAddDay, error: errorday },
  ] = useMutation(AddDay, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSave,
    { loading: LoadingSave, data: dataSave, error: errorSave },
  ] = useMutation(AddDestination, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSaveGoogle,
    {
      loading: LoadingSavegoogle,
      data: dataSavegoogle,
      error: errorSavegoogle,
    },
  ] = useMutation(AddGoogle, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSaveEvent,
    { loading: LoadingSaveEvent, data: dataSaveEvent, error: errorSaveEvent },
  ] = useMutation(AddEvent, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const getdatebaru = (dateakhir) => {
    dateakhir = dateakhir.split(" ");
    var tomorrow = new Date(dateakhir[0]);
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow;
  };

  const tambahHari = async (dataDay) => {
    setLoading(true);
    var datebaru = getdatebaru(dataDay[dataDay.length - 1].date);
    var urutanbaru = parseInt(dataDay[dataDay.length - 1].day);

    try {
      let response = await mutationAddDay({
        variables: {
          id: Iditinerary,
          date: datebaru,
          day: urutanbaru,
        },
      });
      if (Loadingday) {
        Alert.alert("Loading!!");
      }
      if (errorday) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.add_dayitinerary.code !== 200) {
          throw new Error(response.data.add_dayitinerary.message);
        }

        setArrayDay(response.data.add_dayitinerary.dataday);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  const getDN = (start, end) => {
    start = start.split(" ");
    end = end.split(" ");
    var date1 = new Date(start[0]);
    var date2 = new Date(end[0]);
    var Difference_In_Time = date2.getTime() - date1.getTime();
    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

    return Difference_In_Days + 1 + "D" + Difference_In_Days + "N";
  };
  const _handleCheck = (id, day, total_hours) => {
    var tempdata = [...dataSelected];
    var index = tempdata.findIndex((k) => k["id"] === id);
    if (index !== -1) {
      tempdata.splice(index, 1);
    } else {
      tempdata.push({
        id: id,
        day: day,
        checked: true,
        total_hours: total_hours,
      });
    }
    setDataSelected(tempdata);
    getchecked(id);
  };

  const saveData = async () => {
    if (dataSelected.length > 0) {
      setLoading(true);
      if (Position === "destination") {
        var datas = [];
        var x = 0;
        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }

        if (x == dataSelected.length) {
          try {
            let response = await mutationSave({
              variables: {
                day: datas,
                idDestination: Kiriman,
              },
            });
            if (LoadingSave) {
              Alert.alert("Loading!!");
            }
            if (errorSave) {
              throw new Error("Error Input");
            }
            if (response.data) {
              if (response.data.add_destination.code !== 200) {
                throw new Error(response.data.add_destination.message);
              }
              {
                dataItinerary.itinerary_detail
                  ? props.navigation.navigate("itindetail", {
                      itintitle: dataItinerary.itinerary_detail.name,
                      country: Iditinerary,
                      dateitin:
                        dataItinerary && dataItinerary.itinerary_detail
                          ? dateFormatr(
                              dataItinerary.itinerary_detail.start_date
                            ) +
                            "  -  " +
                            dateFormatr(dataItinerary.itinerary_detail.end_date)
                          : null,
                      token: token,
                      datadayaktif: dataSelected[0],
                    })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            Alert.alert("" + error);
          }
        }
      } else if (Position === "google") {
        var datas = [];
        var x = 0;
        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }

        if (x == dataSelected.length) {
          try {
            let responsegoogle = await mutationSaveGoogle({
              variables: {
                id: datas,
                title: Kiriman.name,
                icon: Kiriman.photos
                  ? "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" +
                    Kiriman.photos[0].photo_reference +
                    "&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg"
                  : "i-tour",
                address: Kiriman.formatted_address,
                latitude: Kiriman.geometry.location.lat,
                longitude: Kiriman.geometry.location.lng,
              },
            });
            if (LoadingSavegoogle) {
              Alert.alert("Loading!!");
            }
            if (errorSavegoogle) {
              throw new Error("Error Input");
            }

            // console.log(responsegoogle);

            if (responsegoogle.data) {
              if (responsegoogle.data.add_google.code !== 200) {
                throw new Error(responsegoogle.data.add_google.message);
              }
              {
                dataItinerary.itinerary_detail
                  ? props.navigation.navigate("itindetail", {
                      itintitle: dataItinerary.itinerary_detail.name,
                      country: Iditinerary,
                      dateitin:
                        dataItinerary && dataItinerary.itinerary_detail
                          ? dateFormatr(
                              dataItinerary.itinerary_detail.start_date
                            ) +
                            "  -  " +
                            dateFormatr(dataItinerary.itinerary_detail.end_date)
                          : null,
                      token: token,
                      datadayaktif: dataSelected[0],
                    })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            Alert.alert("oioioioioio" + error);
            console.log(error);
          }
        }
      } else if (Position === "Event") {
        var datas = [];
        var x = 0;
        for (var i in dataSelected) {
          datas.push(dataSelected[i].id);
          x++;
        }

        if (x == dataSelected.length) {
          try {
            let responseevent = await mutationSaveEvent({
              variables: {
                day_id: datas,
                event_id: Kiriman,
              },
            });
            if (LoadingSaveEvent) {
              Alert.alert("Loading!!");
            }
            if (errorSaveEvent) {
              throw new Error("Error Input");
            }

            if (responseevent.data) {
              if (responseevent.data.add_event.code !== 200) {
                throw new Error(responseevent.data.add_event.message);
              }
              {
                dataItinerary.itinerary_detail
                  ? props.navigation.navigate("itindetail", {
                      itintitle: dataItinerary.itinerary_detail.name,
                      country: Iditinerary,
                      dateitin:
                        dataItinerary && dataItinerary.itinerary_detail
                          ? dateFormatr(
                              dataItinerary.itinerary_detail.start_date
                            ) +
                            "  -  " +
                            dateFormatr(dataItinerary.itinerary_detail.end_date)
                          : null,
                      token: token,
                      datadayaktif: dataSelected[0],
                    })
                  : null;
              }
            }
            setLoading(false);
          } catch (error) {
            setLoading(false);
            Alert.alert("" + error);
          }
        }
      } else {
        Alert.alert("Fungsi belum ada untuk type" + Position);

        console.log(Position);
        setLoading(false);
      }
    } else {
      Alert.alert("Please Choose a day!");
    }
  };

  const getchecked = (id) => {
    var index = dataSelected.findIndex((k) => k["id"] === id);
    if (index !== -1) {
      return true;
    } else {
      return false;
    }
  };

  const cek = (total, id) => {
    var index = dataSelected.findIndex((k) => k["id"] === id && k["daywajib"]);
    if (index >= 0) {
      return true;
    } else {
      total = total.split(":");
      let jam = total[0];
      let menit = total[1];

      if (jam < 24) {
        if (jam < 23) {
          return false;
        } else if (jam === 23 && menit === 0) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  };

  const RenderActive = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          _handleCheck(
            item.id,
            item.day,
            item.total_hours ? item.total_hours : "00:00:00"
          )
        }
        disabled={cek(
          item.total_hours ? item.total_hours : "00:00:00",
          item.id
        )}
        style={{
          opacity:
            cek(item.total_hours ? item.total_hours : "00:00:00", item.id) ===
            true
              ? 0.5
              : 1,
          flexDirection: "row",
          borderBottomWidth: 1,
          borderBottomColor: "#f3f3f3",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <CheckBox
          style={{
            margin: 5,
            borderRadius: 5,
            borderColor: "#f3f3f3",
          }}
          checked={getchecked(item.id)}
          color="#209FAE"
        />
        <Text
          style={{
            fontFamily: "Lato-Bold",
            fontSize: 16,
            marginLeft: 20,
          }}
        >
          {t("day")} {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      _Refresh();
    });
    return unsubscribe;
  }, [props.navigation]);

  return (
    <View
      style={{
        flex: 1,
        height: Dimensions.get("screen").height,
        width: Dimensions.get("screen").width,
        paddingHorizontal: 20,
      }}
    >
      <Loading show={loading}></Loading>
      {/* <NavigationEvents onDidFocus={() => _Refresh()} /> */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={_Refresh} />
        }
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        {dataItinerary && dataItinerary.itinerary_detail ? (
          <View>
            <ImageBackground
              source={
                dataItinerary.itinerary_detail.cover
                  ? { uri: dataItinerary.itinerary_detail.cover }
                  : default_image
              }
              style={{
                width: Dimensions.get("screen").width - 40,
                height: Dimensions.get("screen").width * 0.2,
                borderRadius: 10,
                marginVertical: 10,
              }}
              imageStyle={{
                width: Dimensions.get("screen").width - 40,
                height: Dimensions.get("screen").width * 0.2,
                borderRadius: 10,
                resizeMode: "cover",
              }}
            >
              <View
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.38)",
                  width: "100%",
                  height: "100%",
                  borderRadius: 10,
                  padding: 10,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    // height: '100%',
                    width: "100%",
                  }}
                  // onPress={() => {
                  // 	props.navigation.navigate('detailStack', {
                  // 		id: 'ca1657c4-306c-45b1-aa0b-4e7edd236d8f',
                  // 		name: 'test',
                  // 	});
                  // }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between",
                      // height:'100%'
                    }}
                  >
                    <View
                      style={
                        {
                          // width: '50%',
                        }
                      }
                    >
                      <Text
                        style={{
                          fontFamily: "Lato-Bold",
                          fontSize: 18,
                          color: "white",
                          // marginLeft: (5),
                        }}
                      >
                        <Truncate
                          text={dataItinerary.itinerary_detail.name}
                          length={30}
                        />
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Lato-Regular",
                        color: "white",
                        marginLeft: 3,
                      }}
                    >
                      {getDN(
                        dataItinerary.itinerary_detail.start_date,
                        dataItinerary.itinerary_detail.end_date
                      )}
                      {" - "}
                      {dataItinerary && dataItinerary.itinerary_detail
                        ? dateFormatr(
                            dataItinerary.itinerary_detail.start_date
                          ) +
                          "  /  " +
                          dateFormatr(dataItinerary.itinerary_detail.end_date)
                        : null}
                    </Text>
                  </View>
                </View>
              </View>
            </ImageBackground>
            <Text
              style={{
                fontFamily: "Lato-Bold",
                fontSize: 14,
              }}
            >
              {t("chooseDay")} :{" "}
            </Text>
            {ArrayDay.length
              ? ArrayDay.map((item, i) => {
                  return <RenderActive item={item} />;
                })
              : dataItinerary.itinerary_detail.day.map((item, i) => {
                  return <RenderActive item={item} />;
                })}
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderColor: "#D75995",
                borderRadius: 5,
                borderWidth: 1,
                width: 150,
                marginTop: 10,
                marginLeft: 20,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() =>
                tambahHari(
                  ArrayDay.length
                    ? ArrayDay
                    : dataItinerary.itinerary_detail.day
                )
              }
            >
              <Text
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  color: "#D75995",
                }}
              >
                {t("addMoreDay")}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View style={{ height: 70 }}></View>
      </ScrollView>
      <View
        style={{
          zIndex: 999,
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 60,
          width: Dimensions.get("window").width,
          backgroundColor: "white",
          paddingVertical: 10,
          borderTopWidth: 1,
          borderColor: "#F0F0F0",
          shadowColor: "#F0F0F0",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 3,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          onPress={() => saveData()}
          style={{
            width: Dimensions.get("window").width - 40,
          }}
          text={t("next")}
        />
      </View>
    </View>
  );
}