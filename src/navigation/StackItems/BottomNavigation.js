import React, { createContext } from "react";
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

const Home = createStackNavigator();
function HomeStack() {
    return (
        <Home.Navigator initialRouteName={"HomeScreen"}>
            <Home.Screen
                initialParams={{ halaman: "home", shareid: null }}
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
function Feedstackscreen(props) {
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

const Chatstack = createStackNavigator();
function Chatstackscreen(props) {
    return (
        <Feedstack.Navigator initialRouteName={"ChatScreen"}>
            <Feedstack.Screen
                name="ChatScreen"
                component={ChatScreen}
                options={{
                    headerShown: false,
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
export default function BottomNavigationItems() {
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
                options={{
                    tabBarLabel: "Home",
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
                options={{
                    // headerShown: false,
                    // headerTransparent: true,
                    tabBarLabel: "Feed",
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
                options={{
                    tabBarVisible: false,
                    tabBarLabel: "Trip Planner",
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
                    tabBarLabel: "Message",
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
                    tabBarLabel: "Account",
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
