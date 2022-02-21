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
// import { Input } from "native-base";
// import { default_image } from "../../../assets/png";
// import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
// import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
// import Swipeout from "react-native-swipeout";

export default function detailCustomItinerary(props) {
  const {t, i18n} = useTranslation();
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
      height: 108,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
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
          alignItems: "center",
          // backgroundColor: "red",
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
          }}
        >
          <Text type="bold" size="title" style={{color: "#fff"}}>
            {t("AddFlightNumber")}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
            }}
          >
            {t("customActivity")}
          </Text>
        </View>
      </View>
    ),
  };
  let GooglePlacesRef = useRef();
  const [loadingApp, setLoadingApp] = useState(false);
  const Notch = DeviceInfo.hasNotch();
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
  const icon = "gb-tour";
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
          props.navigation.navigate("itindetail");
        }
      }
      setLoadingApp(false);
    } catch (error) {
      // Alert.alert("" + error);
      console.log("error catch :", error);
      setLoadingApp(false);
      setButtonDisabled(false);
    }
  };

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
      Alert.alert("" + error);
      console.error("error catch :", error);
      setLoadingApp(false);
      setButtonDisabled(false);
    }
  };

  // console.log("token", token);

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
      // console.log(attachment);
    }
  };

  //-- Attachment

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      // console.log("res", res);
      let files = new ReactNativeFile({
        uri: res.uri,
        type: res.type,
        name: res.name,
      });

      let tempData = [...attachment];
      tempData.push(files);
      await setAttachment(tempData);
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
          (err) => console.log(err),
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 10000,
          }
        );
      }
    } catch (error) {
      console.log(error);
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
      console.error(error);
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

          <View style={styles.ViewDate}>
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
          </View>
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
            backgroundColor: "#209fae",
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
              height: 50,
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? 20 : -20,
            }}
          >
            <TouchableOpacity
              style={{
                height: 50,
                width: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop: 15,
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
                top: Platform.OS === "ios" ? 12 : 15,
                left: 55,
                fontFamily: "Lato-Regular",
                fontSize: 16,
                fontWeight: "bold",
                color: "white",
                height: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
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
                key: "AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
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
              onFail={(error) => console.log(error)}
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
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 0,
                  height: 38,
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
        keyboardVerticalOffset={Notch ? 90 : 65}
      >
        <View
          style={{
            backgroundColor: "#fff",
            paddingHorizontal: 15,
            paddingVertical: 5,
            marginBottom: 20,
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
    borderBottomEndRadius: 10,
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
    marginLeft: 15,
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
    top: -9,
    left: Platform.OS === "ios" ? 25 : 28,
    fontFamily: "Lato-Regular",
    color: "#A0A0A0",
    fontSize: 14,
  },
});
