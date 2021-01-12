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
		</SplashNavigation.Navigator>
	);
}
