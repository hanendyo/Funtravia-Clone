import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../../screens/Chat";
import FeedScreen from "../../screens/Feed";
import HomeScreen from "../../screens/Home";
import TripPlaning from "../../screens/Itinerary/TripPlaning/Index";
import { MyAccount } from "../../screens/MyAccount";
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

const Home = createStackNavigator();
function HomeStack() {
  return (
    <Home.Navigator initialRouteName={"HomeScreen"}>
      <Home.Screen
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
function TripPlaningscreen() {
  return (
    <Tripstack.Navigator initialRouteName={"TripPlaning"}>
      <Tripstack.Screen
        name="TripPlaning"
        component={TripPlaning}
        options={{
          headerShown: true,
          headerTransparent: true,
        }}
      />
    </Tripstack.Navigator>
  );
}

const Feedstack = createStackNavigator();
function Feedstackscreen() {
  return (
    <Feedstack.Navigator initialRouteName={"FeedScreen"}>
      <Feedstack.Screen
        name="FeedScreen"
        component={FeedScreen}
        options={{
          headerShown: true,
        }}
      />
    </Feedstack.Navigator>
  );
}

const MainNavigator = createBottomTabNavigator();
export default function BottomNavigationItems() {
  return (
    <MainNavigator.Navigator
      initialRouteName="HomeScreen"
      tabBarOptions={{
        activeTintColor: "#209FAE",
        inactiveTintColor: "#4E4E4E",
      }}
    >
      <MainNavigator.Screen
        name="HomeScreen"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <HomeOn width="24" height="24" />
            ) : (
              <HomeOff width="24" height="24" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="FeedScreen"
        component={Feedstackscreen}
        options={{
          // headerShown: false,
          // headerTransparent: true,
          tabBarLabel: "Feed",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <FeedOn width="24" height="24" />
            ) : (
              <FeedOff width="24" height="24" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="TripPlaning"
        component={TripPlaningscreen}
        options={{
          tabBarVisible: false,
          tabBarLabel: "Trip Planer",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <Itinerary width="35" height="35" />
            ) : (
              <ItineraryOn width="55" height="55" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{
          tabBarLabel: "Message",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ChatOn width="24" height="24" />
            ) : (
              <ChatOff width="24" height="24" />
            ),
        }}
      />
      <MainNavigator.Screen
        name="AccountScreen"
        component={MyAccount}
        options={{
          headerShown: true,
          headerTransparent: false,
          tabBarLabel: "Account",
          tabBarIcon: ({ focused }) =>
            focused ? (
              <ProfileOn width="24" height="24" />
            ) : (
              <ProfileOff width="24" height="24" />
            ),
        }}
      />
    </MainNavigator.Navigator>
  );
}
