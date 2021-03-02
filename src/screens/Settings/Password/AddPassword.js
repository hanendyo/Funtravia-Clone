import React, { useState, useEffect } from "react";
import { Text, Button } from "../../../component";
import { View } from "native-base";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite, WhiteCheck, Xgray } from "../../../assets/svg";
import { Dimensions, Alert, Pressable } from "react-native";
import Modal from "react-native-modal";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePassword from "../../../graphQL/Mutation/Setting/UpdatePassword";
import { useMutation } from "@apollo/react-hooks";
import { show_password, hide_password } from "../../../assets/png";
import { CustomImage } from "../../../component";

export default function AddPassword(props) {
  const [token, setToken] = useState("");
  const [setting, setSetting] = useState("");
  let { t, i18n } = useTranslation();
  let [text1, setText1] = useState("");
  let [text2, setText2] = useState("");

  const [error, setError] = useState({
    password1: false,
    password2: false,
  });

  const handleError1 = (e) => {
    setText1(e);
    if (e && e.length < 8) {
      return setError({ ...error, password1: true });
    } else {
      return setError({ ...error, password1: false });
    }
  };
  const handleError2 = (e, text1) => {
    setText2(e);
    if (e !== text1) {
      setError({ ...error, password2: true });
    } else {
      setError({ ...error, password2: false });
    }
  };

  const HeaderComponent = {
    headerTitle: t("AddPassword"),
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

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [errors, setErrors] = useState("");

  const onSubmit = async (text1, text2) => {
    if (text1 === "") {
      return setModalVisible2(true);
    }
    if (text1 !== text2) {
      return (error["password2"] = true);
    }

    if (token || token !== "") {
      try {
        let response = await mutationPassword({
          variables: {
            password: text1,
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
            response.data.update_password_settings.code === 200 ||
            response.data.update_password_settings.code === "200"
          ) {
            await setModalVisible(!modalVisible);
            await setTimeout(() => {
              props.navigation.navigate("SettingsAkun");
            }, 3000);
          } else {
            throw new Error(response.data.update_password_settings.message);
          }
        }
      } catch (errors) {
        setModalVisible2(true);
        return setErrors(errors);
      }
    } else {
      setModalVisible2(true);
      return setErrors("Please Login");
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 20,
        flex: 1,
      }}
    >
      <Item floatingLabel style={{ flexDirection: "row" }}>
        <Label
          style={{
            fontFamily: "Lato-Regular",
            fontSize: 14,
            marginTop: 10,
          }}
        >
          <Text size="description">{t("EnterPassword")}</Text>
        </Label>
        <Input
          secureTextEntry={true}
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          onChangeText={(e) => handleError1(e)}
          keyboardType="default"
        />
      </Item>
      {error["password1"] === true ? (
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
          <Text size="description">{t("ConfirmPasswords")}</Text>
        </Label>
        <Input
          secureTextEntry={true}
          style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
          onChangeText={(e) => handleError2(e, text1)}
          keyboardType="default"
        />
      </Item>
      {error["password2"] === true ? (
        <Label>
          <Text type="light" size="small" style={{ color: "#209FAE" }}>
            {t("inputWarningRepeatPassword")}
          </Text>
        </Label>
      ) : null}
      <View style={{ marginTop: 30 }}>
        <Button
          disable={false}
          color="secondary"
          text={"Submit"}
          onPress={() => onSubmit(text1, text2)}
        ></Button>
      </View>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              backgroundColor: "#209FAE",
              alignItems: "center",
              borderRadius: 5,
              height: 40,
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ color: "#FFF", marginRight: 10 }}
            >
              Successfully created a password
            </Text>
            <WhiteCheck height={20} width={20} />
          </Pressable>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalVisible2}>
        <View
          style={{
            justifyContent: "flex-end",
            flex: 1,
          }}
        >
          <Pressable
            onPress={() => setModalVisible2(!modalVisible2)}
            style={{
              backgroundColor: "#D75995",
              alignItems: "center",
              borderRadius: 5,
              height: 40,
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <Text
              size="label"
              type="regular"
              style={{ color: "#FFF", marginRight: 10 }}
            >
              Failed
            </Text>
            <Xgray height={20} width={20} />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
