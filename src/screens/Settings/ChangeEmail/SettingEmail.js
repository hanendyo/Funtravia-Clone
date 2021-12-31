import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Arrowbackios,
  Arrowbackwhite,
  EyeActive,
  EyeNonactive,
  PasswordUpdateEmail,
} from "../../../assets/svg";
import { Text, Button, Peringatan } from "../../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, Pressable, BackHandler } from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { Input, Item, Label } from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import addEmail from "../../../graphQL/Mutation/Setting/addEmail";
import { useMutation } from "@apollo/client";
import { RNToasty } from "react-native-toasty";
import { setTokenApps } from "../../../redux/action";
import { useDispatch } from "react-redux";

export default function SettingEmail(props) {
  let dispatch = useDispatch();
  const [token, setToken] = useState(props.route.params.token);
  const [setting, setSetting] = useState(props.route.params.setting);
  const { t, i18n } = useTranslation();
  const [inputPassword, setInputPassword] = useState(false);
  const myStateRef = React.useRef(inputPassword);
  const [ishide, setIshide] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginFailed, setLoginFailed] = useState(false);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });

  const HeaderComponent = {
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("AddEmail")}
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
    // dispatch(setTokenApps(`Bearer ${tkn}`));
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const [
    mutationAddEmail,
    { loading: loadingEmail, data: dataEmail, error: errorMutationEmail },
  ] = useMutation(addEmail, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    },
  });

  const _handleSubmit = async () => {
    if (email == "") {
      return showAlert({
        ...aler,
        show: true,
        judul: t("canNotEmpty"),
      });
    }
    if (token || token !== "") {
      try {
        let response = await mutationAddEmail({
          variables: {
            new_email: email,
            password: password,
          },
        });

        if (response.data) {
          if (response.data.addemail.code !== 200) {
            RNToasty.Show({
              title: t("failedChangeEmail"),
              position: "bottom",
            });

            throw new Error(response.data.addemail.message);
          } else {
            await props.navigation.navigate("SettingEmailVerify", {
              emailNew: email,
              token: token,
              // emailOld: oldEmail,
            });
          }
        }
      } catch (error) {
        showAlert({
          ...aler,
          show: true,
          judul: error,
          // detail: "lorem ipsum lorem ipsum lorem ipsum",
        });
      }
    } else {
      showAlert({
        ...aler,
        show: true,
        judul: "failed",
        // detail: "lorem ipsum lorem ipsum lorem ipsum",
      });
    }
  };

  if (inputPassword) {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            // width: Dimensions.get("screen").width * 0.9,
            marginHorizontal: 20,
            marginTop: 50,
            marginBottom: 50,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View></View>
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
            {t("inputPasswordAddEmail")}
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
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
          }}
        >
          {loginFailed === true && email.length === 0 ? (
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
          ) : null}
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
            text={t("submit")}
            onPress={() => _handleSubmit()}
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
            value={email}
            onChangeText={(text) => _handleOnChange(text, "email")}
            keyboardType="email-address"
          />
        </Item>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
        }}
      >
        {loginFailed === true && email.length === 0 ? (
          <Text
            type="regular"
            size="small"
            style={{
              color: "#D75995",
              marginRight: 5,
            }}
          >
            {t("emailRequired")}
          </Text>
        ) : null}
        {itemValid.email === false ? (
          <Text
            type="regular"
            size="small"
            style={{
              color: "#D75995",
            }}
          >
            {t("sampleEmail")}
          </Text>
        ) : null}
      </View>
      <View
        style={{
          width: "100%",
          paddingHorizontal: 20,
          marginTop: 20,
          flexDirection: "row",
          // justifyContent: "center",
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
        {/* <CheckBox
        // value={true}
        // onValueChange={setSelection}
        /> */}
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
          onPress={() => {
            if (itemValid.email === true) {
              setInputPassword(true);
              myStateRef.current = true;
            }
          }}
          style={{ width: "100%" }}
        />
      </View>
    </View>
  );
}
