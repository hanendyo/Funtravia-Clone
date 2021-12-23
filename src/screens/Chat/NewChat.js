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
  Pressable,
} from "react-native";
import {
  Button,
  Text,
  Truncate,
  CustomImage,
  Loading,
  FunImage,
} from "../../component";
import { default_image, search_button } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import {
  Arrowbackios,
  Arrowbackwhite,
  Magnifying,
  SendMessage,
} from "../../assets/svg";
import TravelWith from "../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";
import { useSelector } from "react-redux";

export default function NewChat({ navigation }) {
  const tokenApps = useSelector((data) => data.token);
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(null);
  let [search, setSearch] = useState("");
  console.log(search);
  const [user, setUser] = useState({});
  let [loading, setloading] = useState(false);
  const [
    querywith,
    { loading: loadingwith, data: DataBuddy, error: errorwith },
  ] = useLazyQuery(TravelWith, {
    fetchPolicy: "network-only",
    variables: {
      keyword: search,
    },
    context: {
      headers: {
        "Content-Type": "application/json",
        Authorization: tokenApps,
      },
    },
  });
  console.log(DataBuddy);
  const ChatOptions = {
    headerShown: true,
    headerTitle: "",
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    // headerTitleStyle: {
    //   fontFamily: "Lato-Bold",
    //   fontSize: 14,
    //   color: "white",
    //   marginLeft: -10,
    // },
    headerLeft: () => (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Button
          text={""}
          size="medium"
          type="circle"
          variant="transparent"
          onPress={() => navigation.goBack()}
          style={{
            height: 55,
            marginLeft: 10,
          }}
        >
          {Platform.OS == "ios" ? (
            <Arrowbackios height={15} width={15}></Arrowbackios>
          ) : (
            <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
          )}
        </Button>
        <Text type="bold" size="title" style={{ color: "#FFF", marginLeft: 5 }}>
          {t("newMessage")}
        </Text>
      </View>
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
    getUserAndToken();
    navigation.setOptions(ChatOptions);
  }, []);

  const getUserAndToken = async () => {
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
      await setToken(token);
      await _setSearch(null);
      await querywith();
      console.log(token);
    }

    let data = await AsyncStorage.getItem("setting");
    if (data) {
      await setUser(JSON.parse(data).user);
    }
  };

  const _setSearch = async (text) => {
    setSearch(text);
    querywith();
  };

  const _sendMessage = async (id) => {
    try {
      let response = await fetch(
        `${CHATSERVER}/api/personal/chat?receiver_id=${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: tokenApps,
            "Content-Type": "application/json",
          },
        }
      );

      let responseJson = await response.json();
      if (responseJson) {
        let change =
          responseJson.sender.id == user.id
            ? responseJson.receiver
            : responseJson.sender;
        navigation.push("ChatStack", {
          screen: "RoomChat",
          params: {
            room_id: responseJson.id,
            receiver: change.id,
            name:
              change.first_name +
              " " +
              (change.last_name ? change.last_name : ""),
            picture: change.picture,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const RenderBuddy = ({ databuddy }) => {
    return (
      <View style={{ flex: 1 }}>
        {databuddy.map((value, i) => {
          return (
            <TouchableOpacity
              onPress={() => _sendMessage(value.id)}
              style={{
                flexDirection: "row",
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
                borderBottomWidth: 1,
                borderBottomColor: "#f6f6f6",
                flex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
                  flex: 1,
                }}
              >
                <FunImage
                  size="xs"
                  source={
                    value && value.picture
                      ? { uri: value.picture }
                      : default_image
                  }
                  style={{
                    resizeMode: "cover",
                    height: 50,
                    width: 50,
                    borderRadius: 25,
                  }}
                />

                <View style={{ flex: 1 }}>
                  <Text
                    size="label"
                    type="bold"
                    numberOfLines={2}
                    style={{
                      marginLeft: 20,
                    }}
                  >
                    {value.first_name} {value.last_name}
                  </Text>

                  <Text
                    size="small"
                    type="regular"
                    style={{
                      marginLeft: 20,
                    }}
                  >
                    {`@${value.username}`}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => _sendMessage(value.id)}
                style={{
                  width: 50,
                  height: 50,
                  alignItems: "flex-end",
                  justifyContent: "center",
                }}
              >
                <SendMessage width={22} height={22} />
              </Pressable>
              {/* <Button
                onPress={() => _sendMessage(value.id)}
                text=""
                size="medium"
                color="primary"
                variant="transparent"
                type="icon"
                style={{ borderWidth: 1 }}
              >
                <SendMessage width={22} height={22} />
              </Button> */}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 10,
        margin: 15,
      }}
    >
      <Loading show={loading} />
      <View
        style={{
          flex: 1,
          borderRadius: 15,
          backgroundColor: "#FFFFFF",
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            paddingVertical: 10,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
          }}
        >
          <View
            style={{
              alignContent: "center",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 20,
              height: 50,
              zIndex: 5,
              flexDirection: "row",
              flex: 1,
            }}
          >
            <View
              style={{
                backgroundColor: "#f1f1f1",
                borderRadius: 5,
                width: "100%",
                height: 40,
                flexDirection: "row",
                alignItems: "center",
                marginHorizontal: 20,
                paddingHorizontal: 10,
                flex: 1,
                marginTop: 10,
              }}
            >
              <Magnifying width="15" height="15" />
              <TextInput
                underlineColorAndroid="transparent"
                placeholder={t("search")}
                placeholderTextColor="#464646"
                style={{
                  // width: "100%",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
                  marginLeft: 10,
                  flex: 1,
                }}
                value={search}
                onChangeText={(text) => _setSearch(text)}
              />
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loadingwith ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator animating={true} color="#209FAE" />
            </View>
          ) : DataBuddy && DataBuddy.search_travelwith.length > 0 ? (
            <RenderBuddy databuddy={DataBuddy?.search_travelwith} />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text size="label" type="bold">
                {t("noData")}
              </Text>
            </View>
          )}
          {/* {DataBuddy && DataBuddy.search_travelwith ? (
            <RenderBuddy databuddy={DataBuddy.search_travelwith} />
          ) : null} */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
