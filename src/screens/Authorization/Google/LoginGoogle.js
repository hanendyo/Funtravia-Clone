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
import { loading_intertwine } from "../../../assets/gif";
import { useMutation } from "@apollo/react-hooks";
import GoogleGraph from "../../../graphQL/Mutation/Login/Google";
import { useTranslation } from "react-i18next";
import { Text, CustomImage, Peringatan, Errors } from "../../../component";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-community/google-signin";
import { useDispatch } from "react-redux";
import { setSettingUser, setTokenApps } from "../../../redux/action";

export default function LoginGoogle({ navigation }) {
  let dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  let [modalError, setModalError] = useState(false);
  let [message, setMessage] = useState("");
  const [mutation, { loading, data, error }] = useMutation(GoogleGraph);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  const signInWithGoogle = async () => {
    try {
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
      let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");

      if (result) {
        response = await mutation({
          variables: {
            token: result.accessToken,
            pushtoken: FCM_TOKEN,
          },
        });
      }

      if (
        response.data.login_google.code === 200 ||
        response.data.login_google.code === "200"
      ) {
        await AsyncStorage.setItem(
          "access_token",
          response.data.login_google.access_token
        );
        dispatch(
          setTokenApps(`Bearer ${response.data.login_google.access_token}`)
        );

        await AsyncStorage.setItem(
          "user",
          JSON.stringify(response.data.login_google.user)
        );

        await AsyncStorage.setItem(
          "setting",
          JSON.stringify(response.data.login_google.data_setting)
        );
        dispatch(setSettingUser(response.data.login_google.data_setting));
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
        response.data.login_google.code === 400 ||
        response.data.login_google.code === "400"
      ) {
        // await GoogleSignin.revokeAccess();
        setModalError(true);
        setMessage(response.data.login_google.message);
        setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 5000);
      } else if (
        response.data.login_google.code === 401 ||
        response.data.login_google.code === "401"
      ) {
        // await GoogleSignin.revokeAccess();
        setModalError(true);
        setMessage(response.data.login_google.message);
        setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 5000);
      } else {
        // await GoogleSignin.revokeAccess();
        setModalError(true);
        setMessage("Login With Google is Failed");
        setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 5000);
      }
    } catch {
      if (error?.code === statusCodes.SIGN_IN_CANCELLED) {
        setModalError(true);
        setMessage("Google sign in has been canceled");
        return setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 3000);
      } else if (error?.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error?.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        setModalError(true);
        setMessage("Login With Google is Failed");
        setTimeout(() => {
          navigation.navigate("LoginScreen");
        }, 10000);
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
        <Peringatan
          aler={aler}
          setClose={() =>
            showAlert({ ...aler, show: false, judul: "", detail: "" })
          }
        />
        <View
          style={{
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
            <Text
              style={{ fontSize: 25, fontFamily: "Lato-Bold" }}
              type="bold"
              size="h5"
            >
              {t("loginUsingGoogle")}
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
              style={{
                textAlign: "center",
              }}
              type="regular"
              size="description"
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
