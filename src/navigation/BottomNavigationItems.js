import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/Home";
import ChatScreen from "../screens/Chat";
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
} from "../assets/svg";
import ListNavigationItems from "./ListNavigationItems";

const HomeNavigation = createStackNavigator();
function HomeMain() {
	return (
		<HomeNavigation.Navigator headerMode="none">
			<HomeNavigation.Screen name="HomeScreen" component={HomeScreen} />
			<HomeNavigation.Screen
				name="ListScreen"
				component={ListNavigationItems}
			/>
		</HomeNavigation.Navigator>
	);
}

const FeedNavigation = createStackNavigator();
function FeedMain() {
	return (
		<FeedNavigation.Navigator headerMode="none">
			<FeedNavigation.Screen name="FeedScreen" component={HomeScreen} />
			<FeedNavigation.Screen
				name="ListScreen"
				component={ListNavigationItems}
			/>
		</FeedNavigation.Navigator>
	);
}

const ItineraryNavigation = createStackNavigator();
function ItineraryMain() {
	return (
		<ItineraryNavigation.Navigator headerMode="none">
			<ItineraryNavigation.Screen
				name="ItineraryScreen"
				component={HomeScreen}
			/>
			<ItineraryNavigation.Screen
				name="ListScreen"
				component={ListNavigationItems}
			/>
		</ItineraryNavigation.Navigator>
	);
}

const ChatNavigation = createStackNavigator();
function ChatMain() {
	return (
		<ChatNavigation.Navigator headerMode="screen">
			<ChatNavigation.Screen name="ChatScreen" component={ChatScreen} />
			<ChatNavigation.Screen
				name="ListScreen"
				component={ListNavigationItems}
			/>
		</ChatNavigation.Navigator>
	);
}

const AccountNavigation = createStackNavigator();
function AccountMain() {
	return (
		<AccountNavigation.Navigator headerMode="none">
			<AccountNavigation.Screen name="AccountScreen" component={ChatScreen} />
			<AccountNavigation.Screen
				name="ListScreen"
				component={ListNavigationItems}
			/>
		</AccountNavigation.Navigator>
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
				name="HomeMain"
				component={HomeMain}
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
				name="FeedMain"
				component={FeedMain}
				options={{
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
				name="ItineraryMain"
				component={ItineraryMain}
				options={{
					tabBarLabel: "Trip Planer",
					tabBarIcon: ({ focused }) =>
						focused ? (
							<Itinerary width="55" height="55" />
						) : (
							<ItineraryOn width="55" height="55" />
						),
				}}
			/>
			<MainNavigator.Screen
				name="ChatMain"
				component={ChatMain}
				options={{
					tabBarBadge: 5,
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
				name="AccountMain"
				component={AccountMain}
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
