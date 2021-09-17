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
  Pointmapgray,
  Stay,
  Xhitam,
} from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
import Swipeout from "react-native-swipeout";
import {
  Button,
  Text,
  FunIcon,
  Capital,
  Truncate,
  Peringatan,
  FloatingInput,
} from "../../../component";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import { ReactNativeFile } from "apollo-upload-client";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import { API_KEY } from "../../../config";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import AddCustomAccomodation from "../../../graphQL/Mutation/Itinerary/AddCustomAccomodation";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";

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
            Stay
          </Text>
          <Text
            style={{
              color: "#fff",
            }}
          >
            {t("CustomActivity")}
          </Text>
        </View>
      </View>
    ),
  };

  const Notch = DeviceInfo.hasNotch();
  const { t, i18n } = useTranslation();
  let [dataParent, setDataParent] = useState({});
  let [dataChild, setDataChild] = useState([]);
  let [token, setToken] = useState("");

  //params data
  const dayId = props.route.params.dayId;
  const itineraryId = props.route.params.itineraryId;

  // modal
  let [timeModalCheckIn, setTimeModalCheckIn] = useState("");
  let [timeModalCheckOut, setTimeModalCheckOut] = useState("");
  let [modalHotelName, setModalHotelName] = useState(false);

  //  Alert
  let [alertPopUp, setAlertPopUp] = useState({
    show: false,
    judul: "",
    detail: "",
  });

  const getToken = async () => {
    //! Hanendyo's work
    let tkn = await AsyncStorage.getItem("access_token");
    if (tkn !== null) {
      setToken(tkn);
    } else {
      setToken("");
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      getToken();
    });
    return unsubscribe;
  }, [props.navigation]);

  //

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

      let tempData = [...dataState.file];
      tempData.push(files);
      await setdataState((prevFile) => {
        return {
          ...prevFile,
          ["file"]: tempData,
        };
      });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  // state
  let [dataState, setdataState] = useState({
    day_id: "", //wajib
    title: "", // == hotel_name
    icon: "", //gb_tour
    qty: 1, //
    address: "", //wajib
    latitude: 0, //wajib
    longitude: 0, //wajib
    note: "", //ga wajib
    time: "", //hardcode
    duration: "", //hardcode
    status: false, //
    order: [], //0
    total_price: 0,
    hotel_name: "", //wajib
    guest_name: "", //wajib
    booking_ref: "", //wajib
    checkin: "", //wajib
    checkout: "", //wajib
    file: [], //wajib
  });

  const [itemValid, setItemValid] = useState({
    booking_ref: true, //wajib
    guest_name: true, //wajib
    // modal field
    hotel_name: true, //wajib
    address: true, //wajib
    checkin: true, //wajib
    checkout: true, //wajib,
    file: true, //wajib
  });

  const [secondState, setSecondState] = useState({
    hotel_name: "",
    checkin: "",
    checkout: "",
  });

  let startDate = props.route.params.startDate.split(" ").join("T");
  let endDate = props.route.params.endDate.split(" ").join("T");

  const validation = (name, value) => {
    if (!value || value === "" || value == null) {
      return false;
    } else if (name === "hotel_name") {
      return dataState.hotel_name != "" ? true : false;
    } else if (name === "booking_ref") {
      return value.length != "" ? true : false;
    } else if (name === "guest_name") {
      return value.length != "" ? true : false;
    } else if (name === "address") {
      return dataState.address != "" ? true : false;
    } else if (name === "checkin") {
      return dataState.checkin != "" ? true : false;
    } else if (name === "checkout") {
      return dataState.checkout != "" ? true : false;
    } else {
      return true;
    }
  };

  const onChangeValidation = (name) => (text) => {
    let check = validation(name, text);
    setdataState({ ...dataState, [name]: text });
    setItemValid((prev) => {
      return { ...prev, [name]: check };
    });
  };

  const modalStateValidation = (name) => {
    if (name === "hotel_name") {
      return dataState.hotel_name == null || dataState.hotel_name.length == 0
        ? setItemValid((prevNameHotel) => {
            return { ...prevNameHotel, ["hotel_name"]: false };
          })
        : setItemValid((prevNameHotel) => {
            return { ...prevNameHotel, ["hotel_name"]: true };
          });
    } else if (name === "address") {
      return dataState.address == null || dataState.address == ""
        ? setItemValid((prevAddress) => {
            return { ...prevAddress, ["address"]: false };
          })
        : setItemValid((prevAddress) => {
            return { ...prevAddress, ["address"]: true };
          });
    } else if (name === "checkin") {
      return dataState.checkin == null || dataState.checkin == ""
        ? setItemValid((prevCheckIn) => {
            return { ...prevCheckIn, ["checkin"]: false };
          })
        : setItemValid((prevCheckIn) => {
            return { ...prevCheckIn, ["checkin"]: true };
          });
    } else if (name === "checkout") {
      return dataState.checkout == null || dataState.checkout == ""
        ? setItemValid((prev) => {
            return { ...prev, ["checkout"]: false };
          })
        : setItemValid((prev) => {
            return { ...prev, ["checkout"]: true };
          });
    } else if (name === "guest_name") {
      return dataState.guest_name == null || dataState.guest_name == ""
        ? setItemValid((prev) => {
            return { ...prev, ["guest_name"]: false };
          })
        : setItemValid((prev) => {
            return { ...prev, ["guest_name"]: true };
          });
    } else if (name === "booking_ref") {
      return dataState.booking_ref == null || dataState.booking_ref == ""
        ? setItemValid((prev) => {
            return { ...prev, ["booking_ref"]: false };
          })
        : setItemValid((prev) => {
            return { ...prev, ["booking_ref"]: true };
          });
    } else if (name === "file") {
      return dataState.file == null ||
        dataState.file == [] ||
        dataState.file.length == 0
        ? setItemValid((prev) => {
            return { ...prev, ["file"]: false };
          })
        : setItemValid((prev) => {
            return { ...prev, ["file"]: true };
          });
    }
  };

  const modalValidation = () => {
    setItemValid((prev) => {
      return {
        ...prev,
        ["hotel_name"]: modalStateValidation("hotel_name"),
      };
    });
    setItemValid((prev) => {
      return { ...prev, ["address"]: modalStateValidation("address") };
    });
    setItemValid((prev) => {
      return {
        ...prev,
        ["guest_name"]: modalStateValidation("guest_name"),
      };
    });
    setItemValid((prev) => {
      return { ...prev, ["checkin"]: modalStateValidation("checkin") };
    });
    setItemValid((prev) => {
      return { ...prev, ["checkout"]: modalStateValidation("checkout") };
    });
    setItemValid((prev) => {
      return {
        ...prev,
        ["booking_ref"]: modalStateValidation("booking_ref"),
      };
    });
    setItemValid((prev) => {
      return { ...prev, ["file"]: modalStateValidation("file") };
    });

    if (
      dataState.hotel_name == null ||
      dataState.hotel_name == "" ||
      dataState.address == null ||
      dataState.address == "" ||
      dataState.guest_name == null ||
      dataState.guest_name == "" ||
      dataState.checkin == null ||
      dataState.checkin == "" ||
      dataState.checkout == null ||
      dataState.checkout == ""
    ) {
      setAlertPopUp({
        ...alertPopUp,
        show: true,
        judul: t("someFormFieldIsEmpty"),
        detail: "",
      });
    } else {
      submitDataAPI();
    }
  };

  let [dateStatus, setDateStatus] = useState({
    start: true,
    end: true,
  });

  let [renderDate, setRenderDate] = useState({
    renderCheckIn: "",
    renderCheckOut: "",
  });

  const timeConverter = (date) => {
    //! Hanendyo's work'
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

    if (timeModalCheckIn) {
      setdataState((prevCin) => {
        return {
          ...prevCin,
          ["checkin"]: formattedDate,
        };
      });

      // setCheckInCheck(formatForScreen);
      setRenderDate((prev) => {
        return { ...prev, ["renderCheckIn"]: formatForScreen };
      });
    }

    if (timeModalCheckOut) {
      setdataState((prevCout) => {
        return {
          ...prevCout,
          ["checkout"]: formattedDate,
        };
      });

      // setCheckoutCheck(formatForScreen);
      setRenderDate((prev) => {
        return { ...prev, ["renderCheckOut"]: formatForScreen };
      });
    }
  };

  const [mutation, { loading, data, error }] = useMutation(
    AddCustomAccomodation,
    {
      //! Hanendyo's work'
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

  useEffect(() => {
    //! Hanendyo's work
  }, [dataState]);

  const simpanketimeline = (inputan) => {
    modalValidation();
  };

  const submitDataAPI = async () => {
    //! Hanendyo's work
    // POST DATA STATE ke https://dev-gql.funtravia.com/graphql
    try {
      let response = await mutation({
        variables: {
          day_id: dataState.day_id,
          title: dataState.title, // == hotel_name
          icon: dataState.icon, //gb_tour
          qty: dataState.qty, // ==
          address: dataState.address, // ==wajib
          latitude: dataState.latitude, //wajib
          longitude: dataState.longitude, //wajib
          note: dataState.note, // ==ga wajib
          time: dataState.time, //hardcode
          duration: dataState.duration, //hardcode
          status: dataState.status, // ==
          order: dataState.order, // ==0
          total_price: dataState.total_price, //
          hotel_name: dataState.hotel_name, //wajib
          guest_name: dataState.guest_name, //wajib
          booking_ref: dataState.booking_ref, //wajib
          checkin: dataState.checkin, // ==wajib
          checkout: dataState.checkout, //wajib
          file: dataState.file, //wajib
        },
      });
      if (error) {
        throw new Error("Error input");
      }
      if (response.data) {
        if (response.data.add_custom_accomodation.code !== 200) {
          throw new Error(response.data.add_custom_accomodation.message);
        } else {
          props.navigation.goBack();
        }
      }
    } catch (error) {
      setAlertPopUp({
        ...alertPopUp,
        show: true,
        judul: "Submit Data Error",
        detail: error,
      });
    }
  };

  console.log(`PROPS: `, props);
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
              marginBottom: 10,
              marginTop: 0,
            }}
          >
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
                marginTop: 10,
              }}
            >
              <Stay height={30} width={30} />
            </View>
            <View
              style={{
                flex: 1,
                fontFamily: "Lato-Regular",
                borderBottomColor: "#d3d3d3",
                borderBottomEndRadius: 10,
                borderBottomWidth: 1,
                marginLeft: 10,
                fontSize: 14,
              }}
            >
              {dataState.hotel_name == "" ? null : (
                <Text
                  style={{
                    position: "absolute",
                    top: Platform.OS == "ios" ? -20 : -5,
                    left: 0,
                    fontFamily: "Lato-Regular",
                    fontSize: 14,
                    color: "#A0A0A0",
                  }}
                >
                  {t("HotelName")}
                </Text>
              )}
              <TextInput
                placeholder={t("HotelName")}
                autoCorrect={false}
                style={{
                  // flex: 1,
                  // fontFamily: "Lato-Regular",
                  // borderBottomColor: "#d3d3d3",
                  // borderBottomEndRadius: 10,
                  // fontSize: 14,
                  // paddingTop: 20,

                  color: "#464646",
                  paddingBottom: 5,
                }}
                editable={false}
                value={dataState.hotel_name}
              />
              {dataState.hotel_name == "" ? (
                itemValid.hotel_name === false ? (
                  <Text
                    type="regular"
                    size="small"
                    style={{
                      color: "#D75995",
                      position: "absolute",
                      bottom: -15,
                      left: 0,
                    }}
                  >
                    {"*" + t("inputAlertHotelName")}
                  </Text>
                ) : null
              ) : null}
            </View>

            <TouchableOpacity
              onPress={() => setModalHotelName(true)}
              style={{
                position: "absolute",
                top: 0,
                align: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </View>
          <View style={{ marginBottom: 10 }}>
            {dataState.address == "" ? null : (
              <Text
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  fontFamily: "Lato-Regular",
                  color: "#A0A0A0",
                  fontSize: 14,
                }}
              >
                {t("address")}
              </Text>
            )}
            <TextInput
              placeholder={t("address")}
              autoCorrect={false}
              style={{
                paddingTop: Platform.OS === "ios" ? 20 : 15,
                flex: 1,
                fontFamily: "Lato-Regular",
                paddingBottom: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                fontSize: 14,
              }}
              value={dataState.address}
              onChangeText={onChangeValidation("address")}
            />
            {dataState.address == "" ? (
              itemValid.address === false ? (
                <Text
                  type="regular"
                  size="small"
                  style={{
                    color: "#D75995",
                    position: "absolute",
                    bottom: -15,
                    left: 0,
                  }}
                >
                  {"*" + t("inputAlertAddress")}
                </Text>
              ) : null
            ) : null}
          </View>

          <View style={{ marginBottom: 10 }}>
            <FloatingInput
              label={t("Guest Name")}
              autoCorrect={false}
              customTextStyle={{
                color: "#464646",
                borderBottomColor: "#d3d3d3",
              }}
              value={dataState.guest_name}
              onChangeText={onChangeValidation("guest_name")}
            />
            {itemValid.guest_name === false ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  position: "absolute",
                  bottom: -15,
                }}
              >
                {"*" + t("inputAlertGuestName")}
              </Text>
            ) : null}
          </View>

          <View
            style={{
              paddingTop: 10,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                borderBottomEndRadius: 10,
              }}
            >
              {dataState.checkin == "" ? null : (
                <Text
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 25,
                    fontFamily: "Lato-Regular",
                    color: "#A0A0A0",
                    fontSize: 14,
                  }}
                >
                  {t("checkIn")}
                </Text>
              )}
              <CalendarIcon height={15} width={15} />
              <TextInput
                placeholder={t("checkIn")}
                autoCorrect={false}
                style={{
                  flex: 1,
                  paddingBottom: 5,
                  fontFamily: "Lato-Regular",
                  borderBottomColor: "#d3d3d3",
                  borderBottomEndRadius: 10,
                  paddingVertical: 10,
                  marginLeft: 10,
                  fontSize: 14,
                }}
                value={renderDate.renderCheckIn}
              />
              {/* {
                dateValidation()
              }, */}
              {dataState.checkin == "" ? (
                itemValid.checkin === false ? (
                  <Text
                    type="regular"
                    size="small"
                    style={{
                      color: "#D75995",
                      position: "absolute",
                      bottom: -15,
                      left: 0,
                    }}
                  >
                    {"*" + t("inputAlertCheckIn")}
                  </Text>
                ) : null
              ) : null}
              <TouchableOpacity
                onPress={() => setTimeModalCheckIn(true)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  align: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
              <DateTimePickerModal
                isVisible={timeModalCheckIn}
                mode="datetime"
                minimumDate={new Date(startDate)}
                maximumDate={new Date(endDate)}
                // display="inline"
                locale="en_id"
                onConfirm={(date) => {
                  timeConverter(date);
                  setTimeModalCheckIn(false);
                }}
                onCancel={() => setTimeModalCheckIn(false)}
              />
            </View>
            <View
              style={{
                flex: 1,
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                // borderBottomEndRadius: 10,
                marginLeft: 10,
              }}
            >
              {dataState.checkout == "" ? null : (
                <Text
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 25,
                    fontFamily: "Lato-Regular",
                    color: "#A0A0A0",
                    fontSize: 14,
                  }}
                >
                  {t("checkOut")}
                </Text>
              )}
              <CalendarIcon height={15} width={15} />
              <TextInput
                placeholder={t("checkOut")}
                autoCorrect={false}
                style={{
                  flex: 1,
                  paddingBottom: 5,
                  paddingVertical: 10,
                  fontFamily: "Lato-Regular",
                  borderBottomColor: "#d3d3d3",
                  marginLeft: 10,
                  fontSize: 14,
                }}
                value={renderDate.renderCheckOut}
              />
              {dataState.checkout == "" ? (
                itemValid.checkout === false ? (
                  <Text
                    type="regular"
                    size="small"
                    style={{
                      color: "#D75995",
                      position: "absolute",
                      bottom: -15,
                      left: 0,
                    }}
                  >
                    {"*" + t("inputAlertCheckOut")}
                  </Text>
                ) : null
              ) : null}
              <TouchableOpacity
                onPress={() => setTimeModalCheckOut(true)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  align: "center",
                  width: "100%",
                  height: "100%",
                }}
              />
              <DateTimePickerModal
                isVisible={timeModalCheckOut}
                mode="datetime"
                minimumDate={new Date(startDate)}
                maximumDate={new Date(endDate)}
                // display="inline"
                locale="en_id"
                onConfirm={(date) => {
                  timeConverter(date);
                  setTimeModalCheckOut(false);
                }}
                onCancel={() => setTimeModalCheckOut(false)}
              />
            </View>
          </View>

          <View style={{ marginBottom: 20 }}>
            <FloatingInput
              label={t("BookingRef")}
              autoCorrect={false}
              customTextStyle={{
                color: "#464646",
                borderBottomColor: "#d3d3d3",
              }}
              value={dataState.booking_ref}
              onChangeText={onChangeValidation("booking_ref")}
            />
            {itemValid.booking_ref === false ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  position: "absolute",
                  bottom: -15,
                }}
              >
                {"*" + t("inputAlertBookingRef")}
              </Text>
            ) : null}
          </View>
        </View>
        <View
          style={{
            backgroundColor: "#fff",
            padding: 10,
            paddingBottom: 15,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: "#d1d1d1",
          }}
        >
          <View>
            <View>
              <Text
                type={"bold"}
                size="label"
                style={{
                  paddingTop: 20,
                }}
              >
                {t("Notes")}
              </Text>
            </View>
            <View style={{ marginBottom: 10 }}>
              <TextInput
                placeholder={t("Notes")}
                autoCorrect={false}
                style={{
                  // borderWidth: 1,
                  fontFamily: "Lato-Regular",
                  paddingTop: 10,
                  paddingBottom: 10,
                  flex: 1,
                  borderBottomWidth: 1,
                  borderBottomColor: "#d3d3d3",
                }}
                value={dataState.note}
                onChangeText={(e) => {
                  setdataState({ ...dataState, ["note"]: e });
                }}
                onSubmitEditing={(e) => {
                  setdataState({ ...dataState, ["note"]: e });
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            backgroundColor: "#fff",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            padding: 10,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderColor: "#d1d1d1",
          }}
        >
          <View>
            <Text
              size="label"
              type="bold"
              style={{
                paddingTop: 20,
                marginBottom: 10,
              }}
            >
              {t("Attachment")}
            </Text>
          </View>

          <View style={{ flex: 1, marginVertical: 10 }}>
            {dataState.file.map((data, index) => {
              return (
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <Text style={{ width: 30 }}>{index + 1}. </Text>
                  <Text style={{ flex: 1, paddingBottom: 5 }}>{data.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      let temp = [...dataState.file];
                      temp.splice(index, 1);
                      setdataState((prevFile) => {
                        return {
                          ...prevFile,
                          ["file"]: temp,
                        };
                      });
                    }}
                    style={{
                      flexDirection: "row",
                      alignContent: "flex-start",
                      alignItems: "flex-start",
                    }}
                  >
                    <Xhitam width={10} height={10} />
                  </TouchableOpacity>
                </View>
              );
            })}
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
                marginBottom: 10,
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
          </View>
        </View>
      </ScrollView>
      <Modal
        onRequestClose={() => {
          setModalHotelName(false);
        }}
        hasBackdrop={false}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        isVisible={modalHotelName}
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
                height: 70,
                width: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
                paddingTop: 20,
                // top: 20,
                // left: 20,
              }}
              onPress={() => {
                setModalHotelName(false);
              }}
            >
              <Arrowbackwhite width={20} height={40} style={{ left: 5 }} />
            </TouchableOpacity>
            <Text
              style={{
                top: 20,
                left: 60,
                fontFamily: "Lato-Bold",
                fontSize: 15,
                color: "white",
                height: 50,
                position: "absolute",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              {t("HotelName")}
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              height: Dimensions.get("screen").height,
              backgroundColor: "white",
              paddingTop: 20,
              paddingHorizontal: 20,
              paddingBottom: 10,
            }}
          >
            <GooglePlacesAutocomplete
              query={{
                key: API_KEY,
                language: "id", // language of the results
              }}
              fetchDetails={true}
              onPress={async (data, details) => {
                // 'details' is provided when fetchDetails = true
                if (modalHotelName) {
                  setdataState((prevName) => {
                    return {
                      ...prevName,
                      ["hotel_name"]: data.structured_formatting.main_text,
                    };
                  });
                  setSecondState({
                    ...secondState,
                    ["hotel_name"]: data.structured_formatting.main_text,
                  });
                  setdataState((prevAddress) => {
                    return {
                      ...prevAddress,
                      ["address"]: data.structured_formatting.secondary_text,
                    };
                  });
                  setdataState((prevLat) => {
                    return {
                      ...prevLat,
                      ["latitude"]: details.geometry.location.lat,
                    };
                  });
                  setdataState((prevLng) => {
                    return {
                      ...prevLng,
                      ["longitude"]: details.geometry.location.lng,
                    };
                  });

                  // setState DAY_ID
                  setdataState((prevDayId) => {
                    return {
                      ...prevDayId,
                      ["day_id"]: dayId,
                    };
                  });
                  // setState Title
                  setdataState((prevTitle) => {
                    return {
                      ...prevTitle,
                      ["title"]: data.structured_formatting.main_text,
                    };
                  });
                  // setState ICON
                  setdataState((prevIcon) => {
                    return {
                      ...prevIcon,
                      ["icon"]: `gb_tour`,
                    };
                  });
                  // setState time
                  setdataState((prevTime) => {
                    return {
                      ...prevTime,
                      ["time"]: "00:00:00",
                    };
                  });
                  // setState duration
                  setdataState((prevDur) => {
                    return {
                      ...prevDur,
                      ["duration"]: `01:00:00`,
                    };
                  });
                  // setState Order
                  setdataState((prevOrder) => {
                    return {
                      ...prevOrder,
                      ["order"]: [0],
                    };
                  });

                  setdataState((prevStatus) => {
                    return {
                      ...prevStatus,
                      ["status"]: false,
                    };
                  });
                }
                setModalHotelName(false);
              }}
              query={{
                key: API_KEY,
                language: "en",
                fields: "formatted_address, name, geometry",
              }}
              autoFocus={true}
              listViewDisplayed="auto"
              currentLocation={true}
              placeholder={t("SearchForHotel")}
              // currentLocationLabel="Nearby location"
              renderLeftButton={() => {
                return (
                  <View style={{ justifyContent: "center" }}>
                    <Pointmapgray />
                  </View>
                );
              }}
              // GooglePlacesSearchQuery={{ rankby: "distance" }}
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
            // paddingBottom: 40,
          }}
        >
          <Button
            onPress={() => {
              simpanketimeline();
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
    </SafeAreaView>
  );
}
