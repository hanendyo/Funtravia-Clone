import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { google_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Googlegql from "../../../graphQL/Mutation/Register/Google";
import { Text, CustomImage } from "../../../component";
import { useTranslation } from "react-i18next";
import { GoogleSignin } from "@react-native-community/google-signin";

export default function RegisterGoogle({ navigation }) {
  const { t, i18n } = useTranslation();

  const [mutation, { loading, data, error }] = useMutation(Googlegql);
  const signInWithGoogle = async () => {
    let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
    await GoogleSignin.configure({
      iosClientId:
        "292367084833-1kfl44kqitftu0bo1apg8924o0tgakst.apps.googleusercontent.com",
      offlineAccess: false,
    });
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const result = await GoogleSignin.getTokens();

    let response;
    if (result) {
      response = await mutation({
        variables: {
          token: result.accessToken,
          notify: FCM_TOKEN,
        },
      });
    }
    if (
      response.data.register_google.code === "200" ||
      response.data.register_google.code === 200
    ) {
      await AsyncStorage.setItem(
        "access_token",
        response.data.register_google.access_token
      );
      await AsyncStorage.setItem(
        "setting",
        JSON.stringify(response.data.register_google.data_setting)
      );
      navigation.navigate("BottomStack", { screen: "HomeScreen" });
    } else if (
      (response.data.register_google.code === "400" ||
        response.data.register_google.code === 400) &&
      response.data.register_google.message === "Account Already Registered"
    ) {
      Alert.alert("Failed", "Account Already Registered");
      navigation.navigate("LoginScreen");
    } else {
      Alert.alert("Failed", "Failed to Registrasi With Google");
      navigation.navigate("RegisterScreen");
    }
  };

  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
  };

  useEffect(() => {
    navigation.setOptions(NavigationComponent);
    navigation.addListener("focus", () => {
      signInWithGoogle();
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      // keyboardVerticalOffset={30}
      enabled
    >
      <ScrollView
        style={{
          paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomImage
            customStyle={{
              alignSelf: "center",
              width: 200,
              height: 175,
            }}
            source={google_vektor}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-evenly",
              marginVertical: 10,
            }}
          >
            <Text size="h5" type="bold">
              {t("registerUsingGoogle")}
            </Text>
          </View>
          <View
            style={{
              alignContent: "center",
              justifyContent: "space-evenly",
              marginVertical: 10,
            }}
          >
            <Text
              numberOfLines={2}
              type="regular"
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              {t("pleaseWait")}
            </Text>
            <Text
              numberOfLines={2}
              type="regular"
              size="small"
              style={{
                textAlign: "center",
              }}
            >
              {/* Click next to continue */}
            </Text>
          </View>
          <View
            style={{
              marginTop: 40,
              marginBottom: 80,
              alignItems: "center",
            }}
          >
            <Text>{`${t("loading")}...`}</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 50,
    alignItems: "center",
  },
  inputTextStyle: {
    width: Dimensions.get("window").width / 1.2,
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#D75995",
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
