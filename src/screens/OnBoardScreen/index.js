import React, { useState } from "react";
import {
  Dimensions,
  View,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import {
  SlideSatu,
  WhiteMascot,
  OnBoard_1,
  OnBoard_2,
  OnBoard_3,
} from "../../assets/png/index";
import { Sampul, Xblue } from "../../assets/svg";
import { Text, FunImage, Button } from "../../component/index";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/routers";
import ScreenOne from "./OnBoardScreenOne";
import ImageSlider from "react-native-image-slider";

export default function OnBoardScreen(props) {
  const { t, i18n } = useTranslation();
  let { height, width } = Dimensions.get("screen");
  let [modalScreenOne, setModalScreenOne] = useState(false);

  let dataImage = [
    {
      image: OnBoard_1,
      title: "Create and share\nyour travel plan\nwith ease.",
      description: null,
    },
    { image: OnBoard_2, title: "Travel with\nfriends.", description: null },
    { image: OnBoard_3, title: "Travel goal\ndigger.", description: null },
  ];
  return (
    <ImageSlider
      listkey={"imagesliderjournal"}
      images={dataImage ? dataImage : []}
      style={{
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        backgroundColor: "#white",
      }}
      customSlide={({ index, item, style, width, move, position }) => (
        <View style={{ backgroundColor: "#000" }}>
          <Image
            style={{
              height: height * 0.92,
              width: width,
              resizeMode: "cover",
              backgroundColor: "#000",
              opacity: 0.25,
            }}
            source={item.image}
          />
          {index === 2 ? null : (
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
                  backgroundColor: "#D1D1D1",
                  opacity: 0.45,
                  borderRadius: 30,
                }}
                onPress={() =>
                  props.navigation.navigate("AuthStack", {
                    screen: "SplashScreen",
                  })
                }
              >
                <Text
                  size="description"
                  type="bold"
                  style={{
                    color: "white",
                    // marginRight: 10,
                    justifyContent: "center",
                    marginBottom: 1,
                  }}
                >{`${t("skip")}`}</Text>
              </Button>
            </View>
          )}
          <View
            style={{
              // flex: 1,
              height: height * 0.91,
              width: width,
              position: "absolute",
              justifyContent: "flex-end",
              borderColor: "#000",
              bottom: 175,
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
                {t("description")}
              </Text>
            </View>
          </View>
          <ScreenOne
            modals={modalScreenOne}
            setModalScreenOne={() => setModalScreenOne()}
            props={props}
          />
        </View>
      )}
      customButtons={(position, move) => (
        <View
          style={{
            position: "absolute",
            bottom: 50,
          }}
        >
          <Button
            style={{
              marginVertical: 10,
              marginHorizontal: 15,
            }}
            size="medium"
            color="secondary"
            onPress={() =>
              position === 2
                ? props.navigation.navigate("AuthStack", {
                    screen: "SplashScreen",
                  })
                : move(position + 1)
            }
            text={t("next")}
          />

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
                  key={"keys" + index}
                  // underlayColor="#f7f7f700"
                >
                  <View
                    style={{
                      height: position === index ? 5 : 5,
                      width:
                        position === index ? width / 3 - 15 : width / 3 - 15,
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
