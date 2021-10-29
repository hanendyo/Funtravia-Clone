import React, { useState, useEffect } from "react";
import {
  View,
  Dimensions,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from "react-native";
import { Button, Text, FunImage } from "../../component";
import { default_image, search_button } from "../../assets/png";
import { useLazyQuery } from "@apollo/react-hooks";
import { Arrowbackwhite } from "../../assets/svg";
import TravelWith from "../../graphQL/Query/Itinerary/TravelWith";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CHATSERVER } from "../../config";
import { TabBar, TabView } from "react-native-tab-view";
import { StackActions } from "@react-navigation/native";
import { RNToasty } from "react-native-toasty";
import io from "socket.io-client";
import normalize from "react-native-normalize";

export default function SendTravelGoals({ navigation, route }) {
  const socket = io(CHATSERVER, {
    withCredentials: true,
    extraHeaders: {
      Authorization: token,
    },
  });
  const { t, i18n } = useTranslation();
  const [token, setToken] = useState(null);
  let [search, setSearch] = useState("");
  const [user, setUser] = useState({});
  let [loading, setloading] = useState(false);
  const [data_buddy, SetDatBuddy] = useState([]);
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
    headerTitle: (
      <Text size="header" type="bold" style={{ color: "#fff" }}>{`${t(
        "Send"
      )} ${t("travelgoals")}`}</Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      fontFamily: "Lato-Bold",
      fontSize: 18,
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

  const setChatHistory = async (data) => {
    let history = await AsyncStorage.getItem("history_" + data.room);
    if (history) {
      let recent = JSON.parse(history);
      if (data) {
        let idx = recent.findIndex((x) => x.id === data.id);
        if (idx < 0) {
          recent.push(data);
        } else {
          recent[idx] = data;
        }
        await AsyncStorage.setItem(
          "history_" + data.room,
          JSON.stringify(recent)
        );
        // setMessage(recent);
      } else {
        // setMessage(recent);
      }
    } else {
      await AsyncStorage.setItem(
        "history_" + data.room,
        JSON.stringify([data])
      );
      // setMessage([data]);
    }
  };

  const getUserAndToken = async () => {
    let token = await AsyncStorage.getItem("access_token");
    if (token) {
      await setToken(token);
      await _setSearch(null);
      await querywith();
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
  const getRoomGroup = async () => {
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

  let [loadingsend, setloadingsend] = useState(false);
  let [indexUser, setIndexUser] = useState();
  let [indexGroup, setIndexGroup] = useState();

  function create_UUID() {
    var dt = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(
      c
    ) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }

  const _sendMessage = async (id, index) => {
    setloadingsend(true);
    setIndexUser(index);
    try {
      let response = await fetch(
        `${CHATSERVER}/api/personal/chat?receiver_id=${id}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      let responseJson = await response.json();
      if (responseJson) {
        socket.emit("join", responseJson.id);
        socket.on("connection", (socket) => {});
        let dataTravelGoal = route.params.params.dataGoal;
        let constain = {
          id: dataTravelGoal?.id,
          cover: dataTravelGoal?.cover,
          name: dataTravelGoal?.title,
          description: dataTravelGoal?.firsttxt,
        };
        let uuid = create_UUID();
        let chatData = {
          id: uuid,
          room: responseJson.id,
          chat: "personal",
          type: "tag_travel_goal",
          text: JSON.stringify(constain),
          user_id: user.id,
        };
        // await fetch(`${CHATSERVER}/api/personal/send`, {
        //   method: "POST",
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //     "Content-Type": "application/x-www-form-urlencoded",
        //   },
        //   body: `room=${
        //     responseJson.id
        //   }&type=tag_destination&chat=personal&text=${JSON.stringify(
        //     constain
        //   )}&user_id=${user.id}`,
        // });
        await socket.emit("message", chatData);
        socket.on("new_chat_personal", (data) => {
          setChatHistory(data);
        });
        let change =
          responseJson.sender.id == user.id
            ? responseJson.receiver
            : responseJson.sender;
        setTimeout(() => {
          socket.disconnect();
          RNToasty.Show({
            duration: 1,
            title: t("successfullySent"),
            position: "bottom",
          });
          navigation.dispatch(
            StackActions.replace("ChatStack", {
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
            })
          );
          setloadingsend(false);
        }, 2000);
      }
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: t("failSomethingwrong"),
        position: "bottom",
      });
      setloadingsend(false);
      console.error(error);
    }
  };
  const _sendMessageGroup = async (value, index) => {
    try {
      setloadingsend(true);
      setIndexGroup(index);
      await socket.emit("join", value.group_id);
      await socket.on("connection", (socket) => {});
      let from = value.itinerary ? "itinerary" : "group";
      let dataTravelGoal = route.params.params.dataGoal;
      let constain = {
        id: dataTravelGoal?.id,
        cover: dataTravelGoal?.cover,
        name: dataTravelGoal?.title,
        description: dataTravelGoal?.firsttxt,
      };
      let chatData = {
        room: value.group_id,
        chat: "group",
        type: "tag_travel_goal",
        text: JSON.stringify(constain),
        user_id: user.id,
      };
      await fetch(`${CHATSERVER}/api/group/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `user_id=${user.id}&type=tag_travel_goal&chat=group&room=${
          value.group_id
        }&from=${from}&text=${JSON.stringify(constain)}&name=${
          user.first_name
        } ${user.last_name}`,
      });
      await socket.emit("message", chatData);
      // console.log("kal", value);
      RNToasty.Show({
        duration: 1,
        title: t("successfullySent"),
        position: "bottom",
      });
      navigation.dispatch(
        StackActions.replace("ChatStack", {
          screen: "GroupRoom",
          params: {
            room_id: value.group_id,
            name: value.title,
            picture: value.link_picture,
            from: value.itinerary ? "itinerary" : "group",
          },
        })
      );

      setloadingsend(false);
    } catch (error) {
      RNToasty.Show({
        duration: 1,
        title: t("failSomethingwrong"),
        position: "bottom",
      });
      setloadingsend(false);
      console.error(error);
    }
  };

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 0.7, marginBottom: 7 },
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
          renderItem={({ item, index }) => RenderBuddy(item, index)}
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
          renderItem={({ item, index }) => RenderGroup(item, index)}
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

  const RenderBuddy = (value, index) => {
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
              size="xs"
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
                size="description"
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
            onPress={() => {
              !loadingsend
                ? _sendMessage(value.id, index)
                : console.log("loading");
            }}
            text={loadingsend && index == indexUser ? "" : t("Send")}
            size="small"
            color="primary"
            type="icon"
            style={{
              width: 85,
            }}
          >
            {loadingsend && index == indexUser ? (
              <ActivityIndicator animating={true} color="#FFFFFF" />
            ) : null}
            {/* <SendMessage width={22} height={22} /> */}
          </Button>
        </TouchableOpacity>
      </View>
    );
  };
  const RenderGroup = (value, index) => {
    // console.log(value);
    return (
      <View style={{ borderBottomWidth: 0.5, borderBottomColor: "#D1D1D1" }}>
        <TouchableOpacity
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
              size="xs"
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
            onPress={() => {
              !loadingsend
                ? _sendMessageGroup(value, index)
                : console.log("loading");
            }}
            text={loadingsend && index == indexGroup ? "" : t("Send")}
            size="small"
            color="primary"
            type="icon"
            style={{
              width: 85,
            }}
          >
            {loadingsend && index == indexGroup ? (
              <ActivityIndicator animating={true} color="#FFFFFF" />
            ) : null}
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
                indicatorStyle={{ backgroundColor: "#209FAE", height: 2 }}
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
    fontSize: normalize(16),
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: normalize(16),
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
