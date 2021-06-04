import React, { useState } from "react";
import { countryCallCode } from "./countryCallCode";
import {
  // Modal,
  Picker,
  View,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Text,
} from "react-native";
import Modal from "react-native-modal";
export default function PhoneCodeSelector({ show, close, callBack, value }) {
  const screen = Dimensions.get("screen");
  const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 5,
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
      backgroundColor: "#F194FF",
      borderRadius: 5,
      padding: 10,
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
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={show}
        onBackdropPress={close}
        onRequestClose={close}
        onDismiss={close}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={{ color: "black", fontWeight: "500", fontSize: 20 }}>
              Select Code
            </Text>
            <View
              style={{
                borderWidth: 1,
                marginVertical: 10,
                borderRadius: 5,
                borderColor: "#d1d1d1",
              }}
            >
              <Picker
                selectedValue={value}
                style={{
                  height: Platform.OS === "ios" ? screen.height / 3 : 30,
                  // height: 30,
                  width: screen.width / 1.5,
                  // borderWidth: 1,
                }}
                onValueChange={(itemValue, itemIndex) => callBack(itemValue)}
              >
                {countryCallCode.map((value, index) => {
                  return (
                    <Picker.Item
                      key={index}
                      label={value.name + " (" + value.code + ")"}
                      value={value.code}
                    />
                  );
                })}
              </Picker>
            </View>
            <TouchableOpacity
              onPress={close}
              style={{
                paddingHorizontal: 25,
                paddingVertical: 10,
                backgroundColor: "#D75995",
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white" }}>Select</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
