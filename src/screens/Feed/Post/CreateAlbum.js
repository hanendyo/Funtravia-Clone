import React, { useState, useEffect } from "react";
import { View, Dimensions, Platform } from "react-native";
import { NewAlbum, ExitingAlbum } from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import Album from "./Album";

export default function CreateAlbum({ modals, setModalCreate }) {
  const { t } = useTranslation();
  const [modalAlbum, setModalAlbum] = useState(false);

  return (
    <Modal
      animationIn="slideInDown"
      animationOut="slideOutDown"
      isVisible={modals}
      onRequestClose={() => {
        setModalCreate(false);
      }}
      style={{
        alignSelf: "center",
      }}
    >
      <View
        style={{
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          // height: 200,
          justifyContent: "flex-end",
          // paddingVertical: 80,
        }}
      >
        <View
          style={{
            borderTopWidth: 1,
            borderColor: "#d1d1d1",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around",
            backgroundColor: "#FFF",
            height: 200,
            paddingBottom: 50,
            width: Dimensions.get("screen").width,
            marginTop: Platform.OS === "ios" ? 0 : -21,
          }}
        >
          <Ripple
            onPress={() => setModalAlbum(true)}
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
            }}
          >
            <ExitingAlbum height="80" width="80" />
            <Text size="label" type="regular" style={{ marginTop: 10 }}>
              Add to exiting album
            </Text>
          </Ripple>
          <Ripple
            onPress={() => alert("create album")}
            style={{
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NewAlbum height="80" width="80" />
            <Text size="label" type="regular" style={{ marginTop: 10 }}>
              Create new album
            </Text>
          </Ripple>
        </View>
      </View>
      <Album
        modals={modalAlbum}
        setModalAlbum={(e) => setModalAlbum(e)}
        // masukan={(e) => _setLocation(e)}
      />
    </Modal>
  );
}
