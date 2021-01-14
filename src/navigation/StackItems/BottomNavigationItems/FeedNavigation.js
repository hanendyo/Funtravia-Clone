import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "../../../screens/Feed";
import Postscreen from "../../../screens/Feed/Post";

const FeedStack = createStackNavigator();
export default function FeedNavigation() {
	return (
		<FeedStack.Navigator initialRouteName="FeedScreen" headerMode="screen">
			<FeedStack.Screen name="FeedScreen" component={FeedScreen} />
			<FeedStack.Screen name="Post" component={Postscreen} />
		</FeedStack.Navigator>
	);
}
