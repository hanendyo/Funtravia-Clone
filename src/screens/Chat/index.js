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
  Animated,
  FlatList,
  StatusBar,
} from "react-native";
import {
  NewGroup,
  Magnifying,
  NewChat,
  Kosong,
  SearchWhite,
  Arrowbackwhite,
  Xgray,
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
import { TabView } from "react-native-tab-view";
import ChatGroupList from "./RenderChatGroupList";
import ChatList from "./RenderChatList";
import NetInfo from "@react-native-community/netinfo";
import { useNetInfo } from "@react-native-community/netinfo";

//TRY SOCKET
import io from "socket.io-client";
import Delete from "../../component/src/AlertModal/Delete";
const TabBarHeight = Platform.OS == "ios" ? 44 : 40;
import { useDispatch, useSelector } from "react-redux";
import { setCountMessage, setCountMessageGroup } from "../../redux/action";
// import DeviceInfo from "react-native-device-info";
// const Notch = DeviceInfo.hasNotch();
// const SafeStatusBar = Platform.select({
//   ios: Notch ? 48 : 20,
//   android: StatusBar.currentHeight,
// });

export default function Message({ navigation, route }) {
  const _tabIndex = useRef(0);
  const countPesan = useSelector((data) => data.countMessage);
  const countPesanGroup = useSelector((data) => data.countMessageGroup);
  const dispatch = useDispatch();
  const tokenApps = useSelector((data) => data.token);
  const settingApps = useSelector((data) => data.setting);
  const { width, height } = Dimensions.get("screen");
  const { t } = useTranslation();
  const [user, setUser] = useState(settingApps?.user);
  const [data, setData] = useState([]);
  const [dataRes, setDataRes] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [dataGroupRes, setDataGroupRes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchAktif, setSearchAktif] = useState(false);
  const [searchtext, SetSearchtext] = useState("");
  const [modalLogin, setModalLogin] = useState(false);
  //TRY SOCKET

  const socket = io(CHATSERVER);

  // TRY SOCKET

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarBadge: null,
    tabBarLabel: "Message",
    headerTintColor: "white",
    // headerTitle: (
    //   <Text style={{ color: "#fff" }} size="header" type="bold">
    //     {t("Message")}
    //   </Text>
    // ),
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
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={() =>
            navigation.navigate("ChatStack", {
              screen: "ChatsearchPage",
            })
          }
        >
          <SearchWhite height={20} width={20} />
        </TouchableOpacity>
      </View>
    ),
  };

  const [connected, SetConnection] = useState(false);
  const connection_check = useNetInfo();
  useEffect(() => {
    const cek_koneksi = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        SetConnection(true);
      } else {
        SetConnection(false);
      }
    });
    cek_koneksi();
  }, [connection_check]);

  useEffect(() => {
    getUserAndToken();
    navigation.setOptions(HeaderComponent);
    navigation.addListener("focus", () => {
      if (dataRes.length == 0 || dataRes.length == 0) {
        getUserAndToken();
      }
      getRoomGroup();
      getRoom();
    });
    navigation.setOptions(HeaderComponent);
    socket.on("new_chat_group", (data) => {
      getRoomGroup();
    });
    socket.on("new_chat_personal", (data) => {
      getRoom();
    });
    return () => socket.disconnect();
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

    if (response.status != 500) {
      let dataResponse = await response.json();
      let sum = await dataResponse.reduce(
        (a, { count_newmassage }) => a + count_newmassage,
        0
      );

      dispatch(setCountMessage(sum));
      for (let i of dataResponse) {
        socket.emit("join", i.id);
      }
      await setData(dataResponse);
      await setDataRes(dataResponse);
      await setLoading(false);
    } else {
      await setLoading(false);
    }
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

    if (response.status != 500) {
      let dataResponse = await response.json();

      for (let i of dataResponse) {
        socket.emit("join", i.group_id);
      }
      let dataCount = [];
      for (var i of dataResponse) {
        let data = { ...i };
        if (!data.count_newmassage) {
          data.count_newmassage = 0;
          dataCount.push(data);
        } else {
          dataCount.push(data);
        }
      }
      let sum = await dataCount.reduce(
        (a, { count_newmassage }) => a + count_newmassage,
        0
      );
      dispatch(setCountMessageGroup(sum));
      // await setDataGroup(dataResponse);
      // await setDataGroupRes(dataResponse);
      await setDataGroup(dataCount);
      await setDataGroupRes(dataCount);
    }
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

  const [messages, setMessages] = useState("");
  const [modalError, setModalError] = useState(false);
  const [modalDeleteChat, setModalDeleteChat] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roomID, setRoomID] = useState("");
  const [ID, setID] = useState("");

  const LongPressFunc = (item, room_id) => {
    setFirstName(item.first_name);
    setLastName(item.last_name);
    setRoomID(room_id);
    setID(item.id);
    setModalDeleteChat(true);
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
  };

  const HeaderHeight = width + 5;

  const renderLabel = ({ route, focused }) => {
    return (
      <Text
        style={[
          focused ? styles.labelActive : styles.label,
          { opacity: focused ? 1 : 1, height: "100%", marginBottom: 2 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const [tabIndex, setIndex] = React.useState(
    route.params?.page ? route.params.page : 0
  );
  const [routes] = React.useState([
    { key: "personal", title: "Chat", count: countPesan },
    { key: "group", title: "Group", count: countPesanGroup },
  ]);

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
          param="list"
        />
      );
    } else if (route.key == "group") {
      return (
        <ChatGroupList
          dataGroupRes={dataGroupRes}
          navigation={navigation}
          param="list"
        />
      );
    }
  };
  let scrollRef = useRef();

  const renderTabBar = (props) => {
    // const y = scrollY.interpolate({
    //   inputRange: [0, HeaderHeight],
    //   outputRange: [HeaderHeight, 55],
    //   extrapolateRight: "clamp",
    // });
    let state = [...props.navigationState.routes];
    for (var i of state) {
      if (i.key == "personal") {
        i.count = countPesan;
      } else {
        i.count = countPesanGroup;
      }
    }
    return (
      <Animated.View
        style={{
          top: 0,
          zIndex: 1,
          position: "absolute",
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
                // scrollRef.current?.scrollToIndex({
                //   index: index,
                //   animated: true,
                // });
              }}
            >
              <View
                style={{
                  borderBottomWidth: index == tabIndex ? 2 : 1,
                  borderBottomColor: index == tabIndex ? "#209fae" : "#d1d1d1",
                  width:
                    props.navigationState.routes.length <= 2
                      ? Dimensions.get("screen").width * 0.5
                      : props.navigationState.routes.length > 2
                      ? Dimensions.get("screen").width * 0.333
                      : null,
                  height: TabBarHeight,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: Platform.OS === "ios" ? 15 : null,
                  flexDirection: "row",
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
                    text={item?.key ? item.key : ""}
                    length={Platform.OS === "ios" ? 13 : 15}
                  />
                </Text>
                {item.count != null || item.count != 0 ? (
                  <View
                    style={{
                      backgroundColor: item.count == 0 ? "#fff" : "#d75995",
                      marginLeft: 5,
                      height: 20,
                      minWidth: 20,
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      paddingHorizontal: 5,
                    }}
                  >
                    <Text
                      type="bold"
                      size="small"
                      style={{
                        color: "#fff",
                        marginBottom: Platform.OS == "ios" ? 0 : 1,
                        marginLeft: Platform.OS == "ios" ? 1 : 0,
                      }}
                    >
                      {item.count ? item.count : 0}
                    </Text>
                  </View>
                ) : null}
              </View>
            </Ripple>
          )}
        />
      </Animated.View>
    );
  };

  const srcinpt = useRef();
  return (
    <View style={{ flex: 1 }}>
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
      <Errors
        modals={modalError}
        setModals={(e) => setModalError(e)}
        message={messages}
      />
      <Delete
        modals={modalDeleteChat}
        setModals={() => setModalDeleteChat()}
        messageHeader={t("deleteChat")}
        message={`${t("deleteChatWith")} ${firstName} ${
          lastName ? lastName : ""
        } ?`}
        onDelete={() => {
          DeleteChat(ID, roomID);
          setModalDeleteChat(false);
        }}
      />
      {searchAktif ? (
        <View
          style={{
            backgroundColor: "#FFFFFF",

            // borderTopLeftRadius: 15,
            // borderTopRightRadius: 15,
          }}
        >
          <View
            style={{
              marginHorizontal: 15,
              marginTop: 15,

              backgroundColor: "#f6f6f6",
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
              ref={srcinpt}
              onChangeText={(e) => _searchHandle(e)}
              value={searchtext}
              placeholder="Search"
              placeholderTextColor="#464646"
              style={{
                color: "#464646",
                fontFamily: "Lato-Regular",
                height: 40,
                width: "80%",
              }}
            />
            {searchtext.length !== 0 ? (
              <TouchableOpacity
                onPress={() => {
                  SetSearchtext("");
                }}
              >
                <Xblue
                  width="20"
                  height="20"
                  style={{
                    alignSelf: "center",
                  }}
                />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      ) : null}
      {loading ? (
        <View style={{ height: 50, justifyContent: "center" }}>
          <ActivityIndicator size="small" color="#209fae" />
        </View>
      ) : (
        <TabView
          // onSwipeStart={() => setCanScroll(false)}
          // onSwipeEnd={() => setCanScroll(true)}
          onIndexChange={(id) => {
            _tabIndex.current = id;
            setIndex(id);
            // scrollRef.current?.scrollToIndex({
            //   index: id,
            //   animated: true,
            // });
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
      )}
      {/* </View> */}
    </View>
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

    height: 40,
  },
  indicator: { backgroundColor: "#209FAE", height: 2 },
});
