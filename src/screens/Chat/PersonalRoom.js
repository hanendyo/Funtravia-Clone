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
} from "react-native";
import io from "socket.io-client";
import { Arrowbackwhite, Send } from "../../assets/svg";
import { Button, Text } from "../../component";
import Svg, { Path } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";

export default function Room({ navigation, route }) {
  const [room, setRoom] = useState(route.params.room_id);
  const [receiver, setReceiver] = useState(route.params.receiver);
  const [user, setUser] = useState({});
  const [init, setInit] = useState(true);
  const [button, setButton] = useState(true);
  const [token, setToken] = useState(null);
  const socket = io(CHATSERVER);
  let [chat, setChat] = useState(null);
  let [message, setMessage] = useState([]);
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
        <TouchableOpacity>
          <Image
            source={{ uri: route.params.picture }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          ></Image>
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
      </View>
    ),
    headerRightStyle: {
      paddingRight: 20,
    },
  };

  useEffect(() => {
    navigation.setOptions(navigationOptions);
    if (init) {
      getUserToken();
      setConnection();
    }
    socket.on("newMessage", (data) => {
      setChatHistory(data);
    });
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
      await setTimeout(function () {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 500);
    }
  };

  const submitChatMessage = async () => {
    if (button) {
      if (chat && chat !== "") {
        await setButton(false);
        let chatData = {
          room: room,
          text: chat,
          user_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
        };
        let response = await fetch(`${CHATSERVER}/api/personal/send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `room=${room}&text=${chat}&user_id=${user.id}`,
        });
        let dataResponse = await response.json();
        if (dataResponse.status) {
          await socket.emit("message", chatData);
          await setChat("");
          await setTimeout(function () {
            flatListRef.current.scrollToEnd({ animated: true });
          }, 250);
        }
        await setButton(true);
      }
    }
  };

  const RenderChat = ({ item, index }) => {
    return (
      <View
        key={`chat_${index}`}
        style={[
          styles.item,
          user.id == item.user_id ? styles.itemOut : styles.itemIn,
        ]}
      >
        <View
          style={[
            styles.balloon,
            {
              backgroundColor: user.id == item.user_id ? "#209FAE" : "#E2ECF8",
            },
          ]}
        >
          <Text
            size="small"
            style={{
              padding: 2.5,
              color: user.id == item.user_id ? "#FFFFFF" : "#464646",
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
                user.id == item.user_id ? styles.arrowRight : styles.arrowLeft
              }
              width={moderateScale(15.5, 0.6)}
              height={moderateScale(17.5, 0.6)}
              viewBox="32.484 17.5 15.515 17.5"
              enable-background="new 32.485 17.5 15.515 17.5"
            >
              <Path
                d={
                  user.id == item.user_id
                    ? "M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
                    : "M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
                }
                fill={user.id == item.user_id ? "#209FAE" : "#E2ECF8"}
                x="0"
                y="0"
              />
            </Svg>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#14646E" barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={message}
        renderItem={RenderChat}
        keyExtractor={(item, index) => `render_${index}`}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        keyboardVerticalOffset={70}
      >
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 5,
            alignContent: "center",
            alignItems: "center",
            paddingVertical: 5,
          }}
        >
          <View
            style={{
              borderColor: "#D1D1D1",
              borderWidth: 1,
              width: "90%",
              borderRadius: 25,
              paddingHorizontal: 10,
              alignSelf: "center",
            }}
          >
            <TextInput
              value={chat}
              multiline
              placeholder="Type a message"
              onChangeText={(text) => setChat(text)}
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
          <Button
            text=""
            type="circle"
            size="medium"
            variant="transparent"
            onPress={() => submitChatMessage()}
            style={{ marginHorizontal: 5 }}
          >
            <Send height={28} width={28} />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
    justifyContent: "flex-end",
  },
  item: {
    marginVertical: moderateScale(3, 2),
    flexDirection: "row",
  },
  itemIn: {
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
  },
  arrowContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    flex: 1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },

  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
});
