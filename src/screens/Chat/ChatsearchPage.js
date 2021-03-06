import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  Dimensions,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  BackHandler,
  Keyboard,
  Modal,
  Pressable,
  FlatList,
  Animated,
  StatusBar,
  SafeAreaView,
} from "react-native";
import {
  NewGroup,
  Magnifying,
  NewChat,
  Kosong,
  SearchWhite,
  Arrowbackwhite,
  Xgray,
  Arrowbackios,
  Xblue,
} from "../../assets/svg";
import { DefaultProfile, default_image } from "../../assets/png";
import {
  Text,
  Button,
  Truncate,
  StatusBar as StaBar,
  Errors,
} from "../../component";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ripple from "react-native-material-ripple";
import { useTranslation } from "react-i18next";
import { CHATSERVER } from "../../config";
import { TabBar, SceneMap, TabView } from "react-native-tab-view";
import ChatGroupList from "./RenderChatGroupList";
import ChatList from "./RenderChatList";
import { useSelector } from "react-redux";
//TRY SOCKET
import io from "socket.io-client";
//TRY SOCKET
// import DeviceInfo from "react-native-device-info";
// const Notch = DeviceInfo.hasNotch();
// const SafeStatusBar = Platform.select({
//   ios: Notch ? 48 : 20,
//   android: StatusBar.currentHeight,
// });

const TabBarHeight = Platform.OS == "ios" ? 44 : 40;

export default function ChatsearchPage({ navigation, route }) {
  const _tabIndex = useRef(0);
  const tokenApps = useSelector((data) => data.token);
  const settingApps = useSelector((data) => data.setting);
  const { width, height } = Dimensions.get("screen");
  const { t } = useTranslation();
  const [user, setUser] = useState(settingApps.user);
  const [data, setData] = useState([]);
  const [dataRes, setDataRes] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [dataGroupRes, setDataGroupRes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchAktif, setSearchAktif] = useState(false);
  const [searchtext, SetSearchtext] = useState("");
  const [modalLogin, setModalLogin] = useState(false);
  //TRY SOCKET
  // const socket = io(CHATSERVER);
  // TRY SOCKET

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarBadge: null,
    tabBarLabel: "Message",
    // headerTintColor: "white",
    headerTitle: (
      <Text size="header" style={{ color: "#fff" }}>
        {t("search")}
      </Text>
    ),
    headerMode: "screen",
    headerStyle: {
      backgroundColor: Platform.OS == "ios" ? "#14646e" : "#209FAE",
      elevation: 0,
      borderBottomWidth: 0,
    },
    headerTitleStyle: {
      backgroundColor: Platform.OS == "ios" ? "#209fae" : null,
      width: Platform.OS == "ios" ? Dimensions.get("screen").width : null,
      height: Platform.OS == "ios" ? 45 : null,
      textAlign: Platform.OS == "ios" ? "center" : null,
      paddingTop: Platform.OS == "ios" ? 8 : null,
      paddingBottom: Platform.OS == "ios" ? 15 : null,
    },
    headerLeftContainerStyle: {
      background: "#FFF",
      position: "absolute",
      zIndex: 999,
      marginLeft: 10,
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
        }}
      >
        {Platform.OS == "ios" ? (
          <Arrowbackios height={15} width={15}></Arrowbackios>
        ) : (
          <Arrowbackwhite height={20} width={20}></Arrowbackwhite>
        )}
      </Button>
    ),
  };

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    navigation.addListener("focus", () => {
      getUserAndToken();
    });
    // socket.on("new_chat_group", (data) => {
    //   getRoomGroup();
    // });
    // socket.on("new_chat_personal", (data) => {
    //   getRoom();
    // });
    // return () => socket.disconnect();
  }, []);

  const getRoom = async () => {
    let response = await fetch(`${CHATSERVER}/api/personal/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: tokenApps,
        "Content-Type": "application/json",
      },
    });

    let dataResponse = await response.json();
    // for (let i of dataResponse) {
    //   socket.emit("join", i.id);
    // }
    await setData(dataResponse);
    // await setDataRes(dataResponse);
    await setLoading(false);
  };

  const getRoomGroup = async () => {
    let response = await fetch(`${CHATSERVER}/api/group/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: tokenApps,
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    // for (let i of dataResponse) {
    //   socket.emit("join", i.group);
    // }
    await setDataGroup(dataResponse);
    // await setDataGroupRes(dataResponse);
  };

  const getUserAndToken = async () => {
    if (tokenApps) {
      await getRoom();
      await getRoomGroup();
    }

    if (tokenApps === null) {
      setModalLogin(true);
      // navigation.navigate("HomeScreen");
    }
  };

  const LongPressFunc = (item, room_id) => {
    Alert.alert(
      "Confirm",
      t("AlertDelMessage") +
        `${item.first_name} ${item.last_name ? item.last_name : ""}`,
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
          Authorization: tokenApps,
          "Content-Type": "application/json",
        },
      }
    );
    await AsyncStorage.removeItem("history_" + room_id);
    getRoom(tokenApps);
  };

  const _searchHandle = (text) => {
    console.log("data", data);
    // if (active == "personal") {
    SetSearchtext(text);
    if (text !== "") {
      let newData = data.filter(function(str) {
        let strData = str.sender.id === user.id ? str.receiver : str.sender;
        return strData.first_name.toLowerCase().includes(text.toLowerCase());
      });
      setDataRes(newData);
      // }

      // if (active == "group") {
      let newDataGroup = dataGroup.filter(function(str) {
        return str.title.toLowerCase().includes(text.toLowerCase());
      });
      setDataGroupRes(newDataGroup);
    } else {
      setDataRes(data);
      setDataGroupRes(dataGroup);
    }
    // }
  };

  const HeaderHeight = width + 5;

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          {
            opacity: focused ? 1 : 1,
            height: "100%",
            marginTop: -4,
          },
        ]}
      >
        {route.title}
      </Text>
    );
  };
  let scrollRef = useRef();

  const [tabIndex, setIndex] = React.useState(
    route.params?.page ? route.params.page : 0
  );
  const [routes] = React.useState([
    { key: "personal", title: "Personal" },
    { key: "group", title: t("group") },
  ]);

  const renderScene = ({ route }) => {
    if (route.key == "personal") {
      return (
        <ChatList
          dataRes={searchtext.length ? dataRes : data}
          user={user}
          navigation={navigation}
          LongPressFunc={(item, room_id) => {
            LongPressFunc(item, room_id);
          }}
          param={"search"}
        />
      );
    } else if (route.key == "group") {
      return (
        <ChatGroupList
          dataGroupRes={searchtext.length ? dataGroupRes : dataGroup}
          navigation={navigation}
          param="search"
        />
      );
    }
  };

  const renderTabBar = (props) => {
    // const y = scrollY.interpolate({
    //   inputRange: [0, HeaderHeight],
    //   outputRange: [HeaderHeight, 55],
    //   extrapolateRight: "clamp",
    // });
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,

          position: "absolute",
          // transform: [{ translateY: y }],
          width: "100%",
        }}
      >
        <FlatList
          key={"listtabbar"}
          ref={scrollRef}
          data={props.navigationState.routes}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            backgroundColor: "white",
          }}
          renderItem={({ item, index }) => (
            <Ripple
              key={"tabx" + index}
              onPress={() => {
                setIndex(index);
                scrollRef.current?.scrollToIndex({
                  index: index,
                  animated: true,
                });
              }}
            >
              <View
                style={{
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  alignContent: "center",

                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  alignSelf: "center",
                  paddingHorizontal: Platform.OS === "ios" ? 15 : null,
                }}
              >
                <Text
                  style={[
                    index == tabIndex ? styles.labelActive : styles.label,
                    {
                      opacity: index == tabIndex ? 1 : 1,
                      borderBottomWidth: 0,
                      // borderWidth: 1,
                      marginBottom: index == tabIndex ? 0 : 1,
                      borderBottomColor:
                        index == tabIndex &&
                        props.navigationState.routes.length > 1
                          ? "#FFFFFF"
                          : "#209fae",
                      textTransform: "capitalize",
                    },
                  ]}
                >
                  <Truncate
                    text={item?.title ?? ""}
                    length={Platform.OS === "ios" ? 13 : 15}
                  />
                </Text>
              </View>
            </Ripple>
          )}
        />
      </Animated.View>
    );
  };

  const srcinpt = useRef();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFF" }}>
      {/* <StaBar backgroundColor="#14646e" barStyle="light-content" /> */}
      {/* <View style={{ flex: 1, borderRadius: 15 }}> */}
      <Modal
        useNativeDriver={true}
        visible={modalLogin}
        onRequestClose={() => true}
        transparent={true}
        animationType="fade"
      >
        <Pressable
          // onPress={() => setModalLogin(false)}
          style={{
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height,
            justifyContent: "center",
            opacity: 0.7,
            backgroundColor: "#000",
            position: "absolute",
          }}
        ></Pressable>
        <View
          style={{
            width: Dimensions.get("screen").width - 120,
            marginHorizontal: 60,
            backgroundColor: "#FFF",
            zIndex: 15,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            marginTop: Dimensions.get("screen").height / 4,
            borderRadius: 5,
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: Dimensions.get("screen").width - 120,
              borderRadius: 5,
            }}
          >
            <View
              style={{
                backgroundColor: "#f6f6f6",
                borderRadius: 5,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  marginTop: 12,
                  marginBottom: 15,
                }}
                size="title"
                type="bold"
              >
                {t("LoginFirst")}
              </Text>
              <Pressable
                onPress={() => {
                  navigation.navigate("HomeScreen");
                  setModalLogin(false);
                }}
                style={{
                  height: 50,
                  width: 55,
                  position: "absolute",
                  right: 0,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Xgray width={15} height={15} />
              </Pressable>
            </View>
            <View
              style={{
                alignItems: "center",
                marginHorizontal: 30,
                marginBottom: 15,
                marginTop: 12,
              }}
            >
              <Text style={{ marginBottom: 5 }} size="title" type="bold">
                {t("nextLogin")}
              </Text>
              <Text
                style={{ textAlign: "center", lineHeight: 18 }}
                size="label"
                type="regular"
              >
                {t("textLogin")}
              </Text>
            </View>
            <View style={{ marginHorizontal: 30, marginBottom: 30 }}>
              <Button
                style={{ marginBottom: 5 }}
                onPress={() => {
                  setModalLogin(false);
                  navigation.push("AuthStack", {
                    screen: "LoginScreen",
                  });
                }}
                type="icon"
                text={t("signin")}
              ></Button>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center",
                  marginVertical: 5,
                }}
              >
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
                <Text style={{ alignSelf: "flex-end", marginVertical: 10 }}>
                  {t("or")}
                </Text>
                <View
                  style={{
                    width: 50,
                    borderBottomWidth: 1,
                    borderBottomColor: "#d1d1d1",
                    marginHorizontal: 10,
                  }}
                ></View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  size="label"
                  type="bold"
                  style={{ color: "#209FAE" }}
                  onPress={() => {
                    setModalLogin(false);
                    navigation.push("AuthStack", {
                      screen: "RegisterScreen",
                    });
                  }}
                >
                  {t("createAkunLogin")}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          backgroundColor: "#FFFFFF",
          alignContent: "center",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 15,

          height: 50,
          zIndex: 5,
          flexDirection: "row",
          width: Dimensions.get("screen").width,
        }}
      >
        <View
          style={{
            backgroundColor: "#f6f6f6",
            borderRadius: 2,
            flex: 1,
            paddingHorizontal: 10,

            flexDirection: "row",
            alignItems: "center",
            alignContent: "center",
            height: 35,
            borderWidth: 1,

            borderColor: "#e8e8e8",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Magnifying width="15" height="15" />
            <TextInput
              ref={srcinpt}
              onChangeText={(e) => _searchHandle(e)}
              value={searchtext}
              placeholder={t("search")}
              placeholderTextColor="#464646"
              style={{
                width: "85%",
                marginLeft: 5,
                fontSize: 14,
                padding: 0,
              }}
            />
          </View>
          {searchtext.length !== 0 ? (
            <TouchableOpacity
              onPress={() => {
                _searchHandle("");
              }}
            >
              <Xblue
                width="20"
                height="20"
                style={{
                  alignSelf: "center",
                  marginLeft: 5,
                }}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
      <TabView
        // onSwipeStart={() => setCanScroll(false)}
        // onSwipeEnd={() => setCanScroll(true)}
        onIndexChange={(id) => {
          _tabIndex.current = id;
          setIndex(id);
          scrollRef.current?.scrollToIndex({
            // y: 0,
            // x: 100,
            index: id,
            animated: true,
          });
        }}
        navigationState={{ index: tabIndex, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        initialLayout={{
          height: 0,
          // borderWidth: 1,
          width: width,
        }}
      />

      {/* <TabView
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
                height: 42,
                // borderWidth: 1,
                marginTop: -4,
                justifyContent: "center",
              }}
              renderLabel={renderLabel}
              indicatorStyle={styles.indicator}
            />
          );
        }}
      /> */}

      {/* </View> */}
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
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#464646",
    fontFamily: "Lato-Bold",
  },
  labelActive: {
    fontSize: Platform.OS == "ios" ? 18 : 16,
    color: "#209FAE",
    fontFamily: "Lato-Bold",
  },
  tab: {
    elevation: 1,
    shadowOpacity: 0.5,
    backgroundColor: "#FFF",
    height: 45,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});
