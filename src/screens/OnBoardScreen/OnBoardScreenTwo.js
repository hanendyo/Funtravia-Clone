import React from "react";
import { Dimensions, View, Image } from "react-native";
import { OnBoard_3 } from "../../assets/png/index";
import { Arrowbackwhite, Xblue } from "../../assets/svg";
import { Text, FunImage, Button } from "../../component/index";
import { useTranslation } from "react-i18next";
import { StackActions } from "@react-navigation/routers";
import Modal from "react-native-modal";

export default function OnBoardScreenOne({
  modals,
  setModalScreenTwo,
  setModalScreenOne,
  props,
}) {
  // console.log("props:", props);
  const { t, i18n } = useTranslation();
  let { height, width } = Dimensions.get("screen");
  const lewat = async () => {
    props.navigation.navigate("AuthStack", {
      screen: "SplashScreen",
    });
    await setModalScreenTwo(false);
    await setModalScreenOne(false);
  };

  return (
    <Modal
      // onRequestClose={() => {
      // 	setModalScreenTwo(false);
      // }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      style={{
        justifyContent: "flex-end",
        alignItems: "center",
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignSelf: "flex-start",
            alignItems: "center",
            alignContent: "center",
            backgroundColor: "#000",
            height: height,
            width: Dimensions.get("screen").width,
            marginTop: Platform.OS === "ios" ? 20 : -20,
          }}
        >
          <Image
            style={{
              height: height,
              width: width,
              resizeMode: "cover",
              backgroundColor: "#000",
              opacity: 0.25,
            }}
            source={OnBoard_3}
          />
          <View
            style={{
              // flex: 1,
              height: height * 0.91,
              width: width,
              position: "absolute",
              justifyContent: "flex-end",
              borderColor: "#000",
            }}
          >
            <View style={{ paddingHorizontal: 14, width: width }}>
              <Text size="h4" type="bold" style={{ color: "#FFFF" }}>
                {`Travel goal\ndigger.	`}
              </Text>
            </View>
            <View
              style={{
                paddingHorizontal: 15,
                width: width,
                marginTop: 10,
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
            <View
              style={{ paddingHorizontal: 15, width: width, marginTop: 20 }}
            >
              <Button
                style={{
                  marginVertical: 10,
                }}
                size="medium"
                color="secondary"
                onPress={() => lewat()}
                text={t("next")}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 15,
                width: width,
                marginTop: 20,
                marginBottom: 90,
              }}
            >
              <View
                style={{ flexDirection: "row", justifyContent: "space-around" }}
              >
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFF",
                    width: "32%",
                  }}
                />
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#FFF",
                    width: "32%",
                  }}
                />
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#D75995",
                    width: "32%",
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
