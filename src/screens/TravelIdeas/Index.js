import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  BackHandler,
  Pressable,
  StatusBar,
} from "react-native";
import { Button, Text } from "../../component";
import { travel_idea_ilust } from "../../assets/png";
import { Right, Unesco, Movie, Arrowbackios } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";
import { useSelector } from "react-redux";

export default function TravelIdeas(props) {
  const { t } = useTranslation();
  let tokenApps = useSelector((data) => data.token);
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>
        {t("travelideas")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      marginLeft: Platform.OS == "ios" ? null : -15,
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
      marginTop: Platform.OS == "ios" ? 0 : -5,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => {
          props.navigation.goBack();
        }}
        style={{
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };
  const { width, height } = Dimensions.get("screen");
  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  // const backAction = () => {
  //   props?.route?.params?.from == "movie_location"
  //     ? props.navigation.reset({
  //         index: 0,
  //         routes: [
  //           {
  //             name: "BottomStack",
  //             routes: [{ name: "HomeScreen" }],
  //           },
  //         ],
  //       })
  //     : props.navigation.goBack();
  //   return true;
  // };

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", backAction);
  //   return () =>
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  // }, [backAction]);

  // useEffect(() => {
  //   props.navigation.addListener("blur", () => {
  //     BackHandler.removeEventListener("hardwareBackPress", backAction);
  //   });
  // }, [backAction]);

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
      showsVerticalScrollIndicator={false}
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
            paddingTop: 40,
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
              {t("DiscoverThe")}
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
                token: tokenApps,
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
              flex: 1,
              marginRight: 10,
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
            <View style={{ flex: 1 }}>
              <Text type="bold" size="label" numberOfLines={1}>
                {t("unescoWorldHeritage")}
              </Text>
              <Text type="regular" size="description" numberOfLines={2}>
                {t("subUnescoIndex")}
              </Text>
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
                token: tokenApps,
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
              flex: 1,
              marginRight: 10,
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
                flex: 1,
              }}
            >
              <Text type="bold" size="label" numberOfLines={1}>
                {t("MovieLocation")}
              </Text>
              <Text type="regular" size="description" numberOfLines={2}>
                {t("subFilmingLocationIndex")}
              </Text>
            </View>
          </View>

          <Right width={25} height={25} />
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
