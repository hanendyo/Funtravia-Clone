import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  ImageBackground,
  Image as ImageRN,
} from "react-native";
import { Text, Button } from "../../component";
import { AllPostWhite, CommentBlack } from "../../assets/svg";
const { width, height } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";
export default function RenderAlbum({ data, props }) {
  const [indexAktif, setIndexAktive] = useState(0);
  const { t } = useTranslation();
  const goToItinerary = () => {
    props.navigation.push("ItineraryStack", {
      screen: "itindetail",
      params: {
        itintitle: data.itinerary.name,
        country: data.itinerary.id,
        dateitin: "",
        token: token,
        status: "",
        index: 1,
      },
    });
  };
  return (
    <View
      style={{
        marginHorizontal: -10,
      }}
    >
      <ImageBackground
        style={{
          width: Dimensions.get("window").width - 40,
          height: Dimensions.get("window").width - 155,
          borderRadius: 15,
          alignSelf: "center",
          // height: Dimensions.get("window").width - 40,
        }}
        imageStyle={{
          borderRadius: 15,
        }}
        source={{ uri: data.assets[indexAktif].filepath }}
      >
        <View
          style={{
            position: "absolute",
            top: 15,
            left: 10,
            backgroundColor: "#040404",
            opacity: 0.8,
            paddingHorizontal: 15,
            borderRadius: 14,
            height: 28,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text
            type="bold"
            style={{
              color: "white",
              marginLeft: 5,
            }}
          >
            Travel Album {data.itinerary.city.name} {t("day")} {data.day.day}
          </Text>
        </View>
        <View
          style={{
            position: "absolute",
            top: 15,
            right: 10,
            backgroundColor: "#040404",
            opacity: 0.8,
            paddingHorizontal: 15,
            borderRadius: 14,
            height: 28,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <AllPostWhite width={13} height={13} />
          <Text
            type="bold"
            style={{
              color: "white",
              marginLeft: 5,
            }}
          >
            {data.assets.length}
          </Text>
        </View>
      </ImageBackground>
      <FlatList
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 10,
          marginVertical: 5,
        }}
        keyExtractor={(item) => item.id}
        data={data.assets}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setIndexAktive(index)}
            style={{
              marginRight: data.assets.length == index + 1 ? 0 : 5,
            }}
          >
            <ImageRN
              source={{ uri: item.filepath }}
              style={{
                width: 70,
                height: 70,
                borderRadius: 10,
                opacity: index == indexAktif ? 1 : 0.5,
              }}
            />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
