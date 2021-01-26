import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Text } from "../../component";
import { useTranslation } from "react-i18next";
import { Kosong } from "../../assets/svg";

export default function NotFound({ navigation, wanted }) {
  const { t, i18n } = useTranslation();
  return (
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        alignContent: "center",
        // height: '100%',
        alignSelf: "center",
      }}
    >
      <Text type="bold" size="title" style={{ color: "#646464" }}>
        Oopss...
      </Text>
      <Text size="title" type="regular" style={{ color: "#646464" }}>
        {`${t(wanted)} ${t("notFound")}!`}
      </Text>
      <Kosong
        height={Dimensions.get("screen").width * 0.6}
        width={Dimensions.get("screen").width}
      />
    </View>
  );
}
