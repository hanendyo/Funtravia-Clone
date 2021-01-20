import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CustomImage, Input } from "../../../component";
import { phone_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Otpgql from "../../../graphQL/Mutation/Login/VerificationLoginPhone";
import { Peringatan } from "../../../component";
import { TouchableOpacity } from "react-native-gesture-handler";
import RESEND from "../../../graphQL/Mutation/Register/ResenOtpRegPhone";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../../../component";

export default function OtpLoginPhone(props) {
  const { t, i18n } = useTranslation();

  const [resend] = useMutation(RESEND);
  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [region, setRegion] = useState(
    props.navigation.state.params ? props.navigation.state.params.region : null
  );
  let [number, setNumber] = useState(
    props.navigation.state.params ? props.navigation.state.params.number : null
  );

  let [state, setState] = useState({
    onebox: null,
    twobox: null,
    threebox: null,
    fourbox: null,
    fivebox: null,
    sixbox: null,
  });

  const [mutation, { loading, data, error }] = useMutation(Otpgql);

  let refBox1 = useRef(null);
  let refBox2 = useRef(null);
  let refBox3 = useRef(null);
  let refBox4 = useRef(null);
  let refBox5 = useRef(null);
  let refBox6 = useRef(null);

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
      // console.log(e.nativeEvent.key);
      setState({ ...state, [rName]: e.nativeEvent.key });
    }
  };

  const signin = async () => {
    try {
      let response = await mutation({
        variables: {
          phone: region + number,
          otp_code:
            state.onebox +
            state.twobox +
            state.threebox +
            state.fourbox +
            state.fivebox +
            state.sixbox,
        },
      });
      if (response) {
        try {
          // console.log('access_token=', response.data.verification.access_token);
          await AsyncStorage.setItem(
            "access_token",
            response.data.login_phone_verification.access_token
          );
          props.navigation.navigate("Home");
        } catch (error) {
          // Alert.alert('failed to login');
          showAlert({
            ...aler,
            show: true,
            judul: "Failed to login",
            detail: "",
          });
        }
      }
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "Failed to login",
        detail: "verification error",
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
    // return false;
    // // hold sebelum graph

    let phoneNumber =
      props.navigation.getParam("region") + props.navigation.getParam("number");
    try {
      let response = await resend({
        variables: {
          nomor: phoneNumber,
        },
      });
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
            source={phone_vektor}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-evenly",
              marginVertical: 10,
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
              {t("sentToYour")}
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
              {region + number}
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
            <Input
              ref={refBox1}
              customStyle={styles.numberInputView}
              autoFocus={true}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => onHandleChange(e, "onebox", null, refBox2)}
            />
            <Input
              ref={refBox2}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) =>
                onHandleChange(e, "twobox", "onebox", refBox3, refBox1)
              }
            />
            <Input
              ref={refBox3}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) =>
                onHandleChange(e, "threebox", "twobox", refBox4, refBox2)
              }
            />
            <Input
              ref={refBox4}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) =>
                onHandleChange(e, "fourbox", "threebox", refBox5, refBox3)
              }
            />
            <Input
              ref={refBox5}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) =>
                onHandleChange(e, "fivebox", "fourbox", refBox6, refBox4)
              }
            />
            <Input
              ref={refBox6}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) =>
                onHandleChange(e, "sixbox", "fivebox", null, refBox5)
              }
            />
          </View>
          <Button onPress={signin} text={t("verify")} />
          <View
            style={{
              marginTop: 20,
              marginBottom: 30,
              flexDirection: "column",
            }}
          >
            <Text style={styles.beforeSpecialText}>{t("didntReceive")}</Text>

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
    // flex: 1,
    marginHorizontal: 48,
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
    fontSize: 16,
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
