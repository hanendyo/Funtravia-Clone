import React, { useState, useEffect } from "react";
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
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import {
  Arrowbackwhite,
  ArrowRight,
  CalendarIcon,
  Delete,
  More,
  New,
  Plane,
  Xhitam,
  Pointmapgray,
} from "../../../assets/svg";
import { FloatingInput, Truncate } from "../../../component";
import { Button, Text, Loading, FunIcon, Capital } from "../../../component";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import { ReactNativeFile } from "apollo-upload-client";
import DeviceInfo from "react-native-device-info";
import Modal from "react-native-modal";
import AddFlight from "../../../graphQL/Mutation/Itinerary/AddCustomFlight";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DateTimePickerModal from "react-native-modal-datetime-picker";
// import { Input } from "native-base";
// import { default_image } from "../../../assets/png";
// import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
// import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
// import Swipeout from "react-native-swipeout";

export default function detailCustomItinerary(props) {
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
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        </Button>
        <View
          style={{
            marginLeft: 10,
          }}
        >
          <Text type="bold" size="title" style={{ color: "#fff" }}>
            {t("AddFlightNumber")}
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 14,
            }}
          >
            {t("CustomActivity")}
          </Text>
        </View>
      </View>
    ),
  };
  const [loadingApp, setLoadingApp] = useState(false);
  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();

  //params data
  const dayId = [props.route.params.dayId];
  const itineraryId = props.route.params.itineraryId;

  //modal
  const [modalFrom, setModalFrom] = useState(false);
  const [modalTo, setModalTo] = useState(false);
  const [dateTimeModalDeparture, setDateTimeModalDeparture] = useState(false);
  const [dateTimeModalArrival, setDateTimeModalArrival] = useState(false);

  //input data
  const [flightNumber, setFlightNumber] = useState("");
  const [timeDeparture, setTimeDeparture] = useState(null);
  const [timeArrival, setTimeArrival] = useState(null);
  const [bookingRef, setBookingRef] = useState("");
  const [guestName, setGuestName] = useState("");
  const [carrier, setCarrier] = useState("");
  const [note, setNote] = useState("");
  const [attachment, setAttachment] = useState([]);

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
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [long, setLong] = useState("");

  const inputFromGoogle = (input) => {
    setAddress(input.formatted_address);
    setLat(input.geometry.location.lat);
    setLong(input.geometry.location.lng);
  };
  //-- End of Google API

  const [timeDepCheck, setTimeDepCheck] = useState("");
  const [timeArrCheck, setTimeArrCheck] = useState("");

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

  const [mutation, { loading, data, error: errorSaved }] = useMutation(
    AddFlight,
    {
      context: {
        headers: {
          "Content-Type": (file = []
            ? `application/json`
            : `multipart/form-data`),
          Authorization: `Bearer ${token}`,
        },
      },
    }
  );
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
    } else if (
      (name === "timeArrCheck" && timeArrCheck.length === 0) ||
      (name === "timeDepCheck" && timeDepCheck.length === 0)
    ) {
      return false;
    } else if (
      (name === "from" || name === "to") &&
      (from.length === 0 || to.length === 0)
    ) {
      return false;
    } else if ((name === "from" || name === "to") && from === to) {
      return false;
    } else {
      return true;
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      getToken();
    });
    return unsubscribe;
  }, [props.navigation]);

  const mutationInput = async () => {
    try {
      let response = await mutation({
        variables: {
          day_id: dayId,
          title: flightNumber,
          icon: icon,
          qty: qty,
          address: address,
          latitude: lat,
          longitude: long,
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
        console.log(errorSaved);
        throw new Error("Error Input");
      }

      if (response.data) {
        if (response.data.add_custom_flight.code !== 200) {
          throw new Error(response.data.add_custom_flight.message);
        } else {
          props.navigation.goBack();
        }
      }
      setLoadingApp(false);
    } catch (error) {
      // Alert.alert("" + error);
      console.log("error catch :", error);
      setLoadingApp(false);
    }
  };

  const getToken = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    if (tkn !== null) {
      setToken(tkn);
    } else {
      setToken("");
    }
  };

  //-- Attachment
  const mutationValid = () => {
    setItemValid({
      flightNumber: validate("flightNumber"),
      timeArrCheck: validate("timeArrCheck"),
      timeDepCheck: validate("timeDepCheck"),
      from: validate("from"),
      to: validate("to"),
    });
    if (
      itemValid.flightNumber &&
      itemValid.timeArrCheck &&
      itemValid.timeDepCheck &&
      itemValid.from &&
      itemValid.to
    ) {
      mutationInput();
    }
  };

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });

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
  //-- End of Attachment

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
            <Plane width={50} height={50} style={{ marginTop: 15 }} />
            <View style={styles.ViewInputFlight}>
              <FloatingInput
                customTextStyle={{
                  color:
                    itemValid.flightNumber === false ? "#464646" : "D75995",
                }}
                label={t("FlightNo")}
                value={flightNumber}
                onChangeText={setFlightNumber}
              />
              {itemValid.flightNumber === false ? (
                <Text
                  type="regular"
                  size="small"
                  style={styles.textAlertFlight}
                >
                  {t("inputAlertFlight")}
                </Text>
              ) : null}
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
                customTextStyle={{
                  color:
                    itemValid.timeDepCheck === false ? "#464646" : "D75995",
                }}
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
              {itemValid.timeDepCheck === false ? (
                <Text type="regular" size="small" style={styles.textAlert}>
                  {t("inputAlertDateTime")}
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => setDateTimeModalDeparture(true)}
                style={styles.TouchOpacityDate}
              />
            </View>

            <DateTimePickerModal
              isVisible={dateTimeModalDeparture}
              mode="datetime"
              // display="inline"
              date={new Date()}
              locale="en_id"
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
                customTextStyle={{
                  color:
                    itemValid.timeArrCheck === false ? "#464646" : "D75995",
                }}
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
              {itemValid.timeArrCheck === false ? (
                <Text type="regular" size="small" style={styles.textAlert}>
                  {t("inputAlertDateTime")}
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => setDateTimeModalArrival(true)}
                style={styles.TouchOpacityDate}
              />
            </View>

            <DateTimePickerModal
              isVisible={dateTimeModalArrival}
              mode="datetime"
              // display="inline"
              date={new Date()}
              locale="en_id"
              onConfirm={(date) => {
                timeConverter(date);
                setDateTimeModalArrival(false);
              }}
              onCancel={() => setDateTimeModalArrival(false)}
            />
          </View>
          <View style={styles.ViewDate}>
            <View style={{ flex: 1 }}>
              <FloatingInput
                label={t("From")}
                editable={false}
                value={from}
                onChangeText={(e) => setFrom(e)}
                style={styles.textInputOneLine}
              />
              {itemValid.from === false ? (
                <Text type="regular" size="small" style={styles.textAlert}>
                  {t("inputAlertLocation")}
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => setModalFrom(true)}
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
                style={styles.textInputOneLine}
              />
              {itemValid.to === false ? (
                <Text type="regular" size="small" style={styles.textAlert}>
                  {t("inputAlertLocation")}
                </Text>
              ) : null}
              <TouchableOpacity
                onPress={() => setModalTo(true)}
                style={styles.TouchOpacityDate}
              />
            </View>
          </View>
          <FloatingInput
            label={t("Guest Name")}
            value={guestName}
            onChangeText={setGuestName}
            // style={styles.textInputOneLine}
          />

          <FloatingInput
            label={t("BookingRef")}
            value={bookingRef}
            onChangeText={setBookingRef}
            // style={styles.textInputOneLine}
          />
          <FloatingInput
            label={t("Carrier")}
            value={carrier}
            onChangeText={setCarrier}
            // style={styles.textInputOneLine}
          />
          <Text
            type={"bold"}
            size="label"
            style={{
              paddingTop: 30,
            }}
          >
            {t("Notes")}
          </Text>
          <FloatingInput
            label={t("Notes")}
            value={note}
            onChangeText={setNote}
            // style={styles.textInputOneLine}
          />
          <Text
            size="label"
            type="bold"
            style={{
              paddingTop: 30,
            }}
          >
            {t("Attachment")}
          </Text>

          <View style={{ flex: 1, marginVertical: 10 }}>
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
          {attachment.map((data, index) => {
            return (
              <View style={styles.attachment}>
                <Text style={{ width: 30 }}>{index + 1}. </Text>
                <Text style={{ flex: 1, paddingBottom: 5 }}>{data.name}</Text>
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
        </View>
      </ScrollView>

      <Modal
        onRequestClose={() => {
          setModalFrom(false), setModalTo(false);
        }}
        animationIn="slideInRight"
        animationOut="slideOutRight"
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
              <Arrowbackwhite width={20} height={20} />
            </TouchableOpacity>
            <Text
              style={{
                top: 13,
                left: 55,
                fontFamily: "Lato-Regular",
                fontSize: 14,
                color: "white",
                height: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {modalFrom ? "Dari" : "Ke"}
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
                language: "id", // language of the results
              }}
              fetchDetails={true}
              onPress={(data, details = null, search = null) => {
                if (modalFrom) {
                  setFrom(data.structured_formatting.secondary_text);
                  setModalFrom(false);
                }

                if (modalTo) {
                  setTo(data.structured_formatting.secondary_text);
                  inputFromGoogle(details);
                  setModalTo(false);
                }
              }}
              autoFocus={true}
              listViewDisplayed="auto"
              onFail={(error) => console.log(error)}
              placeholder={"Search for location"}
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
                      <Text
                        style={{
                          fontFamily: "Lato-Bold",
                          fontSize: 12,
                          color: "black",
                        }}
                      >
                        {/* {x[0]} */}
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
            padding: 15,
          }}
        >
          <Button
            onPress={() => {
              mutationValid();
            }}
            text={t("save")}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ViewContainer: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
  },
  ViewFlight: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ViewInputFlight: { flex: 1, marginLeft: 10, marginBottom: 10 },
  flightLogo: {
    marginRight: 10,
  },
  ViewDate: {
    paddingTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
  },
  ViewDateAndInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    // borderBottomColor: "#d3d3d3",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomEndRadius: 10,
  },
  TextDateInput: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "Lato-Regular",
    marginLeft: 10,
    marginRight: 10,
    width: 150,
    fontSize: 12,
    color: "black",
    // paddingBottom: -5,
    // paddingTop: 10,
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
    // borderBottomWidth: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginLeft: 15,
  },
  TextInputFrom: {
    flex: 1,
    fontFamily: "Lato-Regular",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    borderBottomEndRadius: 8,
    marginRight: 10,
    marginTop: 15,
  },
  TextInputTo: {
    flex: 1,
    fontFamily: "Lato-Regular",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
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
    // marginLeft: 10,
  },
  textInputOneLine: {
    flex: 1,
    fontFamily: "Lato-Regular",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "black",
    color: "#404040",
    fontSize: 12,
    paddingBottom: -5,
    paddingTop: 25,
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
  },
  attachmentTimes: {
    flexDirection: "row",
    paddingRight: 10,
    paddingLeft: 25,
    height: "100%",
  },
  floatPlaceholder: {
    position: "absolute",
    top: -5,
    left: 30,
    fontFamily: "Lato-Regular",
    color: "#A0A0A0",
  },
});
