import React, {
  useState,
  useEffect,
  useRef,
  MutableRefObject,
  forwardRef,
} from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  TextInput,
  Dimensions,
  ScrollView,
  Platform,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { CustomText, CustomImage, Input } from "../../../component";
import { gql } from "apollo-boost";
import { phone_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Peringatan from "../../../component";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";

const OTP = gql`
  mutation Otp($user_id: ID!, $otp_code: Int!) {
    verification(input: { user_id: $user_id, otp_code: $otp_code }) {
      access_token
      refresh_token
      token_type
      response_time
      message
      status
      code
    }
  }
`;

export default function OtpPhone(props) {
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
  let [region, setRegion] = useState(
    props.navigation.state.params ? props.navigation.state.params.region : null
  );
  let [number, setNumber] = useState(
    props.navigation.state.params ? props.navigation.state.params.number : null
  );

  let [state, setState] = useState({
    onebox: "",
    twobox: "",
    threebox: "",
    fourbox: "",
    fivebox: "",
    sixbox: "",
  });

  let value = "";
  // console.log('value', value);
  Object.keys(state).map((val) => (value = value + val));

  const [mutation, { loading, data, error }] = useMutation(OTP);

  let refBox1 = useRef(null);
  let refBox2 = useRef(null);
  let refBox3 = useRef(null);
  let refBox4 = useRef(null);
  let refBox5 = useRef(null);
  let refBox6 = useRef(null);

  const onChange = (name, ref?: MutableRefObject<TextInput>) => (
    text: string
  ) => {
    if (text.trim() !== "") {
      setState({ ...state, [name]: text });
      console.log("name: " + name.value);
      ref && ref.current && ref.current.focus();
    } else {
      return;
    }
  };

  const signin = async () => {
    try {
      let pushTkn = await AsyncStorage.getItem("token");
      let response = await mutation({
        variables: {
          user_id: props.navigation.getParam("userId"),
          otp_code: value,
          token: pushTkn,
        },
      });
      if (response) {
        try {
          console.log("access_token=", response.data.verification.access_token);
          await AsyncStorage.setItem(
            "access_token",
            response.data.verification.access_token
          );
          props.navigation.navigate("Home");
        } catch (error) {
          // Alert.alert('failed to login');
          showAlert({
            ...aler,
            show: true,
            judul: "Failed  to login",
            detail: "",
          });
        }
      }
    } catch (error) {
      showAlert({
        ...aler,
        show: true,
        judul: "Failed  to login",
        detail: "verification error",
      });
      // Alert.alert('verification error');
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

            <View
              style={{
                flexDirection: "row",
                // marginBottom: (40),
                marginTop: 20,
              }}
            >
              <Text size="h5" type="bold">
                {`${region}  `}
              </Text>
              <Text size="h5" type="bold">
                {number}
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              // paddingTop: 10,
              justifyContent: "space-evenly",
              alignContent: "center",
              marginVertical: 20,
            }}
          >
            <Input
              ref={refBox1}
              onChangeText={onChange("onebox", refBox2)}
              customStyle={styles.numberInputView}
              autoFocus={true}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === " ") {
                  return false;
                }
              }}
            />
            <Input
              ref={refBox2}
              onChangeText={onChange("twobox", refBox3)}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace") {
                  refBox1 && refBox1.current && refBox1.current.focus();
                }
              }}
            />
            <Input
              ref={refBox3}
              onChangeText={onChange("threebox", refBox4)}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace") {
                  refBox2 && refBox2.current && refBox2.current.focus();
                }
              }}
            />
            <Input
              ref={refBox4}
              onChangeText={onChange("fourbox", refBox5)}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace") {
                  refBox3 && refBox3.current && refBox3.current.focus();
                }
              }}
            />
            <Input
              ref={refBox5}
              onChangeText={onChange("fivebox", refBox6)}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace") {
                  refBox4 && refBox4.current && refBox4.current.focus();
                }
              }}
            />
            <Input
              ref={refBox6}
              onChangeText={onChange("sixbox")}
              customStyle={styles.numberInputView}
              customTextStyle={styles.numberInputText}
              keyboardType="number-pad"
              maxLength={1}
              blurOnSubmit={false}
              onKeyPress={(e) => {
                if (e.nativeEvent.key === "Backspace") {
                  refBox5 && refBox5.current && refBox5.current.focus();
                }
              }}
            />
          </View>
          <Button
            onPress={signin}
            style={{
              alignSelf: "center",
              width: Dimensions.get("window").width / 1.2,
            }}
            text={t("verify")}
          />
          <View
            style={{
              marginTop: 20,
              marginBottom: 60,
              flexDirection: "column",
            }}
          >
            {/* <Text customTextStyle={styles.beforeSpecialText}>
							Didn't receive OTP Number?
						</Text> */}
            <Text style={styles.specialTextButton} isTouchable={true}>
              {t("resend")}
            </Text>
            <TouchableOpacity
              onPress={() => props.navigation.navigate("login")}
            >
              <Text
                type="bold"
                style={{
                  marginTop: 40,
                  color: "#27958B",
                }}
              >
                Try another way to sign in
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
