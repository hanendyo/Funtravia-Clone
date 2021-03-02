import React, { useState, useEffect } from "react";
import { Text, Button } from "../../../component";
import { View } from "native-base";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../../assets/svg";
import { Dimensions, Alert } from "react-native";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePassword from "../../../graphQL/Mutation/Setting/UpdateKataSandi";
import { useMutation } from "@apollo/react-hooks";

export default function HasPassword(props) {
  const [token, setToken] = useState("");
  const [setting, setSetting] = useState("");
  let { t, i18n } = useTranslation();
  let [text, setText] = useState("");
  let [text1, setText1] = useState("");
  let [text2, setText2] = useState("");

  const [error, setError] = useState({
    password: false,
    password1: false,
    password2: false,
  });

  const handleError = (e) => {
    setText(e);
    if (e && e.length <= 8) {
      setError({ ...error, password: true });
    }
  };
  const handleError1 = (e) => {
    setText1(e);
    if (e && e.length <= 8) {
      setError({ ...error, password1: true });
    }
  };
  const handleError2 = (e) => {
    setText2(e);
    if (e && e.length <= 8 && text2 !== text1) {
      setError({ ...error, password2: true });
    }
  };

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

  const [
    mutationPassword,
    { loading: loadingPassword, data: dataPassword, error: errorPassword },
  ] = useMutation(UpdatePassword, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const onSubmit = async (text, text1) => {
    if (text1 === "" || text1 === null) {
      return Alert.alert("Password Wajib Di isi");
    }
    if (token || token !== "") {
      try {
        let response = await mutationPassword({
          variables: {
            oldPass: text,
            newPass: text1,
          },
        });
        if (loadingPassword) {
          <View>
            <ActivityIndicator animating={true} color="#209FAE" />
          </View>;
        }
        if (errorPassword) {
          throw new Error("Error Input");
        }
        if (response.data) {
          if (
            response.data.change_password_settings.code === 200 ||
            response.data.change_password_settings.code === "200"
          ) {
            await Alert.alert("Password berhasil di simpan");
            await props.navigation.navigate("SettingsAkun");
          } else {
            throw new Error(response.data.change_password_settings.message);
          }
        }
      } catch (error) {
        Alert.alert("" + error);
      }
    } else {
      Alert.alert("Please Login");
    }
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
          <Text size="description">{t("CurrentPassword")}</Text>
        </Label>
        <Input
          secureTextEntry={true}
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          // value={data.first_name ? data.first_name : ""}
          onChangeText={(e) => handleError(e)}
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
          <Text size="description">{t("NewPassword")}</Text>
        </Label>
        <Input
          secureTextEntry={true}
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          // value={data.first_name ? data.first_name : ""}
          onChangeText={(e) => handleError1(e)}
          keyboardType="default"
        />
      </Item>
      {text1 && text1.length < 8 ? (
        <Label>
          <Text type="light" size="small" style={{ color: "#209FAE" }}>
            {t("inputWarningPassword")}
          </Text>
        </Label>
      ) : null}
      <Item floatingLabel>
        <Label
          style={{
            fontFamily: "Lato-Regular",
            fontSize: 14,
            marginTop: 10,
          }}
        >
          <Text size="description">{t("ConfirmPassword")}</Text>
        </Label>
        <Input
          secureTextEntry={true}
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          // value={data.first_name ? data.first_name : ""}
          onChangeText={(e) => handleError2(e)}
          keyboardType="default"
        />
      </Item>
      {text2 !== text1 ? (
        <Label>
          <Text type="light" size="small" style={{ color: "#209FAE" }}>
            {t("inputWarningRepeatPassword")}
          </Text>
        </Label>
      ) : null}
      <View style={{ marginTop: 30 }}>
        <Button
          color="secondary"
          onPress={() => onSubmit(text, text1)}
          text={"Submit"}
        ></Button>
      </View>
    </View>
  );
}
