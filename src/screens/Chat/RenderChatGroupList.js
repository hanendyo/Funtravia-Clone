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
                // borderWidth: 1,
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
                    // borderWidth: 1,
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
                      data={item.recent}
                      style={
                        {
                          // marginTop: -5,
                        }
                      }
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
                    // justifyContent: "center",
                    // marginBottom: 10,
                    // borderWidth: 1,
                    // marginTop: 5,
                  }}
                >
                  <Text size="small">
                    {timeChatGroup(item)
                      ? dateChatGroup(item) == dateGroup()
                        ? timeChatGroup(item).substring(0, 5)
                        : dateChatGroup(item)
                      : null}
                  </Text>
                  {item?.count_newmassage > 0 ? (
                    <View
                      style={{
                        backgroundColor: "#209fae",
                        borderRadius: 15,
                        marginTop: 10,
                      }}
                    >
                      <Text
                        size="small"
                        type="bold"
                        style={{
                          color: "white",
                          marginHorizontal: 8,
                          marginVertical: 5,
                          lineHeight: 12,
                        }}
                      >
                        {item.count_newmassage < 999
                          ? item.count_newmassage
                          : 999 + "+"}
                      </Text>
                    </View>
                  ) : null}
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
