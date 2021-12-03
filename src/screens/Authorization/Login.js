import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
  StatusBar,
  Image,
  Alert,
  BackHandler,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  mascot_black,
  logo_google,
  logo_facebook,
  show_password,
  hide_password,
} from "../../assets/png";
import { Arrowbackblack, Arrowbackiosblack } from "../../assets/svg";
import LOG_IN from "../../graphQL/Mutation/Login/Login";
import { useTranslation } from "react-i18next";
import {
  Text,
  Button,
  FloatingInput,
  Peringatan,
  CustomImage,
  Errors,
} from "../../component";
import { Keyboard, KeyboardEvent } from "react-native";
import { StackActions } from "@react-navigation/native";
import normalize from "react-native-normalize";

export default function Login({ navigation, route }) {
  const { t } = useTranslation();
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [mutation, { loading, data, error }] = useMutation(LOG_IN);
  let [hidePasswd, setHidePasswd] = useState(true);
  let [modalError, setModalError] = useState(false);
  let [message, setMessage] = useState("");

  const login = async () => {
    if (email === "" || password === "") {
      setModalError(true);
      setLoginFailed(true);
      return setMessage(t("emailPasswordRequired"));
    }
    try {
      let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
      let response = await mutation({
        variables: { username: email, password: password, token: FCM_TOKEN },
      });
      if (response) {
        try {
          await AsyncStorage.setItem(
            "access_token",
            response.data.login.access_token
          );
          await AsyncStorage.setItem(
            "user",
            JSON.stringify(response.data.login.user)
          );
          await AsyncStorage.setItem(
            "setting",
            JSON.stringify(response.data.login.data_setting)
          );
          navigation.reset({
            index: 0,
            routes: [
              {
                name: "BottomStack",
                routes: [{ name: "HomeScreen" }],
              },
            ],
          });
        } catch (error) {
          showAlert({
            ...aler,
            show: true,
            judul: t("loginFaild"),
            detail: t("cantSaveData"),
          });
        }
      }
    } catch (err) {
      showAlert({
        ...aler,
        show: true,
        judul: t("loginFaild"),
        detail: t("PleaseCheckYourEmailorPassword"),
      });
    }
  };

  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const onKeyboardShow = (event) =>
    setKeyboardOffset(event.endCoordinates.height);
  const onKeyboardHide = () => setKeyboardOffset(0);
  const keyboardDidShowListener = useRef();
  const keyboardDidHideListener = useRef();
  const [itemValid, setItemValid] = useState({
    email: true,
    password: true,
  });

  const [loginFailed, setLoginFailed] = useState(false);

  const validation = (name, value) => {
    let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value || value === "") {
      return false;
    } else if (name === "email") {
      return value.match(emailRegex) ? true : false;
    } else {
      return true;
    }
  };

  const onChange = (name) => (text) => {
    let check = validation(name, text);
    if (name === "email") {
      setEmail(text.toLowerCase());
      setItemValid({ ...itemValid, email: check });
    }
  };

  useEffect(() => {
    keyboardDidShowListener.current = Keyboard.addListener(
      "keyboardWillShow",
      onKeyboardShow
    );
    keyboardDidHideListener.current = Keyboard.addListener(
      "keyboardWillHide",
      onKeyboardHide
    );

    return () => {
      keyboardDidShowListener.current.remove();
      keyboardDidHideListener.current.remove();
    };
  }, []);

  const signUp = () => {
    navigation.dispatch(StackActions.replace("RegisterScreen"));
    // navigation.dis("RegisterScreen");
  };

  const forgotPwd = () => {
    navigation.navigate("forgotpwd");
  };

  const externalLogIn = (index) => {
    navigation.navigate(index);
  };

  const togglePassword = () => {
    setHidePasswd(!hidePasswd);
  };

  const HeaderComponent = {
    headerShown: true,
    // title: "About",
    headerTransparent: true,
    // headerTintColor: "white",
    headerTitle: "",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
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
        onPress={() => navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackiosblack height={15} width={15}></Arrowbackiosblack>
        ) : (
          <Arrowbackblack height={20} width={20}></Arrowbackblack>
        )}
      </Button>
    ),
  };

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    AsyncStorage.setItem("isFirst", "false");
  }, []);

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [backAction]);

  useEffect(() => {
    navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    });
  }, [backAction]);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Peringatan
        aler={aler}
        setClose={() => showAlert({ ...aler, show: false })}
      />
      <ScrollView
        style={[styles.main, { paddingTop: 40 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View
          style={{
            alignItems: "center",
            bottom:
              Platform.OS === "ios" &&
              keyboardOffset < 300 &&
              keyboardOffset > 0
                ? 150
                : 0,
          }}
        >
          <View>
            <CustomImage
              source={mascot_black}
              customStyle={{
                height: 180,
                width: 180,
                alignSelf: "center",
              }}
            />

            <View style={styles.titleText}>
              <Text type="bold" size="h4">
                {`${t("hello")},`}
              </Text>
            </View>
            <View style={{ alignItems: "flex-start", marginBottom: 5 }}>
              <FloatingInput
                value={email}
                onChangeText={onChange("email")}
                customTextStyle={
                  loginFailed === true && email.length === 0
                    ? styles.inputTextStyleFailed
                    : styles.inputTextStyle
                }
                keyboardType="email-address"
                label="Email"
                autoCapitalize="none"
                onFocus={() => setLoginFailed(false)}
              />
              <View
                style={{
                  flexDirection: "row",
                  position: "absolute",
                  bottom: -15,
                }}
              >
                {loginFailed === true && email.length === 0 ? (
                  <Text
                    type="regular"
                    size="small"
                    style={{
                      color: "#D75995",
                      marginRight: 5,
                    }}
                  >
                    {t("emailRequired")}
                  </Text>
                ) : null}
                {itemValid.email === false ? (
                  <Text
                    type="regular"
                    size="small"
                    style={{
                      color: "#D75995",
                    }}
                  >
                    {t("sampleEmail")}
                  </Text>
                ) : null}
              </View>
            </View>
            <View>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <FloatingInput
                  secureTextEntry={hidePasswd}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  label={t("password")}
                  customTextStyle={
                    loginFailed === true && password.length === 0
                      ? styles.inputTextStyleFailed
                      : styles.inputTextStyle
                  }
                  keyboardType="default"
                />
                <CustomImage
                  source={hidePasswd ? show_password : hide_password}
                  isTouchable={true}
                  onPress={togglePassword}
                  customStyle={{
                    height: 25,
                    width: 25,
                    position: "absolute",
                    top: 25,
                    right: 0,
                  }}
                />
                {loginFailed === true && password.length === 0 ? (
                  <Text
                    type="regular"
                    size="small"
                    style={{
                      color: "#D75995",
                      position: "absolute",
                      bottom: -15,
                    }}
                  >
                    {t("passwordRequired")}
                  </Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity onPress={forgotPwd}>
              <Text size="description" style={styles.dividerText}>{`${t(
                "forgotPassword"
              )}?`}</Text>
            </TouchableOpacity>
            <Button
              style={{
                alignSelf: "center",
                width: Dimensions.get("window").width / 1.2,
                height: Dimensions.get("window").height / 15,
              }}
              color="secondary"
              onPress={login}
              text={t("signIn")}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 50,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                marginHorizontal: 10,
              }}
            ></View>
            <Text style={styles.dividerText}>{t("or")}</Text>
            <View
              style={{
                width: 50,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                marginHorizontal: 10,
              }}
            ></View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <CustomImage
              source={logo_google}
              isTouchable
              onPress={() => externalLogIn("LoginGoogleScreen")}
              customStyle={{
                marginHorizontal: 15,
                width: 50,
                height: 50,
              }}
            />
            <CustomImage
              source={logo_facebook}
              isTouchable
              onPress={() => externalLogIn("LoginFacebookScreen")}
              customStyle={{
                marginHorizontal: 15,
                width: 50,
                height: 50,
              }}
            />
          </View>
        </View>
        <View
          style={{
            width: "100%",
            marginBottom: 40,
            flexDirection: "row",
            justifyContent: "center",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              marginVertical: 20,
              marginHorizontal: 30,
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity onPress={signUp}>
              <Text style={styles.beforeSpecialText}>{t("dontHave")}</Text>
              <Text style={styles.specialTextButton}>{t("signUp")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <Errors
        modals={modalError}
        setModals={(e) => setModalError(e)}
        message={message}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: Dimensions.get("window").height,
  },
  dividerText: {
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  titleText: {
    alignSelf: "flex-start",
    marginVertical: 5,
  },
  beforeSpecialText: {
    fontSize: 14,
    fontFamily: "Lato-Regular",
    alignSelf: "center",
  },
  welcomeText: {
    height: 50,
    width: 300,
    alignSelf: "flex-start",
  },
  specialTextButton: {
    fontFamily: "Lato-Bold",
    marginLeft: 2,
    fontSize: 14,
    color: "#27958B",
    alignSelf: "center",
  },
  logoView: {
    height: 150,
    width: 200,
    alignSelf: "flex-start",
  },
  inputTextStyle: {
    width: Dimensions.get("window").width / 1.2,
    fontSize: normalize(14),
    padding: 0,
  },
  inputTextStyleFailed: {
    width: Dimensions.get("window").width / 1.2,
    fontSize: normalize(14),
    padding: 0,
    borderBottomColor: "#D75995",
  },
});
