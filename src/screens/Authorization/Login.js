import React, { useState, useEffect } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  mascot_black,
  logo_google,
  logo_facebook,
  show_password,
  hide_password,
} from "../../assets/png";
import LOG_IN from "../../graphQL/Mutation/Login/Login";
import { useTranslation } from "react-i18next";
import {
  Text,
  Button,
  FloatingInput,
  Peringatan,
  CustomImage,
} from "../../component";

export default function Login({ navigation }) {
  const { t } = useTranslation();
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  const [mutation, { loading, data, error }] = useMutation(LOG_IN);
  let [hidePasswd, setHidePasswd] = useState(true);

  const login = async () => {
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
          navigation.navigate("BottomStack");
        } catch (error) {
          showAlert({
            ...aler,
            show: true,
            judul: "Login Failed",
            detail: "can't save data",
          });
        }
      }
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "Login Failed",
        detail: "Check your Email/Password",
      });
    }
  };

  const signUp = () => {
    navigation.navigate("RegisterScreen");
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

  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
  };

  useEffect(() => {
    navigation.setOptions(NavigationComponent);
  }, []);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
    >
      <StatusBar backgroundColor="#14646E" />
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      <ScrollView
        style={[styles.main, { paddingTop: 40 }]}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View
          style={{
            alignItems: "center",
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
                {t("hello")}
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <FloatingInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                customTextStyle={styles.inputTextStyle}
                keyboardType="email-address"
                label="Email"
              />
              <View style={{ flexDirection: "row" }}>
                <FloatingInput
                  secureTextEntry={hidePasswd}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  label={t("password")}
                  customTextStyle={styles.inputTextStyle}
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
              </View>
            </View>
            <TouchableOpacity onPress={forgotPwd}>
              <Text style={styles.dividerText}>{`${t(
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
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: Dimensions.get("window").height,
  },
  dividerText: {
    fontSize: 14,
    fontFamily: "Lato-Regular",
    alignSelf: "flex-end",
    marginVertical: 10,
  },
  titleText: {
    alignSelf: "flex-start",
    marginVertical: 10,
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
    fontSize: 14,
    padding: 0,
  },
});
