import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import { NewAlbum, ExitingAlbum } from "../../../assets/svg";
import Modal from "react-native-modal";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import Album from "./Album";

export default function CreateAlbum({
  modals,
  setModalCreate,
  props,
  user_id,
}) {
  const { t } = useTranslation();
  const [modalAlbum, setModalAlbum] = useState(false);
  const [modalAlbumCreate, setModalAlbumCreate] = useState(false);
  console.log("modalAlbumCreate", modalAlbumCreate);

  const modal = () => {
    console.log("truew");
    setModalAlbum(true);
  };

  const open = async () => {
    setTimeout(() => {
      modal();
    }, 1000);
  };

  const ModalCreate = () => {
    return (
      <Modal
        animationType="fade"
        useNativeDriver={true}
        // animationInTiming={5000}
        // animationOutTiming={800}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        isVisible={modalAlbumCreate}
        onRequestClose={() => {
          setModalAlbumCreate(false);
        }}
        style={{
          alignSelf: "center",
        }}
      >
        <KeyboardAvoidingView
          // keyboardVerticalOffset={100}
          style={{ flex: 1, marginBottom: 0, bottom: 0 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          // behavior="padding"
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            // height: 200,
            justifyContent: "center",
            // paddingVertical: 80,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              // alignItems: "center",
              // justifyContent: "space-around",
              backgroundColor: "#FFF",
              width: Dimensions.get("screen").width,
              marginTop: Platform.OS === "ios" ? 0 : -21,
            }}
          >
            <View
              style={{
                width: Dimensions.get("screen").width,
              }}
            >
              <View
                style={{
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 15,
                  borderBottomWidth: 1,
                  borderColor: "#d1d1d1",
                  justifyContent: "center",
                  height: 50,
                }}
              >
                <Text type="bold" size="title">
                  {t("newAlbum")}
                </Text>
              </View>
              <View
                style={{
                  height: 70,
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  justifyContent: "center",
                }}
              >
                <TextInput
                  style={{ backgroundColor: "#f6f6f6" }}
                  multiline
                  placeholder={t("untitle") + " " + "Album"}
                  maxLength={1000}
                  placeholderStyle={{ fontSize: 50 }}
                  placeholderTextColor="#6C6C6C"
                ></TextInput>
              </View>
              <View
                style={{
                  height: 70,
                  width: Dimensions.get("screen").width,
                  paddingHorizontal: 15,
                  paddingVertical: 5,
                  justifyContent: "flex-end",
                  flexDirection: "row",
                }}
              >
                <Button
                  onPress={() => setModalAlbumCreate(false)}
                  size="medium"
                  color="transparant"
                  text={t("cancel")}
                ></Button>
                <Button
                  size="medium"
                  color="primary"
                  text={t("create") + " " + "Album"}
                ></Button>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  return (
    <Modal
      onBackdropPress={() => setModalCreate(false)}
      useNativeDriver={true}
      animationInTiming={500}
      animationOutTiming={800}
      animationIn="slideInUp"
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
            height: 220,
            paddingBottom: 50,
            width: Dimensions.get("screen").width,
            marginTop: Platform.OS === "ios" ? 0 : -21,
          }}
        >
          <Ripple
            onPress={() => open()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 30,
            }}
          >
            <ExitingAlbum height="60" width="60" />
            <Text size="label" type="regular" style={{ marginTop: 10 }}>
              Add to exiting album
            </Text>
          </Ripple>
          <Ripple
            onPress={() => {
              setModalAlbumCreate(true);
            }}
            style={{
              borderRadius: 30,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NewAlbum height="60" width="60" />
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
        props={props}
        user_id={user_id}
      />
      <ModalCreate />
    </Modal>
  );
}
