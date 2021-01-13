import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/Authorization/Login";
import SplashScreen from "../screens/SplashScreen";
import RegisterScreen from "../screens/Authorization/Register";
import LoginGoogleScreen from "../screens/Authorization/Google/LoginGoogle";
import RegisterGoogleScreen from "../screens/Authorization/Google/RegisterGoogle";
import LoginFacebookScreen from "../screens/Authorization/Facebook/LoginFacebook";
import RegisterFacebookScreen from "../screens/Authorization/Facebook/RegisterFacebook";
import Postscreen from "../screens/Feed/Post";
import MyProfile from "../screens/Profile/MyProfile";
import FollowerPage from "../screens/Profile/Follower";
import FollowingPage from "../screens/Profile/Following";
import otherprofile from "../screens/Profile/OtherProfile";
import otherFollower from "../screens/Profile/otherFollower";
import otherFollowing from "../screens/Profile/otherFollowing";
import profilesetting from "../screens/Profile/ProfileSettings";

const SplashNavigation = createStackNavigator();
export default function ListNavigationItems() {
	return (
		<SplashNavigation.Navigator>
			<SplashNavigation.Screen name="SplashScreen" component={SplashScreen} />
			<SplashNavigation.Screen name="LoginScreen" component={LoginScreen} />
			<SplashNavigation.Screen
				name="LoginGoogleScreen"
				component={LoginGoogleScreen}
			/>
			<SplashNavigation.Screen
				name="RegisterGoogleScreen"
				component={RegisterGoogleScreen}
			/>
			<SplashNavigation.Screen
				name="LoginFacebookScreen"
				component={LoginFacebookScreen}
			/>
			<SplashNavigation.Screen
				name="RegisterFacebookScreen"
				component={RegisterFacebookScreen}
			/>
			<SplashNavigation.Screen
				name="RegisterScreen"
				component={RegisterScreen}
			/>
			<SplashNavigation.Screen
				name="Post"
				component={Postscreen}
			/>
			<SplashNavigation.Screen
				name="ProfileTab"
				component={MyProfile}
			/>
			<SplashNavigation.Screen
				name="FollowerPage"
				component={FollowerPage}
			/>
			<SplashNavigation.Screen
				name="FollowingPage"
				component={FollowingPage}
			/>
			<SplashNavigation.Screen
				name="otherprofile"
				component={otherprofile}
			/>
			<SplashNavigation.Screen
				name="otherFollower"
				component={otherFollower}
			/>
			<SplashNavigation.Screen
				name="otherFollowing"
				component={otherFollowing}
			/>
			<SplashNavigation.Screen
				name="profilesetting"
				component={profilesetting}
			/>
		</SplashNavigation.Navigator>
	);
}
