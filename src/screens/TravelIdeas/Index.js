import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Text } from "../../component";
import { travel_idea_ilust } from "../../assets/png";
import { Right, Unesco, Movie } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";

export default function TravelIdeas(props) {
  const { t } = useTranslation();

  const HeaderComponent = {
    headerShown: true,
    title: "Travel Ideas",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Ideas",
    headerMode: "none",
    headerStyle: {
      backgroundColor: "#209FAE",
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
      </Button>
    ),
  };
  const { width, height } = Dimensions.get("screen");
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    loadAsync();
  }, []);

  const [token, setToken] = useState();
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
  };

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          // borderWidth: 1,
        }}
      >
        <View
          style={{
            width: width,
            height: width - 220,
            paddingTop: 15,
            backgroundColor: "#209fae",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <View
          style={{
            width: width + 100,
            height: 150,
            backgroundColor: "#209fae",
            borderBottomRightRadius: 200,
            borderBottomLeftRadius: 200,
            justifyContent: "center",
            alignItems: "center",
          }}
        />
        <View
          style={{
            // marginTop: 10,
            width: width - 40,
            // height: 430,
            padding: 30,
            paddingTop: 50,
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            position: "absolute",
            // bottom: -80,
            top: 2,
            // justifyContent: "center",
            alignItems: "center",
            // borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 1,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2.84,
            elevation: 3,
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text size="title" style={{}}>
              {t("Discover")}
            </Text>
            <Text size="title" type="bold">
              {t("BestTravelIdea")}
            </Text>
          </View>
          <Image
            source={travel_idea_ilust}
            style={{
              width: width - 130,
              height: width - 130,
            }}
            resizeMode="contain"
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 100,
          // height: height,
        }}
      >
        <Text size="label" type="bold" style={{ marginBottom: 15 }}>
          {t("LetsGovisit")}
        </Text>

        <Pressable
          onPress={() => {
            props.navigation.navigate("TravelIdeaStack", {
              screen: "Unesco",
              params: {
                token: token,
              },
            });
          }}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#F6F6F7" : "white",
              borderColor: "#DFDFDF",
              borderRadius: 5,
              width: width - 40,
              marginVertical: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              shadowColor: "#464646",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2.84,
              elevation: 2,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                borderRadius: 25,
                height: 50,
                width: 50,
                marginRight: 15,
                backgroundColor: "#209fae",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Unesco width={35} height={35} />
            </View>
            <View>
              <Text type="bold" size="label">
                Unesco World Heritage
              </Text>
              <Text>Must visit destination</Text>
            </View>
          </View>

          <Right width={25} height={25} />
        </Pressable>

        <Pressable
          onPress={() => {
            // props.navigation.dispatch(StackActions.replace("Unesco"));
            props.navigation.navigate("TravelIdeaStack", {
              screen: "MovieLocation",
              params: {
                token: token,
              },
            });
          }}
          style={({ pressed }) => [
            {
              borderColor: "#DFDFDF",
              borderRadius: 5,
              width: width - 40,
              marginVertical: 10,
              paddingVertical: 10,
              paddingHorizontal: 20,
              shadowColor: "#464646",
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.25,
              shadowRadius: 2.84,
              elevation: 2,
              backgroundColor: pressed ? "#F6F6F7" : "white",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "90%",
            }}
          >
            <View
              style={{
                borderRadius: 25,
                height: 50,
                width: 50,
                marginRight: 15,
                backgroundColor: "#209fae",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Movie width={25} height={25} />
            </View>
            <View
              style={{
                width: "75%",
              }}
            >
              <Text type="bold" size="label">
                Filming Location
              </Text>
              <Text>Pick some places you are interested in</Text>
            </View>
          </View>

          <Right width={25} height={25} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
