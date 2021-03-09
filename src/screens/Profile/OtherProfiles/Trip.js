import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { default_image } from "../../../assets/png";
import User_Post from "../../../graphQL/Query/Profile/post";
import { Kosong } from "../../../assets/svg";
import { Text } from "../../../component";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/client";

export default function Trip({ item, index }) {
  return (
    <View
      style={{
        marginLeft: index % 3 === 0 ? 0 : 10,
        borderRadius: 16,
        width: 50,
        height: 50,
        backgroundColor: "#aaa",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>{index}</Text>
      <Text>{index}</Text>
    </View>
  );
}
