import React from "react";
import { View, Dimensions, Image, ScrollView } from "react-native";
import Modal from "react-native-modal";
import { Text, Button, StatusBar } from "../../../component";
import { Xhitam, ClockHitam } from "../../../assets/svg";
import { activity_unesco1 } from "../../../assets/png";

export default function ActivityModal({ setModalActivity, modals, data }) {
  return (
    <Modal
      onRequestClose={() => {
        setModalActivity(false);
      }}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      isVisible={modals}
      style={{
        alignSelf: "center",
        alignContent: "center",
      }}
    >
      <StatusBar backgroundColor="#14646E" barStyle="light-content" />
      <View
        style={{
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          height: Dimensions.get("screen").height,
        }}
      >
        <ScrollView style={{ flex: 1, height: 10 }}>
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
              Banana Boat
            </Text>
            <Xhitam
              height={15}
              width={15}
              onPress={() => setModalActivity(false)}
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
              source={activity_unesco1}
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
                    Single (1 Person)
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
                    Couple (2 Person)
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
                    Family (7 Person)
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
