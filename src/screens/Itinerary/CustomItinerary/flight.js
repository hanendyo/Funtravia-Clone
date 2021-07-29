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
            <TextInput
              placeholder={"Departure"}
              style={{
                flex: 1,
                // padding: 0,
                fontFamily: "Lato-Regular",

                borderBottomWidth: 1,
                borderBottomColor: "#d3d3d3",
                marginLeft: 10,
                marginRight: 10,
              }}
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
            <TextInput
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
            />
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
