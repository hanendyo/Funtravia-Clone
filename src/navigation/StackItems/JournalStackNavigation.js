import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Index from "../../screens/Journal/index";
import DetailJournal from "../../screens/Journal/DetailJournal";
import JournalCategory from "../../screens/Journal/JournalCategory";
const JournalStack = createStackNavigator();
export default function JournalStackNavigation() {
	return (
		<JournalStack.Navigator>
			<JournalStack.Screen name="Journal" component={Index} />
			<JournalStack.Screen
				name="DetailJournal"
				component={DetailJournal}
				options={{
					headerTitle: "",
					headerTransparent: true,
					headerTintColor: "white",
					headerBackTitleVisible: false,
				}}
			/>
			<JournalStack.Screen
				name="JournalCategory"
				component={JournalCategory}
				options={{
					headerTitle: "",
					headerTransparent: true,
					headerTintColor: "white",
					headerBackTitleVisible: false,
				}}
			/>
		</JournalStack.Navigator>
	);
}