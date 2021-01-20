import React, { useState, useEffect } from "react";

import {
  Alert,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { CustomImage, FloatingInput } from "../../../component";
import { phone_vektor } from "../../../assets/png";
import { Peringatan } from "../../../component";
import { PhoneCodeSelector } from "../../../component";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

export default function LoginPhone(props) {
  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
  };
  useEffect(() => {
    props.navigation.setOptions(NavigationComponent);
  }, []);
  const { t, i18n } = useTranslation();

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [region, setRegion] = useState("+62");
  let [number, setNumber] = useState("");
  let [selector, setSelector] = useState(false);

  if (props.navigation.getParam("error")) {
    Alert.alert("Failed", props.navigation.getParam("error"));
  }

  const requestNumber = () => {
    if (!number || number === "") {
      showAlert({
        ...aler,
        show: true,
        judul: "Login Failed",
        detail: "Check your Number",
      });
      return false;
    }
    props.navigation.navigate("ConfirmNumberLogin", {
      region: region,
      number: number,
    });
  };
  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
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
            source={phone_vektor}
          />
          <View
            style={{
              width: Dimensions.get("window").width / 1.2,
              flexDirection: "row",
              alignContent: "flex-start",
            }}
          >
            <Text type="bold" size="h4">
              {t("hello")}
            </Text>
          </View>
          <View style={{ marginBottom: 20, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setSelector(true)}
              style={{
                width: Dimensions.get("screen").width * 0.15,
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 15,
                marginRight: 5,
              }}
            >
              <Text
                style={{
                  color: "#030303",
                  paddingTop: 5,
                  marginTop: 10,
                  alignSelf: "center",
                  height: 29,
                }}
                size="title"
              >
                {region}
              </Text>
            </TouchableOpacity>
            <FloatingInput
              value={number}
              onChangeText={(text) => setNumber(text)}
              customTextStyle={{
                width: Dimensions.get("screen").width * 0.6,
                fontSize: 18,
              }}
              keyboardType="number-pad"
              label={t("phoneNumber")}
            />
          </View>
          <View
            style={{
              marginBottom: 80,
              alignItems: "center",
            }}
          >
            <Button
              onPress={requestNumber}
              text={t("next")}
              style={{ width: Dimensions.get("window").width / 1.2 }}
            />
            <TouchableOpacity
              onPress={() => props.navigation.navigate("login")}
            >
              <Text
                style={{
                  marginTop: 60,
                  color: "#27958B",
                }}
                type="bold"
                onPress={() => props.navigation.navigate("login")}
              >
                Try another way to sign in
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <PhoneCodeSelector
          show={selector}
          close={() => setSelector(false)}
          callBack={(e) => setRegion(e)}
          value={region}
        />
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
