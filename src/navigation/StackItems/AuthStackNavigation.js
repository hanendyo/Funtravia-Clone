import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../../screens/Authorization/Login";
import SplashScreen from "../../screens/SplashScreen";
import RegisterScreen from "../../screens/Authorization/Register";
import LoginGoogleScreen from "../../screens/Authorization/Google/LoginGoogle";
import RegisterGoogleScreen from "../../screens/Authorization/Google/RegisterGoogle";
import LoginFacebookScreen from "../../screens/Authorization/Facebook/LoginFacebook";
import RegisterFacebookScreen from "../../screens/Authorization/Facebook/RegisterFacebook";

const AuthNav = createStackNavigator();
export default function AuthStackNavigation() {
	return (
		<AuthNav.Navigator initialRouteName="SplashScreen">
			<AuthNav.Screen name="SplashScreen" component={SplashScreen} />
			<AuthNav.Screen name="LoginScreen" component={LoginScreen} />
			<AuthNav.Screen name="RegisterScreen" component={RegisterScreen} />
			<AuthNav.Screen name="LoginGoogleScreen" component={LoginGoogleScreen} />
			<AuthNav.Screen
				name="RegisterGoogleScreen"
				component={RegisterGoogleScreen}
			/>
			<AuthNav.Screen
				name="LoginFacebookScreen"
				component={LoginFacebookScreen}
			/>
			<AuthNav.Screen
				name="RegisterFacebookScreen"
				component={RegisterFacebookScreen}
			/>
		</AuthNav.Navigator>
	);
}
