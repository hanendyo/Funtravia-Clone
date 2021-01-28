import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CustomImage } from "../../../component";
import { sms_otp } from "../../../assets/png";
import { useMutation, useLazyQuery, gql } from "@apollo/react-hooks";
import Otpgql from "../../../graphQL/Mutation/Register/OtpAuth";
import RESEND from "../../../graphQL/Mutation/Register/ResendOtpRegEmail";
// import GetSetting from "../../../graphQL/Query/Settings/GetSetting";
import { Peringatan } from "../../../component";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { Input } from "native-base";
// import GetSetting from "../../../graphQL/Query/Settings/GetSetting";

export default function OtpAuth(props) {
  const GetSetting = gql`
    query {
      setting_data {
        user_id
        countries {
          id
          name
          code
          description
          map
          flag
          suggestion
        }
        currency {
          id
          name
          code
        }
        aktivasi_akun
        price_notif
        status_order_and_payment
        hotels_and_flight_info
        funtravia_promo
        review_response
        payment_remender
        user {
          id
          first_name
          last_name
          username
          bio
          email
          phone
          password
          birth_date
          gender
          picture
          created_at
          updated_at
        }
      }
    }
  `;

  const { t, i18n } = useTranslation();
  let [token, setToken] = useState("");
  const [resend] = useMutation(RESEND);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let email = props.route.params.email;
  let [state, setState] = useState({
    onebox: null,
    twobox: null,
    threebox: null,
    fourbox: null,
    fivebox: null,
    sixbox: null,
  });

  const [mutation, { loading, data, error }] = useMutation(Otpgql);

  const [
    GetDataSetting,
    { data: datas, loading: loadings, error: errors },
  ] = useLazyQuery(GetSetting, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  let refBox1 = useRef(null);
  let refBox2 = useRef(null);
  let refBox3 = useRef(null);
  let refBox4 = useRef(null);
  let refBox5 = useRef(null);
  let refBox6 = useRef(null);

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

  const settingcreate = async () => {
    GetDataSetting();
    await GetDataSetting();
    if (datas && datas.setting_data) {
      await AsyncStorage.setItem("setting", JSON.stringify(datas.setting_data));
    }
  };

  const signin = async () => {
    let fcm = await AsyncStorage.getItem("FCM_TOKEN");
    try {
      let response = await mutation({
        variables: {
          user_id: props.route.params.userId,
          otp_code: parseFloat(
            state.onebox +
              state.twobox +
              state.threebox +
              state.fourbox +
              state.fivebox +
              state.sixbox
          ),
          token: fcm,
        },
      });
      // console.log(response);
      if (response.data.verification.access_token) {
        try {
          console.log(response.data.verification.data_setting);
          setToken(response.data.verification.access_token);
          await AsyncStorage.setItem(
            "access_token",
            response.data.verification.access_token
          );
          await AsyncStorage.setItem(
            "setting",
            JSON.stringify(response.data.verification.data_setting)
          );
          props.navigation.navigate("BottomStack", { screen: "HomeScreen" });

          // settingcreate();
        } catch (error) {
          // Alert.alert('failed to login');
          showAlert({
            ...aler,
            show: true,
            judul: "Sorry..",
            detail: response.data.verification.message,
          });
        }
      } else {
        showAlert({
          ...aler,
          show: true,
          judul: "Sorry..",
          detail: response.data.verification.message,
        });
      }
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "Verification Failed",
        detail: "",
      });
      // Alert.alert('verification error');
    }
  };

  let [Timer, setTimer] = useState(0);
  const hitungMundur = () => {
    var timeleft = 30;
    var downloadTimer = setInterval(function () {
      timeleft -= 1;
      setTimer(timeleft);
      if (timeleft === 0) {
        clearInterval(downloadTimer);
        return false;
      }
    }, 1000);
  };
  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
  };
  useEffect(() => {
    props.navigation.setOptions(NavigationComponent);
    hitungMundur();
  }, []);

  const resendOTP = async () => {
    try {
      console.log("response");
      let response = await resend({
        variables: {
          user_id: props.route.params.userId,
          email: props.route.params.email,
        },
      });
      console.log(response);
      hitungMundur();
      // Alert.alert('Success Send OTP');
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "Failed Send OTP",
        detail: "",
      });
      // Alert.alert('Failed Send OTP');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
      behavior={Platform.OS === "ios" ? "padding" : null}
      // keyboardVerticalOffset={30}
      enabled
    >
      <Peringatan
        aler={aler}
        setClose={() =>
          showAlert({ ...aler, show: false, judul: "", detail: "" })
        }
      />
      <ScrollView
        style={{
          paddingTop: 40,
          backgroundColor: "white",
        }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View style={styles.main}>
          {/* <View> */}
          <CustomImage
            customStyle={{
              alignSelf: "center",
              width: 150,
              height: 150,
            }}
            source={sms_otp}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-evenly",
              marginVertical: 10,
            }}
          >
            <Text size="h5" type="bold">
              {t("enterVerificationCode")}
            </Text>
          </View>
          <View
            style={{
              alignContent: "center",
              justifyContent: "space-evenly",
              marginVertical: 10,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                textAlign: "center",
              }}
              type="regular"
              size="description"
            >
              {t("weJustSend")}
            </Text>
          </View>
          <View
            style={{
              alignContent: "center",
              justifyContent: "space-evenly",
              marginVertical: 5,
            }}
          >
            <Text
              numberOfLines={2}
              style={{
                textAlign: "center",
              }}
              type="regular"
              size="description"
            >
              {email}
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
              // style={styles.numberInputView}
              autoFocus={true}
              // textStyle={styles.numberInputText}
              style={{
                backgroundColor: "#f3f3f3",
                fontFamily: "Lato-Bold",
                fontSize: 30,
                // borderWidth: 1,
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
                // borderWidth: 1,
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
                onHandleChange(
                  e,
                  "twobox",
                  "onebox",
                  refBox3,
                  refBox1,
                  "threebox"
                )
              }
              onKeyPress={(e) => {
                if (
                  e.nativeEvent.key === "Backspace" &&
                  state["twobox"] === null
                ) {
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
                // borderWidth: 1,
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
                onHandleChange(
                  e,
                  "threebox",
                  "twobox",
                  refBox4,
                  refBox2,
                  "fourbox"
                )
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
                // borderWidth: 1,
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
                // borderWidth: 1,
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
                onHandleChange(
                  e,
                  "fivebox",
                  "fourbox",
                  refBox6,
                  refBox4,
                  "sixbox"
                )
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
                // borderWidth: 1,
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
                if (
                  e.nativeEvent.key === "Backspace" &&
                  state["sixbox"] === null
                ) {
                  refBox5 && refBox5.current && refBox5.current.focus();
                }
              }}
            />
          </View>
          <Button
            color={"primary"}
            onPress={() => signin()}
            style={{
              width: Dimensions.get("window").width - 55,
            }}
            text={t("verify")}
          />
          <View
            style={{
              marginTop: 20,
              marginBottom: 30,
              flexDirection: "column",
            }}
          >
            <Text style={styles.beforeSpecialText}>{t('"didntReceive"')}</Text>
            <TouchableOpacity
              onPress={() => resendOTP()}
              disabled={Timer === 0 ? false : true}
            >
              <Text style={styles.specialTextButton}>
                {`${t("resend")} ${Timer > 0 ? Timer : ""}`}
              </Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    marginHorizontal: 20,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerText: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    alignSelf: "flex-end",
  },
  beforeSpecialText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    alignSelf: "center",
  },
  welcomeText: {
    height: 50,
    width: 500,
    alignSelf: "center",
  },
  specialTextButton: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "#27958B",
    alignSelf: "center",
  },
  logoView: {
    height: 200,
    width: 200,
    alignSelf: "flex-start",
  },
  numberInputView: {
    marginHorizontal: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    width: (Dimensions.get("window").width - 100) / 6,
    height: (Dimensions.get("window").width - 100) / 6,
    backgroundColor: "#F2F2F2",
    justifyContent: "center",
    alignContent: "center",
    // alignItems: 'center',
  },
  numberInputText: {
    fontFamily: "Lato-Bold",
    alignContent: "center",
    justifyContent: "center",
    borderBottomWidth: 0,
    fontSize: 25,
    paddingLeft: 15,
  },
});
