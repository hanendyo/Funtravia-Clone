import React, { useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  Dimensions,
  Image,
  Alert,
  Picker,
} from "react-native";
// import { Modal, Portal, Provider } from 'react-native-paper';
import Modal from "react-native-modal";
import {
  Motor,
  Mobil,
  Jalan,
  Pencilgreen,
  Xhitam,
  Bottom,
  OptionsVertBlack,
} from "../../../assets/svg";
import DraggableFlatList from "react-native-draggable-flatlist";
import { FlatList } from "react-native-gesture-handler";
import { Capital, FunIcon, Truncate } from "../../../component";
import { Textarea } from "native-base";
import { Button } from "../../../component";
import { Text } from "../../../component";
import {
  dateFormatMDY,
  dateFormatHari,
} from "../../../component/src/dateformatter";
import moment from "moment";
import DeleteActivity from "../../../graphQL/Mutation/Itinerary/DeleteActivity";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import UpdateCover from "../../../graphQL/Mutation/Itinerary/Updatecover";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

export default function ItinDrag({
  idDay,
  data,
  props,
  setAkhir,
  setKota,
  setidDayz,
  token,
  iditinerary,
  setloading,
  refresh,
  GetTimeline,
  datadayaktif,
  setdatadayaktif,
  status,
  setCover,
  cover,
}) {
  const { t, i18n } = useTranslation();

  let [modal, setModal] = useState(false);
  let [modaldate, setModaldate] = useState(false);
  let [modalmenu, setModalmenu] = useState(false);
  let [dataList, setDataList] = useState([...data]);
  let [startTime, setStarTime] = useState(dataList[0].time);
  let [textinput, setInput] = useState("");
  let [indexinput, setIndexInput] = useState("");
  let [positiondate, setPositiondate] = useState("");
  const [dataweather, setData] = useState({});
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
  let [jamer, setjamer] = useState("00");
  let [menor, setmenor] = useState("00");
  let [idactivity, setidactivity] = useState("");
  let [types, settypes] = useState("");

  const _fetchItem = async (kota, lat, long) => {
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
        setData(responseJson);
      } else {
        let response = await fetch(
          "https://api.openweathermap.org/data/2.5/weather?q=" +
            kota.toLowerCase() +
            "&appid=366be4c20ca623155ffc0175772909bf"
        );
        let responseJson = await response.json();
        setData(responseJson);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [
    mutationDeleteActivity,
    {
      loading: Loadingdeleteactivity,
      data: datadeleteactivity,
      error: errordeleteactivity,
    },
  ] = useMutation(DeleteActivity, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const [
    mutationUpdateCover,
    { loading: loadingcover, data: datacover, error: errorcover },
  ] = useMutation(UpdateCover, {
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

  useEffect(() => {}, []);

  const jams = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
  ];
  const menits = [
    "00",
    "05",
    "15",
    "20",
    "25",
    "30",
    "35",
    "40",
    "45",
    "50",
    "59",
  ];

  const jarak = [
    {
      type: "car",
      hour: "2",
      minutes: "5",
    },
    {
      type: "motorcycle",
      hour: "2",
      minutes: "5",
    },
    {
      type: "walk",
      hour: "2",
      minutes: "5",
    },
  ];

  const getjarakgoogle = (dataAll, index) => {
    return (
      <FlatList
        key={""}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        data={jarak}
        contentContainerStyle={{}}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                marginRight: 5,
                borderColor: "#d1d1d1",
                borderRadius: 20,
                borderWidth: 1,
                flexDirection: "row",
                paddingHorizontal: 10,
                paddingVertical: 5,
                alignItems: "center",
              }}
            >
              {item.type == "car" ? <Mobil height={15} width={15} /> : null}
              {item.type == "motorcycle" ? (
                <Motor height={15} width={15} />
              ) : null}
              {item.type == "walk" ? <Jalan height={15} width={15} /> : null}
              <Text
                size="small"
                type="regular"
                style={{
                  marginLeft: 10,
                }}
              >
                {item.hour} jam {item.minutes} menit
              </Text>
            </View>
          );
        }}
      ></FlatList>
    );
  };

  const handledrag = async (data, from, to) => {
    data[0].time = startTime;
    var x = 0;
    var order = 1;
    for (var y in data) {
      data[y].order = order;

      if (data[y - 1]) {
        data[y].time = hitungDuration({
          startt: data[y - 1].time,
          dur: data[y - 1].duration,
        });
      }
      x++;
      order++;
    }

    if ((x = data.length)) {
      await setAkhir(data);
      await setDataList(data);
      await setidDayz(idDay);
      if (cover === null) {
        await Updatecovers(data[0].images ? data[0].images : null);
      }
    }
  };

  const saveNotes = () => {
    var tempData = [...dataList];
    tempData[indexinput].note = textinput;
    setDataList(tempData);
    setAkhir(tempData);
    setModal(false);
    setidDayz(idDay);
  };

  const bukaModal = (text = null, index) => {
    if (text) {
      setInput(text);
    } else {
      setInput("");
    }
    setIndexInput(index);
    setModal(true);
  };

  const openModaldate = async (position, index, starts, durati) => {
    if (position === "start") {
      var starttime = starts.split(":");
      setjamer(starttime[0]);
      setmenor(starttime[1]);
    } else {
      var duration = durati.split(":");
      var starttime = starts.split(":");

      var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

      var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
      if (menit > 59) {
        menit = menit - 60;
      }

      setjamer(jam < 10 ? "0" + (jam < 0 ? 0 : jam) : "" + jam);
      setmenor(menit < 10 ? "0" + menit : "" + menit);
    }

    await setPositiondate(position);
    await setModaldate(true);
    await setIndexInput(index);
  };

  const caridurasi = (startt, end) => {
    var endtmine = end ? end.split(":") : "00:00:00".split(":");
    var starttime = startt ? startt.split(":") : "00:00:00".split(":");

    var jam = parseFloat(endtmine[0]) - parseFloat(starttime[0]);

    var menit = parseFloat(endtmine[1]) - parseFloat(starttime[1]);
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

  const setTime = (timeselected, nn) => {
    let datas = [...nn];
    let awal = datas[indexinput].duration;

    if (positiondate == "start") {
      datas[indexinput].time = timeselected;

      if (datas[parseFloat(indexinput) - 1]) {
        let timesebelum = hitungDuration({
          startt: datas[parseFloat(indexinput) - 1].time,
          dur: datas[parseFloat(indexinput) - 1].duration,
        });

        let timestartsebelum = datas[parseFloat(indexinput) - 1].time.split(
          ":"
        );
        timesebelum = timesebelum.split(":");
        let bandingan = timeselected.split(":");

        timestartsebelum = parseFloat(timestartsebelum[0]);
        let jamsebelum = parseFloat(timesebelum[0]);
        let jamsesesudah = parseFloat(bandingan[0]);

        if (jamsesesudah > timestartsebelum) {
          let a = caridurasi(
            datas[parseFloat(indexinput) - 1].time,
            timeselected
          );
          datas[parseFloat(indexinput) - 1].duration = a;
        } else {
          datas[indexinput].time = hitungDuration({
            startt: datas[parseFloat(indexinput) - 1].time,
            dur: datas[parseFloat(indexinput) - 1].duration,
          });
        }
      }

      var x = 0;
      var order = 1;
      for (var y in datas) {
        datas[y].order = order;

        if (datas[y - 1] && y > indexinput) {
          datas[y].time = hitungDuration({
            startt: datas[y - 1].time,
            dur: datas[y - 1].duration,
          });
        }
        x++;
        order++;
      }
    } else {
      var starttime = datas[indexinput].time
        ? datas[indexinput].time.split(":")
        : "00:00".split(":");
      var endtime = timeselected.split(":");

      var jam = parseFloat(endtime[0]) - parseFloat(starttime[0]);

      var menit = parseFloat(endtime[1]) + 60 - parseFloat(starttime[1]);
      if (menit > 59) {
        menit = menit - 60;
      }

      var jamakhir = jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam;
      var menitakhir = menit < 10 ? "0" + menit : menit;

      datas[indexinput].duration = jamakhir + ":" + menitakhir + ":00";

      var x = 0;
      var order = 1;
      for (var y in datas) {
        if (datas[y - 1]) {
          datas[y].order = order;

          datas[y].time = hitungDuration({
            startt: datas[y - 1].time,
            dur: datas[y - 1].duration,
          });
        }
        x++;
        order++;
      }
    }

    let sum = datas.reduce(
      (itinerary, item) => itinerary.add(moment.duration(item.duration)),
      moment.duration()
    );

    let jampert = datas[0].time.split(":");
    let jampertama = parseFloat(jampert[0]);
    let menitpertama = parseFloat(jampert[1]);
    let durjam = Math.floor(sum.asHours());
    let durmin = sum.minutes();
    let hasiljam = jampertama + durjam;
    let hasilmenit = menitpertama + durmin;

    if (hasiljam <= 23) {
      let dataday = { ...datadayaktif };
      // setdatadayaktif

      if (hasiljam === 23 && hasilmenit <= 59) {
        setAkhir(datas);
        setDataList(datas);
        setidDayz(idDay);
        setPositiondate("");
        setModaldate(false);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        setdatadayaktif(dataday);
      } else if (hasiljam < 23) {
        setAkhir(datas);
        setDataList(datas);
        setidDayz(idDay);
        setPositiondate("");
        setModaldate(false);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        setdatadayaktif(dataday);
      } else {
        datas[indexinput].duration = awal;

        var x = 0;
        var order = 1;
        for (var y in datas) {
          if (datas[y - 1]) {
            datas[y].order = order;

            datas[y].time = hitungDuration({
              startt: datas[y - 1].time,
              dur: datas[y - 1].duration,
            });
          }
          x++;
          order++;
        }

        setidDayz(idDay);

        Alert.alert("Waktu sudah melewati batas maksimal");
      }
    } else {
      datas[indexinput].duration = awal;

      var x = 0;
      var order = 1;
      for (var y in datas) {
        if (datas[y - 1]) {
          datas[y].order = order;

          datas[y].time = hitungDuration({
            startt: datas[y - 1].time,
            dur: datas[y - 1].duration,
          });
        }
        x++;
        order++;
      }

      setidDayz(idDay);

      Alert.alert("Waktu sudah melewati batas maksimal");
    }
  };

  const GetEndTime = ({ startt, dur }) => {
    var duration = dur.split(":");
    var starttime = startt.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = menit - 60;
    }

    return (
      <Text size="description" type="regular" style={{}}>
        {jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam}:
        {menit < 10 ? "0" + menit : menit}
      </Text>
    );
  };

  const hitungDuration = ({ startt, dur }) => {
    var duration = dur ? dur.split(":") : "00:00:00";
    var starttime = startt ? startt.split(":") : "00:00:00";

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

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

  const GetStartTime = ({ startt }) => {
    var starttime = startt.split(":");

    return (
      <Text size="description" type="regular" style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
  };

  const bukamodalmenu = async (id, type) => {
    await setidactivity(id);
    await settypes(type);
    await setModalmenu(true);
  };

  const renderItem = ({ item, index, drag, isActive }) => {
    const x = dataList.length - 1;
    return (
      <View
        style={{
          // height: item.note ? 210 : 170,
          width: "100%",
          backgroundColor: isActive ? "white" : "#f6f6f6",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          shadowColor: "#d3d3d3",
          shadowOffset: isActive ? { width: 2, height: 2 } : {},
          shadowOpacity: isActive ? 1 : 0,
          shadowRadius: isActive ? 2 : 0,
          elevation: isActive ? 5 : 0,
        }}
      >
        <View
          style={{
            height: "100%",
            width: "20%",
            alignContent: "flex-end",
            alignItems: "flex-end",
            // paddingTop: 10,
            // paddingRight: 10,
          }}
        >
          {/* garis======================= */}

          <View
            style={{
              height: "100%",
              width: "100%",
              position: "absolute",
              // borderWidth: 1,
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <View
              style={{
                height: 34,
                marginRight: 4.2,
                borderBottomWidth: 1,
                borderRightWidth: index && index > 0 ? 1 : 0,
                borderRightColor: "#464646",
              }}
            ></View>
            <View
              style={{
                marginTop: -20,
                flexDirection: "row",
                position: "absolute",
                top: 34,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99,
              }}
            >
              <View
                style={{
                  // width: "100%",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  backgroundColor: "#daf0f2",
                  borderRadius: 5,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    status == "notsaved"
                      ? openModaldate(
                          "start",
                          index,
                          item.time ? item.time : "00:00:00",
                          "00:00:00"
                        )
                      : null
                  }
                >
                  {item.time ? (
                    <GetStartTime startt={item.time} />
                  ) : (
                    <Text size="description" type="regular">
                      00:00
                    </Text>
                  )}
                </TouchableOpacity>
                {/* <Text size="description" type="regular">
              {" "}
              -{" "}
            </Text> */}
                <TouchableOpacity
                  onPress={() => {
                    status == "notsaved"
                      ? openModaldate(
                          "end",
                          index,
                          item.time ? item.time : "00:00:00",
                          item.duration ? item.duration : "00:00:00"
                        )
                      : null;
                  }}
                >
                  {item.duration ? (
                    <GetEndTime
                      startt={item.time ? item.time : "00:00"}
                      dur={item.duration ? item.duration : "00:00"}
                    />
                  ) : (
                    <Text size="description" type="regular">
                      00:00
                    </Text>
                  )}
                </TouchableOpacity>
              </View>

              <View
                style={{
                  zIndex: 99,
                  height: 10,
                  width: 10,
                  marginLeft: 5,
                  borderRadius: 10,
                  backgroundColor: "#209fae",
                }}
              ></View>
            </View>

            <View
              style={{
                flex: 1,
                marginRight: 4.2,
                borderTopWidth: 1,
                borderRightWidth: index < x ? 1 : 0,
                borderRightColor: "#464646",
              }}
            ></View>
          </View>

          {/* garis======================= */}
        </View>
        {/* <TouchableOpacity
          onLongPress={status == "notsaved" ? drag : null}
          style={{
            height: "100%",
            width: "30%",
            alignItems: "flex-end",
            paddingTop: 10,
            paddingRight: 10,
          }}
        >
          {item.type !== "custom" ? (
            <Image
              source={item.images ? { uri: item.images } : { uri: item.icon }}
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
          )}
        </TouchableOpacity> */}

        <View
          style={{
            height: "100%",
            width: "80%",
            paddingTop: 12.5,
          }}
        >
          <View
            style={{
              borderRadius: 5,
              marginBottom: 2,
              marginLeft: 10,
              marginRight: 2,
              backgroundColor: "#fff",
              elevation: 3,
              padding: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              {item.type !== "custom" ? (
                <Image
                  source={
                    item.images ? { uri: item.images } : { uri: item.icon }
                  }
                  style={{
                    height: 30,
                    width: 30,
                    resizeMode: "cover",
                    borderRadius: 15,
                  }}
                />
              ) : item.icon ? (
                <FunIcon
                  icon={item.icon}
                  height={30}
                  width={30}
                  style={{
                    borderRadius: 15,
                  }}
                />
              ) : (
                <FunIcon
                  icon={"i-tour"}
                  height={30}
                  width={30}
                  style={{
                    borderRadius: 15,
                  }}
                />
              )}
              <TouchableOpacity
                style={{ width: "70%" }}
                onLongPress={status == "notsaved" ? drag : null}
              >
                <Text size="label" type="bold" style={{}}>
                  {item.name}
                </Text>
                <Text>{Capital({ text: item.type })}</Text>
              </TouchableOpacity>
              {status === "notsaved" ? (
                <Button
                  size="small"
                  text=""
                  type="circle"
                  variant="transparent"
                  style={{}}
                  onPress={() => {
                    bukamodalmenu(item.id, item.type);
                  }}
                >
                  <OptionsVertBlack width={15} height={15} />
                </Button>
              ) : null}
            </View>
            <TouchableOpacity
              onLongPress={drag}
              style={{ width: "100%", paddingHorizontal: 10 }}
            >
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
            <View style={{}}>
              {item.note ? (
                <TouchableOpacity
                  onPress={() => bukaModal(item.note, index)}
                  style={{ flexDirection: "row", alignItems: "center" }}
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
                  style={{ flexDirection: "row", alignItems: "center" }}
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
          {index < x &&
          dataList[index + 1] &&
          dataList[index].latitude !== dataList[index + 1].latitude &&
          dataList[index].longitude !== dataList[index + 1].longitude ? (
            <View
              style={{
                position: "relative",
                left: -5,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 10,
              }}
            >
              <View
                style={{
                  width: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#464646",
                }}
              ></View>
              <View style={{}}>
                {dataList[index + 1].latitude && dataList[index + 1].longitude
                  ? getjarakgoogle(dataList, index)
                  : null}
              </View>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const deleteactivity = async (iditinerarys, idactivitys, typess) => {
    setloading(true);
    try {
      let response = await mutationDeleteActivity({
        variables: {
          itinerary_id: iditinerarys,
          id_activity: idactivitys,
          type: typess,
        },
      });
      if (errordeleteactivity) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.delete_activity.code !== 200) {
          throw new Error(response.data.delete_activity.message);
        }

        var data = [...dataList];
        var inde = data.findIndex((k) => k["id"] === idactivitys);

        if (inde !== -1) {
          data.splice(inde, 1);

          var x = 0;
          var order = 1;
          for (var y in data) {
            data[y].order = order;

            if (data[y - 1]) {
              data[y].time = hitungDuration({
                startt: data[y - 1].time,
                dur: data[y - 1].duration,
              });
            }
            x++;
            order++;
          }

          if ((x = data.length)) {
            try {
              let response = await mutationSaveTimeline({
                variables: {
                  idday: idDay,
                  value: JSON.stringify(data),
                },
              });

              if (errorSave) {
                throw new Error("Error Input");
              }
              if (response.data) {
                if (response.data.update_timeline.code !== 200) {
                  throw new Error(response.data.update_timeline.message);
                }
                // GetTimeline();
                refresh();
              }
              setloading(false);
            } catch (error) {
              setloading(false);
              Alert.alert("" + error);
            }
          }
        }
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  const Updatecovers = async (url) => {
    setloading(true);
    try {
      let response = await mutationUpdateCover({
        variables: {
          itinerary_id: iditinerary,
          cover: url,
        },
      });

      if (errorcover) {
        throw new Error("Error Input");
      }
      if (response.data) {
        // console.log(data);
        if (response.data.update_cover_itinerary.code !== 200) {
          throw new Error(response.data.update_cover_itinerary.message);
        } else {
          refresh();
        }
        // GetTimeline();
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  {
    dataList.length > 0 && cover === null
      ? Updatecovers(
          dataList[0].images !== null ? dataList[0].images : dataList[0].icon
        )
      : setCover(cover);
  }

  const getcity = (data) => {
    var namakota = "";
    var hasil = "";
    for (var x of data) {
      if (x.city !== namakota && x.city !== null) {
        namakota = x.city;
        hasil += Capital({ text: namakota }) + " - ";
      }
    }
    return hasil.slice(0, -3);
  };

  return (
    <View
      style={{
        paddingHorizontal: 15,
      }}
    >
      <DraggableFlatList
        style={{
          height: Dimensions.get("screen").height - 200,
        }}
        key={""}
        ListHeaderComponent={
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 5,
              borderWidth: 0.5,
              borderTopColor: "#d3d3d3",
              borderBottomColor: "#d3d3d3",
              borderRightColor: "#d3d3d3",
              borderLeftColor: "#209fae",
              borderLeftWidth: 5,
              padding: 10,
              height: 60,
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              onLayout={() => {
                _fetchItem(
                  dataList[0].city,
                  dataList[0].latitude,
                  dataList[0].longitude
                );
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <Text type={"bold"} size="label">
                  {dateFormatHari(datadayaktif.date)}
                </Text>
                <View
                  style={{
                    marginTop: 3,
                    backgroundColor: "#464646",
                    borderRadius: 5,
                    width: 5,
                    height: 5,
                    marginHorizontal: 5,
                  }}
                ></View>
                <Text type={"bold"} size="label">
                  {dateFormatMDY(datadayaktif.date)}
                </Text>
              </View>
              <Text>
                <Truncate text={getcity(dataList)} length={35} />
              </Text>
            </View>
            {dataweather && dataweather.cod === 200 && dataweather.weather ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  justifyContent: "center",
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
                      icon={icons[dataweather.weather[0].icon]}
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
                        {(dataweather.main.temp / 10).toFixed(1)}
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
                    {dataweather.weather[0].description}
                  </Text>
                </View>

                {dataweather.main.temp / 10 > 27.2 ? (
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

                {dataweather.main.temp / 10 > 25.8 &&
                dataweather.main.temp / 10 < 27.3 ? (
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

                {dataweather.main.temp / 10 > 22.8 &&
                dataweather.main.temp / 10 < 25.9 ? (
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

                {dataweather.main.temp / 10 > 20.5 &&
                dataweather.main.temp / 10 < 22.9 ? (
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

                {dataweather.main.temp / 10 < 20.6 ? (
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
            ) : null}
          </View>
        }
        contentContainerStyle={{
          paddingTop: 10,
          paddingBottom:
            dataList.length > 1
              ? dataList.length > 2
                ? dataList.length > 3
                  ? dataList.length > 4
                    ? 50
                    : 70
                  : 200
                : 300
              : 500,
        }}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        data={dataList}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${index}`}
        onDragEnd={({ data, from, to }) => handledrag(data, from, to)}
      />
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
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {
              deleteactivity(iditinerary, idactivity, types);
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#d75995" }}
            >
              {t("DeleteActivityfromItinerary")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => {}}
          >
            <Text size="description" type="regular" style={{}}>
              Add Activity to Itinerary
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModal(false);
        }}
        onRequestClose={() => setModal(false)}
        onDismiss={() => setModal(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modal}
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
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: 20,
              left: 20,
            }}
            onPress={() => setModal(false)}
          >
            <Xhitam width={15} height={15} />
          </TouchableOpacity>
          <Text size="label" type="bold" style={{}}>
            {t("EditNotes")}
          </Text>
          <Textarea
            style={{
              width: "100%",
              borderRadius: 5,
              fontFamily: "Lato-Regular",
            }}
            rowSpan={5}
            placeholder="Input Notes"
            value={textinput}
            bordered
            maxLength={160}
            onChangeText={(text) => setInput(text)}
          />
          <TouchableOpacity
            onPress={() => saveNotes()}
            style={{
              marginTop: 15,
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: "#209fae",
              paddingHorizontal: 40,
              paddingVertical: 5,
              borderRadius: 5,
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{
                color: "white",
              }}
            >
              {t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onBackdropPress={() => {
          setModaldate(false);
        }}
        onRequestClose={() => setModaldate(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modaldate}
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
            onPress={() => setModaldate(false)}
          >
            <Xhitam width={15} height={15} />
          </TouchableOpacity>
          <Text size="description" type="bold" style={{}}>
            {t("Selecttime")}
          </Text>
          <View
            style={{
              width: "70%",
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Picker
              iosIcon={
                <View>
                  <Bottom />
                </View>
              }
              iosHeader="Select Hours"
              note
              mode="dropdown"
              selectedValue={jamer}
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
              onValueChange={(itemValue, itemIndex) => setjamer(itemValue)}
            >
              {jams.map((item, index) => {
                return <Picker.Item key={item} label={item} value={item} />;
              })}
            </Picker>
            <View
              style={{
                width: "10%",
                alignItems: "flex-end",
                alignContent: "flex-end",
              }}
            >
              <Text size="description" type="bold" style={{}}>
                :
              </Text>
            </View>
            <Picker
              iosHeader="Select Minutes"
              headerBackButtonTextStyle={{ fontFamily: "Lato-Regular" }}
              note
              mode="dropdown"
              selectedValue={menor}
              textStyle={{ fontFamily: "Lato-Regular" }}
              itemTextStyle={{ fontFamily: "Lato-Regular" }}
              itemStyle={{ fontFamily: "Lato-Regular" }}
              placeholderStyle={{ fontFamily: "Lato-Regular" }}
              iosIcon={
                <View>
                  <Bottom />
                </View>
              }
              headerTitleStyle={{
                fontFamily: "Lato-Regular",
              }}
              style={{
                color: "#209fae",
                fontFamily: "Lato-Regular",
              }}
              onValueChange={(itemValue, itemIndex) => setmenor(itemValue)}
            >
              {menits.map((item, index) => {
                return <Picker.Item key={""} label={item + ""} value={item} />;
              })}
            </Picker>
          </View>
          <TouchableOpacity
            onPress={() => setTime(jamer + ":" + menor + ":00", dataList)}
            style={{
              marginTop: 20,
              backgroundColor: "#209fae",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{
                color: "white",
              }}
            >
              {t("Select")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
