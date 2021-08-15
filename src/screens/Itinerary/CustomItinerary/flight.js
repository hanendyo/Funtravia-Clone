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
import { Truncate } from "../../../component";
import { Input } from "native-base";
import { default_image } from "../../../assets/png";
import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
import Swipeout from "react-native-swipeout";
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
            Add Flight Number
          </Text>
          <Text
            style={{
              color: "#fff",
            }}
          >
            Custom Activity
          </Text>
        </View>
      </View>
    ),
  };
  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();
  let [dataParent, setDataParent] = useState({});
  let [dataChild, setDataChild] = useState([]);

  //params data
  const dayId = props.route.params.dayId;
  const itineraryId = props.route.params.itineraryID;

  //modal
  const [modals, setModal] = useState(false);
  const [dateTimeModal, setDateTimeModal] = useState(false);

  //input data
  const [flightNumber, setFlightNumber] = useState("");
  const [timeDeparture, setTimeDeparture] = useState("");
  const [timeArrival, setTimeArrival] = useState("");
  const [bookingRef, setBookingRef] = useState(null);
  const [guestName, setGuestName] = useState("");
  const [carrier, setCarrier] = useState(null);
  const [note, setNote] = useState(null);
  const [attachment, setAttachment] = useState([]);

  //constant data
  const order = ["0"];
  const duration = "01:00:00";
  const status = false;
  const qty = 1;
  const icon = "";
  const totalPrice = "";
  const title = "Flight";
  const time = "00:00:00";

  //-- Google API data
  const [from, setFrom] = useState("");
  const [address, setAddress] = useState(
    props.route.params?.dataParent?.address
  );
  const [destination, setDestination] = useState("");
  const [lat, setLat] = useState(props.route.params?.dataParent?.latitude);
  const [long, setLong] = useState(props.route.params?.dataParent?.longitude);

  const inputFromGoogle = (input) => {
    setDestination(input.name);
    setAddress(input.formatted_address);
    setLat(input.geometry.location.lat);
    setLong(input.geometry.location.long);
    console.log(destination);
    console.log(address);
    console.log(lat);
    console.log(long);
  };
  //-- End of Google API

  const [mutation, { loading, data, error }] = useMutation(AddFlight, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  // const pecahData = async (data, id) => {
  //   let dataX = [];
  //   let parent = null;
  //   let dataparents = {};
  //   let index = await data.findIndex((key) => key.id === id);
  //   if (data[index].parent === true) {
  //     parent = data[index].id;
  //   } else {
  //     parent = data[index].parent_id;
  //   }
  //   for (var i of data) {
  //     if (i.id === parent) {
  //       //   dataX.push(i);
  //       dataparents = { ...i };
  //     } else if (i.parent_id === parent) {
  //       dataX.push(i);
  //     }
  //   }

  //   await setDataParent(dataparents);
  //   await setDataChild(dataX);
  // };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [props.navigation]);

  //-- Attachment
  const pickFile = async (id, sumber) => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      });
      let files = new ReactNativeFile({
        uri: res.uri,
        type: res.type,
        name: res.name,
      });

      // let tempe = [...dataUpload];
      // tempe.push(files);
      // await setdataUpload(tempe);
      // await handleUpload(tempe, id, sumber, res);
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
        <View
          style={{
            backgroundColor: "#fff",
            // height: 100,
            borderRadius: 5,
            padding: 15,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Plane width={50} height={50} />
            <TextInput
              placeholder={"Flight No"}
              value={flightNumber}
              onChangeText={setFlightNumber}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
              }}
            />
          </View>
          <View
            style={{
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <CalendarIcon height={15} width={15} />
            <View style={{ backgroundColor: "red" }}>
              <TextInput
                placeholder={"Departure"}
                autoCorrect={false}
                // editable={false}
                value={timeDeparture}
                onChangeText={(e) => setTimeDeparture(e)}
                style={{
                  flex: 1,
                  // padding: 0,
                  fontFamily: "Lato-Regular",
                  borderBottomWidth: 1,
                  borderBottomColor: "#d3d3d3",
                  marginLeft: 10,
                  marginRight: 10,
                  width: 150,
                }}
              />
              <TouchableOpacity
                onPress={() => setDateTimeModal(true)}
                style={{
                  background: "red",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  align: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
            </View>

            <DateTimePickerModal
              isVisible={dateTimeModal}
              mode="datetime"
              onConfirm={(date) => {
                setTimeDeparture(date);
                console.log(date);
                console.log(timeDeparture);
              }}
              onCancel={() => setDateTimeModal(false)}
            />
            <CalendarIcon height={15} width={15} />
            <TextInput
              placeholder={"Arrival"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",

                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
              }}
            />
          </View>
          <View
            style={{
              paddingTop: 10,

              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            {/* <TextInput
              placeholder={"From"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",

                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                // marginLeft: 10,
                // marginRight: 10,
              }}
            /> */}

            <TouchableOpacity
              style={{
                width: "50%",
              }}
              onPress={() => setModal(true)}
            >
              <TextInput
                placeholder={"From"}
                autoCorrect={false}
                editable={false}
                value={destination}
                onChangeText={setDestination}
                keyboardType="default"
                style={{
                  flex: 1,
                  // padding: 0,
                  fontFamily: "Lato-Regular",

                  borderBottomWidth: 1,
                  borderBottomColor: "#d3d3d3",
                }}
              />
            </TouchableOpacity>

            <TextInput
              placeholder={"To"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",

                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
              }}
            />
          </View>
          <TextInput
            placeholder={"Guest Name"}
            values={guestName}
            onChangeText={setGuestName}
            style={{
              flex: 1,
              // padding: 0,
              fontFamily: "Lato-Regular",
              paddingTop: 10,

              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
          />
          <TextInput
            placeholder={"Booking Reference"}
            values={bookingRef}
            onChangeText={setBookingRef}
            style={{
              flex: 1,
              // padding: 0,
              fontFamily: "Lato-Regular",
              paddingTop: 10,

              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
          />
          <TextInput
            placeholder={"Carrier"}
            values={carrier}
            onChangeText={setCarrier}
            style={{
              flex: 1,
              // padding: 0,
              fontFamily: "Lato-Regular",
              paddingTop: 10,

              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
          />
          <Text
            type={"bold"}
            size="label"
            style={{
              paddingTop: 10,
            }}
          >
            Notes
          </Text>
          <TextInput
            placeholder={"Notes"}
            values={note}
            onChangeText={setNote}
            style={{
              // borderWidth: 1,
              fontFamily: "Lato-Regular",

              flex: 1,
              // padding: 0,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
          />
          <Text
            size="label"
            type="bold"
            style={{
              paddingTop: 10,
            }}
          >
            {t("Attachment")}
          </Text>

          <Modal
            onRequestClose={() => setModal(false)}
            animationIn="slideInRight"
            animationOut="slideOutRight"
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
                // height: '100%',
                height: Dimensions.get("screen").height,
              }}
              // behavior={Platform.OS === 'ios' ? 'position' : null}
              // keyboardVerticalOffset={30}
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
                  // marginBottom: 20,
                  marginTop: Platform.OS === "ios" ? 20 : -20,
                }}
              >
                <TouchableOpacity
                  style={{
                    // borderWidth: 1,
                    height: 50,
                    width: 50,
                    position: "absolute",
                    alignItems: "center",
                    alignContent: "center",
                    paddingTop: 15,
                    // top: 20,
                    // left: 20,
                  }}
                  onPress={() => setModal(false)}
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
                  From
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
                  style={{}}
                  query={{
                    key: "AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
                    language: "id", // language of the results
                  }}
                  fetchDetails={true}
                  onPress={(details = null) => {
                    setModal(false);
                    inputFromGoogle(details);
                  }}
                  autoFocus={true}
                  listViewDisplayed="auto"
                  onFail={(error) => console.log(error)}
                  currentLocation={true}
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
                            style={{ fontFamily: "Lato-Bold", fontSize: 12 }}
                          >
                            {/* {x[0]} */}
                            {x ? x[0] : data.name}
                          </Text>
                          <Text
                            style={{ fontFamily: "Lato-Regular", fontSize: 12 }}
                          >
                            <Truncate
                              text={
                                data.description
                                  ? data.description
                                  : data.vicinity
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

          <View style={{ flex: 1, marginVertical: 10 }}>
            <TouchableOpacity
              onPress={() => {
                pickFile();
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
                Choose File
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
              Alert.alert("comming soon");
            }}
            text={t("save")}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
