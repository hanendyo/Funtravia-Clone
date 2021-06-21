import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { default_image } from "../../../assets/png";
import User_Post from "../../../graphQL/Query/Profile/post";
import { HotelIcon, Kosong, Sharegreen } from "../../../assets/svg";
import { Button, Text, FunImageBackground } from "../../../component";
import { useQuery } from "@apollo/client";

export default function Review({ item, index }) {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: Dimensions.get("screen").width,
        borderBottomWidth: 1,
        borderBottomColor: "#d3d3d3",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <Text type={"bold"} size={"label"} style={{}}>
          {item.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <HotelIcon height={20} width={20} />
          <Text style={{ color: "#209FAE" }}></Text>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          paddingVertical: 5,
        }}
      >
        <View style={{}}>
          <Text type={"regular"} size={"description"}>
            {item.create_at}
          </Text>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Text
            type={"regular"}
            size={"description"}
            style={{ color: "#209fae" }}
          >{`${item.rating}`}</Text>
          <Text type={"regular"} size={"description"}>{`/5`}</Text>
        </View>
      </View>
      <View style={{}}>
        <Text type={"regular"} size={"small"} style={{ textAlign: "justify" }}>
          {item.ulasan}
        </Text>
      </View>
      <Button
        size="medium"
        type="icon"
        variant="transparent"
        style={{ width: "50%", marginLeft: -20 }}
      >
        <Sharegreen />
        <Text style={{ marginLeft: 5 }} type={"regular"} size={"description"}>
          Share this review
        </Text>
      </Button>
      {item.images && item.images.length > 0 ? (
        item.images.length > 1 ? (
          <View style={{ flexDirection: "row", width: "100%" }}>
            <TouchableOpacity
              style={{ width: "60%" }}
              onPress={() => {
                onSelect(item.images);
              }}
            >
              <FunImageBackground
                source={{ uri: item.images[0] }}
                style={{
                  alignSelf: "center",
                  height: Dimensions.get("window").width / 3,
                  width: "100%",
                  borderRadius: 5,
                  marginRight: 5,
                }}
                imageStyle={{
                  resizeMode: "cover",
                  borderRadius: 5,
                }}
              ></FunImageBackground>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "40%" }}
              onPress={() => {
                onSelect(item.images);
              }}
            >
              <FunImageBackground
                source={{ uri: item.images[1] }}
                style={{
                  alignSelf: "center",
                  justifyContent: "center",
                  height: Dimensions.get("window").width / 3,
                  width: "100%",
                  borderRadius: 5,
                  marginLeft: 5,
                }}
                imageStyle={{
                  resizeMode: "cover",
                  borderRadius: 5,
                  opacity: 0.2,
                }}
              >
                {/* <TouchableOpacity
												> */}
                <Text
                  type="regular"
                  size="h5"
                  style={{
                    textAlign: "center",
                  }}
                >
                  {`+ ${item.images.length - 1} `}
                </Text>
                {/* </TouchableOpacity> */}
              </FunImageBackground>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => {
              onSelect(item.images);
            }}
          >
            <FunImageBackground
              source={{ uri: item.images[0] }}
              style={{
                alignSelf: "center",
                height: Dimensions.get("window").width / 3,
                width: "100%",
                borderRadius: 5,
              }}
              imageStyle={{
                resizeMode: "cover",
                borderRadius: 5,
              }}
            ></FunImageBackground>
          </TouchableOpacity>
        )
      ) : null}
    </View>
  );
}
