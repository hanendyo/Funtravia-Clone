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

const { width, height } = Dimensions.get("screen");
export default function ChatGroupList({ dataGroupRes, navigation }) {
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
  if (dataGroupRes && dataGroupRes.length < 1) {
    return (
      <View style={{ flex: 1 }}>
        <Kosong width={width} height={width} />
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
      </View>
    );
  }

  const RecentView = ({ data, style }) => {
    if (data.type == "sticker") {
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            // borderWidth: 1,
          }}
        >
          <Tagsticker width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
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
          }}
        >
          <Tagdestination width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
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
            // borderWidth: 1,
          }}
        >
          <Tagimage width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
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
          }}
        >
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
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
          }}
        >
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={style} size="description" type="regular">
            {data_province.name}
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
    <View style={{}}>
      <FlatList
        data={dataGroupRes}
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
                  width: "85%",
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
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "80%",
                    // paddingLeft: 10,
                  }}
                >
                  {item.itinerary ? (
                    <View
                      style={{
                        backgroundColor: "#F6F6F6",
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                        marginLeft: -3,
                        borderRadius: 15,
                        // maxWidth: 100,
                        // alignItems: "center",
                        // alignContent: "center",
                        // justifyContent: "center",
                      }}
                    >
                      {/* <View style={{}}> */}
                      <Text
                        size="small"
                        style={{
                          color: "#209FAE",
                        }}
                      >
                        {t("tripGroup")}
                        {/* Trip Group */}
                      </Text>
                      {/* </View> */}
                    </View>
                  ) : null}

                  <Text
                    size="label"
                    type="bold"
                    numberOfLines={1}
                    style={{ paddingVertical: 5 }}
                  >
                    {item.title}
                  </Text>
                  {item.recent ? (
                    <RecentView
                      style={{
                        marginTop: -5,
                      }}
                      data={item.recent}
                    />
                  ) : null}
                </View>
              </View>
              {item.recent ? (
                <View
                  style={{
                    width: "15%",
                    alignItems: "flex-end",
                    // marginTop: 5,
                    // paddingRight: 10,
                    justifyContent: "center",
                    marginBottom: 10,
                    // borderWidth: 1,
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
    </View>
  );
}
