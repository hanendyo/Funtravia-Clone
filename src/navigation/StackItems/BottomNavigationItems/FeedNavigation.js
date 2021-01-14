import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FeedScreen from "../../../screens/Feed";
import Postscreen from "../../../screens/Feed/Post";
import CreatePostScreen from "../../../screens/Feed/Post/CreatePost";

const FeedStack = createStackNavigator();
export default function FeedNavigation() {
	return (
		<FeedStack.Navigator initialRouteName="FeedScreen">
			<FeedStack.Screen name="FeedScreen" component={FeedScreen} />
			<FeedStack.Screen name="Post" component={Postscreen} />
			<FeedStack.Screen name="CreatePostScreen" component={CreatePostScreen} />
		</FeedStack.Navigator>
	);
}
