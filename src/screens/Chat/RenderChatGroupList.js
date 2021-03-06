import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Platform,
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
export default function ChatGroupList({
  dataGroupRes,
  navigation,
  param,
  loading,
}) {
  const { t } = useTranslation();
  const dateGroup = () => {
    const dates = new Date();
    let day = dates.getDate();
    let month = dates.getMonth();
    let year = dates
      .getFullYear()
      .toString()
      .substr(2, 2);
    let date = day + "/" + (month + 1) + "/" + year;
    return date;
  };

  const timeChatGroup = (item) => {
    let timeChat = new Date(item.recent?.time).toTimeString();
    return timeChat;
  };

  const dateChatGroup = (item) => {
    let dateChateDate = new Date(item.recent?.time).getDate();
    let dateChateMonth = parseInt(new Date(item.recent?.time).getMonth()) + 1;
    let dateChateYear = new Date(item.recent?.time)
      .getFullYear()
      .toString()
      .substr(2, 2);
    let dateChat = dateChateDate + "/" + dateChateMonth + "/" + dateChateYear;
    return dateChat;
  };

  return (
    <View
      style={{
        paddingTop: 40,
        flex: 1,

        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        // paddingBottom: 5,
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
                  flex: 1,
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
                    paddingHorizontal: 15,
                    justifyContent: "center",
                    alignItems: "flex-start",
                    flex: 1,
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
                    width: 55,
                    alignItems: "flex-end",
                  }}
                >
                  <Text size="small">
                    {dateChatGroup(item) === dateGroup()
                      ? timeChatGroup(item).substring(0, 5)
                      : dateChatGroup(item)}
                  </Text>
                  {item?.count_newmassage > 0 ? (
                    <View
                      style={{
                        backgroundColor: "#d75995",
                        // marginLeft: 5,
                        height: 20,
                        minWidth: 20,
                        borderRadius: 20,
                        justifyContent: "center",
                        alignItems: "center",
                        paddingHorizontal: 5,
                        marginTop: 7,
                      }}
                    >
                      <Text
                        type="bold"
                        size="small"
                        style={{
                          color: "#fff",
                          marginBottom: Platform.OS == "ios" ? 0 : 1,
                          marginLeft: Platform.OS == "ios" ? 1 : 0,
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
        ListFooterComponent={() => (
          <View style={{ alignItems: "center", marginVertical: 30 }}>
            {!loading ? (
              dataGroupRes?.length ? null : (
                <Text size="label" type="bold">
                  {t("noData")}
                </Text>
              )
            ) : null}
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
