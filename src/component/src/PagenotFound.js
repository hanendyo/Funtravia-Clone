import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import { Kosong, Notfound404 } from "../../assets/svg";
import { bg_notfound } from "../../assets/png";

export default function PagenotFound({ props }) {
  const { t, i18n } = useTranslation();
  let { width, height } = Dimensions.get("screen");

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F6F6F6",
        // justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 40,
      }}
    >
      <ImageBackground
        source={bg_notfound}
        style={{
          width: width,
          height: width - 200,
          alignSelf: "flex-start",
          justifyContent: "flex-end",
          alignContent: "center",
          alignItems: "center",
          // marginBottom: 2,
          // borderWidth: 1,
          marginTop: -5,
          backgroundColor: "#FFFFFF",
        }}
      ></ImageBackground>
      <Notfound404
        width={width - 150}
        height={width - 150}
        style={{
          marginTop: -30,
          zIndex: 3,
          marginBottom: 50,
        }}
      />
      <Text
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        {t("pageNoteFound")}
      </Text>
      <Button
        text={t("backToHome")}
        onPress={() =>
          props.navigation.reset({
            index: 0,
            routes: [
              {
                name: "BottomStack",
                routes: [{ name: "HomeScreen" }],
              },
            ],
          })
        }
        style={{
          width: width - 80,
        }}
      />
    </View>
  );
}
