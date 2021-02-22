import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import { StackActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../component";
import { travel_idea_ilust } from "../../assets/png";
import { Right, Unesco, Movie } from "../../assets/svg";
import { default_image } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Loading } from "../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../assets/svg";
import { Image } from "react-native";
import { ImageBackground } from "react-native";
import { ScrollView } from "react-native";
import { FlatList } from "react-native";
import Ripple from "react-native-material-ripple";

export default function TravelIdeas(props) {
  const { t } = useTranslation();

  const HeaderComponent = {
    headerShown: true,
    title: "Travel Ideas",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Ideas",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
  // console.log(token);
  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    setToken(tkn);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: width,
            height: 200,
            backgroundColor: "#209fae",
            // borderBottomRightRadius: width / 5.5,
            // borderBottomLeftRadius: width / 5.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        ></View>
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
        ></View>
        <View
          style={{
            marginTop: 10,
            width: width - 40,
            height: 430,
            padding: 30,
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            position: "absolute",
            bottom: -80,
            // justifyContent: "center",
            alignItems: "center",
            // borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
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
            }}
          >
            <Text size="h5" style={{}}>
              {t("Discover")}
            </Text>
            <Text size="h5" type="bold">
              {t("BestTravelIdea")}
            </Text>
          </View>
          <Image
            source={travel_idea_ilust}
            style={{
              width: width - 90,
              height: width - 90,
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
        }}
      >
        <Text size="label" type="bold" style={{ marginBottom: 15 }}>
          {t("LetsGovisit")}
        </Text>
        <Ripple
          onPress={() => {
            props.navigation.navigate("TravelIdeaStack", {
              screen: "Unesco",
              params: {
                token: token,
              },
            });
          }}
          style={{
            borderWidth: 1,
            borderColor: "#DFDFDF",
            borderRadius: 5,
            width: width - 40,
            marginVertical: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            shadowColor: "#DFDFDF",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2.84,
            elevation: 3,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
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
        </Ripple>
        <Ripple
          onPress={() => {
            // props.navigation.dispatch(StackActions.replace("Unesco"));
            props.navigation.navigate("TravelIdeaStack", {
              screen: "MovieLocation",
              params: {
                token: token,
              },
            });
          }}
          style={{
            borderWidth: 1,
            borderColor: "#DFDFDF",
            borderRadius: 5,
            width: width - 40,
            marginVertical: 10,
            paddingVertical: 10,
            paddingHorizontal: 20,
            shadowColor: "#DFDFDF",
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.25,
            shadowRadius: 2.84,
            elevation: 3,
            backgroundColor: "#FFFFFF",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
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
              <Movie width={25} height={25} />
            </View>
            <View>
              <Text type="bold" size="label">
                Filming Location
              </Text>
              <Text>Pick some locations you are interested in</Text>
            </View>
          </View>

          <Right width={25} height={25} />
        </Ripple>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
