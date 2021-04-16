import React, { useState, useEffect } from "react";
import {
    View,
    StyleSheet,
    ImageBackground,
    Dimensions,
    TextInput,
    Platform,
    SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Text, Button, CustomImage } from "../../component";

import { gql } from "apollo-boost";
import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { Header, Content, Tab, Tabs, ScrollableTab } from "native-base";
import Information from "./DetailNotification/Information";
import Invitation from "./DetailNotification/Invitation";
const ListNotifikasi_ = gql`
    query {
        list_notification {
            ids
            notification_type
            isread
            itinerary_buddy {
                id
                itinerary_id
                user_id
                isadmin
                isconfrim
                myuser {
                    id
                    username
                    first_name
                    last_name
                    picture
                }
                userinvite {
                    id
                    username
                    first_name
                    last_name
                    picture
                }
                accepted_at
                rejected_at
            }
            comment_feed {
                id
                post_id
                text
                user {
                    id
                    username
                    first_name
                    last_name
                    picture
                }
                post {
                    assets {
                        filepath
                    }
                }
                post_asset {
                    type
                    filepath
                }
                created_at
                updated_at
            }
            like_feed {
                id
                post_id
                response
                user {
                    id
                    username
                    first_name
                    last_name
                    picture
                }
                post_asset {
                    type
                    filepath
                }
            }

            follow_user {
                user_req
                user_follow
                status
                user {
                    id
                    username
                    first_name
                    last_name
                    picture
                    status_following
                    status_follower
                }
            }
            tgl_buat
            created_at
            updated_at
        }
    }
`;

export default function Notification(props) {
    let [token, setToken] = useState("");
    let [preview, setPreview] = useState("list");
    const HeaderComponent = {
        headerShown: true,
        transparent: false,
        tabBarVisble: false,
        headerTintColor: "white",
        headerTitle: "Inbox",
        headerMode: "screen",
        headerStyle: {
            backgroundColor: "#209FAE",
            elevation: 0,
            borderBottomWidth: 0,
        },
        headerTitleStyle: {
            fontFamily: "Lato-Bold",
            fontSize: 14,
            color: "white",
        },
        headerLeftContainerStyle: {
            background: "#FFF",
        },
    };
    const loadAsync = async () => {
        let tkn = await AsyncStorage.getItem("access_token");
        await setToken(tkn);
        await GetListNotif();
        console.log(tkn);
    };

    useEffect(() => {
        props.navigation.setOptions(HeaderComponent);
        loadAsync();
    }, []);
    const [
        GetListNotif,
        { data: datanotif, loading: loadingnotif, error: errornotif },
    ] = useLazyQuery(ListNotifikasi_, {
        fetchPolicy: "network-only",
        context: {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        },
    });

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View
                style={{
                    alignContent: "center",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <View>
                    <Tabs
                        scrollWithoutAnimation={false}
                        tabBarUnderlineStyle={{ backgroundColor: "#209FAE" }}
                        tabContainerStyle={{ borderWidth: 0 }}
                        renderTabBar={() => (
                            <ScrollableTab
                                tabStyle={{ backgroundColor: "transparent" }}
                                tabsContainerStyle={{
                                    backgroundColor: "white",
                                }}
                                underlineStyle={{
                                    borderColor: "#209FAE",
                                    backgroundColor: "#209FAE",
                                }}
                            />
                        )}
                    >
                        <Tab
                            heading="Notification"
                            tabStyle={{ backgroundColor: "white" }}
                            activeTabStyle={{ backgroundColor: "white" }}
                            textStyle={{
                                fontFamily: "Lato-Bold",
                                color: "#6C6C6C",
                            }}
                            activeTextStyle={{
                                fontFamily: "Lato-Bold",
                                color: "#209FAE",
                            }}
                        >
                            {token && datanotif ? (
                                <Invitation
                                    navigation={props.navigation}
                                    token={token}
                                    datas={datanotif}
                                    GetListNotif={() => GetListNotif()}
                                />
                            ) : null}
                        </Tab>
                        <Tab
                            heading="Information"
                            tabStyle={{ backgroundColor: "white" }}
                            activeTabStyle={{ backgroundColor: "white" }}
                            textStyle={{
                                fontFamily: "Lato-Bold",
                                color: "#6C6C6C",
                            }}
                            activeTextStyle={{
                                fontFamily: "Lato-Bold",
                                color: "#209FAE",
                            }}
                        ></Tab>
                    </Tabs>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({});
