import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  Alert,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FunIcon } from "../../../component";
import { Text } from "../../../component";
import { Button } from "../../../component";
import Modal from "react-native-modal";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  Add,
  Hotel,
  Car,
  Service,
  OptionsVertBlack,
} from "../../../assets/svg";
import { FlatList } from "react-native-gesture-handler";
import ItinDrag from "./ItinDrag";
import AddDay from "../../../graphQL/Mutation/Itinerary/AddDay";
import Timeline from "../../../graphQL/Query/Itinerary/Timeline";
import DeleteDay from "../../../graphQL/Mutation/Itinerary/DeleteDay";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import { useTranslation } from "react-i18next";

export default function ItineraryDay({
  dataitin,
  dataday,
  props,
  token,
  kota,
  iditinerary,
  setAkhir,
  setidDayz,
  setCover,
  cover,
  lat,
  long,
  datadayaktif,
  setdatadayaktif,
  setLoading,
  Refresh,
  status,
  // GetTimeline,
}) {
  const { t, i18n } = useTranslation();

  let [modalmenu, setModalmenu] = useState(false);
  let [dataDay, setDataday] = useState(dataday);
  let [dataKota, setDataKota] = useState(kota);
  let [dataAkhir, setdataAkhir] = useState();

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
    mutationDeleteDay,
    { loading: Loadingdeleteday, data: datadeleteDay, error: errordeleteday },
  ] = useMutation(DeleteDay, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationSaveTimeline,
    { loading: loadingSave, data: dataSave, error: errorSave },
  ] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const deteteday = async (iditinerary, idDay) => {
    setLoading(true);
    try {
      let response = await mutationDeleteDay({
        variables: {
          itinerary_id: iditinerary,
          day_id: idDay,
        },
      });

      if (errorday) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_day.code !== 200) {
          throw new Error(response.data.delete_day.message);
        }
        await setdatadayaktif(dataDay[0]);
        await Refresh();
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  const getdatebaru = (dateakhir) => {
    dateakhir = dateakhir.split(" ");
    var tomorrow = new Date(dateakhir[0]);
    tomorrow.setDate(tomorrow.getDate());
    return tomorrow;
  };
  const addButton = async () => {
    setLoading(true);
    var datebaru = getdatebaru(dataDay[dataDay.length - 1].date);
    var urutanbaru = parseInt(dataDay[dataDay.length - 1].day);

    try {
      let response = await mutationAddDay({
        variables: {
          id: iditinerary,
          date: datebaru,
          day: urutanbaru,
        },
      });

      if (errorday) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.add_dayitinerary.code !== 200) {
          throw new Error(response.data.add_dayitinerary.message);
        }

        setDataday(response.data.add_dayitinerary.dataday);
        // setTimeout(() => {
        setIndex(dataDay.length);
        setIdDay(dataDay[dataDay.length - 1].id);
        await slider.current.scrollToEnd();
        Refresh();
        // await slider.current.scrollToIndex({
        // 	index: dataDay.length - 1,
        // });
        // }, 1700);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  let slider = useRef();

  let [indexnya, setIndex] = useState(0);

  let [idDay, setIdDays] = useState(dataDay[0].id);

  const setIdDay = (id) => {
    setIdDays(id);
    setidDayz(id);
  };

  const itindest = () => {
    props.navigation.navigate("itindest");
  };

  // const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState({});
  const [icons, setIcons] = useState({
    "01d": "w-sunny",
    "02d": "w-partly_cloudy",
    "03d": "w-cloudy",
    "04d": "w-fog",
    "09d": "w-fog_rain",
    "10d": "w-sunny_rainy",
    "11d": "w-thunderstorm",
    "13d": "w-snowflakes",
    "50d": "w-windy",
    "01n": "w-sunny",
    "02n": "w-partly_cloudy",
    "03n": "w-cloudy",
    "04n": "w-fog",
    "09n": "w-fog_rain",
    "10n": "w-sunny_rainy",
    "11n": "w-thunderstorm",
    "13n": "w-snowflakes",
    "50n": "w-windy",
  });

  const _fetchItem = async (kotanya) => {
    try {
      if (lat && long) {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?lat=" +
            lat +
            "&lon=" +
            long +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();
        setLoading(false);
        // var tempdata = [...data];
        // tempdata.push(responseJson);
        setData(responseJson);
      } else {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            kotanya.toLowerCase() +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();
        setLoading(false);
        // var tempdata = [...data];
        // tempdata.push(responseJson);
        setData(responseJson);
      }
    } catch (error) {
      console.error(error);
    }
  };

  let [modalsave, setModalsave] = useState(false);
  let [nexts, setnexts] = useState({});

  const savetimeline = async () => {
    setLoading(true);

    setModalsave(false);

    if (dataAkhir && dataAkhir.length > 0) {
      try {
        let response = await mutationSaveTimeline({
          variables: {
            idday: idDay,
            value: JSON.stringify(dataAkhir),
          },
        });

        if (errorSave) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.update_timeline.code !== 200) {
            throw new Error(response.data.update_timeline.message);
          }
          // Refresh();
          setdataAkhir(null);
          setAkhir([]);
          nextday(nexts);
          setnexts({});
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        Alert.alert("" + error);
      }
    }
  };

  const nextday = async (nex) => {
    setAkhir(null), setdataAkhir(null);
    setModalsave(false);
    setIndex(nex.index);
    setIdDay(nex.item.id);
    await GetTimeline(idDay);
    // setTimeout(() => {
    await slider.current.scrollToIndex({
      index: nex.index,
    });
    setLoading(false);
    setdatadayaktif(nex.item);
    setnexts({});
  };

  const setaktip = async (item, x) => {
    setLoading(true);
    setnexts({
      item: item,
      index: x,
    });
    if (dataAkhir && dataAkhir.length > 0) {
      // Alert.alert('Silahkan simpan data sebelumnya');
      setModalsave(true);
      setLoading(false);
    } else {
      setIndex(x);
      setIdDay(item.id);
      await GetTimeline(idDay);
      await slider.current.scrollToIndex({
        index: x,
      });
      setLoading(false);
      setdatadayaktif(item);
    }
  };
  const setdata = async (data) => {
    setdatadayaktif(data[0]);
    await GetTimeline(idDay);
  };

  useEffect(() => {
    {
      datadayaktif && datadayaktif.day
        ? setaktip(datadayaktif, parseInt(datadayaktif.day) - 1)
        : setdata(dataDay && dataDay.length ? dataDay : []);
    }

    _fetchItem(dataKota);
  }, []);

  const [
    GetTimeline,
    { data: datatimeline, loading: loadingtimeline, error: errortimeline },
  ] = useLazyQuery(Timeline, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: idDay },
  });

  return (
    <View
      style={{
        width: Dimensions.get("screen").width,
        backgroundColor: "#f6f6f6",
      }}
    >
      <View
        style={{
          marginTop: 10,
          marginHorizontal: 20,
          width: Dimensions.get("screen").width - 40,

          borderRadius: 5,
          borderWidth: 0.5,
          borderColor: "#C0C0C0",
          backgroundColor: "white",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1,
          elevation: 1,
          padding: 15,
        }}
      >
        <View style={{ width: "100%", alignItems: "center" }}>
          <Text
            size="description"
            type="bold"
            style={{
              marginBottom: 5,
            }}
          >
            {t("Itinerary")}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: status === "notsaved" ? "87%" : "100%" }}>
            {dataDay && dataDay.length ? (
              <FlatList
                ref={slider}
                style={{}}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={indexnya}
                horizontal={true}
                keyExtractor={(item, index) => index + ""}
                data={dataDay}
                contentContainerStyle={{
                  flexDirection: "row",
                  borderRadius: 5,
                }}
                renderItem={({ item, index }) => {
                  return (
                    <Button
                      onPress={() => setaktip(item, index)}
                      text={t("day") + " " + item.day}
                      size="small"
                      color={indexnya !== index ? "tertiary" : "primary"}
                      type="box"
                      style={{
                        marginHorizontal: 2.5,
                      }}
                    ></Button>
                  );
                }}
              />
            ) : null}
          </View>
          {status === "notsaved" ? (
            <Button
              onPress={() => addButton()}
              text={""}
              size="small"
              color={"tertiary"}
              type="circle"
              style={{
                marginHorizontal: 2.5,
              }}
            >
              <Add width={25} height={25} />
            </Button>
          ) : null}
        </View>
        {data && data.cod === 200 && data.weather ? (
          <View
            style={{
              alignItems: "center",
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                height: 50,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "flex-end",
                  height: "100%",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FunIcon
                    icon={icons[data.weather[0].icon]}
                    height={35}
                    width={35}
                    style={{
                      bottom: -3,
                    }}
                  />
                  <View
                    style={{
                      paddingTop: 5,
                      flexDirection: "row",
                    }}
                  >
                    <Text size="title" type="bold" style={{}}>
                      {(data.main.temp / 10).toFixed(1)}
                    </Text>
                    <View
                      style={{
                        marginTop: 7,
                        alignSelf: "flex-start",
                        height: 5,
                        width: 5,
                        borderWidth: 1,
                        borderRadius: 2.5,
                      }}
                    ></View>
                  </View>
                </View>
                <Text size="small" type="regular" style={{}}>
                  {data.weather[0].description}
                </Text>
              </View>

              {data.main.temp / 10 > 27.2 ? (
                <View
                  style={{
                    height: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <FunIcon
                    icon={"w-hot"}
                    height={35}
                    style={{
                      bottom: -3,
                    }}
                  />
                  <Text size="small" type="regular" style={{}}>
                    Hot
                  </Text>
                </View>
              ) : null}

              {data.main.temp / 10 > 25.8 && data.main.temp / 10 < 27.3 ? (
                <View
                  style={{
                    height: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <FunIcon icon={"w-warm"} height={50} width={50} />
                  <Text size="small" type="regular" style={{}}>
                    Warm
                  </Text>
                </View>
              ) : null}

              {data.main.temp / 10 > 22.8 && data.main.temp / 10 < 25.9 ? (
                <View
                  style={{
                    height: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <FunIcon icon={"w-humid"} height={50} width={50} />
                  <Text size="small" type="regular" style={{}}>
                    Humid
                  </Text>
                </View>
              ) : null}

              {data.main.temp / 10 > 20.5 && data.main.temp / 10 < 22.9 ? (
                <View
                  style={{
                    height: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <FunIcon icon={"w-cold"} height={50} width={50} />
                  <Text size="small" type="regular" style={{}}>
                    Cold
                  </Text>
                </View>
              ) : null}

              {data.main.temp / 10 < 20.6 ? (
                <View
                  style={{
                    height: "100%",
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <FunIcon icon={"w-freezing"} height={50} />
                  <Text size="small" type="regular" style={{}}>
                    Freezing
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
        ) : null}
      </View>
      <View
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 5,
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            size="label"
            type="bold"
            style={
              {
                // fontFamily: "Lato-Bold",
                // fontSize: 16,
              }
            }
          >
            {dataDay &&
            dataDay.length > 0 &&
            dataDay[indexnya] &&
            dataDay[indexnya].day
              ? t("day") + " " + dataDay[indexnya].day + " : " + dataKota
              : null}
          </Text>
          {status === "notsaved" && dataDay.length > 1 ? (
            <Button
              size="small"
              text=""
              type="circle"
              variant="transparent"
              style={
                {
                  // borderWidth: 1
                }
              }
              onPress={() => {
                setModalmenu(true);
                // deteteday(iditinerary, idDay);
              }}
            >
              <OptionsVertBlack width={15} height={15} />
            </Button>
          ) : null}
        </View>

        <View
          style={{
            marginHorizontal: 20,
            width: Dimensions.get("screen").width - 40,
            height: 50,

            // height: Dimensions.get('screen').width * 0.2,
            // height: 500,
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: "#C0C0C0",
            backgroundColor: "white",
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 1,
            elevation: 1,
            paddingTop: 5,
            paddingBottom: 5,
            paddingHorizontal: 30,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: "100%",

              justifyContent: "space-between",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <TouchableOpacity
              style={{
                width: "33.3%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                // borderWidth: 1,
                // borderColor: 'red',
              }}
            >
              <Hotel width={25} height={25} />

              <Text size="small" type="bold" style={{}}>
                {t("hotel")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: "60%",
                width: 1,
                borderRightWidth: 1,
                borderRightColor: "rgba(0, 0, 0, 0.2)",
              }}
            ></View>
            <TouchableOpacity
              // onPress={() => props.navigation.navigate('RentTransportation')}
              onPress={() =>
                props.navigation.navigate("RentList", {
                  dataitin: dataitin,
                  token: token,
                })
              }
              style={{
                width: "33.3%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Car width={25} height={25} />

              <Text size="small" type="bold" style={{}}>
                {t("rent")}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                height: "60%",
                width: 1,
                borderRightWidth: 1,
                borderRightColor: "rgba(0, 0, 0, 0.2)",
              }}
            ></View>
            <TouchableOpacity
              // onPress={() => props.navigation.navigate('Service')}
              onPress={() =>
                props.navigation.navigate("ServiceList", {
                  dataitin: dataitin,
                  token: token,
                })
              }
              style={{
                width: "33.3%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Service width={25} height={25} />
              <Text size="small" type="bold" style={{}}>
                {t("service")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: Dimensions.get("screen").width,
            borderBottomWidth: 1,
            borderBottomColor: "#d3d3d3",
            paddingBottom: 10,
          }}
        ></View>
      </View>
      {/* ? (setCover(
					datatimeline.day_timeline[0].images
					? datatimeline.day_timeline[0].images
						: null,
		   ),
			  setidDayz(idDay), */}
      {datatimeline && datatimeline.day_timeline.length ? (
        <ItinDrag
          idDay={idDay}
          data={datatimeline.day_timeline}
          props={props}
          setAkhir={(e) => {
            setAkhir(e), setdataAkhir(e);
          }}
          setidDayz={(e) => setidDayz(e)}
          token={token}
          iditinerary={iditinerary}
          setloading={(e) => setLoading(e)}
          refresh={(e) => Refresh(e)}
          GetTimeline={(e) => GetTimeline()}
          datadayaktif={datadayaktif}
          setdatadayaktif={(e) => setdatadayaktif(e)}
          status={status}
          setCover={(e) => setCover(e)}
          cover={cover}
        />
      ) : (
        <View style={{ height: Dimensions.get("screen").height * 0.6 }}>
          {cover ? setCover(cover) : null}
        </View>
      )}

      <Modal
        onBackdropPress={() => {
          setModalmenu(false);
        }}
        onRequestClose={() => setModalmenu(false)}
        onDismiss={() => setModalmenu(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalmenu}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              deteteday(iditinerary, idDay);
            }}
          >
            {dataDay &&
            dataDay.length > 0 &&
            dataDay[indexnya] &&
            dataDay[indexnya].day ? (
              <Text style={{ color: "#d75995" }}>
                {t("delete")} {t("day")} {dataDay[indexnya].day} {t("from")}{" "}
                {t("Itinerary")}
              </Text>
            ) : null}
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModalsave(false);
        }}
        onRequestClose={() => setModalsave(false)}
        onDismiss={() => setModalsave(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalsave}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
            // height: '50%',
          }}
        >
          <Text>{t("alertsave")}</Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 20,
              paddingHorizontal: 40,
            }}
          >
            <Button
              onPress={() => {
                savetimeline();
              }}
              color="primary"
              text={t("save")}
            ></Button>
            <Button
              onPress={() => {
                nextday(nexts);
              }}
              color="secondary"
              variant="bordered"
              text={t("delete")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
