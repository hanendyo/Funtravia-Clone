import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { default_image } from "../../../../assets/png";
import User_Post from "../../../../graphQL/Query/Profile/post";
import { Kosong } from "../../../../assets/svg";
import { Text } from "../../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";
const { width, height } = Dimensions.get("screen");

export default function Tags({ item, index }) {
  return (
    <View
      style={{
        width: (width - 20) / 3,
        height: (width - 20) / 3,
        margin: 2.5,
      }}
    >
      <Image
        style={{
          width: "100%",
          height: "100%",
        }}
        source={
          item[0]?.assets[0]?.filepath
            ? { uri: item[0]?.assets[0]?.filepath }
            : default_image
        }
      />
    </View>
  );
}
