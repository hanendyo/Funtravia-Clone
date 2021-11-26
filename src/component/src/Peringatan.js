import { unset } from "lodash";
import React from "react";
import {
  View,
  Pressable,
  Dimensions,
  TouchableOpacity,
  TouchableHighlight,
  SafeAreaView,
  Modal,
} from "react-native";
// import Modal from "react-native-modal";
import Text from "./Text";
import { Xhitam, AlerIcon, Errorr, Errors, Errorx } from "../../assets/svg";
import { useTranslation } from "react-i18next";

export default function ImageSlide({ aler, setClose }) {
  const { t, i18n } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        useNativeDriver={true}
        visible={aler.show}
        onRequestClose={() => true}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          onPress={() => setClose()}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        />
        <View
          style={{
            width: Dimensions.get("screen").width - 100,
            alignSelf: "center",
            zIndex: 15,
            marginTop: Dimensions.get("screen").height / 3,
          }}
        >
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
              backgroundColor: "#F6F6F6",
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
              borderBottomColor: "#d1d1d1",
              borderBottomWidth: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              size="label"
              type="bold"
              style={{
                marginTop: 13,
                marginBottom: 15,
              }}
            >
              Oops
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
              backgroundColor: "white",
              paddingTop: 20,
              paddingHorizontal: 20,
              // borderWidth: 1,
            }}
          >
            <View
              style={{
                width: "100%",
                justifyContent: "space-evenly",
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <Errors width={70} height={70} style={{ marginBottom: 15 }} />
              <Text
                size="label"
                type="bold"
                style={{ marginBottom: 10, textAlign: "center" }}
              >
                {t(aler.judul)}
              </Text>
              {aler?.detail?.length !== 0 && aler?.detail !== 0 ? (
                <View
                  style={{
                    backgroundColor: "#F6F6F6",
                    borderRadius: 5,
                  }}
                >
                  <Text
                    size="label"
                    type="regular"
                    style={{
                      color: "#464646",
                      textAlign: "center",
                      marginTop: 5,
                      marginBottom: 7,
                      marginHorizontal: 10,
                    }}
                  >
                    {t(aler?.detail)}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <Pressable
            onPress={() => setClose()}
            underlayColor="#F6F6F6"
            style={{
              width: Dimensions.get("screen").width - 100,
              backgroundColor: "white",
              alignItems: "center",
              justifyContent: "center",
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
              paddingBottom: 5,
              // paddingVertical: 15,
              paddingTop: aler.detail.length === 0 ? 5 : 0,
            }}
          >
            <Text
              size="label"
              type="bold"
              style={{
                marginTop: aler.detail.length > 0 ? 13 : 0,
                marginBottom: 15,
                color: "#209fae",
              }}
            >
              {t("understand")}
            </Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
