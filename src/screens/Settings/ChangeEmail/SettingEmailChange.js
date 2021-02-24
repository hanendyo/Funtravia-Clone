import React, { useState, useEffect, useRef } from "react";
import { Arrowbackwhite, LogoEmail } from "../../../assets/svg";
import { Text, Button, Loading } from "../../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, KeyboardAvoidingView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import changeEmail from "../../../graphQL/Mutation/Setting/changeEmail";
import { useMutation } from "@apollo/client";

export default function SettingEmailChange(props) {
  let [token, setToken] = useState("");
  let { t } = useTranslation();
  let [setting, setSetting] = useState("");
  let [email1, setEmail1] = useState("");
  let [email2, setEmail2] = useState("");
  let ref1 = useRef();
  let ref2 = useRef();

  const HeaderComponent = {
    headerTitle: t("ChangeEmail"),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 16,
      color: "white",
    },
    headerLeft: () => (
      <Button
        type="circle"
        size="small"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
      >
        <Arrowbackwhite height={20} width={20} />
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

  const resultChangeEmail = async (oldEmail, newEmail) => {
    if (setting.user.email === newEmail) {
      alert("Email lama dan email baru tidak boleh sama");
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
        alert("" + error);
      }
    } else {
      alert("Please Insert a Text");
    }
  };
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      enabled
    >
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
          <LogoEmail height={200} width={200} />
          <Text size="title" type="bold">
            {t("ChangeEmail") + " " + "?"}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              flexWrap: "wrap-reverse",
            }}
            size="description"
            type="regular"
          >
            {t("registerEmail")}
          </Text>
          <TextInput
            style={{
              marginVertical: 10,
              borderWidth: 1,
              borderColor: "#209FAE",
              backgroundColor: "#DAF0F2",
              width: "100%",
              borderRadius: 5,
              paddingHorizontal: 20,
              paddingVertical: 5,
            }}
            ref={ref1}
            placeholder={t("currentEmail")}
            onChangeText={(text1) => setEmail1(text1)}
          ></TextInput>
          <TextInput
            style={{
              marginVertical: 10,
              borderWidth: 1,
              width: "100%",
              borderRadius: 5,
              paddingHorizontal: 20,
              paddingVertical: 5,
            }}
            ref={ref2}
            onChangeText={(text2) => setEmail2(text2)}
            placeholder={t("newEmail")}
          ></TextInput>
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
            size="medium"
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
