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

const Home = createStackNavigator();
function HomeStack(props) {
  return (
    <Home.Navigator initialRouteName={"HomeScreen"}>
      <Home.Screen
        initialParams={{ token: props.route.params.token, shareid: null }}
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
  console.log("props bottom", props);
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
        initialParams={{ token: props.route.params.token }}
        options={{
          headerShown: true,
        }}
      />
    </Feedstack.Navigator>
  );
}

const Chatstack = createStackNavigator();
function Chatstackscreen(props) {
  return (
    <Feedstack.Navigator initialRouteName={"ChatScreen"}>
      <Feedstack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#209FAE",
            elevation: 0,
            borderBottomWidth: 0,
          },
        }}
      />
    </Feedstack.Navigator>
  );
}

const MyAccountStack = createStackNavigator();
function MyAccountStackScreen() {
  return (
    <Feedstack.Navigator initialRouteName={"AccountScreen"}>
      <Feedstack.Screen
        name="AccountScreen"
        component={MyAccount}
        options={{
          headerShown: false,
          // headerTransparent: false,
          headerTitle: "",
        }}
      />
    </Feedstack.Navigator>
  );
}

const MainNavigator = createBottomTabNavigator();
export default function BottomNavigationItems(props) {
  const { t } = useTranslation();

  return (
    <MainNavigator.Navigator
      initialRouteName="HomeBottomScreen"
      tabBarOptions={{
        activeTintColor: "#209FAE",
        inactiveTintColor: "#4E4E4E",
        headerTransparent: true,
        labelStyle: {
          fontFamily: "Lato-Regular",
          fontSize: 12,
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
        initialParams={{ token: props.route.params.token }}
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
        initialParams={{ token: props.route.params.token }}
        options={{
          // headerShown: false,
          // headerTransparent: true,
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
          tabBarLabel: t("tripPlanner"),
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
          tabBarLabel: t("message"),
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ChatOn width="20" height="22" />
            ) : (
              <ChatOff width="20" height="22" />
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
