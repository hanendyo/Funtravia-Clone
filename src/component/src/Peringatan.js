import { unset } from "lodash";
import React from "react";
import { View, Dimensions, TouchableOpacity, SafeAreaView } from "react-native";
import Modal from "react-native-modal";
import Text from "./Text";
import { Xhitam, AlerIcon, Errorr, Errors, Errorx } from "../../assets/svg";
import { useTranslation } from "react-i18next";

export default function ImageSlide({ aler, setClose }) {
  const { t, i18n } = useTranslation();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Modal
        animationIn="fadeIn"
        animationOut="fadeOut"
        isVisible={aler.show}
        style={{
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center",
          alignContent: "center",
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
              {aler.judul}
            </Text>
            {aler.detail.length !== 0 ? (
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
                  }}
                >
                  {aler.detail}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <TouchableOpacity
          onPress={() => setClose()}
          style={{
            width: Dimensions.get("screen").width - 100,
            backgroundColor: "white",
            alignItems: "center",
            justifyContent: "center",
            borderBottomLeftRadius: 5,
            borderBottomRightRadius: 5,
            // paddingVertical: 15,
            // paddingTop: aler.detail.length === 0 ? 20 : unset,
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
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
