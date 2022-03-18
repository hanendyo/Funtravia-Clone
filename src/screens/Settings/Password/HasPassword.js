import React, { useState, useEffect } from "react";
import { Text, Button, Peringatan } from "../../../component";
import { View } from "native-base";
import { useTranslation } from "react-i18next";
import { Arrowbackios, Arrowbackwhite } from "../../../assets/svg";
import { Dimensions, Pressable, Image, Platform } from "react-native";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePassword from "../../../graphQL/Mutation/Setting/UpdateKataSandi";
import { useMutation } from "@apollo/react-hooks";
import Modal from "react-native-modal";
import { show_password, hide_password } from "../../../assets/png";
import normalize from "react-native-normalize";
import { useDispatch } from "react-redux";

export default function HasPassword(props) {
  let dispatch = useDispatch();
  const [token, setToken] = useState(props.route.params.token);
  const [setting, setSetting] = useState(props.route.params.setting);
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
    headerTitle: (
      <Text type="bold" size="header" style={{ color: "#fff" }}>
        {t("UpdatePassword")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : 1,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      // position: "absolute",
      zIndex: 999,
      marginLeft: 10,
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
  };

  const loadAsync = async () => {
    let tkn = await AsyncStorage.getItem("access_token");
    // await setToken(tkn);
    // dispatch(setTokenApps(`Bearer ${tkn}`));
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
        Authorization: token,
      },
    },
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [errors, setErrors] = useState("");
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });

  const onSubmit = async (text, text1) => {
    if (text === "") {
      return showAlert({
        ...aler,
        show: true,
        judul: t("canNotEmpty"),
      });
    }
    if (text1 === "") {
      return showAlert({
        ...aler,
        show: true,
        judul: t("canNotEmpty"),
      });
    }

    if (text1 !== text2) {
      return showAlert({
        ...aler,
        show: true,
        judul: t("canNotEmpty"),
      });
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
            setModalVisible(!modalVisible);
            await setTimeout(() => {
              props.navigation.navigate("SettingsAkun");
            }, 3000);
          } else {
            throw new Error(response.data.change_password_settings.message);
          }
        }
      } catch (errors) {
        setModalVisible2(true);
        await setTimeout(() => {
          setModalVisible2(false);
        }, 3000);
        return setErrors(errors);
      }
    } else {
      setModalVisible2(true);
      return setErrors("Please Login");
    }
  };

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [hide, setHide] = useState(true);
  const [hide1, setHide1] = useState(true);
  const [hide2, setHide2] = useState(true);

  const toggleOne = () => {
    setHide(!hide);
  };
  const toggleTwo = () => {
    setHide1(!hide1);
  };
  const toggleThree = () => {
    setHide2(!hide2);
  };

  return (
    <View
      style={{
        width: Dimensions.get("screen").width * 0.9,
        marginHorizontal: 20,
        // marginTop: 20,
      }}
    >
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      <View style={{ flexDirection: "row", paddingTop: 10 }}>
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
            }}
          >
            <Text size="label" type="regular">
              {t("CurrentPassword")}
            </Text>
          </Label>
          <Input
            secureTextEntry={hide}
            style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
            onChangeText={(e) => handleError(e)}
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
      <View style={{ flexDirection: "row", paddingTop: 10 }}>
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
              // marginTop: 10,
            }}
          >
            <Text size="label">{t("NewPassword")}</Text>
          </Label>
          <Input
            secureTextEntry={hide1}
            style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
            // value={data.first_name ? data.first_name : ""}
            onChangeText={(e) => handleError1(e)}
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
      {text1 && text1.length < 8 ? (
        <Label style={{ marginTop: 5 }}>
          <Text type="light" size="small" style={{ color: "#209FAE" }}>
            {t("inputWarningPassword")}
          </Text>
        </Label>
      ) : null}
      <View style={{ flexDirection: "row", paddingTop: 10 }}>
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
              // marginTop: 10,
            }}
          >
            <Text size="label">{t("ConfirmPassword")}</Text>
          </Label>
          <Input
            secureTextEntry={hide2}
            style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
            // value={data.first_name ? data.first_name : ""}
            onChangeText={(e) => handleError2(e)}
            keyboardType="default"
          />
        </Item>
        <Pressable
          onPress={() => toggleThree()}
          style={{
            alignItems: "flex-end",
            borderBottomWidth: 1,
            borderBottomColor: "#D1D1D1",
          }}
        >
          {hide2 ? (
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

      {text2 !== text1 ? (
        <Label style={{ marginTop: 5 }}>
          <Text type="light" size="small" style={{ color: "#209FAE" }}>
            {t("inputWarningRepeatPassword")}
          </Text>
        </Label>
      ) : null}
      <View style={{ marginTop: 30 }}>
        <Button
          disabled={
            text.length < 1 || text1.length < 8 || text2.length < 8
              ? true
              : false
          }
          color={
            text.length < 0 || text1.length < 8 || text2.length < 8
              ? "disabled"
              : "secondary"
          }
          onPress={() => onSubmit(text, text1)}
          text={t("submit")}
        ></Button>
      </View>
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
            <Text size="description" type="regular" style={{ color: "#FFF" }}>
              {t("successUpdatedPassword")}
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
                {t("failedUpdatedPassword")}
              </Text>
            )}
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
