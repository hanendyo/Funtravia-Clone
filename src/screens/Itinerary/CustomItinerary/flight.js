import React, {useState, useEffect, useRef} from "react";
import {
  View,
  Dimensions,
  Alert,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Linking,
  SafeAreaView,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Pressable,
  Platform,
  StyleSheet,
  StatusBar,
  NativeModules,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useMutation} from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  ArrowRight,
  CalendarIcon,
  Delete,
  More,
  New,
  Plane,
  Xhitam,
  Pointmapblack,
  Arrowbackios,
  Magnifying,
  Xblue,
} from "../../../assets/svg";
import {
  FloatingInput,
  Truncate,
  Peringatan,
  FunDocument,
  Distance,
} from "../../../component";
import {Button, Text, Loading, FunIcon, Capital} from "../../../component";
import {useTranslation} from "react-i18next";
import MapView, {Marker} from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import {ReactNativeFile} from "apollo-upload-client";
import DeviceInfo from "react-native-device-info";
import Modal from "react-native-modal";
import AddFlight from "../../../graphQL/Mutation/Itinerary/AddCustomFlight";
import UpdateCustomFlight from "../../../graphQL/Mutation/Itinerary/UpdateCustomFlight";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {request, check, PERMISSIONS} from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import {useSelector} from "react-redux";
import {RNToasty} from "react-native-toasty";
import normalize from "react-native-normalize";
import {API_KEY} from "../../../config";
import moment from "moment";
import UpdateTimelines from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";
import {StackActions} from "@react-navigation/native";
// import { Input } from "native-base";
// import { default_image } from "../../../assets/png";
// import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
// import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
// import Swipeout from "react-native-swipeout";

export default function detailCustomItinerary(props) {
  console.log("Props", props);
  let [dataList, setdataList] = useState(
    props.route.params.datalist ? props.route.params.datalist : []
  );
  const {t, i18n} = useTranslation();
  const Notch = DeviceInfo.hasNotch();
  const NotchAndro = NativeModules.StatusBarManager
    ? NativeModules.StatusBarManager.HEIGHT > 24
    : false;
  const deviceId = DeviceInfo.getModel();

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <View
        style={{
          marginBottom: 5,
          width: Dimensions.get("screen").width,
          alignItems: "center",
        }}
      >
        {Platform.OS === "ios" ? (
          <View
            style={{
              alignItems: "center",
              width: 250,
              marginTop: Platform.OS === "ios" ? (Notch ? 4 : 6) : null,
            }}
          >
            <Text type="bold" size="label" style={{color: "#FFF"}}>
              {t("AddFlightNumber")}
            </Text>

            <Text type="regular" size="description" style={{color: "#FFF"}}>
              {" "}
              {t("customActivity")}
            </Text>
          </View>
        ) : null}
      </View>
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
      <View style={{flexDirection: "row"}}>
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
        <>
          {Platform.OS === "ios" ? null : (
            <View
              style={{
                marginLeft: 15,
                marginTop: deviceId == "LYA-L29" ? 10 : NotchAndro ? 2 : 5,
              }}
            >
              <Text
                type="bold"
                size="title"
                style={{color: "#FFF", marginBottom: -3}}
                numberOfLines={1}
              >
                {t("AddFlightNumber")}
              </Text>

              <Text
                type="regular"
                size="label"
                style={{color: "#FFF", marginLeft: -3}}
              >
                {" "}
                {t("customActivity")}
              </Text>
            </View>
          )}
        </>
      </View>
    ),
  };

  let GooglePlacesRef = useRef();
  const [loadingApp, setLoadingApp] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const token = useSelector((data) => data.token);
  const [text, setText] = useState("");

  //params data
  const dayId = [props.route.params.dayId];
  const itineraryId = props.route.params.itineraryId;
  const startDate = props.route.params.startDate.split(" ").join("T");
  const endDate = props.route.params.endDate.split(" ").join("T");
  //params edit data

  //modal
  const [modalFrom, setModalFrom] = useState(false);
  const [modalTo, setModalTo] = useState(false);
  const [dateTimeModalDeparture, setDateTimeModalDeparture] = useState(false);
  const [dateTimeModalArrival, setDateTimeModalArrival] = useState(false);

  //input data
  const [flightNumber, setFlightNumber] = useState(
    props.route.params.name ? props.route.params.name : ""
  );
  const [timeDeparture, setTimeDeparture] = useState(
    props.route.params.timeDep
      ? props.route.params.timeDep.split(" ").join("T")
      : null
  );
  const [timeArrival, setTimeArrival] = useState(
    props.route.params.timeArr
      ? props.route.params.timeArr.split(" ").join("T")
      : null
  );
  const [bookingRef, setBookingRef] = useState(
    props.route.params.booking_ref ? props.route.params.booking_ref : ""
  );
  const [guestName, setGuestName] = useState(
    props.route.params.guestName ? props.route.params.guestName : ""
  );
  const [carrier, setCarrier] = useState(
    props.route.params.carrier ? props.route.params.carrier : ""
  );
  const [note, setNote] = useState(
    props.route.params.note ? props.route.params.note : ""
  );
  const [attachmentCustom, setAttachmentCustom] = useState(
    props.route.params.attachment ? props.route.params.attachment : null
  );
  const [attachmentCustomFile, setAttachmentCustomFile] = useState([]);
  const [attachment, setAttachment] = useState([]);

  // };

  //constant data
  const order = ["0"];
  const duration = "01:00:00";
  const status = false;
  const qty = "1";
  const icon = "i-airport_transfer";
  const totalPrice = "";
  const title = "Flight";
  const time = "00:00:00";

  //-- Google API data
  const [from, setFrom] = useState(
    props.route.params.departure ? props.route.params.departure : ""
  );
  const [to, setTo] = useState(
    props.route.params.arrival ? props.route.params.arrival : ""
  );
  const [address, setAddress] = useState(
    props.route.params.arrival ? props.route.params.arrival : ""
  );
  const [lat, setLat] = useState(
    props.route.params.latitude ? props.route.params.latitude : ""
  );
  const [long, setLong] = useState(
    props.route.params.longitude ? props.route.params.longitude : ""
  );

  const [latDep, setLatDep] = useState(
    props.route.params?.latitude_departure
      ? props.route.params?.latitude_departure
      : ""
  );
  const [longDep, setLongDep] = useState(
    props.route.params?.longitude_departure
      ? props.route.params?.longitude_departure
      : ""
  );

  const inputFromGoogle = (input) => {
    text.length !== 0
      ? modalFrom
        ? (setLatDep(input.geometry.location.lat),
          setLongDep(input.geometry.location.lng))
        : (setLat(input.geometry.location.lat),
          setLong(input.geometry.location.lng),
          setAddress(input.formatted_address))
      : modalFrom
      ? (setLatDep(input.latitude), setLongDep(input.longitude))
      : (setLat(input.latitude),
        setLong(input.longitude),
        setAddress(input.address));
  };
  //-- End of Google API

  const [timeDepCheck, setTimeDepCheck] = useState(
    props.route.params.timeDep ? props.route.params.timeDep : ""
  );
  const [timeArrCheck, setTimeArrCheck] = useState(
    props.route.params.timeArr ? props.route.params.timeArr : ""
  );

  //DATE TIME PICKER
  const timeConverter = (date) => {
    const checkTime = (time) => {
      if (time < 10) {
        time = "0" + time;
      }
      return time;
    };
    let year = date.getFullYear();
    let months = checkTime(date.getMonth() + 1);
    let day = checkTime(date.getDate());
    let h = checkTime(date.getHours());
    let m = checkTime(date.getMinutes());
    let s = checkTime(date.getSeconds());
    let formattedDate = `${year}-${months}-${day}T${h}:${m}:${s}`;
    let formatForScreen = `${year}-${months}-${day} ${h}:${m}:${s}`;

    if (dateTimeModalDeparture) {
      setTimeDeparture(formattedDate);
      setTimeDepCheck(formatForScreen);
    }

    if (dateTimeModalArrival) {
      setTimeArrival(formattedDate);
      setTimeArrCheck(formatForScreen);
    }
  };

  //  Alert
  let [alertPopUp, setAlertPopUp] = useState({
    show: false,
    judul: "",
    detail: "",
  });

  const [mutation, {loading, data, error: errorSaved}] = useMutation(
    AddFlight,
    {
      context: {
        headers: {
          "Content-Type":
            attachment.length === 0
              ? `application/json`
              : `multipart/form-data`,
          Authorization: token,
        },
      },
    }
  );

  const [
    mutationUpdate,
    {loading: loadingUpdate, data: dataUpdate, error: errorUpdate},
  ] = useMutation(UpdateCustomFlight, {
    context: {
      headers: {
        "Content-Type":
          attachment.length === 0 ? `application/json` : `multipart/form-data`,
        Authorization: token,
      },
    },
  });

  const [itemValid, setItemValid] = useState({
    flightNumber: true,
    timeArrCheck: true,
    timeDepCheck: true,
    from: true,
    to: true,
  });

  const validate = (name) => {
    if (name === "flightNumber" && flightNumber.length === 0) {
      return false;
    } else if (name === "timeArrCheck" && timeArrCheck.length === 0) {
      return false;
    } else if (name === "timeDepCheck" && timeDepCheck.length === 0) {
      return false;
    } else if (name === "from" && from.length === 0) {
      return false;
    } else if (name === "to" && to.length === 0) {
      return false;
      // } else if ((name === "from" || name === "to") && from === to) {
      //   return false;
    } else {
      return true;
    }
  };

  const addAttachmentCustom = () => {
    if (attachmentCustom) {
      let temp = [];

      for (let file of attachmentCustom) {
        let files = new ReactNativeFile({
          uri: file.filepath,
          name: file.file_name,
          type:
            file.extention == "jpeg" ||
            file.extention == "jpg" ||
            file.extention == "png"
              ? `image/${file.extention}`
              : `application/${file.extention}`,
        });
        temp.push(files);
      }
      let tempData = [...attachmentCustomFile, ...temp];
      setAttachmentCustomFile(tempData);
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      addAttachmentCustom();
    });
    return unsubscribe;
  }, [props.navigation]);

  const hitungDuration = ({startt, dur}) => {
    var duration = dur ? dur.split(":") : "00:00:00";
    var starttime = startt ? startt.split(":") : "00:00:00";

    var jam = parseFloat(starttime[0]) + parseFloat(duration[0]);

    var menit = parseFloat(starttime[1]) + parseFloat(duration[1]);

    if (menit == 60 && menit > 59) {
      jam = jam + 1;
      menit = menit - 60;
    } else if (menit != 60 && menit > 59) {
      jam = jam + 1;
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
    {loading: loadingSave, data: dataSave, error: errorSave},
  ] = useMutation(UpdateTimelines, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const UpdateTimeLine = async (idCustom, times, durationss, orders) => {
    setLoadingApp(true);
    let indexData = orders - 1;
    // let dataNew = dataList.splice(indexData, 0, dataSplitIndex);

    let starttimes = times;
    let durations = durationss;

    let jamends =
      parseFloat(starttimes.split(":")[0]) +
      parseFloat(durations.split(":")[0]);
    let menitends =
      parseFloat(starttimes.split(":")[1]) +
      parseFloat(durations.split(":")[1]);

    let datax = [...dataList];
    let dataganti = {...datax[indexData]};

    dataganti.time = starttimes;
    dataganti.duration = durations;
    dataganti.id = idCustom;

    if (dataganti.detail_flight) {
      let dateArr = dataganti.detail_flight.arrival.split(" ")[0];
      let timeArr = dataganti.detail_flight.arrival.split(" ")[1];
      let timeFinal = `${dateArr} ${jamends}:${menitends}:00`;

      dataganti.detail_flight = {
        ...dataganti.detail_flight,
        arrival: timeFinal,
      };
    }

    if (datax[parseFloat(indexData) - 1]) {
      let timesebelum = hitungDuration({
        startt: datax[parseFloat(indexData) - 1].time,
        dur: datax[parseFloat(indexData) - 1].duration,
      });

      let timestartsebelum = datax[parseFloat(indexData) - 1].time.split(":");

      timesebelum = timesebelum.split(":");
      let bandingan = starttimes.split(":");

      timestartsebelum = parseFloat(timestartsebelum[0]);
      let jamsebelum = parseFloat(timesebelum[0]);
      let jamsesesudah = parseFloat(bandingan[0]);

      if (jamsesesudah > timestartsebelum) {
        dataganti.time = hitungDuration({
          startt: datax[parseFloat(indexData) - 1].time,
          dur: datax[parseFloat(indexData) - 1].duration,
        });
      } else {
        dataganti.time = hitungDuration({
          startt: datax[parseFloat(indexData) - 1].time,
          dur: datax[parseFloat(indexData) - 1].duration,
        });
      }
    }

    datax.splice(indexData, 1, dataganti);

    console.log("dataX", datax);

    var x = 0;
    var order = 1;

    for (var y in datax) {
      let datareplace = {...datax[y]};
      datareplace.order = order;
      if (datax[y - 1]) {
        if (datax[y - 1].detail_flight) {
          // longitude & latitude index sebelum custom
          var LongBefore = datax[y - 1].detail_flight.longitude_arrival;
          var LatBefore = datax[y - 1].detail_flight.latitude_arrival;
        } else {
          var LongBefore = datax[y - 1].longitude;
          var LatBefore = datax[y - 1].latitude;
        }

        if (datax[y].detail_flight) {
          var LongCurrent = datax[y].detail_flight.longitude_departure;
          var LatCurrent = datax[y].detail_flight.latitude_departure;
        } else {
          // longitude & latitude index custom
          var LongCurrent = datax[y].longitude;
          var LatCurrent = datax[y].latitude;
        }
        // // longitude & latitude index sebelum custom
        // let LongBefore = datax[y - 1].longitude;
        // let LatBefore = datax[y - 1].latitude;
        // // longitude & latitude index custom
        // let LongCurrent = datax[y].longitude;
        // let LatCurrent = datax[y].latitude;
        // // kondisi jika lokasi yang sama dan aktivitas berbeda
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
    let sum = datax.reduce(
      (itinerary, item) => itinerary.add(moment.duration(item.duration)),
      moment.duration()
    );

    console.log("dataX", datax);
    let jampert = datax[0].time.split(":");
    let jampertama = parseFloat(jampert[0]);
    let menitpertama = parseFloat(jampert[1]);
    let durjam = Math.floor(sum.asHours());
    let durmin = sum.minutes();
    let hasiljam = jampertama + durjam;
    let hasilmenit = menitpertama + durmin;

    if (hasiljam <= 23) {
      // let dataday = {...datadayaktif};

      if (hasiljam === 23 && hasilmenit <= 59) {
        savetimeline(datax);
        // dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        // await setdatadayaktif(dataday);
      } else if (hasiljam < 23) {
        savetimeline(datax);
        // dataday["total_hours"] = "" + hasiljam + ":" + hasilmenit + ":00";
        // await setdatadayaktif(dataday);
      } else {
        Alert.alert("Waktu sudah melewati batas maksimal");
      }
    } else {
      Alert.alert("Waktu sudah melewati batas maksimal");
    }
  };

  const savetimeline = async (datakiriman) => {
    setLoadingApp(true);
    try {
      let response = await mutationSaveTimeline({
        variables: {
          idday: dayId[0],
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
        setLoadingApp(false);
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
    } catch (error) {
      setLoadingApp(false);
      console.log("errorTimeLine", error);
      Alert.alert("" + error);
    }
  };

  const mutationUpdateFlight = async () => {
    try {
      setLoadingApp(true);

      let response = await mutationUpdate({
        variables: {
          id: props.route.params.activityId,
          day_id: dayId,
          title: flightNumber,
          icon: icon,
          qty: qty,
          address: address,
          latitude: lat,
          longitude: long,
          latitude_departure: latDep,
          longitude_departure: longDep,
          latitude_arrival: lat,
          longitude_arrival: long,
          note: note,
          time: time,
          duration: duration,
          status: status,
          order: order,
          total_price: totalPrice,
          departure: timeDeparture,
          arrival: timeArrival,
          from: from,
          destination: to,
          guest_name: guestName,
          booking_ref: bookingRef,
          carrier: carrier,
          file: [...attachmentCustomFile, ...attachment],
        },
      });
      if (loadingUpdate) {
        setLoadingApp(true);
      }

      if (errorSaved) {
        throw new Error("Error Input");
      }

      if (response.data) {
        setLoadingApp(false);
        if (response.data.update_custom_flight.code !== 200) {
          throw new Error(response.data.update_custom_flight.message);
        } else {
          await UpdateTimeLine(
            response.data.update_custom_flight.data[0].id,
            response.data.update_custom_flight.data[0].time,
            response.data.update_custom_flight.data[0].duration,
            response.data.update_custom_flight.data[0].order
          );
          // props.navigation.navigate("itindetail");
        }
      }
      setLoadingApp(false);
    } catch (error) {
      console.log("error", error);
      RNToasty.Show({
        title: t("somethingwrong"),
        position: "bottom",
      });
      setLoadingApp(false);
      setButtonDisabled(false);
    }
  };

  console.log("id", props.route.params.activityId);
  console.log("day_id", dayId);
  console.log("icon", icon);
  console.log("lat_arr", lat);
  console.log("long_arr", long);
  console.log("latDep", latDep);
  console.log("longDep", longDep);
  console.log("TIme", time);
  console.log("Duration", duration);
  console.log("Token", token);
  console.log("depature", timeDeparture, "arrival", timeArrival);

  const mutationInput = async () => {
    try {
      setLoadingApp(true);
      let response = await mutation({
        variables: {
          day_id: dayId,
          title: flightNumber,
          icon: icon,
          qty: qty,
          address: address,
          latitude: lat,
          longitude: long,
          latitude_departure: latDep,
          longitude_departure: longDep,
          latitude_arrival: lat,
          longitude_arrival: long,
          note: note,
          time: time,
          duration: duration,
          status: status,
          order: order,
          total_price: totalPrice,
          departure: timeDeparture,
          arrival: timeArrival,
          from: from,
          destination: to,
          guest_name: guestName,
          booking_ref: bookingRef,
          carrier: carrier,
          file: attachment,
        },
      });
      if (loading) {
        setLoadingApp(true);
      }

      if (errorSaved) {
        throw new Error("Error Input");
      }

      if (response.data) {
        setLoadingApp(false);
        if (response.data.add_custom_flight.code !== 200) {
          throw new Error(response.data.add_custom_flight.message);
        } else {
          props.navigation.goBack();
        }
      }
      setLoadingApp(false);
    } catch (error) {
      RNToasty.Show({
        title: t("somethingwrong"),
        position: "bottom",
      });
      setLoadingApp(false);
      setButtonDisabled(false);
    }
  };

  const validateData = () => {
    setItemValid({
      flightNumber: validate("flightNumber"),
      timeArrCheck: validate("timeArrCheck"),
      timeDepCheck: validate("timeDepCheck"),
      from: validate("from"),
      to: validate("to"),
    });
  };

  const mutationValid = () => {
    validateData();
    if (
      flightNumber.length === 0 &&
      timeArrCheck.length === 0 &&
      timeDepCheck.length === 0 &&
      from.length === 0 &&
      to.length === 0
    ) {
      setAlertPopUp({
        ...alertPopUp,
        show: true,
        judul: t("someFormFieldIsEmpty"),
        detail: "",
      });
    }
    if (flightNumber && timeArrCheck && timeDepCheck && from && to) {
      props.route.params.activityId ? mutationUpdateFlight() : mutationInput();
    }
  };

  //-- Attachment

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      if (res.size <= 7000000) {
        let files = new ReactNativeFile({
          uri: res.uri,
          type: res.type,
          name: res.name,
        });

        let tempData = [...attachment];
        tempData.push(files);
        await setAttachment(tempData);
      } else {
        Alert.alert("Opss", t("MaxSizeFile"), [
          {
            text: "OK",
            onPress: () => console.log("OK"),
          },
        ]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const [dataNearby, setDataNearby] = useState([]);

  const GetLocation = async () => {
    try {
      let granted = false;
      if (Platform.OS == "ios") {
        let sLocation = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        if (sLocation === "denied") {
          granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
        } else {
          granted = true;
        }
      } else {
        let sLocation = await check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        if (sLocation === "denied") {
          granted = await request(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION);
        } else {
          granted = true;
        }
      }
      if (granted) {
        await Geolocation.getCurrentPosition(
          (position) => _nearbyLocation(position),
          (err) => {
            RNToasty.Show({
              title: t("somethingwrong"),
              position: "bottom",
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 10000,
          }
        );
      }
    } catch (error) {
      RNToasty.Show({
        title: t("somethingwrong"),
        position: "bottom",
      });
    }
  };

  const _nearbyLocation = async (position) => {
    let latitude = position?.coords?.latitude
      ? position?.coords?.latitude
      : null;
    let longitude = position?.coords?.longitude
      ? position?.coords?.longitude
      : null;

    try {
      let response = await fetch(
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
          latitude +
          "," +
          longitude +
          "&radius=5000&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      let responseJson = await response.json();
      if (responseJson.results && responseJson.results.length > 0) {
        let nearby = [];
        for (var i of responseJson.results) {
          if (!i.icon.includes("lodging")) {
            let data = {
              place_id: i.place_id,
              name: i.name,
              latitude: i.geometry?.location.lat,
              longitude: i.geometry?.location.lng,
              address: i.vicinity,
              icon: i.icon,
            };
            nearby.push(data);
          }
        }
        setDataNearby(nearby);
        setLoadingApp(false);
      } else {
        setLoadingApp(false);
      }
    } catch (error) {
      RNToasty.Show({
        title: t("somethingwrong"),
        position: "bottom",
      });
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#f0f0f0",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: 15,
        }}
      >
        <View style={styles.ViewContainer}>
          <View style={styles.ViewFlight}>
            <Plane width={50} height={50} style={{marginTop: 15}} />
            <View style={styles.ViewInputFlight}>
              <FloatingInput
                label={t("FlightNo")}
                value={flightNumber}
                onChangeText={setFlightNumber}
              />
              {flightNumber.length === 0 &&
                (!itemValid.flightNumber ? (
                  <Text type="regular" size="small" style={styles.textAlert}>
                    {t("inputAlertFlight")}
                  </Text>
                ) : null)}
            </View>
          </View>

          {/* <View style={styles.ViewDate}> */}
          <View style={styles.ViewDateAndInput}>
            {timeDepCheck !== "" ? (
              <Text style={styles.floatPlaceholder}>{t("Departure")}</Text>
            ) : null}
            <CalendarIcon
              height={15}
              width={15}
              // style={{ marginBottom: -10 }}
            />
            <TextInput
              placeholder={t("Departure")}
              autoCorrect={false}
              editable={false}
              value={timeDepCheck}
              placeholderTextColor="#a9a9a9"
              onChangeText={(e) => {
                setTimeDeparture(e);
                setTimeDepCheck(e);
              }}
              style={styles.TextDateInput}
            />
            {timeDepCheck.length === 0 &&
              (!itemValid.timeDepCheck ? (
                <Text type="regular" size="small" style={styles.textAlert}>
                  {t("inputAlertDateTime")}
                </Text>
              ) : null)}
            <TouchableOpacity
              onPress={() => setDateTimeModalDeparture(true)}
              style={styles.TouchOpacityDate}
            />
          </View>

          <DateTimePickerModal
            isVisible={dateTimeModalDeparture}
            mode="datetime"
            locale="en_id"
            is24Hour
            minimumDate={new Date(startDate)}
            maximumDate={new Date(endDate)}
            onConfirm={(date) => {
              timeConverter(date);
              setDateTimeModalDeparture(false);
            }}
            onCancel={() => setDateTimeModalDeparture(false)}
          />
          <View style={styles.ViewDateAndInputRight}>
            {timeArrCheck !== "" ? (
              <Text style={styles.floatPlaceholder}>{t("Arrival")}</Text>
            ) : null}
            <CalendarIcon
              height={15}
              width={15}
              // style={{ marginBottom: -10 }}
            />
            <TextInput
              placeholder={t("Arrival")}
              autoCorrect={false}
              editable={false}
              value={timeArrCheck}
              placeholderTextColor="#a9a9a9"
              onChangeText={(e) => {
                setTimeArrival(e);
                setTimeArrCheck(e);
              }}
              style={styles.TextDateInput}
            />
            {timeArrCheck.length === 0 &&
              (!itemValid.timeArrCheck ? (
                <Text type="regular" size="small" style={styles.textAlert}>
                  {t("inputAlertDateTime")}
                </Text>
              ) : null)}
            <TouchableOpacity
              onPress={() => setDateTimeModalArrival(true)}
              style={styles.TouchOpacityDate}
            />
          </View>

          <DateTimePickerModal
            isVisible={dateTimeModalArrival}
            mode="datetime"
            locale="en_id"
            is24Hour
            minimumDate={new Date(startDate)}
            maximumDate={new Date(endDate)}
            onConfirm={(date) => {
              timeConverter(date);
              setDateTimeModalArrival(false);
            }}
            onCancel={() => setDateTimeModalArrival(false)}
          />
          {/* </View> */}
          <View style={styles.ViewDate}>
            <View style={{flex: 1}}>
              <FloatingInput
                label={t("From")}
                editable={false}
                value={from}
                onChangeText={(e) => setFrom(e)}
                style={styles.textInputOneLine}
                customInput
              />
              {from.length === 0 &&
                (!itemValid.from ? (
                  <Text type="regular" size="small" style={styles.textAlert}>
                    {t("inputAlertLocation")}
                  </Text>
                ) : null)}
              <TouchableOpacity
                onPress={() => {
                  setModalFrom(true);
                  GetLocation();
                }}
                style={styles.TouchOpacityDate}
              />
            </View>
            <View
              style={{
                flex: 1,
                marginLeft: 15,
              }}
            >
              <FloatingInput
                label={t("To")}
                autoCorrect={false}
                editable={false}
                value={to}
                onChangeText={(e) => setTo(e)}
                style={styles.textInputOneLineTo}
                customInput
              />
              {to.length === 0 &&
                (!itemValid.to ? (
                  <Text type="regular" size="small" style={styles.textAlert}>
                    {t("inputAlertLocation")}
                  </Text>
                ) : null)}
              <TouchableOpacity
                onPress={() => setModalTo(true)}
                style={styles.TouchOpacityDate}
              />
            </View>
          </View>
          <FloatingInput
            label={t("passengerNameOptional")}
            value={guestName}
            onChangeText={setGuestName}
          />

          <FloatingInput
            label={t("bookingCodeOptional")}
            value={bookingRef}
            onChangeText={setBookingRef}
          />
          <FloatingInput
            label={t("carrierOptional")}
            value={carrier}
            onChangeText={setCarrier}
          />
        </View>
        <View style={styles.ViewContainerNotes}>
          <Text
            type={"bold"}
            size="label"
            style={{
              position: "relative",
              top: 5,
            }}
          >
            {t("Notes")}
          </Text>
          <TextInput
            placeholder={t("optional")}
            value={note}
            autoCorrect={false}
            onChangeText={setNote}
            style={styles.textInputNotes}
          />
        </View>
        <View style={styles.ViewContainerFile}>
          <Text size="label" type="bold">
            {t("Attachment")}
          </Text>
          {attachmentCustom
            ? attachmentCustomFile.map((data, index) => {
                return (
                  <View style={styles.attachment}>
                    <FunDocument
                      filename={data.name}
                      filepath={data.uri}
                      format={data.type}
                      progressBar
                      icon
                    />
                    <TouchableOpacity
                      onPress={() => {
                        let temp = [...attachmentCustomFile];
                        temp.splice(index, 1);
                        setAttachmentCustomFile(temp);
                      }}
                      style={styles.attachmentTimes}
                    >
                      <Xhitam width={10} height={10} />
                    </TouchableOpacity>
                  </View>
                );
              })
            : null}

          {attachment.map((data, index) => {
            return (
              <View style={styles.attachment} key={index}>
                <FunDocument
                  filename={data.name}
                  filepath={data.uri}
                  progressBar
                  icon
                />
                {/* <Text style={{ flex: 1, paddingBottom: 5 }}>
                  {data.file_name}
                </Text> */}
                <TouchableOpacity
                  onPress={() => {
                    let temp = [...attachment];
                    temp.splice(index, 1);
                    setAttachment(temp);
                  }}
                  style={styles.attachmentTimes}
                >
                  <Xhitam width={10} height={10} />
                </TouchableOpacity>
              </View>
            );
          })}

          <View style={{flex: 1, marginVertical: 10}}>
            <TouchableOpacity
              onPress={() => {
                pickFile();
              }}
              style={styles.uploadFile}
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
          </View>
        </View>
      </ScrollView>

      <Modal
        onRequestClose={() => {
          setModalFrom(false), setModalTo(false);
        }}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        hasBackdrop={false}
        isVisible={modalFrom || modalTo}
        style={{
          backgroundColor: "#209fae",
          justifyContent: "flex-end",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <KeyboardAvoidingView
          style={{
            flex: 1,
            backgroundColor: "#14646e",
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
          enabled
        >
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              alignItems: "center",
              alignContent: "center",
              backgroundColor: "#209fae",
              height:
                Platform.OS === "ios"
                  ? normalize(45)
                  : deviceId == "LYA-L29"
                  ? normalize(57)
                  : normalize(51),
              // Platform.OS === "ios"
              //   ? Notch
              //     ? normalize(41)
              //     : normalize(56)
              //   : NotchAndro
              //   ? normalize(57)
              //   : normalize(43),
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? (Notch ? 25 : 0) : -15,
            }}
          >
            <TouchableOpacity
              style={{
                height: normalize(45),
                // Platform.OS === "ios"
                //   ? Notch
                //     ? normalize(41)
                //     : normalize(45)
                //   : NotchAndro
                //   ? normalize(0)
                //   : normalize(0),
                paddingLeft: 10,
                width: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop:
                  Platform.OS === "ios"
                    ? Notch
                      ? 17
                      : 15
                    : deviceId == "LYA-L29"
                    ? 10
                    : NotchAndro
                    ? 12
                    : 11,
              }}
              onPress={() => {
                setModalFrom(false), setModalTo(false);
              }}
            >
              {Platform.OS === "ios" ? (
                <Arrowbackios height={15} width={15} />
              ) : (
                <Arrowbackwhite height={20} width={20} />
              )}
            </TouchableOpacity>
            <Text
              style={{
                // Platform.OS === "ios"
                //   ? Notch
                //     ? normalize(40)
                //     : normalize(18)
                //   : NotchAndro
                //   ? normalize(17)
                //   : normalize(12),
                left: 55,
                fontFamily: "Lato-Regular",
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
                height: normalize(45),
                position: "absolute",
                // alignItems: "center",
                // // alignContent: "center",
                // justifyContent: "center",
                paddingTop:
                  Platform.OS === "ios"
                    ? Notch
                      ? 14
                      : 12
                    : deviceId == "LYA-L29"
                    ? 8
                    : NotchAndro
                    ? 10
                    : 10,
              }}
            >
              {modalFrom ? t("from") : t("to")}
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "white",
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 20,
            }}
          >
            <GooglePlacesAutocomplete
              query={{
                key: API_KEY,
                language: t("googleLocationLang"), // language of the results
              }}
              fetchDetails={true}
              onPress={(data, details = null) => {
                if (modalFrom) {
                  setFrom(data.structured_formatting.secondary_text);
                  inputFromGoogle(details);
                  setModalFrom(false);
                }

                if (modalTo) {
                  setTo(data.structured_formatting.secondary_text);
                  inputFromGoogle(details);
                  setModalTo(false);
                }
              }}
              autoFocus={true}
              textInputProps={{
                onChangeText: (text) => setText(text),
                value: text,
              }}
              listViewDisplayed="auto"
              onFail={(error) => {
                RNToasty.Show({
                  title: t("somethingwrong"),
                  position: "bottom",
                });
              }}
              placeholder={"Search for location"}
              currentLocationLabel="Nearby location"
              ref={GooglePlacesRef}
              setAddressText={text}
              renderLeftButton={() => {
                return (
                  <View style={{justifyContent: "center"}}>
                    <Magnifying />
                  </View>
                );
              }}
              renderRightButton={() => {
                return (
                  Platform.OS === "android" &&
                  (text.length ? (
                    <Pressable
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        width: 50,
                        marginRight: -10,
                      }}
                      onPress={() => {
                        setText("");
                        GooglePlacesRef.current.setAddressText("");
                      }}
                    >
                      <Xblue width={20} height={20} />
                    </Pressable>
                  ) : null)
                );
              }}
              GooglePlacesSearchQuery={{
                rankby: "distance",
                type: ["airport", "light_rail_station", "bus_station"],
              }}
              enablePoweredByContainer={false}
              renderRow={(data) => {
                // data = data ? data : dataNearby;
                if (data.description) {
                  var x = data.description.split(",");
                }
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <View
                      style={{
                        width: 20,
                        paddingTop: 3,
                      }}
                    >
                      <Pointmapblack />
                    </View>
                    <View style={{width: Dimensions.get("screen").width - 60}}>
                      <Text
                        style={{
                          fontFamily: "Lato-Bold",
                          fontSize: 12,
                          color: "black",
                        }}
                      >
                        {x ? x[0] : data.name}
                      </Text>
                      <Text
                        style={{
                          fontFamily: "Lato-Regular",
                          fontSize: 12,
                          color: "black",
                        }}
                      >
                        <Truncate
                          text={
                            data.description ? data.description : data.vicinity
                          }
                          length={65}
                        />
                      </Text>
                    </View>
                  </View>
                );
              }}
              styles={{
                textInputContainer: {
                  height: 40,
                  backgroundColor: "#f4f4f4",
                  borderWidth: 0.5,
                  borderColor: "#6c6c6c",
                  borderRadius: 5,
                  margin: 0,
                  paddingHorizontal: 10,
                  // border,
                },
                textInput: {
                  marginTop: 3,
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 0,
                  paddingTop: 2,
                  height: 35,
                  color: "#5d5d5d",
                  fontSize: 14,
                  fontFamily: "Lato-Regular",
                  // borderWidth: 1,
                  backgroundColor: "#f4f4f4",
                  borderColor: "#eaeaea",
                },
                predefinedPlacesDescription: {
                  color: "#646464",
                },
                listView: {},
                row: {
                  height: 48,
                },
              }}
            />
            {dataNearby.length && !text.length ? (
              <View
                style={{
                  position: "absolute",
                  top: 60,
                  right: 0,
                  left: 0,
                  marginHorizontal: 20,
                }}
              >
                {dataNearby.map((item, index) => {
                  return index < 10 ? (
                    <Pressable
                      onPress={() => {
                        if (modalFrom) {
                          setFrom(item.address);
                          inputFromGoogle(item);
                          setModalFrom(false);
                        }

                        if (modalTo) {
                          setTo(item.address);
                          inputFromGoogle(item);
                          setModalTo(false);
                        }
                      }}
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignContent: "flex-start",
                        alignItems: "flex-start",
                        borderBottomWidth: 0.5,
                        borderBottomColor: "#d1d1d1",
                      }}
                    >
                      <View
                        style={{
                          width: 20,
                          paddingTop: 4,
                          marginLeft: 12,
                          marginTop: 10,
                        }}
                      >
                        <Pointmapblack />
                      </View>
                      <View
                        style={{
                          width: Dimensions.get("screen").width - 60,
                          paddingRight: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Lato-Bold",
                            fontSize: 12,
                            marginTop: 10,
                          }}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Lato-Regular",
                            fontSize: 12,
                            marginBottom: 5,
                          }}
                        >
                          {item.address}
                        </Text>
                      </View>
                    </Pressable>
                  ) : null;
                })}
              </View>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Notch ? 90 : 70}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 15,
            // paddingBottom: 40,
          }}
        >
          <Button
            // disabled={buttonDisabled}
            onPress={() => {
              mutationValid();
              setButtonDisabled(true);
            }}
            text={t("save")}
          />
          <Peringatan
            aler={alertPopUp}
            setClose={() =>
              setAlertPopUp({
                ...alertPopUp,
                show: false,
              })
            }
          />
        </View>
      </KeyboardAvoidingView>
      <Loading show={loadingApp} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ViewContainer: {
    backgroundColor: "#fff",
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    padding: 15,
  },
  ViewContainerNotes: {
    backgroundColor: "#fff",
    padding: 10,
    paddingBottom: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#d1d1d1",
  },
  ViewContainerFile: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    padding: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "#d1d1d1",
  },
  ViewFlight: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ViewInputFlight: {
    flex: 1,
    marginLeft: 10,
    marginBottom: Platform.OS === "ios" ? 15 : 5,
  },
  flightLogo: {
    marginRight: 10,
  },
  ViewDate: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  ViewDateAndInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    marginTop: 20,
    // borderBottomEndRadius: 10,
  },
  TextDateInput: {
    flex: 1,
    paddingVertical: Platform.OS === "ios" ? 12 : 5,
    fontFamily: "Lato-Regular",
    marginLeft: 10,
    marginRight: 10,
    width: 150,
    fontSize: Platform.OS === "ios" ? 14 : 13,
    color: "black",
  },
  TouchOpacityDate: {
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  ViewDateAndInputRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginTop: 20,
    // marginLeft: 15,
  },
  TextInputTo: {
    flex: 1,
    fontFamily: "Lato-Regular",
    borderBottomWidth: StyleSheet.hairlineWidth,
    color: "black",
  },
  textAlert: {
    color: "#D75995",
    position: "absolute",
    bottom: -15,
  },
  textAlertFlight: {
    color: "#D75995",
    position: "absolute",
    bottom: -15,
  },
  textInputOneLine: {
    flex: 1,
    fontFamily: "Lato-Regular",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    color: "black",
    fontSize: 14,
    paddingBottom: Platform.OS === "ios" ? 5 : 0,
    paddingTop: Platform.OS === "ios" ? 25 : 15,
    borderBottomRightRadius: 10,
  },
  textInputOneLineTo: {
    flex: 1,
    fontFamily: "Lato-Regular",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    color: "black",
    fontSize: 14,
    paddingBottom: Platform.OS === "ios" ? 5 : 0,
    paddingTop: Platform.OS === "ios" ? 25 : 15,
  },
  textInputNotes: {
    flex: 1,
    fontFamily: "Lato-Regular",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    color: "black",
    fontSize: 14,
    paddingBottom: Platform.OS === "ios" ? 5 : 0,
    paddingTop: Platform.OS === "ios" ? 15 : 0,
    paddingLeft: 1,
  },
  uploadFile: {
    width: "100%",
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
  },
  attachment: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
  },
  attachmentTimes: {
    flexDirection: "row",
    paddingRight: 10,
    paddingLeft: 25,
    paddingVertical: 5,
    height: "100%",
    alignItems: "center",
  },
  floatPlaceholder: {
    position: "absolute",
    top: -12,
    left: Platform.OS === "ios" ? 25 : 28,
    fontFamily: "Lato-Regular",
    color: "#A0A0A0",
    fontSize: 14,
  },
});
