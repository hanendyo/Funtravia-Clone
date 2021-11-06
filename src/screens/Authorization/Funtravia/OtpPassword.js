import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  TextInput,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { CustomImage } from "../../../component";
import { sms_otp } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { Peringatan } from "../../../component";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";
import { Arrowbackblack } from "../../../assets/svg";

const CONFIRM = gql`
  mutation($email: String!, $otp: Int!) {
    confirmotp(input: { email: $email, otp_code: $otp }) {
      response_time
      message
      status
      code
    }
  }
`;

export default function OtpPassword(props) {
  const NavigationComponent = {
    title: "",
    headerShown: true,
    headerMode: "screen",
    headerTransparent: true,
    headerLeft: () => (
      <Button
        text={""}
        size="medium"
        type="circle"
        variant="transparent"
        onPress={() => props.navigation.goBack()}
        style={{
          height: 55,
          // borderWidth: 1,
          marginLeft: 15,
        }}
      >
        <Arrowbackblack height={20} width={20}></Arrowbackblack>
      </Button>
    ),
  };
  useEffect(() => {
    props.navigation.setOptions(NavigationComponent);
    hitungMundur();
  }, []);

  const { t, i18n } = useTranslation();

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let email = props.route.params ? props.route.params.email : "none";
  let [state, setState] = useState({
    onebox: null,
    twobox: null,
    threebox: null,
    fourbox: null,
    fivebox: null,
    sixbox: null,
  });

  let refBox1 = useRef(null);
  let refBox2 = useRef(null);
  let refBox3 = useRef(null);
  let refBox4 = useRef(null);
  let refBox5 = useRef(null);
  let refBox6 = useRef(null);
  const [mutation] = useMutation(CONFIRM);

  const resendOTP = async () => {
    await props.route.params.resend();
    await hitungMundur();
    // showAlert({
    //   ...aler,
    //   show: true,
    //   judul: "OTP Berhasil Di Kirim.",
    //   detail: "",
    // });
  };

  const submitOtp = async (code = null) => {
    try {
      let response = await mutation({
        variables: {
          email: email,
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
      if (response.data.confirmotp.code !== 200) {
        throw "Error";
      } else {
        props.navigation.navigate("resetpwd", {
          email: email,
          otp: parseFloat(
            state.onebox +
              state.twobox +
              state.threebox +
              state.fourbox +
              state.fivebox +
              state.sixbox
          ),
        });
      }
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "Failed to Confirm OTP",
        detail: "",
      });
      // Alert.alert('Wrong OTP', 'Failed Confirm OTP');
    }
  };

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

  let [Timer, setTimer] = useState(0);
  const hitungMundur = () => {
    var timeleft = 30;
    var downloadTimer = setInterval(function() {
      timeleft -= 1;
      setTimer(timeleft);
      if (timeleft === 0) {
        clearInterval(downloadTimer);
        return false;
      }
    }, 1000);
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
          paddingTop: 20,
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
              marginVertical: 5,
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
              {t("weJustSendRegister")}
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
              justifyContent: "space-evenly",
              alignContent: "center",
              marginVertical: 25,
              width: "100%",
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
          <View style={{ marginVertical: 25 }}>
            <Button
              onPress={submitOtp}
              style={{
                alignSelf: "center",
                width: Dimensions.get("window").width / 1.2,
              }}
              text={t("submit")}
            />
          </View>

          <View style={{ flexDirection: "column" }}>
            <Text size="description" type="regular">
              {t("didntReceive")}
            </Text>
            <TouchableOpacity
              onPress={() => resendOTP()}
              disabled={Timer === 0 ? false : true}
            >
              {Timer ? (
                <View
                  style={{ flexDirection: "row", justifyContent: "center" }}
                >
                  <Text
                    size="label"
                    type="bold"
                    style={{ textAlign: "center", color: "#209FAE" }}
                  >
                    {t("resend") + " " + "(" + Timer + ")"}
                  </Text>
                </View>
              ) : (
                <Text
                  size="label"
                  type="bold"
                  style={{ textAlign: "center", color: "#209FAE" }}
                >
                  {t("resend")}
                </Text>
              )}
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
    // flex: 1,
    margin: 20,
    alignItems: "center",
  },
  beforeSpecialText: {
    fontSize: 12,
    fontFamily: "Lato-Regular",
    alignSelf: "center",
  },
  specialTextButton: {
    fontFamily: "Lato-Bold",
    fontSize: 14,
    color: "#27958B",
    alignSelf: "center",
  },
  underlineStyleBase: {
    color: "#000000",
    fontSize: 25,
    width: 40,
    height: 40,
    fontFamily: "Lato-Bold",
    backgroundColor: "#F2F2F2",
  },

  underlineStyleHighLighted: {
    borderColor: "#27958B",
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
    alignItems: "center",
  },

  numberInputText: {
    fontFamily: "Lato-Bold",
    alignContent: "center",
    justifyContent: "center",
    borderBottomWidth: 0,
    fontSize: 25,
    // marginHorizontal: (13.5),
  },
});
