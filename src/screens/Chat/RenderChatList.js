import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Image,
} from "react-native";
import { Text, Button, Truncate, StatusBar, Errors } from "../../component";
import { NewGroup, Magnifying, NewChat, Kosong } from "../../assets/svg";
import { DefaultProfile, default_image } from "../../assets/png";
import Ripple from "react-native-material-ripple";

const { width, height } = Dimensions.get("screen");
export default function ChatList({ dataRes, user, navigation, LongPressFunc }) {
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
                    onPress={() =>
                        navigation.navigate("ChatStack", {
                            screen: "NewChat",
                        })
                    }
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

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={dataRes}
                renderItem={({ item }) => (
                    <View key={`${item.id}_child`}>
                        {item?.recent !== null ? (
                            <TouchableOpacity
                                onLongPress={() =>
                                    LongPressFunc(change(item), item.id)
                                }
                                onPress={() =>
                                    navigation.navigate("ChatStack", {
                                        screen: "RoomChat",
                                        params: {
                                            room_id: item.id,
                                            receiver: change(item).id,
                                            name:
                                                change(item).first_name +
                                                " " +
                                                (change(item).last_name
                                                    ? change(item).last_name
                                                    : ""),
                                            picture: change(item).picture,
                                        },
                                    })
                                }
                                style={{
                                    backgroundColor: "white",
                                    paddingVertical: 10,
                                    paddingHorizontal: 10,
                                    flexDirection: "row",
                                    borderBottomWidth: 1,
                                    borderBottomColor: "#EEEEEE",
                                    alignContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Image
                                    source={{
                                        uri:
                                            item.sender_id !== user.id
                                                ? item.sender?.picture
                                                : item.receiver?.picture,
                                    }}
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
                                    <Text
                                        size="description"
                                        type="bold"
                                        style={{ paddingVertical: 5 }}
                                    >
                                        {item.sender_id === user.id
                                            ? `${item.receiver?.first_name} ${
                                                  item.receiver?.last_name
                                                      ? item.receiver?.last_name
                                                      : ""
                                              }`
                                            : `${item.sender?.first_name} ${
                                                  item.sender?.last_name
                                                      ? item.sender?.last_name
                                                      : ""
                                              }`}
                                    </Text>
                                    {item.recent ? (
                                        <Text size="small">
                                            <Truncate
                                                text={item.recent.text}
                                                length={80}
                                            />
                                        </Text>
                                    ) : null}
                                </View>
                                {item.recent ? (
                                    <View
                                        style={{
                                            width: 100,
                                            alignItems: "flex-end",
                                            paddingRight: 10,
                                        }}
                                    >
                                        <Text size="small">
                                            {timeChat(item)
                                                ? dateChat(item) == date()
                                                    ? timeChat(item).substring(
                                                          0,
                                                          5
                                                      )
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
                onPress={() =>
                    navigation.navigate("ChatStack", {
                        screen: "NewChat",
                    })
                }
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
