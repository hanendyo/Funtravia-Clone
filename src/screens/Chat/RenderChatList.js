import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { Text, Button, FunImage } from "../../component";
import {
  NewChat,
  Tagdestination,
  Tagimage,
  Tagsticker,
  PinAbu,
} from "../../assets/svg";
import RecentChat from "./RecentChat";

const { width, height } = Dimensions.get("screen");
export default function ChatList({
  dataRes,
  user,
  navigation,
  LongPressFunc,
  param,
}) {
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

  // if (dataRes && dataRes.length < 1) {
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
  //             screen: "NewChat",
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
  //         <NewChat width="20" height="20" />
  //       </Button>
  //     </View>
  //   );
  // }

  const RecentView = ({ data, style, room }) => {
    console.log("~ data", data);
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

    if (data.type == "tag_country") {
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
    if (data.type == "tag_event") {
      let data_province = JSON.parse(data.text);
      return (
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          {/* <PinAbu width={11} height={11} style={{ marginRight: 4 }} /> */}
          <Text style={style} size="description" type="regular">
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
        data={dataRes}
        showsVerticalScrollIndicator={false}
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
                  width: Dimensions.get("screen").width,
                }}
              >
                <FunImage
                  source={{
                    uri:
                      item.sender_id !== user?.id
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
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      paddingHorizontal: 10,
                      alignContent: "center",
                    }}
                  >
                    <Text numberOfLines={2} size="label" type="bold">
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
                      <RecentChat data={item.recent} room={item.id} />
                    ) : null}
                  </View>
                  {item.recent ? (
                    <View
                      style={{
                        width: 70,
                        alignItems: "flex-end",
                      }}
                    >
                      <Text size="small" type="regular">
                        {timeChat(item)
                          ? dateChat(item) == date()
                            ? timeChat(item).substring(0, 5)
                            : dateChat(item)
                          : null}
                      </Text>
                      {item?.count_newmassage > 0 ? (
                        <View
                          style={{
                            backgroundColor: "#209fae",
                            borderRadius: 15,
                            marginTop: 4,
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
                </View>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      {param == "list" ? (
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
      ) : null}
    </View>
  );
}
