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
  Stay,
  Xhitam,
} from "../../../assets/svg";
import { default_image } from "../../../assets/png";
import Upload from "../../../graphQL/Mutation/Itinerary/Uploadcustomsingle";
import DeleteAttachcustom from "../../../graphQL/Mutation/Itinerary/DeleteAttachcustom";
import Swipeout from "react-native-swipeout";
import { Button, Text, Loading, FunIcon, Capital } from "../../../component";
import { useTranslation } from "react-i18next";
import MapView, { Marker } from "react-native-maps";
import DocumentPicker from "react-native-document-picker";
import { ReactNativeFile } from "apollo-upload-client";
import { RNToasty } from "react-native-toasty";

import DeviceInfo from "react-native-device-info";

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
        dataparents = { ...i };
      } else if (i.parent_id === parent) {
        dataX.push(i);
      }
    }

    await setDataParent(dataparents);
    await setDataChild(dataX);
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {});
    return unsubscribe;
  }, [props.navigation]);

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

  let [dataState, setdataState] = useState({
    day_id: null,
    title: null,
    icon: null,
    qty: 1,
    address: null,
    latitude: 0,
    longitude: 0,
    note: null,
    time: null,
    duration: null,
    status: false,
    order: [],
    total_price: 0,
    hotel_name: null,
    guest_name: null,
    booking_ref: null,
    checkin: null,
    checkout: null,
    file: null,
  });

  const validation = (name, value) => {
    if (!value || value === "") {
      return false;
    }
  };

  const simpanketimeline = (inputan) => {
    if (!inputan.hotel_name || inputan.hotel_name === "") {
      RNToasty.Show({
        title: t("hotel_name can't be empty"),
        position: "bottom",
      });
    } else if (!inputan.address || inputan.address === "") {
      RNToasty.Show({
        title: t("address can't be empty"),
        position: "bottom",
      });
    } else if (!inputan.guest_name || inputan.guest_name === "") {
      RNToasty.Show({
        title: t("guest_name can't be empty"),
        position: "bottom",
      });
    } else if (!inputan.booking_ref || inputan.booking_ref === "") {
      RNToasty.Show({
        title: t("booking_ref can't be empty"),
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
            <View
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                backgroundColor: "#f3f3f3",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <Stay height={30} width={30} />
            </View>
            <TextInput
              placeholder={"Hotel Name"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
              }}
              value={dataState.hotel_name}
              onChangeText={(e) => {
                setdataState({ ...dataState, ["hotel_name"]: e });
              }}
              onSubmitEditing={(e) => {
                setdataState({ ...dataState, ["hotel_name"]: e });
              }}
            />
          </View>
          <TextInput
            placeholder={"Address"}
            style={{
              flex: 1,
              // padding: 0,
              fontFamily: "Lato-Regular",
              paddingTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
            value={dataState.address}
            onChangeText={(e) => {
              setdataState({ ...dataState, ["address"]: e });
            }}
            onSubmitEditing={(e) => {
              setdataState({ ...dataState, ["address"]: e });
            }}
          />
          <TextInput
            placeholder={"Guest Name"}
            style={{
              flex: 1,
              // padding: 0,
              fontFamily: "Lato-Regular",
              paddingTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
            value={dataState.guest_name}
            onChangeText={(e) => {
              setdataState({ ...dataState, ["guest_name"]: e });
            }}
            onSubmitEditing={(e) => {
              setdataState({ ...dataState, ["guest_name"]: e });
            }}
          />
          <View
            style={{
              paddingTop: 15,
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <CalendarIcon height={15} width={15} />
            <TextInput
              placeholder={"Check in"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
                marginRight: 10,
              }}
              value={dataState.checkin}
            />
            <CalendarIcon height={15} width={15} />
            <TextInput
              placeholder={"Check out"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",
                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
              }}
              value={dataState.checkout}
            />
          </View>

          <TextInput
            placeholder={"Booking Reference"}
            style={{
              flex: 1,
              // padding: 0,
              fontFamily: "Lato-Regular",
              paddingTop: 15,
              borderBottomWidth: 1,
              borderBottomColor: "#d3d3d3",
            }}
            value={dataState.booking_ref}
            onChangeText={(e) => {
              setdataState({ ...dataState, ["booking_ref"]: e });
            }}
            onSubmitEditing={(e) => {
              setdataState({ ...dataState, ["booking_ref"]: e });
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
            style={{
              // borderWidth: 1,
              fontFamily: "Lato-Regular",
              paddingTop: 10,
              flex: 1,
              // padding: 0,
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
          <Text
            size="label"
            type="bold"
            style={{
              paddingTop: 10,
            }}
          >
            {t("Attachment")}
          </Text>

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
            // paddingBottom: 40,
          }}
        >
          <Button
            onPress={() => {
              // Alert.alert("comming soon");
              simpanketimeline(dataState);
            }}
            text={t("save")}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
