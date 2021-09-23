import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import { CustomImage, FloatingInput } from "../../../component";
import { lupass_dua, show_password, hide_password } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import { Peringatan } from "../../../component";
import FORGOT from "../../../graphQL/Mutation/Login/forgotverify";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackblack } from "../../../assets/svg";
import { Label } from "native-base";

export default function ResetPassword(props) {
  const { t, i18n } = useTranslation();
  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
          // borderWidth: 1,
          marginLeft: 15,
        }}
      >
        <Arrowbackblack height={20} width={20}></Arrowbackblack>
      </Button>
    ),
  };
  useEffect(() => {
    props.navigation.setOptions(NavigationComponent);
  }, []);

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  const [otp] = useState(props.route.params.otp);
  const [disable1, setDisable1] = useState("");
  const [disable2, setDisable2] = useState("");
  const [email] = useState(props.route.params.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [hidePasswd, setHidePasswd] = useState(true);
  const [hidePasswdCnfrm, setHidePasswdCnfrm] = useState(true);
  const [mutation, { loading, data, error }] = useMutation(FORGOT);

  const [errors, setErrors] = useState({
    password: false,
    confirmPassword: false,
  });

  const _HandlePass = (e) => {
    setPassword(e);
    if (e && e.length < 8) {
      setDisable1(e);
      return setErrors({ ...error, password: true });
    } else {
      setDisable1(e);
      return setErrors({ ...error, password: false });
    }
  };

  const _HandleConfPass = (e) => {
    setConfirmPassword(e);
    if (e !== password) {
      setDisable2(e);
      setErrors({ ...error, confirmPassword: true });
    } else {
      setDisable2(e);
      setErrors({ ...error, confirmPassword: false });
    }
  };

  const forgot = async () => {
    try {
      if (!password) {
        throw "Password Not Match!";
      }
      if (!confirmPassword) {
        throw "Password Not Match!";
      }
      if (password.length >= 8 && password !== confirmPassword) {
        throw "Password Not Match!";
      }

      await mutation({
        variables: {
          email: email,
          password: password,
          conf_password: confirmPassword,
          otp: parseInt(otp),
        },
      });

      if (error) throw "Failed Forgot Password";

      props.navigation.navigate("LoginScreen");
    } catch (err) {
      // console.log(err);
      showAlert({
        ...aler,
        show: true,
        judul: "Failed",
        detail: "" + err,
      });
      // Alert.alert('Failed', 'ERROR');
    }
  };

  const togglePassword = () => {
    setHidePasswd(!hidePasswd);
  };

  const togglePasswordConfirmation = () => {
    setHidePasswdCnfrm(!hidePasswdCnfrm);
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      // keyboardVerticalOffset={30}
      enabled
    >
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      <ScrollView
        style={{
          paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.main}>
          <View>
            <CustomImage
              customStyle={{
                alignSelf: "center",
                width: 200,
                height: 175,
              }}
              source={lupass_dua}
            />
            <View
              style={{
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Text size="h5" type="bold" style={{ textAlign: "center" }}>
                {t("PasswordReset")}
              </Text>
            </View>
            <View
              style={{
                alignContent: "center",
                justifyContent: "space-evenly",
              }}
            >
              <Text
                numberOfLines={2}
                size="small"
                type="regular"
                style={{
                  textAlign: "center",
                }}
              >
                {t("pleaseEnter")}
              </Text>
            </View>

            <View style={{ alignItems: "center", marginVertical: 25 }}>
              <View style={{ flexDirection: "row" }}>
                <FloatingInput
                  secureTextEntry={hidePasswd}
                  value={password}
                  onChangeText={(text) => _HandlePass(text)}
                  label={t("enterNew")}
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
              {errors["password"] === true ? (
                <Label style={{ marginTop: 5, alignSelf: "flex-start" }}>
                  <Text type="light" size="small" style={{ color: "#D75995" }}>
                    {t("inputWarningPassword")}
                  </Text>
                </Label>
              ) : null}
              <View style={{ flexDirection: "row" }}>
                <FloatingInput
                  secureTextEntry={hidePasswdCnfrm}
                  value={confirmPassword}
                  onChangeText={(text) => _HandleConfPass(text)}
                  label={t("reenterPass")}
                  customTextStyle={styles.inputTextStyle}
                  keyboardType="default"
                />
                <CustomImage
                  source={hidePasswdCnfrm ? show_password : hide_password}
                  isTouchable={true}
                  onPress={togglePasswordConfirmation}
                  customStyle={{
                    height: 25,
                    width: 25,
                    position: "absolute",
                    top: 25,
                    right: 0,
                  }}
                />
              </View>
              {errors["confirmPassword"] === true ? (
                <Label style={{ marginTop: 5, alignSelf: "flex-start" }}>
                  <Text type="light" size="small" style={{ color: "#D75995" }}>
                    {t("inputWarningRepeatPassword")}
                  </Text>
                </Label>
              ) : null}
            </View>
            <View
              style={{
                marginVertical: 25,
                marginBottom: 50,
              }}
            >
              <Button
                disabled={
                  disable1.length < 8 || disable2.length < 8 ? true : false
                }
                color={
                  disable1.length < 8 || disable2.length < 8
                    ? "tertiary"
                    : "secondary"
                }
                onPress={forgot}
                text={t("submit")}
                style={{ width: Dimensions.get("window").width / 1.2 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    margin: 50,
    alignItems: "center",
  },
  inputTextStyle: {
    width: Dimensions.get("window").width / 1.2,
    fontSize: 15,
    padding: 0,
  },
});
