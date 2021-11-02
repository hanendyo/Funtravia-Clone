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
import { Arrowbackwhite, SendMessage } from "../../assets/svg";
import TravelWith from "../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";

export default function NewChat({ navigation }) {
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
        Authorization: `Bearer ${token}`,
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
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 14,
      color: "white",
      marginLeft: -10,
    },
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
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
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
            Authorization: "Bearer " + token,
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
      <View style={{ width: Dimensions.get("screen").width }}>
        {databuddy.map((value, i) => {
          return (
            <TouchableOpacity
              onPress={() => _sendMessage(value.id)}
              style={{
                flexDirection: "row",
                width: Dimensions.get("screen").width,
                paddingHorizontal: 20,
                paddingVertical: 10,
                justifyContent: "space-between",
                alignItems: "center",
                alignContent: "center",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  alignContent: "center",
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

                <View>
                  <Text
                    size="label"
                    type="bold"
                    numberOfLines={1}
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
                    {value.username}
                  </Text>
                </View>
              </View>
              <Button
                onPress={() => _sendMessage(value.id)}
                text=""
                size="medium"
                color="primary"
                variant="transparent"
                type="icon"
              >
                <SendMessage width={22} height={22} />
              </Button>
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
              padding: 20,
              height: 50,
              zIndex: 5,
              flexDirection: "row",
              width: Dimensions.get("screen").width - 20,
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
              }}
            >
              <View>
                <Image
                  source={search_button}
                  style={{
                    resizeMode: "cover",
                    height: 17,
                    width: 17,
                    alignSelf: "center",
                    zIndex: 100,
                    marginHorizontal: 10,
                  }}
                />
              </View>

              <TextInput
                underlineColorAndroid="transparent"
                placeholder={t("search")}
                style={{
                  width: "100%",
                  fontFamily: "Lato-Regular",
                  fontSize: 14,
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
            <RenderBuddy databuddy={DataBuddy.search_travelwith} />
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            >
              <Text size="label" type="bold">
                Tidak ada data
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
