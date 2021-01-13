import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./StackItems/AuthStackNavigation";
import BottomStack from "./StackItems/BottomNavigation";

const Tab = createStackNavigator();
export default function MainStackNavigator({ authorizeToken }) {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName={
					authorizeToken ? "AuthStackNavigation" : "BottomStackNavigation"
				}
				headerMode="none"
			>
				<Tab.Screen name="AuthStackNavigation" component={AuthStack} />
				<Tab.Screen name="BottomStackNavigation" component={BottomStack} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
