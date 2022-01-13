import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  Alert,
  ScrollView,
  Platform,
  TouchableOpacity,
  BackHandler,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@apollo/react-hooks";
import { mascot_black, logo_google, logo_facebook } from "../../assets/png";
import {
  Arrowbackblack,
  EyeActive,
  EyeNonactive,
  Arrowbackiosblack,
} from "../../assets/svg";
import Email from "../../graphQL/Mutation/Register/Email";
import {
  Text,
  Button,
  CustomImage,
  FloatingInput,
  Peringatan,
  PhoneCodeSelector,
} from "../../component";
import { useTranslation } from "react-i18next";
import { TextInput } from "react-native";
import normalize from "react-native-normalize";

export default function Register({ navigation }) {
  const { t, i18n } = useTranslation();
  const HeaderComponent = {
    headerShown: true,
    headerTransparent: false,
    headerTintColor: "black",
    headerTitle: (
      <Text
        type="bold"
        size="header"
        style={{ color: "black" }}
        allowFontScaling={false}
      >
        {t("register")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#fff",
      elevation: 0, // remove shadow on Android
      shadowOpacity: 0, // remove shadow on iOS
      borderBottomWidth: 0, // Just in case.
    },
    headerLeftContainerStyle: {
      background: "black",

      marginLeft: 10,
    },
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => navigation.goBack()}
        style={{
          height: 55,
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackiosblack height={15} width={15}></Arrowbackiosblack>
        ) : (
          <Arrowbackblack height={20} width={20}></Arrowbackblack>
        )}
      </Button>
    ),
  };
  let [choosePhone, setChoosePhone] = useState("+62");
  let [region, setRegion] = useState("+62");
  let [selector, setSelector] = useState(false);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [state, setState] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });
  let [hidePasswd, setHidePasswd] = useState(true);
  let [hidePasswdCnfrm, setHidePasswdCnfrm] = useState(true);

  const [mutation, { loading, data, error }] = useMutation(Email);
  const [registerFailed, setRegisterFailed] = useState(false);

  const register = async () => {
    if (
      state.first_name === "" ||
      state.email === "" ||
      state.password === "" ||
      state.password_confirmation === "" ||
      state.phone === ""
    ) {
      return setRegisterFailed(true);
    }

    let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
    for (let i in state) {
      let check = validation(i, state[i]);
      if (!check) {
        if (i === "last_name") {
          continue;
        }
        if (i == "password") {
          setItemValid({
            ...itemvalid,
            [i]: check,
            ["password_confirmation"]: check,
          });
        } else {
          setItemValid({ ...itemvalid, [i]: check });
        }
        showAlert({
          ...aler,
          show: true,
          judul: t("somefieldempty"),
          detail: error ? "" + error : 0,
        });
        return false;
      }
    }
    try {
      let response = await mutation({
        variables: {
          first_name: state?.first_name,
          last_name: state?.last_name,
          email: state?.email.toLowerCase(),
          phone: region + state?.phone,
          password: state?.password,
          password_confirmation: state?.password_confirmation,
          token: FCM_TOKEN,
        },
      });

      if (loading) {
        Alert.alert("Loading!!");
      }
      if (error) {
        throw new Error("Error Input");
      }
      if (response.data) {
        if (
          response.data.register.code === 200 ||
          response.data.register.code === "200"
        ) {
          navigation.navigate("otp", {
            userId: response.data.register.id,
            email: state.email,
          });
        } else {
          throw new Error(response.data.register.message);
        }
      }
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: t("registerfailed"),
        detail: "" + error ? t("alreadyexist") : "",
      });
    }
  };

  const login = () => {
    navigation.navigate("LoginScreen");
  };
  const togglePasswordTop = () => {
    setHidePasswd(!hidePasswd);
  };
  const togglePasswordBottom = () => {
    setHidePasswdCnfrm(!hidePasswdCnfrm);
  };

  let [itemvalid, setItemValid] = useState({
    first_name: true,
    last_name: true,
    email: true,
    phone: true,
    password: true,
    password_confirmation: true,
  });

  const validation = (name, value) => {
    var emailRegx = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@(([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!value || value === "") {
      return false;
    } else if (name === "email") {
      return value.match(emailRegx) ? true : false;
    } else if (name === "password") {
      return value.length >= 8 ? true : false;
    } else if (name === "password_confirmation") {
      return value.length >= 8 && value === state.password ? true : false;
    } else if (name === "phone" || name === "phone1" || name === "phone2") {
      return value.length <= 13 && value.length >= 6 ? true : false;
    } else {
      return true;
    }
  };

  const onChange = (name) => (text) => {
    let check = validation(name, text);
    setState({ ...state, [name]: name == "email" ? text.toLowerCase() : text });
    if (name == "password") {
      setItemValid({
        ...itemvalid,
        [name]: check,
        ["password_confirmation"]: check,
      });
    } else {
      setItemValid({ ...itemvalid, [name]: check });
    }
  };

  const externalRegister = (index) => {
    setTimeout(() => {
      navigation.navigate(index);
    }, 1000);
  };

  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
  };

  const backAction = () => {
    navigation.goBack();
    return true;
  };

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [backAction]);

  useEffect(() => {
    navigation.addListener("blur", () => {
      BackHandler.removeEventListener("hardwareBackPress", backAction);
    });
  }, [backAction]);

  useEffect(() => {
    AsyncStorage.setItem("isFirst", "false");
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
      }}
    >
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <CustomImage
          source={mascot_black}
          customStyle={{
            height: 180,
            width: 180,
            marginTop: Platform.OS === "ios" ? 30 : 20,
            alignSelf: "center",
          }}
        />

        <View style={{}}>
          <Text type="bold" size="h5">
            {t("createYourAccount")}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            // borderWidth: 1,
          }}
        >
          <View style={{ flex: 1 }}>
            <FloatingInput
              autoCorrect={false}
              customTextStyle={
                registerFailed === true && state.first_name === ""
                  ? styles.InputTextStyleFailed
                  : styles.InputTextStyle
              }
              value={state.first_name}
              onChangeText={onChange("first_name")}
              label={t("firstName")}
            />
            {registerFailed === true && state.first_name === "" ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  position: "absolute",
                  bottom: -15,
                }}
              >
                {t("inputWarningName")}
              </Text>
            ) : null}
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <FloatingInput
              autoCorrect={false}
              customTextStyle={{}}
              value={state.last_name}
              onChangeText={onChange("last_name")}
              label={t("lastName")}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <FloatingInput
            autoCorrect={false}
            value={state.email}
            keyboardType="default"
            onChangeText={onChange("email")}
            label="Email"
            autoCapitalize="none"
            customTextStyle={
              registerFailed === true && state.email === ""
                ? styles.InputTextStyleFailed
                : styles.InputTextStyle
            }
          />
          <View
            style={{
              flexDirection: "row",
              position: "absolute",
              bottom: -15,
            }}
          >
            {itemvalid.email === false && state.email.length !== 0 ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  marginRight: 5,
                }}
              >
                {`${t("inputWarningEmail")}`}
              </Text>
            ) : null}
            {registerFailed === true && state.email === "" ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                }}
              >
                {t("emailRequired")}
              </Text>
            ) : null}
          </View>
        </View>
        <View
          style={{
            marginTop: 15,
            marginBottom: 15,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            onPress={() => setSelector(true)}
            style={{
              borderBottomWidth: StyleSheet.hairlineWidth,
              zIndex: 10,
              paddingHorizontal: 25,
              justifyContent: "flex-end",
              backgroundColor: "rgba(0, 0, 0, 0)",
            }}
          />
          <TextInput
            style={{
              paddingBottom: 5,
              position: "absolute",
              top: Platform.OS === "ios" ? 32 : 16,
              left: 10,
              zIndex: 9,
              color: "#464646",
              fontSize: normalize(14),
            }}
            value={region}
            editable={false}
            onPressIn={() => setSelector(true)}
          />
          <View style={{ paddingLeft: 15, flex: 1 }}>
            <FloatingInput
              autoCorrect={false}
              value={state.phone}
              onChangeText={onChange("phone")}
              customTextStyle={
                registerFailed === true && state.phone === ""
                  ? styles.InputTextStyleFailed
                  : styles.InputTextStyle
              }
              keyboardType="number-pad"
              label={t("phoneNumber")}
            />
            <View
              style={{
                flexDirection: "row",
                position: "absolute",
                bottom: -15,
                left: 20,
              }}
            >
              {itemvalid.phone === false && state.phone.length !== 0 ? (
                <Text
                  type="regular"
                  size="small"
                  style={{
                    color: "#D75995",
                    marginRight: 5,
                  }}
                >
                  {t("inputWarningPhone")}
                </Text>
              ) : null}
              {registerFailed === true && state.phone === "" ? (
                <Text
                  type="regular"
                  size="small"
                  style={{
                    color: "#D75995",
                  }}
                >
                  {t("phoneNumberRequired")}
                </Text>
              ) : null}
            </View>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FloatingInput
              autoCorrect={false}
              value={state.password}
              onChangeText={onChange("password")}
              label={t("password")}
              secureTextEntry={hidePasswd}
              customTextStyle={
                registerFailed === true && state.password === ""
                  ? styles.InputTextStyleFailed
                  : styles.InputTextStyle
              }
            />
            <TouchableOpacity
              onPress={togglePasswordTop}
              style={{
                position: "absolute",
                top: 15,
                right: 5,
              }}
            >
              {hidePasswd ? (
                <EyeActive width={30} height={30} />
              ) : (
                <EyeNonactive width={30} height={30} />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", position: "absolute", bottom: -15 }}
          >
            {itemvalid.password === false && state.password.length !== 0 ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  marginRight: 5,
                }}
              >
                {t("inputWarningPassword")}
              </Text>
            ) : null}
            {registerFailed === true && state.password === "" ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                }}
              >
                {t("passwordRequired")}
              </Text>
            ) : null}
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <FloatingInput
              autoCorrect={false}
              customTextStyle={
                registerFailed === true && state.password_confirmation === ""
                  ? styles.InputTextStyleFailed
                  : styles.InputTextStyle
              }
              value={state.password_confirmation}
              onChangeText={onChange("password_confirmation")}
              label={t("reEnterPassword")}
              secureTextEntry={hidePasswdCnfrm}
            />
            <TouchableOpacity
              onPress={togglePasswordBottom}
              style={{
                position: "absolute",
                top: 15,
                right: 5,
              }}
            >
              {hidePasswdCnfrm ? (
                <EyeActive width={30} height={30} />
              ) : (
                <EyeNonactive width={30} height={30} />
              )}
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", position: "absolute", bottom: -15 }}
          >
            {itemvalid.password_confirmation === false &&
            state.password_confirmation.length !== 0 ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  marginRight: 5,
                }}
              >
                {t("inputWarningRepeatPassword")}
              </Text>
            ) : null}
            {registerFailed === true && state.password_confirmation === "" ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                }}
              >
                {t("passwordConfirmationRequired")}
              </Text>
            ) : null}
          </View>
        </View>
        <Button
          style={{
            marginTop: 40,
            alignSelf: "center",
            width: Dimensions.get("window").width / 1.2,
            height: Dimensions.get("window").height / 15,
            marginVertical: 20,
          }}
          color="secondary"
          onPress={() => register()}
          text={t("createYourAccount")}
        />
        <View
          style={{
            alignItems: "center",
            marginBottom: 180,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 50,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                marginHorizontal: 10,
              }}
            ></View>
            <Text style={{}}>{t("or")}</Text>
            <View
              style={{
                width: 50,
                borderBottomWidth: 1,
                borderBottomColor: "#d1d1d1",
                marginHorizontal: 10,
              }}
            ></View>
          </View>

          <View style={{ flexDirection: "row" }}>
            <CustomImage
              source={logo_google}
              isTouchable
              onPress={() => externalRegister("RegisterGoogleScreen")}
              customStyle={{
                marginHorizontal: 15,
                width: 50,
                height: 50,
              }}
            />
            <CustomImage
              source={logo_facebook}
              isTouchable
              onPress={() => externalRegister("RegisterFacebookScreen")}
              customStyle={{
                marginHorizontal: 15,
                width: 50,
                height: 50,
              }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
            marginBottom: 40,
            flexDirection: "column",
          }}
        >
          <Text style={{}}>{`${t("alreadyHave")} `}</Text>
          <TouchableOpacity onPress={login}>
            <Text type="bold" size="label" style={{ color: "#209fae" }}>
              {t("signIn")}
            </Text>
          </TouchableOpacity>
        </View>

        <PhoneCodeSelector
          show={selector}
          close={() => setSelector(false)}
          callBack={(e) => setChoosePhone(e)}
          value={choosePhone}
          onSelect={() => {
            setRegion(choosePhone);
            setSelector(false);
          }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  InputTextStyle: {
    borderBottomColor: "#464646",
    fontSize: normalize(14),
  },
  InputTextStyleFailed: {
    borderBottomColor: "#D75995",
    fontSize: normalize(14),
  },
});
