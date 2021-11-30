import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Pressable,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Errorr } from "../../assets/svg";
import { Text, FunImage, FunImageAutoSize, FunVideo } from "../../component";
import AnimatedPlayer from "react-native-animated-webp";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";
import normalize from "react-native-normalize";
import ImageView from "react-native-image-viewing";
import ChatTypelayout from "./ChatTypelayout";

export default function RenderChat({
  navigation,
  item,
  index,
  user,
  token,
  socket,
  _uploadimage,
  socket_connect,
}) {
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
          token={token}
          socket={socket}
          _uploadimage={(image, id) => _uploadimage(image, id)}
          connected={connected}
          socket_connect={socket_connect}
        />
        {user.id !== item.user_id ? (
          <Text size="small" style={{ marginLeft: 5 }}>
            {timeChat ? (timeChat ? timeChat.substring(0, 5) : null) : null}
          </Text>
        ) : null}
      </View>
    </View>
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
