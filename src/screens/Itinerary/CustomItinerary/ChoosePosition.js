import React, {useState, useEffect} from "react";
import {
  View,
  Dimensions,
  Image,
  Alert,
  TouchableOpacity,
  ScrollView,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import {Textarea} from "native-base";
import {default_image} from "../../../assets/png";
import Modal from "react-native-modal";
import {useMutation} from "@apollo/react-hooks";
import {
  Arrowbackios,
  Arrowbackwhite,
  CheckWhite,
  Delete,
  Pencilgreen,
  Xgray,
} from "../../../assets/svg";
import SaveCustom from "../../../graphQL/Mutation/Itinerary/AddCustomNew";
import SaveCustom2 from "../../../graphQL/Mutation/Itinerary/AddCustom";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import Swipeout from "react-native-swipeout";
import {Button, Text, Loading, FunIcon, Distance} from "../../../component";
import {useTranslation} from "react-i18next";
import {StackActions} from "@react-navigation/routers";
import DeviceInfo from "react-native-device-info";

export default function ChoosePosition(props) {
  const {t, i18n} = useTranslation();
  const Notch = DeviceInfo.hasNotch();

  const HeaderComponent = {
    headerShown: true,
    title: "Custom Activity",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{color: "#fff"}}>
        {t("customActivity")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
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

  let idDay = props.route.params.idDay;
  let token = props.route.params.token;
  let [datatimeline, setDatatimeline] = useState(
    props.route.params.datatimeline
  );

  console.log("timeline", datatimeline);
  let [loading, setLoading] = useState(false);
  let [modal, setModal] = useState(false);
  let [textinput, setInput] = useState("");
  let [indexinput, setIndexInput] = useState("");
  let [jammax, setjammax] = useState(props.route.params.jammax);

  let [dataAkhir, setData] = useState([]);
  let [dataInput, setDataInput] = useState(props.route.params.dataCustom);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    // const unsubscribe = props.navigation.addListener("focus", () => {
    //   loadAsync();
    // });
    // return unsubscribe;
  }, [props.navigation]);

  const saveNotes = () => {
    var tempData = [...datatimeline];
    let x = {...tempData[indexinput]};
    x.note = textinput;
    tempData.splice(indexinput, 1, x);

    // tempData[indexinput].note = textinput;
    setDatatimeline(tempData);
    setModal(false);
  };

  const GetStartTime = ({startt}) => {
    var starttime = startt.split(":");

    return (
      <Text size="description" type="regular" style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
  };

  const bukaModal = (text = null, index) => {
    // console.log(text);
    // console.log(index);
    // setModal(true);

    if (text) {
      setInput(text);
    } else {
      setInput("");
    }
    setIndexInput(index);
    setModal(true);
  };

  const GetEndTime = ({startt, dur}) => {
    var duration = dur.split(":");
    var starttime = startt.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    // if (jam > 23) {
    // 	jam = 24 - jam;
    // }
    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);

    if (menit >= 60) {
      menit = menit - 60;
    }

    return (
      <Text size="description" type="regular" style={{}}>
        {jam < 10 ? "0" + (jam < 0 ? "0" : jam) : jam}:
        {menit < 10 ? "0" + menit : menit}
      </Text>
    );
  };

  const hapus = (id) => {
    let tempData = [...datatimeline];
    let inde = tempData.findIndex((k) => k["id"] === id);
    tempData.splice(inde, 1);
    setDatatimeline(tempData);
  };

  const swipeoutBtn = (idItem) => {
    return [
      {
        backgroundColor: "#f6f6f6",
        component: (
          <TouchableOpacity
            onPress={() => {
              hapus(idItem);
            }}
            style={{
              height: "100%",
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Delete height={20} width={20} />
            <Text size="small" type="regular" style={{}}>
              {t("delete")}
            </Text>
          </TouchableOpacity>
        ),
      },
    ];
  };

  const RenderItinerary = ({item, index}) => {
    const x = datatimeline.length - 1;

    if (item.stat === "new") {
      return (
        <Swipeout
          style={{backgroundColor: "white"}}
          left={swipeoutBtn(item.id)}
        >
          <View>
            <View
              style={{
                marginVertical: 5,
                paddingBottom: 10,

                width: Dimensions.get("screen").width - 40,
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <View style={{height: "100%", width: "25%", paddingTop: 10}}>
                <TouchableOpacity
                  style={{
                    alignItems: "center",
                    paddingRight: 10,
                    justifyContent: "flex-start",
                  }}
                >
                  {item.icon ? (
                    <FunIcon icon={"i-tour"} height={50} width={50} />
                  ) : null}
                  {/* {item.type !== "custom" ? (
                    <Image
                      source={
                        item.images
                          ? { uri: item.images }
                          : item.icon
                          ? { uri: item.icon }
                          : default_image
                      }
                      style={{
                        height: 75,
                        width: 75,
                        resizeMode: "cover",
                        borderRadius: 5,
                      }}
                    />
                  ) : item.icon ? (
                    <FunIcon icon={item.icon} height={50} width={50} />
                  ) : (
                    <FunIcon icon={"i-tour"} height={50} width={50} />
                  )} */}
                </TouchableOpacity>
              </View>
              <View style={{height: "100%", width: "70%", paddingTop: 10}}>
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                  }}
                >
                  <TouchableOpacity>
                    {item.time ? (
                      <GetStartTime startt={item.time} />
                    ) : (
                      <Text>00:00</Text>
                    )}
                  </TouchableOpacity>
                  <Text> - </Text>
                  <TouchableOpacity>
                    {item.duration ? (
                      <GetEndTime
                        startt={item.time ? item.time : "00:00"}
                        dur={item.duration ? item.duration : "00:00"}
                      />
                    ) : (
                      <Text>00:00</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={{width: "100%", paddingHorizontal: 10}}
                >
                  <Text
                    size="label"
                    type="bold"
                    style={{
                      width: Dimensions.get("screen").width * 0.6,
                    }}
                  >
                    {item.name ? item.name : item.title ? item.title : "-"}
                  </Text>
                  {item.note ? (
                    <View>
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginVertical: 5,
                          width: Dimensions.get("screen").width * 0.55,

                          textAlign: "justify",
                        }}
                      >
                        {item.note}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
                <View style={{paddingHorizontal: 10}}>
                  {item.note ? (
                    <TouchableOpacity
                      onPress={() => bukaModal(item.note, index)}
                      style={{flexDirection: "row", alignItems: "center"}}
                    >
                      <Pencilgreen width={10} height={10} />
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 5,
                          marginVertical: 5,

                          color: "#209fae",
                        }}
                      >
                        {t("editNotes")}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => bukaModal(null, index)}
                      style={{flexDirection: "row", alignItems: "center"}}
                    >
                      <Pencilgreen width={10} height={10} />
                      <Text
                        size="small"
                        type="regular"
                        style={{
                          marginLeft: 5,
                          marginVertical: 5,

                          color: "#209fae",
                        }}
                      >
                        {t("addNotes")}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
            <View
              style={{
                width: "100%",
                borderStyle: "dashed",
                borderRadius: 1,
                borderWidth: 1,
                borderColor: "#f3f3f3",
              }}
            ></View>
          </View>
        </Swipeout>
      );
    } else {
      return (
        <View>
          <View
            style={{
              marginVertical: 5,
              paddingBottom: 10,

              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
            }}
          >
            <View style={{height: "100%", width: "25%", paddingTop: 10}}>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  paddingRight: 10,
                  justifyContent: "flex-start",
                }}
              >
                {item.type !== "custom" ? (
                  <Image
                    source={
                      item.images
                        ? {uri: item.images}
                        : item.icon
                        ? {uri: item.icon}
                        : default_image
                    }
                    style={{
                      height: 75,
                      width: 75,
                      resizeMode: "cover",
                      borderRadius: 5,
                    }}
                  />
                ) : (
                  <FunIcon
                    icon={item.icon ? item.icon : "i-tour"}
                    height={50}
                    width={50}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={{height: "100%", width: "70%", paddingTop: 10}}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingHorizontal: 10,
                }}
              >
                <TouchableOpacity>
                  {item.time ? (
                    <GetStartTime startt={item.time} />
                  ) : (
                    <Text>00:00</Text>
                  )}
                </TouchableOpacity>
                <Text> - </Text>
                <TouchableOpacity>
                  {item.duration ? (
                    <GetEndTime
                      startt={item.time ? item.time : "00:00"}
                      dur={item.duration ? item.duration : "00:00"}
                    />
                  ) : (
                    <Text>00:00</Text>
                  )}
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{width: "100%", paddingHorizontal: 10}}>
                <Text
                  size="label"
                  type="bold"
                  style={{
                    width: Dimensions.get("screen").width * 0.6,
                  }}
                >
                  {item.name ? item.name : item.title ? item.title : "-"}
                </Text>
                {item.note ? (
                  <View>
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginVertical: 5,
                        width: Dimensions.get("screen").width * 0.55,

                        textAlign: "justify",
                      }}
                    >
                      {item.note}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
              <View style={{paddingHorizontal: 10}}>
                {item.note ? (
                  <TouchableOpacity
                    onPress={() => bukaModal(item.note, index)}
                    style={{flexDirection: "row", alignItems: "center"}}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 5,
                        marginVertical: 5,

                        color: "#209fae",
                      }}
                    >
                      {t("EditNotes")}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => bukaModal(null, index)}
                    style={{flexDirection: "row", alignItems: "center"}}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 5,
                        marginVertical: 5,

                        color: "#209fae",
                      }}
                    >
                      {t("addNotes")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
          <View
            style={{
              width: "100%",
              borderStyle: "dashed",
              borderRadius: 1,
              borderWidth: 1,
              borderColor: "#f3f3f3",
            }}
          ></View>
        </View>
      );
    }
  };

  const addHere = (index) => {
    var inputan = {...dataInput};
    let jam = jammax.split(":");
    let jambaru = inputan.duration.split(":");

    var lastTime =
      datatimeline.length > 0
        ? datatimeline[datatimeline.length - 1].time
        : "06:00:00";
    let splitlastTime = lastTime.split(":");

    let lastDuration =
      datatimeline.length > 0
        ? datatimeline[datatimeline.length - 1].duration
        : "01:00:00";
    let splitlastDuration = lastDuration.split(":");

    let jumlah =
      parseFloat(splitlastTime[0]) +
      parseFloat(splitlastDuration[0]) +
      parseFloat(jambaru[0]);

    console.log("jumlah", jumlah);

    if (jumlah <= 23) {
      inputan["stat"] = "new";
      inputan["type"] = "custom";
      inputan["name"] = inputan["title"];
      inputan["status"] = false;

      var tempdata = [...datatimeline];
      tempdata.splice(index, 0, inputan);

      var x = 0;
      var order = 1;
      for (var y in tempdata) {
        tempdata[y].order = order;
        if (tempdata[y].stat && tempdata[y].stat === "new") {
          var z = [...dataAkhir];

          z.push(order);
          setData(z);
        }

        if (tempdata[y - 1]) {
          console.log("TempData", tempdata[y - 1]);

          if (tempdata[y - 1].detail_flight) {
            // longitude & latitude index sebelum custom
            var LongBefore = tempdata[y - 1].detail_flight.longitude_arrival;
            var LatBefore = tempdata[y - 1].detail_flight.latitude_arrival;
          } else {
            var LongBefore = tempdata[y - 1].longitude;
            var LatBefore = tempdata[y - 1].latitude;
          }

          if (tempdata[y].detail_flight) {
            var LongCurrent = tempdata[y].detail_flight.longitude_departure;
            var LatCurrent = tempdata[y].detail_flight.latitude_departure;
          } else {
            // longitude & latitude index custom
            var LongCurrent = tempdata[y].longitude;
            var LatCurrent = tempdata[y].latitude;
          }

          // kondisi jika lokasi yang sama dan aktivitas berbeda
          if (LongBefore == LongCurrent || LatBefore == LatCurrent) {
            var newtime = tempdata[y - 1].time;
          } else {
            let jarak = Distance({
              lat1: LatBefore,
              lon1: LongBefore,
              lat2: LatCurrent,
              lon2: LongCurrent,
              unit: "km",
            });
            // rumus hitung waktu
            let waktutemp = jarak / 50;
            let waktu = parseFloat(waktutemp).toFixed(2);
            // pecah hasil waktu
            let split = waktu.split(".");

            var jamtemp = "";
            let menittemp = "";

            if (split[0] > 1) {
              jamtemp = split[1];
              if (split[1] > 0 && split[1] < 60) {
                menittemp = split[1];
              } else {
                jamtemp = split[0] + 1;
                menittemp = split[1] - 60;
              }
            } else {
              if (waktu > 0.6) {
                jamtemp = 1;
                menittemp = split[1] > 60 ? split[1] - 60 : split[1];
              } else {
                jamtemp = 0;
                menittemp = split[1] ? split[1] : 1;
              }
            }

            console.log("jamtemp", jamtemp);

            let time = tempdata[y - 1].time;
            let splittime = time.split(":");
            // let durasitemp = `${jamtemp}:${menittemp}`;
            let durationold = tempdata[y - 1].duration;
            let splitdurations = durationold.split(":");

            //menit total untuk mendapatkan menit yang lebih dari 59
            let menitotal =
              parseFloat(splittime[1]) +
              parseFloat(splitdurations[1]) +
              parseFloat(menittemp);

            let newjam = parseFloat(jamtemp) + parseFloat(splittime[0]);
            let newmenit = parseFloat(menittemp) + parseFloat(splittime[1]);

            var newtime =
              menitotal > 59
                ? `${newjam + 1}:${newmenit - 60}`
                : `${newjam}:${newmenit}`;
          }

          tempdata[y].time = hitungDuration({
            startt: newtime,
            dur: tempdata[y - 1].duration,
          });
        }
        x++;
        order++;
      }
      if (jamtemp > 23) {
        Alert.alert("Opss", t("AktivitasFull"), [
          {
            text: "OK",
            onPress: () => {
              setDatatimeline(props.route.params.datatimeline),
                props.navigation.goBack();
            },
          },
        ]);
      } else {
        if ((x = tempdata.length)) {
          setDatatimeline(tempdata);
        }
      }

      setjammax(jumlah + ":00:00");
    } else {
      Alert.alert("Opss", t("AktivitasFull"), [
        {
          text: "OK",
          onPress: () => {
            setDatatimeline(props.route.params.datatimeline),
              props.navigation.goBack();
          },
        },
      ]);
    }
  };

  const hitungDuration = ({startt, dur}) => {
    var duration = dur ? dur.split(":") : "00:00:00";
    var starttime = startt ? startt.split(":") : "06:00:00";

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);
    // if (jam > 23) {
    // 	jam = 24 - jam;
    // }
    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = menit - 60;
    }

    return (
      (jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam) +
      ":" +
      (menit < 10 ? "0" + menit : menit) +
      ":00"
    );
  };

  const [
    mutationSaved,
    {loading: loadingSaved, data: dataSaved, error: errorSaved},
  ] = useMutation(SaveCustom, {
    context: {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",

        Authorization: token,
      },
    },
  });

  const [
    mutationSaved2,
    {loading: loadingSaved2, data: dataSaved2, error: errorSaved2},
  ] = useMutation(SaveCustom2, {
    context: {
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",

        Authorization: token,
      },
    },
  });

  const [
    mutationSaveTimeline,
    {loading: loadingSave, data: dataSave, error: errorSave},
  ] = useMutation(UpdateTimeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const saveToItinerary = async () => {
    setLoading(true);
    if (dataAkhir.length < 1) {
      setLoading(false);

      Alert.alert("Please Choose position");
      return false;
    } else {
      var datas = [];
      datas.push(idDay);

      try {
        if (props.route?.params?.file && props.route?.params?.file.length > 0) {
          let response = await mutationSaved({
            variables: {
              day_id: datas,
              title: dataInput.title,
              icon: "i-tour",
              qty: "1",
              address: dataInput.address,
              latitude: dataInput.latitude,
              longitude: dataInput.longitude,
              note: " ",
              time: dataInput.time,
              duration: dataInput.duration,
              status: false,
              order: dataAkhir,
              total_price: "0",
              file: props.route?.params?.file,
            },
          });

          if (loadingSaved || loadingSaved2) {
            Alert.alert("Loading!!");
          }
          if (errorSaved || errorSaved2) {
            throw new Error("Error Input");
          }
          if (response.data) {
            if (response.data.add_custom_withattach.code !== 200) {
              setLoading(false);

              throw new Error(response.data.add_custom_withattach.message);
            } else {
              var tempdatas = [...datatimeline];
              var jum = 0;
              for (var i of response.data.add_custom_withattach.data) {
                var inde = tempdatas.findIndex(
                  (k) => k["order"] === parseInt(i.order)
                );
                tempdatas[inde].id = i.id;
                jum++;
              }

              if (jum === response.data.add_custom_withattach.data.length) {
                setDatatimeline(tempdatas);
                try {
                  let responsed = await mutationSaveTimeline({
                    variables: {
                      idday: idDay,
                      value: JSON.stringify(tempdatas),
                    },
                  });
                  if (loadingSave) {
                    Alert.alert("Loading!!");
                  }
                  if (errorSave) {
                    throw new Error("Error Input");
                  }

                  if (responsed.data) {
                    if (responsed.data.update_timeline.code !== 200) {
                      throw new Error(responsed.data.update_timeline.message);
                    }

                    props.navigation.dispatch(
                      StackActions.replace("ItineraryStack", {
                        screen: "itindetail",
                        params: {
                          itintitle: props?.route?.params?.itintitle,
                          country: props?.route?.params?.idItin,
                          token: props?.route?.params?.token,
                          dateitin: props?.route?.params?.dateitin,
                          datadayaktif: props?.route?.params?.datadayaktif,
                          status: "edit",
                        },
                      })
                    );
                  }
                  setLoading(false);
                } catch (error) {
                  setLoading(false);

                  Alert.alert("" + error);
                }
              }
            }
          }
        } else {
          let response = await mutationSaved2({
            variables: {
              day_id: datas,
              title: dataInput.title,
              icon: "i-tour",
              qty: "1",
              address: dataInput.address,
              latitude: dataInput.latitude,
              longitude: dataInput.longitude,
              note: " ",
              time: dataInput.time,
              duration: dataInput.duration,
              status: false,
              order: dataAkhir,
              total_price: "0",
              // file: props.route?.params?.file,
            },
          });

          if (loadingSaved || loadingSaved2) {
            Alert.alert("Loading!!");
          }
          if (errorSaved || errorSaved2) {
            throw new Error("Error Input");
          }

          if (response.data) {
            if (response.data.add_custom.code !== 200) {
              setLoading(false);

              throw new Error(response.data.add_custom.message);
            } else {
              var tempdatas = [...datatimeline];
              var jum = 0;
              for (var i of response.data.add_custom.data) {
                var inde = tempdatas.findIndex(
                  (k) => k["order"] === parseInt(i.order)
                );
                tempdatas[inde].id = i.id;
                jum++;
              }

              if (jum === response.data.add_custom.data.length) {
                setDatatimeline(tempdatas);
                try {
                  let responsed = await mutationSaveTimeline({
                    variables: {
                      idday: idDay,
                      value: JSON.stringify(tempdatas),
                    },
                  });
                  if (loadingSave) {
                    Alert.alert("Loading!!");
                  }
                  if (errorSave) {
                    throw new Error("Error Input");
                  }

                  if (responsed.data) {
                    if (responsed.data.update_timeline.code !== 200) {
                      throw new Error(responsed.data.update_timeline.message);
                    }

                    props.navigation.dispatch(
                      StackActions.replace("ItineraryStack", {
                        screen: "itindetail",
                        params: {
                          itintitle: props?.route?.params?.itintitle,
                          country: props?.route?.params?.idItin,
                          token: props?.route?.params?.token,
                          dateitin: props?.route?.params?.dateitin,
                          datadayaktif: props?.route?.params?.datadayaktif,
                          status: "edit",
                        },
                      })
                    );
                  }
                  setLoading(false);
                } catch (error) {
                  setLoading(false);

                  Alert.alert("" + error);
                }
              }
            }
          }
        }
      } catch (error) {
        console.log(error);

        setLoading(false);

        Alert.alert("" + error);
      }
    }
  };

  // console.log(datatimeline);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      }}
    >
      <Loading show={loading} />

      <View
        style={{
          top: 0,
          left: 0,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").width * 0.3,
          backgroundColor: "#f3f3f3",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {/* garis .................................. */}
          <View
            style={{
              marginTop: -35,
              width: Dimensions.get("screen").width - 140,
              borderTopColor: "#209fae",
              borderTopWidth: 0.5,
            }}
          ></View>
          {/* garis .................................. */}

          <View
            style={{
              position: "absolute",
              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{alignContent: "center", alignItems: "center"}}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#209fae",
                  backgroundColor: "#209fae",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <CheckWhite />
              </View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,

                  color: "#209fae",
                }}
              >
                {t("addCustomActivity")}
              </Text>
            </View>
            <View style={{alignContent: "center", alignItems: "center"}}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,
                  borderColor: "#209fae",
                  backgroundColor: "#209fae",

                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <CheckWhite />
              </View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,

                  color: "#209fae",
                }}
              >
                {t("inputdestinationdetail")}
              </Text>
            </View>
            <View style={{alignContent: "center", alignItems: "center"}}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  borderWidth: 0.5,

                  borderColor: "#209fae",
                  backgroundColor: "#209fae",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{
                    // fontFamily: 'Lato-Regular',
                    // color: '#646464',
                    color: "white",
                  }}
                >
                  3
                </Text>
              </View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginTop: 5,
                  textAlign: "center",
                  width: 100,

                  color: "#209fae",
                }}
              >
                {t("selectitinerary")}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            width: Dimensions.get("screen").width,
            paddingHorizontal: 20,
            paddingTop: 20,
          }}
        >
          <Text
            size="title"
            type="bold"
            style={{
              width: Dimensions.get("screen").width * 0.5,
            }}
          >
            {t("selectitinerary")}
          </Text>
        </View>
        <View style={{width: Dimensions.get("screen").width, padding: 20}}>
          {datatimeline.length > 0 ? (
            datatimeline.map((item, index) => {
              if (props.route.params.dataParent) {
                return props.route.params.dataParent.id === item.id ||
                  props.route.params.dataParent.id === item.parent_id ||
                  item.stat === "new" ? (
                  <View>
                    {/* {(index !== 0 && !item.stat) ||
                    (item.stat && item.stat !== "new") ? (
                      datatimeline[index - 1] &&
                      datatimeline[index - 1].stat &&
                      datatimeline[index - 1].stat === "new" ? null : (
                        <View>
                          <TouchableOpacity
                            onPress={() => addHere(index)}
                            style={{
                              marginVertical: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              paddingVertical: 10,
                              // borderBottomWidth: 1,
                            }}
                          >
                            <View
                              style={{
                                height: 40,
                                width: 40,
                                backgroundColor: "#f3f3f3",
                                borderRadius: 5,
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                size="small"
                                type="regular"
                                style={{
                                  fontFamily: "Lato-Regular",
                                  fontSize: 30,
                                }}
                              >
                                +
                              </Text>
                            </View>
                            <Text
                              // size='small'
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                // fontSize: 30,
                                marginLeft: 10,
                              }}
                            >
                              {t("addHere")}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              width: "100%",
                              borderStyle: "dashed",
                              borderRadius: 1,
                              borderWidth: 1,
                              borderColor: "#f3f3f3",
                            }}
                          ></View>
                        </View>
                      )
                    ) : null} */}
                    <RenderItinerary key={item.id} item={item} index={index} />
                    {(!item.stat && !datatimeline[index + 1]?.stat) ||
                    (item.stat && item.stat !== "new") ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => addHere(index + 1)}
                          style={{
                            marginVertical: 5,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            paddingVertical: 10,
                            // borderBottomWidth: 1,
                          }}
                        >
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              backgroundColor: "#f3f3f3",
                              borderRadius: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              size="h4"
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                fontSize: 30,
                              }}
                            >
                              +
                            </Text>
                          </View>
                          <Text
                            // size='h4'
                            type="regular"
                            style={{
                              // fontFamily: 'Lato-Regular',
                              // fontSize: 30,
                              marginLeft: 10,
                            }}
                          >
                            {t("addHere")}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: "100%",
                            borderStyle: "dashed",
                            borderRadius: 1,
                            borderWidth: 1,
                            borderColor: "#f3f3f3",
                          }}
                        ></View>
                      </View>
                    ) : null}
                  </View>
                ) : null;
              } else {
                return (
                  <View>
                    {(index !== 0 && !item.stat) ||
                    (item.stat && item.stat !== "new") ? (
                      datatimeline[index - 1] &&
                      datatimeline[index - 1].stat &&
                      datatimeline[index - 1].stat === "new" ? null : (
                        <View>
                          <TouchableOpacity
                            onPress={() => addHere(index)}
                            style={{
                              marginVertical: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                              flexDirection: "row",
                              paddingVertical: 10,
                              // borderBottomWidth: 1,
                            }}
                          >
                            <View
                              style={{
                                height: 40,
                                width: 40,
                                backgroundColor: "#f3f3f3",
                                borderRadius: 5,
                                alignContent: "center",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                size="small"
                                type="regular"
                                style={{
                                  fontFamily: "Lato-Regular",
                                  fontSize: 30,
                                }}
                              >
                                +
                              </Text>
                            </View>
                            <Text
                              // size='small'
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                // fontSize: 30,
                                marginLeft: 10,
                              }}
                            >
                              {t("addHere")}
                            </Text>
                          </TouchableOpacity>
                          <View
                            style={{
                              width: "100%",
                              borderStyle: "dashed",
                              borderRadius: 1,
                              borderWidth: 1,
                              borderColor: "#f3f3f3",
                            }}
                          ></View>
                        </View>
                      )
                    ) : null}
                    <RenderItinerary key={item.id} item={item} index={index} />
                    {index === datatimeline.length - 1 &&
                    (!item.stat || (item.stat && item.stat !== "new")) ? (
                      <View>
                        <TouchableOpacity
                          onPress={() => addHere(index + 1)}
                          style={{
                            marginVertical: 5,
                            alignContent: "center",
                            alignItems: "center",
                            justifyContent: "center",
                            flexDirection: "row",
                            paddingVertical: 10,
                            // borderBottomWidth: 1,
                          }}
                        >
                          <View
                            style={{
                              height: 40,
                              width: 40,
                              backgroundColor: "#f3f3f3",
                              borderRadius: 5,
                              alignContent: "center",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Text
                              size="h4"
                              type="regular"
                              style={{
                                // fontFamily: 'Lato-Regular',
                                fontSize: 30,
                              }}
                            >
                              +
                            </Text>
                          </View>
                          <Text
                            // size='h4'
                            type="regular"
                            style={{
                              // fontFamily: 'Lato-Regular',
                              // fontSize: 30,
                              marginLeft: 10,
                            }}
                          >
                            {t("addHere")}
                          </Text>
                        </TouchableOpacity>
                        <View
                          style={{
                            width: "100%",
                            borderStyle: "dashed",
                            borderRadius: 1,
                            borderWidth: 1,
                            borderColor: "#f3f3f3",
                          }}
                        ></View>
                      </View>
                    ) : null}
                  </View>
                );
              }
            })
          ) : (
            <View>
              <TouchableOpacity
                onPress={() => addHere(0)}
                style={{
                  marginVertical: 5,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  paddingVertical: 10,
                  // borderBottomWidth: 1,
                }}
              >
                <View
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: "#f3f3f3",
                    borderRadius: 5,
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    size="h4"
                    type="regular"
                    style={
                      {
                        // fontFamily: 'Lato-Regular',
                        // fontSize: 30,
                      }
                    }
                  >
                    +
                  </Text>
                </View>
                <Text
                  // size='h4'
                  type="regular"
                  style={{
                    // fontFamily: 'Lato-Regular',
                    // fontSize: 30,
                    marginLeft: 10,
                  }}
                >
                  {t("addHere")}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  width: "100%",
                  borderStyle: "dashed",
                  borderRadius: 1,
                  borderWidth: 1,
                  borderColor: "#f3f3f3",
                }}
              ></View>
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: "#f3f3f3",
        }}
      >
        <View
          style={{
            height: 60,
            width: Dimensions.get("screen").width,
            marginBottom: Platform.OS === "ios" && Notch ? 10 : 0,
            alignContent: "center",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderTopWidth: 1,
            borderTopColor: "#f3f3f3",
            backgroundColor: "white",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.dispatch(
                StackActions.replace("ItineraryStack", {
                  screen: "itindetail",
                  params: {
                    itintitle: props?.route?.params?.itintitle,
                    country: props?.route?.params?.idItin,
                    token: props?.route?.params?.token,
                    dateitin: props?.route?.params?.dateitin,
                    datadayaktif: props?.route?.params?.datadayaktif,
                    status: "edit",
                  },
                })
              );
            }}
            style={{
              height: 40,
              width: Dimensions.get("screen").width * 0.2,
              backgroundColor: "white",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{
                color: "#D75995",
              }}
            >
              {t("cancel")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              saveToItinerary();
            }}
            style={{
              height: 40,
              width: Dimensions.get("screen").width * 0.6,
              backgroundColor: "#209fae",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <Text size="label" type="regular" style={{color: "white"}}>
              {t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        onBackdropPress={() => {
          setModal(false);
        }}
        onRequestClose={() => {
          setModal(false);
        }}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modal}
        style={{
          // backgroundColor: 'rgba(0, 0, 0, 0.25)',
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              paddingHorizontal: 20,
              backgroundColor: "#f6f6f6",
              borderBottomColor: "#d1d1d1",
              borderBottomWidth: 1,
              justifyContent: "center",
            }}
          >
            <Text
              size="title"
              type="bold"
              style={{marginTop: 13, marginBottom: 15}}
            >
              {t("EditNotes")}
            </Text>
            <Pressable
              onPress={() => setModal(false)}
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
              marginVertical: 20,
            }}
          >
            <Textarea
              style={{
                width: Dimensions.get("screen").width - 140,
                marginVertical: 20,
                borderRadius: 5,
                fontFamily: "Lato-Regular",
                backgroundColor: "#f6f6f6",
                alignSelf: "center",
              }}
              rowSpan={5}
              placeholder={t("inputNotes")}
              value={textinput}
              bordered
              maxLength={160}
              onChangeText={(text) => setInput(text)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingHorizontal: 15,
              marginBottom: 20,
            }}
          >
            <Button
              onPress={() => setModal(false)}
              size="medium"
              color="transparant"
              text={t("cancel")}
            ></Button>
            <Button
              onPress={() => saveNotes()}
              style={{
                marginLeft: 10,
              }}
              color="primary"
              text={t("submit")}
            ></Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
