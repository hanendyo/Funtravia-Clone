import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AccountNavigation from "./BottomNavigationItems/AccountNavigation";
import ChatNavigation from "./BottomNavigationItems/ChatNavigation";
import FeedNavigation from "./BottomNavigationItems/FeedNavigation";
import HomeNavigation from "./BottomNavigationItems/HomeNavigation";
import ItineraryNavigation from "./BottomNavigationItems/ItineraryNavigation";
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
				component={HomeNavigation}
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
				component={FeedNavigation}
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
				component={ItineraryNavigation}
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
				component={ChatNavigation}
				options={{
					tabBarBadge: 0,
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
				component={AccountNavigation}
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
