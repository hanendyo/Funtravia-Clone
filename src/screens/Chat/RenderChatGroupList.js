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
export default function ChatGroupList({ dataGroupRes, navigation }) {
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
                    onPress={() =>
                        navigation.navigate("ChatStack", {
                            screen: "NewGroup",
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
                    <NewGroup width="20" height="20" />
                </Button>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={dataGroupRes}
                renderItem={({ item }) => (
                    <View key={`${item.id}_child`}>
                        <Ripple
                            onPress={() =>
                                navigation.navigate("ChatStack", {
                                    screen: "GroupRoom",
                                    params: {
                                        room_id: item.group_id,
                                        name: item.title,
                                        picture: item.link_picture,
                                        from: item.itinerary
                                            ? "itinerary"
                                            : "group",
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
                                source={
                                    item.link_picture
                                        ? { uri: item.link_picture }
                                        : default_image
                                }
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
                                    {item.title}
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
                                        {timeChatGroup(item)
                                            ? dateChatGroup(item) == dateGroup()
                                                ? timeChatGroup(item).substring(
                                                      0,
                                                      5
                                                  )
                                                : dateChatGroup(item)
                                            : null}
                                    </Text>
                                </View>
                            ) : null}
                        </Ripple>
                    </View>
                )}
                keyExtractor={(item) => item.id}
            />
            <Button
                onPress={() =>
                    navigation.navigate("ChatStack", {
                        screen: "NewGroup",
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
                <NewGroup width="20" height="20" />
            </Button>
        </View>
    );
}
