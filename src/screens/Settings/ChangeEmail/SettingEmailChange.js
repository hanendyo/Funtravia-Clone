import React, { useState, useEffect, useRef } from "react";
import { Arrowbackios, Arrowbackwhite, LogoEmail } from "../../../assets/svg";
import { Text, Button, Loading, Peringatan } from "../../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import changeEmail from "../../../graphQL/Mutation/Setting/changeEmail";
import { useMutation } from "@apollo/client";
import DeviceInfo from "react-native-device-info";
import { RNToasty } from "react-native-toasty";

export default function SettingEmailChange(props) {
  const Notch = DeviceInfo.hasNotch();
  let [token, setToken] = useState("");
  let { t } = useTranslation();
  let [setting, setSetting] = useState("");
  let [email1, setEmail1] = useState("");
  let [email2, setEmail2] = useState("");
  let ref1 = useRef();
  let ref2 = useRef();
  const [disable1, setDisable1] = useState("");
  const [disable2, setDisable2] = useState("");
  const [error, setError] = useState({
    emailError1: false,
    emailError2: false,
  });
  const handleError1 = (e) => {
    let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmail1(e);
    console.log("email 1", e.length);
    if (e.length > 0 && !e.match(emailRegex)) {
      setDisable1(e);
      return setError({ ...error, emailError1: true });
    } else {
      setDisable1(e);
      return setError({ ...error, emailError1: false });
    }
  };
  const handleError2 = (e, text1) => {
    let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmail2(e);
    if (e !== text1 && e.length > 0 && !e.match(emailRegex)) {
      setDisable2(e);
      setError({ ...error, emailError2: true });
    } else {
      setDisable2(e);
      setError({ ...error, emailError2: false });
    }
  };

  console.log("all error", error);

  const HeaderComponent = {
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("ChangeEmail")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeft: () => (
      <Button
        type="circle"
        size="small"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
    headerLeftContainerStyle: {
      paddingLeft: 10,
    },

    headerRight: () => {
      return null;
    },
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    await setToken(tkn);
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    mutationChangeEmail,
    { loading: loadingEmail, data: dataEmail, error: errorMutationEmail },
  ] = useMutation(changeEmail, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });

  const resultChangeEmail = async (oldEmail, newEmail) => {
    if (oldEmail == "" && newEmail == "") {
      return showAlert({
        ...aler,
        show: true,
        judul: t("canNotEmpty"),
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }
    if (setting.user.email === newEmail) {
      return showAlert({
        ...aler,
        show: true,
        judul: t("sameEmail"),
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }
    if (token || token !== "") {
      try {
        let response = await mutationChangeEmail({
          variables: {
            oldEmail: oldEmail,
            newEmail: newEmail,
          },
        });

        if (response.data) {
          if (response.data.changemail.code !== 200) {
            RNToasty.Show({
              title: t("failedChangeEmail"),
              position: "bottom",
            });
          } else {
            await props.navigation.navigate("SettingEmailVerify", {
              emailNew: newEmail,
              emailOld: oldEmail,
            });
          }
        }
      } catch (error) {
        showAlert({
          ...aler,
          show: true,
          judul: t("usedEmail"),
          // detail: "lorem ipsum lorem ipsum lorem ipsum",
        });
      }
    } else {
      showAlert({
        ...aler,
        show: true,
        judul: "failed",
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Notch ? 90 : 65}
      enabled
    >
      {/* <StatusBar backgroundColor="#14646E" /> */}
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      {/* <Loading show={loadingEmail} /> */}
      <ScrollView
        style={{
          backgroundColor: "white",
          height: "100%",
        }}
        contentContainerStyle={{
          height: Dimensions.get("screen").height * 0.8,
          paddingBottom: 20,
          justifyContent: "space-between",
          // borderWidth: 1
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: Dimensions.get("screen").width * 0.9,
            marginHorizontal: 20,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LogoEmail height={250} width={250} />
          <Text size="h4" type="bold" style={{ marginTop: -30 }}>
            {t("ChangeEmail") + " " + "?"}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              flexWrap: "wrap-reverse",
            }}
            size="label"
            type="regular"
          >
            {t("registerEmail")}
          </Text>
          <View
            style={{
              borderRadius: 3,
              height: Platform.OS == "ios" ? 50 : 45,
              backgroundColor: "#DAF0F2",
              borderWidth: 1,
              borderColor: "#209fae",
              width: "100%",
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: Platform.OS == "ios" ? 15 : null,
            }}
          >
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                fontSize: 14,
                width: "100%",
              }}
              ref={ref1}
              placeholder={t("currentEmail")}
              onChangeText={(e) => handleError1(e)}
              onSubmitEditing={(e) => handleError1(e)}
            ></TextInput>
          </View>
          {error["emailError1"] === true ? (
            <View
              style={{
                marginTop: 5,
                width: Dimensions.get("screen").width - 40,
                marginHorizontal: 20,
              }}
            >
              <Text type="light" size="small" style={{ color: "#D75995" }}>
                {t("sampleEmail")}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              borderRadius: 3,
              height: Platform.OS == "ios" ? 50 : 45,
              backgroundColor: "#DAF0F2",
              borderWidth: 1,
              borderColor: "#209fae",
              width: "100%",
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: Platform.OS == "ios" ? 15 : null,
            }}
          >
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                width: "100%",
                fontSize: 14,
              }}
              ref={ref2}
              onChangeText={(e) => handleError2(e)}
              onSubmitEditing={(e) => handleError2(e)}
              placeholder={t("newEmail")}
            ></TextInput>
          </View>
          {error["emailError2"] === true ? (
            <View
              style={{
                marginTop: 5,
                width: Dimensions.get("screen").width - 40,
                marginHorizontal: 20,
              }}
            >
              <Text type="light" size="small" style={{ color: "#D75995" }}>
                {t("sampleEmail")}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="box"
            size="large"
            disabled={
              disable1.length < 1 ||
              disable2.length == 0 ||
              error["emailError1"] == true ||
              error["emailError2"] == true
                ? true
                : false
            }
            color={
              disable1.length < 1 ||
              disable2.length == 0 ||
              error["emailError1"] == true ||
              error["emailError2"] == true
                ? "disabled"
                : "secondary"
            }
            text={t("save")}
            onPress={() => resultChangeEmail(email1, email2)}
            style={{ width: "100%" }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
