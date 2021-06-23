import React, { useState } from "react";
import {
  View,
  Dimensions,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Pressable,
} from "react-native";
// import Modal from "react-native-modal";
import { Home, Xhitam } from "../../assets/svg";
import { useTranslation } from "react-i18next";
import { Text, Button } from "../index";

export default function Sidebar({ show, Data, setClose, props }) {
  const { t, i18n } = useTranslation();

  return (
    <Modal
      // onSwipeStart={() => {
      // 	setClose();
      // }}
      transparent={true}
      onBackdropPress={() => {
        setClose();
      }}
      onRequestClose={() => {
        setClose();
      }}
      onSwipeComplete={() => {
        setClose();
      }}
      swipeDirection={"right"}
      visible={show}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      style={{
        // alignItems: 'flex-end',
        // alignContent: 'flex-end',
        // justifyContent: 'flex-end',
        margin: 0,
      }}
    >
      <Pressable
        onPress={() => {
          setClose();
        }}
        style={{
          flex: 1,
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
          backgroundColor: "rgba(0,0,0,0.7)",
          justifyContent: "flex-end",
          alignContent: "flex-end",
          alignItems: "flex-end",
        }}
      >
        <View
          style={{
            height: "100%",
            width: "70%",
            backgroundColor: "white",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingBottom: 10,
            borderColor: "black",
            paddingTop: 30,
          }}
        >
          <View
            style={{
              // borderBottomWidth: 1,
              // borderBottomColor: '#d3d3d3',
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                alignSelf: "flex-end",
                //  borderWidth: 1
                padding: 10,
              }}
              onPress={() => setClose()}
            >
              <Xhitam height={15} width={15}></Xhitam>
            </TouchableOpacity>
            <Data />
          </View>
          <View
            style={{
              // borderBottomWidth: 1,
              // borderBottomColor: '#d3d3d3',
              alignSelf: "flex-end",

              width: "100%",
            }}
          >
            <TouchableOpacity
              style={{
                // alignSelf: 'flex-start',
                alignItems: "center",
                flexDirection: "row",
                //  borderWidth: 1
                padding: 10,
              }}
              onPress={() => {
                setClose(), props.navigation.navigate("Home");
              }}
            >
              <Home height={15} width={15} />
              <Text
                size="description"
                type="regular"
                style={{
                  // fontFamily: 'Lato-Regular',
                  // fontSize: 14,
                  marginLeft: 10,
                }}
              >
                {t("backToHome")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
