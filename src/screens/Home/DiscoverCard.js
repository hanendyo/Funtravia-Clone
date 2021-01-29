import React from "react";
import {
  View,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  Travel_Ideas,
  Travel_Itinerary,
  Travel_Journal,
} from "../../assets/ilustration";
import { Text } from "../../component";

export default function DiscoverCard({ props }) {
  let discoverCardsData = [
    {
      id: 1,
      text: "Travel Ideas",
      background_image: Travel_Ideas,
    },
    {
      id: 2,
      text: "Itinerary",
      background_image: Travel_Itinerary,
    },
    {
      id: 3,
      text: "Travel Journal",
      background_image: Travel_Journal,
    },
  ];

  return (
    <View
      style={{
        marginHorizontal: 20,
        // width: "95%",
        // alignSelf: "center",
        marginTop: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        // borderWidth: 1,
      }}
    >
      <TouchableOpacity
        key={discoverCardsData[0].id}
        onPress={() =>
          props.navigation.navigate("TravelIdeaStack", {
            screen: "TravelIdeas",
          })
        }
      >
        <ImageBackground
          source={discoverCardsData[0].background_image}
          style={{
            height: 175,
            width: (Dimensions.get("screen").width - 55) / 3,
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
              paddingBottom: 20,
            }}
          >
            {discoverCardsData[0].text}
          </Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        key={discoverCardsData[1].id}
        onPress={() =>
          props.navigation.navigate("ItineraryStack", {
            screen: "ItineraryPopuler",
          })
        }
      >
        <ImageBackground
          source={discoverCardsData[1].background_image}
          style={{
            height: 175,
            width: (Dimensions.get("screen").width - 55) / 3,
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
              paddingBottom: 20,
            }}
          >
            {discoverCardsData[1].text}
          </Text>
        </ImageBackground>
      </TouchableOpacity>

      <TouchableOpacity
        key={discoverCardsData[2].id}
        onPress={() => props.navigation.navigate("Journal")}
      >
        <ImageBackground
          source={discoverCardsData[2].background_image}
          style={{
            height: 175,
            width: (Dimensions.get("screen").width - 55) / 3,
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
              paddingBottom: 20,
            }}
          >
            {discoverCardsData[2].text}
          </Text>
        </ImageBackground>
      </TouchableOpacity>
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
