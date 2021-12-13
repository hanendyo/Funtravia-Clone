import React, { useState, useEffect } from "react";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import {
  WhiteMascot,
  OnBoard_1,
  OnBoard_2,
  OnBoard_3,
  SlideSatu,
} from "../../assets/png/index";
import { Text, Button } from "../../component/index";
import { useTranslation } from "react-i18next";
import ImageSlider from "react-native-image-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OnBoardScreen(props) {
  const { t, i18n } = useTranslation();
  let { height, width } = Dimensions.get("screen");

  let dataImage = [
    {
      image: OnBoard_1,
      title: "Create and share\nyour travel plan\nwith ease.",
      description: t("description1"),
    },
    {
      image: OnBoard_2,
      title: "Travel with\nfriends.",
      description: t("description2"),
    },
    {
      image: OnBoard_3,
      title: "Travel goal\ndigger.",
      description: t("description3"),
    },
    {
      image: SlideSatu,
      title: "TRAVEL\nNEVER BEEN\nTHIS EASY.",
      description: t("description4"),
    },
  ];

  const isFirst = () => {
    AsyncStorage.setItem("isFirst", "false");
  };
  return (
    <ImageSlider
      listkey={"imagesliderjournal"}
      images={dataImage ? dataImage : []}
      style={{
        // borderTopLeftRadius: 5,
        // borderTopRightRadius: 5,
        backgroundColor: "#white",
      }}
      customSlide={({ index, item, style, width, move, position }) => (
        <View
          key={index}
          style={{
            backgroundColor: "#000",
          }}
        >
          <Image
            style={{
              // flex:1,
              height: height,
              width: width,
              resizeMode: "cover",
              backgroundColor: "#000",
              opacity: index === 3 ? 1 : 0.25,
            }}
            source={item.image}
          />

          {index === 3 ? (
            <View
              style={{
                position: "absolute",
                alignSelf: "flex-end",
                top: 50,
                right: 25,
                zIndex: 1,
              }}
            >
              <Button
                type="icon"
                position="right"
                size="small"
                style={{
                  flexDirection: "row",
                  backgroundColor: "#fff",
                  // opacity: 0.45,
                  borderRadius: 30,
                }}
                onPress={() => {
                  props.navigation.reset({
                    index: 0,
                    routes: [
                      {
                        name: "BottomStack",
                        routes: [{ name: "HomeScreen" }],
                      },
                    ],
                  });
                  isFirst();
                }}
              >
                <Text
                  size="description"
                  type="bold"
                  style={{
                    color: "#000",
                    // marginRight: 10,
                    justifyContent: "center",
                    marginBottom: 1,
                  }}
                >{`${t("skip")}`}</Text>
              </Button>
            </View>
          ) : null}

          <View
            style={{
              // flex: 1,
              height: height * 0.91,
              width: width,
              position: "absolute",
              justifyContent: "flex-end",
              borderColor: "#000",
              bottom: index === 3 ? 250 : 170,
            }}
          >
            <View style={{ paddingHorizontal: 14, width: width }}>
              <Text size="h4" type="bold" style={{ color: "#FFFF" }}>
                {item.title}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 15,
                width: width,
                marginTop: 20,
              }}
            >
              <Text
                size="label"
                type="regular"
                style={{ color: "#FFFF", lineHeight: 20 }}
              >
                {item.description}
                {/* {t("description")} */}
              </Text>
            </View>
          </View>
        </View>
      )}
      customButtons={(position, move) => (
        <View
          style={{
            position: "absolute",
            bottom: 50,
          }}
        >
          {position === 3 ? (
            <View style={{ marginBottom: 10 }}>
              <Button
                style={{
                  marginVertical: 10,
                  marginHorizontal: 15,
                }}
                size="medium"
                color="secondary"
                onPress={() => {
                  props.navigation.navigate("LoginScreen"), isFirst();
                }}
                // onPress={() =>
                //   position === 2
                //     ? props.navigation.navigate("AuthStack", {
                //         screen: "SplashScreen",
                //       })
                //     : move(position + 1)
                // }
                text={t("signIn")}
              />
              <Button
                style={{
                  marginVertical: 10,
                  marginHorizontal: 15,
                  backgroundColor: "#fff0",
                  borderColor: "white",
                  borderWidth: 1,
                }}
                size="medium"
                // color="secondary"
                onPress={() => {
                  props.navigation.navigate("RegisterScreen"), isFirst();
                }}
                text={t("createYourAccount")}
              />
            </View>
          ) : (
            <Button
              style={{
                marginVertical: 10,
                marginHorizontal: 15,
              }}
              size="medium"
              color="secondary"
              onPress={() =>
                position === 3
                  ? props.navigation.navigate("AuthStack", {
                      screen: "SplashScreen",
                    })
                  : move(position + 1)
              }
              text={t("next")}
            />
          )}

          <View
            style={{
              // position: "absolute",
              // paddingTop: 10,
              alignContent: "center",
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              width: width,
              marginTop: 30,
            }}
          >
            {(dataImage ? dataImage : []).map((image, index) => {
              return (
                <TouchableHighlight
                  key={index}
                  // underlayColor="#f7f7f700"
                >
                  <View
                    style={{
                      height: position === index ? 5 : 5,
                      width:
                        position === index ? width / 4 - 15 : width / 4 - 15,
                      borderRadius: position === index ? 7 : 3,
                      backgroundColor:
                        position === index ? "#D75995" : "#d3d3d3",
                      marginHorizontal: 3,
                    }}
                  ></View>
                </TouchableHighlight>
              );
            })}
          </View>
        </View>
      )}
    />
  );
}
