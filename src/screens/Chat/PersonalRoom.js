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
  FlatList,
  StatusBar,
  Alert,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import io from "socket.io-client";
import { Arrowbackwhite, Send, Smile } from "../../assets/svg";
import { Button, Text, Errors, FunImage } from "../../component";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";
import Toast from "react-native-fast-toast";
import { useTranslation } from "react-i18next";
import { RNToasty } from "react-native-toasty";
import DeviceInfo from "react-native-device-info";

export default function Room({ navigation, route }) {
  const Notch = DeviceInfo.hasNotch();
  const { t } = useTranslation();
  const toastRef = useRef();
  const { width, height } = Dimensions.get("screen");
  const [room, setRoom] = useState(route.params.room_id);
  const [receiver, setReceiver] = useState(route.params.receiver);
  const [user, setUser] = useState({});
  const [init, setInit] = useState(true);
  const [button, setButton] = useState(true);
  const [token, setToken] = useState(null);
  const socket = io(CHATSERVER);
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState([]);
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
              source={{ uri: route.params.picture }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: "Lato-Bold",
              fontSize: 14,
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

  useEffect(() => {
    socket.emit("join", room);
    navigation.setOptions(navigationOptions);
    if (init) {
      getUserToken();
      // setConnection();
    }
    socket.on("newMessage", (data) => {
      setChatHistory(data);
    });
    return () => socket.disconnect();
  }, []);

  const setConnection = () => {
    socket.emit("join", room);
  };

  const getUserToken = async () => {
    let data = await AsyncStorage.getItem("setting");
    setUser(JSON.parse(data).user);
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
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
    if (responseJson.data) {
      await AsyncStorage.setItem(
        "history_" + room,
        JSON.stringify(responseJson.data)
      );
      await setMessage(responseJson.data);
      await setTimeout(function() {
        if (flatListRef) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 250);
    }
  };

  const submitChatMessage = async () => {
    if (button) {
      if (chat && chat.replace(/\s/g, "").length) {
        await setButton(false);
        let chatData = {
          room: room,
          text: chat,
          user_id: user.id,
        };
        await fetch(`${CHATSERVER}/api/personal/send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `room=${room}&text=${chat}&user_id=${user.id}`,
        });
        await socket.emit("message", chatData);
        await setChat("");
        await setTimeout(function() {
          if (flatListRef) {
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

  let tmpRChat = null;
  const RenderChat = ({ item, index }) => {
    const timeState = new Date().toLocaleDateString();
    const timeStateChat = new Date(item.time).toLocaleDateString();
    let timeChat = new Date(item.time).toTimeString();
    if (item.user_id !== tmpRChat) {
      tmpRChat = item.user_id;
      return (
        <View>
          {user.id !== item.user_id ? (
            <Text
              size="description"
              type="bold"
              style={{
                paddingBottom: 5,
                paddingLeft: 20,
                color: "#464646",
              }}
            >
              {item.name}
            </Text>
          ) : null}

          {message[index - 1] &&
          new Date(message[index - 1].time).toLocaleDateString() ===
            timeStateChat ? null : timeStateChat === timeState ? (
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
                Hari ini
              </Text>
            </View>
          ) : (
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
                {timeStateChat}
              </Text>
            </View>
          )}

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
            <View
              style={[
                styles.balloon,
                user.id == item.user_id
                  ? {
                      backgroundColor: "#DAF0F2",
                      borderTopRightRadius: 0,
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      borderTopLeftRadius: 0,
                    },
              ]}
            >
              <Text
                size="description"
                style={{
                  color: "#464646",
                  lineHeight: 18,
                }}
              >
                {item.text}
              </Text>
              <View
                style={[
                  styles.arrowContainer,
                  user.id == item.user_id
                    ? styles.arrowRightContainer
                    : styles.arrowLeftContainer,
                ]}
              >
                <Svg
                  style={
                    user.id == item.user_id
                      ? styles.arrowRight
                      : styles.arrowLeft
                  }
                  height="50"
                  width="50"
                >
                  <Polygon
                    points={
                      user.id == item.user_id
                        ? "0,01 15,01 5,12"
                        : "20,01 0,01 12,12"
                    }
                    fill={user.id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
                    stroke="#209FAE"
                    strokeWidth={0.7}
                  />
                </Svg>
                <Svg
                  style={[
                    { position: "absolute" },
                    user.id == item.user_id
                      ? { right: moderateScale(-5, 0.5) }
                      : { left: moderateScale(-5, 0.5) },
                  ]}
                  height="50"
                  width="50"
                >
                  <Polygon
                    points={
                      user.id == item.user_id
                        ? "0,1.3 15,1.1 5,12"
                        : "20,01 0,01 12,13"
                    }
                    fill={user.id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
                  />
                </Svg>
              </View>
            </View>
            {user.id !== item.user_id ? (
              <Text size="small" style={{ marginLeft: 5 }}>
                {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
              </Text>
            ) : null}
          </View>
        </View>
      );
    } else {
      return (
        <View>
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
            <View
              style={[
                styles.balloon,
                user.id == item.user_id
                  ? {
                      backgroundColor: "#DAF0F2",
                      borderTopRightRadius: 0,
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      borderTopLeftRadius: 0,
                    },
              ]}
            >
              <Text
                size="description"
                style={{
                  color: "#464646",
                  lineHeight: 18,
                }}
              >
                {item.text}
              </Text>
              <View
                style={[
                  styles.arrowContainer,
                  user.id == item.user_id
                    ? styles.arrowRightContainer
                    : styles.arrowLeftContainer,
                ]}
              ></View>
            </View>
            {user.id !== item.user_id ? (
              <Text size="small" style={{ marginLeft: 5 }}>
                {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
              </Text>
            ) : null}
          </View>
        </View>
      );
    }
  };

  const [messages, setMessages] = useState("");
  const [modalError, setModalError] = useState(false);

  const modals = () => {
    setModalError(true);
    setMessages("Sticker Coming Soon");
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14646E" barStyle="light-content" />
      <Toast ref={toastRef} />
      <Errors
        modals={modalError}
        setModals={(e) => setModalError(e)}
        message={messages}
      />
      <FlatList
        ref={flatListRef}
        data={message}
        renderItem={RenderChat}
        keyExtractor={(item, index) => `render_${index}`}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 5 }}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Notch ? 90 : 65}
      >
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
          <Button
            text=""
            type="circle"
            size="medium"
            variant="transparent"
            style={{ width: 50, height: 50 }}
            // onPress={() => Alert.alert("Sticker Cooming Soon")}
            onPress={() => modals()}
          >
            <Smile height={35} width={35} />
          </Button>
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
              placeholder="Type a message"
              onChangeText={(text) => setChat(text)}
              style={
                Platform.OS == "ios"
                  ? {
                      maxHeight: 100,
                      margin: 10,
                      fontFamily: "Lato-Regular",
                    }
                  : {
                      maxHeight: 100,
                      marginVertical: 5,
                      marginHorizontal: 10,
                      padding: 0,
                      fontFamily: "Lato-Regular",
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
