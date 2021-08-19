import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
  BackHandler,
  Alert,
} from "react-native";
import { SlideSatu, SlideDua, SlideTiga, WhiteMascot } from "../../assets/png";
import { Xblue } from "../../assets/svg";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native-gesture-handler";

export default function SplashScreen(props) {
  const { height, width } = Dimensions.get("screen");
  const { t } = useTranslation();
  const imageCarousel = [SlideSatu, SlideDua, SlideTiga];
  var imageScroll = useRef();
  const STATUSBAR_HEIGHT = StatusBar.currentHeight;
  const APPBAR_HEIGHT = Platform.OS === "ios" ? 44 : 56;

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);

  const backAction = () => {
    BackHandler.exitApp();
  };
  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    };
  }, [backAction]);

  return (
    <View style={styles.main}>
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={imageScroll}
        horizontal={true}
        pagingEnabled={true}
        data={imageCarousel}
        renderItem={({ item }) => {
          return (
            <Image source={item} style={{ height: height, width: width }} />
          );
        }}
      />
      <View
        style={{
          position: "absolute",
        }}
      >
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
              // props.navigation.navigate("BottomStack", { screen: "HomeScreen" })
              props.navigation.reset({
                index: 0,
                routes: [
                  {
                    name: "BottomStack",
                    routes: [{ name: "HomeScreen" }],
                  },
                ],
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
        <View
          style={{
            height: Dimensions.get("screen").height,
            justifyContent: "center",
          }}
        >
          <View style={styles.secondary}>
            <Image source={WhiteMascot} style={styles.logoView} />
            <View style={styles.welcomeText}>
              <Text size="h4" style={{ color: "#FFFF" }}>
                {`TRAVEL\nNEVER BEEN\nTHIS EASY`}
              </Text>
            </View>
            <View style={styles.textParagraph}>
              <Text size="description" style={{ color: "#FFFF" }}>
                {t("description")}
              </Text>
            </View>
            <View style={{ justifyContent: "space-around" }}>
              <Button
                style={{
                  marginVertical: 5,
                  borderWidth: 1,
                  width: Dimensions.get("screen").width - 50,
                }}
                color="secondary"
                onPress={() => props.navigation.navigate("LoginScreen")}
                text={t("signIn")}
              />
              <Button
                style={{
                  marginVertical: 5,
                  marginBottom: 5,
                  backgroundColor: "#fff0",
                  borderColor: "white",
                  borderWidth: 1,
                  width: Dimensions.get("screen").width - 50,
                }}
                onPress={() => props.navigation.navigate("RegisterScreen")}
                text={t("createYourAccount")}
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: "black",
  },
  secondary: {
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  background: {
    flex: 1,
    justifyContent: "center",
    height: Dimensions.get("screen").height,
  },
  dividerText: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    alignSelf: "flex-end",
  },
  beforeSpecialText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    alignSelf: "center",
  },
  welcomeText: {
    alignSelf: "flex-start",
  },
  logoView: {
    height: 150,
    width: 150,
    alignSelf: "flex-start",
  },
  textParagraph: {
    marginTop: 5,
    marginBottom: 20,
  },
});
