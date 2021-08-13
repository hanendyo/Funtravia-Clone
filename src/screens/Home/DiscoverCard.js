import React, { useState } from "react";
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
import { Text, Button } from "../../component";

const { width, height } = Dimensions.get("screen");
export default function DiscoverCard({ props, token }) {
  let { t, i18n } = useTranslation();
  let [modalLogin, setModalLogin] = useState(false);

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
      <Modal
        useNativeDriver={true}
        visible={modalLogin}
        onRequestClose={() => true}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setModalLogin(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 80,
            marginHorizontal: 40,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 3,
            marginTop: Dimensions.get("screen").height / 4,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 80,
              padding: 20,
              paddingHorizontal: 20,
            }}
          >
            <View
              style={{
                alignItems: "center",
                marginHorizontal: 5,
                marginBottom: 10,
              }}
            >
              <Text style={{ marginBottom: 5 }} size="label" type="bold">
                {t("nextLogin")}
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 18 }}
                size="label"
                type="regular"
              >
                {t("textLogin")}
              </Text>
            </View>
            <Button
              style={{ marginBottom: 5 }}
              onPress={() => {
                setModalLogin(false);
                props.navigation.push("AuthStack", {
                  screen: "LoginScreen",
                });
              }}
              type="icon"
              text={t("signin")}
            ></Button>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginVertical: 5,
              }}
            >
              <View
                style={{
                  width: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                  marginHorizontal: 10,
                }}
              ></View>
              <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                {t("or")}
              </Text>
              <View
                style={{
                  width: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                  marginHorizontal: 10,
                }}
              ></View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                size="label"
                type="bold"
                style={{ color: "#209FAE" }}
                onPress={() => {
                  setModalLogin(false);
                  props.navigation.push("AuthStack", {
                    screen: "RegisterScreen",
                  });
                }}
              >
                {t("createAkunLogin")}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      <Pressable
        key={discoverCardsData[0].id}
        onPress={() => {
          if (token && token !== "" && token !== null) {
            props.navigation.navigate("TravelIdeaStack", {
              screen: "TravelIdeas",
            });
          } else {
            setModalLogin(true);
          }
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
            }}
          >
            {discoverCardsData[0].text}
          </Text>
        </ImageBackground>
      </Pressable>

      <Pressable
        key={discoverCardsData[1].id}
        onPress={() => {
          if (token && token !== "" && token !== null) {
            props.navigation.navigate("ItineraryStack", {
              screen: "ItineraryPopuler",
              params: { token: token },
            });
          } else {
            setModalLogin(true);
          }
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
            }}
          >
            {discoverCardsData[1].text}
          </Text>
        </ImageBackground>
      </Pressable>
      <Pressable
        key={discoverCardsData[2].id}
        onPress={() => {
          if (token && token !== "" && token !== null) {
            props.navigation.navigate("JournalStackNavigation", {
              screen: "Journal",
            });
          } else {
            setModalLogin(true);
          }
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
