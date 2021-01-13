import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../screens/Home";

const AccountStack = createStackNavigator();
export default function AccountNavigation() {
	return (
		<AccountStack.Navigator initialRouteName="HomeScreen" headerMode="none">
			<AccountStack.Screen name="HomeScreen" component={HomeScreen} />
		</AccountStack.Navigator>
	);
}
