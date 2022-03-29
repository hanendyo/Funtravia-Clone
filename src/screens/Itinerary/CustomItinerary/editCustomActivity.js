import { Input, Item, Label, Textarea } from "native-base";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  View,
  Picker,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  Modal as Modalss,
  Platform,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";
import {
  Arrowbackios,
  Arrowbackwhite,
  Bottom,
  Bottomsegitiga,
  Errors,
  Pointmapgray,
  Xhitam,
} from "../../../assets/svg";
import { Button, Loading, Text, Truncate, Distance } from "../../../component";
import Modal from "react-native-modal";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Ripple from "react-native-material-ripple";
import EditCustom from "../../../graphQL/Mutation/Itinerary/EditCustom";
import { useMutation } from "@apollo/react-hooks";
import SaveCustom from "../../../graphQL/Mutation/Itinerary/Savecustom";
import { asyncMap } from "@apollo/client/utilities";
import { ReactNativeFile } from "apollo-upload-client";
import moment from "moment";
import { StackActions } from "@react-navigation/native";
import UpdateTimelines from "../../../graphQL/Mutation/Itinerary/UpdateTimeline";

export default function editCustomActivity(props) {
  let [loading, setLoading] = useState(false);
  let token = props.route.params.token;
  let [dataList, setdataList] = useState(
    props.route.params.datalist ? props.route.params.datalist : []
  );
  let [dataSplitIndex, setdataSplitIndex] = useState({});

  const { t, i18n } = useTranslation();
  let [modals, setModal] = useState(false);
  let [modaldate, setModaldate] = useState(false);
  let [cheked, setcheck] = useState(false);
  let [modalAlert, setmodalAlert] = useState(false);
  let [textAlert, settextAlert] = useState("");

  let [dataState, setdataState] = useState({
    id: props.route.params.dataParent.id,
    day_id: [props.route.params.idDay],
    title: props.route.params.dataParent.name,
    icon: props.route.params.dataParent.icon,
    address: props.route.params.dataParent.address,
    latitude: props.route.params.dataParent.latitude,
    longitude: props.route.params.dataParent.longitude,
    note: props.route.params.dataParent.note,
    time: props.route.params.dataParent.time,
    duration: props.route.params.dataParent.duration,
    order: [props.route.params.dataParent.order],
    addressdetail: props.route.params.dataParent.address,
    file: props.route.params.dataParent.attachment
      ? props.route.params.dataParent.attachment
      : [],
  });

  let [validate, setValidate] = useState({
    tittle: true,
    duration: true,
    address: true,
    detail: true,
  });

  const validation = (name, value) => {
    if (name === "tittle") {
      return value.length >= 1 ? true : false;
    } else if (name === "address") {
      return value.length >= 2 ? true : false;
      s;
    } else if (name === "detail") {
      return value.length >= 5 ? true : false;
    } else {
      return true;
    }
  };

  // on Change input
  const onChange = (name, detail) => (text) => {
    let check = validation(name, text);

    if (name === "tittle") {
      setdataState({ ...dataState, title: text });
      setdataSplitIndex({
        ...dataSplitIndex,
        name: text,
      });
    }
    if (name === "address") {
      setdataState({ ...dataState, address: text });
    }
    if (name === "detail") {
      setdataState({ ...dataState, addressdetail: text });
      setdataSplitIndex({
        ...dataSplitIndex,
        address: text,
      });
    }

    setValidate({
      ...validate,
      [name]: check,
    });
  };

  let [hour, sethour] = useState(
    props.route.params.dataParent.duration.split(":")[0]
  );
  let [minutes, setMinutes] = useState(
    props.route.params.dataParent.duration.split(":")[1]
  );

  //   jam dan menit arrays
  const jam = [...Array(24).keys()].map((x) => `${x}`);
  const menit = [...Array(60).keys()].map((x) => `${x}`);

  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "",
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
      paddingBottom: Platform.OS == "ios" ? 15 : 1,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
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
            marginBottom: 1,
          }}
        >
          <Text type="bold" size="title" style={{ color: "#fff" }}>
            {t("editCustomActivity")}
          </Text>
        </View>
      </View>
    ),
  };

  const addAttachmentCustom = () => {
    let temp = [];
    for (let file of dataState.file) {
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
    let tempData = [...temp];
    setdataState((prevState) => ({ ...prevState, file: tempData }));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      addAttachmentCustom();
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    let indexData = props.route.params.dataParent.order - 1;

    let tempData = [...dataList];
    let tempSplit = tempData.splice(indexData, 1);

    setdataList(tempData);
    setdataSplitIndex(tempSplit[0]);
  }, []);

  const [
    mutationSaved,
    { loading: loadingSaved, data: dataSaved, error: errorSaved },
  ] = useMutation(EditCustom, {
    context: {
      headers: {
        "Content-Type": !dataState.file?.length
          ? `application/json`
          : `multipart/form-data`,
        Authorization: token,
      },
    },
  });

  const [
    mutationChecked,
    { loading: loadingChecked, data: dataChecked, error: errorChecked },
  ] = useMutation(SaveCustom, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  // function masukan data google
  const masukan = async (detail) => {
    await setdataState({
      ...dataState,
      address: detail.name,
      addressdetail: detail.formatted_address,
      latitude: detail.geometry.location.lat,
      longitude: detail.geometry.location.lng,
    });

    await setdataSplitIndex({
      ...dataSplitIndex,
      address: detail.name,
      addressdetail: detail.formatted_address,
      latitude: detail.geometry.location.lat,
      longitude: detail.geometry.location.lng,
    });
  };

  const UpdateTimeLine = async (idCustom) => {
    setLoading(true);
    let indexData = props.route.params.dataParent.order - 1;
    let dataNew = dataList.splice(indexData, 0, dataSplitIndex);

    let starttimes = dataList[indexData].time;
    let durations = dataList[indexData].duration;

    let jamends =
      parseFloat(starttimes.split(":")[0]) +
      parseFloat(durations.split(":")[0]);
    let menitends =
      parseFloat(starttimes.split(":")[1]) +
      parseFloat(durations.split(":")[1]);

    let datax = [...dataList];
    let dataganti = { ...datax[indexData] };

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

    var x = 0;
    var order = 1;

    for (var y in datax) {
      let datareplace = { ...datax[y] };
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
  ] = useMutation(UpdateTimelines, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const savetimeline = async (datakiriman) => {
    setLoading(true);
    try {
      let response = await mutationSaveTimeline({
        variables: {
          idday: dataState.day_id[0],
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
        setLoading(false);
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
      setLoading(false);
      console.log("errorTimeLine", error);
      Alert.alert("" + error);
    }
  };

  const UpdateCustom = async () => {
    setLoading(true);
    try {
      // setLoading(true);
      let response = await mutationSaved({
        variables: {
          id: dataState.id,
          day_id: dataState.day_id,
          title: dataState.title,
          icon: dataState.icon,
          address: dataState.addressdetail,
          latitude: dataState.latitude,
          longitude: dataState.longitude,
          note: dataState.note,
          time: dataState.time,
          duration: hour + ":" + minutes + ":00",
          order: dataState.order,
          file: dataState.file,
        },
      });
      if (loadingSaved) {
        Alert.alert("Loading!!");
      }
      if (loadingSaved) {
        throw new Error("Error Input");
      }

      if (response.data) {
        if (response.data.update_custom.code !== 200) {
          if (response.data.update_custom.message == "Failed") {
            settextAlert("FailedUpdate");
            if (Platform.OS == "android") {
              setmodalAlert(true);
            } else {
              Alert.alert(t("FailedUpdate"), t("FailedUpdate"), [
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]);
            }
          }
          if (response.data.update_custom.message == "Full") {
            settextAlert("AktivitasFull");
            if (Platform.OS == "android") {
              setmodalAlert(true);
            } else {
              Alert.alert(t("FailedUpdate"), t("AktivitasFull"), [
                { text: "OK", onPress: () => console.log("OK Pressed") },
              ]);
            }
          }
        } else {
          await UpdateTimeLine(response.data.update_custom.data[0].id);
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      Alert.alert("" + error);
    }
  };

  const changeStateDuration = async () => {
    await setdataSplitIndex({
      ...dataSplitIndex,
      duration: hour + ":" + minutes + ":00",
    });

    await setModaldate(false);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFF",
      }}
    >
      <Loading show={loading} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* title */}

        <View style={{ width: Dimensions.get("screen").width, padding: 20 }}>
          <Text
            size="title"
            type="bold"
            style={{
              width: Dimensions.get("screen").width * 0.65,
            }}
          >
            {t("inputdestinationdetail")}
          </Text>
          <View
            style={{
              width: Dimensions.get("screen").width - 40,
            }}
          >
            <Item
              floatingLabel
              style={{
                marginTop: 5,
              }}
            >
              <Label
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 12,
                }}
              >
                {t("title")}
              </Label>
              <Input
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                }}
                autoCorrecttitle={false}
                value={dataState.title}
                onChangeText={onChange("tittle")}
                keyboardType="default"
              />
            </Item>
            {validate.tittle === false ? (
              <Text
                size="small"
                type="regular"
                style={{
                  color: "#D75995",

                  position: "absolute",
                  bottom: -15,
                }}
              >
                {t("Entertitle")}
              </Text>
            ) : null}
          </View>

          {/* duration */}

          <View
            style={{
              width: Dimensions.get("screen").width - 40,
              flexDirection: "row",
              paddingVertical: 20,
              justifyContent: "space-between",

              alignItems: "center",
              alignContent: "center",
            }}
          >
            <Text size="label" type="bold" style={{}}>
              {t("duration")}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => {
                  setModaldate(true);
                }}
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    width: 60,
                    height: Platform.OS == "ios" ? 25 : 20,
                    borderWidth: 0.5,

                    alignItems: "center",
                    borderColor: "#d1d1d1",
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",

                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      type="bold"
                      size="label"
                      style={{
                        color: "#209FAE",
                      }}
                    >
                      {hour < 10 ? +hour : hour} {t("h")}
                    </Text>
                    <View
                      style={{
                        justifyContent: "center",
                        paddingLeft: 8,
                      }}
                    >
                      <Bottomsegitiga width={8} height={8} />
                    </View>
                  </View>
                </View>
                <View
                  style={{
                    width: 60,
                    height: Platform.OS == "ios" ? 25 : 20,
                    marginLeft: 5,
                    alignItems: "center",
                    borderWidth: 0.5,
                    borderColor: "#d1d1d1",
                    backgroundColor: "#f6f6f6",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      type="bold"
                      size="label"
                      style={{
                        color: "#209FAE",
                      }}
                    >
                      {minutes < 10 ? +minutes : minutes} {t("m")}
                    </Text>
                    <View
                      style={{
                        justifyContent: "center",
                        paddingLeft: 8,
                      }}
                    >
                      <Bottomsegitiga width={8} height={8} />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </View>

            {/* awal modal date */}

            <Modal
              // onRequestClose={() => setModaldate(false)}
              // onBackdropPress={() => setModaldate(false)}
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
                {/* <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: -40,
                    left: -160,
                  }}
                  // onPress={() => setModaldate(false)}
                >
                  <Xhitam width={15} height={15} />
                </TouchableOpacity> */}
                <Text size="description" type="bold" style={{}}>
                  {t("Selecttime")}
                </Text>
                <View
                  style={{
                    width: "100%",
                    // borderWidth: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <Picker
                      iosIcon={
                        <View>
                          <Bottom />
                        </View>
                      }
                      iosHeader="Select Hours"
                      note
                      mode="dropdown"
                      selectedValue={hour}
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
                      onValueChange={(itemValue, itemIndex) =>
                        sethour(itemValue)
                      }
                    >
                      {jam.map((item, index) => {
                        return (
                          <Picker.Item
                            key={""}
                            label={item + " h"}
                            value={item}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                  <View
                    style={{
                      width: "5%",
                      alignItems: "center",
                    }}
                  >
                    <Text size="description" type="bold" style={{}}>
                      :
                    </Text>
                  </View>
                  <View style={{ width: "40%" }}>
                    <Picker
                      iosHeader="Select Minutes"
                      headerBackButtonTextStyle={{ fontFamily: "Lato-Regular" }}
                      note
                      mode="dropdown"
                      selectedValue={minutes}
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
                      onValueChange={(itemValue, itemIndex) =>
                        setMinutes(itemValue)
                      }
                    >
                      {menit.map((item, index) => {
                        return (
                          <Picker.Item
                            key={""}
                            label={item + " m"}
                            value={item}
                          />
                        );
                      })}
                    </Picker>
                  </View>
                </View>
                <Ripple
                  onPress={() => changeStateDuration()}
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
                </Ripple>
              </View>
            </Modal>
            {/* akhir modal date */}
          </View>
          {/* address */}
          <View>
            <Text size="label" type="bold" style={{}}>
              {t("location")}
            </Text>
            <Ripple
              onPress={() => setModal(true)}
              style={{
                marginVertical: 10,
                width: "100%",

                paddingHorizontal: 10,
                borderWidth: 0.2,
                borderRadius: 2,
                borderColor: "#646464",
                backgroundColor: "#f3f3f3",
                marginBottom: 20,
              }}
            >
              <View
                style={{
                  height: 30,
                  borderRadius: 2,

                  flexDirection: "row",
                  // borderWidth: 1,
                  alignItems: "center",
                  alignContent: "center",
                }}
              >
                <Pointmapgray />
                <Input
                  disabled={true}
                  style={{
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    marginLeft: 5,
                    padding: 0,
                    // color: '#646464',
                  }}
                  autoCorrect={false}
                  placeholder={t("searchLocation")}
                  value={dataState.address}
                  onChangeText={onChange("address")}
                  keyboardType="default"
                />
              </View>

              {validate.address === false ? (
                <Text
                  size="small"
                  type="regular"
                  style={{
                    color: "#D75995",

                    position: "absolute",
                    bottom: -15,
                  }}
                >
                  {t("enteraddres")}
                </Text>
              ) : null}
            </Ripple>
          </View>

          <View>
            <Text size="label" type="bold">
              {t("detailAddress")}
            </Text>

            <Textarea
              style={{
                width: "100%",
                borderRadius: 5,

                fontFamily: "Lato-Regular",
                backgroundColor: "#f3f3f3",
                padding: 5,
              }}
              disabled={props.route.params?.dataParent ? true : false}
              rowSpan={5}
              placeholder={t("detailAddress")}
              value={dataState.addressdetail}
              bordered
              maxLength={160}
              onChangeText={onChange("detail")}
            />
            {validate.detail === false ? (
              <Text
                size="small"
                type="regular"
                style={{
                  color: "#D75995",

                  position: "absolute",
                  bottom: -15,
                }}
              >
                {t("enterdetailaddres")}
              </Text>
            ) : null}
          </View>
          <Pressable
            onPress={() => setcheck(!cheked)}
            style={{
              flexDirection: "row",
              paddingTop: 20,
              justifyContent: "flex-start",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <CheckBox
              onCheckColor="#FFF"
              lineWidth={2}
              onFillColor="#209FAE"
              onTintColor="#209FAE"
              boxType={"square"}
              style={{
                alignSelf: "center",
                width: Platform.select({
                  ios: 30,
                  android: 35,
                }),
                transform: Platform.select({
                  ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                  android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
                }),
              }}
              value={cheked}
              onValueChange={(check) => setcheck(check)}
            />
            <Text
              size="small"
              type="regular"
              style={{
                marginLeft: 20,
              }}
            >
              {t("saveActivity")}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <View
        style={{
          height: 60,
          width: Dimensions.get("screen").width,
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          borderTopWidth: 1,
          borderTopColor: "#f3f3f3",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (
              dataState.title !== "" &&
              validate.tittle === true &&
              dataState.address !== "" &&
              validate.address === true &&
              dataState.addressdetail !== "" &&
              validate.detail === true &&
              (hour !== 0 || minutes !== 0)
            ) {
              UpdateCustom();
              // _Next();
            } else {
              Alert.alert(t("pleaseenter"));
            }
          }}
          style={{
            height: 40,
            width: Dimensions.get("screen").width - 40,
            backgroundColor: "#209fae",
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <Text size="description" type="regular" style={{ color: "white" }}>
            {t("next")}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        onRequestClose={() => setModal(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        hasBackdrop={false}
        isVisible={modals}
        style={{
          backgroundColor: "#209fae",

          // backgroundColor: 'rgba(0, 0, 0, 0.25)',
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
            <Ripple
              style={{
                height: 50,
                width: 50,
                alignItems: "center",
                alignContent: "center",
                paddingTop: 15,
                marginLeft: 10,
              }}
              onPress={() => setModal(false)}
            >
              <Arrowbackwhite width={20} height={20} />
            </Ripple>
            <Text
              size={"title"}
              type={"bold"}
              style={{
                left: 10,

                color: "white",
              }}
            >
              {t("location")}
            </Text>
          </View>
          {/* modal google */}
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
              onPress={(data, details = null, search = null) => {
                masukan(details);
                setModal(false);
              }}
              autoFocus={true}
              listViewDisplayed="auto"
              onFail={(error) => console.log(error)}
              currentLocation={true}
              placeholder={t("SearchForLocation")}
              currentLocationLabel="Nearby location"
              renderLeftButton={() => {
                return (
                  <View style={{ justifyContent: "center" }}>
                    <Pointmapgray />
                  </View>
                );
              }}
              GooglePlacesSearchQuery={{ rankby: "distance" }}
              enablePoweredByContainer={false}
              renderRow={(data) => {
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
                      <Pointmapgray />
                    </View>
                    <View
                      style={{ width: Dimensions.get("screen").width - 60 }}
                    >
                      <Text style={{ fontFamily: "Lato-Bold", fontSize: 12 }}>
                        {/* {x[0]} */}
                        {x ? x[0] : data.name}
                      </Text>
                      <Text
                        style={{ fontFamily: "Lato-Regular", fontSize: 12 }}
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
                },
                textInput: {
                  marginLeft: 0,
                  marginRight: 0,
                  padding: 0,
                  height: 38,
                  color: "#5d5d5d",
                  fontSize: 14,
                  fontFamily: "Lato-Regular",

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
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* modal alert */}
      <Modalss
        onBackdropPress={() => {
          setmodalAlert(false);
        }}
        onRequestClose={() => setmodalAlert(false)}
        onDismiss={() => setmodalAlert(false)}
        visible={modalAlert}
        transparent={true}
      >
        <Pressable
          onPress={() => {
            setmodalAlert(false);
          }}
          style={{
            height: Dimensions.get("screen").height,
            width: Dimensions.get("screen").width,
            backgroundColor: "'rgba(0, 0, 0, 0.7)'",
            // opacity: 0.7,
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            alignContent: "center",
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
              backgroundColor: "#F6F6F6",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomColor: "#d1d1d1",
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              size="label"
              type="bold"
              style={{
                marginTop: 13,
                marginBottom: 15,
              }}
            >
              Oops
            </Text>
          </View>
          <View
            style={{
              backgroundColor: "white",
              alignItems: "center",
              alignContent: "center",
              // height: 100,
              width: Dimensions.get("screen").width - 100,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              paddingVertical: 20,
              paddingHorizontal: 15,
            }}
          >
            <Errors height={80} width={80} />
            <Text
              type="bold"
              size="title"
              style={{
                marginTop: 20,
                textAlign: "center",
              }}
            >
              {t("FailedUpdate")}
            </Text>

            <View
              style={{
                marginTop: 20,
                backgroundColor: "#f3f3f3",
                padding: 20,
              }}
            >
              <Text size="label" style={{ textAlign: "center" }}>
                {t(textAlert)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setmodalAlert(false);
              }}
              style={{
                paddingTop: 20,
              }}
            >
              <Text
                type="bold"
                size="label"
                style={{
                  color: "#209fae",
                }}
              >
                {t("understand")}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modalss>

      {/* modal alert trip belum aktif */}
    </View>
  );
}
