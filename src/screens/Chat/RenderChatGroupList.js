import React, { useState, useEffect } from "react";
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
import {
  NewGroup,
  Kosong,
  Tagdestination,
  Tagdocument,
  Tagimage,
  Tagsticker,
  PinAbu,
} from "../../assets/svg";
import { default_image } from "../../assets/png";
import { useTranslation } from "react-i18next";
import RecentChat from "./RecentChat";

const { width, height } = Dimensions.get("screen");
export default function ChatGroupList({ dataGroupRes, navigation, param }) {
  const { t } = useTranslation();
  const dateGroup = () => {
    let date = new Date().toLocaleDateString();
    return date;
  };
  const timeChatGroup = (item) => {
    let timeChat = new Date(item.recent?.time).toTimeString();
    return timeChat;
  };
  const dateChatGroup = (item) => {
    let dateChat = new Date(item.recent?.time).toLocaleDateString();

    return dateChat;
  };
  // if (dataGroupRes && dataGroupRes.length < 1) {
  //   return (
  //     <View
  //       style={{
  //         flex: 1,
  //         borderBottomLeftRadius: 15,
  //         borderBottomRightRadius: 15,
  //         backgroundColor: "#FFFFFF",
  //       }}
  //     >
  //       <Kosong width={width} height={width} />
  //       <Button
  //         onPress={() => {
  //           navigation.navigate("ChatStack", {
  //             screen: "NewGroup",
  //           });
  //         }}
  //         type="circle"
  //         size="medium"
  //         style={{
  //           position: "absolute",
  //           bottom: 20,
  //           right: 20,
  //           elevation: 5,
  //         }}
  //       >
  //         <NewGroup width="20" height="20" />
  //       </Button>
  //     </View>
  //   );
  // }

  const RecentView = ({ data, style }) => {
    if (data.type == "sticker") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            // borderWidth: 1,
          }}
        >
          <Tagsticker width={11} height={11} style={{ marginRight: 4 }} />
          <Text
            style={{ ...style, marginTop: -2 }}
            size="description"
            type="regular"
          >
            Sticker
          </Text>
        </View>
      );
    }

    if (data.type == "tag_destination") {
      let data_des = JSON.parse(data.text);
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Tagdestination width={11} height={11} style={{ marginRight: 4 }} />
          <Text
            style={style}
            size="description"
            type="regular"
            numberOfLines={2}
          >
            {data_des.name}
          </Text>
        </View>
      );
    }

    if (data.type == "tag_post") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
            // borderWidth: 1,
          }}
        >
          <Tagimage width={11} height={11} style={{ marginRight: 4 }} />
          <Text
            style={style}
            size="description"
            type="regular"
            numberOfLines={2}
          >
            Post
          </Text>
        </View>
      );
    }

    if (data.type == "tag_city") {
      let data_city = JSON.parse(data.text);
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text
            style={style}
            size="description"
            type="regular"
            numberOfLines={2}
          >
            {data_city.name}
          </Text>
        </View>
      );
    }

    if (data.type == "tag_province") {
      let data_province = JSON.parse(data.text);
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text
            style={style}
            size="description"
            type="regular"
            numberOfLines={2}
          >
            {data_province.name}
          </Text>
        </View>
      );
    }

    if (data.type == "tag_country") {
      let data_province = JSON.parse(data.text);
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text
            style={style}
            size="description"
            type="regular"
            numberOfLines={2}
          >
            {data_province.name}
          </Text>
        </View>
      );
    }

    if (data.type == "tag_movie") {
      let data_movie = JSON.parse(data.text);
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {/* <Movie width={11} height={11} style={{ marginRight: 4 }} /> */}
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
            {data_movie.name}
          </Text>
        </View>
      );
    }

    if (data.type == "att_image") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <Tagimage width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
            Image
          </Text>
        </View>
      );
    }

    return (
      <Text style={style} size="description" numberOfLines={2}>
        {data.text}
      </Text>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingBottom: 10,
        // paddingHorizontal: 5,
        backgroundColor: "#FFFFFF",
      }}
    >
      <FlatList
        data={dataGroupRes}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            key={`${item.id}_child`}
            style={{
              // flex: 1,
              // borderWidth: 1,
              flexDirection: "row",
              backgroundColor: "white",
            }}
          >
            <Pressable
              onPress={() => {
                navigation.navigate("ChatStack", {
                  screen: "GroupRoom",
                  params: {
                    room_id: item.group_id,
                    name: item.title,
                    picture: item.link_picture,
                    from: item.itinerary ? "itinerary" : "group",
                  },
                });
              }}
              style={{
                backgroundColor: "white",
                padding: 15,
                flex: 1,
                flexDirection: "row",
                borderBottomWidth: 1,
                justifyContent: "space-between",
                borderBottomColor: "#EEEEEE",
                // alignContent: "center",
                // width: width,
                // alignItems: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "80%",
                  // borderWidth: 1,
                }}
              >
                <FunImage
                  source={
                    item.link_picture
                      ? { uri: item.link_picture }
                      : default_image
                  }
                  size="xs"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: "#EEEEEE",
                  }}
                />
                <View
                  style={{
                    // width: width - 160,
                    paddingHorizontal: 15,
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: "80%",
                    // backgroundColor: "red",
                    // paddingLeft: 10,
                  }}
                >
                  {item.itinerary ? (
                    <View
                      style={{
                        backgroundColor: "#F6F6F6",
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        marginLeft: -3,
                        borderRadius: 15,
                      }}
                    >
                      <Text
                        size="small"
                        style={{
                          color: "#209FAE",
                        }}
                      >
                        {t("tripGroup")}
                      </Text>
                    </View>
                  ) : null}

                  <Text
                    size="label"
                    type="bold"
                    numberOfLines={1}
                    style={{ paddingVertical: item.itinerary ? 5 : 2 }}
                  >
                    {item.title}
                  </Text>
                  {item.recent ? (
                    <RecentChat
                      style={
                        {
                          // marginTop: -5,
                        }
                      }
                      data={item.recent}
                      room={item.id}
                    />
                  ) : null}
                </View>
              </View>
              {item.recent ? (
                <View
                  style={{
                    width: "20%",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text size="small">
                    {timeChatGroup(item)
                      ? dateChatGroup(item) == dateGroup()
                        ? timeChatGroup(item).substring(0, 5)
                        : dateChatGroup(item)
                      : null}
                  </Text>
                </View>
              ) : null}
            </Pressable>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {param == "list" ? (
        <Button
          onPress={() => {
            navigation.navigate("ChatStack", {
              screen: "NewGroup",
            });
          }}
          type="circle"
          size="medium"
          style={{
            position: "absolute",
            bottom: 20,
            right: 20,
            elevation: 5,
          }}
        >
          <NewGroup width="20" height="20" />
        </Button>
      ) : null}
    </View>
  );
}
