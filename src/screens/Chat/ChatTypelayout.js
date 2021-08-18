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
  FunImageAutoSize,
} from "../../component";
import {
  Arrowbackwhite,
  Send,
  Smile,
  Chat,
  Sticker,
  Emoticon,
  Star,
} from "../../assets/svg";
import AnimatedPlayer from "react-native-animated-webp";
import Svg, { Polygon } from "react-native-svg";
import { moderateScale } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

const { width, height } = Dimensions.get("screen");
export default function ChatTypelayout({
  item,
  user_id,
  navigation,
  tmpRChat,
}) {
  const { t } = useTranslation();
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
          borderColor: "#DAF0F2",
          borderRadius: 10,
          minHeight: 330,
          // padding: 10,
          marginVertical: 10,
          width: 250,
          // flexDirection: "row",
          backgroundColor: "#F6F6F6",
          // shadowColor: "#DAF0F2",
          // shadowOffset: {
          //   width: 0,
          //   height: 5,
          // },
          // shadowOpacity: 0.1,
          // shadowRadius: 6.27,

          // elevation: 6,
        }}
      >
        <FunImage
          source={{ uri: data.cover }}
          style={{
            width: 220,
            height: 220,
            alignSelf: "center",
            margin: 15,
            borderRadius: 10,
          }}
        />
        <View
          style={{
            flex: 1,
            marginHorizontal: 15,
            // width: "100%",
            // alignSelf: "center",
            // borderBottomWidth: 1,
            // borderBottomColor: "d75995",
          }}
        >
          {/* Title */}
          <Text
            size="small"
            // type="black"
            // numberOfLines={1}
          >
            {t("checkDestination")}
          </Text>
          <Text
            size="title"
            type="black"
            style={{ marginTop: 2 }}
            // numberOfLines={1}
          >
            {data.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginVertical: 12,
            }}
          >
            {data.destination_type && data.destination_type.length > 0
              ? data.destination_type.map((value, i) => {
                  if (i < 3) {
                    return (
                      <View
                        style={{
                          backgroundColor: "#FFFFFF",
                          borderRadius: 3,
                          flexDirection: "row",
                          alignItems: "center",
                          paddingHorizontal: 5,
                          marginRight: 5,
                          marginBottom: 3,
                        }}
                      >
                        <Text
                          size="small"
                          style={{
                            margin: 5,
                          }}
                          type="bold"
                        >
                          {value.name}
                        </Text>
                      </View>
                    );
                  }
                })
              : null}
            {data.rating ? (
              <View
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 3,
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 5,
                  marginRight: 5,
                  marginBottom: 3,
                }}
              >
                <Star width={15} height={15} />
                <Text
                  style={{
                    margin: 5,
                  }}
                  size="small"
                  type="bold"
                >
                  {data?.rating}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            borderTopWidth: 0.5,
            borderTopColor: "d1d1d1",
          }}
        >
          <Pressable
            style={{
              alignContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              navigation.push("ItineraryStack", {
                screen: "ItineraryPlaning",
                params: {
                  idkiriman: data.id,
                  Position: "destination",
                },
              });
            }}
          >
            <Text
              type="bold"
              // size="label"
              style={{
                color: "#209FAE",
                margin: 10,
              }}
            >
              {t("addToMy")}
            </Text>
          </Pressable>
        </View>
      </Pressable>
    );
  }
  if (item.type == "tag_post") {
    let data = JSON.parse(item.text);
    if (data.id) {
      console.log(data);
      let scale;
      switch (data.media_orientation) {
        case "L":
          scale = 2.2 / 3;
          break;
        case "P":
          scale = 5 / 4;
          break;
        case "S":
          scale = 1 / 1;
          break;
        default:
          scale = 1 / 1;
          break;
      }
      return (
        <Pressable
          onPress={() => {
            navigation.push("FeedStack", {
              screen: "CommentPost",
              params: {
                post_id: data.id,
                //   comment_id: data.comment_feed.id,
              },
            });
          }}
          style={{
            borderWidth: 1,
            borderColor: "#DAF0F2",
            borderRadius: 10,
            paddingVertical: 10,
            // minHeight: 330,
            // padding: 10,
            marginVertical: 10,
            width: 250,
            // flexDirection: "row",
            backgroundColor: "#F6F6F6",
            // shadowColor: "#DAF0F2",
            // shadowOffset: {
            //   width: 0,
            //   height: 5,
            // },
            // shadowOpacity: 0.1,
            // shadowRadius: 6.27,

            // elevation: 6,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              alignItems: "center",
            }}
          >
            <FunImage
              source={{ uri: data?.user.picture }}
              style={{
                width: 35,
                height: 35,
                borderRadius: 18,
                marginRight: 10,
              }}
            />
            <Text type="bold">
              {data?.user.first_name} {data?.user.last_name}
            </Text>
          </View>
          <FunImageAutoSize
            source={{ uri: data?.assets[0].filepath }}
            style={{
              width: 250,
              height: 250 * scale,
              alignSelf: "center",
              marginVertical: 10,
              // borderRadius: 10,
            }}
          />
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              // width: "100%",
              // alignSelf: "center",
              // borderBottomWidth: 1,
              // borderBottomColor: "d75995",
            }}
          >
            {/* Caption */}
            {data.caption ? (
              <Text numberOfLines={2} style={{}}>
                <Text
                  // size="title"
                  type="black"
                  style={{}}
                  // numberOfLines={1}
                >
                  {data.user.first_name} {data.user.last_name}{" "}
                </Text>
                <Text
                  // size="title"
                  // type="black"
                  style={{}}
                  // numberOfLines={1}
                >
                  {data.caption}
                </Text>
              </Text>
            ) : null}
          </View>
        </Pressable>
      );
    } else {
      return null;
    }
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
    maxWidth: moderateScale(230, 2),
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
