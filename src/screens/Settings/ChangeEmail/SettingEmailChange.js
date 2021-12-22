import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Arrowbackios,
  Arrowbackwhite,
  LogoEmail,
  PasswordUpdateEmail,
  EyeActive,
  EyeNonactive,
} from "../../../assets/svg";
import { Text, Button, Loading, Peringatan } from "../../../component";
import { useTranslation } from "react-i18next";
import {
  View,
  Dimensions,
  KeyboardAvoidingView,
  BackHandler,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import changeEmail from "../../../graphQL/Mutation/Setting/changeEmail";
import { useMutation } from "@apollo/client";
import DeviceInfo from "react-native-device-info";
import { Input, Item, Label } from "native-base";
import { RNToasty } from "react-native-toasty";
import { useDispatch } from "react-redux";

export default function SettingEmailChange(props) {
  let dispatch = useDispatch();
  const Notch = DeviceInfo.hasNotch();
  let [token, setToken] = useState(props.route.params.token);
  let [setting, setSetting] = useState(props.route.params.setting);
  let { t } = useTranslation();
  let [email1, setEmail1] = useState("");
  let [email2, setEmail2] = useState("");
  const [ishide, setIshide] = useState(true);

  const [inputPassword, setInputPassword] = useState(false);
  const myStateRef = React.useRef(inputPassword);

  const [password, setPassword] = useState("");

  let ref1 = useRef();
  let ref2 = useRef();
  const [disable1, setDisable1] = useState("");
  const [disable2, setDisable2] = useState("");
  const [error, setError] = useState({
    emailError1: false,
    emailError2: false,
  });
  const handleError1 = (e) => {
    let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmail1(e);
    console.log("email 1", e.length);
    if (e.length > 0 && !e.match(emailRegex)) {
      setDisable1(e);
      return setError({ ...error, emailError1: true });
    } else {
      setDisable1(e);
      return setError({ ...error, emailError1: false });
    }
  };
  const handleError2 = (e, text1) => {
    let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    setEmail2(e);
    if (e !== text1 && e.length > 0 && !e.match(emailRegex)) {
      setDisable2(e);
      setError({ ...error, emailError2: true });
    } else {
      setDisable2(e);
      setError({ ...error, emailError2: false });
    }
  };

  const HeaderComponent = {
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("ChangeEmail")}
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
        onPress={() => onBackPress()}
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
    // await setToken(tkn);
    dispatch(setTokenApps(`Bearer ${tkn}`));
    let setsetting = await AsyncStorage.getItem("setting");
    setSetting(JSON.parse(setsetting));
  };

  const onBackPress = useCallback(() => {
    if (myStateRef.current == true) {
      setInputPassword(false);
      myStateRef.current = false;
    } else {
      props.navigation.goBack();
    }
    return true;
  }, []);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [onBackPress]);

  useEffect(() => {
    props.navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    });
  }, [onBackPress]);

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    mutationChangeEmail,
    { loading: loadingEmail, data: dataEmail, error: errorMutationEmail },
  ] = useMutation(changeEmail, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });

  const resultChangeEmail = async (oldEmail, newEmail, password) => {
    if (oldEmail == "" && newEmail == "") {
      return showAlert({
        ...aler,
        show: true,
        judul: t("canNotEmpty"),
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }

    if (oldEmail === newEmail) {
      return showAlert({
        ...aler,
        show: true,
        judul: t("sameEmail"),
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }
    if (token || token !== "") {
      try {
        let response = await mutationChangeEmail({
          variables: {
            oldEmail: oldEmail,
            newEmail: newEmail,
            password: password,
          },
        });

        if (response.data) {
          if (response.data.changemail.code !== 200) {
            if (response.data.changemail.code == 401) {
              RNToasty.Show({
                title: response.data.changemail.message,
                position: "bottom",
              });
            } else {
              setInputPassword(false);
              myStateRef.current = false;
              RNToasty.Show({
                title: t("failedChangeEmail"),
                position: "bottom",
              });
            }
          } else {
            await props.navigation.navigate("SettingEmailVerify", {
              emailNew: newEmail,
              emailOld: oldEmail,
            });
          }
        }
      } catch (error) {
        setInputPassword(false);
        myStateRef.current = false;
        showAlert({
          ...aler,
          show: true,
          judul: t("usedEmail"),
          // detail: "lorem ipsum lorem ipsum lorem ipsum",
        });
      }
    } else {
      setInputPassword(false);
      myStateRef.current = false;
      showAlert({
        ...aler,
        show: true,
        judul: "failed",
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }
  };

  const [itemValid, setItemValid] = useState({
    email: false,
    password: false,
  });

  const validation = (name, value) => {
    let emailRegex = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value || value === "") {
      return false;
    } else if (name === "email") {
      return value.match(emailRegex) ? true : false;
    } else {
      return true;
    }
  };
  const _handleOnChange = (value, name) => {
    const validate = validation(name, value);
    switch (name) {
      case "email":
        setEmail(value.toLowerCase());
        setItemValid({ ...itemValid, email: validate });
        break;
      case "password":
        setPassword(value);
        setItemValid({ ...itemValid, password: validate });
        break;
      default:
        break;
    }
  };

  if (inputPassword) {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            // width: Dimensions.get("screen").width * 0.9,
            marginHorizontal: 20,
            marginTop: 100,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PasswordUpdateEmail width={170} height={170} />
          <Text size="label" type="bold">
            {t("inputPassword")}
          </Text>
          <Text
            size="description"
            type="regular"
            style={{
              textAlign: "center",
              width: "50%",
            }}
          >
            {t("inputPasswordChangeEmail")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width - 65,
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
                {"Password"}
              </Label>

              <Input
                style={{
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  borderBottomWidth: 0,
                }}
                // value={data.first_name ? data.first_name : ""}
                secureTextEntry={ishide}
                onChangeText={(text) => _handleOnChange(text, "password")}
                keyboardType="default"
              />
            </Item>
          </View>
          {ishide ? (
            <Pressable
              onPress={() => setIshide(false)}
              style={{
                borderBottomWidth: 0.7,
                borderBottomColor: "#D1D1D1",
              }}
            >
              <EyeActive width={25} height={25} />
            </Pressable>
          ) : (
            <Pressable
              onPress={() => setIshide(true)}
              style={{
                borderBottomWidth: 0.7,
                borderBottomColor: "#D1D1D1",
              }}
            >
              <EyeNonactive width={25} height={25} />
            </Pressable>
          )}
        </View>
        {/* <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
          }}
        >
          <Text
            type="regular"
            size="small"
            style={{
              color: "#D75995",
              marginRight: 5,
            }}
          >
            {t("passwordRequired")}
          </Text>
        </View> */}
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
            text={t("submit")}
            onPress={() => resultChangeEmail(email1, email2, password)}
            style={{ width: "100%" }}
          />
        </View>
        <Peringatan
          aler={aler}
          setClose={() =>
            showAlert({ ...aler, show: false, judul: "", detail: "" })
          }
        />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      keyboardVerticalOffset={Notch ? 90 : 65}
      enabled
    >
      {/* <StatusBar backgroundColor="#14646E" /> */}
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      {/* <Loading show={loadingEmail} /> */}
      <ScrollView
        style={{
          backgroundColor: "white",
          height: "100%",
        }}
        contentContainerStyle={{
          height: Dimensions.get("screen").height * 0.8,
          paddingBottom: 20,
          justifyContent: "space-between",
          // borderWidth: 1
        }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            width: Dimensions.get("screen").width * 0.9,
            marginHorizontal: 20,
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LogoEmail height={250} width={250} />
          <Text size="h4" type="bold" style={{ marginTop: -30 }}>
            {t("ChangeEmail") + " " + "?"}
          </Text>
          <Text
            style={{
              textAlign: "center",
              marginVertical: 10,
              flexWrap: "wrap-reverse",
            }}
            size="label"
            type="regular"
          >
            {t("registerEmail")}
          </Text>
          <View
            style={{
              borderRadius: 3,
              height: Platform.OS == "ios" ? 50 : 45,
              backgroundColor: "#DAF0F2",
              borderWidth: 1,
              borderColor: "#209fae",
              width: "100%",
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: Platform.OS == "ios" ? 15 : null,
            }}
          >
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                fontSize: 14,
                width: "100%",
              }}
              ref={ref1}
              placeholder={t("currentEmail")}
              onChangeText={(e) => handleError1(e)}
              value={email1}
              onSubmitEditing={(e) => handleError1(e)}
            ></TextInput>
          </View>
          {error["emailError1"] === true ? (
            <View
              style={{
                marginTop: 5,
                width: Dimensions.get("screen").width - 40,
                marginHorizontal: 20,
              }}
            >
              <Text type="light" size="small" style={{ color: "#D75995" }}>
                {t("sampleEmail")}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              borderRadius: 3,
              height: Platform.OS == "ios" ? 50 : 45,
              backgroundColor: "#DAF0F2",
              borderWidth: 1,
              borderColor: "#209fae",
              width: "100%",
              marginTop: 10,
              paddingHorizontal: 10,
              paddingVertical: Platform.OS == "ios" ? 15 : null,
            }}
          >
            <TextInput
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                width: "100%",
                fontSize: 14,
              }}
              ref={ref2}
              value={email2}
              onChangeText={(e) => handleError2(e)}
              onSubmitEditing={(e) => handleError2(e)}
              placeholder={t("newEmail")}
            ></TextInput>
          </View>
          {error["emailError2"] === true ? (
            <View
              style={{
                marginTop: 5,
                width: Dimensions.get("screen").width - 40,
                marginHorizontal: 20,
              }}
            >
              <Text type="light" size="small" style={{ color: "#D75995" }}>
                {t("sampleEmail")}
              </Text>
            </View>
          ) : null}
        </View>
        <View
          style={{
            marginHorizontal: 20,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Button
            type="box"
            size="medium"
            disabled={
              disable1.length < 1 ||
              disable2.length == 0 ||
              error["emailError1"] == true ||
              error["emailError2"] == true
                ? true
                : false
            }
            color={
              disable1.length < 1 ||
              disable2.length == 0 ||
              error["emailError1"] == true ||
              error["emailError2"] == true
                ? "disabled"
                : "secondary"
            }
            text={t("save")}
            onPress={() => {
              setInputPassword(true);
              myStateRef.current = true;
            }}
            style={{ width: "100%" }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
