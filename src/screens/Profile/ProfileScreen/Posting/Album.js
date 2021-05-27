import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Pressable,
} from "react-native";
import { default_image } from "../../../../assets/png";
import User_Post from "../../../../graphQL/Query/Profile/post";
import { Kosong } from "../../../../assets/svg";
import { Text } from "../../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
const { width, height } = Dimensions.get("screen");

export default function Album({ item, index, props, token }) {
  // console.log(item);
  return (
    <Pressable
      onPress={() => {
        props.navigation.push("albumdetail", {
          id: item.id,
          type: item.type,
          token: token,
          judul: item.title,
        });
      }}
      style={{
        width: "100%",
        height: width * 0.55,
        paddingHorizontal: 10,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          borderRadius: 10,
          flex: 1,
          elevation: 1,
          backgroundColor: "#fff",
        }}
      >
        <Image
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            width: "100%",
            height: "75%",
          }}
          source={item?.cover ? { uri: item?.cover } : default_image}
        ></Image>
        <View
          style={{
            flex: 1,
            alignContent: "center",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text size={"label"} type="bold">
            {item.title}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
