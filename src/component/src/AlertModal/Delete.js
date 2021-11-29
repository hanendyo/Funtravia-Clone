import React, { useState } from "react";
// import Modal from "react-native-modal";

import { Input, Item, Label, View } from "native-base";
import { Pressable, Dimensions, Image, Modal } from "react-native";
import { Button, Text } from "../../index";
import { useTranslation } from "react-i18next";

export default function Delete({
  modals,
  setModals,
  message,
  messageHeader,
  onDelete,
}) {
  const { t } = useTranslation();
  return (
    <>
      {modals ? (
        <Modal
          animationType="fade"
          visible={modals}
          onBackdropPress={() => setModals(!modals)}
          onRequestClose={() => setModals(!modals)}
          transparent={true}
        >
          <Pressable
            onPress={() => setModals(!modals)}
            style={{
              width: Dimensions.get("screen").width + 25,
              height: Dimensions.get("screen").height,
              justifyContent: "center",
              opacity: 0.7,
              backgroundColor: "#000",
              position: "absolute",
              left: -21,
            }}
          />
          <View
            style={{
              width: Dimensions.get("screen").width - 140,
              // marginHorizontal: 70,
              alignSelf: "center",
              backgroundColor: "#FFF",
              zIndex: 15,
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              alignContent: "center",
              borderRadius: 5,
              marginTop: Dimensions.get("screen").height / 2.5,
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                width: Dimensions.get("screen").width - 140,
                justifyContent: "center",
                borderRadius: 5,
              }}
            >
              <View
                style={{
                  alignItems: "center",
                  borderBottomColor: "#d1d1d1",
                  borderBottomWidth: 1,
                  borderTopRightRadius: 5,
                  borderTopLeftRadius: 5,
                  backgroundColor: "#f6f6f6",
                }}
              >
                <Text style={{ marginVertical: 15 }} size="title" type="bold">
                  {messageHeader}
                </Text>
              </View>
              <Text
                style={{
                  alignSelf: "center",
                  textAlign: "center",
                  marginTop: 20,
                  marginHorizontal: 10,
                }}
                size="label"
                type="regular"
              >
                {message}
              </Text>
              <View style={{ marginTop: 20, marginHorizontal: 15 }}>
                <Button
                  onPress={onDelete}
                  color="secondary"
                  text={t("delete")}
                />
                <Button
                  onPress={() => setModals(!modals)}
                  style={{ marginVertical: 7 }}
                  variant="transparent"
                  text={t("discard")}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : null}
    </>
  );
}
