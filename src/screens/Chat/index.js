import React, { useEffect, useState, useCallback } from "react";
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
  ActivityIndicator,
  BackHandler,
  Keyboard,
} from "react-native";
import {
  NewGroup,
  Magnifying,
  NewChat,
  Kosong,
  SearchWhite,
  Arrowbackwhite,
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

//TRY SOCKET
import io from "socket.io-client";
//TRY SOCKET
// import DeviceInfo from "react-native-device-info";
// const Notch = DeviceInfo.hasNotch();
// const SafeStatusBar = Platform.select({
//   ios: Notch ? 48 : 20,
//   android: StatusBar.currentHeight,
// });

export default function Message({ navigation, route }) {
  const { width, height } = Dimensions.get("screen");
  const { t } = useTranslation();
  const [user, setUser] = useState({});
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [dataRes, setDataRes] = useState([]);
  const [dataGroup, setDataGroup] = useState([]);
  const [dataGroupRes, setDataGroupRes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchAktif, setSearchAktif] = useState(false);
  const [searchtext, SetSearchtext] = useState("");
  //TRY SOCKET
  const socket = io(CHATSERVER);
  // TRY SOCKET

  const HeaderComponent = {
    headerShown: true,
    transparent: false,
    tabBarVisble: false,
    tabBarBadge: null,
    tabBarLabel: "Message",
    // headerTintColor: "white",
    headerTitle: t("Message"),
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
    },
    headerLeftContainerStyle: {
      background: "#FFF",
    },
    headerLeft: "",
    headerRight: () => (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{ marginRight: 20 }}
          onPress={
            () => _searchAktifFunction()
            // props.navigation.navigate("FeedStack", { screen: "SearchPageFeed" })
          }
        >
          <SearchWhite height={20} width={20} />
        </TouchableOpacity>
      </View>
    ),
  };

  // useEffect(() => {
  //   const backAction = () => {
  //     BackHandler.addEventListener(navigation.goBack());
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => {
    navigation.setOptions(HeaderComponent);
    navigation.addListener("focus", () => {
      getUserAndToken();
    });
    navigation.addListener("blur", () => {
      _searchNonaktifFunction();
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    });
    socket.on("new_chat_group", (data) => {
      getRoomGroup();
    });
    socket.on("new_chat_personal", (data) => {
      getRoom();
    });
    return () => socket.disconnect();
  }, []);

  const _searchAktifFunction = () => {
    setSearchAktif(true);
    myStateRef.current = true;
    navigation.setOptions({
      headerTitle: t("search"),
      headerLeftContainerStyle: {
        // background: "#FFF",
        paddingLeft: 20,
      },
      headerLeft: () => (
        <TouchableOpacity onPress={() => _searchNonaktifFunction()}>
          <Arrowbackwhite height={20} width={20} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              marginRight: 20,
            }}
            onPress={
              () => _searchNonaktifFunction()
              // props.navigation.navigate("FeedStack", { screen: "SearchPageFeed" })
            }
          >
            <SearchWhite height={20} width={20} />
          </TouchableOpacity>
        </View>
      ),
    });
  };
  const myStateRef = React.useRef(searchAktif);
  const onBackPress = useCallback(() => {
    console.log(myStateRef);
    if (myStateRef.current == true) {
      _searchNonaktifFunction();
      setSearchAktif(false);
      myStateRef.current = false;
      SetSearchtext("");
      Keyboard.dismiss();
    } else {
      navigation.goBack();
    }
    return true;
  }, []);

  useEffect(() => {
    navigation.addListener("focus", () => {
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
    });

    return () => {
      BackHandler.removeEventListener("hardwareBackPress", onBackPress);
    };
  }, [onBackPress]);

  const _searchNonaktifFunction = () => {
    setSearchAktif(false);
    let text = "";
    _searchHandle(text);
    myStateRef.current = false;
    navigation.setOptions(HeaderComponent);
  };

  const getRoom = async () => {
    let token = await AsyncStorage.getItem("access_token");
    let response = await fetch(`${CHATSERVER}/api/personal/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    for (let i of dataResponse) {
      socket.emit("join", i.id);
    }
    await setData(dataResponse);
    await setDataRes(dataResponse);
    await setLoading(false);
  };

  const getRoomGroup = async () => {
    console.log("EXEC");
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
    for (let i of dataResponse) {
      socket.emit("join", i.group);
    }
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
      await getRoom();
      await getRoomGroup();
    }

    if (token === null) {
      Alert.alert(t("pleaselogin"));
      navigation.navigate("HomeScreen");
    }
  };

  const [messages, setMessages] = useState("");
  const [modalError, setModalError] = useState(false);

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
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    await AsyncStorage.removeItem("history_" + room_id);
    getRoom(token);
  };

  const _searchHandle = (text) => {
    // if (active == "personal") {
    console.log(text);
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
      // console.log("res");
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
          { opacity: focused ? 1 : 0.7 },
        ]}
      >
        {route.title}
      </Text>
    );
  };

  const [index, setIndex] = React.useState(
    route.params?.page ? route.params.page : 0
  );
  const [routes] = React.useState([
    { key: "personal", title: "Chat" },
    { key: "group", title: "Group" },
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
        />
      );
    } else if (route.key == "group") {
      return (
        <ChatGroupList dataGroupRes={dataGroupRes} navigation={navigation} />
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* <StaBar backgroundColor="#14646e" barStyle="light-content" /> */}
      <Errors
        modals={modalError}
        setModals={(e) => setModalError(e)}
        message={messages}
      />
      {searchAktif ? (
        <View style={{ backgroundColor: "#FFFFFF" }}>
          <View
            style={{
              margin: 15,
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
              onChangeText={(e) => _searchHandle(e)}
              value={searchtext}
              placeholder="Search"
              placeholderTextColor="#464646"
              style={{
                color: "#464646",
                fontFamily: "Lato-Regular",
                height: 40,
                width: "100%",
              }}
            />
          </View>
        </View>
      ) : null}
      {loading ? (
        <View style={{ height: 50, justifyContent: "center" }}>
          <ActivityIndicator size="small" color="#209fae" />
        </View>
      ) : (
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
      )}
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
