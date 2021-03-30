import React from "react";
import { View, Dimensions, Image, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Text, Button, StatusBar } from "../../../component";
import { Xhitam, ClockHitam } from "../../../assets/svg";
import { activity_unesco5 } from "../../../assets/png";

export default function ReviewModal({ setModalReview, modals, data }) {
  return (
    <Modal
      onRequestClose={() => {
        setModalReview(false);
      }}
      animationIn="slideInRight"
      animationOut="slideOutRight"
      isVisible={modals}
      style={{
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      {/* <StatusBar backgroundColor="#14646E" barStyle="light-content" /> */}
      <View
        style={{
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
      >
        <ScrollView style={{ borderWidth: 1, flex: 1, height: 10 }}>
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              flexDirection: "row",
              justifyContent: "space-between",
              marginVertical: 30,
              alignItems: "center",
            }}
          >
            <Text size="title" type="bold" style={{ color: "#209FAE" }}>
              Pijat
            </Text>
            <Xhitam
              height={15}
              width={15}
              onPress={() => setModalReview(false)}
            />
          </View>
          <View
            style={{
              height: 200,
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
            }}
          >
            <Image
              source={activity_unesco5}
              style={{ width: "100%", height: "100%", borderRadius: 5 }}
            />
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
            }}
          >
            <Text size="label" type="regular" style={{ marginTop: 20 }}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
            </Text>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width,
              paddingHorizontal: 15,
              marginTop: 20,
            }}
          >
            <Text size="title" type="bold">
              Ticket Price
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text size="description" type="regular">
                Category
              </Text>
              <Text size="description" type="regular">
                Harga Tiket
              </Text>
            </View>

            {/* Detail Tiket */}
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#DAF0F2",
                height: 50,
                padding: 10,
              }}
            >
              <View
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: "#209FAE",
                  height: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ marginLeft: 5 }}>
                  <Text size="description" type="regular">
                    Pandawa Message
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ClockHitam height={13} width={13} />
                    <Text size="small" type="light" style={{ marginLeft: 2 }}>
                      15 Menit
                    </Text>
                  </View>
                </View>
                <Text size="label" type="bold">
                  Rp. 56.000
                </Text>
              </View>
            </View>

            {/* Detail Tikt ke -2 */}
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#DAF0F2",
                height: 50,
                padding: 10,
              }}
            >
              <View
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: "#209FAE",
                  height: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ marginLeft: 5 }}>
                  <Text size="description" type="regular">
                    Balinese Message
                  </Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <ClockHitam height={13} width={13} />
                    <Text size="small" type="light" style={{ marginLeft: 2 }}>
                      15 Menit
                    </Text>
                  </View>
                </View>
                <Text size="label" type="bold">
                  Rp. 86.000
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#DAF0F2",
                height: 50,
                padding: 10,
              }}
            >
              <View
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: "#209FAE",
                  height: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ marginLeft: 5 }}>
                  <Text size="description" type="regular">
                    Relaxtation Message
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ClockHitam height={13} width={13} />
                    <Text size="small" type="light" style={{ marginLeft: 2 }}>
                      15 Menit
                    </Text>
                  </View>
                </View>
                <Text size="label" type="bold">
                  Rp. 856.000
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#DAF0F2",
                height: 50,
                padding: 10,
              }}
            >
              <View
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: "#209FAE",
                  height: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ marginLeft: 5 }}>
                  <Text size="description" type="regular">
                    Back Message
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ClockHitam height={13} width={13} />
                    <Text size="small" type="light" style={{ marginLeft: 2 }}>
                      15 Menit
                    </Text>
                  </View>
                </View>
                <Text size="label" type="bold">
                  Rp. 856.000
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: 10,
                backgroundColor: "#DAF0F2",
                height: 50,
                padding: 10,
                marginBottom: 30,
              }}
            >
              <View
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: "#209FAE",
                  height: "100%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ marginLeft: 5 }}>
                  <Text size="description" type="regular">
                    Back Message
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <ClockHitam height={13} width={13} />
                    <Text size="small" type="light" style={{ marginLeft: 2 }}>
                      15 Menit
                    </Text>
                  </View>
                </View>
                <Text size="label" type="bold">
                  Rp. 856.000
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
