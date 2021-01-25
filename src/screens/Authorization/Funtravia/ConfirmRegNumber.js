import React, { useState, useEffect } from "react";

import {
  Alert,
  StyleSheet,
  View,
  Platform,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import { CustomImage } from "../../../component";
import { Text, Button } from "../../../component";
import { phone_vektor } from "../../../assets/png";
import { useMutation } from "@apollo/react-hooks";
import Phonegql from "../../../graphQL/Mutation/Register/Phone";
import { useTranslation } from "react-i18next";

export default function ConfirmRegNumber(props) {
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

  let [sendNumber, { loading, data, error }] = useMutation(Phonegql);
  let [region, setRegion] = useState(
    props.navigation.state.params ? props.navigation.state.params.region : null
  );
  let [number, setNumber] = useState(
    props.navigation.state.params ? props.navigation.state.params.number : null
  );

  let [modalVisible, setModalVisible] = useState(false);

  const requestOTP = async () => {
    let response = await sendNumber({ variables: { nomor: region + number } });
    if (loading) {
      Alert.alert("Loading!!");
    }
    if (error) {
      throw new Error("Failed Send OTP");
    }

    // console.log(response);

    if (
      response.data.register_phone.code === 200 ||
      response.data.register_phone.code === "200"
    ) {
      props.navigation.navigate("OtpRegPhone", {
        userId: response.data.register_phone.id,
        number: number,
        region: region,
      });
    } else if (
      response.data.register_phone.code === 400 ||
      response.data.register_phone.code === "400"
    ) {
      // console.log(response.data);
      props.navigation.navigate("register", {
        error: response.data.register_phone.message,
      });
    } else {
      props.navigation.navigate("register", {
        error: "Failed Register With Phone Number",
      });
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
      <ScrollView
        style={{
          paddingTop: 80,
        }}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        <View
          style={{
            // flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CustomImage
            customStyle={{
              alignSelf: "center",
              width: 200,
              height: 175,
            }}
            source={phone_vektor}
          />
          <Text type="bold" size="h3">
            Do you have this phone?
          </Text>
          <View style={{ width: 220 }}>
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
              flexDirection: "row",
              marginBottom: 40,
              marginTop: 40,
            }}
          >
            <Text type="bold" size="h3">
              {region}
            </Text>
            <Text type="bold" size="h3">
              {number}
            </Text>
          </View>
          <View
            style={{
              marginBottom: 80,
              alignItems: "center",
            }}
          >
            <Button
              onPress={requestOTP}
              text={t("resend")}
              style={{ width: Dimensions.get("window").width / 1.2 }}
            />
            <TouchableOpacity
              onPress={() => props.navigation.navigate("LoginScreen")}
            >
              <Text
                style={{
                  marginTop: 10,
                  // color: '#27958B',
                }}
                size="description"
                type="regular"
              >
                {t("messageRates")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    margin: 50,
    alignItems: "center",
  },
  inputTextStyle: {
    width: Dimensions.get("window").width / 1.2,
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  openButton: {
    backgroundColor: "#D75995",
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
