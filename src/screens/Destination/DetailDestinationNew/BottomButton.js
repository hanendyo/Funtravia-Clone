import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { PensilPutih } from "../../../assets/svg";
import { Button } from "../../../component";
import { useTranslation } from "react-i18next";
import { RNToasty } from "react-native-toasty";

export default function BottomButton({ routed, props, data, token, addTo }) {
  const { t, i18n } = useTranslation();
  let lengthartikel = data.article_header.length + 1;
  console.log("token", token);

  const Ceklogin = () => {
    if (token) {
      props.navigation.navigate("DestinationUnescoReview", {
        data: data,
      });
    } else {
      props.navigation.navigate("AuthStack", {
        screen: "LoginScreen",
      });
      RNToasty.Show({
        title: t("pleaselogin"),
        position: "bottom",
      });
    }
  };

  return (
    <View
      style={{
        alignItems: "flex-end",
      }}
    >
      {routed === lengthartikel ? (
        <View style={{ position: "absolute", top: -75, right: 15, zIndex: 10 }}>
          <Button
            color="primary"
            type="circle"
            style={{
              paddingHorizontal: 15,
            }}
            size="large"
            onPress={() => Ceklogin()}
          >
            <PensilPutih height={15} width={15} />
          </Button>
        </View>
      ) : null}
      <View
        style={{
          height: 60,
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
          shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
          elevation: Platform.OS == "ios" ? 3 : 3.5,
          flexDirection: "row",
          borderTopWidth: 1,
          borderColor: "#F1F1F1",
          justifyContent: "space-between",
          paddingVertical: 10,
        }}
      >
        <Button
          onPress={() => addTo()}
          style={{ height: "100%", width: "100%" }}
          color="primary"
          type="box"
          text="Add To Plan"
        ></Button>
      </View>
    </View>
  );
}
