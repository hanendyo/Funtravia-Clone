import React, { useState } from "react";
import Modal from "react-native-modal";
import { Input, Item, Label, View } from "native-base";
import { Pressable, Dimensions, Image } from "react-native";
import { Text } from "../../index";

export default function Errors({ modals, setModals, message }) {
  setTimeout(() => {
    setModals(false);
  }, 4000);
  return (
    <Modal
      animationType="fade"
      visible={modals}
      onModalHide={() => closeModal()}
      onRequestClose={() => setModals(!modals)}
    >
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1,
          width: Dimensions.get("screen").width * 0.6,
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => closeModal()}
          style={{
            backgroundColor: "#464646",
            alignItems: "center",
            borderRadius: 5,
            minHeight: 40,
            justifyContent: "center",
            flexDirection: "row",
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
        >
          {message ? (
            <Text size="description" type="regular" style={{ color: "#FFF" }}>
              {message.toString().replace("Error", "").replace(":", "")}
            </Text>
          ) : (
            <Text size="description" type="regular" style={{ color: "#FFF" }}>
              Failed
            </Text>
          )}
        </Pressable>
      </View>
    </Modal>
  );
}
