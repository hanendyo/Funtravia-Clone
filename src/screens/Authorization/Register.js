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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation } from "@apollo/react-hooks";
import { mascot_black, logo_google, logo_facebook } from "../../assets/png";
import { EyeActive, EyeNonactive } from "../../assets/svg";
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

export default function Register({ navigation }) {
  const { t, i18n } = useTranslation();
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

  let [itemvalid, setItemValid] = useState({
    first_name: true,
    last_name: true,
    email: true,
    phone: true,
    password: true,
    password_confirmation: true,
  });

  let [hidePasswd, setHidePasswd] = useState(true);
  let [hidePasswdCnfrm, setHidePasswdCnfrm] = useState(true);

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

  const [mutation, { loading, data, error }] = useMutation(Email);

  const register = async () => {
    let FCM_TOKEN = await AsyncStorage.getItem("FCM_TOKEN");
    for (let i in state) {
      let check = validation(i, state[i]);
      if (!check) {
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
          judul: "somefieldempty",
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
          email: state?.email,
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
        judul: "registerfailed",
        detail:
          "" +
          error
            .toString()
            .replace("Error", "")
            .replace(":", ""),
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

  useEffect(() => {
    const backAction = () => {
      BackHandler.addEventListener(navigation.goBack());
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // return () => backHandler.remove();
  });

  useEffect(() => {
    navigation.setOptions(NavigationComponent);
    AsyncStorage.setItem("isFirst", "false");
  }, []);

  return (
    <View
      style={{
        flex: 1,
      }}
      // behavior={Platform.OS === "ios" ? "padding" : null}
      // keyboardVerticalOffset={30}
      // enabled
    >
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
        stickyHeaderIndices={[1]}
      >
        <CustomImage
          source={mascot_black}
          customStyle={{
            height: 180,
            width: 180,
            marginTop: Platform.OS === "ios" ? 30 : 50,
            alignSelf: "flex-start",
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
              customTextStyle={{
                color: "#464646",
              }}
              value={state.first_name}
              onChangeText={onChange("first_name")}
              label={t("firstName")}
            />
            {itemvalid.first_name === false ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  position: "absolute",
                  bottom: -15,
                }}
              >
                {`${t("inputWarningName")}${t("firstName")}`}
              </Text>
            ) : null}
          </View>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <FloatingInput
              customTextStyle={{}}
              value={state.last_name}
              onChangeText={onChange("last_name")}
              label={t("lastName")}
            />
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <FloatingInput
            value={state.email}
            keyboardType="email-address"
            onChangeText={onChange("email")}
            label="Email"
            // customTextStyle={{
            //   color: itemvalid.first_name === false ? "#464646" : "#D75995",
            // }}
          />
          {itemvalid.email === false ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",

                position: "absolute",
                bottom: -15,
              }}
            >
              {`${t("inputWarningEmail")}`}
            </Text>
          ) : null}
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

              paddingHorizontal: 15,
              justifyContent: "flex-end",
            }}
          >
            <TextInput style={{ padding: 0 }} value={region} editable={false} />
          </TouchableOpacity>
          <View style={{ paddingLeft: 15, flex: 1 }}>
            <FloatingInput
              value={state.phone}
              onChangeText={onChange("phone")}
              customTextStyle={{
                fontSize: 14,
                padding: 0,
              }}
              keyboardType="number-pad"
              label={t("phoneNumber")}
            />
            {itemvalid.phone === false ? (
              <Text
                type="regular"
                size="small"
                style={{
                  color: "#D75995",
                  left: 20,
                  position: "absolute",
                  bottom: -15,
                }}
              >
                {t("inputWarningPhone")}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <FloatingInput
              customTextStyle={{}}
              value={state.password}
              onChangeText={onChange("password")}
              label={t("password")}
              secureTextEntry={hidePasswd}
            />
            <TouchableOpacity
              onPress={togglePasswordTop}
              style={{
                // height: 35,
                // width: 35,
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
          {itemvalid.password === false ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",

                position: "absolute",
                bottom: -15,
              }}
            >
              {t("inputWarningPassword")}
            </Text>
          ) : null}
        </View>
        <View style={{ flex: 1, marginTop: 15 }}>
          <View style={{ flex: 1 }}>
            <FloatingInput
              customTextStyle={{}}
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
          {itemvalid.password_confirmation === false ? (
            <Text
              type="regular"
              size="small"
              style={{
                color: "#D75995",

                position: "absolute",
                bottom: -15,
              }}
            >
              {t("inputWarningRepeatPassword")}
            </Text>
          ) : null}
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
          callBack={(e) => setRegion(e)}
          value={region}
        />
      </ScrollView>
    </View>
  );
}
