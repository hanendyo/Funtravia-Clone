import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Pressable,
} from "react-native";
import {
  Text,
  Button,
  Truncate,
  StatusBar,
  Errors,
  FunImage,
} from "../../component";
import AnimatedPlayer from "react-native-animated-webp";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";

const { width, height } = Dimensions.get("screen");
export default function ChatTypelayout({
  item,
  user_id,
  navigation,
  tmpRChat,
}) {
  const playerRef = useRef(null);

  if (item.type == "sticker") {
    return (
      <AnimatedPlayer
        ref={playerRef}
        animatedSource={{
          uri: item.text,
        }}
        autoplay={true}
        loop={true}
        style={{ width: 100, height: 100 }}
      />
    );
  }

  if (item.type == "tag_destination") {
    let data = JSON.parse(item.text);
    return (
      <Pressable
        onPress={() => {
          navigation.push("DestinationUnescoDetail", {
            id: data.id,
            name: data.name,
          });
        }}
        style={{
          borderWidth: 1,
          borderColor: "#F3F3F3",
          borderRadius: 10,
          height: 170,
          // padding: 10,
          marginTop: 10,
          width: "80%",
          flexDirection: "row",
          backgroundColor: "#FFF",
          shadowColor: "#FFF",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6.27,

          elevation: 6,
        }}
      >
        <View style={{ justifyContent: "center" }}>
          {/* Image */}
          <FunImage
            source={{ uri: data.cover }}
            style={{
              width: 150,
              height: "100%",
              borderBottomLeftRadius: 10,
              borderTopLeftRadius: 10,
            }}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              position: "absolute",
              top: 10,
              right: 10,
              left: 10,
              width: 130,
              zIndex: 2,
            }}
          ></View>
        </View>

        {/* Keterangan */}
        {/* rating */}
        <View
          style={{
            flex: 1,
            padding: 10,
            height: 170,
            justifyContent: "space-between",
          }}
        >
          <View>
            {/* Title */}
            <Text
              size="label"
              type="bold"
              style={{ marginTop: 2 }}
              numberOfLines={1}
            >
              {data.name}
            </Text>
          </View>
          {/* Great for */}

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              height: 50,
              marginTop: 10,
              alignItems: "flex-end",
            }}
          >
            <Button
              onPress={() => {
                navigation.push("ItineraryStack", {
                  screen: "ItineraryPlaning",
                  params: {
                    idkiriman: data.id,
                    Position: "destination",
                  },
                });
              }}
              size="small"
              text={"Add"}
              // style={{ marginTop: 15 }}
            />
          </View>
        </View>
      </Pressable>
    );
  }

  return (
    <View
      style={[
        styles.balloon,
        user_id == item.user_id
          ? {
              backgroundColor: "#DAF0F2",
              borderTopRightRadius: 0,
            }
          : {
              backgroundColor: "#FFFFFF",
              borderTopLeftRadius: 0,
            },
      ]}
    >
      <Text
        size="description"
        style={{
          color: "#464646",
          lineHeight: 18,
        }}
      >
        {item.text}
      </Text>
      {tmpRChat ? (
        <View
          style={[
            styles.arrowContainer,
            user_id == item.user_id
              ? styles.arrowRightContainer
              : styles.arrowLeftContainer,
          ]}
        >
          <Svg
            style={
              user_id == item.user_id ? styles.arrowRight : styles.arrowLeft
            }
            height="50"
            width="50"
          >
            <Polygon
              points={
                user_id == item.user_id ? "0,01 15,01 5,12" : "20,01 0,01 12,12"
              }
              fill={user_id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
              stroke="#209FAE"
              strokeWidth={0.7}
            />
          </Svg>
          <Svg
            style={[
              { position: "absolute" },
              user_id == item.user_id
                ? {
                    right: moderateScale(-5, 0.5),
                  }
                : {
                    left: moderateScale(-5, 0.5),
                  },
            ]}
            height="50"
            width="50"
          >
            <Polygon
              points={
                user_id == item.user_id
                  ? "0,1.3 15,1.1 5,12"
                  : "20,01 0,01 12,13"
              }
              fill={user_id == item.user_id ? "#DAF0F2" : "#FFFFFF"}
            />
          </Svg>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: Dimensions.get("screen").height,
    // backgroundColor: "#fff",
    backgroundColor: "#F3F3F3",
    justifyContent: "space-between",
  },
  item: {
    marginVertical: moderateScale(1, 1),
    flexDirection: "row",
    alignItems: "center",
  },
  itemIn: {
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  itemOut: {
    alignSelf: "flex-end",
    marginRight: 20,
  },
  balloon: {
    maxWidth: moderateScale(250, 2),
    paddingHorizontal: moderateScale(10, 2),
    paddingTop: moderateScale(5, 2),
    paddingBottom: moderateScale(7, 2),
    borderRadius: 8,
    borderColor: "#209FAE",
    borderWidth: 0.7,
    marginBottom: 5,
  },
  arrowContainer: {
    position: "absolute",
    top: -1,
    zIndex: -1,
  },
  arrowLeftContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-start",
    left: -5,
  },

  arrowRightContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    right: -38.5,
  },

  arrowLeft: {
    left: moderateScale(-6, 0.5),
  },

  arrowRight: {
    right: moderateScale(-6, 0.5),
  },
});
