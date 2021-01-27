import React, { useEffect } from "react";
import { View, Image, Dimensions, ScrollView } from "react-native";
import { default_image } from "../../../assets/png";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

export default function ArticleView({ props, data }) {
  const { t, i18n } = useTranslation();

  console.log(data);

  return (
    <View style={{ padding: 20 }}>
      {data && data.content.length ? (
        data.content.map((i, index) => {
          return (
            <View key={index} style={{}}>
              {i.type === "image" ? (
                <View>
                  {i.title ? (
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        marginVertical: 10,
                        // fontFamily: "Lato-Bold",
                      }}
                    >
                      {i.title}
                    </Text>
                  ) : null}
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      textAlign: "justify",
                      // fontFamily: "Lato-Regular",
                      // fontSize: 13,
                      color: "#464646",
                    }}
                  >
                    {i.text ? i.text : ""}
                  </Text>
                  <View style={{ alignItems: "center" }}>
                    <Image
                      source={i.image ? { uri: i.image } : default_image}
                      resizeMode={"cover"}
                      style={{
                        borderWidth: 0.4,
                        borderColor: "#d3d3d3",
                        marginVertical: 20,
                        height: Dimensions.get("screen").width * 0.4,
                        width: "100%",
                      }}
                    />
                  </View>
                </View>
              ) : (
                <View>
                  {i.title ? (
                    <Text
                      size="label"
                      type="bold"
                      style={{
                        marginVertical: 10,

                        // marginVertical: 10,

                        color: "#464646",
                      }}
                    >
                      {i.title}
                    </Text>
                  ) : null}
                  <Text
                    size="description"
                    type="regular"
                    style={{
                      textAlign: "justify",
                      // fontFamily: "Lato-Regular",
                      // fontSize: 13,
                      color: "#464646",
                    }}
                  >
                    {i.text ? i.text : ""}
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
              // fontSize: 18,
              color: "#464646",
            }}
          >
            {t("noArticle")}
          </Text>
        </View>
      )}
    </View>
  );
}
