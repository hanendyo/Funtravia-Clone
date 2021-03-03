import React, { useState, useEffect } from "react";
import { Text, Button } from "../../../component";
import { View } from "native-base";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite } from "../../../assets/svg";
import { Dimensions, Pressable, Image } from "react-native";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UpdatePassword from "../../../graphQL/Mutation/Setting/UpdateKataSandi";
import { useMutation } from "@apollo/react-hooks";
import Modal from "react-native-modal";
import { show_password, hide_password } from "../../../assets/png";

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

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [errors, setErrors] = useState("");

  const onSubmit = async (text, text1) => {
    if (text === "") {
      setModalVisible2(true);
      return setErrors("Passwords cannot be empty");
    }
    if (text1 === "") {
      setModalVisible2(true);
      return setErrors("Passwords cannot be empty");
    }

    if (text1 !== text2) {
      return (error["password2"] = true);
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
        marginTop: 20,
      }}
    >
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
            }}
          >
            <Text size="description">{t("CurrentPassword")}</Text>
          </Label>
          <Input
            secureTextEntry={hide}
            style={{ fontFamily: "Lato-Regular", fontSize: 14 }}
            // value={data.first_name ? data.first_name : ""}
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
            <Text size="description">{t("NewPassword")}</Text>
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
        <Label>
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
              fontFamily: "Lato-Regular",
              fontSize: 14,
              marginTop: 10,
            }}
          >
            <Text size="description">{t("ConfirmPassword")}</Text>
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
              Successfully updated password
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
                  errors.toString().replace("Error", "").replace(":", "")}
              </Text>
            ) : (
              <Text size="description" type="regular" style={{ color: "#FFF" }}>
                Failed updated password
              </Text>
            )}
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
