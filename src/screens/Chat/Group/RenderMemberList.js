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
    Arrowbackwhite,
    Delete,
    Member,
    Memberblue,
    PlusCircle,
    ArrowRightBlue,
} from "../../../assets/svg";
import Swipeout from "react-native-swipeout";

import {
    Button,
    Text,
    StatusBar,
    FunImage,
    FunImageBackground,
} from "../../../component";
import { useTranslation } from "react-i18next";

export default function RenderMemberList({
    item,
    index,
    mydata,
    props,
    dataDetail,
}) {
    const { t } = useTranslation();

    const swipeoutBtnsx = (idbuddy) => {
        return [
            {
                backgroundColor: "#f6f6f6",
                component: (
                    <TouchableOpacity
                        onPress={() => {
                            setAdmin(idbuddy, iditin);
                        }}
                        style={{
                            height: "100%",
                            width: "100%",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Member height={20} width={20} />
                        <Text
                            size="small"
                            type="regular"
                            style={{ textAlign: "center" }}
                        >
                            {t("removeadmin")}
                        </Text>
                    </TouchableOpacity>
                ),
            },
            {
                backgroundColor: "#f6f6f6",
                component: (
                    <TouchableOpacity
                        onPress={() => {
                            // DeleteBuddy(idbuddy, iditin);
                        }}
                        style={{
                            height: "100%",
                            width: "100%",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Delete height={20} width={20} />
                        <Text
                            size="small"
                            type="regular"
                            style={{
                                textAlign: "center",
                                paddingHorizontal: 2,
                            }}
                        >
                            {t("delete")}
                        </Text>
                    </TouchableOpacity>
                ),
            },
        ];
    };

    const swipeoutBtn = (idbuddy, iditin) => {
        return [
            {
                backgroundColor: "#f6f6f6",
                component: (
                    <TouchableOpacity
                        onPress={() => {
                            setAdmin(idbuddy, iditin);
                        }}
                        style={{
                            height: "100%",
                            width: "100%",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Member height={20} width={20} />
                        <Text
                            size="small"
                            type="regular"
                            style={{ textAlign: "center" }}
                        >
                            {t("SetasAdmin")}
                        </Text>
                    </TouchableOpacity>
                ),
            },
            {
                backgroundColor: "#f6f6f6",
                component: (
                    <TouchableOpacity
                        onPress={() => {
                            DeleteBuddy(idbuddy, iditin);
                        }}
                        style={{
                            height: "100%",
                            width: "100%",
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Delete height={20} width={20} />
                        <Text size="small" type="regular" style={{}}>
                            {t("delete")}
                        </Text>
                    </TouchableOpacity>
                ),
            },
        ];
    };
    console.log(mydata);
    if (dataDetail && dataDetail.type == "itinerary") {
        return (
            <Pressable
                onPress={() =>
                    props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                            idUser: item.id,
                        },
                    })
                }
                style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderBottomColor: "#EEEEEE",
                    backgroundColor: "#FFFFFF",
                    borderBottomWidth: 1,
                    paddingHorizontal: 15,
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <FunImage
                        source={{ uri: item.picture }}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginRight: 20,
                        }}
                    />
                    <View>
                        <Text>
                            {item.first_name} {item?.last_name}
                        </Text>
                        <Text>@{item.username}</Text>
                    </View>
                </View>
                {item.isadmin == true ? (
                    <View style={{ marginRight: 5 }}>
                        <Text
                            size="description"
                            type="bold"
                            style={{
                                // fontFamily: "Lato-Bold",
                                // fontSize: 12,
                                color: "#209fae",
                            }}
                        >
                            {t("admin")}
                        </Text>
                    </View>
                ) : null}
            </Pressable>
        );
    }

    if (mydata && mydata.isadmin == true) {
        if (mydata.user_id !== item.user_id) {
            return (
                <Swipeout
                    right={
                        item.isadmin == true
                            ? swipeoutBtnsx(item.id)
                            : swipeoutBtn(item.id)
                    }
                >
                    <Pressable
                        onPress={() =>
                            props.navigation.push("ProfileStack", {
                                screen: "otherprofile",
                                params: {
                                    idUser: item.id,
                                },
                            })
                        }
                        style={{
                            flexDirection: "row",
                            paddingVertical: 10,
                            borderBottomColor: "#EEEEEE",
                            backgroundColor: "#FFFFFF",
                            borderBottomWidth: 1,
                            paddingHorizontal: 15,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <FunImage
                                source={{ uri: item.picture }}
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 25,
                                    marginRight: 20,
                                }}
                            />
                            <View>
                                <Text>
                                    {item.first_name} {item?.last_name}
                                </Text>
                                <Text>@{item.username}</Text>
                            </View>
                        </View>
                        {item.isadmin == true ? (
                            <View style={{ marginRight: 5 }}>
                                <Text
                                    size="description"
                                    type="bold"
                                    style={{
                                        // fontFamily: "Lato-Bold",
                                        // fontSize: 12,
                                        color: "#209fae",
                                    }}
                                >
                                    {t("admin")}
                                </Text>
                            </View>
                        ) : null}
                    </Pressable>
                </Swipeout>
            );
        } else {
            return (
                <Pressable
                    onPress={() =>
                        props.navigation.push("ProfileStack", {
                            screen: "otherprofile",
                            params: {
                                idUser: item.id,
                            },
                        })
                    }
                    style={{
                        flexDirection: "row",
                        paddingVertical: 10,
                        borderBottomColor: "#EEEEEE",
                        backgroundColor: "#FFFFFF",
                        borderBottomWidth: 1,
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 15,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <FunImage
                            source={{ uri: item.picture }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                marginRight: 20,
                            }}
                        />
                        <View>
                            <Text>
                                {item.first_name} {item?.last_name}
                            </Text>
                            <Text>@{item.username}</Text>
                        </View>
                    </View>
                    {item.isadmin == true ? (
                        <View style={{ marginRight: 5 }}>
                            <Text
                                size="description"
                                type="bold"
                                style={{
                                    // fontFamily: "Lato-Bold",
                                    // fontSize: 12,
                                    color: "#209fae",
                                }}
                            >
                                {t("admin")}
                            </Text>
                        </View>
                    ) : null}
                </Pressable>
            );
        }
    } else {
        return (
            <Pressable
                onPress={() =>
                    props.navigation.push("ProfileStack", {
                        screen: "otherprofile",
                        params: {
                            idUser: item.id,
                        },
                    })
                }
                style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    borderBottomColor: "#EEEEEE",
                    backgroundColor: "#FFFFFF",
                    borderBottomWidth: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 15,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                    }}
                >
                    <FunImage
                        source={{ uri: item.picture }}
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            marginRight: 20,
                        }}
                    />
                    <View>
                        <Text>
                            {item.first_name} {item?.last_name}
                        </Text>
                        <Text>@{item.username}</Text>
                    </View>
                </View>
                {item.isadmin == true ? (
                    <View style={{ marginRight: 5 }}>
                        <Text
                            size="description"
                            type="bold"
                            style={{
                                // fontFamily: "Lato-Bold",
                                // fontSize: 12,
                                color: "#209fae",
                            }}
                        >
                            {t("admin")}
                        </Text>
                    </View>
                ) : null}
            </Pressable>
        );
    }
}
