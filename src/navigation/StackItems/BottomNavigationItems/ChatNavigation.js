import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ChatScreen from "../../../screens/Chat";

const ChatStack = createStackNavigator();
export default function ChatNavigation() {
	return (
		<ChatStack.Navigator initialRouteName="ChatScreen" headerMode="none">
			<ChatStack.Screen name="ChatScreen" component={ChatScreen} />
		</ChatStack.Navigator>
	);
}
