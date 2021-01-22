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
  };
  useEffect(() => {
    props.navigation.setOptions(NavigationComponent);
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

  const _handleResend = () => {
    props.route.params.resend();
    showAlert({
      ...aler,
      show: true,
      judul: "OTP Berhasil Di Kirim.",
      detail: "",
    });
  };

  const submitOtp = async (code = null) => {
    try {
      let { onebox, twobox, threebox, fourbox, fivebox, sixbox } = state;
      let code = onebox + twobox + threebox + fourbox + fivebox + sixbox;
      let { data } = await mutation({
        variables: { email: email, otp: parseInt(code) },
      });
      if (data.confirmotp.code !== "200") throw "Error";

      props.navigation.navigate("resetpwd", { email: email, otp: code });
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

  const onHandleChange = (e, rName, pName, next = null, prev = null) => {
    if (e.nativeEvent.key === "Backspace") {
      if (state[rName] === null) {
        prev ? prev.current.focus() : null;
        setState({ ...state, [pName]: null });
      } else {
        setState({ ...state, [rName]: null });
      }
    } else {
      next ? next.current.focus() : null;
      setState({ ...state, [rName]: e.nativeEvent.key });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
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
              Please verify your account
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
              justifyContent: "space-evenly",
              alignContent: "center",
              marginVertical: 25,
            }}
          >
            <View style={styles.numberInputView}>
              <TextInput
                ref={refBox1}
                value={state.onebox}
                style={styles.numberInputText}
                keyboardType="numeric"
                maxLength={1}
                blurOnSubmit={false}
                autoFocus={true}
                onKeyPress={(e) => onHandleChange(e, "onebox", null, refBox2)}
              />
            </View>
            <View style={styles.numberInputView}>
              <TextInput
                ref={refBox2}
                value={state.twobox}
                style={styles.numberInputText}
                keyboardType="numeric"
                maxLength={1}
                blurOnSubmit={false}
                onKeyPress={(e) =>
                  onHandleChange(e, "twobox", "onebox", refBox3, refBox1)
                }
              />
            </View>
            <View style={styles.numberInputView}>
              <TextInput
                ref={refBox3}
                value={state.threebox}
                style={styles.numberInputText}
                keyboardType="numeric"
                maxLength={1}
                blurOnSubmit={false}
                onKeyPress={(e) =>
                  onHandleChange(e, "threebox", "twobox", refBox4, refBox2)
                }
              />
            </View>
            <View style={styles.numberInputView}>
              <TextInput
                ref={refBox4}
                value={state.fourbox}
                style={styles.numberInputText}
                keyboardType="numeric"
                maxLength={1}
                blurOnSubmit={false}
                onKeyPress={(e) =>
                  onHandleChange(e, "fourbox", "threebox", refBox5, refBox3)
                }
              />
            </View>
            <View style={styles.numberInputView}>
              <TextInput
                ref={refBox5}
                value={state.fivebox}
                style={styles.numberInputText}
                keyboardType="numeric"
                maxLength={1}
                blurOnSubmit={false}
                onKeyPress={(e) =>
                  onHandleChange(e, "fivebox", "fourbox", refBox6, refBox4)
                }
              />
            </View>
            <View style={styles.numberInputView}>
              <TextInput
                ref={refBox6}
                value={state.sixbox}
                style={styles.numberInputText}
                keyboardType="numeric"
                maxLength={1}
                blurOnSubmit={false}
                onKeyPress={(e) =>
                  onHandleChange(e, "sixbox", "fivebox", null, refBox5)
                }
              />
            </View>
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

          <View style={{ marginTop: 20, flexDirection: "column" }}>
            <TouchableOpacity onPress={() => _handleResend()}>
              <Text style={styles.beforeSpecialText}>
                {t('"didntReceive"')}
              </Text>
              <Text style={styles.specialTextButton}>{`${t("resend")}`}</Text>
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
    margin: 50,
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
