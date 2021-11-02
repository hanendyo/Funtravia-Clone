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

export default function SettingEmailChange(props) {
  const Notch = DeviceInfo.hasNotch();
  let [token, setToken] = useState("");
  let { t } = useTranslation();
  let [setting, setSetting] = useState("");
  let [email1, setEmail1] = useState("");
  let [email2, setEmail2] = useState("");
  let ref1 = useRef();
  let ref2 = useRef();

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
        if (loadingEmail) {
          Alert.alert("Loading!!");
        }
        if (errorMutationEmail) {
          throw new Error("Email change failed");
        }
        if (response.data) {
          if (response.data.changemail.code !== 200) {
            throw new Error(response.data.changemail.message);
          }
          await props.navigation.navigate("SettingEmailVerify", {
            emailNew: newEmail,
            emailOld: oldEmail,
          });
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
      <Loading show={loadingEmail} />
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
              style={{
                fontSize: 14,
                width: "100%",
              }}
              ref={ref1}
              placeholder={t("currentEmail")}
              onChangeText={(text1) => setEmail1(text1)}
              onSubmitEditing={(text1) => setEmail1(text1)}
            ></TextInput>
          </View>
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
              style={{
                width: "100%",
                fontSize: 14,
              }}
              ref={ref2}
              onChangeText={(text2) => setEmail2(text2)}
              onSubmitEditing={(text2) => setEmail2(text2)}
              placeholder={t("newEmail")}
            ></TextInput>
          </View>
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
            color="secondary"
            text={t("save")}
            onPress={() => resultChangeEmail(email1, email2)}
            style={{ width: "100%" }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
