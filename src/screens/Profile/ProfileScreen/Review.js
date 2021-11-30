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
import {
  HotelIcon,
  Kosong,
  Sharegreen,
  DestinationReview,
  AccomodationReview,
  Select,
} from "../../../assets/svg";
import {
  Button,
  Text,
  FunImageBackground,
  FunImage,
  shareAction,
} from "../../../component";
import { useQuery } from "@apollo/client";
import DeviceInfo from "react-native-device-info";

const Notch = DeviceInfo.hasNotch();

export default function Review(
  { item, index },
  onSelect,
  props,
  token,
  t,
  capHeight
) {
  return (
    <View
      style={{
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: Dimensions.get("screen").width - 30,
        // borderBottomWidth: 1,
        // borderBottomColor: "#f3f3f3",
        backgroundColor: "#fff",
        marginTop:
          capHeight == 10
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : -10
              : -10
            : capHeight == 20
            ? Platform.OS === "ios"
              ? Notch
                ? 50
                : 20
              : 55
            : capHeight == 30
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : 5
              : 25
            : capHeight == 40
            ? Platform.OS === "ios"
              ? Notch
                ? 65
                : 20
              : 60
            : capHeight == 50
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : 0
              : 25
            : capHeight == 60
            ? Platform.OS === "ios"
              ? Notch
                ? 75
                : 25
              : 45
            : capHeight == 70
            ? Platform.OS === "ios"
              ? Notch
                ? 0
                : 0
              : 45
            : capHeight == 80
            ? Platform.OS === "ios"
              ? Notch
                ? 95
                : 10
              : 95
            : capHeight == 90
            ? Platform.OS === "ios"
              ? Notch
                ? 115
                : 45
              : 105
            : 50,
        marginBottom:
          capHeight == 10
            ? Platform.OS === "ios"
              ? Notch
                ? 15
                : 25
              : 30
            : capHeight == 20
            ? Platform.OS === "ios"
              ? Notch
                ? -35
                : 15
              : -35
            : capHeight == 30
            ? Platform.OS === "ios"
              ? Notch
                ? 15
                : 10
              : -10
            : capHeight == 40
            ? Platform.OS === "ios"
              ? Notch
                ? -45
                : 0
              : -40
            : capHeight == 50
            ? Platform.OS === "ios"
              ? Notch
                ? 15
                : 15
              : -10
            : capHeight == 60
            ? Platform.OS === "ios"
              ? Notch
                ? -60
                : -10
              : -35
            : capHeight == 70
            ? Platform.OS === "ios"
              ? Notch
                ? 5
                : 5
              : -30
            : capHeight == 80
            ? Platform.OS === "ios"
              ? Notch
                ? -75
                : 10
              : -80
            : capHeight == 90
            ? Platform.OS === "ios"
              ? Notch
                ? -95
                : -30
              : -75
            : 30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        // marginLeft: 10,
        // marginRight: 10,
        // borderWidth: 4,
        marginHorizontal: 15,
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
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {item.isfrom === "destination" ? (
            <DestinationReview height={30} width={30} />
          ) : (
            <AccomodationReview height={30} width={30} />
          )}
          <TouchableOpacity
            onPress={() => {
              props.navigation.push("DestinationUnescoDetail", {
                id: item.id_item,
                name: item.name,
                token: token,
              });
            }}
          >
            <Select
              height={15}
              width={15}
              style={{
                transform: [{ rotateZ: "-90deg" }],
                marginLeft: 10,
              }}
            />
          </TouchableOpacity>
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
          <Text type={"regular"} size={"description"}>{` / 5`}</Text>
        </View>
      </View>
      <View style={{ marginBottom: 5 }}>
        <Text
          type={"regular"}
          size={"readable"}
          style={{ textAlign: "justify" }}
        >
          {item.ulasan}
        </Text>
      </View>

      {item.images && item.images.length > 0 ? (
        item.images.length > 1 ? (
          <View style={{ flexDirection: "row", width: "100%" }}>
            <TouchableOpacity
              style={{ width: "60%" }}
              onPress={() => {
                onSelect(item.images, index);
              }}
            >
              <FunImage
                source={{ uri: item.images[0].image }}
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
              ></FunImage>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ width: "40%" }}
              onPress={() => {
                onSelect(item.images, index);
              }}
            >
              <FunImageBackground
                source={{ uri: item.images[1].image }}
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
              onSelect(item.images, index);
            }}
          >
            <FunImage
              source={{ uri: item.images[0].image }}
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
            ></FunImage>
          </TouchableOpacity>
        )
      ) : null}

      <TouchableOpacity
        style={{
          paddingTop: 15,
          paddingBottom: 10,
          flexDirection: "row",
          alignContent: "center",
          alignItems: "center",
        }}
        onPress={() =>
          shareAction({
            from: "destination",
            target: item.id_item,
          })
        }
      >
        <Sharegreen width={15} height={15} />
        <Text style={{ marginLeft: 5 }} type={"regular"} size={"description"}>
          {t("Sharethisreview")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
