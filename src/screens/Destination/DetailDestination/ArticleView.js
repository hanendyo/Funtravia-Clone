import React from "react";
import { View, Image, Dimensions, ScrollView } from "react-native";
const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
export default function ArticleView({ data }) {
  const { t, i18n } = useTranslation();

  return (
    <ScrollView style={{ marginBottom: 50 }}>
      {data && data.length ? (
        data.map((i, index) => {
          return (
            <View key={index}>
              {i.type === "image" ? (
                <View>
                  <Text
                    size="title"
                    type="bold"
                    style={{
                      // fontSize: (18),
                      marginVertical: 10,
                      // fontFamily: "Lato-Bold",
                      color: "#464646",
                    }}
                  >
                    {i.title}
                  </Text>
                  <Text
                    type="regular"
                    size="description"
                    style={{
                      textAlign: "justify",
                      // fontFamily: "Lato-Regular",
                      // fontSize: (13),
                      color: "#464646",
                    }}
                  >
                    {i.text}
                  </Text>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={{ uri: i.image }}
                      resizeMode={"cover"}
                      style={{
                        marginVertical: 20,
                        height: imageHeight,
                        width: imageWidth,
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  <Text
                    size="title"
                    type="bold"
                    style={{
                      // fontSize: (18),
                      marginVertical: 10,
                      // fontFamily: "Lato-Bold",
                      color: "#464646",
                    }}
                  >
                    {i.title}
                  </Text>
                  <Text
                    type="regular"
                    size="description"
                    style={{
                      textAlign: "justify",
                      // fontFamily: "Lato-Regular",
                      // fontSize: (13),
                      color: "#464646",
                    }}
                  >
                    {i.text}
                  </Text>
                </View>
              )}
            </View>
          );
        })
      ) : (
        <View style={{ alignItems: "center" }}>
          <Text
            type="regular"
            size="title"
            style={{
              textAlign: "justify",
              // fontFamily: "Lato-Regular",
              // fontSize: (13),
              color: "#464646",
            }}
          >
            {t("noArticle")}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
