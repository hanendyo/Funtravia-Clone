import React, {useState, useEffect, useRef, useLayoutEffect} from "react";
import {
  View,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Linking,
  Image,
  Platform,
  Modal,
  Pressable,
  StyleSheet,
  Picker,
} from "react-native";
import {useMutation} from "@apollo/react-hooks";
import {
  Arrowbackios,
  Arrowbackwhite,
  More,
  Bottom,
  New,
  Xhitam,
  Xgray,
  PinMapGreen,
  Flights,
  Stay,
} from "../../../assets/svg";
import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
import {
  Button,
  Text,
  FunIcon,
  Capital,
  FunImage,
  FunDocument,
  Loading,
  Truncate,
  Distance,
} from "../../../component";
import {useTranslation} from "react-i18next";
import MapView, {Marker} from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import {ReactNativeFile} from "apollo-upload-client";
import ImageSlide from "../../../component/src/ImageSlide";
import DeleteActivity from "../../../graphQL/Mutation/Itinerary/DeleteActivity";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import {StackActions} from "@react-navigation/native";
import {RNToasty} from "react-native-toasty";
import normalize from "react-native-normalize";
import moment from "moment";
import DeviceInfo from "react-native-device-info";
import {useSelector} from "react-redux";

export default function detailCustomItinerary(props) {
  console.log("propsdetail", props);
  const {t, i18n} = useTranslation();
  const indexinput = props.route.params.indexdata;
  const Notch = DeviceInfo.hasNotch();
  const {height, width} = Dimensions.get("screen");
  const token = useSelector((data) => data.token);

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      <View
        style={{
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
      >
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

        <View
          style={{
            marginLeft: 10,
            marginBottom: 5,
          }}
        >
          <Text type="bold" size="title" style={{color: "#fff"}}>
            {t("activityDetails")}
          </Text>

          <Text
            style={{
              color: "#fff",
              width: Dimensions.get("screen").width - normalize(80),
            }}
            numberOfLines={1}
          >
            {props.route.params.nameitin}
            {/* <Truncate
              text={props.route.params.nameitin}
              length={Platform.OS == "ios" ? (Notch ? 30 : 30) : 50}
            /> */}
          </Text>
        </View>
      </View>
    ),
  };
  let [dataParent, setDataParent] = useState({});
  let [dataChild, setDataChild] = useState([]);
  let [modaldate, setModaldate] = useState(false);

  const [hourFrom, setHourFrom] = useState("00");
  const [minuteFrom, setminuteFrom] = useState("00");
  const [hourTo, sethourTo] = useState("00");
  const [minuteTo, setminuteTo] = useState("00");

  const pecahData = async (data, id) => {
    let dataX = [];
    let parent = null;
    let dataparents = {};
    let index = await data.findIndex((key) => key.id === id);
    if (data[index].parent === true) {
      parent = data[index].id;
    } else {
      parent = data[index].parent_id;
    }
    for (var i of data) {
      if (i.id === parent) {
        //   dataX.push(i);
        dataparents = {...i};
      } else if (i.parent_id === parent) {
        dataX.push(i);
      }
    }

    await setDataParent(dataparents);
    // await FunAttachment(dataparents);
    await setDataChild(dataX);
  };

  const OpenModaldate = (starts, duration) => {
    setModaldate(true);

    let startTime = starts
      // .split(" ")[1]
      .split(":")
      .map((x) => +x);
    let durationTime = duration.split(":").map((x) => +x);

    let jam = `${startTime[0] + durationTime[0]}`;
    let menit = `${startTime[1] + durationTime[1]}`;

    if (menit > 59) {
      menit -= 60;
      jam += 1;
    }

    setHourFrom(
      `${startTime[0]}`.length === 1 ? `0${startTime[0]}` : `${startTime[0]}`
    );
    setminuteFrom(
      `${startTime[1]}`.length === 1 ? `0${startTime[1]}` : `${startTime[1]}`
    );
    sethourTo(jam.length === 1 ? "0" + jam : jam);
    setminuteTo(menit.length === 1 ? "0" + menit : menit);
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

  const hitungDuration = ({startt, dur}) => {
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
  // const setdatadayaktif = (data) => {
  //   setdatadayaktifs(data);
  //   props.navigation.setParams({ datadayaktif: data });
  // };
  const [datadayaktif, setdatadayaktif] = useState(
    props.route.params?.datadayaktif ? props.route.params?.datadayaktif : ""
  );

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

  const savetimeline = async (datakiriman) => {
    try {
      let response = await mutationSaveTimeline({
        variables: {
          idday: props.route.params.datadayaktif.id,
          value: JSON.stringify(datakiriman),
        },
      });

      if (response.data) {
        if (response.data.update_timeline.code !== 200) {
          RNToasty.Show({
            title: response.data.update_timeline.message,
            position: "bottom",
          });
          // throw new Error(response.data.update_timeline.message);
        }

        props.navigation.goBack();
      }
    } catch (error) {
      RNToasty.Show({
        title: "Save time line failed",
        position: "bottom",
      });
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
        Authorization: token,
      },
    },
  });

  const deleteactivity = async () => {
    try {
      let response = await mutationDeleteActivity({
        variables: {
          itinerary_id: props.route.params.idItin,
          id_activity: props.route.params.id,
          type: "custom",
        },
      });

      if (response.data) {
        if (response.data.delete_activity.code !== 200) {
          RNToasty.Show({
            title: response.data.delete_activity.message,
            position: "bottom",
          });
          // throw new Error(response.data.delete_activity.message);
        }

        var Xdata = [...props.route.params.data];
        var inde = Xdata.findIndex((k) => k["id"] === props.route.params.id);

        if (inde !== -1) {
          Xdata.splice(inde, 1);

          var x = 0;
          var order = 1;
          for (var y in Xdata) {
            Xdata[y].order = order;

            if (Xdata[y - 1]) {
              Xdata[y].time = hitungDuration({
                startt: Xdata[y - 1].time,
                dur: Xdata[y - 1].duration,
              });
            }
            x++;
            order++;
          }

          if ((x = Xdata.length)) {
            try {
              let response = await mutationSaveTimeline({
                variables: {
                  idday: props.route.params.datadayaktif.id,
                  value: JSON.stringify(Xdata),
                },
              });

              if (response.data) {
                if (response.data.update_timeline.code !== 200) {
                  RNToasty.Show({
                    title: response.data.update_timeline.message,
                    position: "bottom",
                  });
                  // throw new Error(response.data.update_timeline.message);
                }
                props.navigation.dispatch(
                  StackActions.replace("ItineraryStack", {
                    screen: "itindetail",
                    params: {
                      itintitle: props.route.params.nameitin,
                      country: props.route.params.idItin,
                      token: token,
                      status: "edit",
                    },
                  })
                );
              }
            } catch (error) {
              RNToasty.Show({
                title: error,
                position: "bottom",
              });
            }
          }
          await props.navigation.goBack();
        }

        setModalDeleteActivity(false);
      }
    } catch (error) {
      RNToasty.Show({
        title: error,
        position: "bottom",
      });
      setModalDeleteActivity(false);
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);

    const unsubscribe = props.navigation.addListener("focus", () => {
      pecahData(props.route.params.data, props.route.params.id);
    });
    return unsubscribe;
  }, [props.navigation]);

  let [dataUpload, setdataUpload] = useState([]);
  let [loadingUploadFile, setLoadingUploadFile] = useState(false);

  const pickFile = async (id, sumber) => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      await setLoadingUploadFile(true);

      let files = new ReactNativeFile({
        uri: res.uri,
        type: res.type,
        name: res.name,
      });
      let tempe = [...dataUpload];
      tempe.push(files);
      // await setdataUpload(tempe);
      await handleUpload(tempe, id, sumber, res);
      await setLoadingUploadFile(false);
    } catch (err) {
      setLoadingUploadFile(false);
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const Getdurasi = (durasi) => {
    durasi = durasi.split(":");
    return (
      parseFloat(durasi[0]) +
      " " +
      t("hours") +
      " " +
      (parseFloat(durasi[1]) > 0
        ? parseFloat(durasi[1]) + " " + t("minutes")
        : " ")
    );
  };

  const GetStartTime = ({startt}) => {
    var starttime = startt.split(":");

    return (
      <Text size="description" type="bold" style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
  };

  const GetEndTime = ({startt, dur}) => {
    var duration = dur.split(":");
    var starttime = startt.split(":");

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);
    if (menit > 59) {
      menit = menit - 60;
    }

    return (
      <Text size="description" type="bold" style={{}}>
        {jam < 10 ? "0" + (jam < 0 ? 0 : jam) : jam}:
        {menit < 10 ? "0" + menit : menit}
      </Text>
    );
  };

  const hour = [...Array(24).keys()]
    .map((x) => `${x}`)
    .map((y) => (y.length === 1 ? `0${y}` : y));
  const minute = [...Array(60).keys()]
    .map((x) => `${x}`)
    .map((y) => (y.length === 1 ? `0${y}` : y));

  const SetTimeline = async (
    jamstarts,
    menitstarts,
    jamends,
    menitends,
    dataLists,
    ordercurrent
  ) => {
    await setModaldate(false);

    let starttimes = jamstarts + ":" + menitstarts + ":00";

    let jams = parseFloat(jamends) - parseFloat(jamstarts);

    let menits = parseFloat(menitends) + 60 - parseFloat(menitstarts);

    if (menits > 59) {
      menits = menits - 60;
    }

    let jamakhirs = jams < 10 ? "0" + (jams < 0 ? 0 : jams) : jams;
    let menitakhirs = menits < 10 ? "0" + menits : menits;
    let durations = jamakhirs + ":" + menitakhirs + ":00";

    if (dataLists[0].detail_accomodation) {
      var datahotel = dataLists.splice(0, 1);
    } else {
      var datahotel = [];
    }
    let datax = [...dataLists];

    console.log("datax", datax);
    let dataganti = {...datax[indexinput]};

    dataganti.time = starttimes;
    dataganti.duration = durations;

    if (dataganti.detail_flight) {
      let dateArr = dataganti.detail_flight.arrival.split(" ")[0];
      let timeArr = dataganti.detail_flight.arrival.split(" ")[1];
      let timeFinal = `${dateArr} ${jamends}:${menitends}:00`;

      dataganti.detail_flight = {
        ...dataganti.detail_flight,
        arrival: timeFinal,
      };
    }

    if (datax[parseFloat(indexinput) - 1]) {
      let timesebelum = hitungDuration({
        startt: datax[parseFloat(indexinput) - 1].time,
        dur: datax[parseFloat(indexinput) - 1].duration,
      });

      let timestartsebelum = datax[parseFloat(indexinput) - 1].time.split(":");

      timesebelum = timesebelum.split(":");
      let bandingan = starttimes.split(":");

      timestartsebelum = parseFloat(timestartsebelum[0]);
      let jamsebelum = parseFloat(timesebelum[0]);
      let jamsesesudah = parseFloat(bandingan[0]);

      if (jamsesesudah > timestartsebelum) {
        dataganti.time = hitungDuration({
          startt: datax[parseFloat(indexinput) - 1].time,
          dur: datax[parseFloat(indexinput) - 1].duration,
        });
        // let a = caridurasi(datax[parseFloat(indexinput) - 1].time, starttimes);

        // let dataset = { ...datax[parseFloat(indexinput) - 1] };
        // dataset.duration = a;
        // datax.splice(parseFloat(indexinput) - 1, 1, dataset);
        // console.log("dataxy", datax);
      } else {
        dataganti.time = hitungDuration({
          startt: datax[parseFloat(indexinput) - 1].time,
          dur: datax[parseFloat(indexinput) - 1].duration,
        });
      }
    }

    datax.splice(indexinput, 1, dataganti);

    var x = 0;
    var order = 1;
    if (datahotel.length > 0) {
      var order = 1;
    }

    for (var y in datax) {
      let datareplace = {...datax[y]};
      datareplace.order = order;
      if (datax[y - 1]) {
        // longitude & latitude index sebelum custom
        let LongBefore = datax[y - 1].longitude;
        let LatBefore = datax[y - 1].latitude;
        // longitude & latitude index custom
        let LongCurrent = datax[y].longitude;
        let LatCurrent = datax[y].latitude;
        // kondisi jika lokasi yang sama dan aktivitas berbeda
        if (LongBefore == LongCurrent || LatBefore == LatCurrent) {
          var newtime = datax[y - 1].time;
        } else {
          // rumus hitung jarak
          let jarak = Distance({
            lat1: LatBefore,
            lon1: LongBefore,
            lat2: LatCurrent,
            lon2: LongCurrent,
            unit: "km",
          });
          // rumus hitung waktu
          let waktutemp = jarak / 50;
          let waktu = waktutemp + "";
          // pecah hasil waktu
          let split = waktu.split(".");
          let jamtemp = "";
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
              menittemp = split[1] - 60;
            } else {
              jamtemp = 0;
              menittemp = split[1];
            }
          }
          let time = datax[y - 1].time;
          let splittime = time.split(":");
          let durationold = datax[y - 1].duration;
          let splitdurations = durationold.split(":");
          //menit total untuk mendapatkan menit yang lebih dari 59
          let menitotal =
            parseFloat(splittime[1]) +
            parseFloat(splitdurations[1]) +
            parseFloat(menittemp);
          // let durasitemp = `${jamtemp}:${menittemp}`;
          let newjam = parseFloat(jamtemp) + parseFloat(splittime[0]);
          let newmenit = parseFloat(menittemp) + parseFloat(splittime[1]);
          var newtime =
            menitotal > 59
              ? `${newjam + 1}:${newmenit - 60}`
              : `${newjam}:${newmenit}`;
        }

        datareplace.time = await hitungDuration({
          startt: newtime,
          dur: datax[y - 1].duration,
        });
        await datax.splice(y, 1, datareplace);
      }

      x++;
      order++;
    }
    if (datahotel.length > 0) {
      datax.splice(0, 0, datahotel[0]);
    }

    let sum = datax.reduce(
      (itinerary, item) => itinerary.add(moment.duration(item.duration)),
      moment.duration()
    );

    let jampert = datax[0].time.split(":");
    let jampertama = parseFloat(jampert[0]);
    let menitpertama = parseFloat(jampert[1]);
    let durjam = Math.floor(sum.asHours());
    let durmin = sum.minutes();
    let hasiljam = jampertama + durjam;
    let hasilmenit = menitpertama + durmin;

    if (hasiljam <= 23) {
      let dataday = {...datadayaktif};

      if (hasiljam === 23 && hasilmenit <= 59) {
        savetimeline(datax);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        await setdatadayaktif(dataday);
      } else if (hasiljam < 23) {
        savetimeline(datax);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        await setdatadayaktif(dataday);
      } else {
        Alert.alert("Waktu sudah melewati batas maksimal");
      }
    } else {
      Alert.alert("Waktu sudah melewati batas maksimal");
    }
  };
  // const SetTimeline = async (
  //   hourStart,
  //   minStart,
  //   hourEnd,
  //   minEnd,
  //   dataLists
  // ) => {
  //   setModaldate(false);
  //   console.log("dataListBefore", dataLists);

  //   let starttimes = hourStart + ":" + minStart + ":00";

  //   let jams = parseFloat(hourEnd) - parseFloat(hourStart);

  //   let menits = parseFloat(minEnd) + 60 - parseFloat(minStart);

  //   if (menits > 59) {
  //     menits = menits - 60;
  //   }

  //   let jamakhirs = jams < 10 ? "0" + (jams < 0 ? 0 : jams) : jams;
  //   let menitakhirs = menits < 10 ? "0" + menits : menits;
  //   let durations = jamakhirs + ":" + menitakhirs + ":00";

  //   let dataganti = { ...dataLists[indexinput] };

  //   dataganti.time = starttimes;
  //   dataganti.duration = durations;

  //   if (dataganti.detail_flight) {
  //     let dateArr = dataganti.detail_flight.arrival.split(" ")[0];
  //     let timeArr = dataganti.detail_flight.arrival.split(" ")[1];
  //     let timeFinal = `${dateArr} ${hourEnd}:${minEnd}:00`;

  //     dataganti.detail_flight = {
  //       ...dataganti.detail_flight,
  //       arrival: timeFinal,
  //     };
  //   }

  //   if (dataLists[parseFloat(indexinput) - 1]) {
  //     let timesebelum = hitungDuration({
  //       startt: dataLists[parseFloat(indexinput) - 1].time,
  //       dur: dataLists[parseFloat(indexinput) - 1].duration,
  //     });

  //     let timestartsebelum = dataLists[parseFloat(indexinput) - 1].time.split(
  //       ":"
  //     );

  //     timesebelum = timesebelum.split(":");
  //     let bandingan = starttimes.split(":");

  //     timestartsebelum = parseFloat(timestartsebelum[0]);
  //     let jamsebelum = parseFloat(timesebelum[0]);
  //     let jamsesesudah = parseFloat(bandingan[0]);

  //     if (jamsesesudah > timestartsebelum) {
  //       dataganti.time = hitungDuration({
  //         startt: dataLists[parseFloat(indexinput) - 1].time,
  //         dur: dataLists[parseFloat(indexinput) - 1].duration,
  //       });
  //       // let a = caridurasi(
  //       //   dataLists[parseFloat(indexinput) - 1].time,
  //       //   starttimes
  //       // );

  //       // let dataset = { ...dataLists[parseFloat(indexinput) - 1] };
  //       // dataset.duration = a;
  //       // dataLists.splice(parseFloat(indexinput) - 1, 1, dataset);
  //     } else {
  //       dataganti.time = hitungDuration({
  //         startt: dataLists[parseFloat(indexinput) - 1].time,
  //         dur: dataLists[parseFloat(indexinput) - 1].duration,
  //       });
  //     }
  //   }

  //   dataLists.splice(indexinput, 1, dataganti);

  //   var x = 0;
  //   var order = 1;

  //   for (var y in dataLists) {
  //     if (dataLists[y - 1]) {
  //       let datareplace = { ...dataLists[y] };
  //       datareplace.order = order;
  //       datareplace.time = await hitungDuration({
  //         startt: dataLists[y - 1].time,
  //         dur: dataLists[y - 1].duration,
  //       });
  //       await dataLists.splice(y, 1, datareplace);
  //     }
  //     x++;
  //     order++;
  //   }

  //   let sum = dataLists.reduce(
  //     (itinerary, item) => itinerary.add(moment.duration(item.duration)),
  //     moment.duration()
  //   );

  //   console.log("datalist", dataLists);

  //   let jampert = dataLists[0].time.split(":");
  //   let jampertama = parseFloat(jampert[0]);
  //   let menitpertama = parseFloat(jampert[1]);
  //   let durjam = Math.floor(sum.asHours());
  //   let durmin = sum.minutes();
  //   let hasiljam = jampertama + durjam;
  //   let hasilmenit = menitpertama + durmin;

  //   // if (hasiljam <= 23) {
  //   //   let dataday = { ...datadayaktif };

  //   //   if (hasiljam === 23 && hasilmenit <= 59) {
  //   //     savetimeline(dataLists);
  //   //     dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
  //   //     await setdatadayaktif(dataday);
  //   //   } else if (hasiljam < 23) {
  //   //     savetimeline(dataLists);
  //   //     dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
  //   //     await setdatadayaktif(dataday);
  //   //   } else {
  //   //     RNToasty.Show({
  //   //       title: "Waktu sudah melewati batas maksimal",
  //   //       position: "bottom",
  //   //     });
  //   //   }
  //   // } else {
  //   //   RNToasty.Show({
  //   //     title: "Waktu sudah melewati batas maksimal",
  //   //     position: "bottom",
  //   //   });
  //   // }
  // };

  const [
    mutationUpload,
    {loading: loadingSaved, data: dataSaved, error: errorSaved},
  ] = useMutation(Upload, {
    context: {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",

        Authorization: token,
      },
    },
  });

  const handleEdit = () => {
    if (dataParent.detail_flight) {
      props.navigation.navigate("customFlight", {
        activityId: props.route.params.id,
        itineraryId: props.route.params.idItin,
        dayId: props.route.params.idDay,
        startDate: props.route.params.startDate,
        endDate: props.route.params.endDate,
        name: dataParent.name,
        departure: dataParent.detail_flight.from,
        arrival: dataParent.detail_flight.destination,
        latitude: dataParent.latitude,
        longitude: dataParent.longitude,
        latitude_departure: dataParent.detail_flight.latitude_departure,
        longitude_departure: dataParent.detail_flight.longitude_departure,
        attachment: dataParent.attachment,
        timeDep: dataParent.detail_flight.departure,
        timeArr: dataParent.detail_flight.arrival,
        note: dataParent.note,
        guestName: dataParent.detail_flight.guest_name,
        carrier: dataParent.detail_flight.carrier,
        booking_ref: dataParent.detail_flight.booking_ref,
      });
      setModalMore(false);
    } else if (dataParent.detail_accomodation) {
      props.navigation.navigate("customStay", {
        activityId: props.route.params.id,
        itineraryId: props.route.params.idItin,
        dayId: props.route.params.idDay,
        detail_accomodation: dataParent.detail_accomodation,
        address: dataParent.address,
        attachment: dataParent.attachment,
        latitude: dataParent.latitude,
        longitude: dataParent.longitude,
        startDate: props.route.params.startDate,
        endDate: props.route.params.endDate,
        order: props.route.params.indexdata,
        time: props.route.params.time,
        note: dataParent.note,
      }),
        setModalMore(false);
    } else {
      props.navigation.navigate("editcustomactivity", {
        token: token,
        dataParent: dataParent,
        idDay: props.route.params.idDay,
        idItin: props.route.params.idItin,
        itintitle: props.route.params.nameitin,
        // dateitin: props.route.params.dateitin,
        datadayaktif: props.route.params.datadayaktif,
        datalist: props.route.params.dataList,
      });
      // RNToasty.Show({
      //   title: "Sorry, feature is not available yet",
      //   position: "bottom",
      // });
      setModalMore(false);
    }
  };

  const handleUpload = async (files, id, sumber, res) => {
    try {
      let response = await mutationUpload({
        variables: {
          file: files,
          custom_itinerary_id: id,
        },
      });

      if (response.data) {
        if (response.data.upload_attach_custom.code !== 200) {
          RNToasty.Show({
            title: response.data.upload_attach_custom.message,
            position: "bottom",
          });
        } else {
          if (sumber === "parent") {
            let datan = {...dataParent};
            let tempes = [];
            if (datan.attachment?.length > 0) {
              tempes = [...datan.attachment];
            }
            let init = {
              __typename: "AttachmentCustom",
              itinerary_custom_id:
                response.data.upload_attach_custom.data[0].itinerary_custom_id,
              extention: response.data.upload_attach_custom.data[0].extention,
              file_name: response.data.upload_attach_custom.data[0].file_name,
              filepath: response.data.upload_attach_custom.data[0].filepath,
              tiny: response.data.upload_attach_custom.data[0].tiny,
            };
            tempes.push(init);
            let datas = {...dataParent};
            datas["attachment"] = tempes;

            setDataParent(datas);
          } else if (sumber !== "parent") {
            let datan = [...dataChild];
            let inde = await datan.findIndex((key) => key.id === id);
            let tempes = [];
            if (datan[inde]?.attachment?.length > 0) {
              tempes = [...datan[inde].attachment];
            }

            let init = {
              __typename: "AttachmentCustom",
              itinerary_custom_id:
                response.data.upload_attach_custom.data[0].itinerary_custom_id,
              extention: response.data.upload_attach_custom.data[0].extention,
              file_name: response.data.upload_attach_custom.data[0].file_name,
              filepath: response.data.upload_attach_custom.data[0].filepath,
              tiny: response.data.upload_attach_custom.data[0].tiny,
            };
            tempes.push(init);
            datan[inde]["attachment"] = tempes;
            setDataChild(datan);
          }
        }
      }
    } catch (error) {
      RNToasty.Show({
        title: error,
        position: "bottom",
      });
    }
  };

  const [
    mutationdelete,
    {loading: loadingdelete, data: datadelete, error: errordelete},
  ] = useMutation(DeleteAttachcustom, {
    context: {
      headers: {
        "Content-Type": "application/json",
        // "Content-Type": "multipart/form-data",

        Authorization: token,
      },
    },
  });

  let [loadingHapusFile, setLoadingHapusFile] = useState(false);

  const _handle_hapusParent = async (data, index, dataParents) => {
    try {
      setLoadingHapusFile(true);
      let response = await mutationdelete({
        variables: {
          itinerary_custom_id: data.itinerary_custom_id,
          tiny: data.tiny,
        },
      });

      if (response.data) {
        if (response.data.delete_attach_custom.code !== 200) {
          await setLoadingHapusFile(false);
          await RNToasty.Show({
            title: response.data.delete_attach_custom.message,
            position: "bottom",
          });
          // throw new Error(response.data.delete_attach_custom.message);
        } else {
          let tempes = [...dataParents.attachment];
          tempes.splice(index, 1);
          let datas = {...dataParents};
          datas["attachment"] = tempes;
          setDataParent(datas);
          await setLoadingHapusFile(false);
          await RNToasty.Show({
            title: "Success Delete file",
            position: "bottom",
          });
        }
      }
    } catch (error) {
      await setLoadingHapusFile(false);
      await RNToasty.Show({
        title: error,
        position: "bottom",
      });
    }
  };

  const _handle_hapusChild = async (item, index, indah, dataChild) => {
    try {
      let response = await mutationdelete({
        variables: {
          itinerary_custom_id: item?.attachment[indah]?.itinerary_custom_id,
          tiny: item?.attachment[indah]?.tiny,
        },
      });

      if (response.data) {
        if (response.data.delete_attach_custom.code !== 200) {
          RNToasty.Show({
            title: response.data.delete_attach_custom.message,
            position: "bottom",
          });
          // throw new Error(response.data.delete_attach_custom.message);
        } else {
          let tempes = [...item.attachment];
          tempes.splice(indah, 1);
          let datas = {...item};
          datas["attachment"] = tempes;
          let datan = [...dataChild];
          datan[index] = datas;
          setDataChild(datan);
        }
      }
    } catch (error) {
      RNToasty.Show({
        title: error,
        position: "bottom",
      });
    }
  };

  const x = dataChild.length - 1;

  let [indeks, setIndeks] = useState(0);
  let [gambar, setGambar] = useState([]);
  let [modalss, setModalss] = useState(false);
  const [modalMore, setModalMore] = useState(false);
  const [modalDeleteActivity, setModalDeleteActivity] = useState(false);

  const ImagesSlider = async (index, data) => {
    var tempdatas = [];
    var x = 0;

    for (var i in data) {
      let wid = 0;
      let hig = 0;
      Image.getSize(data[i].filepath, (width, height) => {
        wid = width;
        hig = height;
      });
      tempdatas.push({
        key: i,
        url: data[i].filepath ? data[i].filepath : "",
        width: wid,
        height: hig,
        props: {source: data[i].filepath ? data[i].filepath : ""},
      });
      x++;
    }

    await setIndeks(index);
    await setGambar(tempdatas);
    await setModalss(true);
  };

  const bukamodalmenu = (id, type) => {
    setModalMore(true);
  };

  console.log("token", token);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        // backgroundColor: "#fff",
      }}
    >
      <Loading show={loadingUploadFile} />
      <Loading show={loadingHapusFile} />

      <ImageSlide
        index={indeks}
        show={modalss}
        dataImage={gambar}
        setClose={() => setModalss(false)}
      />
      <FlatList
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        data={dataChild}
        contentContainerStyle={{
          paddingHorizontal: 15,
          paddingVertical: 15,
          // minHeight: Dimensions.get("screen").height,
        }}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View
            style={{
              flexDirection: "row",
              // borderWidth: 1,
              // height: 200,
            }}
          >
            {/* garis======================= */}
            <View
              style={{
                marginLeft: 15,
              }}
            >
              <View
                style={{
                  height: 35,
                  marginRight: 4.5,
                  borderRightWidth: 0.5,
                  borderRightColor: "#6C6C6C",
                }}
              ></View>
              <View
                style={{
                  zIndex: 99,
                  height: 10,
                  width: 10,
                  borderRadius: 10,
                  backgroundColor: "#209fae",
                  elevation: 3,
                  shadowColor: "#d3d3d3",
                  shadowOffset: {width: 2, height: 2},
                  shadowOpacity: 1,
                  shadowRadius: 2,
                }}
              />
              <View
                style={{
                  flex: 1,
                  marginRight: 4.5,
                  borderRightWidth: index < x ? 0.5 : 0,
                  borderRightColor: "#6C6C6C",
                }}
              ></View>
            </View>
            {/* garis======================= */}

            <View
              style={{
                flex: 1,
                marginTop: 15,
                marginLeft: 15,
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 3,
                shadowColor: "#d3d3d3",
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 1,
                shadowRadius: 2,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 15,
                  paddingVertical: 10,
                  borderBottomColor: "#f1f1f1",
                  borderBottomWidth: 0.5,
                }}
              >
                {item.detail_accomodation || item.detail_flight ? (
                  item.detail_flight ? (
                    <View
                      style={{
                        backgroundColor: "#f6f6f6",
                        width: 47,
                        height: 47,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        borderRadius: 40,
                        borderWidth: 0.5,
                        borderColor: "#d1d1d1",
                      }}
                    >
                      <Flights height={35} width={35} />
                    </View>
                  ) : (
                    <View
                      style={{
                        backgroundColor: "#f6f6f6",
                        width: 47,
                        height: 47,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        borderRadius: 40,
                        borderWidth: 0.5,
                        borderColor: "#d1d1d1",
                      }}
                    >
                      <Stay height={35} width={35} />
                    </View>
                  )
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
                  style={{flex: 1, paddingHorizontal: 10}}
                  // onLongPress={status !== "saved" ? drag : null}
                >
                  <Text size="label" type="bold" style={{}}>
                    {item.name}
                  </Text>
                  <Text>
                    {Capital({
                      text:
                        item.type !== "custom"
                          ? item.type !== "google"
                            ? item.type
                            : t("destinationFromGoogle")
                          : t("customActivity"),
                    })}
                  </Text>
                </TouchableOpacity>
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
                  <More width={15} height={15} />
                </Button>
              </View>
              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderBottomColor: "#f1f1f1",
                  borderBottomWidth: item.notes ? 0.5 : 0,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      marginRight: 40,
                    }}
                  >
                    <Text>{t("duration")} :</Text>
                    <View
                      style={{
                        marginTop: 10,
                        //   width: "80%",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: "#daf0f2",
                        borderRadius: 5,
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text type="bold">
                        {Getdurasi(item.duration ? item.duration : "00:00:00")}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text>{t("time")} :</Text>
                    <View
                      style={{
                        marginTop: 10,
                        //   width: "80%",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: "#daf0f2",
                        borderRadius: 5,
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <TouchableOpacity>
                        {item.time ? (
                          <GetStartTime startt={item.time} />
                        ) : (
                          <Text size="description" type="bold">
                            00:00
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity>
                        {item.duration ? (
                          <GetEndTime
                            startt={item.time ? item.time : "00:00"}
                            dur={item.duration ? item.duration : "00:00"}
                          />
                        ) : (
                          <Text size="description" type="bold">
                            00:00
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {item.note ? (
                <View
                  style={{
                    paddingHorizontal: 15,
                    paddingVertical: 10,

                    borderBottomColor: "#f1f1f1",
                    borderBottomWidth: 0.5,
                  }}
                >
                  <Text>{t("notes")}</Text>
                  <Text style={{marginTop: 10}}>{item.note}</Text>
                </View>
              ) : null}

              <View
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  // borderBottomColor: "#f1f1f1",
                  // borderBottomWidth: 0.5,
                }}
              >
                <View style={{}}>
                  <Text
                    size="label"
                    type="bold"
                    style={
                      {
                        // marginTop: 20,
                      }
                    }
                  >
                    {t("Attachment")}
                  </Text>
                  <View
                    style={{
                      paddingTop: 5,
                    }}
                  >
                    {item?.attachment?.length > 0
                      ? item.attachment.map((data, indah) => {
                          return (
                            <View
                              style={{
                                flexDirection: "row",
                                alignContent: "flex-start",
                                alignItems: "flex-start",
                                paddingVertical: 10,
                                borderBottomWidth: 1,
                                borderBottomColor: "#d1d1d1",
                              }}
                            >
                              <FunDocument
                                filename={data.file_name}
                                filepath={data.filepath}
                                format={data.extention}
                                progressBar
                                icon
                              />
                              <TouchableOpacity
                                onPress={() => {
                                  _handle_hapusChild(
                                    data,
                                    index,
                                    indah,
                                    dataChild
                                  );
                                }}
                                style={{
                                  flexDirection: "row",
                                  paddingRight: 10,
                                  paddingLeft: 25,
                                  paddingVertical: 5,
                                  height: "100%",
                                  alignItems: "center",
                                }}
                              >
                                <Xhitam style={{}} width={10} height={10} />
                              </TouchableOpacity>
                            </View>
                          );
                        })
                      : null}
                  </View>

                  <View style={{flex: 1, marginVertical: 10}}>
                    <TouchableOpacity
                      onPress={() => {
                        pickFile(item.id, "child");
                      }}
                      style={{
                        width: "100%",
                        // borderColor: "black",
                        borderWidth: 1,
                        borderStyle: "dashed",
                        borderRadius: 5,
                        borderColor: "#d3d3d3",
                        justifyContent: "center",
                        alignContent: "center",
                        alignItems: "center",
                        paddingVertical: 10,
                        flexDirection: "row",
                        marginBottom: 5,
                      }}
                    >
                      <New height={15} width={15} />
                      <Text
                        style={{
                          marginLeft: 5,
                          color: "#d1d1d1",
                        }}
                      >
                        {t("ChooseFile")}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      size="description"
                      type="regular"
                      style={{
                        color: "#d1d1d1",
                      }}
                    >
                      {t("Upload your flight ticket, hotel voucher, etc.")}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={() => (
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flex: 1,
                marginTop: 15,
                marginLeft: 40,
                borderRadius: 5,
                backgroundColor: "#fff",
                elevation: 3,
                shadowColor: "#d3d3d3",
                shadowOffset: {width: 2, height: 2},
                shadowOpacity: 1,
                shadowRadius: 2,
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  width: "50%",
                }}
              >
                {t("addActivityAtThisLocation")}
              </Text>
              <Button
                text={t("addActivity")}
                onPress={() => {
                  props.navigation.push("CustomItinerary", {
                    idItin: props.route.params.idItin,
                    idDay: props.route.params.datadayaktif.id,
                    itintitle: props.route.params.nameitin,
                    // dateitin: props.route.params.dateitin,
                    datadayaktif: props.route.params.datadayaktif,
                    dataParent: dataParent,
                  });
                }}
              ></Button>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View
            style={{
              borderRadius: 5,
              backgroundColor: "#fff",
              elevation: 3,
              shadowColor: "#d3d3d3",
              shadowOffset: {width: 2, height: 2},
              shadowOpacity: 1,
              shadowRadius: 2,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              {dataParent.detail_accomodation || dataParent.detail_flight ? (
                dataParent.detail_flight ? (
                  <View
                    style={{
                      backgroundColor: "#f6f6f6",
                      width: 47,
                      height: 47,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      borderRadius: 40,
                      borderWidth: 0.5,
                      borderColor: "#d1d1d1",
                    }}
                  >
                    <Flights height={35} width={35} />
                  </View>
                ) : (
                  <View
                    style={{
                      backgroundColor: "#f6f6f6",
                      width: 47,
                      height: 47,
                      justifyContent: "center",
                      alignItems: "center",
                      alignSelf: "center",
                      borderRadius: 40,
                      borderWidth: 0.5,
                      borderColor: "#d1d1d1",
                    }}
                  >
                    <Stay height={35} width={35} />
                  </View>
                )
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
                style={{flex: 1, paddingHorizontal: 10}}
                // onLongPress={status !== "saved" ? drag : null}
              >
                <Text size="label" type="bold" style={{}}>
                  {dataParent.name}
                </Text>
                <Text>
                  {Capital({
                    text: dataParent.detail_flight
                      ? t("flight")
                      : dataParent.detail_accomodation
                      ? t("hotel")
                      : t("customActivity"),
                  })}
                </Text>
              </TouchableOpacity>
              <Button
                size="small"
                text=""
                type="circle"
                variant="transparent"
                style={{}}
                onPress={() => {
                  bukamodalmenu(dataParent.id, dataParent.type);
                }}
              >
                <More width={15} height={15} />
              </Button>
            </View>
            {dataParent.detail_flight || dataParent.detail_accomodation ? (
              <View style={styles.ViewFlight}>
                {dataParent.detail_flight ? (
                  <View style={styles.ViewDepArr}>
                    <View style={styles.DepArrContainer}>
                      <Text type="light">{t("Departure")}</Text>
                      <Text type="bold">
                        {dataParent.detail_flight.departure.split(" ")[0]}
                      </Text>
                      {/* <Text type="bold">
                        {dataParent.detail_flight.departure
                          .split(" ")[1]
                          .substring(0, 5)}
                      </Text> */}
                      {dataParent.time ? (
                        <GetStartTime startt={dataParent.time} />
                      ) : (
                        <Text size="description" type="bold">
                          00:00
                        </Text>
                      )}
                    </View>
                    <View style={styles.DepArrContainer}>
                      <Text type="light">{t("Arrival")}</Text>
                      <Text type="bold">
                        {dataParent.detail_flight.arrival.split(" ")[0]}
                      </Text>
                      {/* <Text type="bold">
                        {dataParent.detail_flight.arrival
                          .split(" ")[1]
                          .substring(0, 5)}
                      </Text> */}
                      {dataParent.duration ? (
                        <GetEndTime
                          startt={dataParent.time ? dataParent.time : "00:00"}
                          dur={
                            dataParent.duration ? dataParent.duration : "00:00"
                          }
                        />
                      ) : (
                        <Text size="description" type="bold">
                          00:00
                        </Text>
                      )}
                    </View>
                  </View>
                ) : (
                  <View style={styles.ViewDepArr}>
                    <View style={styles.CheckContainer}>
                      <Text type="light">{t("checkIn")}</Text>
                      <Text type="bold">
                        {dataParent.detail_accomodation.checkin.split(" ")[0]}
                      </Text>
                    </View>
                    <View style={styles.CheckContainer}>
                      <Text type="light">{t("checkOut")}</Text>
                      <Text type="bold">
                        {dataParent.detail_accomodation.checkout.split(" ")[0]}
                      </Text>
                    </View>
                  </View>
                )}
                {dataParent.detail_flight ? (
                  <>
                    <View style={styles.FlightContainerMap}>
                      <View
                        style={{
                          justifyContent: "space-between",
                          width: "85%",
                        }}
                      >
                        <Text type="light" style={{marginBottom: 3}}>
                          {t("From")}
                        </Text>
                        <Text type="bold">{dataParent.detail_flight.from}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            Platform.OS == "ios"
                              ? `maps:0,0?q=${dataParent.detail_flight.from}@${dataParent.detail_flight?.latitude_departure},${dataParent.detail_flight?.longitude_departure}`
                              : `geo:0,0?q=${dataParent.detail_flight?.latitude_departure},${dataParent.detail_flight?.longitude_departure}(${dataParent.detail_flight.from})`
                          );
                        }}
                        style={{alignSelf: "center", marginHorizontal: 5}}
                      >
                        <PinMapGreen width={30} height={30} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.FlightContainerMap}>
                      <View
                        style={{
                          justifyContent: "space-between",
                          width: "85%",
                        }}
                      >
                        <Text type="light" style={{marginBottom: 3}}>
                          {t("To")}
                        </Text>
                        <Text type="bold">
                          {dataParent.detail_flight.destination}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          Linking.openURL(
                            Platform.OS == "ios"
                              ? `maps:0,0?q=${dataParent.detail_flight.destination}@${dataParent.detail_flight?.latitude_arrival},${dataParent.detail_flight?.longitude_arrival}`
                              : `geo:0,0?q=${dataParent.detail_flight?.latitude_arrival},${dataParent.detail_flight?.longitude_arrival}(${dataParent.detail_flight.destination})`
                          );
                        }}
                        style={{alignSelf: "center", marginHorizontal: 5}}
                      >
                        <PinMapGreen width={30} height={30} />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : null}

                {dataParent?.detail_flight ? (
                  <View style={styles.FlightContainer}>
                    <Text type="light">{t("PassengerName")}</Text>
                    <Text type="bold">
                      {dataParent?.detail_flight?.guest_name
                        ? dataParent?.detail_flight?.guest_name
                        : "-"}
                    </Text>
                  </View>
                ) : null}

                {dataParent?.detail_accomodation ? (
                  <View style={styles.FlightContainer}>
                    <Text type="light">{t("Guest Name")}</Text>
                    <Text type="bold">
                      {dataParent?.detail_accomodation?.guest_name
                        ? dataParent?.detail_accomodation?.guest_name
                        : "-"}
                    </Text>
                  </View>
                ) : null}

                {dataParent?.detail_flight ? (
                  <View style={styles.FlightContainer}>
                    <Text type="light">{t("bookingRef")}</Text>
                    <Text type="bold">
                      {dataParent?.detail_flight?.booking_ref
                        ? dataParent?.detail_flight?.booking_ref
                        : "-"}
                    </Text>
                  </View>
                ) : null}
                {dataParent?.detail_accomodation ? (
                  <View style={styles.FlightContainer}>
                    <Text type="light">{t("bookingRef")}</Text>
                    <Text type="bold">
                      {dataParent?.detail_accomodation?.booking_ref
                        ? dataParent?.detail_accomodation?.booking_ref
                        : "-"}
                    </Text>
                  </View>
                ) : null}
              </View>
            ) : null}
            {dataParent.detail_flight ? null : (
              <View
                style={{
                  paddingHorizontal: 15,
                  paddingVertical: 10,

                  borderBottomColor: "#f1f1f1",
                  borderBottomWidth: 0.5,
                }}
              >
                <Text size="small">{t("location")}</Text>
                <MapView
                  style={{
                    // flex: 1,
                    marginTop: 10,
                    width: "100%",
                    marginBottom: 10,
                    height: 80,
                    //   borderRadius: 10,
                  }} //window pake Dimensions
                  region={{
                    latitude: parseFloat(
                      dataParent?.latitude ? dataParent?.latitude : 0
                    ),
                    longitude: parseFloat(
                      dataParent?.longitude ? dataParent?.longitude : 0
                    ),
                    latitudeDelta: 0.007,
                    longitudeDelta: 0.007,
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: parseFloat(
                        dataParent?.latitude ? dataParent?.latitude : 0
                      ),
                      longitude: parseFloat(
                        dataParent?.longitude ? dataParent?.longitude : 0
                      ),
                    }}
                    title={dataParent.name}
                    description={dataParent.address}
                    onPress={() => {
                      Linking.openURL(
                        Platform.OS == "ios"
                          ? "maps://app?daddr=" +
                              dataParent.latitude +
                              "+" +
                              dataParent.longitude
                          : "google.navigation:q=" +
                              dataParent.latitude +
                              "+" +
                              dataParent.longitude
                      );
                    }}
                  />
                </MapView>
                <Text size="small">{dataParent.address}</Text>
              </View>
            )}
            {dataParent.detail_accomodation ? null : (
              <View style={styles.ViewFlight}>
                <View
                  style={{
                    flexDirection: "row",
                  }}
                >
                  <View
                    style={{
                      marginRight: 40,
                    }}
                  >
                    <Text size="small">{t("duration")} :</Text>
                    <View
                      style={{
                        marginTop: 10,
                        //   width: "80%",
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        backgroundColor: "#daf0f2",
                        borderRadius: 5,
                        alignContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text type="bold">
                        {Getdurasi(
                          dataParent.duration ? dataParent.duration : "00:00:00"
                        )}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text size="small">{t("time")} :</Text>
                    <View
                      style={{
                        marginTop: 10,
                        //   width: "80%",
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
                          OpenModaldate(dataParent.time, dataParent.duration)
                        }
                      >
                        {dataParent.time ? (
                          <GetStartTime startt={dataParent.time} />
                        ) : (
                          <Text size="description" type="bold">
                            00:00
                          </Text>
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() =>
                          OpenModaldate(dataParent.time, dataParent.duration)
                        }
                      >
                        {dataParent.duration ? (
                          <GetEndTime
                            startt={dataParent.time ? dataParent.time : "00:00"}
                            dur={
                              dataParent.duration
                                ? dataParent.duration
                                : "00:00"
                            }
                          />
                        ) : (
                          <Text size="description" type="bold">
                            00:00
                          </Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <View
              style={{
                paddingHorizontal: 15,
                paddingVertical: 10,
                borderBottomColor: "#f1f1f1",
                borderBottomWidth: 0.5,
              }}
            >
              <Text size="small">{t("notes")}</Text>
              <Text style={{marginTop: 10}}>
                {dataParent.note ? dataParent.note : "-"}
              </Text>
            </View>

            <View
              style={{
                paddingVertical: 10,
                paddingHorizontal: 15,
                // borderBottomColor: "#f1f1f1",
                // borderBottomWidth: 0.5,
              }}
            >
              <View style={{}}>
                <Text
                  size="description"
                  type="bold"
                  style={
                    {
                      // marginTop: 20,
                    }
                  }
                >
                  {t("Attachment")}
                </Text>
                <View
                  style={{
                    paddingTop: 5,
                  }}
                >
                  {dataParent?.attachment?.length > 0
                    ? dataParent.attachment.map((data, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              alignContent: "flex-start",
                              alignItems: "flex-start",
                              paddingVertical: 10,
                              borderBottomWidth: 0.5,
                              borderBottomColor: "#f1f1f1",
                            }}
                            key={index}
                          >
                            {/* <Text style={{ width: 30 }}>{index + 1}.</Text> */}
                            <FunDocument
                              filename={data.file_name}
                              filepath={data.filepath}
                              format={data.extention}
                              progressBar
                              icon
                              style={{
                                flex: 1,
                                flexDirection: "row",
                              }}
                            />
                            <TouchableOpacity
                              onPress={() => {
                                _handle_hapusParent(data, index, dataParent);
                              }}
                              style={{
                                flexDirection: "row",
                                paddingRight: 10,
                                paddingLeft: 25,
                                paddingVertical: 5,
                                height: "100%",
                                alignItems: "center",
                              }}
                            >
                              <Xhitam style={{}} width={10} height={10} />
                            </TouchableOpacity>
                          </View>
                        );
                      })
                    : null}
                </View>

                <View style={{flex: 1, marginVertical: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      pickFile(dataParent.id, "parent");
                    }}
                    style={{
                      width: "100%",
                      // borderColor: "black",
                      borderWidth: 1,
                      borderStyle: "dashed",
                      borderRadius: 5,
                      borderColor: "#d3d3d3",
                      justifyContent: "center",
                      alignContent: "center",
                      alignItems: "center",
                      paddingVertical: 10,
                      flexDirection: "row",
                      marginBottom: 5,
                    }}
                  >
                    <New height={15} width={15} />
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#d1d1d1",
                      }}
                    >
                      {t("ChooseFile")}
                    </Text>
                  </TouchableOpacity>
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      color: "#d1d1d1",
                    }}
                  >
                    {t("uploadFlightTicket")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      />

      {/* Modal edit activity */}
      <Modal
        onBackdropPress={() => {
          setModalMore(false);
        }}
        onRequestClose={() => setModalMore(false)}
        onDismiss={() => setModalMore(false)}
        animationType="fade"
        visible={modalMore}
        transparent={true}
      >
        <Pressable
          onPress={() => setModalMore(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            alignSelf: "center",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            // backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignSelf: "center",
            marginTop: Dimensions.get("screen").height / 2.5,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 60,
              // paddingHorizontal: 20,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
              }}
            >
              <Text style={{marginVertical: 15}} type="bold" size="title">
                {t("option")}
              </Text>
            </View>
            <Pressable
              onPress={() => setModalMore(false)}
              style={{
                position: "absolute",
                right: 0,
                width: 55,
                justifyContent: "center",
                alignItems: "center",
                height: 55,
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
            <TouchableOpacity
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
              }}
              onPress={() => {
                // setModalMore(false);
                handleEdit();
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  color: "#464646",
                  marginVertical: 15,
                }}
              >
                {t("edit")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignItems: "center",
              }}
              onPress={() => {
                setModalMore(false);
                setModalDeleteActivity(true);
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{
                  color: "#d75995",
                  marginVertical: 15,
                }}
              >
                {t("delete")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal Delete Activity */}
      <Modal
        useNativeDriver={true}
        visible={modalDeleteActivity}
        onRequestClose={() => setModalDeleteActivity(false)}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalDeleteActivity(false)}
          style={{
            width: Dimensions.get("screen").width + 25,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            left: -21,
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 140,
            // marginHorizontal: 70,
            alignSelf: "center",
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            alignContent: "center",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 2.5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 140,
              justifyContent: "center",
              borderRadius: 5,
            }}
          >
            <View
              style={{
                alignItems: "center",
                borderBottomColor: "#d1d1d1",
                borderBottomWidth: 1,
                borderTopRightRadius: 5,
                borderTopLeftRadius: 5,
                backgroundColor: "#f6f6f6",
              }}
            >
              <Text style={{marginVertical: 15}} size="title" type="bold">
                {t("deleteActivity")}
              </Text>
            </View>
            <Text
              style={{
                alignSelf: "center",
                textAlign: "center",
                marginTop: 20,
                marginHorizontal: 10,
              }}
              size="label"
              type="regular"
            >
              {t("DeleteActivityfromItinerary")}
            </Text>
            <View style={{marginTop: 20, marginHorizontal: 10}}>
              <Button
                onPress={() => {
                  // _handledeleteDay(
                  //   datadayaktif?.itinerary_id,
                  //   datadayaktif?.id
                  // );
                  // setModalDeleteActivity(false);
                  deleteactivity();
                }}
                color="secondary"
                text={t("delete")}
              ></Button>
              <Button
                onPress={() => {
                  setModalDeleteActivity(false);
                }}
                style={{marginVertical: 5}}
                variant="transparent"
                text={t("discard")}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Date */}
      <Modal
        onBackdropPress={() => {
          setModaldate(false);
        }}
        onRequestClose={() => setModaldate(false)}
        animationType="fade"
        visible={modaldate}
        transparent={true}
        style={{}}
      >
        <Pressable
          onPress={() => setModaldate(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
            borderRadius: 5,
          }}
        />

        <View
          style={{
            width: Dimensions.get("screen").width - 80,
            backgroundColor: "white",
            marginBottom: 70,
            paddingVertical: 30,
            paddingHorizontal: 20,
            alignContent: "center",
            alignItems: "center",
            borderRadius: 5,
            alignSelf: "center",
            marginTop: Dimensions.get("screen").height / 8,
          }}
        >
          <Text size="label">{t("setTimeForActivity")}</Text>
          <Text size="title" type="bold">
            {dataParent.name}
          </Text>

          <View
            style={{
              marginTop: 20,
              backgroundColor: "#f3f3f3",
              padding: 15,
              borderRadius: 5,
            }}
          >
            <Text
              size="label"
              // type="bold"
              style={{alignSelf: "center"}}
            >
              {t("From")}
            </Text>
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{width: "40%"}}>
                <Picker
                  iosIcon={
                    <View>
                      <Bottom />
                    </View>
                  }
                  iosHeader="Select Hours"
                  note
                  mode="dropdown"
                  selectedValue={hourFrom}
                  textStyle={{fontFamily: "Lato-Regular"}}
                  itemTextStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  itemStyle={{fontFamily: "Lato-Regular"}}
                  placeholderStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  headerTitleStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  style={{
                    color: "#209fae",
                    fontFamily: "Lato-Regular",
                  }}
                  onValueChange={(e) => setHourFrom(e)}
                >
                  {hour.map((item, index) => {
                    return (
                      <Picker.Item key={index} label={item} value={item} />
                    );
                  })}
                </Picker>
              </View>

              <View
                style={{
                  width: "5%",
                  alignItems: "center",
                  // alignContent: "flex-end",
                }}
              >
                <Text size="description" type="bold" style={{}}>
                  :
                </Text>
              </View>
              <View style={{width: "40%"}}>
                <Picker
                  iosHeader="Select Minutes"
                  headerBackButtonTextStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  note
                  mode="dropdown"
                  selectedValue={minuteFrom}
                  textStyle={{fontFamily: "Lato-Regular"}}
                  itemTextStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  itemStyle={{fontFamily: "Lato-Regular"}}
                  placeholderStyle={{
                    fontFamily: "Lato-Regular",
                  }}
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
                  onValueChange={(itemValue) => setminuteFrom(itemValue)}
                >
                  {minute.map((item, index) => {
                    return (
                      <Picker.Item key={index} label={item} value={item} />
                    );
                  })}
                </Picker>
              </View>
            </View>

            <Text
              size="label"
              // type="bold"
              style={{alignSelf: "center"}}
            >
              {t("To")}
            </Text>

            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{width: "40%"}}>
                <Picker
                  iosIcon={
                    <View>
                      <Bottom />
                    </View>
                  }
                  iosHeader="Select Hours"
                  note
                  mode="dropdown"
                  selectedValue={hourTo}
                  textStyle={{fontFamily: "Lato-Regular"}}
                  itemTextStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  itemStyle={{fontFamily: "Lato-Regular"}}
                  placeholderStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  headerTitleStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  style={{
                    color: "#209fae",
                    fontFamily: "Lato-Regular",
                  }}
                  onValueChange={(item) =>
                    sethourTo(item > hourFrom ? item : hourFrom)
                  }
                >
                  {hour.map((item, index) => {
                    return item >= hourFrom ? (
                      <Picker.Item key={index} label={item} value={item} />
                    ) : null;
                  })}
                </Picker>
              </View>

              <View
                style={{
                  width: "5%",
                  alignItems: "center",
                  // alignContent: "flex-end",
                }}
              >
                <Text size="description" type="bold" style={{}}>
                  :
                </Text>
              </View>
              <View style={{width: "40%"}}>
                <Picker
                  iosHeader="Select Minutes"
                  headerBackButtonTextStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  note
                  mode="dropdown"
                  selectedValue={minuteTo}
                  textStyle={{fontFamily: "Lato-Regular"}}
                  itemTextStyle={{
                    fontFamily: "Lato-Regular",
                  }}
                  itemStyle={{fontFamily: "Lato-Regular"}}
                  placeholderStyle={{
                    fontFamily: "Lato-Regular",
                  }}
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
                  onValueChange={(item) =>
                    setminuteTo(
                      hourTo >= hourFrom
                        ? minuteTo >= minuteFrom
                          ? item
                          : minuteFrom
                        : minuteFrom
                    )
                  }
                >
                  {minute.map((item, index) => {
                    return hourFrom === hourTo && item > minuteFrom ? (
                      <Picker.Item key={""} label={item + ""} value={item} />
                    ) : hourTo > hourFrom ? (
                      <Picker.Item key={""} label={item + ""} value={item} />
                    ) : null;
                  })}
                </Picker>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={() =>
              SetTimeline(
                hourFrom,
                minuteFrom,
                hourTo,
                minuteTo,
                props.route.params.data
              )
            }
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
              {t("save")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  ViewFlight: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 0.5,
  },
  ViewDepArr: {
    flexDirection: "row",
  },
  DepArrContainer: {
    marginRight: 40,
    height: normalize(60),
    justifyContent: "space-between",
    marginBottom: 5,
  },
  CheckContainer: {
    marginRight: 40,
    height: normalize(40),
    justifyContent: "space-between",
    marginBottom: 5,
  },
  FlightContainer: {
    marginVertical: 5,
    justifyContent: "space-between",
  },
  FlightContainerMap: {
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
