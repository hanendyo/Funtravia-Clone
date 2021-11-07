import React from "react";
import { useTranslation } from "react-i18next";
import {
  View,
  ImageBackground,
  Dimensions,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import {
  Travel_Ideas,
  Travel_Itinerary,
  Travel_Journal,
} from "../../assets/ilustration";
import { Text } from "../../component";

const { width, height } = Dimensions.get("screen");
export default function DiscoverCard({ props, token }) {
  let { t, i18n } = useTranslation();

  let discoverCardsData = [
    {
      id: 1,
      text: t("travelideas"),
      background_image: Travel_Ideas,
    },
    {
      id: 2,
      text: "Itinerary",
      background_image: Travel_Itinerary,
    },
    {
      id: 3,
      text: t("traveljournal"),
      background_image: Travel_Journal,
    },
  ];

  return (
    <View
      style={{
        marginHorizontal: 20,
        marginTop: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        shadowColor: "#464646",
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 0.5,
        shadowOpacity: 0.5,
        elevation: 2,
      }}
    >
      <Pressable
        key={discoverCardsData[0].id}
        onPress={() => {
          props.navigation.navigate("TravelIdeaStack", {
            screen: "TravelIdeas",
          });
        }}
      >
        <ImageBackground
          source={discoverCardsData[0].background_image}
          style={{
            height: (width + 100) / 3,
            width: (width - 55) / 3,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          imageStyle={{ borderRadius: 5 }}
          resizeMode="cover"
        >
          <Text
            size="label"
            type="bold"
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              paddingBottom: 15,
              letterSpacing: 0.4,
            }}
          >
            {discoverCardsData[0].text}
          </Text>
        </ImageBackground>
      </Pressable>

      <Pressable
        key={discoverCardsData[1].id}
        onPress={() => {
          props.navigation.navigate("ItineraryStack", {
            screen: "ItineraryPopuler",
            params: { token: token },
          });
        }}
      >
        <ImageBackground
          source={discoverCardsData[1].background_image}
          style={{
            height: (width + 100) / 3,
            width: (width - 55) / 3,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          imageStyle={{ borderRadius: 5 }}
          resizeMode="cover"
        >
          <Text
            size="label"
            type="bold"
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              paddingBottom: 15,
              letterSpacing: 0.4,
            }}
          >
            {discoverCardsData[1].text}
          </Text>
        </ImageBackground>
      </Pressable>
      <Pressable
        key={discoverCardsData[2].id}
        onPress={() => {
          props.navigation.navigate("JournalStackNavigation", {
            screen: "Journal",
          });
        }}
      >
        <ImageBackground
          source={discoverCardsData[2].background_image}
          style={{
            height: (width + 100) / 3,
            width: (width - 55) / 3,
            borderRadius: 5,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
          imageStyle={{ borderRadius: 5 }}
          resizeMode="cover"
        >
          <Text
            size="label"
            type="bold"
            style={{
              color: "#FFFFFF",
              textAlign: "center",
              paddingBottom: 15,
              letterSpacing: 0.4,
            }}
          >
            {discoverCardsData[2].text}
          </Text>
        </ImageBackground>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  destinationMainImageContainer: {
    width: "100%",
    height: 150,
    borderRadius: 10,
  },
  destinationMainImage: {
    resizeMode: "cover",
    borderRadius: 10,
    backgroundColor: "black",
  },
  destinationImage: {
    resizeMode: "cover",
    borderRadius: 10,
  },
});
