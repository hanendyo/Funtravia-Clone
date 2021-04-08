import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Dimensions,
    TextInput,
    Image,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    ActivityIndicator,
    ImageBackground,
    FlatList,
    Pressable,
    ToastAndroid,
    Platform,
    AlertIOS,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import {
    Button,
    Text,
    Truncate,
    CustomImage,
    Loading,
    StatusBar,
} from "../../../component";
import { useTranslation } from "react-i18next";
import {
    Arrowbackwhite,
    Send,
    Smile,
    ArrowRightBlue,
    Next,
} from "../../../assets/svg";
import { API_DOMAIN } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "native-base";

export default function GroupDetail(props) {
    let { width, height } = Dimensions.get("screen");
    const { t, i18n } = useTranslation();
    const [room, setRoom] = useState(props.route.params.room_id);
    const [from, setfrom] = useState(props.route.params.from);
    const [dataDetail, setDatadetail] = useState();
    const [loading, setLoading] = useState(true);
    console.log(dataDetail);
    console.log(props.route.params.room_id);
    console.log(props.route.params.from);
    const headerOptions = {
        headerShown: true,
        headerTransparent: true,
        headerTitle: "",
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
            marginLeft: -10,
        },
        headerLeft: () => (
            <Button
                text={""}
                size="medium"
                type="circle"
                variant="transparent"
                onPress={() => props.navigation.goBack()}
                style={{
                    height: 55,
                    marginLeft: 10,
                }}
            >
                <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
            </Button>
        ),
        headerRight: () => (
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                }}
            ></View>
        ),
    };
    let toast = useRef();
    const getDetailGroup = async (access_token) => {
        setLoading(true);
        let response = await fetch(
            `${API_DOMAIN}/api/room/group/groupdetail?group_id=${room}&from=${from}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${access_token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        let dataResponse = await response.json();
        if (dataResponse.status == true) {
            await setDatadetail(dataResponse.grup);
            await setLoading(false);
            console.log(dataResponse);
        } else {
            await setLoading(false);
            if (Platform.OS === "android") {
                ToastAndroid.show(dataResponse.message, ToastAndroid.SHORT);
            } else {
                AlertIOS.alert(dataResponse.message);
            }
        }
    };

    const getUserAndToken = async () => {
        let token = await AsyncStorage.getItem("access_token");
        if (token) {
            await getDetailGroup(token);
        }
    };
    useEffect(() => {
        getUserAndToken();
        props.navigation.setOptions(headerOptions);
    }, []);

    const [layout, setLayout] = useState();
    console.log("layout", layout);
    const goToItinerary = (data) => {
        props.navigation.push("ItineraryStack", {
            screen: "itindetail",
            params: {
                itintitle: data.title,
                country: data.id,
                dateitin: "",
                token: token,
                status: "",
                index: 0,
                datadayaktif: null,
            },
        });
    };
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
                backgroundColor: "#FFFFFF",
            }}
        >
            <StatusBar backgroundColor="#14646e" barStyle="light-content" />

            <View
                onLayout={(event) => {
                    setLayout(event.nativeEvent.layout);
                }}
                style={
                    {
                        // borderWidth: 1,
                    }
                }
            >
                <ImageBackground
                    source={{ uri: dataDetail?.link_picture }}
                    style={{ width: width, height: 200 }}
                    imageStyle={{ width: width, height: 200 }}
                ></ImageBackground>
                <LinearGradient
                    colors={["rgba(32, 159, 174, 1)", "rgba(211, 211, 211, 0)"]}
                    start={{ x: 0.3, y: 1 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        height: 40,
                        width: width,
                        paddingHorizontal: 15,
                        alignItems: "center",
                        flexDirection: "row",
                        // justifyContent: "space-between",
                    }}
                >
                    <Text
                        size="title"
                        type="bold"
                        numberOfLines={1}
                        style={{
                            color: "#FFFFFF",
                            width: "90%",
                            paddingRight: 20,
                        }}
                    >
                        {dataDetail?.title}
                    </Text>
                    {dataDetail && dataDetail.type == "itinerary" ? (
                        <Pressable
                            onPress={() => goToItinerary(dataDetail)}
                            style={{
                                width: "10%",
                            }}
                        >
                            <ArrowRightBlue width={30} height={30} />
                        </Pressable>
                    ) : null}
                </LinearGradient>
                <View
                    style={{
                        padding: 15,
                        backgroundColor: "#FFFFFF",
                        height: 100,
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <Text size="label" type="bold" style={{}}>
                            Media
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text type="bold">0</Text>
                            <Next width={10} height={10} />
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{
                    backgroundColor: "#f3f3f3",
                    height: 10,
                }}
            />

            <View
                style={{
                    paddingVertical: 15,
                    marginTop: 10,
                    backgroundColor: "#FFFFFF",
                    // height: height - layout.height - 55,
                }}
            >
                <View
                    style={{
                        paddingHorizontal: 15,

                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Text size="label" type="bold" style={{}}>
                        Member
                    </Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}
                    >
                        <Text type="bold">
                            {dataDetail?.buddy.length} {t("participants")}
                        </Text>
                    </View>
                </View>
                <FlatList
                    data={
                        dataDetail &&
                        dataDetail.buddy &&
                        dataDetail.buddy.length > 0
                            ? dataDetail.buddy
                            : null
                    }
                    scrollEnabled={false}
                    contentContainerStyle={{}}
                    renderItem={({ item, index }) => (
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
                                borderBottomWidth: 1,
                            }}
                        >
                            <View
                                style={{
                                    paddingHorizontal: 15,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Image
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
                        </Pressable>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        </ScrollView>
    );
}
