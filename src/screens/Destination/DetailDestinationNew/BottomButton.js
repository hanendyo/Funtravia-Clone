import React, { useState } from "react";
import { Dimensions, View } from "react-native";
import { PensilPutih } from "../../../assets/svg";
import { Text, Button } from "../../../component";

export default function BottomButton({ routed, props, data, addTo }) {
  return (
    <View
      style={{
        alignItems: "flex-end",
      }}
    >
      {routed === 1 ? (
        <View style={{ position: "absolute", top: -75, right: 15, zIndex: 10 }}>
          <Button
            color="primary"
            type="circle"
            style={{
              // width: Dimensions.get("screen").width * 0.7,
              borderRadius: 42,
              paddingHorizontal: 15,
              // alignSelf: "flex-end",
              // position: "absolute",
              // marginBottom: 5,
              // borderTopWidth: 6,
              // zIndex: 10,
            }}
            onPress={() =>
              props.navigation.navigate("DestinationUnescoReview", {
                data: data,
              })
            }
          >
            <PensilPutih height={15} width={15} />
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
          onPress={() => addTo()}
          style={{ height: "100%", width: "100%" }}
          color="primary"
          type="box"
          text="Add To Plan"
        ></Button>
      </View>
    </View>
  );
}
