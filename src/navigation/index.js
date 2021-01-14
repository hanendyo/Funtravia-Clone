import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./StackItems/AuthStackNavigation";
import BottomStack from "./StackItems/BottomNavigation";

const Tab = createStackNavigator();
export default function MainStackNavigator() {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName={"BottomStackNavigation"}
				headerMode="none"
			>
				<Tab.Screen name="AuthStackNavigation" component={AuthStack} />
				<Tab.Screen name="BottomStackNavigation" component={BottomStack} />
			</Tab.Navigator>
		</NavigationContainer>
	);
}
