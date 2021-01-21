import React from "react";
import { View, Image, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
type Props = {
  tittle: String,
  content: String,
  maps: Image,
  handleVisibility: () => void,
};
const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width - 50;
export default function AboutInformation({ tittle, content, maps }) {
  const { t, i18n } = useTranslation();

  return (
    <View style={{ padding: 20 }}>
      <Text
        type="bold"
        size="title"
        style={{
          backgroundColor: "transparent",
          // fontSize: (18),
          marginVertical: 10,
          fontFamily: "Lato-Bold",
          // color: '#464646',
        }}
      >
        {tittle}
      </Text>
      <Text
        size="small"
        type="regular"
        style={{
          textAlign: "justify",
          // fontFamily: "Lato-Regular",
          fontSize: 13,
          // color: '#464646',
        }}
      >
        {content}
      </Text>
      {maps && maps !== "" ? (
        <View style={{ alignItems: "center" }}>
          <Image
            source={{
              uri: maps + `?width=${imageWidth}&height=${imageHeight}`,
            }}
            resizeMode={"cover"}
            style={{
              marginVertical: 20,
              height: imageHeight,
              width: imageWidth,
            }}
          />
        </View>
      ) : null}
    </View>
  );
}
