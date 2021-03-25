import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Pressable,
  ImageBackground,
  // Image,
} from "react-native";
import Image from "react-native-auto-scale-image";

const { width, height } = Dimensions.get("screen");

export default function RenderSinglePhoto({ data, props }) {
  return (
    <Image
      style={{
        width: Dimensions.get("window").width - 40,
        borderRadius: 15,
        alignSelf: "center",
        marginHorizontal: 10,
      }}
      uri={data.assets[0].filepath}
    />
  );
}
