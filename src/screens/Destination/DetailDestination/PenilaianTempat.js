import React from "react";
import {
  View,
  // Text,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Truncate } from "../../../component";
import LinearGradient from "react-native-linear-gradient";
import { Container } from "native-base";
const dimensions = Dimensions.get("window");
const barWidth = dimensions.width - 60;
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
export default function PenilaianTempat({ tittle, data }) {
  const { t, i18n } = useTranslation();

  return (
    <View style={{ marginBottom: 10 }}>
      <LinearGradient
        colors={["rgba(032, 159, 174,0.8)", "rgb(255, 255, 255)"]}
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: barWidth,
          marginLeft: 5,
          marginBottom: 10,
        }}
      >
        <Text
          size="title"
          type="bold"
          style={{
            // fontSize: (18),
            marginVertical: 10,
            paddingLeft: 20,
            // fontFamily: 'lato-bold',
            color: "#FFFFFF",
          }}
        >
          {tittle}
        </Text>
      </LinearGradient>
      <Container
        style={{
          flex: 1,
          paddingHorizontal: 5,
          height: 110,
        }}
      >
        <ScrollView
          horizontal
          nestedScrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {data && data.length
            ? data.map((i, index) => {
                return (
                  <View
                    key={index}
                    style={{
                      marginVertical: 5,
                      marginRight: 5,
                      height: 100,
                      width: 250,
                      backgroundColor: "#f6f6f6",
                      borderRadius: 10,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        height: 20,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          paddingHorizontal: 5,
                          color: "#464646",
                          fontFamily: "lato-bold",
                          position: "absolute",
                          margin: 10,
                          left: 0,
                        }}
                      >
                        {i.username}
                      </Text>
                      <Text
                        type="bold"
                        size="small"
                        style={{
                          // fontSize: (12),
                          paddingHorizontal: 5,
                          color: "#209FAE",
                          // fontFamily: 'lato-bold',
                          position: "absolute",
                          margin: 10,
                          right: 15,
                        }}
                      >
                        {i.rating + "/5"}
                      </Text>
                    </View>
                    <Text
                      type="regular"
                      size="small"
                      style={{
                        // fontSize: (12),
                        paddingHorizontal: 5,
                        color: "#464646",
                        // fontFamily: 'lato-reg',
                        textAlign: "justify",
                        position: "absolute",
                        margin: 10,
                        top: 20,
                      }}
                    >
                      <Truncate text={i.review} length={150} />
                    </Text>
                  </View>
                );
              })
            : null}
        </ScrollView>
      </Container>
      <TouchableOpacity>
        <Text
          size="title"
          type="bold"
          style={{
            // fontSize: (18),
            marginVertical: 10,
            // fontFamily: 'lato-bold',
            color: "#209FAE",
            marginHorizontal: 20,
          }}
        >
          {`${t("seeMoreReview")} >`}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
