import React, { useState, useEffect } from "react";
import { Text, Button } from "../../../component";
import { View } from "native-base";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../../assets/svg";
import { Dimensions } from "react-native";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HasPassword(props) {
  const [token, setToken] = useState("");
  const [setting, setSetting] = useState("");
  let { t, i18n } = useTranslation();

  const HeaderComponent = {
    headerTitle: t("UpdatePassword"),
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

  return (
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
          {t("CurrentPassword")}
        </Label>
        <Input
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          // value={data.first_name ? data.first_name : ""}
          // onChangeText={(text) => _handleOnChange(text, "first_name")}
          keyboardType="default"
        />
      </Item>
      <Item floatingLabel>
        <Label
          style={{
            fontFamily: "Lato-Regular",
            fontSize: 14,
            marginTop: 10,
          }}
        >
          {t("NewPassword")}
        </Label>
        <Input
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          // value={data.first_name ? data.first_name : ""}
          // onChangeText={(text) => _handleOnChange(text, "first_name")}
          keyboardType="default"
        />
      </Item>
      <Item floatingLabel>
        <Label
          style={{
            fontFamily: "Lato-Regular",
            fontSize: 14,
            marginTop: 10,
          }}
        >
          {t("ConfirmPassword")}
        </Label>
        <Input
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          // value={data.first_name ? data.first_name : ""}
          // onChangeText={(text) => _handleOnChange(text, "first_name")}
          keyboardType="default"
        />
      </Item>
      <View style={{ marginTop: 30 }}>
        <Button color="secondary" text={"Submit"}></Button>
      </View>
    </View>
  );
}
