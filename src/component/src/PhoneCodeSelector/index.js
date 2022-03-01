import React from "react";
import { countryCallCode } from "./countryCallCode";
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  Text,
  Pressable,
} from "react-native";
import { Button } from "../../../component";
import { Xgray } from "../../../assets/svg";
import Modal from "react-native-modal";
import { useTranslation } from "react-i18next";
import { Picker as SelectPicker } from "@react-native-picker/picker";
export default function PhoneCodeSelector({
  show,
  close,
  callBack,
  value,
  onSelect,
}) {
  const { t } = useTranslation();
  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={show}
        onBackdropPress={close}
        onRequestClose={close}
        onDismiss={close}
      >
        <Pressable onPress={close} style={styles.modalSection} />
        <View style={styles.modalContainer}>
          <View style={styles.HeaderContainer}>
            <View style={styles.Header}>
              <Text size="title" type="bold" style={{ marginVertical: 15 }}>
                {t("selectCode")}
              </Text>
            </View>
            <Pressable onPress={close} style={styles.HeaderClose}>
              <Xgray width={15} height={15} />
            </Pressable>
            <View style={styles.PickerContainer}>
              <SelectPicker
                note
                mode="dropdown"
                selectedValue={value}
                style={styles.Picker}
                onValueChange={(itemValue) => callBack(itemValue)}
              >
                {countryCallCode.map((value, index) => {
                  return (
                    <SelectPicker.Item
                      key={index}
                      label={value.name + " (" + value.code + ")"}
                      value={value.code}
                    />
                  );
                })}
              </SelectPicker>
            </View>
            <View style={styles.FooterContainer}>
              <Button
                size="medium"
                style={{ width: "48%" }}
                variant="transparent"
                text={t("cancel")}
                onPress={close}
              ></Button>
              <Button
                size="medium"
                style={{ width: "48%" }}
                text={t("select")}
                onPress={onSelect}
              ></Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalSection: {
    width: Dimensions.get("screen").width + 20,
    height: Dimensions.get("screen").height,
    justifyContent: "center",
    opacity: 0.7,
    backgroundColor: "#000",
    position: "absolute",
    left: -25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    alignContent: "center",
    borderRadius: 5,
    width: Dimensions.get("screen").width - 110,
  },
  HeaderContainer: {
    backgroundColor: "#fff",
    width: Dimensions.get("screen").width - 110,
    borderRadius: 5,
  },
  Header: {
    backgroundColor: "#f6f6f6",
    borderRadius: 5,
    borderBottomColor: "#d1d1d1",
    borderBottomWidth: 1,
    alignItems: "center",
  },
  HeaderClose: {
    height: 50,
    width: 55,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  PickerContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderBottomColor: "#464646",
    borderBottomWidth: 1,
  },
  Picker: {
    height: Platform.OS === "ios" ? 200 : 40,
    width: "107%",
    fontSize: 14,
    fontFamily: "Lato-Regular",
    marginLeft: -8,
    elevation: 20,
  },
  FooterContainer: {
    marginVertical: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
});
