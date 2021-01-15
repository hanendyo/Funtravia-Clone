import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./StackItems/AuthStackNavigation";
import BottomStack from "./StackItems/BottomNavigation";
import Postscreen from "../screens/Feed/Post";
import CreatePostScreen from "../screens/Feed/Post/CreatePost";
import NewChat from "../screens/Chat/NewChat";
import GroupChat from "../screens/Chat/GroupRoom";
import RoomChat from "../screens/Chat/PersonalRoom";
import MyProfile from "../screens/Profile/MyProfile";
import FollowerPage from "../screens/Profile/Follower";
import FollowingPage from "../screens/Profile/Following";
import otherprofile from "../screens/Profile/OtherProfile";
import otherFollower from "../screens/Profile/otherFollower";
import otherFollowing from "../screens/Profile/otherFollowing";
import profilesetting from "../screens/Profile/ProfileSettings";
import myfeed from "../screens/Profile/Feed";
import Comments from "../screens/Profile/Comments";
import tripalbum from "../screens/Profile/tripalbum";
import tripalbumdetail from "../screens/Profile/tripalbumdetail";

const Tab = createStackNavigator();
export default function MainStackNavigator({ authorizeToken }) {
	return (
		<NavigationContainer>
			<Tab.Navigator
				initialRouteName={authorizeToken ? "BottomStack" : "AuthStack"}
			>
				<Tab.Screen
					name="AuthStack"
					component={AuthStack}
					options={{ headerShown: false }}
				/>
				<Tab.Screen
					name="BottomStack"
					component={BottomStack}
					options={{ headerShown: false }}
				/>
				<Tab.Screen name="Post" component={Postscreen} />
				<Tab.Screen name="CreatePostScreen" component={CreatePostScreen} />
				<Tab.Screen
					name="NewChat"
					component={NewChat}
					options={{ headerShown: false }}
				/>
				<Tab.Screen
					name="GroupChat"
					component={GroupChat}
					options={{ headerShown: false }}
				/>
				<Tab.Screen
					name="RoomChat"
					component={RoomChat}
					options={{ headerShown: false }}
				/>
				<Tab.Screen
					name="profilesetting"
					component={profilesetting}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="ProfileTab"
					component={MyProfile}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="FollowerPage"
					component={FollowerPage}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="FollowingPage"
					component={FollowingPage}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="otherprofile"
					component={otherprofile}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="otherFollower"
					component={otherFollower}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="otherFollowing"
					component={otherFollowing}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="myfeed"
					component={myfeed}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="Comments"
					component={Comments}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="tripalbum"
					component={tripalbum}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
				<Tab.Screen
					name="tripalbumdetail"
					component={tripalbumdetail}
					options={{
						headerTitle: "",
						headerTransparent: true,
					}}
				/>
			</Tab.Navigator>
		</NavigationContainer>
	);
}
