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
  StyleSheet,
  FlatList,
} from "react-native";
import {
  Button,
  Text,
  Truncate,
  CustomImage,
  Loading,
  FunImage,
} from "../../../component";
import { default_image, search_button } from "../../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Arrowbackwhite, Itinerary_1, SendMessage } from "../../../assets/svg";
import TravelWith from "../../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../../config";
import io from "socket.io-client";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";

export default function SendDestination({ navigation, route }) {
  const socket = io(CHATSERVER);
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(null);
  let [search, setSearch] = useState("");
  // console.log(route.params);
  const [user, setUser] = useState({});
  let [loading, setloading] = useState(false);
  const [data_buddy, SetDatBuddy] = useState([]);
  console.log(data_buddy);
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
    onCompleted: () => {
      SetDatBuddy(DataBuddy.search_travelwith);
    },
  });
  const ChatOptions = {
    headerShown: true,
    headerTitle: "Send Destination",
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
        onPress={() => navigation.goBack()}
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
    getUserAndToken();
    getRoomGroup();
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

  const _searchHandle = (text) => {
    // }
  };

  const [dataGroupRes, setDataGroupRes] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  // console.log(dataGroupRes);
  const getRoomGroup = async () => {
    console.log("EXEC");
    setloading(true);
    let token = await AsyncStorage.getItem("access_token");
    let response = await fetch(`${CHATSERVER}/api/group/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    await setDataGroupRes(dataResponse);
    await setDataGroup(dataResponse);
    setloading(false);
  };

  const _setSearch = async (text) => {
    setSearch(text);
    querywith();
    let newDataGroup;
    if (text) {
      newDataGroup = dataGroup.filter(function(str) {
        return str.title.toLowerCase().includes(text.toLowerCase());
      });
    } else {
      newDataGroup = dataGroup;
    }
    setDataGroupRes(newDataGroup);
  };

  const [index, setIndex] = React.useState(
    route.params?.page ? route.params.page : 0
  );
  const [routes] = React.useState([
    { key: "personal", title: "Personal" },
    { key: "group", title: "Trip Group" },
  ]);

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
      // console.log(responseJson);
      if (responseJson) {
        socket.emit("join", responseJson.id);
        socket.on("connection", (socket) => {
          console.log(socket);
          console.log("socket");
        });
        let dataDestination = route.params.destination;
        let constain = {
          id: dataDestination?.id,
          cover: dataDestination?.cover,
          name: dataDestination?.name,
          description: dataDestination?.description,
          rating: dataDestination?.rating,
          destination_type: dataDestination?.destination_type,
          cities: dataDestination?.cities,
          images: dataDestination?.images,
        };
        let chatData = {
          room: responseJson.id,
          chat: "personal",
          type: "tag_destination",
          text: JSON.stringify(constain),
          user_id: user.id,
        };
        await fetch(`${CHATSERVER}/api/personal/send`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `room=${
            responseJson.id
          }&type=tag_destination&chat=personal&text=${JSON.stringify(
            constain
          )}&user_id=${user.id}`,
        });
        await socket.emit("message", chatData);

        let change =
          responseJson.sender.id == user.id
            ? responseJson.receiver
            : responseJson.sender;
        await socket.disconnect();
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
  const _sendMessageGroup = async (value) => {
    try {
      // socket.emit("join", value.group_id);
      // socket.on("connection", (socket) => {
      //   console.log(socket);
      //   console.log("socket");
      // });
      let from = value.itinerary ? "itinerary" : "group";
      let dataDestination = route.params.destination;
      let constain = {
        id: dataDestination?.id,
        cover: dataDestination?.cover,
        name: dataDestination?.name,
        description: destindataDestination?.description,
        rating: dataDestination?.rating,
        destination_type: dataDestination?.destination_type,
        cities: dataDestination?.cities,
        images: dedataDestination?.images,
      };
      let chatData = {
        room: value.group_id,
        chat: "group",
        type: "tag_destination",
        text: JSON.stringify(constain),
        user_id: user.id,
      };
      // await fetch(`${CHATSERVER}/api/group/send`, {
      //   method: "POST",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //     "Content-Type": "application/x-www-form-urlencoded",
      //   },
      //   body: `user_id=${user.id}&type=text&chat=group&room=${
      //     value.group_id
      //   }&from=${from}&text=${JSON.stringify(constain)}&name=${
      //     user.first_name
      //   } ${user.last_name}`,
      // });
      // await socket.emit("message", chatData);

      // await socket.disconnect();
      // navigation.navigate("ChatStack", {
      //   screen: "GroupRoom",
      //   params: {
      //     room_id: value.group_id,
      //     name: value.title,
      //     picture: value.link_picture,
      //     from: value.itinerary ? "itinerary" : "group",
      //   },
      // });
      // navigation.push("ChatStack", {
      //   screen: "RoomChat",
      //   params: {
      //     room_id: responseJson.id,
      //     receiver: change.id,
      //     name:
      //       change.first_name +
      //       " " +
      //       (change.last_name ? change.last_name : ""),
      //     picture: change.picture,
      //   },
      // });
    } catch (error) {
      console.error(error);
    }
  };

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

  const renderScene = ({ route }) => {
    if (route.key == "personal") {
      return (
        <FlatList
          data={data_buddy}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            {
              // flex: 1,
              // backgroundColor: "#FFFFFF",
            }
          }
          renderItem={({ item }) => RenderBuddy(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            backgroundColor: "#FFFFFF",
          }}
          ListFooterComponent={
            loadingwith ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator animating={true} color="#209FAE" />
              </View>
            ) : data_buddy.length < 1 ? (
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
            ) : null
          }
        />
      );
    } else if (route.key == "group") {
      return (
        <FlatList
          data={dataGroupRes}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={
            {
              // flex: 1,
              // backgroundColor: "#FFFFFF",
            }
          }
          renderItem={({ item }) => RenderGroup(item)}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            backgroundColor: "#FFFFFF",
          }}
          ListFooterComponent={
            loading ? (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator animating={true} color="#209FAE" />
              </View>
            ) : dataGroupRes.length < 1 ? (
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
            ) : null
          }
        />
      );
    }
  };

  const RenderBuddy = (value) => {
    // console.log(value);
    return (
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#D1D1D1" }}>
        <TouchableOpacity
          onPress={() => {
            navigation.push("ProfileStack", {
              screen: "otherprofile",
              params: {
                idUser: value.id,
              },
            });
          }}
          style={{
            flexDirection: "row",
            width: Dimensions.get("screen").width - 30,
            paddingHorizontal: 10,
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
              width: "70%",
            }}
          >
            <FunImage
              source={
                value && value.picture ? { uri: value.picture } : default_image
              }
              style={{
                resizeMode: "cover",
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
            />

            <View
              style={{
                width: "80%",
              }}
            >
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
                numberOfLines={1}
                style={{
                  marginLeft: 20,
                }}
              >
                {value.username ? "@" + value.username : null}
              </Text>
            </View>
          </View>
          <Button
            onPress={() => _sendMessage(value.id)}
            text={t("Send")}
            size="small"
            color="primary"
            type="icon"
          >
            {/* <SendMessage width={22} height={22} /> */}
          </Button>
        </TouchableOpacity>
      </View>
    );
  };
  const RenderGroup = (value) => {
    // console.log(value);
    return (
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#D1D1D1" }}>
        <TouchableOpacity
          onPress={() => _sendMessage(value.id)}
          style={{
            flexDirection: "row",
            width: Dimensions.get("screen").width - 30,
            paddingHorizontal: 10,
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
              width: "70%",
            }}
          >
            <FunImage
              source={
                value && value.picture ? { uri: value.picture } : default_image
              }
              style={{
                resizeMode: "cover",
                height: 50,
                width: 50,
                borderRadius: 25,
              }}
            />

            <View
              style={{
                width: "80%",
              }}
            >
              <Text
                size="label"
                type="bold"
                numberOfLines={1}
                style={{
                  marginLeft: 20,
                }}
              >
                {value.title}
              </Text>
            </View>
          </View>
          <Button
            onPress={() => _sendMessageGroup(value)}
            text={t("Send")}
            size="small"
            color="primary"
            type="icon"
          >
            {/* <SendMessage width={22} height={22} /> */}
          </Button>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        padding: 15,
      }}
    >
      {/* <Loading show={loading} /> */}
      <View
        style={{
          flex: 1,
          backgroundColor: "white",
          borderRadius: 15,
          paddingBottom: 10,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            paddingTop: 10,
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
              width: Dimensions.get("screen").width - 30,
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
                    height: 15,
                    width: 15,
                    alignSelf: "center",
                    zIndex: 100,
                    marginHorizontal: 5,
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
                indicatorStyle={{ backgroundColor: "#209FAE", height: 3 }}
              />
            );
          }}
        />
      </View>
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
