import React, { createContext, useEffect, useState } from "react";
import {
  createBottomTabNavigator,
  TransitionPresets,
} from "@react-navigation/bottom-tabs";
import {
  createStackNavigator,
  HeaderBackground,
} from "@react-navigation/stack";
import ChatScreen from "../../screens/Chat";
import FeedScreen from "../../screens/Feed";
import HomeScreen from "../../screens/Home";
import TripPlaning from "../../screens/Itinerary/TripPlaning/Index";
import MyAccount from "../../screens/MyAccount/MyAccount";
import {
  FeedOn,
  FeedOff,
  HomeOn,
  HomeOff,
  ProfileOn,
  ProfileOff,
  Itinerary,
  ItineraryOn,
  ChatOn,
  ChatOff,
} from "../../assets/svg";
import { Text } from "../../component";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import normalize from "react-native-normalize";

const Home = createStackNavigator();
function HomeStack(props) {
  return (
    <Home.Navigator initialRouteName={"HomeScreen"}>
      <Home.Screen
        initialParams={{
          token: props.route.params.token,
          shareid: null,
          authBlocked: props.route.params.authBlocked,
        }}
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerShown: false,
          headerTransparent: true,
        }}
      />
    </Home.Navigator>
  );
}

const Tripstack = createStackNavigator();
function TripPlaningscreen(props) {
  return (
    <Tripstack.Navigator initialRouteName={"TripPlaning"}>
      <Tripstack.Screen
        name="TripPlaning"
        component={TripPlaning}
        initialParams={{ token: props.route.params.token }}
        options={{
          headerShown: true,
          headerTransparent: true,
        }}
      />
    </Tripstack.Navigator>
  );
}
const Feedstack = createStackNavigator();
function Feedstackscreen(props) {
  return (
    <Feedstack.Navigator initialRouteName={"FeedScreen"}>
      <Feedstack.Screen
        name="FeedScreen"
        component={FeedScreen}
        initialParams={{
          token: props.route.params.token,
          updateDataPost: props.route.params.updateDataPost
            ? props.route.params.updateDataPost
            : null,
        }}
        options={{
          headerShown: true,
        }}
      />
    </Feedstack.Navigator>
  );
}

const Chatstack = createStackNavigator();
function Chatstackscreen(props) {
  const { t } = useTranslation();
  return (
    <Chatstack.Navigator initialRouteName={"ChatScreen"}>
      <Chatstack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#209FAE",
            elevation: 0,
            borderBottomWidth: 0,
          },
          headerTitle: (
            <Text style={{ color: "#fff" }} size="header" type="bold">
              {t("Message")}
            </Text>
          ),
        }}
      />
    </Chatstack.Navigator>
  );
}

const MyAccountStack = createStackNavigator();
function MyAccountStackScreen() {
  return (
    <MyAccountStack.Navigator initialRouteName={"AccountScreen"}>
      <MyAccountStack.Screen
        name="AccountScreen"
        component={MyAccount}
        options={{
          headerShown: false,
          // headerTransparent: false,
          headerTitle: "",
        }}
      />
    </MyAccountStack.Navigator>
  );
}

const MainNavigator = createBottomTabNavigator();
import { CHATSERVER } from "../../config";
import io from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { setCountMessage, setCountMessageGroup } from "../../redux/action";

export default function BottomNavigationItems(props) {
  const socket = io(CHATSERVER);
  const dispatch = useDispatch();
  const countPesan = useSelector((data) => data.countMessage);
  const countPesanGroup = useSelector((data) => data.countMessageGroup);
  let hasil = countPesan + countPesanGroup;
  const { t, i18n } = useTranslation();
  const getRoom = async () => {
    let response = await fetch(`${CHATSERVER}/api/personal/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${props.route.params.token}`,
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    for (let i of dataResponse) {
      socket.emit("join", i.id);
    }
    let sum = await dataResponse.reduce(
      (a, { count_newmassage }) => a + count_newmassage,
      0
    );
    dispatch(setCountMessage(sum));
  };

  const getRoomGroup = async () => {
    let response = await fetch(`${CHATSERVER}/api/group/list`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${props.route.params.token}`,
        "Content-Type": "application/json",
      },
    });
    let dataResponse = await response.json();
    for (let i of dataResponse) {
      socket.emit("join", i.group_id);
    }
    let dataCount = [];
    for (var i of dataResponse) {
      if (!i.count_newmassage) {
        i.count_newmassage = 0;
        dataCount.push(i);
      } else {
        dataCount.push(i);
      }
    }
    let sum = await dataCount.reduce(
      (a, { count_newmassage }) => a + count_newmassage,
      0
    );
    dispatch(setCountMessageGroup(sum));
  };

  useEffect(() => {
    // const unsubscribe = props.navigation.addListener("focus", () => {
    getRoom();
    getRoomGroup();
    // });
    // return unsubscribe;
  }, []);

  return (
    <MainNavigator.Navigator
      initialRouteName="HomeBottomScreen"
      tabBarOptions={{
        activeTintColor: "#209FAE",
        inactiveTintColor: "#4E4E4E",
        headerTransparent: true,
        labelStyle: {
          fontFamily: "Lato-Regular",
          fontSize: normalize(12),
          marginBottom: 2.5,
        },
        style: {
          padding: 2.5,
        },
      }}
    >
      <MainNavigator.Screen
        name="HomeBottomScreen"
        component={HomeStack}
        initialParams={{
          token: props.route.params.token,
          authBlocked: props.route.params.authBlocked,
          notif: props.route.params.notif,
        }}
        options={{
          tabBarLabel: t("home"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeOn width="20" height="22" />
            ) : (
              <HomeOff width="20" height="22" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="FeedBottomScreen"
        component={Feedstackscreen}
        initialParams={{
          token: props.route.params.token,
          updateDataPost: props.route.params.updateDataPost
            ? props.route.params.updateDataPost
            : null,
        }}
        options={{
          tabBarLabel: t("feed"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FeedOn width="20" height="22" />
            ) : (
              <FeedOff width="20" height="22" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="TripBottomPlaning"
        component={TripPlaningscreen}
        initialParams={{ token: props.route.params.token }}
        options={{
          tabBarVisible: false,
          tabBarLabel: t("trip"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Itinerary width="25" height="25" />
            ) : (
              <View
                style={{
                  marginBottom: 25,
                  shadowColor: "#464646",
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 1,
                  shadowOpacity: 1,
                  elevation: 3,
                  borderRadius: 22.5,
                }}
              >
                <ItineraryOn width="45" height="45" />
              </View>
            ),
        }}
      />
      <MainNavigator.Screen
        name="ChatBottomScreen"
        component={Chatstackscreen}
        options={{
          tabBarLabel: t("Message"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <View>
                {hasil > 99 ? (
                  <View
                    style={{
                      backgroundColor: "#d75995",
                      position: "absolute",
                      zIndex: 1,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      left: 15,
                      top: -5,
                    }}
                  >
                    <Text
                      type="bold"
                      style={{
                        color: "#fff",
                        fontSize: 8,
                        marginBottom: 5,
                        marginTop: 4,
                        marginRight: 8,
                        marginLeft: 7,
                      }}
                    >
                      99+
                    </Text>
                  </View>
                ) : countPesan > 0 || countPesanGroup > 0 ? (
                  <View
                    style={{
                      backgroundColor: "#d75995",
                      position: "absolute",
                      zIndex: 1,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      left: 15,
                      top: -5,
                    }}
                  >
                    <Text
                      type="bold"
                      style={{
                        color: "#fff",
                        fontSize: 8,
                        marginBottom: 5,
                        marginTop: 4,
                        marginRight: 8,
                        marginLeft: 7,
                      }}
                    >
                      {countPesan + countPesanGroup}
                    </Text>
                  </View>
                ) : null}
                <ChatOn width="20" height="22" />
              </View>
            ) : (
              <View>
                {hasil > 99 ? (
                  <View
                    style={{
                      backgroundColor: "#d75995",
                      position: "absolute",
                      zIndex: 1,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      left: 15,
                      top: -5,
                    }}
                  >
                    <Text
                      type="bold"
                      style={{
                        color: "#fff",
                        fontSize: 8,
                        marginBottom: 5,
                        marginTop: 4,
                        marginRight: 8,
                        marginLeft: 7,
                      }}
                    >
                      99+
                    </Text>
                  </View>
                ) : countPesan > 0 || countPesanGroup > 0 ? (
                  <View
                    style={{
                      backgroundColor: "#d75995",
                      position: "absolute",
                      zIndex: 1,
                      borderRadius: 15,
                      justifyContent: "center",
                      alignItems: "center",
                      left: 15,
                      top: -5,
                    }}
                  >
                    <Text
                      type="bold"
                      style={{
                        color: "#fff",
                        fontSize: 8,
                        marginBottom: 5,
                        marginTop: 4,
                        marginRight: 8,
                        marginLeft: 7,
                      }}
                    >
                      {countPesan + countPesanGroup}
                    </Text>
                  </View>
                ) : null}
                <ChatOff width="20" height="22" />
              </View>
            ),
        }}
      />
      <MainNavigator.Screen
        name="AccountBottomScreen"
        component={MyAccountStackScreen}
        options={{
          tabBarLabel: t("account"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ProfileOn width="20" height="22" />
            ) : (
              <ProfileOff width="20" height="22" />
            ),
        }}
      />
    </MainNavigator.Navigator>
  );
}
