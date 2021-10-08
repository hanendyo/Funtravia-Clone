import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { CustomImage, FloatingInput } from "../../../component";
import { lupass_satu } from "../../../assets/png";
import { Arrowbackblack, Arrowbackiosblack } from "../../../assets/svg";
import { Text, Button } from "../../../component";
import { useMutation } from "@apollo/react-hooks";
import { Peringatan } from "../../../component";
import FORGOT from "../../../graphQL/Mutation/Login/forgot";
import { useTranslation } from "react-i18next";

export default function ForgotPassword(props) {
  const NavigationComponent = {
    headerShown: true,
    headerTitle: "",
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
        {Platform.OS == "ios" ? (
          <Arrowbackiosblack height={15} width={15}></Arrowbackiosblack>
        ) : (
          <Arrowbackblack height={20} width={20}></Arrowbackblack>
        )}
      </Button>
    ),
  };
  useEffect(() => {
    props.navigation.setOptions(NavigationComponent);
  }, []);
  const { t, i18n } = useTranslation();

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [email, setEmail] = useState("");
  let [sendForgot] = useMutation(FORGOT);
  const requestForgot = async () => {
    try {
      let { data } = await sendForgot({ variables: { email: email } });
      props.navigation.navigate("otppass", {
        email: data.forgotPassword.email,
        resend: requestForgot,
      });
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "This email is not found",
        detail: "",
      });
    }
  };

  const Forgot = () => {
    var emailRegx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var data = email.match(emailRegx) ? true : false;

    if (data === true) {
      requestForgot();
    } else {
      showAlert({
        ...aler,
        show: true,
        judul: "Please enter a valid email address",
        detail: "",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "#fff",
        flexDirection: "column",
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
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
          }}
        >
          <CustomImage
            customStyle={{
              alignSelf: "center",
              width: 200,
              height: 175,
            }}
            source={lupass_satu}
          />
          <View
            style={{
              width: Dimensions.get("screen").width,
              // flexDirection: 'row',
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <Text type="bold" size="h5">
              {t("forgotPassword")}
            </Text>
            <View style={{ width: 220, marginTop: 5 }}>
              <Text
                numberOfLines={2}
                style={{
                  textAlign: "center",
                }}
                type="regular"
                size="description"
              >
                {t("enterEmailPassword")}
              </Text>
            </View>
            <View style={{ marginBottom: 20, marginTop: 20 }}>
              <FloatingInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                customTextStyle={styles.inputTextStyle}
                keyboardType="email-address"
                label="Email"
                autoCapitalize="none"
              />
            </View>
            <View
              style={{
                marginBottom: 80,
              }}
            >
              <Button
                onPress={() => Forgot()}
                text={t("submit")}
                color="secondary"
                style={{
                  width: Dimensions.get("window").width / 1.2,
                }}
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
    flex: 1,
    margin: 50,
    alignItems: "center",
  },
  inputTextStyle: {
    width: Dimensions.get("window").width / 1.2,
    fontSize: 14,
    padding: 0,
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
