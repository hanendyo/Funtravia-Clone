import React, { useState, useEffect } from "react";
import { Arrowbackios, Arrowbackwhite } from "../../../assets/svg";
import { Text, Button, PhoneCodeSelector } from "../../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, CheckBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TouchableOpacity, TextInput } from "react-native-gesture-handler";

export default function SettingPhoneChange(props) {
  let [token, setToken] = useState("");
  const { t } = useTranslation();
  let [region, setRegion] = useState("+62");
  let [selector, setSelector] = useState(false);
  let [setSetting] = useState();
  const HeaderComponent = {
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("ChangePhoneNumber")}
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
          {t("phoneUsed")}
        </Text>
      </View>
      <View style={{ paddingHorizontal: 20, marginTop: 30 }}>
        <Text size="description" type="regular">
          {t("CountryCode")}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "center",
          paddingHorizontal: 20,
          width: Dimensions.get("screen").width,
        }}
      >
        <TouchableOpacity
          onPress={() => setSelector(true)}
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#E1E1E1",
            paddingVertical: 15,
            marginRight: 10,
            width: Dimensions.get("screen").width * 0.2,
          }}
        >
          <Text size="description" type="regular">
            {region}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            width: Dimensions.get("screen").width * 0.65,
          }}
        >
          <TextInput
            style={{
              fontFamily: "Lato-Regular",
              fontSize: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#E1E1E1",
              paddingHorizontal: 10,
            }}
            // value={data.first_name ? data.first_name : ""}
            // onChangeText={(text) => _handleOnChange(text, "first_name")}
            keyboardType="number-pad"
            placeholder="Mobile Number"
          />
        </View>
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
      <PhoneCodeSelector
        show={selector}
        close={() => setSelector(false)}
        callBack={(e) => setRegion(e)}
        value={region}
      />
    </View>
  );
}
