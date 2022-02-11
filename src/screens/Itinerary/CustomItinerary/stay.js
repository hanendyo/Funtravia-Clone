import React, {useState, useEffect, useRef} from "react";
import {
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useMutation} from "@apollo/react-hooks";
import {
  Arrowbackios,
  Arrowbackwhite,
  CalendarIcon,
  New,
  Pointmapblack,
  Stay,
  Xhitam,
  Magnifying,
  Xblue,
} from "../../../assets/svg";
import {
  Button,
  Text,
  FunIcon,
  Capital,
  Truncate,
  Peringatan,
  FloatingInput,
  FunDocument,
  Loading,
} from "../../../component";
import {useTranslation} from "react-i18next";
import DocumentPicker from "react-native-document-picker";
import {ReactNativeFile} from "apollo-upload-client";
import DeviceInfo from "react-native-device-info";
import {API_KEY} from "../../../config";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import AddCustomAccomodation from "../../../graphQL/Mutation/Itinerary/AddCustomAccomodation";
import UpdateCustomStay from "../../../graphQL/Mutation/Itinerary/UpdateCustomStay";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import {request, check, PERMISSIONS} from "react-native-permissions";
import Geolocation from "react-native-geolocation-service";
import {useSelector} from "react-redux";

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
      height: 100,
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
          marginBottom: 20,
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
  const token = useSelector((data) => data.token);
  const GooglePlacesRef = useRef();

  //params data
  const dayId = props.route.params.dayId;
  const itineraryId = props.route.params.itineraryId;

  // modal
  let [timeModalCheckIn, setTimeModalCheckIn] = useState(false);
  let [timeModalCheckOut, setTimeModalCheckOut] = useState(false);
  let [modalHotelName, setModalHotelName] = useState(false);

  //  Alert
  let [alertPopUp, setAlertPopUp] = useState({
    show: false,
    judul: "",
    detail: "",
  });

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      addAttachmentCustom();
    });
    return unsubscribe;
  }, [props.navigation]);

  //

  const pickFile = async () => {
    try {
      const res = await DocumentPicker.pickSingle({
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
    id: props.route.params?.activityId ? props.route.params.activityId : "", //edit custom stay
    day_id: props.route.params?.dayId ? props.route.params.dayId : dayId, //wajib
    title: props.route.params?.detail_accomodation
      ? props.route.params.detail_accomodation.hotel_name
      : "", // == hotel_name
    icon: "gb_tour", //gb_tour
    qty: 1, //
    address: props.route.params?.address ? props.route.params.address : "", //wajib
    latitude: props.route.params?.latitude ? props.route.params.latitude : 0, //wajib
    longitude: props.route.params?.longitude ? props.route.params.longitude : 0, //wajib
    note: props.route.params?.note ? props.route.params.note : "", //ga wajib
    time: "00:00:00", //hardcode
    duration: "01:00:00", //hardcode
    status: false, //
    order: ["0"], //0
    total_price: 0,
    hotel_name: props.route.params?.detail_accomodation
      ? props.route.params.detail_accomodation.hotel_name
      : "", //wajib
    guest_name: props.route.params?.detail_accomodation
      ? props.route.params.detail_accomodation.guest_name
      : "", //wajib
    booking_ref: props.route.params?.detail_accomodation?.booking_ref
      ? props.route.params.detail_accomodation?.booking_ref
      : "", //wajib
    checkin: props.route.params?.detail_accomodation?.checkin
      ? props.route.params?.detail_accomodation?.checkin?.split(" ").join("T")
      : "", //wajib
    checkout: props.route.params?.detail_accomodation?.checkout
      ? props.route.params?.detail_accomodation?.checkout?.split(" ").join("T")
      : "", //wajib
    fileCustom: props.route.params?.attachment
      ? props.route.params.attachment
      : [], //wajib
    fileCustomEdit: [],
    file: [],
  });

  const addAttachmentCustom = () => {
    let temp = [];
    for (let file of dataState.fileCustom) {
      let files = new ReactNativeFile({
        uri: file.filepath,
        name: file.file_name,
        type: file.extention,
      });
      temp.push(files);
    }
    let tempData = [...dataState.fileCustomEdit, ...temp];
    setdataState((prevState) => ({...prevState, fileCustomEdit: tempData}));
  };

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

  let startDate = props.route.params?.startDate?.split(" ").join("T");
  let endDate = props.route.params?.endDate?.split(" ").join("T");

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
    setdataState({...dataState, [name]: text});
    setItemValid((prev) => {
      return {...prev, [name]: check};
    });
  };

  const modalStateValidation = (name) => {
    if (name === "hotel_name") {
      return dataState.hotel_name == null || dataState.hotel_name.length == 0
        ? setItemValid((prevNameHotel) => {
            return {...prevNameHotel, ["hotel_name"]: false};
          })
        : setItemValid((prevNameHotel) => {
            return {...prevNameHotel, ["hotel_name"]: true};
          });
    } else if (name === "address") {
      return dataState.address == null || dataState.address == ""
        ? setItemValid((prevAddress) => {
            return {...prevAddress, ["address"]: false};
          })
        : setItemValid((prevAddress) => {
            return {...prevAddress, ["address"]: true};
          });
    } else if (name === "checkin") {
      return dataState.checkin == null || dataState.checkin == ""
        ? setItemValid((prevCheckIn) => {
            return {...prevCheckIn, ["checkin"]: false};
          })
        : setItemValid((prevCheckIn) => {
            return {...prevCheckIn, ["checkin"]: true};
          });
    } else if (name === "checkout") {
      return dataState.checkout == null || dataState.checkout == ""
        ? setItemValid((prev) => {
            return {...prev, ["checkout"]: false};
          })
        : setItemValid((prev) => {
            return {...prev, ["checkout"]: true};
          });
    } else if (name === "guest_name") {
      return dataState.guest_name == null || dataState.guest_name == ""
        ? setItemValid((prev) => {
            return {...prev, ["guest_name"]: false};
          })
        : setItemValid((prev) => {
            return {...prev, ["guest_name"]: true};
          });
    } else if (name === "booking_ref") {
      return dataState.booking_ref == null || dataState.booking_ref == ""
        ? setItemValid((prev) => {
            return {...prev, ["booking_ref"]: false};
          })
        : setItemValid((prev) => {
            return {...prev, ["booking_ref"]: true};
          });
    } else if (name === "file") {
      return dataState.file == null ||
        dataState.file == [] ||
        dataState.file.length == 0
        ? setItemValid((prev) => {
            return {...prev, ["file"]: false};
          })
        : setItemValid((prev) => {
            return {...prev, ["file"]: true};
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
      return {...prev, ["address"]: modalStateValidation("address")};
    });
    setItemValid((prev) => {
      return {
        ...prev,
        ["guest_name"]: modalStateValidation("guest_name"),
      };
    });
    setItemValid((prev) => {
      return {...prev, ["checkin"]: modalStateValidation("checkin")};
    });
    setItemValid((prev) => {
      return {...prev, ["checkout"]: modalStateValidation("checkout")};
    });
    setItemValid((prev) => {
      return {
        ...prev,
        ["booking_ref"]: modalStateValidation("booking_ref"),
      };
    });
    setItemValid((prev) => {
      return {...prev, ["file"]: modalStateValidation("file")};
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
      props.route.params.activityId ? submitDataEditAPI() : submitDataAPI();
    }
  };

  const submitDataEditAPI = async () => {
    try {
      setLoadingApp(true);
      let response = await mutationUpdate({
        variables: {
          id: dataState.id,
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
          file: [...dataState.fileCustomEdit, ...dataState.file], //wajib
        },
      });
      if (loadingUpdate) {
        setLoadingApp(true);
      }

      if (error) {
        throw new Error("Error input");
      }
      if (response.data) {
        setLoadingApp(false);
        if (response.data.update_custom_accomodation.code !== 200) {
          throw new Error(response.data.update_custom_accomodation.message);
        } else {
          props.navigation.navigate("itindetail");
        }
      }
    } catch (error) {
      setAlertPopUp({
        ...alertPopUp,
        show: true,
        judul: "Submit Update Data Error",
        detail: error,
      });
      setLoadingApp(false);
    }
  };

  let [dateStatus, setDateStatus] = useState({
    start: true,
    end: true,
  });

  let [renderDate, setRenderDate] = useState({
    renderCheckIn: props.route.params?.detail_accomodation?.checkin
      ? props.route.params?.detail_accomodation?.checkin
      : "",
    renderCheckOut: props.route.params?.detail_accomodation?.checkout
      ? props.route.params.detail_accomodation.checkout
      : "",
  });

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

    if (timeModalCheckIn) {
      setdataState((prevCin) => {
        return {
          ...prevCin,
          checkin: formattedDate,
        };
      });

      // setCheckInCheck(formatForScreen);
      setRenderDate((prev) => {
        return {...prev, renderCheckIn: formatForScreen};
      });
    }

    if (timeModalCheckOut) {
      setdataState((prevCout) => {
        return {
          ...prevCout,
          checkout: formattedDate,
        };
      });

      // setCheckoutCheck(formatForScreen);
      setRenderDate((prev) => {
        return {...prev, renderCheckOut: formatForScreen};
      });
    }
  };

  const [
    mutationUpdate,
    {loading: loadingUpdate, data: dataUpdate, error: errorUpdate},
  ] = useMutation(UpdateCustomStay, {
    context: {
      headers: {
        "Content-Type":
          !dataState.file?.length || !dataState.fileCustomEdit?.length
            ? `application/json`
            : `multipart/form-data`,
        Authorization: token,
      },
    },
  });

  const [mutation, {loading, data, error}] = useMutation(
    AddCustomAccomodation,
    {
      context: {
        headers: {
          "Content-Type": !dataState.file.length
            ? `application/json`
            : `multipart/form-data`,
          Authorization: token,
        },
      },
    }
  );

  const simpanketimeline = (inputan) => {
    modalValidation();
  };

  const submitDataAPI = async () => {
    try {
      setLoadingApp(true);
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
      if (loading) {
        setLoadingApp(true);
      }
      if (error) {
        console.log(error);
        // throw new Error("Error input");
      }
      if (response.data) {
        setLoadingApp(false);
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
      setLoadingApp(false);
    }
  };

  const [dataNearby, setDataNearby] = useState([]);
  const [loadingApp, setLoadingApp] = useState(false);
  const [text, setText] = useState("");

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
          "&radius=50000&key=AIzaSyD4qyD449yZQ2_7AbdnUvn9PpAxCZ4wZEg",
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
        let HOTEL_ICON_API =
          "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png";

        for (var i of responseJson.results) {
          if (i.icon.includes("lodging")) {
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
        showsVerticalScrollIndicator={false}
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
                // editable={false}
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
              onPress={() => {
                setModalHotelName(true);
                GetLocation();
              }}
              style={{
                position: "absolute",
                top: 0,
                align: "center",
                width: "100%",
                height: "100%",
              }}
            />
          </View>
          <View style={{marginBottom: 10}}>
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
              editable={false}
              autoCorrect={false}
              style={{
                paddingTop: Platform.OS === "ios" ? 20 : 15,
                flex: 1,
                fontFamily: "Lato-Regular",
                paddingBottom: 5,
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                fontSize: 14,
                color: "#464646",
              }}
              value={dataState.address}
              onChangeText={onChangeValidation("address")}
              selection={{start: 0, end: 0}}
            />
            <TouchableOpacity
              style={{
                alignContent: "center",
                top: 0,
                left: 0,
                position: "absolute",
                height: "100%",
                width: "100%",
              }}
              onPress={() =>
                !dataState.hotel_name
                  ? setAlertPopUp({
                      ...alertPopUp,
                      show: true,
                      judul: t("PleaseFillYourHotelName"),
                      detail: "",
                    })
                  : null
              }
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

          <View style={{marginBottom: 10}}>
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
                disabled
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

          <View style={{marginBottom: 20}}>
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
            {/* {itemValid.booking_ref === false ? (
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
            ) : null} */}
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
            <View style={{marginBottom: 10}}>
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
                  setdataState({...dataState, note: e});
                }}
                onSubmitEditing={(e) => {
                  setdataState({...dataState, note: e});
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

          <View style={{flex: 1, marginBottom: 10}}>
            {dataState.fileCustomEdit.map((data, index) => {
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
                      let temp = [...dataState.fileCustomEdit];
                      temp.splice(index, 1);
                      setdataState((prevFile) => ({
                        ...prevFile,
                        fileCustomEdit: temp,
                      }));
                    }}
                    style={styles.attachmentTimes}
                  >
                    <Xhitam width={10} height={10} />
                  </TouchableOpacity>
                </View>
              );
            })}
            {dataState.file.map((data, index) => {
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
                    filename={data.name}
                    filepath={data.uri}
                    progressBar
                    icon
                  />
                  <TouchableOpacity
                    onPress={() => {
                      let temp = [...dataState.file];
                      temp.splice(index, 1);
                      setdataState((prevFile) => {
                        return {
                          ...prevFile,
                          file: temp,
                        };
                      });
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
                    <Xhitam width={10} height={10} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
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
          backgroundColor: "#14646e",
          justifyContent: "flex-end",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
          margin: 0,
        }}
      >
        <SafeAreaView>
          <KeyboardAvoidingView
            style={{
              flex: 1,
              // backgroundColor: "#209fae",

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
                marginTop: Platform.OS === "ios" ? 0 : 0,
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
                {Platform.OS == "ios" ? (
                  <Arrowbackios height={15} width={15}></Arrowbackios>
                ) : (
                  <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
                )}
              </TouchableOpacity>
              <Text
                style={{
                  top: 15,
                  left: 60,
                  fontFamily: "Lato-Bold",
                  fontSize: 15,
                  color: "white",
                  // height: 50,
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
                  language: t("googleLocationLang"), // language of the results
                }}
                fetchDetails={true}
                onPress={async (data, details) => {
                  // 'details' is provided when fetchDetails = true
                  if (modalHotelName) {
                    setdataState((prevName) => {
                      return {
                        ...prevName,
                        title: data.structured_formatting.main_text,
                        hotel_name: data.structured_formatting.main_text,
                        address: data.structured_formatting.secondary_text,
                        latitude: details.geometry.location.lat,
                        longitude: details.geometry.location.lng,
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
                ref={GooglePlacesRef}
                textInputProps={{
                  onChangeText: (text) => setText(text),
                  value: text,
                }}
                autoFocus={true}
                listViewDisplayed="auto"
                currentLocation={true}
                placeholder={t("SearchForHotel")}
                // currentLocationLabel="Nearby location"
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
                GooglePlacesSearchQuery={{rankby: "distance"}}
                enablePoweredByContainer={false}
                renderRow={(data) => {
                  if (data.description) {
                    var x = data.description?.split(",");
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
                      <View
                        style={{width: Dimensions.get("screen").width - 60}}
                      >
                        <Text style={{fontFamily: "Lato-Bold", fontSize: 12}}>
                          {/* {x[0]} */}
                          {x ? x[0] : data.name}
                        </Text>
                        <Text
                          style={{fontFamily: "Lato-Regular", fontSize: 12}}
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
              {dataNearby && dataNearby.length && !text.length ? (
                <View
                  showsVerticalScrollIndicator={false}
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
                          if (modalHotelName && !text.length) {
                            setdataState((prevName) => {
                              return {
                                ...prevName,
                                title: item.address,
                                hotel_name: item.name,
                                address: item.address,
                                latitude: item.latitude,
                                longitude: item.longitude,
                              };
                            });
                          }
                          setModalHotelName(false);
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
        </SafeAreaView>
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
      <Loading show={loadingApp} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  attachmentTimes: {
    flexDirection: "row",
    paddingRight: 10,
    paddingLeft: 25,
    paddingVertical: 5,
    height: "100%",
    alignItems: "center",
  },
  attachment: {
    flexDirection: "row",
    alignContent: "flex-start",
    alignItems: "flex-start",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d1d1",
  },
});
