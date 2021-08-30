import React, { useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
  Pressable,
  Switch,
  BackHandler,
} from "react-native";
import io from "socket.io-client";
import Modal from "react-native-modal";
import { FlatList } from "react-native-bidirectional-infinite-scroll";
import {
  Arrowbackwhite,
  Send,
  Smile,
  Chat,
  Sticker,
  Emoticon,
  CameraChat,
  Keyboard as IconKeyboard,
} from "../../assets/svg";
import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";
import {
  Button,
  Text,
  Errors,
  FunImage,
  StickerModal,
  FunImageAutoSize,
} from "../../component";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER, RESTFULL_API } from "../../config";
import Toast from "react-native-fast-toast";
import { useTranslation } from "react-i18next";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";
import { Keyboard } from "react-native-ui-lib";
import AnimatedPlayer from "react-native-animated-webp";
import ChatTypelayout from "./ChatTypelayout";
import ImagePicker from "react-native-image-crop-picker";
import { ASSETS_SERVER } from "../../config";

// import "./CustomKeyboard/demoKeyboards";
const KeyboardAccessoryView = Keyboard.KeyboardAccessoryView;
const KeyboardUtils = Keyboard.KeyboardUtils;
const KeyboardRegistry = Keyboard.KeyboardRegistry;
const TrackInteractive = true;

const keyboards = [
  {
    id: "unicorn.ImagesKeyboard",
    icon: Emoticon,
  },
  {
    id: "unicorn.CustomKeyboard",
    icon: Emoticon,
  },
];

export default function Room({ navigation, route }) {
  const Notch = DeviceInfo.hasNotch();
  const { t } = useTranslation();
  const playerRef = useRef(null);
  const [modal_camera, setmodalCamera] = useState(false);
  const toastRef = useRef();
  const refInput = useRef();
  const { width, height } = Dimensions.get("screen");
  const [room, setRoom] = useState(route.params.room_id);
  const [receiver, setReceiver] = useState(route.params.receiver);
  const [user, setUser] = useState({});
  const [init, setInit] = useState(true);
  const [button, setButton] = useState(true);
  const [token, setToken] = useState(null);
  const socket = io(CHATSERVER, {
    withCredentials: true,
    extraHeaders: {
      Authorization: token,
    },
  });
  // console.log(token);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState([]);
  const [bank_message, setBankMessage] = useState([]);
  const [indexmessage, setIndexmessage] = useState(0);
  const [customKeyboard, SetcustomKeyboard] = useState({
    component: undefined,
    initialProps: undefined,
  });

  const [receivedKeyboardData, SetreceivedKeyboardData] = useState(undefined);
  const [useSafeArea, SetuseSafeArea] = useState(true);
  const [keyboardOpenState, SetkeyboardOpenState] = useState(false);

  const onKeyboardItemSelected = (keyboardId, params) => {
    console.log("utemselected");
    const receivedKeyboardData = `onItemSelected from "${keyboardId}"\nreceived params: ${JSON.stringify(
      params
    )}`;
    SetreceivedKeyboardData({ receivedKeyboardData });
  };

  const onKeyboardResigned = () => {
    resetKeyboardView();
  };

  const isCustomKeyboardOpen = () => {
    // const { keyboardOpenState, customKeyboard } = this.state;
    let tempcustomKeyboard = { ...customKeyboard };
    return keyboardOpenState && !_.isEmpty(tempcustomKeyboard);
  };

  const resetKeyboardView = () => {
    SetkeyboardOpenState(false);
    SetcustomKeyboard({});
  };

  const dismissKeyboard = () => {
    KeyboardUtils.dismiss();
  };

  const toggleUseSafeArea = () => {
    // const { useSafeArea } = this.state;
    SetuseSafeArea(!useSafeArea);

    if (isCustomKeyboardOpen()) {
      dismissKeyboard();
      showLastKeyboard();
    }
  };

  const showLastKeyboard = () => {
    SetcustomKeyboard({});
    setTimeout(() => {
      SetkeyboardOpenState(true);
      SetcustomKeyboard({});
    }, 500);
  };

  const showKeyboardView = (component, title) => {
    SetkeyboardOpenState(true);
    SetcustomKeyboard({
      component,
      initialProps: { title },
    });
  };
  const [connected, SetConnection] = useState(false);
  const connection_check = useNetInfo();
  useEffect(() => {
    const cek_koneksi = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        SetConnection(true);
        initialHistory();
      } else {
        SetConnection(false);
      }
    });
    cek_koneksi();
  }, [connection_check]);

  const onHeightChanged = (keyboardAccessoryViewHeight) => {
    // console.log(keyboardAccessoryViewHeight);
    if (Platform.OS == "ios") {
      // this.setState({ keyboardAccessoryViewHeight });
    }
  };

  const renderKeyboardAccessoryViewContent = () => {
    return (
      <View style={styles.keyboardContainer}>
        <View>
          <TextInput
            value={chat}
            multiline
            placeholder="Type a message"
            onChangeText={(text) => setChat(text)}
            underlineColorAndroid="transparent"
            onFocus={() => resetKeyboardView()}
          />
          <Button onPress={KeyboardUtils.dismiss} />
        </View>
        <View>
          <View>
            {keyboards.map((keyboard) => (
              <Button
                key={keyboard.id}
                onPress={() => showKeyboardView(keyboard.id, "test")}
              />
            ))}
          </View>

          <Button onPress={() => resetKeyboardView()} />
        </View>
      </View>
    );
  };

  const requestShowKeyboard = () => {
    KeyboardRegistry.requestShowKeyboard("unicorn.ImagesKeyboard");
  };

  const onRequestShowKeyboard = (componentID) => {
    SetcustomKeyboard({
      component: componentID,
      initialProps: { title: "Keyboard 1 opened by button" },
    });
  };

  const safeAreaSwitchToggle = () => {
    if (Platform.OS !== "ios") {
      return;
    }
    const { useSafeArea } = this.state;
    return (
      <View>
        <View style={styles.separatorLine} />
        <View>
          <Text>Safe Area Enabled:</Text>
          <Switch value={useSafeArea} onValueChange={() => toggleUseSafeArea} />
        </View>
        <View style={styles.separatorLine} />
      </View>
    );
  };

  const pickcamera = async () => {
    ImagePicker.openCamera({
      // width: 500,
      // height: 500,
      cropping: true,
      // cropperCircleOverlay: true,
      // includeBase64: true,
    }).then((image) => {
      // console.log(image);
      let id = create_UUID();
      _uploadimage(image, id);
      // setdataImage(image.data);
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
      // setdataImagepatch(image.path);
      setmodalCamera(false);
      // upload(image.data);
    });
  };

  const pickGallery = async () => {
    ImagePicker.openPicker({
      // width: 500,
      // height: 500,
      cropping: true,
      // cropperCircleOverlay: true,
      // includeBase64: true,
    }).then((image) => {
      let id = create_UUID();
      _uploadimage(image, id);
      // setdataImage(image.data);
      let dateTime = new Date();

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
      // setdataImage(image.data);
      // setdataImagepatch(image.path);
      setmodalCamera(false);
      // upload(image.data);
    });
  };

  const _uploadimage = async (image, id) => {
    try {
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
      // console.log("formData", formData);
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
        await socket.emit("message", chatData);
        // } else {
        //   sendOffline(chatData);
        // }
        RNToasty.Show({
          duration: 1,
          title: "Success upload image",
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
      console.log(error);
    }
  };

  let flatListRef = useRef();

  const navigationOptions = {
    headerShown: true,
    headerTitle: null,
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
    },
    headerLeft: () => (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          marginVertical: 10,
          marginLeft: 10,
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
            navigation.push("ProfileStack", {
              screen: "otherprofile",
              params: {
                idUser: route.params.receiver,
              },
            });
          }}
          style={{
            flexDirection: "row",
            // borderWidth: 1,
            width: Dimensions.get("screen").width - 100,
            height: 45,
            alignItems: "center",
            backgroundColor: "#209fae",
            zIndex: 100,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.push("ProfileStack", {
                screen: "otherprofile",
                params: {
                  idUser: route.params.receiver,
                },
              });
            }}
          >
            <FunImage
              size="xs"
              source={{ uri: route.params.picture }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </TouchableOpacity>
          <Text
            type="bold"
            size="title"
            style={{
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
    headerRightStyle: {
      paddingRight: 20,
    },
  };
  // console.log("----", socket.connected);

  useEffect(() => {
    socket.emit("join", room);
    socket.on("connect", () => {
      console.log("socket_connect");
      // socket.emitBuffered();
      // socket.sendBuffer = [];
    });
    navigation.setOptions(navigationOptions);
    if (init) {
      getUserToken();
      // setChatHistory();
      // setConnection();
    }
    socket.on("new_chat_personal", (data) => {
      console.log("c");
      setChatHistory(data);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {}, []);

  const setConnection = () => {
    socket.emit("join", room);
  };

  const getUserToken = async () => {
    let data = await AsyncStorage.getItem("setting");
    setUser(JSON.parse(data).user);
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
      await setToken(token);
      // await initialHistory(token);
    }
  };

  const setChatHistory = async (data) => {
    // console.log("dara");
    let history = await AsyncStorage.getItem("history_" + room);
    if (history) {
      let recent = JSON.parse(history);
      if (data) {
        let idx = recent.findIndex((x) => x.id === data.id);
        if (idx < 0) {
          recent.push(data);
        } else {
          recent[idx] = data;
        }
        await AsyncStorage.setItem("history_" + room, JSON.stringify(recent));
        setMessage(recent);
      } else {
        setMessage(recent);
      }
    } else {
      if (data) {
        await AsyncStorage.setItem("history_" + room, JSON.stringify([data]));
        setMessage([data]);
      } else {
        await initialHistory(token);
      }
    }
  };

  const initialHistory = async (access_token) => {
    let response = await fetch(
      `${CHATSERVER}/api/personal/history?receiver_id=${receiver}`,
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
    let history = await AsyncStorage.getItem("history_" + room);
    let init_local = JSON.parse(history);
    let init_data = responseJson.data;
    let filteredList = [];
    if (init_local && init_data) {
      let merge = [...init_local, ...init_data];
      filteredList = [...new Set(merge.map(JSON.stringify))].map(JSON.parse);
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
      let split = filteredList;
      while (split.length) {
        new_array.unshift(split.splice(0, 20));
      }
      // console.log(new_array);
      await setMessage(new_array[0]);
      setBankMessage(new_array);
    }
  };
  console.log(message);
  const handleOnStartReached = () => {
    console.log("infinty");
    if (bank_message.length > 0 && indexmessage < bank_message.length - 1) {
      let merge_message = [...bank_message[indexmessage + 1], ...message];
      setMessage(merge_message);
      // setMessage((m) => {
      //   return bank_message[indexmessage + 1].concat();
      // });
    }
  };

  const sendOffline = async (data) => {
    data = Object.assign(data, { is_send: false });
    setChatHistory(data);
  };

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

  const submitChatMessage = async () => {
    // console.log(a);
    // console.log("create_UUID", create_UUID());
    let uuid = create_UUID();
    if (button) {
      SetkeyboardOpenState(false);
      if (chat && chat.replace(/\s/g, "").length) {
        await setButton(false);
        let dateTime = new Date();
        let chatData = {
          id: uuid,
          room: room,
          chat: "personal",
          type: "text",
          text: chat,
          user_id: user.id,
          time: dateTime,
        };

        if (socket.connected) {
          await socket.emit("message", chatData);
        } else {
          sendOffline(chatData);
        }
        await setChat("");
        await setTimeout(function() {
          if (flatListRef !== null && flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }, 1000);
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
    // if (button) {
    // console.log("ini X", x);
    if (x && x.replace(/\s/g, "").length) {
      await setButton(false);
      let chatData = {
        room: room,
        chat: "personal",
        type: "sticker",
        text: x,
        user_id: user.id,
      };
      await fetch(`${CHATSERVER}/api/personal/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `room=${room}&type=sticker&chat=personal&text=${x}&user_id=${user.id}`,
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

  let tmpRChat = true;
  const RenderChat = ({ item, index }) => {
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
            <Text
              size="small"
              style={{
                marginRight: 5,
                color: item.is_send == false ? "#D75995" : "#464646",
              }}
            >
              {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
            </Text>
          ) : null}
          <ChatTypelayout
            item={item}
            user_id={user.id}
            tmpRChat={tmpRChat}
            navigation={navigation}
            socket={socket}
            _uploadimage={(image, id) => _uploadimage(image, id)}
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

  const [messages, setMessages] = useState("");
  // const [modalError, setmodalCameraError] = useState(false);
  const [_stickerModal, setStickerModal] = useState(false);

  // const modals = () => {
  //   setmodalCameraError(true);
  //   setMessages("Sticker Coming Soon");
  // };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14646E" barStyle="light-content" />
      <Toast ref={toastRef} />
      {/* <Errors
        modals={modalError}
        setmodalCameras={(e) => setmodalCameraError(e)}
        message={messages}
      /> */}
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
        {message && message.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={message}
            // inverted={true}
            // onContentSizeChange={() => {
            //   // if (flatListRef !== null && flatListRef.current) {
            //   //   flatListRef.current.scrollToEnd({ animated: false });
            //   // }
            // }}
            initialScrollIndex={message.length - 1}
            renderItem={RenderChat}
            keyExtractor={(item, index) => `render_${index}`}
            showsVerticalScrollIndicator={true}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingTop: 5,
              // flex: 1,
              backgroundColor: "#FFFFFF",
              borderRadius: 10,
              // borderWidth: 1,
            }}
            enableAutoscrollToTop={false}
            onStartReached={handleOnStartReached}
            onStartReachedThreshold={1} // optional
          />
        ) : null}
      </View>

      {/* <KeyboardAccessoryView
                    renderContent={() => {
                        return (
                            <View
                                style={{
                                    flexDirection: "row",
                                    paddingHorizontal: 10,
                                    alignContent: "center",
                                    alignItems: "center",
                                    paddingVertical: 2,
                                    backgroundColor: "#F6F6F6",
                                }}
                            >
                                {!keyboardOpenState ? (
                                    <Button
                                        text=""
                                        type="circle"
                                        size="medium"
                                        variant="normal"
                                        style={{ width: 35, height: 35 }}
                                        // onPress={() => Alert.alert("Sticker Cooming Soon")}
                                        // onPress={() => modals()}
                                        // onPress={() => {
                                        //     navigation.navigate("ChatStack", {
                                        //         screen: "KeyboardInput",
                                        //     });
                                        // }}
                                        onPress={() =>
                                            showKeyboardView(
                                                "unicorn.StikerKeyboard"
                                            )
                                        }
                                        style={{
                                            marginRight: 10,
                                        }}
                                    >
                                        <Smile height={35} width={35} />
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
                                            resetKeyboardView();
                                            refInput.current.focus();
                                            // KeyboardUtils.onFocus();
                                        }}
                                        style={{
                                            marginRight: 10,
                                        }}
                                    >
                                        <Chat height={13} width={13} />
                                    </Button>
                                )}
                                <View
                                    style={{
                                        borderColor: "#D1D1D1",
                                        borderWidth: 1,
                                        width: width - 120,
                                        alignSelf: "center",
                                        backgroundColor: "#FFFFFF",
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
                                                      margin: 10,
                                                      fontFamily:
                                                          "Lato-Regular",
                                                  }
                                                : {
                                                      maxHeight: 100,
                                                      marginVertical: 5,
                                                      marginHorizontal: 10,
                                                      padding: 0,
                                                      fontFamily:
                                                          "Lato-Regular",
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
                                    <Send height={35} width={35} />
                                </Button>
                            </View>
                        );
                    }}
                    onHeightChanged={() => onHeightChanged()}
                    trackInteractive={TrackInteractive}
                    kbInputRef={chat}
                    kbComponent={customKeyboard.component}
                    kbInitialProps={customKeyboard.initialProps}
                    onItemSelected={() => onKeyboardItemSelected}
                    onKeyboardResigned={() => onKeyboardResigned}
                    revealKeyboardInteractive
                    onRequestShowKeyboard={() => onRequestShowKeyboard}
                    useSafeArea={useSafeArea}
                /> */}
      {/* </KeyboardAvoidingView> */}

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
                style={{ width: 30, height: 30 }}
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
                <Emoticon height={30} width={30} />
              </Button>
            ) : (
              <Button
                text=""
                type="circle"
                size="medium"
                variant="transparent"
                style={{ width: 30, height: 30 }}
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
                borderRadius: 50,
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
                        // borderWidth: 1,
                      }
                }
              />
              <Pressable
                onPress={() => {
                  setmodalCamera(true);
                }}
                style={{
                  // borderWidth: 1,
                  width: "15%",
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
              style={{ width: 30, height: 30 }}
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
              <Emoticon height={30} width={30} />
            </Button>
          ) : (
            <Button
              text=""
              type="circle"
              size="medium"
              variant="normal"
              style={{ width: 30, height: 30 }}
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
              <IconKeyboard height={13} width={13} />
            </Button>
          )}
          <View
            style={{
              borderColor: "#D1D1D1",
              borderWidth: 1,
              width: width - 130,
              alignSelf: "center",
              backgroundColor: "#f3f3f3",
              borderRadius: 50,
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
                      // borderWidth: 1,
                    }
              }
            />
            <Pressable
              onPress={() => {
                setmodalCamera(true);
              }}
              style={{
                // borderWidth: 1,
                width: "15%",
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
      <Modal
        onBackdropPress={() => {
          setmodalCamera(false);
        }}
        onRequestClose={() => setmodalCamera(false)}
        onDismiss={() => setmodalCamera(false)}
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={modal_camera}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 60,
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickcamera()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenCamera")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
            }}
            onPress={() => pickGallery()}
          >
            <Text size="description" type="regular" style={{}}>
              {t("OpenGallery")}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: Dimensions.get("screen").height,
    // backgroundColor: "#fff",
    backgroundColor: "#F3F3F3",
    justifyContent: "space-between",
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
    marginBottom: 5,
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
