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
  Keyboard as onKeyboard,
  ActivityIndicator,
} from "react-native";
import io from "socket.io-client";
import {
  Arrowbackwhite,
  Send,
  Chat,
  Emoticon,
  CameraChat,
  Xgray,
  Errorr,
  Arrowbackios,
  Keyboard as IconKeyboard,
} from "../../assets/svg";
import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";
import { Button, Text, FunImage, StickerModal, Uuid } from "../../component";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER, API_DOMAIN, RESTFULL_API } from "../../config";
import { RNToasty } from "react-native-toasty";
import { useTranslation } from "react-i18next";
import DeviceInfo from "react-native-device-info";
import { default_image } from "../../assets/png";
import { Keyboard } from "react-native-ui-lib";
import ImagePicker from "react-native-image-crop-picker";
import ChatTypelayout from "./ChatTypelayout";
import { useSelector } from "react-redux";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";

export default function Room({ navigation, route }) {
  const tokenApps = useSelector((data) => data.token);
  const settingApps = useSelector((data) => data.setting);
  const Notch = DeviceInfo.hasNotch();
  const { width, height } = Dimensions.get("screen");
  const [modal_camera, setmodalCamera] = useState(false);
  const [room, setRoom] = useState(route.params.room_id);
  const [from, setfrom] = useState(route.params.from);
  const [user, setUser] = useState(settingApps.user);
  const [init, setInit] = useState(true);
  const [button, setButton] = useState(true);
  const [loadingGroup, setLoadingGroup] = useState(true);

  let [chat, setChat] = useState(null);
  let [message, setMessage] = useState([]);
  let flatListRef = useRef();
  const [keyboardOpenState, SetkeyboardOpenState] = useState(false);
  const refInput = useRef();

  const [dataDetail, setDatadetail] = useState();
  const KeyboardUtils = Keyboard.KeyboardUtils;
  let dateTime = new Date();

  const { t } = useTranslation();

  // useEffect(() => {
  //   if (message.length == 0) {
  //     setLoadingGroup(false);
  //   }
  // }, []);

  const headerOptions = {
    headerShown: true,
    headerTitle: null,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 1,
      borderBottomWidth: 0,
    },
    // headerTitleStyle: null,
    headerLeft: () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginVertical: 15,
          marginLeft: 10,
          marginBottom: Platform.OS === "ios" ? 20 : 10,
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
          {Platform.OS === "ios" ? (
            <Arrowbackios height={15} width={15} />
          ) : (
            <Arrowbackwhite height={20} width={20} />
          )}
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
            size="h1"
            style={{
              // fontFamily: "Lato-Bold",
              // fontSize: 16,
              color: "white",
              alignSelf: "center",
              paddingHorizontal: 10,
            }}
          >
            {/* {route.params.name} */}
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

  const [socket_connect, setSocketConnect] = useState(false);
  const [connected, SetConnection] = useState(false);
  const connection_check = useNetInfo();
  useEffect(() => {
    const cek_koneksi = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        SetConnection(true);
      } else {
        SetConnection(false);
      }
    });
    cek_koneksi();
  }, [connection_check]);
  const dismissKeyboard = () => {
    KeyboardUtils.dismiss();
  };
  const _sendmsg = async (chatData) => {
    await socket.current.emit("message", chatData);
  };
  const getDetailGroup = async (access_token) => {
    let response = await fetch(
      `${API_DOMAIN}/api/room/group/groupdetail?group_id=${route.params.room_id}&from=${route.params.from}`,
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
              marginLeft: 10,
              marginBottom: Platform.OS === "ios" ? 20 : 10,
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
              {Platform.OS === "ios" ? (
                <Arrowbackios height={15} width={15} />
              ) : (
                <Arrowbackwhite height={20} width={20} />
              )}
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
                size="title"
                style={{
                  color: "white",
                  alignSelf: "center",
                  paddingHorizontal: 10,
                }}
                numberOfLines={2}
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

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [showKeyboardOffset, setShowKeyboardOffset] = useState(false);

  const onKeyboardShow = (event) => {
    if (event) {
      setShowKeyboardOffset(true);
    }
    setKeyboardOffset(event.endCoordinates.height);
  };
  const onKeyboardHide = (event) => {
    if (event) {
      setShowKeyboardOffset(false);
    }
    setKeyboardOffset(0);
  };
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();

  useEffect(() => {
    keyboardDidShowListener.current = onKeyboard.addListener(
      "keyboardWillShow",
      onKeyboardShow
    );
    keyboardDidHideListener.current = onKeyboard.addListener(
      "keyboardWillHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

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
    navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    });
  }, [onBackPress]);

  useEffect(() => {
    navigation.setOptions(headerOptions);
    // if (init) {
    //   getUserToken();
    // }
    // socket.on("new_chat_group", (data) => {
    //   setChatHistory(data);
    // });
    // socket.emit("join", room);
    // return () => socket.disconnect();
  }, []);
  const socket = useRef(null);
  useEffect(() => {
    socket.current = io(CHATSERVER, {
      withCredentials: true,
      extraHeaders: {
        Authorization: tokenApps,
      },
    });
    socket.current.emit("join", room);
    updateReadMassage();
    clearPushNotification();
    socket.current.on("connect", () => {
      setSocketConnect(true);
    });

    socket.current.on("disconnect", () => {
      setSocketConnect(false);
    });
    if (init) {
      getUserToken();
    }
    socket.current.on("new_chat_group", (data) => {
      setChatHistory(data);
    });

    return () => socket.current.disconnect();
  }, [connected, tokenApps]);

  const setConnection = () => {
    socket.emit("join", room);
  };
  const clearPushNotification = () => {
    if (Platform.OS === "ios") {
      PushNotificationIOS.cancelAllLocalNotifications();
    } else {
      PushNotification.cancelAllLocalNotifications();
    }
  };
  const resetKeyboardView = () => {
    SetkeyboardOpenState(false);
    // SetcustomKeyboard({});
  };

  const getUserToken = async () => {
    if (tokenApps) {
      await getDetailGroup(tokenApps);
      await initialHistory(tokenApps);
    }
  };

  // const setChatHistory = async (data) => {
  //   console.log("data hist", data);
  //   let history = await AsyncStorage.getItem("history_" + room);
  //   if (data) {
  //     if (history) {
  //       console.log("ada");
  //       let recent = JSON.parse(history);
  //       recent.push(data);
  //       await AsyncStorage.setItem("history_" + room, JSON.stringify(recent));
  //       setMessage(recent);
  //     } else {
  //       console.log("tidak ada");
  //       await AsyncStorage.setItem("history_" + room, JSON.stringify([data]));
  //       setMessage([data]);
  //     }
  //   }
  // };

  const setChatHistory = async (data) => {
    let history = await AsyncStorage.getItem("history_" + room);
    let recent = JSON.parse(history);
    if (recent) {
      let findInd = recent.findIndex((x) => x.id === data.id);
      if (findInd >= 0) {
        recent = recent.filter(function(obj) {
          return obj.id !== data.id;
        });
        recent.splice(findInd, 0, data);
      } else {
        recent.unshift(data);
      }
      setMessage(recent);
      await AsyncStorage.setItem("history_" + room, JSON.stringify(recent));
      await setLoadingGroup(false);
    } else {
      await AsyncStorage.setItem("history_" + room, JSON.stringify([data]));
      setMessage([data]);
      await setLoadingGroup(false);
    }
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

  const updateReadMassage = async () => {
    let dateTime = new Date();
    let chatData = {
      room: room,
      chat: "clear_new_massage_personal",
      user_id: user.id,
      time: dateTime,
    };

    await socket.current.emit("message", chatData);
  };

  const initialHistory = async (access_token) => {
    let response = await fetch(
      `${CHATSERVER}/api/group/history?room_id=${room}&from=${from}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
      }
    );
    let responseJson = await response.json();
    if (responseJson.data == null) {
      setLoadingGroup(false);
    }
    let history = await AsyncStorage.getItem("history_" + room);
    let init_local = await JSON.parse(history);
    let init_data = await responseJson.data;
    let filteredList = [];
    if (init_local && init_data) {
      let merge = [...init_local, ...init_data];
      filteredList = [...new Set(merge.map(JSON.stringify))].map(JSON.parse);
      filteredList.sort(compare);
    } else if (!init_local) {
      filteredList = init_data;
    } else if (!init_data) {
      filteredList = init_local;
    }
    if (filteredList && filteredList.length > 0) {
      await AsyncStorage.setItem(
        "history_" + room,
        JSON.stringify(filteredList)
      );
      let new_array = [];

      setMessage(filteredList);
      setLoadingGroup(false);
    }
  };

  const submitChatMessage = async () => {
    let uuid = Uuid();
    if (button) {
      if (chat && chat.replace(/\s/g, "").length) {
        await setButton(false);
        let chatData = {
          id: uuid,
          room: room,
          chat: "group",
          from: from,
          type: "text",
          text: chat,
          user_id: user.id,
          name: `${user.first_name} ${user.last_name ? user.last_name : ""}`,
          time: dateTime,
        };
        if (connected) {
          await socket.current.emit("message", chatData);
        } else {
          sendOffline(chatData);
        }
        await setChat("");
        await setTimeout(function() {
          if (flatListRef !== null && flatListRef.current) {
            flatListRef.current.scrollToOffset({ animated: true });
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
        from: from,
        user_id: user.id,
        name: `${user.first_name} ${user.last_name ? user.last_name : ""}`,
        time: dateTime,
      };
      // await fetch(`${CHATSERVER}/api/group/send`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: token?`Bearer ${token}`:null,
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body: `user_id=${user.id}&type=sticker&chat=group&room=${room}&from=${from}&text=${x}&name=${user.first_name} ${user.last_name}`,
      // });
      await socket.current.emit("message", chatData);
      await setChat("");
      await setTimeout(function() {
        if (flatListRef !== null && flatListRef.current) {
          flatListRef.current.scrollToOffset({ animated: true });
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

  const pickcamera = async () => {
    ImagePicker.openCamera({
      // width: 500,
      // height: 500,
      cropping: true,
      // cropperCircleOverlay: true,
      // includeBase64: true,
      mediaType: "photo",
    }).then((image) => {
      let id = Uuid();
      let dateTime = new Date();
      image = JSON.stringify(image);
      let chatData = {
        id: id,
        room: room,
        chat: "personal",
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
    });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      // width: 500,
      // height: 500,
      cropping: true,
      // cropperCircleOverlay: true,
      // includeBase64: true,
      mediaType: "photo",
    })
      .then((image) => {
        let id = Uuid();
        let dateTime = new Date();
        image = JSON.stringify(image);
        let chatData = {
          id: id,
          room: room,
          chat: "grup",
          type: "att_image",
          text: image,
          user_id: user.id,
          time: dateTime,
          is_send: false,
          name: `${user.first_name} ${user.last_name ? user.last_name : ""}`,
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
        console.log(err);
      });
  };
  const _uploadimage = async (image, id) => {
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
            Authorization: tokenApps,
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );
      let responseJson = await response.json();
      if (responseJson.status == true) {
        // getUserAndToken();
        let dateTime = new Date();
        let chatData = {
          id: id,
          room: room,
          chat: "group",
          from: from,
          type: "att_image",
          text: responseJson.filepath,
          user_id: user.id,
          time: dateTime,
          is_send: true,
          name: `${user.first_name} ${user.last_name ? user.last_name : ""}`,
        };
        // if (socket.connected) {
        socket.current.emit("message", chatData);
        // } else {
        //   sendOffline(chatData);
        // }
        // RNToasty.Show({
        //   duration: 1,
        //   title: "Success upload image",
        //   position: "bottom",
        // });
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
      // RNToasty.Show({
      //   duration: 1,
      //   title: "error : someting wrong!",
      //   position: "bottom",
      // });
    }
  };

  let tmpRChat = true;
  const RenderChat = ({ item, index }) => {
    const timeState = new Date().toLocaleDateString();
    const timeStateChat = new Date(item.time).toLocaleDateString();
    let timeChat = new Date(item.time).toTimeString();

    let date = null;
    if (index == message.length - 1) {
      if (timeStateChat === timeState) {
        date = t("toDay");
      } else {
        date = timeStateChat;
      }
    } else if (
      message[index] &&
      new Date(message[index + 1].time).toLocaleDateString() !== timeStateChat
    ) {
      if (timeStateChat === timeState) {
        date = t("toDay");
      } else {
        date = timeStateChat;
      }
    }

    if (message[index + 1] && message[index + 1].user_id == item.user_id) {
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
            <View
              style={{
                flexDirection: "row",
                // borderWidth: 1,
                alignItems: "center",
              }}
            >
              {item.is_send == false ? <Errorr height={15} width={15} /> : null}
              <Text
                size="small"
                style={{
                  marginRight: 5,
                  // color: item.is_send == false ? "#D75995" : "#464646",
                  color: "#464646",
                  marginLeft: 5,
                }}
              >
                {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
              </Text>
            </View>
          ) : null}
          <ChatTypelayout
            item={item}
            user_id={user.id}
            tmpRChat={tmpRChat}
            navigation={navigation}
            dataMember={dataDetail}
            index={index}
            token={tokenApps}
            datas={message}
            socket={socket}
            _uploadimage={(image, id) => _uploadimage(image, id)}
            connected={connected}
            socket_connect={socket_connect}
            room={room}
            flatListRef={flatListRef}
            _sendmsg={(e) => _sendmsg(e)}
            type={"group"}
            from={from}
            user={user}
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
        {loadingGroup ? (
          <View
            style={{
              position: "absolute",
              zIndex: 2,
              width: Dimensions.get("screen").width,
              height: 55,
              paddingTop: 10,
            }}
          >
            <ActivityIndicator size="small" color="#209fae" />
          </View>
        ) : null}
        <FlatList
          ref={flatListRef}
          data={message}
          // inverted={true}
          // onContentSizeChange={() => {
          //   // if (flatListRef !== null && flatListRef.current) {
          //   //   flatListRef.current.scrollToEnd({ animated: false });
          //   // }
          // }}
          // initialScrollIndex={message.length - 1}
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
          enableAutoscrollToTop={false}
          // onStartReached={handleOnStartReached}
          // onStartReachedThreshold={1}
          inverted
        />
      </View>
      {keyboardOpenState ? (
        <>
          <KeyboardAvoidingView
            // behavior={Platform.OS == "ios" ? "padding" : ""}
            // keyboardVerticalOffset={Notch ? 90 : 65}
            style={{
              flexDirection: "row",
              paddingHorizontal: 5,
              alignContent: "center",
              alignItems: "center",
              paddingVertical: 10,
              marginHorizontal: 13,
              // marginBottom: 13,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              marginBottom:
                Platform.OS === "ios" &&
                keyboardOffset < 300 &&
                keyboardOffset > 0
                  ? 275
                  : keyboardOffset > 300
                  ? 120
                  : 13,
            }}
          >
            {!keyboardOpenState ? (
              <Button
                text=""
                type="circle"
                size="medium"
                variant="transparent"
                style={{ width: 35, height: 35 }}
                onPress={() => {
                  setShowKeyboardOffset(false);
                  dismissKeyboard();
                  SetkeyboardOpenState(true);
                }}
                style={{
                  marginRight: 5,
                }}
              >
                <Emoticon height={30} width={30} />
              </Button>
            ) : (
              <Button
                text=""
                type="circle"
                size="medium"
                variant="transparent"
                style={{ width: 30, height: 30 }}
                onPress={() => {
                  setShowKeyboardOffset(true);
                  SetkeyboardOpenState(false);
                  refInput.current.focus();
                  // KeyboardUtils.onFocus();
                }}
                style={{
                  marginRight: 5,
                }}
              >
                <IconKeyboard height={30} width={30} />
              </Button>
            )}
            <View
              style={{
                borderColor: "#D1D1D1",
                borderWidth: 1,
                width: width - 130,
                alignSelf: "center",
                backgroundColor: "#f3f3f3",
                borderRadius: 20,
                flexDirection: "row",
                maxHeight: 70,
                justifyContent: "space-between",
              }}
            >
              <TextInput
                autoFocus={showKeyboardOffset}
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
                        marginTop: 5,
                        marginBottom: 10,
                        marginLeft: 10,
                        width: width - 180,
                        fontFamily: "Lato-Regular",
                        backgroundColor: "#f3f3f3",
                      }
                    : {
                        maxHeight: 100,
                        marginVertical: 5,
                        marginLeft: 10,
                        padding: 0,
                        width: width - 180,
                        fontFamily: "Lato-Regular",
                        backgroundColor: "#f3f3f3",
                        // borderWidth: 1,
                      }
                }
              />
              <Pressable
                onPress={() => {
                  setmodalCamera(true);
                }}
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginRight: 10,
                }}
              >
                <CameraChat width={22} height={22} />
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

          <StickerModal submitSticker={(e) => submitSticker(e)} />
        </>
      ) : (
        <KeyboardAvoidingView
          // behavior={Platform.OS == "ios" ? "padding" : "height"}
          // keyboardVerticalOffset={Notch ? 90 : 65}
          style={{
            flexDirection: "row",
            paddingHorizontal: 5,
            alignContent: "center",
            alignItems: "center",
            paddingVertical: 10,
            marginHorizontal: 13,
            // marginBottom: 13,
            backgroundColor: "#FFFFFF",
            borderRadius: 10,
            marginBottom:
              Platform.OS === "ios" &&
              keyboardOffset < 300 &&
              keyboardOffset > 0
                ? 275
                : keyboardOffset > 300
                ? 120
                : 13,
          }}
        >
          {!keyboardOpenState ? (
            <Button
              text=""
              type="circle"
              size="medium"
              variant="transparent"
              style={{ width: 35, height: 35 }}
              onPress={() => {
                setShowKeyboardOffset(false);
                dismissKeyboard();
                SetkeyboardOpenState(true);
              }}
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
              variant="transparent"
              style={{ width: 35, height: 35 }}
              onPress={() => {
                setShowKeyboardOffset(true);
                SetkeyboardOpenState(false);
                refInput.current.focus();
                // KeyboardUtils.onFocus();
              }}
              style={{
                marginRight: 5,
              }}
            >
              <IconKeyboard height={30} width={30} />
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
              justifyContent: "space-between",
              // paddingHorizontal: 15,
              flexDirection: "row",
            }}
          >
            <TextInput
              autoFocus={showKeyboardOffset}
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
                      marginTop: 5,
                      marginBottom: 10,
                      marginLeft: 10,
                      width: width - 180,
                      fontFamily: "Lato-Regular",
                      backgroundColor: "#f3f3f3",
                    }
                  : {
                      maxHeight: 100,
                      marginVertical: 5,
                      marginLeft: 10,
                      padding: 0,
                      width: width - 180,
                      // width: "80%",
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
                // borderWidth: 1,
                // width: "15%",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginRight: 10,
              }}
            >
              <CameraChat width={22} height={22} />
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
