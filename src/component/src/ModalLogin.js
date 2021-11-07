import React, { useState } from "react";
import { Modal, Pressable, View, Dimensions } from "react-native";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../component";
import { Xgray } from "../../assets/svg";

export default function ModalLogin({ props, modalLogin, setModalLogin }) {
  const { t, i18n } = useTranslation();
  return (
    <Modal
      useNativeDriver={true}
      visible={modalLogin}
      onRequestClose={() => true}
      transparent={true}
      animationType="fade"
    >
      <Pressable
        onPress={() => setModalLogin()}
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          justifyContent: "center",
          opacity: 0.7,
          backgroundColor: "#000",
          position: "absolute",
        }}
      ></Pressable>
      <View
        style={{
          width: Dimensions.get("screen").width - 120,
          marginHorizontal: 60,
          backgroundColor: "#FFF",
          zIndex: 15,
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          marginTop: Dimensions.get("screen").height / 4,
          borderRadius: 5,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            width: Dimensions.get("screen").width - 120,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "#f6f6f6",
              borderRadius: 5,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                marginTop: 12,
                marginBottom: 15,
              }}
              size="title"
              type="bold"
            >
              {`${t("LoginFirst")}`}
              {/* {t("login dulu")} */}
            </Text>
            <Pressable
              onPress={() => {
                // props.navigation.navigate("HomeScreen");
                setModalLogin();
              }}
              style={{
                height: 50,
                width: 55,
                position: "absolute",
                right: 0,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Xgray width={15} height={15} />
            </Pressable>
          </View>
          <View
            style={{
              alignItems: "center",
              marginHorizontal: 30,
              marginBottom: 15,
              marginTop: 12,
            }}
          >
            <Text style={{ marginBottom: 5 }} size="title" type="bold">
              {t("nextLogin")}
            </Text>
            <Text
              style={{ textAlign: "center", lineHeight: 18 }}
              size="label"
              type="regular"
            >
              {t("textLogin")}
            </Text>
          </View>
          <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
            <Button
              style={{ marginBottom: 5 }}
              onPress={() => {
                setModalLogin();
                props.navigation.push("AuthStack", {
                  screen: "LoginScreen",
                });
              }}
              type="icon"
              text={t("signin")}
            ></Button>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                marginVertical: 5,
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
              <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                {t("or")}
              </Text>
              <View
                style={{
                  width: 50,
                  borderBottomWidth: 1,
                  borderBottomColor: "#d1d1d1",
                  marginHorizontal: 10,
                }}
              ></View>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text
                size="label"
                type="bold"
                style={{ color: "#209FAE" }}
                onPress={() => {
                  setModalLogin();
                  props.navigation.push("AuthStack", {
                    screen: "RegisterScreen",
                  });
                }}
              >
                {t("createAkunLogin")}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
