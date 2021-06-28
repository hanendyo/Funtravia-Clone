import React, { useState, useEffect, useRef } from "react";
import {
    View,
    Dimensions,
    ScrollView,
    FlatList,
    Pressable,
    ToastAndroid,
    Platform,
    AlertIOS,
    TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";

import {
    Button,
    Text,
    StatusBar,
    FunImage,
    FunImageBackground,
} from "../../../component";
import {
    Arrowbackwhite,
    Delete,
    Member,
    Memberblue,
    PlusCircle,
    ArrowRightBlue,
} from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { default_image } from "../../../assets/png";
import { API_DOMAIN } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "native-base";
import Swipeout from "react-native-swipeout";
import RenderMemberList from "./RenderMemberList";

export default function GroupDetail(props) {
    let { width } = Dimensions.get("screen");
    const { t } = useTranslation();
    const [room, setRoom] = useState(props.route.params.room_id);
    const [from, setfrom] = useState(props.route.params.from);
    const [dataDetail, setDatadetail] = useState();
    const [loading, setLoading] = useState(true);
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
    let [mydata, setMydata] = useState();

    const getDetailGroup = async (access_token, data_setting) => {
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
            var inde = dataResponse.grup.buddy.findIndex(
                (k) => k["user_id"] === data_setting.user.id
            );
            console.log(inde);
            await setMydata(dataResponse.grup.buddy[inde]);
            console.log(inde);
            await setLoading(false);
        } else {
            await setLoading(false);
            if (Platform.OS === "android") {
                ToastAndroid.show(dataResponse.message, ToastAndroid.SHORT);
            } else {
                AlertIOS.alert(dataResponse.message);
            }
        }
    };
    console.log(dataDetail);
    let [setting, setSetting] = useState();

    const getUserAndToken = async () => {
        let token = await AsyncStorage.getItem("access_token");
        let setsetting = await AsyncStorage.getItem("setting");
        await setSetting(JSON.parse(setsetting));
        let data_setting = JSON.parse(setsetting);
        if (token && data_setting) {
            await getDetailGroup(token, data_setting);
        }
    };
    useEffect(() => {
        getUserAndToken();
        props.navigation.setOptions(headerOptions);
    }, []);

    const [layout, setLayout] = useState();
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
                {dataDetail?.type === "itinerary" ? (
                    <FunImageBackground
                        source={
                            dataDetail && dataDetail.cover
                                ? { uri: dataDetail?.cover }
                                : default_image
                        }
                        style={{ width: width, height: 200 }}
                        imageStyle={{ width: width, height: 200 }}
                    ></FunImageBackground>
                ) : (
                    <FunImageBackground
                        source={
                            dataDetail && dataDetail.link_picture
                                ? { uri: dataDetail?.link_picture }
                                : default_image
                        }
                        style={{ width: width, height: 200 }}
                        imageStyle={{ width: width, height: 200 }}
                    ></FunImageBackground>
                )}
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
                {mydata ? (
                    <FlatList
                        data={
                            dataDetail &&
                            dataDetail.buddy &&
                            dataDetail.buddy.length > 0
                                ? dataDetail.buddy
                                : null
                        }
                        scrollEnabled={false}
                        contentContainerStyle={{
                            backgroundColor: "#FFFFFF",
                        }}
                        renderItem={({ item, index }) => (
                            <RenderMemberList
                                item={item}
                                index={index}
                                mydata={mydata}
                                props={props}
                                dataDetail={dataDetail}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : null}
            </View>
        </ScrollView>
    );
}
