import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { SlideSatu, SlideDua, SlideTiga, WhiteMascot } from "../../assets/png";
import { Xgray } from "../../assets/svg";
import { Text, Button } from "../../component";
import { useTranslation } from "react-i18next";
import { FlatList } from "react-native-gesture-handler";

export default function SplashScreen(props) {
  const { height, width } = Dimensions.get("screen");
  const { t } = useTranslation();
  const imageCarousel = [SlideSatu, SlideDua, SlideTiga];
  var imageScroll = useRef();
  let maxSlider = 2;
  let index = 0;

  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
    if (imageScroll.current) {
      setInterval(() => {
        let nextIndex = 0;
        if (index < maxSlider) {
          nextIndex = index + 1;
        }
        imageScroll.current.scrollToIndex({ animated: true, index: nextIndex });
        index = nextIndex;
      }, 3000);
    }
  }, []);

  return (
    <SafeAreaView style={styles.main}>
      <StatusBar backgroundColor="#14646E" />
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
            alignSelf: "flex-end",
            position: "absolute",
            top: 50,
            right: 30,
            zIndex: 2,
          }}
        >
          <Button
            type="circle"
            position="right"
            size="small"
            variant="bordered"
            color="tertiary"
            style={{
              width: 80,
              height: 28,
              flexDirection: "row",
            }}
            onPress={() =>
              props.navigation.navigate("BottomStack", { screen: "HomeScreen" })
            }
          >
            <Text
              style={{
                color: "white",
                marginRight: 5,
                justifyContent: "center",
                marginBottom: 1,
              }}
            >{`${t("skip")}`}</Text>
            <Xgray height={10} width={10} />
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
    </SafeAreaView>
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
