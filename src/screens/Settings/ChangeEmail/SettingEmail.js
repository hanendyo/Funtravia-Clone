import React, { useState, useEffect } from "react";
import { Arrowbackios, Arrowbackwhite } from "../../../assets/svg";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, CheckBox } from "react-native";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingEmail(props) {
  let [token, setToken] = useState("");
  const { t, i18n } = useTranslation();
  let [setSetting] = useState();
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
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <Text size="description" type="regular">
          {t("emailUsed")}
        </Text>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <Item floatingLabel>
          <Label
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 14,
            }}
          >
            {"Email"}
          </Label>
          <Input
            style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
            // value={data.first_name ? data.first_name : ""}
            // onChangeText={(text) => _handleOnChange(text, "first_name")}
            keyboardType="default"
          />
        </Item>
      </View>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 30,
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckBox
          onCheckColor="#FFF"
          lineWidth={2}
          onFillColor="#209FAE"
          onTintColor="#209FAE"
          boxType={"square"}
          style={{
            alignSelf: "center",
            width: Platform.select({
              ios: 30,
              android: 35,
            }),
            transform: Platform.select({
              ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
              android: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
            }),
          }}
        />
        <Text type="regular" size="description" style={{ marginLeft: 10 }}>
          {t("CheckChangeEmail")}
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: 20,
          marginTop: 40,
          flexDirection: "row",
        }}
      >
        <Button
          type="box"
          size="medium"
          color="secondary"
          text={t("save")}
          onPres={() => null}
          style={{ width: "100%" }}
        />
      </View>
    </View>
  );
}
