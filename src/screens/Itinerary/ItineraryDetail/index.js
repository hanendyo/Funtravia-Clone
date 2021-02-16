import { useMutation, useQuery } from "@apollo/client";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
// import Animated, { Easing } from "react-native-reanimated";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
  Image,
  ScrollView,
  Picker,
} from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import LinearGradient from "react-native-linear-gradient";
import { TabView, TabBar } from "react-native-tab-view";
import { default_image } from "../../../assets/png";
import {
  Settings,
  Arrowbackwhite,
  Bottom,
  Chat,
  Create,
  Delete,
  Disketpink,
  Google,
  Jalan,
  Love,
  Mobil,
  More,
  Next,
  OptionsVertWhite,
  Pencilgreen,
  Plus,
  PlusBlack,
  Plusgrey,
  Sharegreen,
  Xhitam,
} from "../../../assets/svg";
import {
  Button,
  Capital,
  Distance,
  FunIcon,
  Text,
  Truncate,
} from "../../../component";
import Sidebar from "../../../component/src/Sidebar";
import {
  dateFormatHari,
  dateFormatMDY,
  dateFormats,
} from "../../../component/src/dateformatter";
import ItineraryDetails from "../../../graphQL/Query/Itinerary/ItineraryDetails";
import Timeline from "../../../graphQL/Query/Itinerary/Timeline";
import ItineraryDay from "./itineraryday";
import Modal from "react-native-modal";
import DeleteDay from "../../../graphQL/Mutation/Itinerary/DeleteDay";
import { Textarea } from "native-base";
import moment from "moment";
import UpdateTimeline from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import DeleteActivity from "../../../graphQL/Mutation/Itinerary/DeleteActivity";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Updatecover from "../../../graphQL/Mutation/Itinerary/Updatecover";

const AnimatedIndicator = Animated.createAnimatedComponent(ActivityIndicator);
const { width, height } = Dimensions.get("screen");
const TabBarHeight = 48;
const HeaderHeight = Dimensions.get("screen").height * 0.35;
const SafeStatusBar = Platform.select({
  ios: 44,
  android: StatusBar.currentHeight,
});
const tab1ItemSize = (width - 30) / 2;
const tab2ItemSize = (width - 40) / 3;
const PullToRefreshDist = 150;

export default function ItineraryDetail(props) {
  /**
   * stats
   */
  const { t, i18n } = useTranslation();
  let [Cover, setCover] = useState(null);
  const [tabIndex, setIndex] = useState(0);
  const [routes] = useState([
    { key: "tab1", title: "Itinerary" },
    { key: "tab2", title: "Travel Picture" },
    { key: "tab3", title: "Diary" },
  ]);
  const [canScroll, setCanScroll] = useState(true);
  let dataList = [];
  const [tab2Data] = useState(Array(30).fill(0));
  const [tab3Data] = useState(Array(30).fill(0));
  let itincountries = props.route.params.country;
  let token = props.route.params.token;
  let [status, setStatus] = useState(props.route.params.status);
  let [idDay, setidDay] = useState(null);
  let [dataAkhir, setDataAkhir] = useState(null);
  let [indexnya, setIndexnya] = useState(0);
  let [datadayaktif, setdatadayaktifs] = useState(
    props.route.params.datadayaktif ? props.route.params.datadayaktif : {}
  );
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
  let [modalmenuday, setModalmenuday] = useState(false);
  let [Modalcustom, setModalcustom] = useState(false);
  let [textinput, setInput] = useState("");
  let [indexinput, setIndexInput] = useState("");
  let [positiondate, setPositiondate] = useState("");
  let [modal, setModal] = useState(false);
  let [modaldate, setModaldate] = useState(false);
  let [jamer, setjamer] = useState("00");
  let [menor, setmenor] = useState("00");
  let [idactivity, setidactivity] = useState("");
  let [types, settypes] = useState("");
  let [modalmenu, setModalmenu] = useState(false);
  let [showside, setshowside] = useState(false);
  let [modalcover, setmodalcover] = useState(false);
  let [users, setuser] = useState(null);
  const loadasync = async () => {
    let user = await AsyncStorage.getItem("setting");
    user = JSON.parse(user);
    await setuser(user.user);
  };
  let [Anggota, setAnggota] = useState(null);

  const {
    data: datadetail,
    loading: loadingdetail,
    error: errordetail,
    refetch: _Refresh,
  } = useQuery(ItineraryDetails, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: itincountries },
  });

  const GetTimeline = async (id) => {
    await setidDay(id ? id : idDay);
    await GetTimelin();
  };

  const {
    data: datatimeline,
    loading: loadingtimeline,
    error: errortimeline,
    refetch: GetTimelin,
  } = useQuery(Timeline, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
    variables: { id: idDay },
  });
  const setdatadayaktif = (data) => {
    setdatadayaktifs(data);
    props.navigation.setParams({ datadayaktif: data });
  };

  if (datatimeline && datatimeline.day_timeline.length) {
    dataList = datatimeline.day_timeline;
  }

  const setDataList = (tmpdata) => {
    dataList = tmpdata;
  };

  const GetStartTime = ({ startt }) => {
    var starttime = startt.split(":");

    return (
      <Text size="description" type="regular" style={{}}>
        {starttime[0]}:{starttime[1]}
      </Text>
    );
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

  const HitungWaktu = ({ lat1, lon1, lat2, lon2, unit, kecepatan }) => {
    let jarak = Distance({
      lat1: lat1,
      lon1: lon1,
      lat2: lat2,
      lon2: lon2,
      unit: unit,
    });
    let hasil = jarak / kecepatan;
    return hasil.toFixed(0) > 0 ? hasil.toFixed(0) : 1;
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View
        style={{
          flexDirection: "row",
        }}
      >
        {databuddy.map((value, i) => {
          if (i < 4) {
            return (
              <View key={i}>
                <Image
                  source={
                    value.user && value.user.picture
                      ? { uri: value.user.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 30,
                    width: 30,
                    borderRadius: 15,
                    marginLeft: -10,
                    borderWidth: 1.5,
                    borderColor: "#fff",
                  }}
                />
              </View>
            );
          }
        })}

        {databuddy.length > 1 ? (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="small" type="bold">
              <Truncate
                text={
                  // " " +
                  // t("with") +
                  "   " +
                  databuddy[1].user.first_name +
                  " " +
                  (databuddy.length > 2
                    ? " + " + (databuddy.length - 2) + " " + t("others")
                    : " ")
                }
                length={23}
              />
            </Text>
          </View>
        ) : null}
      </View>
    );
  };

  const dateFormatr = (date) => {
    var x = date.split(" ");
    return dateFormats(x[0]);
  };

  const cekAnggota = async () => {
    let useridasyc = users.id;
    let datX = [...datadetail.itinerary_detail.buddy];
    let anggota = datX.findIndex((k) => k["user_id"] === useridasyc);
    props.navigation.setOptions(HeaderComponent);

    await setAnggota(anggota < 0 ? false : true);
  };

  const [
    mutationUpdateCover,
    { loading: loadingcover, data: datacover, error: errorcover },
  ] = useMutation(Updatecover, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const Updatecovers = async (url) => {
    setloading(true);
    try {
      let response = await mutationUpdateCover({
        variables: {
          itinerary_id: itincountries,
          cover: url,
        },
      });

      if (errorcover) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (response.data.update_cover_itinerary.code !== 200) {
          throw new Error(response.data.update_cover_itinerary.message);
        } else {
          Refresh();
        }
      }
      setloading(false);
    } catch (error) {
      setloading(false);
      Alert.alert("" + error);
    }
  };

  const handlecover = () => {
    dataList.length > 0 && datadetail.itinerary_detail.cover === null
      ? Updatecovers(
          dataList[0].images !== null ? dataList[0].images : dataList[0].icon
        )
      : setCover(datadetail.itinerary_detail.cover);
  };

  const getcity = (data) => {
    var namakota = "";
    var hasil = "";
    // for (var x of data) {
    //   if (x.city !== namakota && x.city !== null) {
    //     namakota = x.city;
    //     hasil += Capital({ text: namakota }) + " - ";
    //   }
    // }
    hasil += Capital({ text: data[0].city });
    return hasil;
  };

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

  const _handledeleteDay = async (iditinerary, idDay) => {
    if (datadetail.itinerary_detail.day.length > 1) {
      try {
        let response = await mutationDeleteDay({
          variables: {
            itinerary_id: iditinerary,
            day_id: idDay,
          },
        });

        if (errordeleteday) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.delete_day.code !== 200) {
            throw new Error(response.data.delete_day.message);
          }
          await setdatadayaktif(datadetail.itinerary_detail.day[indexnya - 1]);
          await setidDay(datadetail.itinerary_detail.day[indexnya - 1].id);
          await setIndexnya(indexnya - 1);
          await setModalmenuday(false);
          await _Refresh();
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      await setModalmenuday(false);
      Alert.alert(t("alertdaynot"));
    }
  };

  const saveNotes = async () => {
    var tempData = [...dataList];
    tempData[indexinput].note = textinput;
    await setDataList(tempData);
    await setModal(false);
    await setidDay(idDay);
    savetimeline(tempData);
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

  const setTime = async (timeselected, nn) => {
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

      if (hasiljam === 23 && hasilmenit <= 59) {
        await setDataList(datas);
        savetimeline(datas);
        await setidDay(idDay);
        await setPositiondate("");
        await setModaldate(false);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        await setdatadayaktif(dataday);
      } else if (hasiljam < 23) {
        await setDataList(datas);
        savetimeline(datas);
        await setidDay(idDay);
        await setPositiondate("");
        await setModaldate(false);
        dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        await setdatadayaktif(dataday);
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

        await setidDay(idDay);

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

      await setidDay(idDay);

      Alert.alert("Waktu sudah melewati batas maksimal");
    }
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

  const savetimeline = async (datakiriman) => {
    try {
      let response = await mutationSaveTimeline({
        variables: {
          idday: idDay,
          value: JSON.stringify(datakiriman),
        },
      });
      if (loadingSave) {
        Alert.alert("Loading!!");
      }
      if (errorSave) {
        throw new Error("Error Input");
      }

      if (response.data) {
        if (response.data.update_timeline.code !== 200) {
          throw new Error(response.data.update_timeline.message);
        }
      }
    } catch (error) {
      Alert.alert("" + error);
    }
  };

  const bukamodalmenu = async (id, type) => {
    await setidactivity(id);
    await settypes(type);
    await setModalmenu(true);
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

  const deleteactivity = async (iditinerarys, idactivitys, typess) => {
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

        var Xdata = [...dataList];
        var inde = Xdata.findIndex((k) => k["id"] === idactivitys);

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
                  idday: idDay,
                  value: JSON.stringify(Xdata),
                },
              });

              if (errorSave) {
                throw new Error("Error Input");
              }
              if (response.data) {
                if (response.data.update_timeline.code !== 200) {
                  throw new Error(response.data.update_timeline.message);
                }
                GetTimelin();
              }
            } catch (error) {
              Alert.alert("" + error);
            }
          }
          await GetTimelin();
        }

        setModalmenu(false);
      }
    } catch (error) {
      Alert.alert("" + error);
      setModalmenu(false);
    }
  };

  const _handlerBack = async () => {
    props.navigation.navigate("TripPlaning", {
      index: status === "saved" ? 1 : 0,
    });
  };

  /** ---------------------------------------------------------------------------------------------------------------
   * ref
   */
  const HeaderComponent = {
    headerShown: true,
    title: "",
    headerTransparent: true,
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
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        {/* <Button
                text={""}
                size="medium"
                type="circle"
                variant="transparent"
                style={{
                  height: 55,
                }}
                onPress={() => Alert.alert("coming soon")}
              >
                <Book height={20} width={20} />
              </Button>
              <Button
                text={""}
                size="medium"
                type="circle"
                variant="transparent"
                style={{ height: 55 }}
                onPress={() => Alert.alert("coming soon")}
              >
                <Expences height={20} width={20} />
              </Button> */}
        {Anggota === true ? (
          <Button
            text={""}
            size="medium"
            type="circle"
            variant="transparent"
            style={{ height: 55 }}
            onPress={() =>
              props.navigation.navigate("ChatStack", {
                screen: "GroupRoom",
                params: {
                  room_id: itincountries,
                  name:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.name
                      : null,
                  picture: Cover,
                },
              })
            }
          >
            <Chat height={20} width={20} />
          </Button>
        ) : null}
        {Anggota === true ? (
          <Button
            text={""}
            size="medium"
            type="circle"
            variant="transparent"
            style={{ height: 55 }}
            onPress={() => setshowside(true)}
          >
            <OptionsVertWhite height={20} width={20} />
          </Button>
        ) : null}
      </View>
    ),
    headerRightStyle: {},
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => _handlerBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };

  let scrollY = useRef(new Animated.Value(0)).current;

  const headerScrollY = useRef(new Animated.Value(0)).current;
  // for capturing header scroll on Android
  const headerMoveScrollY = useRef(new Animated.Value(0)).current;
  const listRefArr = useRef([]);
  const listOffset = useRef({});
  const isListGliding = useRef(false);
  const headerScrollStart = useRef(0);
  const _tabIndex = useRef(0);
  const refreshStatusRef = useRef(false);
  let HEADER_MAX_HEIGHT = HeaderHeight;
  let HEADER_MIN_HEIGHT = Platform.OS === "ios" ? 75 : 60;
  let HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: "clamp",
  });
  const imageTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -50],
    extrapolate: "clamp",
  });

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const contentTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 50],
    extrapolate: "clamp",
  });

  const warna = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: ["#464646", "#fff"],
    // extrapolate: "clamp",
  });
  const warna2 = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: ["#838383", "#fff", "#fff"],
    extrapolate: "clamp",
  });

  const textLeft = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 50, 50],
    extrapolate: "clamp",
  });

  const textLefts = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [23, 0, 0],
    extrapolate: "clamp",
  });

  const textTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 20, 50],
    extrapolate: "clamp",
  });

  const textTops = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [-4, -2, 0],
    extrapolate: "clamp",
  });

  const textSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1.3, 1, 1],
    extrapolate: "clamp",
  });

  /**
   * PanResponder for header
   */
  const headerPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        syncScrollOffset();
        return false;
      },

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderEnd: (evt, gestureState) => {
        handlePanReleaseOrEnd(evt, gestureState);
      },
      onPanResponderMove: (evt, gestureState) => {
        const curListRef = listRefArr.current.find(
          (ref) => ref.key === routes[_tabIndex.current].key
        );
        const headerScrollOffset = -gestureState.dy + headerScrollStart.current;
        if (curListRef.value) {
          // scroll up
          if (headerScrollOffset > 0) {
            curListRef.value.scrollToOffset({
              offset: headerScrollOffset,
              animated: false,
            });
            // start pull down
          } else {
            if (Platform.OS === "ios") {
              curListRef.value.scrollToOffset({
                offset: headerScrollOffset / 3,
                animated: false,
              });
            } else if (Platform.OS === "android") {
              if (!refreshStatusRef.current) {
                headerMoveScrollY.setValue(headerScrollOffset / 1.5);
              }
            }
          }
        }
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollStart.current = scrollY._value;
      },
    })
  ).current;

  /**
   * PanResponder for list in tab scene
   */
  const listPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: (evt, gestureState) => false,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => false,
      onStartShouldSetPanResponder: (evt, gestureState) => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        headerScrollY.stopAnimation();
        return false;
      },
      onShouldBlockNativeResponder: () => true,
      onPanResponderGrant: (evt, gestureState) => {
        headerScrollY.stopAnimation();
      },
    })
  ).current;

  /**
   * effect
   */
  useEffect(() => {
    loadasync();
    scrollY.addListener(({ value }) => {
      const curRoute = routes[tabIndex].key;
      listOffset.current[curRoute] = value;
    });
    headerScrollY.addListener(({ value }) => {
      listRefArr.current.forEach((item) => {
        if (item.key !== routes[tabIndex].key) {
          return;
        }
        if (value > HeaderHeight || value < 0) {
          headerScrollY.stopAnimation();
          syncScrollOffset();
        }
        if (item.value && value <= HeaderHeight) {
          item.value.scrollToOffset({
            offset: value,
            animated: false,
          });
        }
      });
    });
    return () => {
      scrollY.removeAllListeners();
      headerScrollY.removeAllListeners();
    };
  }, [routes, tabIndex]);

  /**
   *  helper functions
   */
  const syncScrollOffset = () => {
    const curRouteKey = routes[_tabIndex.current].key;

    listRefArr.current.forEach((item) => {
      if (item.key !== curRouteKey) {
        if (scrollY._value < HeaderHeight && scrollY._value >= 0) {
          if (item.value) {
            item.value.scrollToOffset({
              offset: scrollY._value,
              animated: false,
            });
            listOffset.current[item.key] = scrollY._value;
          }
        } else if (scrollY._value >= HeaderHeight) {
          if (
            listOffset.current[item.key] < HeaderHeight ||
            listOffset.current[item.key] == null
          ) {
            if (item.value) {
              item.value.scrollToOffset({
                offset: HeaderHeight,
                animated: false,
              });
              listOffset.current[item.key] = HeaderHeight;
            }
          }
        }
      }
    });
  };

  const startRefreshAction = () => {
    if (Platform.OS === "ios") {
      listRefArr.current.forEach((listRef) => {
        listRef.value.scrollToOffset({
          offset: -50,
          animated: true,
        });
      });
      refresh().finally(() => {
        syncScrollOffset();
        // do not bounce back if user scroll to another position
        if (scrollY._value < 0) {
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      });
    } else if (Platform.OS === "android") {
      Animated.timing(headerMoveScrollY, {
        toValue: -150,
        duration: 300,
        useNativeDriver: true,
      }).start();
      refresh().finally(() => {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  const handlePanReleaseOrEnd = (evt, gestureState) => {
    // console.log('handlePanReleaseOrEnd', scrollY._value);
    syncScrollOffset();
    headerScrollY.setValue(scrollY._value);
    if (Platform.OS === "ios") {
      if (scrollY._value < 0) {
        if (scrollY._value < -PullToRefreshDist && !refreshStatusRef.current) {
          startRefreshAction();
        } else {
          // should bounce back
          listRefArr.current.forEach((listRef) => {
            listRef.value.scrollToOffset({
              offset: 0,
              animated: true,
            });
          });
        }
      } else {
        if (Math.abs(gestureState.vy) < 0.2) {
          return;
        }
        Animated.decay(headerScrollY, {
          velocity: -gestureState.vy,
          useNativeDriver: true,
        }).start(() => {
          syncScrollOffset();
        });
      }
    } else if (Platform.OS === "android") {
      if (
        headerMoveScrollY._value < 0 &&
        headerMoveScrollY._value / 1.5 < -PullToRefreshDist
      ) {
        startRefreshAction();
      } else {
        Animated.timing(headerMoveScrollY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onMomentumScrollBegin = () => {
    isListGliding.current = true;
  };

  const onMomentumScrollEnd = () => {
    isListGliding.current = false;
    syncScrollOffset();
    // console.log('onMomentumScrollEnd');
  };

  const onScrollEndDrag = (e) => {
    syncScrollOffset();

    const offsetY = e.nativeEvent.contentOffset.y;
    // console.log('onScrollEndDrag', offsetY);
    // iOS only
    if (Platform.OS === "ios") {
      if (offsetY < -PullToRefreshDist && !refreshStatusRef.current) {
        startRefreshAction();
      }
    }

    // check pull to refresh
  };

  const refresh = async () => {
    console.log("-- start refresh");
    refreshStatusRef.current = true;
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("done");
      }, 2000);
    }).then((value) => {
      console.log("-- refresh done!");
      refreshStatusRef.current = false;
    });
  };

  /**
   * render Helper
   */
  const renderHeader = () => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [0, -HeaderHeight + 60],
      extrapolateRight: "clamp",
      // extrapolate: 'clamp',
    });
    return (
      <Animated.View
        {...headerPanResponder.panHandlers}
        onLayout={() => {
          cekAnggota();
        }}
        style={{
          transform: [{ translateY: y }],
          height: HeaderHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          position: "absolute",
          backgroundColor: "#209fae",
        }}
      >
        <Animated.View
          style={{
            height: 90,
            width: "100%",
            position: "absolute",
            zIndex: 1,

            top: 0,
            left: 0,
            opacity: imageOpacity,
          }}
        >
          <LinearGradient
            colors={["rgba(0, 0, 0, 1)", "rgba(34, 34, 34, 0)"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              height: 90,
              width: "100%",
            }}
          ></LinearGradient>
        </Animated.View>
        <Animated.Image
          source={Cover ? { uri: Cover } : default_image}
          style={{
            opacity: imageOpacity,
            // transform: [{ translateY: imageTranslate }],
            width: "100%",
            height: HEADER_MAX_HEIGHT - 110,
            resizeMode: "cover",
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            bottom: 62,
            left: 15,
            transform: [{ translateY: textTop }, { translateX: textLeft }],
            zIndex: 9,
          }}
        >
          <Animated.Text
            allowFontScaling={false}
            style={{
              transform: [
                { translateX: textLefts },
                { translateY: textTops },
                {
                  scale: textSize,
                },
              ],
              fontFamily: "Lato-Bold",
              // color: warna,
            }}
          >
            {datadetail && datadetail.itinerary_detail ? (
              <Truncate text={datadetail.itinerary_detail.name} length={30} />
            ) : null}
          </Animated.Text>
          <View
            style={{
              flexDirection: "row",
              // paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <Animated.Text
              size="small"
              type="bold"
              style={{
                // color: warna2,
                fontFamily: "Lato-Bold",
                fontSize: 12,
              }}
            >
              {/* {t("dates")} :{" "} */}
              {datadetail && datadetail.itinerary_detail
                ? dateFormatr(datadetail.itinerary_detail.start_date) +
                  "  -  " +
                  dateFormatr(datadetail.itinerary_detail.end_date)
                : null}
            </Animated.Text>
          </View>
        </Animated.View>
        <Animated.View
          style={{
            width: "100%",
            backgroundColor: "white",
            // transform: [{ translateY: contentTranslate }],
            height: 55,
            opacity: imageOpacity,
            paddingHorizontal: 20,
            paddingVertical: 10,
            width: "100%",
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            size="title"
            type="black"
            style={{
              color: "white",
            }}
          ></Text>
          {datadetail &&
          datadetail.itinerary_detail &&
          datadetail.itinerary_detail.isprivate === true ? (
            <Button
              onPress={() => Alert.alert("coming soon")}
              type="circle"
              variant="bordered"
              size="small"
              style={{
                flexDirection: "row",
                width: 80,
                alignContent: "center",
                alignItems: "center",
                // paddingHorizontal: 20,
              }}
            >
              <Sharegreen height={15} width={15} />
              <Text size="small" style={{ marginLeft: 5, color: "#209fae" }}>
                {t("share")}
              </Text>
            </Button>
          ) : null}
        </Animated.View>
        <Animated.View
          style={{
            opacity: imageOpacity,
            // transform: [{ translateY: contentTranslate }],
            paddingVertical: 5,
            paddingHorizontal: 20,
            width: "100%",
            height: 55,
            backgroundColor: "white",
          }}
        >
          {datadetail && datadetail.itinerary_detail ? (
            <TouchableOpacity
              onPress={() => {
                props.navigation.push("ItineraryBuddy", {
                  iditin:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.id
                      : null,
                  token: token ? token : null,
                  dataitin:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail
                      : null,
                  databuddy:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.buddy
                      : null,
                  created_by:
                    datadetail && datadetail.itinerary_detail
                      ? datadetail.itinerary_detail.created_by
                      : null,
                });
              }}
              style={{
                flexDirection: "row",
                // marginTop: 5,
                paddingVertical: 7,
                paddingHorizontal: 10,
                alignItems: "center",
                alignContent: "center",
                justifyContent: "flex-start",
                // borderWidth: 1,
                borderRadius: 5,
                backgroundColor: "#daf0f2",
              }}
            >
              <View
                style={{
                  backgroundColor: "#209fae",
                  width: 7,
                  height: 17,
                  borderRadius: 5,
                  marginRight: 5,
                }}
              ></View>
              <Text
                size="small"
                type="bold"
                style={{
                  marginRight: 15,
                }}
              >
                {t("travelBuddy")} :
              </Text>
              <RenderBuddy databuddy={datadetail.itinerary_detail.buddy} />
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      </Animated.View>
    );
  };

  const rednerTab1Item = ({ item, index }) => {
    const x = dataList.length - 1;
    return (
      <View
        style={{
          marginTop: -1,
          // height: item.note ? 210 : 170,
          width: "100%",
          backgroundColor: "#f6f6f6",
          flexDirection: "row",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          shadowColor: "#d3d3d3",
          // shadowOffset: isActive ? { width: 2, height: 2 } : {},
          // shadowOpacity: isActive ? 1 : 0,
          // shadowRadius: isActive ? 2 : 0,
          // elevation: isActive ? 5 : 0,
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
                height: 25,
                marginRight: 4.2,
                // borderBottomWidth: 1,
                // borderRightWidth: index && index > 0 ? 1 : 0,
                borderRightWidth: index > 0 ? 1 : 0,
                borderRightColor: "#464646",
              }}
            ></View>

            <View
              style={{
                marginTop: -20,
                flexDirection: "row",
                position: "absolute",
                top: 25,
                justifyContent: "center",
                alignItems: "center",
                zIndex: 99,
              }}
            >
              <View
                style={{
                  width: "80%",
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
                    status !== "saved" && Anggota === true
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

                <TouchableOpacity
                  onPress={() => {
                    status !== "saved" && Anggota === true
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
                borderRightWidth: index < x ? 1 : 0,
                borderRightColor: "#464646",
              }}
            ></View>
          </View>

          {/* garis======================= */}
        </View>

        <View
          style={{
            height: "100%",
            width: "80%",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              paddingLeft: 10,
              paddingRight: 2,
              paddingBottom: 1,
            }}
          >
            {index > 0 &&
            dataList[index - 1] &&
            dataList[index].latitude == dataList[index - 1].latitude &&
            dataList[index].longitude == dataList[index - 1].longitude ? (
              <View
                style={{
                  width: 20,
                  marginLeft: 20,
                }}
              >
                <View
                  style={{
                    borderLeftWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: "#464646",
                    height: 30,
                  }}
                ></View>
                {dataList[index + 1] &&
                dataList[index].latitude == dataList[index + 1].latitude &&
                dataList[index].longitude == dataList[index + 1].longitude ? (
                  <View
                    style={{
                      marginTop: -1,
                      borderLeftWidth: 1,
                      borderColor: "#464646",
                      flex: 1,
                    }}
                  ></View>
                ) : null}
              </View>
            ) : null}
            <View
              style={{
                marginTop: 5,
                flex: 1,
                borderRadius: 5,
                marginBottom: 2,
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
                  style={{ flex: 1, paddingHorizontal: 10 }}
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
                            : "Destination from Google"
                          : "Custom Activity",
                    })}
                  </Text>
                </TouchableOpacity>
                {status !== "saved" && Anggota === true ? (
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
                ) : null}
              </View>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  paddingVertical: 5,
                  justifyContent: "space-between",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#daf0f2",
                    paddingVertical: 5,
                    paddingHorizontal: 15,
                    borderRadius: 20,
                  }}
                >
                  <Text>
                    {Getdurasi(item.duration ? item.duration : "00:00:00")}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Coming soon");
                  }}
                >
                  <Next width={15} height={15} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: "#d3d3d3",
                  marginTop: 5,
                  paddingTop: 5,
                }}
              >
                {item.note ? (
                  <TouchableOpacity
                    onPress={() =>
                      status !== "saved" && Anggota === true
                        ? bukaModal(item.note, index)
                        : null
                    }
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        textAlign: "left",
                      }}
                    >
                      {item.note}
                    </Text>
                  </TouchableOpacity>
                ) : status !== "saved" && Anggota === true ? (
                  <TouchableOpacity
                    onPress={() =>
                      status !== "saved" && Anggota === true
                        ? bukaModal(null, index)
                        : null
                    }
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Pencilgreen width={10} height={10} />
                    <Text
                      size="small"
                      type="regular"
                      style={{
                        marginLeft: 5,
                        color: "#209fae",
                      }}
                    >
                      {t("addNotes")}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
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
                  width: 15,
                  borderTopWidth: 1,
                  borderTopColor: "#464646",
                }}
              ></View>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <View
                  style={{
                    marginRight: 5,
                    borderRadius: 5,
                    elevation: 3,
                    marginVertical: 2,
                    marginLeft: 1,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Jalan height={15} width={15} style={{ marginRight: 10 }} />
                  <Text>
                    <Distance
                      lat1={dataList[index].latitude}
                      lon1={dataList[index].longitude}
                      lat2={dataList[index + 1].latitude}
                      lon2={dataList[index + 1].longitude}
                      unit={"km"}
                    />{" "}
                    Km
                  </Text>
                  <Text> - </Text>
                  <Text>
                    <HitungWaktu
                      lat1={dataList[index].latitude}
                      lon1={dataList[index].longitude}
                      lat2={dataList[index + 1].latitude}
                      lon2={dataList[index + 1].longitude}
                      unit={"km"}
                      kecepatan={10}
                    />
                    {" Jam"}
                  </Text>
                </View>
                <View
                  style={{
                    marginRight: 5,
                    borderRadius: 5,
                    elevation: 3,
                    marginVertical: 2,
                    marginLeft: 1,
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    paddingHorizontal: 10,
                    paddingVertical: 10,
                    alignItems: "center",
                  }}
                >
                  <Mobil height={15} width={15} style={{ marginRight: 10 }} />
                  <Text>
                    <Distance
                      lat1={dataList[index].latitude}
                      lon1={dataList[index].longitude}
                      lat2={dataList[index + 1].latitude}
                      lon2={dataList[index + 1].longitude}
                      unit={"km"}
                    />{" "}
                    Km
                  </Text>
                  <Text> - </Text>
                  <Text>
                    <HitungWaktu
                      lat1={dataList[index].latitude}
                      lon1={dataList[index].longitude}
                      lat2={dataList[index + 1].latitude}
                      lon2={dataList[index + 1].longitude}
                      unit={"km"}
                      kecepatan={60}
                    />
                    {" Jam"}
                  </Text>
                </View>
              </ScrollView>
            </View>
          ) : null}
        </View>
      </View>
    );
  };

  const rednerTab2Item = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: index % 3 === 0 ? 0 : 10,
          borderRadius: 16,
          width: tab2ItemSize,
          height: tab2ItemSize,
          backgroundColor: "#aaa",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{index}</Text>
      </View>
    );
  };

  const rednerTab3Item = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: index % 3 === 0 ? 0 : 10,
          borderRadius: 16,
          width: tab2ItemSize,
          height: tab2ItemSize,
          backgroundColor: "#aaa",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>{index}</Text>
      </View>
    );
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "flex-end",
          width: Dimensions.get("screen").width / 3,
        }}
      >
        <Text
          type={focused ? "bold" : "regular"}
          style={{
            color: focused ? "#209FAE" : "#464646",
          }}
        >
          {route.title}
        </Text>
      </View>
    );
  };

  const renderScene = ({ route }) => {
    const focused = route.key === routes[tabIndex].key;
    let numCols;
    let data;
    let renderItem;
    switch (route.key) {
      case "tab1":
        numCols = 1;
        data = dataList;
        renderItem = rednerTab1Item;
        break;
      case "tab2":
        numCols = 3;
        data = tab2Data;
        renderItem = rednerTab2Item;
        break;
      case "tab3":
        numCols = 3;
        data = tab2Data;
        renderItem = rednerTab2Item;
        break;
      default:
        return null;
    }
    return (
      <Animated.FlatList
        scrollToOverflowEnabled={true}
        scrollEnabled={canScroll}
        {...listPanResponder.panHandlers}
        numColumns={numCols}
        ref={(ref) => {
          if (ref) {
            const found = listRefArr.current.find((e) => e.key === route.key);
            if (!found) {
              listRefArr.current.push({
                key: route.key,
                value: ref,
              });
            }
          }
        }}
        scrollEventThrottle={16}
        onScroll={
          focused
            ? Animated.event(
                [
                  {
                    nativeEvent: { contentOffset: { y: scrollY } },
                  },
                ],
                { useNativeDriver: true }
              )
            : null
        }
        onMomentumScrollBegin={onMomentumScrollBegin}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollEnd={onMomentumScrollEnd}
        // ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListHeaderComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{
          paddingTop: HeaderHeight + TabBarHeight + 60,
          paddingHorizontal: 15,
          minHeight: height - SafeStatusBar + HeaderHeight + 60,
          paddingBottom: 70,
        }}
        ListFooterComponent={() => (
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              paddingTop: 100,
            }}
          >
            {loadingtimeline ? (
              <Text>Loading...</Text>
            ) : dataList.length == 0 ? (
              <Text>No data</Text>
            ) : (
              handlecover()
            )}
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        data={data}
        renderItem={renderItem}
        ListHeaderComponent={
          tabIndex == 0 && datadayaktif && datadayaktif.date ? (
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
                marginBottom: 10,
              }}
            >
              <View
                onLayout={() => {
                  _fetchItem(
                    dataList[0]
                      ? dataList[0].city
                      : datadetail.itinerary_detail.city.name,
                    dataList[0]
                      ? dataList[0].latitude
                      : datadetail.itinerary_detail.city.latitude,
                    dataList[0]
                      ? dataList[0].longitude
                      : datadetail.itinerary_detail.city.longitude
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
                  {dataList.length > 0 ? (
                    <Truncate text={getcity(dataList)} length={35} />
                  ) : (
                    <Capital
                      text={datadetail.itinerary_detail.city.name}
                      length={35}
                    />
                  )}
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
                  {status !== "saved" && Anggota === true ? (
                    <Button
                      size="small"
                      text=""
                      type="circle"
                      variant="transparent"
                      style={{}}
                      onPress={() => {
                        setModalmenuday(true);
                      }}
                    >
                      <More width={15} height={15} />
                    </Button>
                  ) : null}
                </View>
              ) : null}
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        initialScrollIndex={0}
      />
    );
  };

  const renderTabBar = (props) => {
    const y = scrollY.interpolate({
      inputRange: [0, HeaderHeight],
      outputRange: [HeaderHeight, 60],
      // extrapolate: 'clamp',
      extrapolateRight: "clamp",
    });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: "absolute",
          transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <TabBar
          {...props}
          onTabPress={({ route, preventDefault }) => {
            if (isListGliding.current) {
              preventDefault();
            }
          }}
          style={{
            elevation: 0,
            shadowOpacity: 0,
            backgroundColor: "white",
            height: TabBarHeight,
          }}
          renderLabel={renderLabel}
          indicatorStyle={{
            backgroundColor: "#209fae",
          }}
        />
        <View
          style={{
            backgroundColor: "white",
          }}
        >
          {loadingdetail ? (
            <View
              style={{
                height: 47,
                width: "100%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text>Loading...</Text>
            </View>
          ) : (
            <ItineraryDay
              dataitin={datadetail.itinerary_detail}
              dataDay={datadetail.itinerary_detail.day}
              props={props}
              token={token}
              lat={datadetail.itinerary_detail.city.latitude}
              long={datadetail.itinerary_detail.city.longitude}
              kota={datadetail.itinerary_detail.city.name}
              iditinerary={itincountries}
              getdata={() => setParamAdd(true)}
              dataAkhir={dataAkhir}
              setAkhir={(e) => setDataAkhir(e)}
              setidDayz={(e) => setidDay(e)}
              GetTimeline={(e) => GetTimeline(e)}
              setCover={(e) => setCover(e)}
              cover={datadetail.itinerary_detail.cover}
              datadayaktif={datadayaktif}
              setdatadayaktif={(e) => setdatadayaktif(e)}
              setLoading={(e) => setloading(e)}
              Refresh={(e) => _Refresh(e)}
              status={status && status === "saved" ? "saved" : "notsaved"}
              indexnya={indexnya}
              setIndex={(e) => setIndexnya(e)}
              Anggota={Anggota}
            />
          )}
        </View>
      </Animated.View>
    );
  };

  const renderTabView = () => {
    return (
      <TabView
        onSwipeStart={() => setCanScroll(false)}
        onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          width: width,
        }}
      />
    );
  };

  const renderCustomRefresh = () => {
    // headerMoveScrollY
    return Platform.select({
      ios: (
        <AnimatedIndicator
          style={{
            top: -50,
            position: "absolute",
            alignSelf: "center",
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [-100, 0],
                  outputRange: [120, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
          }}
          animating
        />
      ),
      android: (
        <Animated.View
          style={{
            transform: [
              {
                translateY: headerMoveScrollY.interpolate({
                  inputRange: [-300, 0],
                  outputRange: [150, 0],
                  extrapolate: "clamp",
                }),
              },
            ],
            backgroundColor: "#eee",
            height: 38,
            width: 38,
            borderRadius: 19,
            borderWidth: 2,
            borderColor: "#ddd",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            top: -50,
            position: "absolute",
          }}
        >
          <ActivityIndicator animating />
        </Animated.View>
      ),
    });
  };

  return (
    <View style={styles.container}>
      {renderTabView()}
      {renderHeader()}
      {renderCustomRefresh()}

      {Anggota === true ? (
        status && status === "saved" ? (
          <View
            style={{
              zIndex: 999999,
              position: "absolute",
              left: 0,
              bottom: 0,
              width: Dimensions.get("window").width,
              backgroundColor: "white",
              borderTopWidth: 1,
              borderColor: "#F0F0F0",
              shadowColor: "#F0F0F0",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 3,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              disabled
              text={t("addDestination")}
              size="large"
              style={{
                backgroundColor: "#d3d3d3",
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            ></Button>

            <View
              style={{
                height: "100%",
                width: "50%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                disabled
                text=""
                size="large"
                color="tertiary"
                type="circle"
                style={{
                  backgroundColor: "#f3f3f3",
                  borderRadius: 0,
                  width: "50%",
                  height: 56,
                  fontSize: 18,
                }}
              >
                <Plusgrey width={20} height={20} />
                <Text size="small" style={{ color: "#d3d3d3" }}>
                  {t("addOption")}
                </Text>
              </Button>
              <Button
                onPress={() => {
                  setStatus("Edit"), setshowside(false);
                }}
                text=""
                size="large"
                variant="transparent"
                type="circle"
                style={{
                  backgroundColor: "white",
                  borderRadius: 0,
                  width: "50%",
                  height: 56,
                  fontSize: 18,
                }}
              >
                <Create width={20} height={20} />
                <Text
                  size="small"
                  style={
                    {
                      // color: '#d75995'
                    }
                  }
                >
                  {t("edit")}
                </Text>
              </Button>
            </View>
          </View>
        ) : (
          <View
            style={{
              zIndex: 999999,
              position: "absolute",
              left: 0,
              bottom: 0,
              width: Dimensions.get("window").width,
              backgroundColor: "white",
              borderTopWidth: 1,
              borderColor: "#F0F0F0",
              shadowColor: "#F0F0F0",
              shadowOffset: { width: 2, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 2,
              elevation: 3,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Button
              onPress={() => {
                let maxjam = datadayaktif.total_hours.split(":");
                let jam = parseFloat(maxjam[0]);
                let menit = parseFloat(maxjam[1]);
                if (jam < 24) {
                  if (jam < 23) {
                    props.navigation.push("itindest", {
                      IdItinerary: itincountries,
                      token: token,
                      datadayaktif: datadayaktif,
                      dataDes:
                        datadetail && datadetail.itinerary_detail
                          ? datadetail
                          : null,
                      lat: datadetail.itinerary_detail.city.latitude,
                      long: datadetail.itinerary_detail.city.longitude,
                    });
                  } else if (jam === 23 && menit === 0) {
                    props.navigation.push("itindest", {
                      IdItinerary: itincountries,
                      token: token,
                      datadayaktif: datadayaktif,
                      dataDes:
                        datadetail && datadetail.itinerary_detail
                          ? datadetail
                          : null,
                      lat: datadetail.itinerary_detail.city.latitude,
                      long: datadetail.itinerary_detail.city.longitude,
                    });
                  } else {
                    Alert.alert(t("alertjam"));
                  }
                } else {
                  Alert.alert(t("alertjam"));
                }
              }}
              text={t("addDestination")}
              size="large"
              style={{
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            ></Button>

            <View
              style={{
                height: "100%",
                width: "50%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Button
                onPress={() => {
                  setModalcustom(true);
                }}
                text=""
                size="large"
                color="tertiary"
                type="circle"
                style={{
                  borderRadius: 0,
                  width: "50%",
                  height: 56,
                  fontSize: 18,
                }}
              >
                <Plus width={20} height={20} />
                <Text size="small" style={{ color: "#209fae" }}>
                  {t("addOption")}
                </Text>
              </Button>
              <Button
                onPress={() => {
                  completePlan();
                }}
                text=""
                size="large"
                variant="transparent"
                type="circle"
                style={{
                  borderRadius: 0,
                  width: "50%",
                  height: 56,
                  fontSize: 18,
                }}
              >
                <Disketpink width={20} height={20} />
                <Text size="small" style={{ color: "#d75995" }}>
                  {t("completePlan")}
                </Text>
              </Button>
            </View>
          </View>
        )
      ) : (
        <View
          style={{
            zIndex: 999999,
            position: "absolute",
            left: 0,
            bottom: 0,
            width: Dimensions.get("window").width,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#F0F0F0",
            shadowColor: "#F0F0F0",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <Button
              onPress={() => Alert.alert("Coming soon")}
              text=""
              size="medium"
              color="tertiary"
              type="circle"
              style={{
                backgroundColor: "#f2dae5",
                borderRadius: 5,
                marginVertical: 10,
                marginRight: 10,
              }}
            >
              <Love width={20} height={20} />
            </Button>
            <Button
              onPress={() => Alert.alert("Coming soon")}
              text={t("CopyTrip")}
              size="medium"
              style={{
                flex: 1,
                borderRadius: 5,
                marginVertical: 10,
              }}
            ></Button>
          </View>
        </View>
      )}

      <Modal
        onBackdropPress={() => {
          setModalmenuday(false);
        }}
        onRequestClose={() => setModalmenuday(false)}
        onDismiss={() => setModalmenuday(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modalmenuday}
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
              _handledeleteDay(datadayaktif.itinerary_id, datadayaktif.id);
            }}
          >
            <Text style={{ color: "#d75995" }}>
              {t("delete")} {t("day")} {datadayaktif.day} {t("from")}{" "}
              {t("Itinerary")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        onRequestClose={() => {
          setModalcustom(false);
        }}
        onBackdropPress={() => {
          setModalcustom(false);
        }}
        onSwipeComplete={() => {
          setModalcustom(false);
        }}
        swipeDirection={"down"}
        isVisible={Modalcustom}
        style={{ justifyContent: "flex-end", padding: 0, margin: 0 }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: "100%",
            // borderWidth: 1,
          }}
        >
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: "#209FAE",
              paddingVertical: 10,
              paddingHorizontal: 20,
            }}
          >
            <Text
              size="label"
              type="bold"
              style={{
                color: "white",
              }}
            >
              {t("addDestinationForm")}
            </Text>
            <TouchableOpacity
              style={{}}
              onPress={() => {
                setModalcustom(false);
              }}
            >
              <Xhitam width={20} height={20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("CustomItinerary", {
                    idItin: itincountries,
                    idDay: datadayaktif.id,
                    itintitle: props.route.params.itintitle,
                    dateitin: props.route.params.dateitin,
                    datadayaktif: datadayaktif,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("CustomItinerary", {
                    idItin: itincountries,
                    idDay: datadayaktif.id,
                    itintitle: props.route.params.itintitle,
                    dateitin: props.route.params.dateitin,
                    datadayaktif: datadayaktif,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            style={{
              marginVertical: 2.5,
              width: "100%",
              height: Dimensions.get("screen").width * 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <PlusBlack height={15} width={15} />
            </View>
            <View>
              <Text size="description" type="bold">
                {t("createActivity")}
              </Text>
              <Text size="small" type="regular">
                {t("addCustomActivity")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("AccountStack", {
                    screen: "Wishlist",
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("AccountStack", {
                    screen: "Wishlist",
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            style={{
              marginVertical: 2.5,
              width: "100%",
              height: Dimensions.get("screen").width * 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
              borderRadius: 5,
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Love height={15} width={15} />
            </View>
            <View>
              <Text size="description" type="bold">
                {t("myWishlist")}
              </Text>
              <Text size="small" type="regular">
                {t("addFromWishtlist")}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("ItinGoogle", {
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    token: token,
                    datadayaktif: datadayaktif,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("ItinGoogle", {
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    token: token,
                    datadayaktif: datadayaktif,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            style={{
              marginVertical: 2.5,
              width: "100%",
              height: Dimensions.get("screen").width * 0.2,
              borderBottomWidth: 1,
              borderBottomColor: "#d1d1d1",
              borderRadius: 5,
              flexDirection: "row",
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Google height={15} width={15} />
            </View>
            <View>
              <Text size="description" type="bold">
                {t("searchFromGoogle")}
              </Text>
              <Text size="small" type="regular">
                {t("addDestinationGoogle")}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: Dimensions.get("window").width,
            backgroundColor: "white",
            borderTopWidth: 1,
            borderColor: "#F0F0F0",
            shadowColor: "#F0F0F0",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 3,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            onPress={() => {
              setModalcustom(false);
              let maxjam = datadayaktif.total_hours.split(":");
              let jam = parseFloat(maxjam[0]);
              let menit = parseFloat(maxjam[1]);
              if (jam < 24) {
                if (jam < 23) {
                  props.navigation.push("itindest", {
                    IdItinerary: itincountries,
                    token: token,
                    datadayaktif: datadayaktif,
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else if (jam === 23 && menit === 0) {
                  props.navigation.push("itindest", {
                    IdItinerary: itincountries,
                    token: token,
                    datadayaktif: datadayaktif,
                    dataDes:
                      datadetail && datadetail.itinerary_detail
                        ? datadetail
                        : null,
                    lat: datadetail.itinerary_detail.city.latitude,
                    long: datadetail.itinerary_detail.city.longitude,
                  });
                } else {
                  Alert.alert(t("alertjam"));
                }
              } else {
                Alert.alert(t("alertjam"));
              }
            }}
            text={t("addDestination")}
            size="large"
            style={{
              borderRadius: 0,
              width: "50%",
              height: 56,
              fontSize: 18,
            }}
          ></Button>

          <View
            style={{
              height: "100%",
              width: "50%",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              text=""
              size="large"
              color="tertiary"
              type="circle"
              style={{
                opacity: 0.5,
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Plus width={20} height={20} />
              <Text size="small" style={{ color: "#209fae" }}>
                {t("addOption")}
              </Text>
            </Button>
            <Button
              onPress={() => {
                completePlan();
                setModalcustom(false);
              }}
              text=""
              size="large"
              variant="transparent"
              type="circle"
              style={{
                borderRadius: 0,
                width: "50%",
                height: 56,
                fontSize: 18,
              }}
            >
              <Disketpink width={20} height={20} />
              <Text size="small" style={{ color: "#d75995" }}>
                {t("completePlan")}
              </Text>
            </Button>
          </View>
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
              width: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ width: "30%" }}>
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
            </View>

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
            <View style={{ width: "30%" }}>
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
                  return (
                    <Picker.Item key={""} label={item + ""} value={item} />
                  );
                })}
              </Picker>
            </View>
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
              deleteactivity(itincountries, idactivity, types);
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

      <Sidebar
        props={props}
        show={showside}
        Data={() => {
          return (
            <View
              style={{
                padding: 10,
                width: "100%",
                justifyContent: "flex-start",
              }}
            >
              {Anggota === true ? (
                <TouchableOpacity
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    width: "100%",
                    paddingVertical: 2,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setmodalcover(true), setshowside(false);
                  }}
                >
                  <Create height={15} width={15} />

                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {t("EditCover")}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {Anggota === true ? (
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    paddingVertical: 2,
                    alignItems: "center",
                    marginVertical: 5,
                  }}
                  onPress={() => {
                    props.navigation.push("SettingItin", {
                      token: token,
                      iditin: itincountries,
                      isPrivate:
                        datadetail && datadetail.itinerary_detail
                          ? datadetail.itinerary_detail.isprivate
                          : false,
                    }),
                      setshowside(false);
                  }}
                >
                  <Settings height={15} width={15} />
                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {t("setting")}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {Anggota === true ? (
                <TouchableOpacity
                  style={{
                    marginVertical: 5,
                    flexDirection: "row",
                    width: "100%",
                    paddingVertical: 2,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    _handlehapus(itincountries), setshowside(false);
                  }}
                >
                  <Delete height={15} width={15} />

                  <Text
                    size="label"
                    type="regular"
                    style={{
                      marginLeft: 10,
                    }}
                  >
                    {t("delete")}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          );
        }}
        setClose={(e) => setshowside(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HeaderHeight,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "#FFA088",
  },
  label: { fontSize: 16, color: "#222" },
  tab: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: "#FFCC80",
    height: TabBarHeight,
  },
  indicator: { backgroundColor: "#222" },
});

// export default ItineraryDetail;
