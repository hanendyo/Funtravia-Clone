import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { vektor, avatar, summer } from "../../assets/png";
import { Text } from "../../component";

export default function FunProfile({ props }) {
  return (
    <ImageBackground
      source={vektor}
      style={{
        width: Dimensions.get("window").width - 20,
        borderRadius: 10,
        paddingBottom: 10,
      }}
      imageStyle={{
        width: Dimensions.get("window").width - 20,
        // height: 150,
        paddingBottom: 10,
        borderRadius: 10,
        resizeMode: "cover",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgba(032, 159, 174,0.8)",
      }}
    >
      <View
        style={{
          padding: 10,
        }}
      >
        <Text type="bold">Fun Profile</Text>
      </View>
      <View
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            // flex: 1,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              style={{
                width: 60,
                height: 60,
                marginHorizontal: 10,
              }}
              imageStyle={{
                width: 60,
                height: 60,
                resizeMode: "contain",
              }}
              source={avatar}
            />
            <Text type="bold">My Avatar</Text>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              alignContent: "center",
              justifyContent: "flex-end",
            }}
          >
            <Image
              style={{
                width: 60,
                height: 60,
                marginHorizontal: 10,
              }}
              imageStyle={{
                width: 60,
                height: 60,
                resizeMode: "contain",
              }}
              source={summer}
            />
            <Text type="bold">Summer Traveler</Text>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
