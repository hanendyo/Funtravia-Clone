import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
} from "react-native";
import { default_image } from "../../../../assets/png";
import User_Post from "../../../../graphQL/Query/Profile/post";
import { Kosong } from "../../../../assets/svg";
import { Text } from "../../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
const { width, height } = Dimensions.get("screen");

export default function Albums({ item, index }) {
  console.log(item);
  return (
    <View
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
          source={
            item?.assets[0]?.filepath
              ? { uri: item?.assets[0]?.filepath }
              : default_image
          }
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
            {item.itinerary.name}
          </Text>
        </View>
      </View>
    </View>
  );
}
