import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Dimensions,
  FlatList,
  Pressable,
  ToastAndroid,
  Platform,
  AlertIOS,
  TouchableOpacity,
  Modal,
  TextInput,
  StatusBar,
  ActivityIndicator,
  NativeModules,
  SafeAreaView,
} from "react-native";
import { ReactNativeFile } from "apollo-upload-client";
import {
  Button,
  Text,
  StatusBar as StatBar,
  FunImage,
} from "../../../component";
import {
  Arrowbackwhite,
  Arrowbackios,
  AddParticipant,
  OptionsVertWhite,
  Xgray,
  PensilPutih,
  ArrowRightHome,
  ItineraryIcon,
  Next,
} from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { default_image } from "../../../assets/png";
import { API_DOMAIN } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RenderMemberList from "./RenderMemberList";
import { CHATSERVER, RESTFULL_API } from "../../../config";
import { RNToasty } from "react-native-toasty";
import Menu, { MenuItem, MenuDivider } from "react-native-material-menu";
import ImagePicker from "react-native-image-crop-picker";
import DeletedBuddy from "../../../graphQL/Mutation/Itinerary/Deletedbuddy";
import MakeAdmin from "../../../graphQL/Mutation/Itinerary/MakeAdmin";
import LeftItinerary from "../../../graphQL/Mutation/Itinerary/LeftItinerary";
import RemovAdmin from "../../../graphQL/Mutation/Itinerary/RemoveAdmin";
import Updatecover from "../../../graphQL/Mutation/Itinerary/UpdatecoverV2";
import normalize from "react-native-normalize";
import Animated from "react-native-reanimated";
import DeviceInfo from "react-native-device-info";
import { useSelector } from "react-redux";
import ImageViewer from "react-native-image-zoom-viewer";
import { useMutation } from "@apollo/client";
import FastImage from "react-native-fast-image";

const Notch = DeviceInfo.hasNotch();
// const SafeStatusBar = Platform.select({
//   ios: Notch ? 48 : 20,
//   android: NativeModules.StatusBarManager.HEIGHT,
// });
const deviceId = DeviceInfo.getModel();
const NotchAndro = NativeModules.StatusBarManager.HEIGHT > 24;
let { width, height } = Dimensions.get("screen");

export default function GroupDetail(props) {
  const tokenApps = useSelector((data) => data.token);
  const settingApps = useSelector((data) => data.setting);
  const { t } = useTranslation();
  const [room, setRoom] = useState(props.route.params.room_id);
  const [from, setfrom] = useState(props.route.params.from);
  const [dataDetail, setDatadetail] = useState();
  const [textName, setTextName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalkick, setModalkick] = useState(false);
  const [modalleft, setModalleft] = useState(false);
  const [modalmakeadmin, setModalmakeadmin] = useState(false);
  const [modalremoveadmin, setModalremoveadmin] = useState(false);
  const [modalrename, setModalrename] = useState(false);
  const [modalCover, setmodalCover] = useState(false);
  const [selected, setSelected] = useState(false);
  const [indexActive, setIndexActive] = useState(null);
  const [indexMediaView, setIndexMediaView] = useState(0);
  const [modalimageview, setModalimageview] = useState(false);
  const [mediaArray, setMediaArray] = useState([]);
  const deviceId = DeviceInfo.getModel();
  const [typeGroup, setTypeGroup] = useState(null);
  let _menu = null;

  const HEADER_MAX_HEIGHT = normalize(240);
  const HEADER_MIN_HEIGHT = normalize(50);
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  let [scrollY] = useState(new Animated.Value(0));

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE - 10],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5],
    outputRange: [1, 1],
    extrapolate: "clamp",
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 0],
    extrapolate: "clamp",
  });
  const titleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 1.5, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 0, 1],
    extrapolate: "clamp",
  });

  const backOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const backHeaderOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 5],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  let [mydata, setMydata] = useState();
  let [AdminTrip, setAdminTrip] = useState(true);
  let [seeBuddyNotAdmin, setSeeBuddyNotAdmin] = useState([]);

  const getDetailGroup = async (access_token, data_setting) => {
    setLoading(true);
    let response = await fetch(
      `${API_DOMAIN}/api/room/group/groupdetail?group_id=${room}&from=${from}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
      }
    );
    let dataResponse = await response.json();
    if (dataResponse.status == true) {
      console.log("response", dataResponse);
      await setTypeGroup(dataResponse.grup.type);
      await setDatadetail(dataResponse.grup);
      await setTextName(dataResponse.grup.title);
      var inde = dataResponse.grup.buddy.findIndex(
        (k) => k["user_id"] === data_setting.user.id
      );
      await setMydata(dataResponse.grup.buddy[inde]);

      // check user is admin or not
      let Admin = dataResponse.grup.buddy.filter(
        (x) => x.user_id == mydata?.user_id
      );

      await setAdminTrip(Admin[0]?.isadmin);

      // cek buddy yang sudah confirm true trip
      let FilterBuddy = dataResponse.grup.buddy.filter(
        (i) => i.isconfrim == true
      );
      await setSeeBuddyNotAdmin(FilterBuddy);
      await setLoading(false);
    } else {
      await setLoading(false);
      if (Platform.OS === "android") {
        ToastAndroid.show(dataResponse.message, ToastAndroid.SHORT);
      } else {
        AlertIOS.alert(dataResponse.message);
      }
    }
  };

  console.log("TypeGroup", typeGroup);

  const getUserAndToken = async () => {
    if (settingApps) {
      await getDetailGroup(tokenApps, settingApps);
    }
    initialHistoryMedia();
  };
  // useEffect(() => {
  //   props.navigation.setOptions(headerOptions);
  // }, []);

  useEffect(() => {
    getUserAndToken();
  }, []);

  useEffect(() => {
    getUserAndToken();
  }, [AdminTrip]);

  // useEffect(() => {
  //   const unsubscribe = props.navigation.addListener("focus", () => {
  //     getUserAndToken();
  //   });
  //   return unsubscribe;
  // }, []);

  const [layout, setLayout] = useState();
  const goToItinerary = (data) => {
    props.navigation.push("ItineraryStack", {
      screen: "itindetail",
      params: {
        itintitle: data.title,
        country: data.id,
        dateitin: "",
        token: tokenApps,
        status: "",
        index: 0,
        datadayaktif: null,
      },
    });
  };

  const _changecoverCamera = async () => {
    ImagePicker.openCamera({
      width: 500,
      height: 500,
      cropping: true,
      cropperCircleOverlay: true,
      includeBase64: false,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
    })
      .then(async (image) => {
        setmodalCover(false);
        if (from == "itinerary") {
          _uploadCoverItinerary(image);
        } else {
          _uploadCover(image);
        }
      })
      .catch((e) => {
        RNToasty.Normal({
          title: "Cancelled",
          position: "bottom",
        });
      });
  };

  function compare(a, b) {
    if (a.time > b.time) {
      return -1;
    }
    if (a.time < b.time) {
      return 1;
    }
    return 0;
  }
  const [media, setMedia] = useState(null);
  const initialHistoryMedia = async () => {
    let history = await AsyncStorage.getItem(
      "history_" + props.route.params.room_id
    );
    let init_local = await JSON.parse(history);
    let filteredList = [];
    if (init_local) {
      filteredList = [...new Set(init_local.map(JSON.stringify))].map(
        JSON.parse
      );
      filteredList.sort(compare);
      let filter = filteredList.filter(function(x) {
        return x.type == "att_image";
      });
      setMedia(filter);
      let arrayimg = [];
      for (const val of filter) {
        arrayimg.push({ url: val.text });
      }
      setMediaArray(arrayimg);
    }
  };

  const _changecoverGalery = async () => {
    try {
      ImagePicker.openPicker({
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: true,
        includeBase64: false,
        compressImageMaxWidth: 500,
        compressImageMaxHeight: 500,
      })
        .then((image) => {
          setmodalCover(false);
          if (from == "itinerary") {
            _uploadCoverItinerary(image);
          } else {
            _uploadCover(image);
          }
        })
        .catch((e) => {
          RNToasty.Normal({
            title: "Cancelled",
            position: "bottom",
          });
        });
    } catch (error) {
      setmodalCover(false);
      RNToasty.Normal({
        title: { error },
        position: "bottom",
      });
    }
  };

  const _uploadCover = async (image) => {
    try {
      let formData = new FormData();
      formData.append("group_id", props.route.params.room_id);
      formData.append("picture", {
        name: "cover.jpg",
        type: image.mime,
        uri:
          Platform.OS === "android"
            ? image.path
            : image.path.replace("file://", ""),
      });
      let response = await fetch(`${RESTFULL_API}room/group/change_cover`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
      let responseJson = await response.json();

      if (responseJson.status == true) {
        getUserAndToken();
        RNToasty.Show({
          duration: 1,
          title: "Success change cover",
          position: "bottom",
        });
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      // setloading(false);
      RNToasty.Show({
        duration: 1,
        title: "error : something wrong!",
        position: "bottom",
      });
    }
  };

  const _kickMember = async (user_id) => {
    setIndexActive(null);
    let data_kirim = JSON.stringify({
      group_id: dataDetail.id,
      user_id: user_id,
    });
    try {
      let response = await fetch(
        `${RESTFULL_API}room/group/kick_member_group`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: tokenApps,
            "Content-Type": "application/json",
          },
          body: data_kirim,
        }
      );
      let responseJson = await response.json();
      if (responseJson.status == true) {
        getUserAndToken();
        RNToasty.Show({
          duration: 1,
          title: "Success Remove Admin",
          position: "bottom",
        });
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      // setloading(false);
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
    }
  };

  const _leftGroup = async (group_id) => {
    setIndexActive(null);
    let data_kirim = JSON.stringify({
      group_id: group_id,
    });
    try {
      let response = await fetch(`${RESTFULL_API}room/group/left_group`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
        body: data_kirim,
      });
      let responseJson = await response.json();
      if (responseJson.status == true) {
        props.navigation.navigate("BottomStack", {
          screen: "ChatBottomScreen",
          params: {
            screen: "FeedScreen",
            params: {
              page: 1,
            },
          },
        });
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      // setloading(false);
      console.log("error", error);
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
    }
  };

  const _makeAdmin = async (user_id) => {
    setIndexActive(null);
    let data_kirim = JSON.stringify({
      group_id: dataDetail.id,
      user_id: user_id,
    });
    try {
      let response = await fetch(`${RESTFULL_API}room/group/add_admin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
        body: data_kirim,
      });
      let responseJson = await response.json();
      if (responseJson.status == true) {
        RNToasty.Show({
          duration: 1,
          title: "Success Set admin",
          position: "bottom",
        });
        getUserAndToken();
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
      // setloading(false);
    }
  };
  const _removeAdmin = async (user_id) => {
    setIndexActive(null);
    let data_kirim = JSON.stringify({
      group_id: dataDetail.id,
      user_id: user_id,
    });
    try {
      let response = await fetch(`${RESTFULL_API}room/group/remove_admin`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
        body: data_kirim,
      });
      let responseJson = await response.json();
      if (responseJson.status == true) {
        getUserAndToken();
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
      // setloading(false);
    }
  };

  const _renameGroup = async (text) => {
    setIndexActive(null);
    let data_kirim = JSON.stringify({
      group_id: dataDetail.id,
      title: text,
    });
    try {
      let response = await fetch(`${RESTFULL_API}room/group/rename_group`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
        body: data_kirim,
      });
      let responseJson = await response.json();
      if (responseJson.status == true) {
        RNToasty.Show({
          duration: 1,
          title: "Success rename group",
          position: "bottom",
        });
        getUserAndToken();
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
      // setloading(false);
    }
  };

  const [
    mutationDeleteBuddy,
    { loading: loadingDeleted, data: dataDeleted, error: errorDeleted },
  ] = useMutation(DeletedBuddy, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });
  const DeleteBuddy = async (idbuddy, iditinerary) => {
    setIndexActive(null);
    try {
      let response = await mutationDeleteBuddy({
        variables: {
          itinerary_id: iditinerary,
          buddy_id: idbuddy,
        },
      });
      // if (loadingDeleted) {
      //     Alert.alert("Loading!!");
      // }
      if (errorDeleted) {
        throw new Error("Error Deleted");
      }
      if (response.data) {
        if (response.data.delete_buddy.code !== 200) {
          throw new Error(response.data.delete_buddy.message);
        }
        getUserAndToken();
        RNToasty.Show({
          duration: 1,
          title: "Success remove member",
          position: "bottom",
        });
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
    }
  };

  const [
    mutationMakeAdmin,
    { loading: loadingAdmin, data: dataAdmin, error: errorAdmin },
  ] = useMutation(MakeAdmin, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const SetAdminItinerary = async (idbuddy, iditinerary) => {
    setIndexActive(null);
    try {
      let response = await mutationMakeAdmin({
        variables: {
          itinerary_id: iditinerary,
          buddy_id: idbuddy,
        },
      });
      // if (loadingAdmin) {
      //     Alert.alert("Loading!!");
      // }
      if (errorAdmin) {
        throw new Error("Error Deleted");
      }
      if (response.data) {
        if (response.data.make_admin.code !== 200) {
          throw new Error(response.data.make_admin.message);
        }
        getUserAndToken();
        RNToasty.Show({
          duration: 1,
          title: "Success Set Admin",
          position: "bottom",
        });
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
    }
  };

  const [
    mutationRemoveAdmin,
    { loading: loadingRemove, data: dataRemove, error: errorRemove },
  ] = useMutation(RemovAdmin, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const RemoveAdminItinerary = async (idbuddy, iditinerary) => {
    setIndexActive(null);
    try {
      let response = await mutationRemoveAdmin({
        variables: {
          itinerary_id: iditinerary,
          buddy_id: idbuddy,
        },
      });

      if (response.data) {
        if (response.data.remove_admin.code !== 200) {
          throw new Error(response.data.remove_admin.message);
        }
        getUserAndToken();
        RNToasty.Show({
          duration: 1,
          title: "Success remove admin",
          position: "bottom",
        });
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
    }
  };

  const [
    mutationLeftItinerary,
    { loading: loadingLeft, data: dataLeft, error: errorLeft },
  ] = useMutation(LeftItinerary, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });

  const _leftItinerary = async (iditinerary) => {
    setIndexActive(null);
    try {
      let response = await mutationLeftItinerary({
        variables: {
          itinerary_id: iditinerary,
        },
      });
      if (errorLeft) {
        throw new Error("Error Deleted");
      }
      if (response.data) {
        if (response.data.left_itinerary_buddy.code !== 200) {
          throw new Error(response.data.left_itinerary_buddy.message);
        }
        props.navigation.navigate("BottomStack", {
          screen: "ChatBottomScreen",
          params: {
            screen: "FeedScreen",
            params: {
              page: 1,
            },
          },
        });
        RNToasty.Show({
          duration: 1,
          title: "Success Left Group",
          position: "bottom",
        });
      }
    } catch (error) {
      console.log("errorItinerary", error);
      RNToasty.Show({
        duration: 1,
        title: "error : someting wrong!",
        position: "bottom",
      });
    }
  };

  const [
    mutationUploadCover,
    { loading: loadingupload, data: dataupload, error: errorupload },
  ] = useMutation(Updatecover, {
    context: {
      headers: {
        // "Content-Type": "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: tokenApps,
      },
    },
  });

  const _uploadCoverItinerary = async (data) => {
    if (data) {
      let files = new ReactNativeFile({
        uri: data.path,
        type: data.mime,
        name: "cover.jpeg",
      });

      try {
        let response = await mutationUploadCover({
          variables: {
            itinerary_id: room,
            file: files,
          },
        });
        if (errorupload) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (response.data.upload_cover_itinerary_v2.code !== 200) {
            throw new Error(response.data.upload_cover_itinerary_v2.message);
          }
          getUserAndToken();
          RNToasty.Show({
            duration: 1,
            title: "Success change cover",
            position: "bottom",
          });
        }
        // setloading(false);
      } catch (error) {
        RNToasty.Show({
          duration: 1,
          title: "error : someting wrong!",
          position: "bottom",
        });
      }
    }
  };

  console.log("seeBudyy", seeBuddyNotAdmin);
  return (
    <>
      <StatBar backgroundColor="#14646E" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: true }
          )}
          contentContainerStyle={{
            paddingTop: HEADER_MAX_HEIGHT,
            // Platform.OS === "ios" ? HEADER_MAX_HEIGHT : HEADER_MAX_HEIGHT - 10,
            backgroundColor: "#FFF",
            // paddingBottom: 20,
          }}
        >
          <View
            onLayout={(event) => {
              setLayout(event.nativeEvent.layout);
            }}
          >
            <View
              style={{
                width: width,
                padding: 15,
                flexDirection: "row",
                backgroundColor: "#fff",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text
                size="title"
                type="bold"
                numberOfLines={2}
                style={{
                  color: "#000",

                  flex: 1,
                  paddingRight: 10,
                }}
              >
                {dataDetail ? dataDetail.title : null}
              </Text>
              {dataDetail && dataDetail.type == "itinerary" ? (
                <Pressable
                  onPress={() => goToItinerary(dataDetail)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ItineraryIcon
                    style={{ marginRight: 5 }}
                    height={20}
                    width={20}
                  />
                  <Text type="bold" size="label" style={{ color: "#209fae" }}>
                    {t("viewTrip")}
                  </Text>
                  <ArrowRightHome
                    width={12}
                    height={12}
                    style={{
                      marginTop: 5,
                      marginLeft: 5,
                    }}
                  />
                </Pressable>
              ) : null}
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#f6f6f6",
              height: 10,
            }}
          />
          {/* <View
          style={{
            backgroundColor: "#f6f6f6",
            height: 5,
          }}
        /> */}

          <View
            style={{
              backgroundColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                padding: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text size="label" type="bold" style={{}}>
                {t("media")}
              </Text>

              <Pressable
                onPress={() => {
                  setIndexMediaView(0);
                  setModalimageview(true);
                }}
                disabled={media?.length ? false : true}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text type="bold" style={{ marginRight: 5 }}>
                  {media?.length ?? 0}
                </Text>
                {media?.length ? <Next width={12} height={12} /> : null}
              </Pressable>
            </View>
            {media && media?.length ? (
              <FlatList
                data={media}
                contentContainerStyle={{
                  padding: 15,
                  paddingTop: 0,
                }}
                horizontal={true}
                renderItem={({ item, index }) => {
                  if (index <= 4) {
                    return (
                      <Pressable
                        style={
                          {
                            // borderWidth: 1,
                          }
                        }
                        onPress={() => {
                          setIndexMediaView(index);
                          setModalimageview(true);
                        }}
                      >
                        {/* <FunImage
                        source={{ uri: item.text }}
                        style={{
                          width: (width - 30) / 5 - 3,
                          height: (width - 30) / 5 - 3,
                          marginRight: 3,
                        }}
                      /> */}
                        <FastImage
                          source={{
                            uri: item.text,
                            priority: FastImage.priority.normal,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          style={{
                            width: (width - 30) / 5 - 3,
                            height: (width - 30) / 5 - 3,
                            marginRight: 3,
                          }}
                        />
                      </Pressable>
                    );
                  }
                }}
              />
            ) : null}
          </View>
          <View
            style={{
              backgroundColor: "#f6f6f6",
              height: 10,
            }}
          />
          <View
            style={{
              backgroundColor: "#FFFFFF",
            }}
          >
            <View
              style={{
                paddingHorizontal: 15,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingBottom: 10,
                paddingTop: 13,
                // borderWidth: 1,
              }}
            >
              <Text size="label" type="bold" style={{}}>
                {t("participants")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text type="bold">
                  {/* {typeGroup === "itinerary" && AdminTrip == true
                    ? dataDetail?.buddy.length
                    : typeGroup == "itinerary" && AdminTrip == false
                    ? seeBuddyNotAdmin?.length
                    : dataDetail?.buddy.length}{" "} */}
                  {`${dataDetail?.buddy.length} ${t("participants")}`}
                </Text>
              </View>
            </View>
            {mydata ? (
              <FlatList
                data={
                  typeGroup == "itinerary" && AdminTrip == true
                    ? dataDetail?.buddy
                    : typeGroup == "itinerary" && AdminTrip == false
                    ? seeBuddyNotAdmin
                    : dataDetail?.buddy
                }
                scrollEnabled={false}
                contentContainerStyle={{
                  backgroundColor: "#FFFFFF",
                  paddingBottom: 190,
                }}
                ListHeaderComponent={() =>
                  mydata && mydata.isadmin == true ? (
                    <Pressable
                      onPress={() => {
                        dataDetail && dataDetail.type !== "itinerary"
                          ? props.navigation.navigate("ChatStack", {
                              screen: "AddMember",
                              params: {
                                dataBuddy: dataDetail.buddy,
                                token: tokenApps,
                                id_group: dataDetail.id,
                              },
                            })
                          : props.navigation.navigate("ChatStack", {
                              screen: "AddBuddy",
                              params: {
                                dataBuddy: dataDetail.buddy,
                                token: tokenApps,
                                iditin: dataDetail.id,
                              },
                            });
                      }}
                      style={{
                        flexDirection: "row",
                        paddingVertical: 10,
                        borderBottomColor: "#EEEEEE",
                        backgroundColor: "#FFFFFF",
                        borderBottomWidth: 1,
                        paddingHorizontal: 15,
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          source={{ uri: default_image }}
                          style={{
                            backgroundColor: "#DAF0F2",
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <AddParticipant width={25} height={25} />
                        </View>
                        <View>
                          <Text
                            size="label"
                            type="regular"
                            style={{ marginLeft: 15 }}
                          >
                            {t("addParticipant")}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ) : null
                }
                renderItem={({ item, index }) => (
                  <RenderMemberList
                    item={item}
                    index={index}
                    mydata={mydata}
                    props={props}
                    dataDetail={dataDetail}
                    getUserAndToken={() => getUserAndToken()}
                    token={tokenApps}
                    setModalkick={(e) => setModalkick(e)}
                    setModalmakeadmin={(e) => setModalmakeadmin(e)}
                    setSelected={(e) => setSelected(e)}
                    setIndexActive={(e) => setIndexActive(e)}
                    setModalremoveadmin={(e) => setModalremoveadmin(e)}
                    indexActive={indexActive}
                  />
                )}
                keyExtractor={(item) => item.id}
              />
            ) : null}
          </View>

          {/* modal kick */}
          <Modal
            useNativeDriver={true}
            visible={modalkick}
            onRequestClose={() => setModalkick(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalkick(false)}
              style={{
                width: width,
                height: height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: height / 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {`${t("delete")} ${t("member")}`}
                </Text>
                <Pressable
                  onPress={() => setModalkick(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
                <Text
                  style={{ alignSelf: "center", textAlign: "center" }}
                  size="label"
                  type="regular"
                >
                  {t("alertHapusMember")}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                  marginBottom: 10,
                }}
              >
                <Button
                  onPress={() => {
                    if (from == "itinerary") {
                      DeleteBuddy(selected.id, room);
                    } else {
                      _kickMember(selected.user_id);
                    }
                    setModalkick(false);
                  }}
                  color="secondary"
                  text={t("delete")}
                ></Button>
                <Button
                  onPress={() => {
                    setModalkick(false);
                  }}
                  variant="transparent"
                  text={t("cancel")}
                  style={{ marginTop: 5 }}
                ></Button>
              </View>
            </View>
          </Modal>

          {/* modal make admin */}
          <Modal
            useNativeDriver={true}
            visible={modalmakeadmin}
            onRequestClose={() => setModalmakeadmin(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalmakeadmin(false)}
              style={{
                width: width,
                height: height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: height / 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {t("makeAdmin")}
                </Text>
                <Pressable
                  onPress={() => setModalmakeadmin(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
                <Text
                  style={{ alignSelf: "center", textAlign: "center" }}
                  size="label"
                  type="regular"
                >
                  {t("alertMakeAdmin")}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <Button
                  onPress={() => {
                    if (from == "itinerary") {
                      SetAdminItinerary(selected.id, room);
                    } else {
                      _makeAdmin(selected.user_id);
                    }
                    setModalmakeadmin(false);
                  }}
                  color="primary"
                  text={t("makeAdmin")}
                ></Button>
                <Button
                  onPress={() => {
                    setModalmakeadmin(false);
                  }}
                  // color="secondary"
                  variant="transparent"
                  text={t("cancel")}
                  style={{ marginTop: 5, marginBottom: 15 }}
                ></Button>
              </View>
            </View>
          </Modal>

          {/* modal remove_admin */}
          <Modal
            useNativeDriver={true}
            visible={modalremoveadmin}
            onRequestClose={() => setModalremoveadmin(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalremoveadmin(false)}
              style={{
                width: width,
                height: height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: height / 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {t("removeAdmin")}
                </Text>
                <Pressable
                  onPress={() => setModalremoveadmin(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
                <Text
                  style={{ alignSelf: "center", textAlign: "center" }}
                  size="label"
                  type="regular"
                >
                  {t("alertRemoveAdmin")}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <Button
                  onPress={() => {
                    if (from == "itinerary") {
                      RemoveAdminItinerary(selected.id, room);
                    } else {
                      _removeAdmin(selected.user_id);
                    }
                    setModalremoveadmin(false);
                  }}
                  color="secondary"
                  text={t("removeAdmin")}
                ></Button>
                <Button
                  onPress={() => {
                    setModalremoveadmin(false);
                  }}
                  // color="secondary"
                  variant="transparent"
                  text={t("cancel")}
                  style={{ marginTop: 5, marginBottom: 15 }}
                ></Button>
              </View>
            </View>
          </Modal>

          {/* modal rename */}
          <Modal
            useNativeDriver={true}
            visible={modalrename}
            onRequestClose={() => setModalrename(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalrename(false)}
              style={{
                width: width,
                height: height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: height / 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {t("newGroupName")}
                </Text>
                <Pressable
                  onPress={() => setModalrename(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View
                style={{
                  // borderColor: "#D1D1D1",
                  width: width - 140,
                  marginVertical: 20,
                  alignSelf: "center",
                  borderRadius: 5,
                  backgroundColor: "#f6f6f6",
                }}
              >
                <TextInput
                  value={textName}
                  placeholder="Group name"
                  placeholderTextColor="#6C6C6C"
                  onChangeText={(text) => setTextName(text)}
                  maxLength={25}
                  style={
                    Platform.OS == "ios"
                      ? { maxHeight: 100, margin: 10 }
                      : {
                          maxHeight: 100,
                          marginVertical: 5,
                          marginHorizontal: 10,
                          padding: 0,
                        }
                  }
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  paddingHorizontal: 15,
                  marginBottom: 20,
                }}
              >
                <Button
                  onPress={() => {
                    setModalrename(false);
                    setTextName(dataDetail?.title);
                  }}
                  size="medium"
                  color="transparant"
                  text={t("cancel")}
                ></Button>
                <Button
                  onPress={() => {
                    _renameGroup(textName);
                    setModalrename(false);
                  }}
                  style={{
                    marginLeft: 10,
                  }}
                  color="primary"
                  text={t("submit")}
                ></Button>
              </View>
            </View>
          </Modal>

          {/* modal change cover */}
          <Modal
            onBackdropPress={() => {
              setmodalCover(false);
            }}
            animationType="fade"
            onRequestClose={() => setmodalCover(false)}
            onDismiss={() => setmodalCover(false)}
            visible={modalCover}
            transparent={true}
          >
            <Pressable
              style={{
                width: width,
                height: height,
                alignSelf: "center",
                backgroundColor: "#000",
                opacity: 0.7,
                position: "absolute",
              }}
              onPress={() => setmodalCover(false)}
            />
            <View
              style={{
                width: width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: height / 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {t("option")}
                </Text>
                <Pressable
                  onPress={() => setmodalCover(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                }}
                onPress={() => _changecoverCamera()}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ marginTop: 15, marginBottom: 18 }}
                >
                  {t("OpenCamera")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                }}
                onPress={() => _changecoverGalery()}
              >
                <Text
                  size="description"
                  type="regular"
                  style={{ marginTop: 15, marginBottom: 18 }}
                >
                  {t("OpenGallery")}
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>

          {/* modal left */}
          <Modal
            useNativeDriver={true}
            visible={modalleft}
            onRequestClose={() => setModalleft(false)}
            transparent={true}
            animationType="fade"
          >
            <Pressable
              onPress={() => setModalleft(false)}
              style={{
                width: width,
                height: height,
                justifyContent: "center",
                opacity: 0.7,
                backgroundColor: "#000",
                position: "absolute",
              }}
            />
            <View
              style={{
                width: width - 100,
                marginHorizontal: 50,
                backgroundColor: "#FFF",
                borderRadius: 5,
                marginTop: height / 3,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  paddingHorizontal: 20,
                  backgroundColor: "#f6f6f6",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  justifyContent: "center",
                }}
              >
                <Text
                  size="title"
                  type="bold"
                  style={{ marginTop: 13, marginBottom: 15 }}
                >
                  {t("leftGroup")}
                </Text>
                <Pressable
                  onPress={() => setModalleft(false)}
                  style={{
                    height: 50,
                    width: 55,
                    position: "absolute",
                    right: 0,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Xgray width={15} height={15} />
                </Pressable>
              </View>
              <View style={{ paddingHorizontal: 20, marginVertical: 20 }}>
                <Text
                  style={{ textAlign: "center", lineHeight: 20 }}
                  size="label"
                  type="regular"
                >
                  {from == "itinerary"
                    ? t("alertLeftGroupItinerary")
                    : t("alertLeftGroup")}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 20,
                }}
              >
                <Button
                  onPress={() => {
                    if (from == "itinerary") {
                      _leftItinerary(room);
                    } else {
                      _leftGroup(room);
                    }
                    setModalleft(false);
                  }}
                  color="secondary"
                  text={t("exitGroup")}
                ></Button>
                <Button
                  onPress={() => {
                    setModalleft(false);
                  }}
                  style={{ marginTop: 5, marginBottom: 10 }}
                  variant="transparent"
                  text={t("cancel")}
                ></Button>
              </View>
            </View>
          </Modal>

          {/* modal view image */}
          <Modal
            visible={modalimageview}
            transparent={true}
            onRequestClose={() => {
              setModalimageview(false);
            }}
          >
            <SafeAreaView style={{ backgroundColor: "#000" }} />
            <ImageViewer
              imageUrls={mediaArray}
              useNativeDriver={true}
              // onSwipeDown={() => {
              //   setModalimageview(false);
              // }}
              index={indexMediaView}
              enablePreload={true}
              // enableSwipeDown={true}
              renderHeader={() => (
                <Pressable
                  onPress={() => {
                    setModalimageview(false);
                  }}
                  style={{ position: "relative" }}
                >
                  {/* <Xwhite width={20} height={20} styles={{ margin: 10 }} /> */}
                  <Text size="h5" styles={{ color: "white" }} type="bold">
                    {" x "}
                  </Text>
                </Pressable>
              )}
            />
          </Modal>
        </Animated.ScrollView>

        {/* Image Background */}
        <Animated.View
          pointerEvents="none"
          style={{
            position: "absolute",
            // top: 0,
            left: 0,
            right: 0,
            backgroundColor: "#14646e",
            overflow: "hidden",
            height: HEADER_MAX_HEIGHT,
            transform: [{ translateY: headerTranslateY }],
            zIndex: 1,
            top: 0,
          }}
        >
          {loading ? (
            <>
              <Animated.Image
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  width: null,
                  height: HEADER_MAX_HEIGHT,
                  resizeMode: "cover",
                  opacity: headerOpacity,
                  // transform: [{ translateY: headerTranslateY }],
                }}
                source={default_image}
              />
              <ActivityIndicator
                animating={true}
                size="large"
                color="#d1d1d1"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                }}
              />
            </>
          ) : (
            <Animated.Image
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                width: null,
                height: HEADER_MAX_HEIGHT,
                resizeMode: "cover",
                opacity: headerOpacity,

                // transform: [{ translateY: headerTranslateY }],
              }}
              source={
                dataDetail && dataDetail.link_picture
                  ? { uri: dataDetail?.link_picture }
                  : default_image
              }
            />
          )}
        </Animated.View>

        {/* Title Header */}

        <Animated.View
          style={{
            backgroundColor: "#14646e",
            height: 50,
            width: Dimensions.get("screen").width,
            position: "absolute",
            zIndex: 999,
            flex: 1,
            top: -50,
          }}
        ></Animated.View>

        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }],
            flex: 1,
            flexDirection: "row",
            position: "absolute",
            justifyContent: "flex-start",
            alignItems: "center",
            // left: 15,
            zIndex: 999,
            // width: "80%",
            opacity: titleOpacity,
            // top: 10,
            // marginTop: 20,
            paddingLeft: 15,
            width: Dimensions.get("screen").width,
            backgroundColor: "#209FAE",
            height: 45,
          }}
        >
          <Pressable
            onPress={() => props.navigation.goBack()}
            style={{
              borderRadius: 40,
              height: 40,
              width: 40,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 20,
            }}
          >
            {Platform.OS == "ios" ? (
              <Arrowbackios height={15} width={15}></Arrowbackios>
            ) : (
              <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            )}
          </Pressable>
          <View
            style={{
              flexDirection: "row",
              width: "80%",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              size="title"
              style={{
                color: "#fff",
                flex: 1,
              }}
              numberOfLines={1}
            >
              {dataDetail ? dataDetail.title : null}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                width: 67,
                height: 30,
                marginRight: 9,
              }}
            >
              {dataDetail && dataDetail.type !== "itinerary" ? (
                <Pressable
                  onPress={() => {
                    setModalrename();
                  }}
                >
                  <PensilPutih width={18} height={18} />
                </Pressable>
              ) : null}
              <Menu
                ref={(ref) => (_menu = ref)}
                button={
                  <Pressable
                    style={{
                      alignSelf: "center",
                      marginLeft: 34,
                    }}
                    onPress={() => _menu.show()}
                  >
                    <OptionsVertWhite height={15} width={15}></OptionsVertWhite>
                  </Pressable>
                }
                style={{
                  width: 200,
                }}
              >
                <MenuItem
                  onPress={() => {
                    _menu.hide(() => {
                      setmodalCover(true);
                    });
                  }}
                >
                  {t("changeCoverGroup")}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onPress={() => {
                    _menu.hide(() => setModalleft(true));
                  }}
                >
                  {t("leftGroup")}
                </MenuItem>
              </Menu>
            </View>
          </View>
        </Animated.View>

        {/* Back Arrow */}

        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }],
            width: width,
            position: "absolute",
            zIndex: 999,
            top: 0,
            opacity: backHeaderOpacity,
          }}
        >
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Pressable
              onPress={() => props.navigation.goBack()}
              style={{
                marginTop: 15,
                marginLeft: 15,
                borderRadius: 40,
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
              }}
            >
              {Platform.OS == "ios" ? (
                <Arrowbackios height={15} width={15}></Arrowbackios>
              ) : (
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
              )}
            </Pressable>
            <View
              style={{
                marginTop: 15,
                marginRight: 15,
                borderRadius: 40,
                height: 40,
                width: 90,
                justifyContent: "flex-end",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              {dataDetail && dataDetail.type !== "itinerary" ? (
                <Pressable
                  onPress={() => {
                    setModalrename();
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 15,
                  }}
                >
                  <PensilPutih width={18} height={18} />
                </Pressable>
              ) : null}

              <Menu
                ref={(ref) => (_menu = ref)}
                button={
                  <Pressable
                    style={{
                      paddingHorizontal: 13,
                      paddingVertical: 13,
                      backgroundColor: "rgba(0, 0, 0, 0.6)",
                      borderRadius: 20,
                    }}
                    onPress={() => _menu.show()}
                  >
                    <OptionsVertWhite height={15} width={15}></OptionsVertWhite>
                  </Pressable>
                }
                style={{
                  width: 200,
                }}
              >
                <MenuItem
                  onPress={() => {
                    _menu.hide(() => {
                      setmodalCover(true);
                    });
                  }}
                >
                  {t("changeCoverGroup")}
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  onPress={() => {
                    _menu.hide(() => setModalleft(true));
                  }}
                >
                  {t("leftGroup")}
                </MenuItem>
              </Menu>
            </View>
          </View>
        </Animated.View>

        {/* {dataDetail && dataDetail.type !== "itinerary" ? (
        <Animated.View
          style={{
            transform: [{ translateY: titleTranslateY }],
            opacity: backHeaderOpacity,
            position: "absolute",
            zIndex: 999,
            top: SafeStatusBar,
            right: 65,
            paddingTop: 12,
            zIndex: 999,
          }}
        >
          <Pressable
            onPress={() => {
              setModalrename();
            }}
            style={{
              width: 40,
              height: 40,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 2,
            }}
          >
            <PensilPutih width={18} height={18} />
          </Pressable>
        </Animated.View>
      ) : null} */}
      </SafeAreaView>
    </>
  );
}
