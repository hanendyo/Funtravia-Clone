import React, { useState, useEffect, useRef } from "react";
import { Arrowbackwhite, LogoEmail } from "../../../assets/svg";
import { Text, Button, Loading } from "../../../component";
import { useTranslation } from "react-i18next";
import { View, Dimensions, CheckBox } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput } from "react-native-gesture-handler";
import { useMutation } from "@apollo/client";
import verifyEmail from "../../../graphQL/Mutation/Setting/verifyEmail";

export default function SettingEmailVerify(props) {
  let [token, setToken] = useState("");
  let { t, i18n } = useTranslation();
  let [setting, setSetting] = useState("");
  let refBox1 = useRef(null);
  let refBox2 = useRef(null);
  let refBox3 = useRef(null);
  let refBox4 = useRef(null);
  let refBox5 = useRef(null);
  let refBox6 = useRef(null);

  let [state, setState] = useState({
    onebox: null,
    twobox: null,
    threebox: null,
    fourbox: null,
    fivebox: null,
    sixbox: null,
  });

  const HeaderComponent = {
    headerTitle: "Verifiy Email",
    // headerTitle: t("ChangeEmail"),
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

  useEffect(() => {
    props.navigation.setOptions(HeaderComponent);
    const unsubscribe = props.navigation.addListener("focus", () => {
      loadAsync();
    });
    return unsubscribe;
  }, [props.navigation]);

  const onHandleChange = async (
    e,
    rName,
    pName,
    next = null,
    prev = null,
    nName
  ) => {
    state[rName] = e;
    if (state[rName] == "") {
      state[rName] = null;
    } else {
      next ? next.current.focus() : null;
    }

    // if (e.nativeEvent.key === "Backspace") {
    //   if (state[rName] === null) {
    //     (await prev) ? prev.current.focus() : null;
    //     await setState({ ...state, [pName]: null });
    //   } else {
    //     await setState({ ...state, [rName]: null });
    //   }
    // } else {
    //   await setState({ ...state, [rName]: e.nativeEvent.key });
    //   (await next) ? next.current.focus() : null;
    // }
  };

  const [
    mutationVerifyEmail,
    { loading: loadingVerify, data: dataVerify, error: errorVerify },
  ] = useMutation(verifyEmail, {
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const resultVerifyEmail = async () => {
    if (token || token !== "") {
      try {
        let response = await mutationVerifyEmail({
          variables: {
            newEmail: props.route.params.emailNew,
            otp: parseFloat(
              state.onebox +
                state.twobox +
                state.threebox +
                state.fourbox +
                state.fivebox +
                state.sixbox
            ),
          },
        });
        if (errorVerify) {
          throw new Error("Email verification failed");
        }
        if (loadingVerify) {
          alert("Loading!!");
        }
        if (response.data) {
          if (response.data.change_email_verification.code !== 200) {
            throw new Error(response.data.change_email_verification.message);
          }
          let tmp_data = { ...setting };
          tmp_data.user.email = props.route.params.emailNew;
          await setSetting(tmp_data);
          await AsyncStorage.setItem("setting", JSON.stringify(tmp_data));
          await props.navigation.navigate("SettingsAkun", { setting: setting });
        }
      } catch (error) {
        alert("" + error);
      }
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Loading show={loadingVerify} />
      <View
        style={{
          width: Dimensions.get("screen").width * 0.9,
          marginHorizontal: 20,
          marginTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LogoEmail height={200} width={200} />
        <Text size="title" type="bold">
          {t("verifyEmail")}
        </Text>
        <Text
          style={{
            textAlign: "center",
            marginVertical: 10,
            flexWrap: "wrap-reverse",
          }}
          size="description"
          type="regular"
        >
          {t("verifyOtp") + " " + props.route.params.emailOld}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingTop: 10,
          width: "100%",
          justifyContent: "space-evenly",
          alignContent: "center",
          marginVertical: 25,
          // borderWidth: 1,
        }}
      >
        <TextInput
          ref={refBox1}
          autoFocus={true}
          style={{
            backgroundColor: "#f3f3f3",
            fontFamily: "Lato-Bold",
            fontSize: 30,
            width: 50,
            height: 50,
            borderRadius: 5,
            padding: 0,
            textAlign: "center",
          }}
          text={state.onebox}
          keyboardType="number-pad"
          maxLength={1}
          blurOnSubmit={false}
          onChangeText={(e) =>
            onHandleChange(e, "onebox", null, refBox2, null, "twobox")
          }
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Backspace") {
              refBox1 && refBox1.current && refBox1.current.focus();
            }
          }}
        />
        <TextInput
          ref={refBox2}
          style={{
            backgroundColor: "#f3f3f3",
            fontFamily: "Lato-Bold",
            fontSize: 30,
            width: 50,
            height: 50,
            borderRadius: 5,
            padding: 0,
            textAlign: "center",
          }}
          text={state.twobox}
          keyboardType="number-pad"
          maxLength={1}
          blurOnSubmit={false}
          onChangeText={(e) =>
            onHandleChange(e, "twobox", "onebox", refBox3, refBox1, "threebox")
          }
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Backspace" && state["twobox"] === null) {
              refBox1 && refBox1.current && refBox1.current.focus();
            }
          }}
        />
        <TextInput
          ref={refBox3}
          style={{
            backgroundColor: "#f3f3f3",
            fontFamily: "Lato-Bold",
            fontSize: 30,
            width: 50,
            height: 50,
            borderRadius: 5,
            padding: 0,
            textAlign: "center",
          }}
          text={state.threebox}
          keyboardType="number-pad"
          maxLength={1}
          blurOnSubmit={false}
          onChangeText={(e) =>
            onHandleChange(e, "threebox", "twobox", refBox4, refBox2, "fourbox")
          }
          onKeyPress={(e) => {
            if (
              e.nativeEvent.key === "Backspace" &&
              state["threebox"] === null
            ) {
              refBox2 && refBox2.current && refBox2.current.focus();
            }
          }}
        />
        <TextInput
          ref={refBox4}
          style={{
            backgroundColor: "#f3f3f3",
            fontFamily: "Lato-Bold",
            fontSize: 30,
            width: 50,
            height: 50,
            borderRadius: 5,
            padding: 0,
            textAlign: "center",
          }}
          text={state.fourbox}
          keyboardType="number-pad"
          maxLength={1}
          blurOnSubmit={false}
          onChangeText={(e) =>
            onHandleChange(
              e,
              "fourbox",
              "threebox",
              refBox5,
              refBox3,
              "fivebox"
            )
          }
          onKeyPress={(e) => {
            if (
              e.nativeEvent.key === "Backspace" &&
              state["fourbox"] === null
            ) {
              refBox3 && refBox3.current && refBox3.current.focus();
            }
          }}
        />
        <TextInput
          ref={refBox5}
          style={{
            backgroundColor: "#f3f3f3",
            fontFamily: "Lato-Bold",
            fontSize: 30,
            width: 50,
            height: 50,
            borderRadius: 5,
            padding: 0,
            textAlign: "center",
          }}
          text={state.fivebox}
          keyboardType="number-pad"
          maxLength={1}
          blurOnSubmit={false}
          onChangeText={(e) =>
            onHandleChange(e, "fivebox", "fourbox", refBox6, refBox4, "sixbox")
          }
          onKeyPress={(e) => {
            if (
              e.nativeEvent.key === "Backspace" &&
              state["fivebox"] === null
            ) {
              refBox4 && refBox4.current && refBox4.current.focus();
            }
          }}
        />
        <TextInput
          ref={refBox6}
          style={{
            backgroundColor: "#f3f3f3",
            fontFamily: "Lato-Bold",
            fontSize: 30,
            width: 50,
            height: 50,
            borderRadius: 5,
            padding: 0,
            textAlign: "center",
          }}
          text={state.sixbox}
          keyboardType="number-pad"
          maxLength={1}
          blurOnSubmit={false}
          onChangeText={(e) =>
            onHandleChange(e, "sixbox", "fivebox", null, refBox5)
          }
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Backspace" && state["sixbox"] === null) {
              refBox5 && refBox5.current && refBox5.current.focus();
            }
          }}
        />
      </View>
      <View
        style={{
          marginHorizontal: 20,
          marginVertical: Dimensions.get("screen").height * 0.15,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Button
          type="box"
          size="medium"
          color="secondary"
          text={t("save")}
          onPress={() => resultVerifyEmail()}
          style={{ width: "100%" }}
        />
      </View>
    </View>
  );
}
