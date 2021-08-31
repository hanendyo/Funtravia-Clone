import { unset } from "lodash";
import React from "react";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Modal from "react-native-modal";
import { Xhitam, AlerIcon, Errorr, Errors, Errorx } from "../../assets/svg";

export default function ImageSlide({ aler, setClose }) {
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
        <View>
          <View
            style={{
              width: Dimensions.get("screen").width - 100,
              backgroundColor: "#F6F6F6",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 13,
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5,
            }}
          >
            <Text
              style={{
                fontFamily: "Lato-Black",
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
              <Errors width={70} height={70} style={{ marginBottom: 10 }} />
              <Text
                style={{
                  fontFamily: "Lato-Black",
                  fontSize: 14,
                  marginBottom: 10,
                }}
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
                    style={{
                      fontFamily: "Lato-Regular",
                      fontSize: 14,
                      textAlign: "center",
                      paddingHorizontal: 8,
                      paddingVertical: 15,
                    }}
                  >
                    {aler.detail}
                  </Text>
                </View>
              ) : null}
            </View>
          </View>
          <TouchableOpacity onPress={() => setClose()} activeOpacity={0.95}>
            <View
              style={{
                width: Dimensions.get("screen").width - 100,
                backgroundColor: "white",
                alignItems: "center",
                justifyContent: "center",
                borderBottomLeftRadius: 5,
                borderBottomRightRadius: 5,
                paddingVertical: 25,
                paddingTop: aler.detail.length === 0 ? 20 : unset,
              }}
            >
              <Text
                style={{
                  color: "#209FAE",
                  fontWeight: "bold",
                  fontFamily: "Lato-Black",
                }}
              >
                Ok, I understand
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
