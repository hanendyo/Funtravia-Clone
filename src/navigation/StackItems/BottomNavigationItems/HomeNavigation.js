import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../screens/Home";
import MyProfile from "../../../screens/Profile/MyProfile";
import FollowerPage from "../../../screens/Profile/Follower";
import FollowingPage from "../../../screens/Profile/Following";
import otherprofile from "../../../screens/Profile/OtherProfile";
import otherFollower from "../../../screens/Profile/otherFollower";
import otherFollowing from "../../../screens/Profile/otherFollowing";
import profilesetting from "../../../screens/Profile/ProfileSettings";

const HomeStack = createStackNavigator();
export default function HomeNavigation() {
	return (
		<HomeStack.Navigator initialRouteName="HomeScreen" headerMode="none">
			<HomeStack.Screen name="HomeScreen" component={HomeScreen} />
			<HomeStack.Screen name="profilesetting" component={profilesetting} />
			<HomeStack.Screen name="ProfileTab" component={MyProfile} />
			<HomeStack.Screen name="FollowerPage" component={FollowerPage} />
			<HomeStack.Screen name="FollowingPage" component={FollowingPage} />
			<HomeStack.Screen name="otherprofile" component={otherprofile} />
			<HomeStack.Screen name="otherFollower" component={otherFollower} />
			<HomeStack.Screen name="otherFollowing" component={otherFollowing} />
		</HomeStack.Navigator>
	);
}
