import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from "react-native";
import { NewAlbum, ExitingAlbum } from "../../../assets/svg";
import { Text, Button } from "../../../component";
import { useTranslation } from "react-i18next";
import Ripple from "react-native-material-ripple";
import Album from "./Album";
import { RNToasty } from "react-native-toasty";

export default function CreateAlbum({
  modals,
  setModalCreate,
  props,
  user_id,
  setAlbum,
}) {
  const { t } = useTranslation();
  const [modalAlbum, setModalAlbum] = useState(false);
  const [modalAlbumCreate, setModalAlbumCreate] = useState(false);
  const [text, setText] = useState("");

  const modal = () => {
    setModalAlbumCreate(true);
    setModalCreate(false);
  };

  const submitAlbum = () => {
    if (text === "" || text === null) {
      return RNToasty.Show({
        title: t("emptyAlbumTitle"),
        position: "bottom",
      });
    }
    RNToasty.Show({
      title: "Judul album " + "'" + text + "'",
      position: "bottom",
    });
    setAlbum(text);
    setModalAlbumCreate(false);
    setText("");
  };

  return (
    <View
      style={{
        zIndex: modals || modalAlbumCreate === true ? 1 : -2,
        opacity: 0.6,
        position: "absolute",
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
        backgroundColor: modals || modalAlbumCreate === true ? "#000" : null,
      }}
    >
      <Modal
        useNativeDriver={true}
        visible={modals}
        onRequestClose={() => setModalCreate(false)}
        transparent={true}
        animationType="slide"
      >
        <Pressable
          onPress={() => setModalCreate(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        />
        <View
          style={{
            // height: 170,
            width: Dimensions.get("screen").width,
            backgroundColor: "#FFF",
            position: "absolute",
            bottom: 0,
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Pressable
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 50,
            }}
          >
            <ExitingAlbum height="60" width="60" />
            <Text>Add to exiting album</Text>
          </Pressable>
          <Pressable
            onPress={() => modal()}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 50,
            }}
          >
            <NewAlbum height="60" width="60" />
            <Text>Create new album</Text>
          </Pressable>
        </View>
        <Album
          modals={modalAlbum}
          setModalAlbum={(e) => setModalAlbum(e)}
          props={props}
          user_id={user_id}
        />
      </Modal>

      <Modal
        useNativeDriver={true}
        visible={modalAlbumCreate}
        onRequestClose={() => setModalAlbumCreate(false)}
        transparent={true}
        animationType="slide"
      >
        <Pressable
          onPress={() => setModalAlbumCreate(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
          }}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            // height: 200,
            width: Dimensions.get("screen").width,
            top: Dimensions.get("screen").height / 3,
            position: "absolute",
            zIndex: 15,
            paddingHorizontal: 15,
          }}
        >
          <View
            style={{
              height: "100%",
              width: "100%",
              backgroundColor: "#FFF",
              borderRadius: 5,
              paddingBottom: 15,
            }}
          >
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
                borderBottomWidth: 1,
                borderColor: "#d1d1d1",
              }}
            >
              <Text type="bold" size="title" style={{ marginVertical: 10 }}>
                New Album
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
              }}
            >
              <TextInput
                multiline
                placeholder={t("untitle")}
                maxLength={1000}
                placeholderStyle={{ fontSize: 50 }}
                placeholderTextColor="#6C6C6C"
                style={
                  Platform.OS == "ios"
                    ? {
                        height: 75,
                        maxHeight: 100,
                        marginVertical: 10,
                        marginHorizontal: 10,
                        paddingTop: 10,
                        fontSize: 14,
                        fontFamily: "Lato-Regular",
                      }
                    : {
                        height: 50,
                        borderRadius: 5,
                        backgroundColor: "#f6f6f6",
                        paddingHorizontal: 10,
                        fontSize: 14,
                        marginVertical: 10,
                        fontFamily: "Lato-Regular",
                      }
                }
                onChangeText={(text) => setText(text)}
                value={text}
              />
            </View>
            <View
              style={{
                width: "100%",
                paddingHorizontal: 15,
                justifyContent: "flex-end",
                flexDirection: "row",
              }}
            >
              <Button
                onPress={() => {
                  setModalAlbumCreate(false), setModalCreate(true), setText("");
                }}
                size="medium"
                color="transparant"
                text={t("cancel")}
              ></Button>
              <Button
                onPress={() => submitAlbum()}
                size="medium"
                color="primary"
                text={t("create") + " " + "Album"}
              ></Button>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Album
          modals={modalAlbum}
          setModalAlbum={(e) => setModalAlbum(e)}
          props={props}
          user_id={user_id}
        />
      </Modal>
    </View>
  );
}
