import React from "react";
import Modal from "react-native-modal";
import { Input, Item, Label, View } from "native-base";
import { Pressable, Dimensions, Image } from "react-native";
import { Text, Button, FloatingInput } from "../Text";

export default function Success() {
  return (
    <Modal animationType="fade" transparent={true} visible={modal}>
      <View
        style={{
          justifyContent: "flex-end",
          flex: 1,
          width: Dimensions.get("screen").width * 0.6,
          alignSelf: "center",
        }}
      >
        <Pressable
          onPress={() => setModalVisible(!modal)}
          style={{
            backgroundColor: "#209FAE",
            alignItems: "center",
            borderRadius: 5,
            minHeight: 40,
            justifyContent: "center",
            flexDirection: "row",
            paddingHorizontal: 5,
            paddingVertical: 5,
          }}
        >
          <Text size="description" type="regular" style={{ color: "#FFF" }}>
            Successfully created a password
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
}
