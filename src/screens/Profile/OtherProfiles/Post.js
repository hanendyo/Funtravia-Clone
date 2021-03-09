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

export default function Posti({ item, index }) {
  console.log(item);
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 1,
      }}
    >
      {item.map(() => {
        return (
          <View>
            <Text>test</Text>
          </View>
        );
      })}
    </View>
  );
}
