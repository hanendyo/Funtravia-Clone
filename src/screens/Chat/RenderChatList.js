import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Image,
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
  Magnifying,
  NewChat,
  Kosong,
  Tagdestination,
  Tagdocument,
  Tagimage,
  Tagsticker,
  PinHitam,
  PinAbu,
} from "../../assets/svg";
import { DefaultProfile, default_image } from "../../assets/png";
import Ripple from "react-native-material-ripple";

const { width, height } = Dimensions.get("screen");
export default function ChatList({ dataRes, user, navigation, LongPressFunc }) {
  // console.log(dataRes);
  const change = (item) => {
    let change = item.sender_id === user.id ? item.receiver : item.sender;
    return change;
  };

  const timeChat = (item) => {
    let timeChat = new Date(item.recent?.time).toTimeString();
    return timeChat;
  };

  const date = () => {
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
  const dateChat = (item) => {
    let dateChateDate = new Date(item.recent?.time).getDate();
    let dateChateMonth = new Date(item.recent?.time).getMonth();
    let dateChateYear = new Date(item.recent?.time)
      .getFullYear()
      .toString()
      .substr(2, 2);
    let dateChat =
      dateChateDate + "/" + (dateChateMonth + 1) + "/" + dateChateYear;
    return dateChat;
  };

  if (dataRes && dataRes.length < 1) {
    return (
      <View style={{ flex: 1 }}>
        <Kosong width={width} height={width} />
        <Button
          onPress={() => {
            navigation.navigate("ChatStack", {
              screen: "NewChat",
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
          <NewChat width="20" height="20" />
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
          }}
        >
          <PinAbu width={11} height={11} style={{ marginRight: 4 }} />
          <Text style={(style, {})} size="description" type="regular">
            {data_city.name}
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={dataRes}
        renderItem={({ item }) => (
          <View key={`${item.id}_child`}>
            {item.recent ? (
              <TouchableOpacity
                onLongPress={() => LongPressFunc(change(item), item.id)}
                onPress={() => {
                  navigation.navigate("ChatStack", {
                    screen: "RoomChat",
                    params: {
                      room_id: item.id,
                      receiver: change(item).id,
                      name:
                        change(item).first_name +
                        " " +
                        (change(item).last_name ? change(item).last_name : ""),
                      picture: change(item).picture,
                    },
                  });
                }}
                style={{
                  backgroundColor: "white",
                  padding: 15,
                  flexDirection: "row",
                  borderBottomWidth: 1,
                  borderBottomColor: "#EEEEEE",
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <FunImage
                  source={{
                    uri:
                      item.sender_id !== user.id
                        ? item.sender?.picture
                        : item.receiver?.picture,
                  }}
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
                    width: width - 160,
                    paddingHorizontal: 10,
                  }}
                >
                  <Text size="label" type="bold" style={{ paddingVertical: 5 }}>
                    {item.sender_id === user.id
                      ? `${item.receiver?.first_name} ${
                          item.receiver?.last_name
                            ? item.receiver?.last_name
                            : ""
                        }`
                      : `${item.sender?.first_name} ${
                          item.sender?.last_name ? item.sender?.last_name : ""
                        }`}
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
                {item.recent ? (
                  <View
                    style={{
                      width: 100,
                      alignItems: "flex-end",
                      paddingRight: 20,
                    }}
                  >
                    <Text size="small">
                      {timeChat(item)
                        ? dateChat(item) == date()
                          ? timeChat(item).substring(0, 5)
                          : dateChat(item)
                        : null}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Button
        onPress={() => {
          navigation.navigate("ChatStack", {
            screen: "NewChat",
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
        <NewChat width="20" height="20" />
      </Button>
    </View>
  );
}
