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
      <AuthNav.Screen
        name="SplashScreen"
        options={{
          headerShown: false,
        }}
        component={SplashScreen}
      />
      <AuthNav.Screen
        name="LoginScreen"
        options={{
          headerShown: false,
        }}
        component={LoginScreen}
      />
      <AuthNav.Screen
        name="RegisterScreen"
        options={{
          headerShown: false,
        }}
        component={RegisterScreen}
      />
      <AuthNav.Screen
        name="LoginGoogleScreen"
        options={{
          headerShown: false,
        }}
        component={LoginGoogleScreen}
      />
      <AuthNav.Screen
        name="RegisterGoogleScreen"
        options={{
          headerShown: false,
        }}
        component={RegisterGoogleScreen}
      />
      <AuthNav.Screen
        name="LoginFacebookScreen"
        options={{
          headerShown: false,
        }}
        component={LoginFacebookScreen}
      />
      <AuthNav.Screen
        name="RegisterFacebookScreen"
        options={{
          headerShown: false,
        }}
        component={RegisterFacebookScreen}
      />
    </AuthNav.Navigator>
  );
}
