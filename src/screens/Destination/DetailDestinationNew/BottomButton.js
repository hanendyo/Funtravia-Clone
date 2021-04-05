import React from "react";
import { Dimensions, View } from "react-native";
import { Ticket, SendReview } from "../../../assets/svg";
import { Text, Button } from "../../../component";

export default function BottomButton({ routed, props, data }) {
  return (
    <View
      style={{
        // height: 100,
        // width: Dimensions.get("screen").width,
        // paddingHorizontal: 15,
        // justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      {routed === 1 ? (
        <View style={{ position: "absolute", top: -45 }}>
          <Button
            color="secondary"
            type="icon"
            text="Write Review"
            style={{
              width: Dimensions.get("screen").width * 0.7,
              borderRadius: 42,
              alignSelf: "center",
              // position: "absolute",
              marginBottom: 5,
            }}
            onPress={() =>
              props.navigation.navigate("DestinationUnescoReview", {
                data: data,
              })
            }
          >
            <SendReview height={15} width={15} />
          </Button>
        </View>
      ) : null}
      <View
        style={{
          height: 60,
          backgroundColor: "#FFF",
          width: Dimensions.get("screen").width,
          paddingHorizontal: 15,
          shadowOffset: { width: 1, height: 1 },
          shadowOpacity: Platform.OS == "ios" ? 0.22 : 2,
          shadowRadius: Platform.OS == "ios" ? 2.22 : 1.0,
          elevation: Platform.OS == "ios" ? 3 : 3.5,
          flexDirection: "row",
          borderTopWidth: 1,
          borderColor: "#F1F1F1",
          justifyContent: "space-between",
          paddingVertical: 10,
        }}
      >
        <Button
          style={{ backgroundColor: "#E2ECF8", height: "100%", width: "40%" }}
          type="icon"
          onPress={() => null}
        >
          <Ticket height={20} width={20} />
          <Text size="description" type="regular" style={{ marginLeft: 5 }}>
            Find Ticket
          </Text>
        </Button>
        <Button
          onPress={() => null}
          style={{ height: "100%", width: "58%" }}
          color="primary"
          type="box"
          text="Add To Plan"
        ></Button>
      </View>
    </View>
  );
}
