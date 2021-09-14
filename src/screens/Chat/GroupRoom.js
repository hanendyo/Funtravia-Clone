import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Pressable,
  BackHandler,
  Modal as ModalRN,
} from "react-native";
import io from "socket.io-client";
import {
  Arrowbackwhite,
  Send,
  Chat,
  Emoticon,
  CameraChat,
  Xgray,
} from "../../assets/svg";
import { Button, Text, FunImage, StickerModal } from "../../component";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER, API_DOMAIN } from "../../config";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { default_image } from "../../assets/png";
import { Keyboard } from "react-native-ui-lib";
import ImagePicker from "react-native-image-crop-picker";
import ChatTypelayout from "./ChatTypelayout";

export default function Room({ navigation, route }) {
  const Notch = DeviceInfo.hasNotch();
  const { width, height } = Dimensions.get("screen");
  const [modal_camera, setmodalCamera] = useState(false);
  const [room, setRoom] = useState(route.params.room_id);
  const [from, setfrom] = useState(route.params.from);
  const [user, setUser] = useState({});
  const [init, setInit] = useState(true);
  const [button, setButton] = useState(true);
  const [token, setToken] = useState(null);
  const socket = io(CHATSERVER);
  let [chat, setChat] = useState(null);
  let [message, setMessage] = useState([]);
  console.log("message", message);
  let flatListRef = useRef();
  const [keyboardOpenState, SetkeyboardOpenState] = useState(false);
  const refInput = useRef();

  const [dataDetail, setDatadetail] = useState();
  // console.log("dataDetail", dataDetail);
  const KeyboardUtils = Keyboard.KeyboardUtils;

  const { t } = useTranslation();

  const headerOptions = {
    headerShown: true,
    headerTitle: null,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 1,
      borderBottomWidth: 0,
    },
    headerTitleStyle: null,
    headerLeft: () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginVertical: 10,
          // borderWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{
            height: 40,
            width: 40,
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.goBack()}
        >
          <Arrowbackwhite height={20} width={20} />
        </TouchableOpacity>
        <Pressable
          onPress={() => {
            BackHandler.removeEventListener("hardwareBackPress", onBackPress);
            navigation.navigate("ChatStack", {
              screen: "GroupDetail",
              params: {
                room_id: route.params.room_id,
                from: route.params.from,
              },
            });
          }}
          style={{
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#209fae",
            width: Dimensions.get("screen").width - 100,
            height: 45,
            alignItems: "center",
            backgroundColor: "#209fae",
            zIndex: 150,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              BackHandler.removeEventListener("hardwareBackPress", onBackPress);
              navigation.navigate("ChatStack", {
                screen: "GroupDetail",
                params: {
                  room_id: route.params.room_id,
                  from: route.params.from,
                },
              });
            }}
          >
            <FunImage
              size="xs"
              source={
                route.params.picture
                  ? { uri: route.params.picture }
                  : default_image
              }
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </TouchableOpacity>

          <Text
            onPress={() => {
              BackHandler.removeEventListener("hardwareBackPress", onBackPress);
              navigation.navigate("ChatStack", {
                screen: "GroupDetail",
                params: {
                  room_id: route.params.room_id,
                  from: route.params.from,
                },
              });
            }}
            style={{
              fontFamily: "Lato-Bold",
              fontSize: 16,
              color: "white",
              alignSelf: "center",
              paddingHorizontal: 10,
            }}
          >
            {route.params.name}
          </Text>
        </Pressable>
      </View>
    ),
    headerLeftContainerStyle: null,
    headerRight: null,
    headerRightStyle: {
      paddingRight: 20,
    },
  };
  const dismissKeyboard = () => {
    KeyboardUtils.dismiss();
  };

  const getDetailGroup = async (access_token) => {
    let response = await fetch(
      `${API_DOMAIN}/api/room/group/groupdetail?group_id=${route.params.room_id}&from=${route.params.from}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
          "Content-Type": "application/json",
        },
      }
    );
    let dataResponse = await response.json();
    if (dataResponse.status == true) {
      await setDatadetail(dataResponse.grup);
      let update_header = {
        headerLeft: () => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              marginVertical: 10,
              // borderWidth: 1,
            }}
          >
            <TouchableOpacity
              style={{
                height: 40,
                width: 40,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={() => navigation.goBack()}
            >
              <Arrowbackwhite height={20} width={20} />
            </TouchableOpacity>
            <Pressable
              onPress={() => {
                BackHandler.removeEventListener(
                  "hardwareBackPress",
                  onBackPress
                );
                navigation.navigate("ChatStack", {
                  screen: "GroupDetail",
                  params: {
                    room_id: route.params.room_id,
                    from: route.params.from,
                  },
                });
              }}
              style={{
                flexDirection: "row",
                borderWidth: 1,
                borderColor: "#209fae",
                width: Dimensions.get("screen").width - 100,
                height: 45,
                alignItems: "center",
                backgroundColor: "#209fae",
                zIndex: 150,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  BackHandler.removeEventListener(
                    "hardwareBackPress",
                    onBackPress
                  );
                  navigation.navigate("ChatStack", {
                    screen: "GroupDetail",
                    params: {
                      room_id: route.params.room_id,
                      from: route.params.from,
                    },
                  });
                }}
              >
                <FunImage
                  source={
                    dataResponse.grup.link_picture
                      ? {
                          uri: dataResponse.grup.link_picture,
                        }
                      : default_image
                  }
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                  }}
                />
              </TouchableOpacity>

              <Text
                onPress={() => {
                  BackHandler.removeEventListener(
                    "hardwareBackPress",
                    onBackPress
                  );
                  navigation.navigate("ChatStack", {
                    screen: "GroupDetail",
                    params: {
                      room_id: route.params.room_id,
                      from: route.params.from,
                    },
                  });
                }}
                style={{
                  fontFamily: "Lato-Bold",
                  fontSize: 16,
                  color: "white",
                  alignSelf: "center",
                  paddingHorizontal: 10,
                }}
              >
                {dataResponse.grup?.title}
              </Text>
            </Pressable>
          </View>
        ),
      };
      navigation.setOptions(update_header);
    } else {
      console.log("failed get detail group");
    }
  };

  const myStateRef = React.useRef(route.params?.is_itinerary);
  const data_group_picture = useRef("");
  const data_group_name = useRef("");
  const onBackPress = useCallback(() => {
    if (myStateRef.current == true) {
      navigation.goBack();
    } else {
      navigation.popToTop();
    }
    return true;
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      if (init) {
        getUserToken();
        // setConnection();
      }
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [onBackPress]);

  useEffect(() => {
    navigation.setOptions(headerOptions);
    if (init) {
      getUserToken();
    }
    socket.on("new_chat_group", (data) => {
      setChatHistory(data);
    });
    socket.emit("join", room);
    return () => socket.disconnect();
  }, []);

  const setConnection = () => {
    socket.emit("join", room);
  };

  const resetKeyboardView = () => {
    SetkeyboardOpenState(false);
    // SetcustomKeyboard({});
  };

  const getUserToken = async () => {
    let data = await AsyncStorage.getItem("setting");
    setUser(JSON.parse(data).user);
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
      await getDetailGroup(token);
      await setToken(token);
      await initialHistory(token);
    }
  };

  const setChatHistory = async (data) => {
    let history = await AsyncStorage.getItem("history_" + room);
    if (data) {
      if (history) {
        let recent = JSON.parse(history);
        recent.push(data);
        await AsyncStorage.setItem("history_" + room, JSON.stringify(recent));
        setMessage(recent);
      } else {
        await AsyncStorage.setItem("history_" + room, JSON.stringify([data]));
        setMessage([data]);
      }
    }
  };

  const initialHistory = async (access_token) => {
    let response = await fetch(
      `${CHATSERVER}/api/group/history?room_id=${room}&from=${from}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + access_token,
          "Content-Type": "application/json",
        },
      }
    );
    let responseJson = await response.json();
    if (responseJson.data) {
      await AsyncStorage.setItem(
        "history_" + room,
        JSON.stringify(responseJson.data)
      );
      await setMessage(responseJson.data);
      //   await setTimeout(function() {
      //     if (flatListRef !== null && flatListRef.current) {
      //       flatListRef.current.scrollToEnd({ animated: true });
      //     }
      //   }, 250);
    }
  };

  const submitChatMessage = async () => {
    if (button) {
      if (chat && chat.replace(/\s/g, "").length) {
        await setButton(false);
        let chatData = {
          room: room,
          chat: "group",
          type: "text",
          text: chat,
          user_id: user.id,
          name: `${user.first_name} ${user.last_name}`,
        };
        await fetch(`${CHATSERVER}/api/group/send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `user_id=${user.id}&type=text&chat=group&room=${room}&from=${from}&text=${chat}&name=${user.first_name} ${user.last_name}`,
        });
        await socket.emit("message", chatData);
        await setChat("");
        await setTimeout(function() {
          if (flatListRef !== null && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 250);
        await setButton(true);
      } else {
        // toastRef.current?.show(t("messagesEmpty"), {
        //     style: { backgroundColor: "#464646" },
        //     textStyle: { fontSize: 14 },
        // });
        RNToasty.Show({
          title: t("messagesEmpty"),
          position: "bottom",
        });
      }
    }
  };

  const submitSticker = async (x) => {
    if (x && x.replace(/\s/g, "").length) {
      await setButton(false);
      let chatData = {
        room: room,
        chat: "group",
        type: "sticker",
        text: x,
        user_id: user.id,
      };
      await fetch(`${CHATSERVER}/api/group/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `user_id=${user.id}&type=sticker&chat=group&room=${room}&from=${from}&text=${x}&name=${user.first_name} ${user.last_name}`,
      });
      await socket.emit("message", chatData);
      await setChat("");
      await setTimeout(function() {
        if (flatListRef !== null && flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 250);
      await setButton(true);
    } else {
      // toastRef.current?.show(t("messagesEmpty"), {
      //     style: { backgroundColor: "#464646" },
      //     textStyle: { fontSize: 14 },
      // });
      RNToasty.Show({
        title: t("messagesEmpty"),
        position: "bottom",
      });
    }
    // }
  };

  //   let tmpRChat = null;
  //   const RenderChat = ({ item, index }) => {
  //     let timeChat = new Date(item.time).toTimeString();
  //     if (item.user_id !== tmpRChat) {
  //       tmpRChat = item.user_id;
  //       return (
  //         <View style={{ marginTop: 20 }}>
  //           {user.id !== item.user_id ? (
  //             <Text
  //               size="description"
  //               type="bold"
  //               style={{
  //                 paddingBottom: 5,
  //                 paddingLeft: 20,
  //                 color: "#464646",
  //               }}
  //             >
  //               {item.name}
  //             </Text>
  //           ) : null}
  //           <View
  //             key={`chat_${index}`}
  //             style={[
  //               styles.item,
  //               user.id == item.user_id ? styles.itemOut : styles.itemIn,
  //             ]}
  //           >
  //             {user.id == item.user_id ? (
  //               <Text size="small" style={{ marginRight: 5 }}>
  //                 {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
  //               </Text>
  //             ) : null}
  //             <View
  //               style={[
  //                 styles.balloon,
  //                 user.id == item.user_id
  //                   ? {
  //                       backgroundColor: "#DAF0F2",
  //                       borderTopRightRadius: 0,
  //                     }
  //                   : {
  //                       backgroundColor: "#FFFFFF",
  //                       borderTopLeftRadius: 0,
  //                     },
  //               ]}
  //             >
  //               <Text
  //                 size="description"
  //                 style={{
  //                   color: "#464646",
  //                   lineHeight: 18,
  //                 }}
  //               >
  //                 {item.text}
  //               </Text>
  //               <View
  //                 style={[
  //                   styles.arrowContainer,
  //                   user.id == item.user_id
  //                     ? styles.arrowRightContainer
  //                     : styles.arrowLeftContainer,
  //                 ]}
  //               >
  //                 <Svg
  //                   style={
  //                     user.id == item.user_id
  //                       ? styles.arrowRight
  //                       : styles.arrowLeft
  //                   }
  //                   height="50"
  //                   width="50"
  //                 >
  //                   <Polygon
  //                     points={
  //                       user.id == item.user_id
  //                         ? "0,01 15,01 5,12"
  //                         : "20,01 0,01 12,12"
  //                     }
  //                     fill={user.id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
  //                     stroke="#209FAE"
  //                     strokeWidth={0.7}
  //                   />
  //                 </Svg>
  //                 <Svg
  //                   style={[
  //                     { position: "absolute" },
  //                     user.id == item.user_id
  //                       ? { right: moderateScale(-5, 0.5) }
  //                       : { left: moderateScale(-5, 0.5) },
  //                   ]}
  //                   height="50"
  //                   width="50"
  //                 >
  //                   <Polygon
  //                     points={
  //                       user.id == item.user_id
  //                         ? "0,1.3 15,1.1 5,12"
  //                         : "20,01 0,01 12,13"
  //                     }
  //                     fill={user.id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
  //                   />
  //                 </Svg>
  //               </View>
  //             </View>
  //             {user.id !== item.user_id ? (
  //               <Text size="small" style={{ marginLeft: 5 }}>
  //                 {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
  //               </Text>
  //             ) : null}
  //           </View>
  //         </View>
  //       );
  //     } else {
  //       return (
  //         <View>
  //           <View
  //             key={`chat_${index}`}
  //             style={[
  //               styles.item,
  //               user.id == item.user_id ? styles.itemOut : styles.itemIn,
  //             ]}
  //           >
  //             {user.id == item.user_id ? (
  //               <Text size="small" style={{ marginRight: 5 }}>
  //                 {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
  //               </Text>
  //             ) : null}
  //             <View
  //               style={[
  //                 styles.balloon,
  //                 user.id == item.user_id
  //                   ? {
  //                       backgroundColor: "#DAF0F2",
  //                       borderTopRightRadius: 0,
  //                     }
  //                   : {
  //                       backgroundColor: "#FFFFFF",
  //                       borderTopLeftRadius: 0,
  //                     },
  //               ]}
  //             >
  //               <Text
  //                 size="description"
  //                 style={{
  //                   color: "#464646",
  //                   lineHeight: 18,
  //                 }}
  //               >
  //                 {item.text}
  //               </Text>
  //               <View
  //                 style={[
  //                   styles.arrowContainer,
  //                   user.id == item.user_id
  //                     ? styles.arrowRightContainer
  //                     : styles.arrowLeftContainer,
  //                 ]}
  //               ></View>
  //             </View>
  //             {user.id !== item.user_id ? (
  //               <Text size="small" style={{ marginLeft: 5 }}>
  //                 {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
  //               </Text>
  //             ) : null}
  //           </View>
  //         </View>
  //       );
  //     }
  //   };

  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  const pickcamera = async () => {
    let chatData = {};
    ImagePicker.openCamera({
      // width: 500,
      // height: 500,
      cropping: true,
      // cropperCircleOverlay: true,
      // includeBase64: true,
    })
      .then((image) => {
        let id = create_UUID();
        let dateTime = new Date();
        image = JSON.stringify(image);
        let chatData = {
          id: id,
          room: room,
          chat: "gorup",
          type: "att_image",
          text: image,
          user_id: user.id,
          time: dateTime,
          is_send: false,
        };
        setChatHistory(chatData);
        // setTimeout(function() {
        //   _uploadimage(image, id);
        //   if (flatListRef !== null && flatListRef.current) {
        //     flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        //   }
        // }, 1000);
        // setmodalCamera(false);
      })
      .catch((err) => {
        RNToasty.Show({
          title: "",
          position: "bottom",
        });
      });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      // width: 500,
      // height: 500,
      cropping: true,
      // cropperCircleOverlay: true,
      // includeBase64: true,
    })
      .then((image) => {
        let id = create_UUID();
        let dateTime = new Date();
        image = JSON.stringify(image);
        let chatData = {
          id: id,
          room: room,
          chat: "group",
          type: "att_image",
          text: image,
          user_id: user.id,
          time: dateTime,
          is_send: false,
        };
        setChatHistory(chatData);
        setTimeout(function() {
          _uploadimage(image, id);
          if (flatListRef !== null && flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          }
        }, 1000);
        setmodalCamera(false);
      })
      .catch((err) => {
        RNToasty.Show({
          title: "",
          position: "bottom",
        });
      });
  };

  const _uploadimage = async (image, id) => {
    let chatData = {};
    try {
      image = JSON.parse(image);
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, "0");
      var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      var yyyy = today.getFullYear();

      today = dd + "/" + mm + "/" + yyyy;
      var formData = new FormData();
      formData.append("id", id);
      let ext = image.mime.split("/");
      let image_name = "imageChat." + ext[1];
      formData.append("img", {
        name: image_name,
        type: image.mime,
        uri:
          Platform.OS === "android"
            ? image.path
            : image.path.replace("file://", ""),
      });
      let response = await fetch(
        `${RESTFULL_API}room/personal/upload_image_chat`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      let responseJson = await response.json();
      // console.log("responseJson", responseJson);
      if (responseJson.status == true) {
        // getUserAndToken();
        let dateTime = new Date();
        let chatData = {
          id: id,
          room: room,
          chat: "personal",
          type: "att_image",
          text: responseJson.filepath,
          user_id: user.id,
          time: dateTime,
          is_send: true,
        };
        // if (socket.connected) {
        socket.emit("message", chatData);
        // } else {
        //   sendOffline(chatData);
        // }
        RNToasty.Show({
          duration: 1,
          title: "Success upload image",
          position: "bottom",
        });
        setTimeout(function() {
          if (flatListRef !== null && flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
          }
        }, 2000);
      } else {
        //   setloading(false);
        throw new Error(responseJson.message);
      }
    } catch (error) {
      setChatHistory(chatData);
      // RNToasty.Show({
      //   duration: 1,
      //   title: "error : someting wrong!",
      //   position: "bottom",
      // });
      // console.log(error);
    }
  };

  let tmpRChat = true;
  const RenderChat = ({ item, index }) => {
    console.log("index", index);
    const timeState = new Date().toLocaleDateString();
    const timeStateChat = new Date(item.time).toLocaleDateString();
    let timeChat = new Date(item.time).toTimeString();

    let date = null;
    if (index == 0) {
      date = timeStateChat;
    }
    if (
      message[index - 1] &&
      new Date(message[index - 1].time).toLocaleDateString() !== timeStateChat
    ) {
      if (timeStateChat === timeState) {
        date = t("toDay");
      } else {
        date = timeStateChat;
      }
    }

    if (message[index - 1] && message[index - 1].user_id == item.user_id) {
      if (date) {
        tmpRChat = true;
      } else {
        tmpRChat = false;
      }
    } else {
      tmpRChat = true;
    }

    return (
      <View>
        {date ? (
          <View style={{ alignItems: "center", marginVertical: 5 }}>
            <Text
              size="description"
              type="regular"
              style={{
                padding: 5,
                borderRadius: 4,
                backgroundColor: "#F3F3F3",
                color: "#464646",
              }}
            >
              {date}
            </Text>
          </View>
        ) : null}

        <View
          key={`chat_${index}`}
          style={[
            styles.item,
            user.id == item.user_id ? styles.itemOut : styles.itemIn,
          ]}
        >
          {user.id == item.user_id ? (
            <Text size="small" style={{ marginRight: 5 }}>
              {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
            </Text>
          ) : null}
          <ChatTypelayout
            item={item}
            user_id={user.id}
            tmpRChat={tmpRChat}
            navigation={navigation}
            dataMember={dataDetail}
            index={index}
            datas={message}
          />
          {user.id !== item.user_id ? (
            <Text size="small" style={{ marginLeft: 5 }}>
              {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14646E" barStyle="light-content" />
      <ModalRN
        onBackdropPress={() => {
          setmodalCamera(false);
        }}
        animationType="fade"
        onRequestClose={() => setmodalCamera(false)}
        onDismiss={() => setmodalCamera(false)}
        visible={modal_camera}
        transparent={true}
      >
        <Pressable
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            alignSelf: "center",
            backgroundColor: "#000",
            opacity: 0.7,
            position: "absolute",
          }}
          onPress={() => setmodalCamera(false)}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            marginHorizontal: 50,
            backgroundColor: "#FFF",
            borderRadius: 5,
            marginTop: Dimensions.get("screen").height / 3,
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
              onPress={() => setmodalCamera(false)}
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
            onPress={() => pickcamera()}
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
            onPress={() => pickGallery()}
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
      </ModalRN>
      <View
        style={{
          flex: 1,
          height: height - 100,
          // borderWidth: 1,
          backgroundColor: "#FFFFFF",
          margin: 13,
          borderRadius: 10,
          padding: 5,
        }}
      >
        <FlatList
          ref={flatListRef}
          data={message}
          renderItem={RenderChat}
          keyExtractor={(item, index) => `render_${index}`}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 5,
            // flex: 1,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            // borderWidth: 1,
          }}
          onContentSizeChange={() => {
            if (flatListRef !== null && flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
        />
      </View>
      {keyboardOpenState ? (
        <>
          <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Notch ? 90 : 65}
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              alignContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              marginHorizontal: 13,
              marginBottom: 13,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
            }}
          >
            {!keyboardOpenState ? (
              <Button
                text=""
                type="circle"
                size="medium"
                variant="transparent"
                style={{ width: 35, height: 35 }}
                // onPress={() => Alert.alert("Sticker Cooming Soon")}
                // onPress={() => modals()}
                // onPress={() => {
                //     navigation.navigate("ChatStack", {
                //         screen: "KeyboardInput",
                //     });
                // }}
                onPress={() =>
                  // showKeyboardView("unicorn.StikerKeyboard")
                  {
                    dismissKeyboard();
                    SetkeyboardOpenState(true);
                  }
                }
                style={{
                  marginRight: 5,
                }}
              >
                <Emoticon height={35} width={35} />
              </Button>
            ) : (
              <Button
                text=""
                type="circle"
                size="medium"
                variant="normal"
                style={{ width: 35, height: 35 }}
                // onPress={() => Alert.alert("Sticker Cooming Soon")}
                // onPress={() => modals()}
                // onPress={() => setStickerModal(!_stickerModal)}
                onPress={() => {
                  // resetKeyboardView();
                  SetkeyboardOpenState(false);
                  refInput.current.focus();
                  // KeyboardUtils.onFocus();
                }}
                style={{
                  marginRight: 5,
                }}
              >
                <Chat height={13} width={13} />
              </Button>
            )}
            <View
              style={{
                borderColor: "#D1D1D1",
                borderWidth: 1,
                width: width - 130,
                maxHeight: 70,
                alignSelf: "center",
                backgroundColor: "#f3f3f3",
                borderRadius: 20,
                paddingHorizontal: 15,
              }}
            >
              <TextInput
                value={chat}
                multiline
                ref={refInput}
                placeholder="Type a message"
                onChangeText={(text) => setChat(text)}
                onFocus={() => resetKeyboardView()}
                style={
                  Platform.OS == "ios"
                    ? {
                        maxHeight: 70,
                        margin: 10,
                        paddingBottom: 5,
                        paddingLeft: 15,
                        fontFamily: "Lato-Regular",
                        backgroundColor: "#f3f3f3",
                      }
                    : {
                        maxHeight: 70,
                        marginVertical: 5,
                        marginHorizontal: 10,
                        padding: 0,
                        fontFamily: "Lato-Regular",
                        backgroundColor: "#f3f3f3",
                      }
                }
              />
            </View>
            <Button
              text=""
              type="circle"
              size="medium"
              variant="transparent"
              onPress={() => submitChatMessage()}
              style={{ width: 50, height: 50 }}
            >
              <Send height={40} width={40} />
            </Button>
          </KeyboardAvoidingView>

          <StickerModal submitSticker={(e) => submitSticker(e)} />
        </>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Notch ? 90 : 65}
          style={{
            flexDirection: "row",
            paddingHorizontal: 5,
            alignContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            marginHorizontal: 13,
            marginBottom: 13,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
          }}
        >
          {!keyboardOpenState ? (
            <Button
              text=""
              type="circle"
              size="medium"
              variant="transparent"
              style={{ width: 35, height: 35 }}
              // onPress={() => Alert.alert("Sticker Cooming Soon")}
              // onPress={() => modals()}
              // onPress={() => {
              //     navigation.navigate("ChatStack", {
              //         screen: "KeyboardInput",
              //     });
              // }}
              onPress={() =>
                // showKeyboardView("unicorn.StikerKeyboard")
                {
                  dismissKeyboard();
                  SetkeyboardOpenState(true);
                }
              }
              style={{
                marginRight: 5,
              }}
            >
              <Emoticon height={35} width={35} />
            </Button>
          ) : (
            <Button
              text=""
              type="circle"
              size="medium"
              variant="normal"
              style={{ width: 35, height: 35 }}
              // onPress={() => Alert.alert("Sticker Cooming Soon")}
              // onPress={() => modals()}
              // onPress={() => setStickerModal(!_stickerModal)}
              onPress={() => {
                // resetKeyboardView();
                SetkeyboardOpenState(false);
                refInput.current.focus();
                // KeyboardUtils.onFocus();
              }}
              style={{
                marginRight: 5,
              }}
            >
              <Chat height={13} width={13} />
            </Button>
          )}
          <View
            style={{
              borderColor: "#D1D1D1",
              borderWidth: 1,
              width: width - 130,
              maxHeight: 70,
              alignSelf: "center",
              backgroundColor: "#f3f3f3",
              borderRadius: 20,
              // paddingHorizontal: 15,
              flexDirection: "row",
            }}
          >
            <TextInput
              value={chat}
              multiline
              ref={refInput}
              placeholder="Type a message"
              onChangeText={(text) => setChat(text)}
              onFocus={() => resetKeyboardView()}
              style={
                Platform.OS == "ios"
                  ? {
                      maxHeight: 100,
                      marginVertical: 10,
                      marginLeft: 10,
                      width: "80%",
                      fontFamily: "Lato-Regular",
                      backgroundColor: "#f3f3f3",
                    }
                  : {
                      maxHeight: 100,
                      marginVertical: 5,
                      marginLeft: 10,
                      padding: 0,
                      width: "80%",
                      fontFamily: "Lato-Regular",
                      backgroundColor: "#f3f3f3",
                    }
              }
            />
            <Pressable
              onPress={() => {
                setmodalCamera(true);
              }}
              style={{
                flex: 1,
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <CameraChat width={25} height={25} />
            </Pressable>
          </View>
          <Button
            text=""
            type="circle"
            size="medium"
            variant="transparent"
            onPress={() => submitChatMessage()}
            style={{ width: 50, height: 50 }}
          >
            <Send height={40} width={40} />
          </Button>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
    justifyContent: "flex-end",
  },
  item: {
    marginVertical: moderateScale(1, 1),
    flexDirection: "row",
    alignItems: "center",
  },
  itemIn: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 8,
    borderColor: "#209FAE",
    borderWidth: 0.7,
  },
  arrowContainer: {
    position: "absolute",
    top: -1,
    zIndex: -1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    left: -5,
  },

  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: -38.5,
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
});
