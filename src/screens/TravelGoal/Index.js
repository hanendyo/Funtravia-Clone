import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, CustomImage, Text, Truncate } from "../../component";
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

export default function Wishlist(props) {
  const HeaderComponent = {
    headerShown: true,
    title: "Travel Goal",
    headerTransparent: false,
    headerTintColor: "white",
    headerTitle: "Travel Goal",
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
  const { t, i18n } = useTranslation();

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
  }, []);

  let data = [{}, {}, {}];

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: "#f6f6f6",
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      style={{
        flex: 1,
        // backgroundColor: "#fff",
        // padding: 20,
      }}
    >
      <View
        style={{
          padding: 20,
          // flex: 1,
        }}
      >
        <ImageBackground
          source={default_image}
          style={{
            shadowOpacity: 0.5,
            shadowColor: "#d3d3d3",
            elevation: 3,
            height: Dimensions.get("screen").width * 0.33,
            width: "100%",
            borderRadius: 5,
          }}
          imageStyle={{
            height: Dimensions.get("screen").width * 0.33,
            width: "100%",
            borderRadius: 5,
          }}
        >
          <Ripple
            style={{
              height: "100%",
              width: "100%",
              padding: 10,
              justifyContent: "flex-end",
              alignContent: "flex-start",
              alignItems: "flex-start",
              backgroundColor: "rgba(0,0,0,0.2)",
              borderRadius: 5,
            }}
            onPress={() => {
              props.navigation.push("TravelGoalDetail");
            }}
          >
            <View
              style={{
                backgroundColor: "#E2ECF8",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 20,
                marginVertical: 10,
                // borderWidth: 1,
              }}
            >
              <Text size="small" style={{ color: "#209fae" }}>
                Tips & Trick
              </Text>
            </View>
            <Text type={"bold"} size="small" style={{ color: "white" }}>
              Hiking Beginners Guide
            </Text>
            <Text size="small" style={{ color: "white" }}>
              <Truncate
                text="we are going to show you how beautiful this world we are going to
              show you how beautiful this world show you how beautiful this world"
                length={120}
              />
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Text type="light" size="small" style={{ color: "white" }}>
                12 min read{" "}
              </Text>
              <View
                style={{
                  width: 5,
                  height: 5,
                  marginTop: 3,
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
              ></View>
              <Text type="light" size="small" style={{ color: "white" }}>
                12 min read{" "}
              </Text>
            </View>
          </Ripple>
        </ImageBackground>
        {/* Popular */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "space-between",
            marginVertical: 10,
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                height: 20,
                marginRight: 5,
                width: 7,
                backgroundColor: "#209fae",
                borderRadius: 5,
              }}
            ></View>
            <Text type="bold" size="title">
              {t("PopularArticle")}
            </Text>
          </View>
          <View></View>
        </View>
        {data.map(({ item, index }) => {
          return (
            <Ripple
              onPress={() => {
                props.navigation.push("TravelGoalDetail");
              }}
              style={{
                shadowOpacity: 0.5,
                shadowColor: "#d3d3d3",
                elevation: 3,
                flexDirection: "row",
                width: "100%",
                backgroundColor: "#fff",
                borderRadius: 5,
                justifyContent: "flex-start",
                padding: 10,
                marginVertical: 5,
              }}
            >
              <Image
                source={default_image}
                style={{
                  height: (Dimensions.get("screen").width - 60) * 0.25,
                  width: (Dimensions.get("screen").width - 60) * 0.25,
                  borderRadius: 5,
                }}
              ></Image>
              <View
                style={{
                  paddingLeft: 10,
                  width: (Dimensions.get("screen").width - 60) * 0.75,
                  // borderWidth: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    justifyContent: "space-between",
                  }}
                >
                  <Text size="small">Island</Text>
                  <Text size="small">12 month ago</Text>
                </View>
                <Text size="small" type="bold">
                  Sunset in Bali
                </Text>
                <Text size="small">
                  <Truncate
                    text="we are going to show you how beautiful this world we are going to
              show you how beautiful this world"
                    length={80}
                  />
                </Text>
                <Text size="small" type="light" style={{ fontStyle: "italic" }}>
                  12 min read
                </Text>
              </View>
            </Ripple>
          );
        })}

        {/* New */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            justifyContent: "space-between",
            marginVertical: 10,
            marginTop: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <View
              style={{
                height: 20,
                marginRight: 5,
                width: 7,
                backgroundColor: "#209fae",
                borderRadius: 5,
              }}
            ></View>
            <Text type="bold" size="title">
              {t("NewArticle")}
            </Text>
          </View>
          <Text style={{ color: "#209fae" }}>{t("Seemore")}</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={{
          paddingStart: 20,
          paddingEnd: 10,
          paddingBottom: 20,
        }}
        horizontal
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        style={{}}
        data={[{}, {}, {}, {}]}
        renderItem={({ item }) => (
          <Ripple
            onPress={() => {
              props.navigation.push("TravelGoalDetail");
            }}
            style={{
              marginRight: 10,
              shadowOpacity: 0.5,
              shadowColor: "#d3d3d3",
              elevation: 3,
              backgroundColor: "#fff",
              width: (Dimensions.get("screen").width - 60) / 3,
              borderRadius: 5,
            }}
          >
            <Image
              source={default_image}
              style={{
                borderTopLeftRadius: 5,
                borderTopRightRadius: 5,
                width: (Dimensions.get("screen").width - 60) / 3,
                height: (Dimensions.get("screen").width - 60) / 3,
              }}
            ></Image>
            <View
              style={{
                width: "100%",
                padding: 10,
              }}
            >
              <Text type="regular" size="small">
                island
              </Text>
              <Text type="bold" size="small">
                <Truncate text="Sunset in Bali with friend" length={18} />
              </Text>
              <Text
                type="light"
                size="small"
                style={{
                  fontStyle: "italic",
                }}
              >
                12 min read
              </Text>
              <Text type="light" size="small">
                12 hour ago
              </Text>
            </View>
          </Ripple>
        )}
        // numColumns={2}
        keyExtractor={(item) => item.id}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({});
