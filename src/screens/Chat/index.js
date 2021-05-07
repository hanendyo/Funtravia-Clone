import React, { useEffect, useState } from "react";
import {
    View,
    TextInput,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Image,
    Alert,
    StyleSheet,
} from "react-native";
import { NewGroup, Magnifying, NewChat, Kosong } from "../../assets/svg";
import { DefaultProfile, default_image } from "../../assets/png";
import { Text, Button, Truncate, StatusBar, Errors } from "../../component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { CHATSERVER } from "../../config";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
import ChatGroupList from "./RenderChatGroupList";
import ChatList from "./RenderChatList";

export default function Message({ navigation }) {
    const { width, height } = Dimensions.get("screen");
    const { t } = useTranslation();
    const [user, setUser] = useState({});
    const [token, setToken] = useState(null);
    const [data, setData] = useState([]);
    const [dataRes, setDataRes] = useState([]);
    const [dataGroup, setDataGroup] = useState([]);
    const [dataGroupRes, setDataGroupRes] = useState([]);
    const [active, setActive] = useState("personal");

    const HeaderComponent = {
        tabBarBadge: null,
    };

    useEffect(() => {
        navigation.setOptions(HeaderComponent);
        getUserAndToken();
        const unsubscribe = navigation.addListener("focus", () => {
            getUserAndToken();
        });
        return unsubscribe;
    }, []);

    const getRoom = async (access_token) => {
        let response = await fetch(`${CHATSERVER}/api/personal/list`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        });
        let dataResponse = await response.json();
        console.log(dataResponse);
        await setData(dataResponse);
        await setDataRes(dataResponse);
    };

    const getRoomGroup = async (access_token) => {
        let response = await fetch(`${CHATSERVER}/api/group/list`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${access_token}`,
                "Content-Type": "application/json",
            },
        });
        let dataResponse = await response.json();
        await setDataGroup(dataResponse);
        await setDataGroupRes(dataResponse);
    };

    const getUserAndToken = async () => {
        let setting = JSON.parse(await AsyncStorage.getItem("setting"));
        if (setting) {
            await setUser(setting.user);
        }
        let token = await AsyncStorage.getItem("access_token");
        if (token) {
            await setToken(token);
            await getRoom(token);
            await getRoomGroup(token);
        }

        if (token === null) {
            Alert.alert("Silahkan login terlebih dahulu");
            navigation.navigate("HomeScreen");
        }
    };

    const [messages, setMessages] = useState("");
    const [modalError, setModalError] = useState(false);

    const LongPressFunc = (item, room_id) => {
        Alert.alert(
            "Confirm",
            `Are you sure to delete message with ${item.first_name} ${
                item.last_name ? item.last_name : ""
            }`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Canceled"),
                    style: "cancel",
                },
                { text: "OK", onPress: () => DeleteChat(item.id, room_id) },
            ]
        );
    };

    const DeleteChat = async (id, room_id) => {
        let response = await fetch(
            `${CHATSERVER}/api/personal/delete?receiver_id=${id}`,
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        console.log(response);
        await AsyncStorage.removeItem("history_" + room_id);
        getRoom(token);
    };

    const _searchHandle = (text) => {
        // if (active == "personal") {
        let newData = data.filter(function(str) {
            let strData = str.sender.id === user.id ? str.receiver : str.sender;
            return strData.first_name
                .toLowerCase()
                .includes(text.toLowerCase());
        });
        setDataRes(newData);
        // }

        // if (active == "group") {
        let newDataGroup = dataGroup.filter(function(str) {
            return str.title.toLowerCase().includes(text.toLowerCase());
        });
        console.log(newDataGroup);
        setDataGroupRes(newDataGroup);
        // }
    };

    const HeaderHeight = width + 5;

    const renderLabel = ({ route, focused }) => {
        return (
            <Text
                style={[
                    focused ? styles.labelActive : styles.label,
                    { opacity: focused ? 1 : 0.7 },
                ]}
            >
                {route.title}
            </Text>
        );
    };

    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: "personal", title: "Personal" },
        { key: "group", title: "Group" },
    ]);

    // const renderScene = SceneMap({
    // 	personal: Personal,
    // 	group: Group,
    // });
    const renderScene = ({ route }) => {
        if (route.key == "personal") {
            return (
                <ChatList
                    dataRes={dataRes}
                    user={user}
                    navigation={navigation}
                    LongPressFunc={(item, room_id) => {
                        LongPressFunc(item, room_id);
                    }}
                />
            );
        } else if (route.key == "group") {
            return (
                <ChatGroupList
                    dataGroupRes={dataGroupRes}
                    navigation={navigation}
                />
            );
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar barStyle="dark-content" />
            <Errors
                modals={modalError}
                setModals={(e) => setModalError(e)}
                message={messages}
            />
            <View style={{ backgroundColor: "#209FAE" }}>
                <View
                    style={{
                        margin: 15,
                        backgroundColor: "#FFFFFF",
                        flexDirection: "row",
                        borderRadius: 3,
                        alignContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Magnifying
                        width="20"
                        height="20"
                        style={{ marginHorizontal: 10 }}
                    />
                    <TextInput
                        onChangeText={(e) => _searchHandle(e)}
                        placeholder="Search Chat"
                        style={{
                            color: "#464646",
                            fontFamily: "Lato-Regular",
                            height: 40,
                            width: "100%",
                        }}
                    />
                </View>
            </View>
            <TabView
                lazy={true}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={(props) => {
                    return (
                        <TabBar
                            {...props}
                            style={{
                                backgroundColor: "white",
                            }}
                            renderLabel={renderLabel}
                            indicatorStyle={styles.indicator}
                        />
                    );
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    header: {
        height: 100,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        backgroundColor: "#FFF",
    },
    label: {
        fontSize: 14,
        color: "#464646",
        fontFamily: "Lato-Bold",
    },
    labelActive: {
        fontSize: 14,
        color: "#209FAE",
        fontFamily: "Lato-Bold",
    },
    tab: {
        elevation: 1,
        shadowOpacity: 0.5,
        backgroundColor: "#FFF",
        height: 50,
    },
    indicator: { backgroundColor: "#209FAE", height: 3 },
});
