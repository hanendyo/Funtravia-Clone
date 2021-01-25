import React, { useState, useEffect } from "react";
import { Arrowbackwhite } from "../../assets/svg";
import { Text, Button, FloatingInput } from "../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, TextInput, CheckBox } from "react-native";
import { Input, Item, Label } from "native-base";

export default function SettingEmail(props) {
  let [token, setToken] = useState("");
  const { t, i18n } = useTranslation();
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

  console.log(token);

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
        <Text>{t("emailUsed")}</Text>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <Item
          floatingLabel
          style={
            {
              // marginVertical: 10,
            }
          }
        >
          <Label
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 14,
            }}
          >
            {"Email"}
          </Label>
          <Input
            maxLength={20}
            style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
            // value={data.first_name ? data.first_name : ""}
            // onChangeText={(text) => _handleOnChange(text, "first_name")}
            keyboardType="default"
          />
        </Item>
      </View>
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CheckBox />
        <Text>Send me Funtravia excusive discount and promo</Text>
      </View>
      <View
        style={{
          //   width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
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
