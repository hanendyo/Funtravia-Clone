import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../screens/Home";

const ItineraryStack = createStackNavigator();
export default function ItineraryNavigation() {
	return (
		<ItineraryStack.Navigator initialRouteName="HomeScreen" headerMode="none">
			<ItineraryStack.Screen name="HomeScreen" component={HomeScreen} />
		</ItineraryStack.Navigator>
	);
}
