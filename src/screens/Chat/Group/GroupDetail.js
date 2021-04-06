import React, { useState, useEffect } from "react";
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
} from "react-native";
import {
    Button,
    Text,
    Truncate,
    CustomImage,
    Loading,
} from "../../../component";
import { useTranslation } from "react-i18next";
import { Arrowbackwhite, Send, Smile } from "../../../assets/svg";

export default function GroupDetail(props) {
    const { t, i18n } = useTranslation();
    const [room, setRoom] = useState(props.route.params.room_id);
    const [from, setfrom] = useState(props.route.params.from);
    console.log(props.route.params.room_id);
    console.log(props.route.params.from);
    const headerOptions = {
        headerShown: true,
        headerTransparent: true,
        headerTitle: "New Group",
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
    useEffect(() => {
        props.navigation.setOptions(headerOptions);
    }, []);
    return (
        <View>
            <Text>Test</Text>
        </View>
    );
}
