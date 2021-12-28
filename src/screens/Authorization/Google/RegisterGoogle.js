import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { google_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Googlegql from "../../../graphQL/Mutation/Register/Google";
import { Text, CustomImage, Errors } from "../../../component";
import { useTranslation } from "react-i18next";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import { loading_intertwine } from "../../../assets/gif";
import { setSettingUser, setTokenApps } from "../../../redux/action";
import { useDispatch } from "react-redux";

export default function RegisterGoogle({ navigation }) {
  let dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let [modalError, setModalError] = useState(false);
  let [message, setMessage] = useState("");
  const [mutation, { loading, data, error }] = useMutation(Googlegql);
  const signInWithGoogle = async () => {
    try {
      let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
      await GoogleSignin.configure({
        iosClientId:
          "292367084833-1kfl44kqitftu0bo1apg8924o0tgakst.apps.googleusercontent.com",
        offlineAccess: false,
      });
      let data = await GoogleSignin.getCurrentUser();
      if (data) {
        await GoogleSignin.revokeAccess();
      }

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

      if (response?.data === undefined || response?.data === "undefined") {
        setModalError(true);
        setMessage("Registration With Facebook is Failed");
        return setTimeout(() => {
          navigation.navigate("RegisterScreen");
        }, 3000);
      }

      if (
        response.data.register_google.code === "200" ||
        response.data.register_google.code === 200
      ) {
        await AsyncStorage.setItem(
          "access_token",
          response.data.register_google.access_token
        );
        dispatch(
          setTokenApps(`Bearer ${response.data.register_facebook.access_token}`)
        );

        await AsyncStorage.setItem(
          "setting",
          JSON.stringify(response.data.register_google.data_setting)
        );
        dispatch(setSettingUser(response.data.register_google.data_setting));
        navigation.reset({
          index: 0,
          routes: [
            {
              name: "BottomStack",
              routes: [{ name: "HomeScreen" }],
            },
          ],
        });
      } else if (
        (response.data.register_google.code === "400" ||
          response.data.register_google.code === 400) &&
        response.data.register_google.message === "Account Already Registered"
      ) {
        setModalError(true);
        setMessage(t("AccountRegister"));
        return setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 3000);
        // Alert.alert("Failed", "Account Already Registered");
        // navigation.navigate("LoginScreen");
      } else {
        setModalError(true);
        setMessage(t("RegisterGoogleFailed"));
        return setTimeout(() => {
          navigation.navigate("RegisterScreen");
        }, 3000);
        // Alert.alert("Registrasi With Google is Failed");
        // navigation.navigate("RegisterScreen");
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        setModalError(true);
        setMessage("Google sign in has been canceled");
        return setTimeout(() => {
          navigation.navigate("RegisterScreen");
        }, 3000);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        return setTimeout(() => {
          navigation.navigate("RegisterScreen");
        }, 20000);
      }
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
      setTimeout(() => {
        signInWithGoogle();
      }, 1000);
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
      <Errors
        modals={modalError}
        setModals={(e) => setModalError(e)}
        message={message}
      />
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
            <Image
              source={loading_intertwine}
              style={{ alignSelf: "center", width: 100, height: 100 }}
            />
          </View>
          <View
            style={{
              marginTop: 10,
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
