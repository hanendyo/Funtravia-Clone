import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewChat from "../../screens/Chat/NewChat";
import GroupChat from "../../screens/Chat/GroupRoom";
import RoomChat from "../../screens/Chat/PersonalRoom";

const ChatStack = createStackNavigator();
export default function ChatStackNavigation() {
	return (
		<ChatStack.Navigator>
			<ChatStack.Screen
				name="NewChat"
				component={NewChat}
				options={{
					headerShown: false,
					headerTintColor: "white",
					headerBackTitleVisible: false,
				}}
			/>
			<ChatStack.Screen
				name="RoomChat"
				component={RoomChat}
				options={{
					headerShown: false,
					headerTintColor: "white",
					headerBackTitleVisible: false,
				}}
			/>
			<ChatStack.Screen
				name="GroupRoom"
				component={GroupChat}
				options={{
					headerShown: false,
					headerTintColor: "white",
					headerBackTitleVisible: false,
				}}
			/>
		</ChatStack.Navigator>
	);
}
