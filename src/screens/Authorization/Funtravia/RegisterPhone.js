import React, { useState } from "react";
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
import { CustomImage, FloatingInput } from "../../../component";
import { phone_vektor } from "../../../assets/png";
import { Peringatan } from "../../../component";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import PhoneCodeSelector from "../../../component/src/PhoneCodeSelector";

export default function RegisterPhone(props) {
  const { t, i18n } = useTranslation();

  let [aler, showAlert] = useState({ show: false, judul: "", detail: "" });
  let [region, setRegion] = useState("+62");
  let [number, setNumber] = useState("");
  let [selector, setSelector] = useState(false);

  const requestNumber = async () => {
    if (!number || number === "") {
      showAlert({
        ...aler,
        show: true,
        judul: t("registerfailed"),
        detail: t("CheckYourNumber"),
      });
      return false;
    }

    props.navigation.navigate("ConfirmRegNumber", {
      region: region,
      number: number,
    });
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
          <View
            style={{
              width: Dimensions.get("window").width / 1.2,
              flexDirection: "row",
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text size="h5" type="bold">
              {t("createYourAccount")}
            </Text>
          </View>
          <View style={{ marginBottom: 20, flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setSelector(true)}
              style={{
                width: Dimensions.get("screen").width * 0.15,
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginTop: 15,
                marginRight: 5,
              }}
            >
              <Text
                size="title"
                style={{
                  color: "#030303",
                  paddingTop: 5,
                  marginTop: 10,
                  alignSelf: "center",
                  height: 29,
                }}
              >
                {region}
              </Text>
            </TouchableOpacity>
            <FloatingInput
              value={number}
              onChangeText={(text) => setNumber(text)}
              customTextStyle={{
                width: Dimensions.get("screen").width * 0.6,
                fontSize: 18,
                padding: 0,
              }}
              keyboardType="number-pad"
              label={t("phoneNumber")}
            />
          </View>
          <View
            style={{
              marginBottom: 80,
              alignItems: "center",
            }}
          >
            <Button
              onPress={requestNumber}
              text={t("next")}
              style={{ width: Dimensions.get("window").width / 1.2 }}
            />
          </View>
        </View>
        <PhoneCodeSelector
          show={selector}
          close={() => setSelector(false)}
          callBack={(e) => setRegion(e)}
          value={region}
        />
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
