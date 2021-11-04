import React, { useState, useEffect } from "react";
import { Text, Button, Peringatan } from "../../../component";
import { View } from "native-base";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite, SetPass } from "../../../assets/svg";
import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Image,
} from "react-native";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePassword from "../../../graphQL/Mutation/Setting/UpdatePassword";
import { useMutation } from "@apollo/react-hooks";
import Modal from "react-native-modal";
import { show_password, hide_password } from "../../../assets/png";
import { CustomImage } from "../../../component";
import normalize from "react-native-normalize";
import { RNToasty } from "react-native-toasty";

export default function AddPasswordEmail(props) {
  const [token, setToken] = useState("");
  const [setting, setSetting] = useState("");
  let { t, i18n } = useTranslation();
  let [text1, setText1] = useState("");
  let [text2, setText2] = useState("");

  const [error, setError] = useState({
    password1: false,
    password2: false,
  });

  const [disable1, setDisable1] = useState("");
  const [disable2, setDisable2] = useState("");

  const handleError1 = (e) => {
    setText1(e);
    if (e && e.length < 8) {
      setDisable1(e);

      return setError({ ...error, password1: true });
    } else {
      setDisable1(e);

      return setError({ ...error, password1: false });
    }
  };
  const handleError2 = (e, text1) => {
    setText2(e);
    if (e !== text1) {
      setDisable2(e);
      setError({ ...error, password2: true });
    } else {
      setDisable2(e);
      setError({ ...error, password2: false });
    }
  };

  const HeaderComponent = {
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("SetPassword")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      marginLeft: 10,
    },
    headerLRightContainerStyle: {
      background: "#FFF",
      marginRight: 10,
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
      showAlert({
        ...aler,
        show: true,
        judul: t("somefieldempty"),
        detail: "",
      });
    }
    if (text1 !== text2) {
      RNToasty.Show({
        title: t("failedAddPassword"),
        position: "bottom",
      });
    }

    if (token || token !== "") {
      try {
        let response = await mutationPassword({
          variables: {
            password: text1,
          },
        });
        console.log("response", response);
        if (response.data) {
          if (
            response.data.update_password_settings.code === 200 ||
            response.data.update_password_settings.code === "200"
          ) {
            RNToasty.Show({
              title: t("failedAddPassword"),
              position: "bottom",
            });
            await setTimeout(() => {
              props.navigation.navigate("SettingEmailChange", {
                setting: setting,
              });
            }, 2000);
          } else {
            RNToasty.Show({
              title: t("failedAddPassword"),
              position: "bottom",
            });
          }
        }
      } catch (error) {
        console.log("error", error);
        RNToasty.Show({
          title: t("failedAddPassword"),
          position: "bottom",
        });
      }
    } else {
      console.log("error");

      RNToasty.Show({
        title: t("failedAddPassword"),
        position: "bottom",
      });
    }
  };

  const [hide, setHide] = useState(true);
  const [hide1, setHide1] = useState(true);

  const toggleOne = () => {
    setHide(!hide);
  };
  const toggleTwo = () => {
    setHide1(!hide1);
  };
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });

  return (
    <ScrollView style={{ backgroundColor: "white", flex: 1 }}>
      <Peringatan
        aler={aler}
        setClose={() => showAlert({ ...aler, show: false })}
      />
      <KeyboardAvoidingView
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <SetPass height={200} width={200} />
        </View>
        <View style={{ alignItems: "center" }}>
          <Text size="description" type="bold">
            {t("SetPassword")}
          </Text>
          <Text
            size="small"
            type="regular"
            style={{
              textAlign: "center",
              width: Dimensions.get("screen").width * 0.55,
            }}
          >
            {t("WordChangeEmail")}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Item
            floatingLabel
            style={{
              width: Dimensions.get("screen").width * 0.82,
            }}
          >
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
              secureTextEntry={hide}
              style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
              onChangeText={(e) => handleError1(e)}
              keyboardType="default"
            />
          </Item>
          <Pressable
            onPress={() => toggleOne()}
            style={{
              alignItems: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "#D1D1D1",
            }}
          >
            {hide ? (
              <Image
                source={show_password}
                style={{
                  height: 20,
                  width: 20,
                  marginTop: 25,
                }}
              />
            ) : (
              <Image
                source={hide_password}
                style={{
                  height: 20,
                  width: 20,
                  marginTop: 25,
                }}
              />
            )}
          </Pressable>
        </View>
        {error["password1"] === true ? (
          <Label
            style={{
              marginTop: 5,
            }}
          >
            <Text type="light" size="small" style={{ color: "#209FAE" }}>
              {t("inputWarningPassword")}
            </Text>
          </Label>
        ) : null}
        <View style={{ flexDirection: "row" }}>
          <Item
            floatingLabel
            style={{
              width: Dimensions.get("screen").width * 0.82,
            }}
          >
            <Label
              style={{
                marginTop: 10,
              }}
            >
              <Text size="description">{t("ConfirmPasswords")}</Text>
            </Label>
            <Input
              secureTextEntry={hide1}
              style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
              // value={data.first_name ? data.first_name : ""}
              onChangeText={(e) => handleError2(e, text1)}
              keyboardType="default"
            />
          </Item>
          <Pressable
            onPress={() => toggleTwo()}
            style={{
              alignItems: "flex-end",
              borderBottomWidth: 1,
              borderBottomColor: "#D1D1D1",
            }}
          >
            {hide1 ? (
              <Image
                source={show_password}
                style={{
                  height: 20,
                  width: 20,
                  marginTop: 25,
                }}
              />
            ) : (
              <Image
                source={hide_password}
                style={{
                  height: 20,
                  width: 20,
                  marginTop: 25,
                }}
              />
            )}
          </Pressable>
        </View>
        {error["password2"] === true ? (
          <Label style={{ marginTop: 5 }}>
            <Text type="light" size="small" style={{ color: "#209FAE" }}>
              {t("inputWarningRepeatPassword")}
            </Text>
          </Label>
        ) : null}
        <View style={{ marginTop: 30, marginBottom: 10 }}>
          <Button
            disabled={disable1.length < 8 || disable2.length < 8 ? true : false}
            color={
              disable1.length < 8 || disable2.length < 8
                ? "disabled"
                : "secondary"
            }
            text={"Submit"}
            onPress={() => onSubmit(text1, text2)}
          ></Button>
        </View>
      </KeyboardAvoidingView>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            justifyContent: "flex-end",
            flex: 1,
            width: Dimensions.get("screen").width * 0.6,
            alignSelf: "center",
          }}
        >
          <Pressable
            onPress={() => setModalVisible(!modalVisible)}
            style={{
              backgroundColor: "#209FAE",
              alignItems: "center",
              borderRadius: 5,
              minHeight: 40,
              justifyContent: "center",
              flexDirection: "row",
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
          >
            <Text
              size="description"
              type="regular"
              style={{ color: "#FFF", marginRight: 10 }}
            >
              Successfully created a password
            </Text>
          </Pressable>
        </View>
      </Modal>
      <Modal animationType="fade" transparent={true} visible={modalVisible2}>
        <View
          style={{
            justifyContent: "flex-end",
            flex: 1,
            width: Dimensions.get("screen").width * 0.6,
            alignSelf: "center",
          }}
        >
          <Pressable
            onPress={() => setModalVisible2(!modalVisible2)}
            style={{
              backgroundColor: "#464646",
              alignItems: "center",
              borderRadius: 5,
              minHeight: 40,
              justifyContent: "center",
              flexDirection: "row",
              paddingHorizontal: 5,
              paddingVertical: 5,
            }}
          >
            {errors ? (
              <Text size="description" type="regular" style={{ color: "#FFF" }}>
                {"Failed" +
                  " " +
                  errors
                    .toString()
                    .replace("Error", "")
                    .replace(":", "")}
              </Text>
            ) : (
              <Text size="description" type="regular" style={{ color: "#FFF" }}>
                Failed updated password
              </Text>
            )}
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
}
