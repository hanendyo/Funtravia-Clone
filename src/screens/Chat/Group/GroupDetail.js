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
    Modal,
    TextInput,
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
    PensilPutih,
    AddParticipant,
} from "../../../assets/svg";
import { useTranslation } from "react-i18next";
import { default_image } from "../../../assets/png";
import { API_DOMAIN } from "../../../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Item } from "native-base";
import Swipeout from "react-native-swipeout";
import RenderMemberList from "./RenderMemberList";
import { CHATSERVER, RESTFULL_API } from "../../../config";
import { RNToasty } from "react-native-toasty";

export default function GroupDetail(props) {
    let { width } = Dimensions.get("screen");
    const { t } = useTranslation();
    const [room, setRoom] = useState(props.route.params.room_id);
    const [from, setfrom] = useState(props.route.params.from);
    const [dataDetail, setDatadetail] = useState();
    const [textName, setTextName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalkick, setModalkick] = useState(false);
    const [modalmakeadmin, setModalmakeadmin] = useState(false);
    const [modalremoveadmin, setModalremoveadmin] = useState(false);
    const [modalrename, setModalrename] = useState(false);
    const [selected, setSelected] = useState(false);
    const [indexActive, setIndexActive] = useState(null);
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
            await setTextName(dataResponse.grup.title);
            var inde = dataResponse.grup.buddy.findIndex(
                (k) => k["user_id"] === data_setting.user.id
            );
            // console.log(inde);
            await setMydata(dataResponse.grup.buddy[inde]);
            // console.log(inde);
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
    // console.log(dataDetail);
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
        props.navigation.setOptions(headerOptions);
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener("focus", () => {
            getUserAndToken();
        });
        return unsubscribe;
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

    const _kickMember = async (user_id) => {
        setIndexActive(null);
        let data_kirim = JSON.stringify({
            group_id: dataDetail.id,
            user_id: user_id,
        });
        try {
            let response = await fetch(
                `${RESTFULL_API}room/group/kick_member_group`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: data_kirim,
                }
            );
            let responseJson = await response.json();
            if (responseJson.status == true) {
                getUserAndToken();
            } else {
                //   setloading(false);
                throw new Error(responseJson.message);
            }
        } catch (error) {
            // setloading(false);
            RNToasty.Show({
                duration: 1,
                title: "error : someting wrong!",
                position: "bottom",
            });
            console.log(error);
        }
    };

    const _makeAdmin = async (user_id) => {
        setIndexActive(null);
        let data_kirim = JSON.stringify({
            group_id: dataDetail.id,
            user_id: user_id,
        });
        try {
            let response = await fetch(`${RESTFULL_API}room/group/add_admin`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json",
                },
                body: data_kirim,
            });
            let responseJson = await response.json();
            if (responseJson.status == true) {
                getUserAndToken();
            } else {
                //   setloading(false);
                throw new Error(responseJson.message);
            }
        } catch (error) {
            RNToasty.Show({
                duration: 1,
                title: "error : someting wrong!",
                position: "bottom",
            });
            // setloading(false);
            console.log(error);
        }
    };
    const _removeAdmin = async (user_id) => {
        setIndexActive(null);
        let data_kirim = JSON.stringify({
            group_id: dataDetail.id,
            user_id: user_id,
        });
        try {
            let response = await fetch(
                `${RESTFULL_API}room/group/remove_admin`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: data_kirim,
                }
            );
            let responseJson = await response.json();
            if (responseJson.status == true) {
                getUserAndToken();
            } else {
                //   setloading(false);
                throw new Error(responseJson.message);
            }
        } catch (error) {
            RNToasty.Show({
                duration: 1,
                title: "error : someting wrong!",
                position: "bottom",
            });
            // setloading(false);
            console.log(error);
        }
    };

    const _renameGroup = async (text) => {
        setIndexActive(null);
        console.log(text);
        let data_kirim = JSON.stringify({
            group_id: dataDetail.id,
            title: text,
        });
        try {
            let response = await fetch(
                `${RESTFULL_API}room/group/rename_group`,
                {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        Authorization: "Bearer " + token,
                        "Content-Type": "application/json",
                    },
                    body: data_kirim,
                }
            );
            let responseJson = await response.json();
            if (responseJson.status == true) {
                getUserAndToken();
            } else {
                //   setloading(false);
                throw new Error(responseJson.message);
            }
        } catch (error) {
            RNToasty.Show({
                duration: 1,
                title: "error : someting wrong!",
                position: "bottom",
            });
            // setloading(false);
            console.log(error);
        }
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
                <View
                    style={{
                        height: 40,
                        width: width,
                        paddingHorizontal: 15,
                        alignItems: "center",
                        flexDirection: "row",
                        backgroundColor: "#209FAE",
                        justifyContent: "space-between",
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
                    ) : (
                        <Pressable
                            onPress={() => {
                                setModalrename();
                            }}
                            style={{
                                width: "10%",
                                alignItems: "flex-end",
                            }}
                        >
                            <PensilPutih width={20} height={20} />
                        </Pressable>
                    )}
                </View>
            </View>
            {/* <View
                style={{
                    backgroundColor: "#f3f3f3",
                    height: 10,
                }}
            /> */}

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
                        ListHeaderComponent={() =>
                            dataDetail && dataDetail.type !== "itinerary" ? (
                                <Pressable
                                    onPress={() =>
                                        props.navigation.navigate("ChatStack", {
                                            screen: "AddMember",
                                            params: {
                                                dataBuddy: dataDetail.buddy,
                                                token: token,
                                                id_group: dataDetail.id,
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
                                        <View
                                            source={{ uri: default_image }}
                                            style={{
                                                backgroundColor: "#DAF0F2",
                                                width: 50,
                                                height: 50,
                                                borderRadius: 25,
                                                marginRight: 20,
                                                justifyContent: "center",
                                                alignItems: "center",
                                            }}
                                        >
                                            <AddParticipant
                                                width={25}
                                                height={25}
                                            />
                                        </View>
                                        <View>
                                            <Text>{t("addParticipant")}</Text>
                                        </View>
                                    </View>
                                </Pressable>
                            ) : null
                        }
                        renderItem={({ item, index }) => (
                            <RenderMemberList
                                item={item}
                                index={index}
                                mydata={mydata}
                                props={props}
                                dataDetail={dataDetail}
                                getUserAndToken={() => getUserAndToken()}
                                token={token}
                                setModalkick={(e) => setModalkick(e)}
                                setModalmakeadmin={(e) => setModalmakeadmin(e)}
                                setSelected={(e) => setSelected(e)}
                                setIndexActive={(e) => setIndexActive(e)}
                                setModalremoveadmin={(e) =>
                                    setModalremoveadmin(e)
                                }
                                indexActive={indexActive}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                    />
                ) : null}
            </View>

            {/* modal kick */}
            <Modal
                useNativeDriver={true}
                visible={modalkick}
                onRequestClose={() => setModalkick(false)}
                transparent={true}
                animationType="fade"
            >
                <Pressable
                    onPress={() => setModalkick(false)}
                    style={{
                        width: Dimensions.get("screen").width,
                        height: Dimensions.get("screen").height,
                        justifyContent: "center",
                        opacity: 0.7,
                        backgroundColor: "#000",
                        position: "absolute",
                    }}
                />
                <View
                    style={{
                        width: Dimensions.get("screen").width - 60,
                        marginHorizontal: 30,
                        backgroundColor: "#FFF",
                        zIndex: 15,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        alignContent: "center",
                        borderRadius: 3,
                        marginTop: Dimensions.get("screen").height / 3,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: Dimensions.get("screen").width - 60,
                            padding: 20,
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ alignSelf: "center" }}>
                            {t("alertHapusMember")}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 20,
                                paddingHorizontal: 40,
                            }}
                        >
                            <Button
                                onPress={() => {
                                    _kickMember(selected.user_id);
                                    setModalkick(false);
                                }}
                                color="primary"
                                text={t("delete")}
                            ></Button>
                            <Button
                                onPress={() => {
                                    setModalkick(false);
                                }}
                                color="secondary"
                                variant="bordered"
                                text={t("cancel")}
                            ></Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* modal make admin */}
            <Modal
                useNativeDriver={true}
                visible={modalmakeadmin}
                onRequestClose={() => setModalmakeadmin(false)}
                transparent={true}
                animationType="fade"
            >
                <Pressable
                    onPress={() => setModalmakeadmin(false)}
                    style={{
                        width: Dimensions.get("screen").width,
                        height: Dimensions.get("screen").height,
                        justifyContent: "center",
                        opacity: 0.7,
                        backgroundColor: "#000",
                        position: "absolute",
                    }}
                />
                <View
                    style={{
                        width: Dimensions.get("screen").width - 60,
                        marginHorizontal: 30,
                        backgroundColor: "#FFF",
                        zIndex: 15,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        alignContent: "center",
                        borderRadius: 3,
                        marginTop: Dimensions.get("screen").height / 3,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: Dimensions.get("screen").width - 60,
                            padding: 20,
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ alignSelf: "center" }}>
                            {t("alertMakeAdmin")}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 20,
                                paddingHorizontal: 40,
                            }}
                        >
                            <Button
                                onPress={() => {
                                    _makeAdmin(selected.user_id);
                                    setModalmakeadmin(false);
                                }}
                                color="primary"
                                text={t("makeAdmin")}
                            ></Button>
                            <Button
                                onPress={() => {
                                    setModalmakeadmin(false);
                                }}
                                color="secondary"
                                variant="bordered"
                                text={t("cancel")}
                            ></Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* modal remove_admin */}
            <Modal
                useNativeDriver={true}
                visible={modalremoveadmin}
                onRequestClose={() => setModalremoveadmin(false)}
                transparent={true}
                animationType="fade"
            >
                <Pressable
                    onPress={() => setModalremoveadmin(false)}
                    style={{
                        width: Dimensions.get("screen").width,
                        height: Dimensions.get("screen").height,
                        justifyContent: "center",
                        opacity: 0.7,
                        backgroundColor: "#000",
                        position: "absolute",
                    }}
                />
                <View
                    style={{
                        width: Dimensions.get("screen").width - 60,
                        marginHorizontal: 30,
                        backgroundColor: "#FFF",
                        zIndex: 15,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        alignContent: "center",
                        borderRadius: 3,
                        marginTop: Dimensions.get("screen").height / 3,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: Dimensions.get("screen").width - 60,
                            padding: 20,
                            justifyContent: "center",
                        }}
                    >
                        <Text style={{ alignSelf: "center" }}>
                            {t("alertRemoveAdmin")}
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingVertical: 20,
                                paddingHorizontal: 40,
                            }}
                        >
                            <Button
                                onPress={() => {
                                    _removeAdmin(selected.user_id);
                                    setModalremoveadmin(false);
                                }}
                                color="primary"
                                text={t("removeAdmin")}
                            ></Button>
                            <Button
                                onPress={() => {
                                    setModalremoveadmin(false);
                                }}
                                color="secondary"
                                variant="bordered"
                                text={t("cancel")}
                            ></Button>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* modal rename */}
            <Modal
                useNativeDriver={true}
                visible={modalrename}
                onRequestClose={() => setModalrename(false)}
                transparent={true}
                animationType="fade"
            >
                <Pressable
                    onPress={() => setModalrename(false)}
                    style={{
                        width: Dimensions.get("screen").width,
                        height: Dimensions.get("screen").height,
                        justifyContent: "center",
                        opacity: 0.7,
                        backgroundColor: "#000",
                        position: "absolute",
                    }}
                />
                <View
                    style={{
                        width: Dimensions.get("screen").width - 60,
                        marginHorizontal: 30,
                        backgroundColor: "#FFF",
                        zIndex: 15,
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        alignContent: "center",
                        borderRadius: 3,
                        marginTop: Dimensions.get("screen").height / 3,
                    }}
                >
                    <View
                        style={{
                            backgroundColor: "white",
                            width: Dimensions.get("screen").width - 60,
                            paddingVertical: 15,
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                paddingHorizontal: 15,
                                paddingBottom: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: "#D1D1D1",
                            }}
                        >
                            <Text
                                size="title"
                                type="bold"
                                style={{ alignSelf: "flex-start" }}
                            >
                                {t("newGroupName")}
                            </Text>
                        </View>
                        <View
                            style={{
                                // borderColor: "#D1D1D1",
                                width: width - 100,
                                marginVertical: 15,
                                alignSelf: "center",
                                backgroundColor: "#f6f6f6",
                            }}
                        >
                            <TextInput
                                value={textName}
                                placeholder="Group name"
                                placeholderTextColor="#6C6C6C"
                                onChangeText={(text) => setTextName(text)}
                                maxLength={25}
                                style={
                                    Platform.OS == "ios"
                                        ? { maxHeight: 100, margin: 10 }
                                        : {
                                              maxHeight: 100,
                                              marginVertical: 5,
                                              marginHorizontal: 10,
                                              padding: 0,
                                          }
                                }
                            />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                                // paddingVertical: 15,
                                paddingHorizontal: 15,
                            }}
                        >
                            <Button
                                onPress={() => {
                                    setModalrename(false);
                                    setTextName(dataDetail?.title);
                                }}
                                size="medium"
                                color="transparant"
                                text={t("cancel")}
                            ></Button>
                            <Button
                                onPress={() => {
                                    _renameGroup(textName);
                                    setModalrename(false);
                                }}
                                style={{
                                    marginLeft: 10,
                                }}
                                color="primary"
                                text={t("submit")}
                            ></Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}
