import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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

const MyAccountStack = createStackNavigator();
function MyAccountStackScreen() {
	return (
		<Feedstack.Navigator initialRouteName={"AccountScreen"}>
			<Feedstack.Screen
				name="AccountScreen"
				component={MyAccount}
				options={{
					headerShown: true,
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
			initialRouteName="HomeScreen"
			tabBarOptions={{
				activeTintColor: "#209FAE",
				inactiveTintColor: "#4E4E4E",
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
					tabBarLabel: "Trip Planner",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Itinerary width="30" height="30" />
						) : (
							<View
								style={{
									marginBottom: 25,
									shadowColor: "#464646",
									shadowOffset: { width: 0, height: 1 },
									shadowRadius: 1,
									shadowOpacity: 1,
									elevation: 1,
								}}
							>
								<ItineraryOn width="50" height="50" />
							</View>
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
				component={MyAccountStackScreen}
				options={{
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
