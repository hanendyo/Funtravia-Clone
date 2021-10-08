import * as React from "react";
import { useEffect, useState } from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  TransitionPresets,
} from "@react-navigation/stack";
import LoginScreen from "../../screens/Authorization/Login";
import SplashScreen from "../../screens/SplashScreen";
import OnBoardScreen from "../../screens/OnBoardScreen";
import RegisterScreen from "../../screens/Authorization/Register";
import LoginGoogleScreen from "../../screens/Authorization/Google/LoginGoogle";
import RegisterGoogleScreen from "../../screens/Authorization/Google/RegisterGoogle";
import LoginFacebookScreen from "../../screens/Authorization/Facebook/LoginFacebook";
import RegisterFacebookScreen from "../../screens/Authorization/Facebook/RegisterFacebook";
import otp from "../../screens/Authorization/Funtravia/OtpAuth";
import otppass from "../../screens/Authorization/Funtravia/OtpPassword";
import forgotpwd from "../../screens/Authorization/Funtravia/ForgotPassword";
import resetpwd from "../../screens/Authorization/Funtravia/ResetPassword";
import LoginPhone from "../../screens/Authorization/Funtravia/LoginPhone";
import ConfirmNumber from "../../screens/Authorization/Funtravia/ConfirmNumber";
import ConfirmNumberLogin from "../../screens/Authorization/Funtravia/ConfirmNumberLogin";
import OtpPhone from "../../screens/Authorization/Funtravia/OtpPhone";
import OtpLoginPhone from "../../screens/Authorization/Funtravia/OtpLoginPhone";
import RegisterPhone from "../../screens/Authorization/Funtravia/RegisterPhone";
import ConfirmRegNumber from "../../screens/Authorization/Funtravia/ConfirmRegNumber";
import OtpRegPhone from "../../screens/Authorization/Funtravia/OtpRegPhone";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthNav = createStackNavigator();
export default function AuthStackNavigation(props) {
  return (
    <AuthNav.Navigator
      initialRouteName={
        props?.route?.params?.isFirst == "false"
          ? "SplashScreen"
          : "OnBoardScreen"
      }
      screenOptions={{
        // gestureEnabled: true,
        gestureDirection: "horizontal",
        ...TransitionPresets.SlideFromRightIOS,
      }}
      animation="fade"
    >
      <AuthNav.Screen
        name="OnBoardScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={OnBoardScreen}
      />
      <AuthNav.Screen
        name="SplashScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={SplashScreen}
      />
      <AuthNav.Screen
        name="LoginScreen"
        initialParams={null}
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={LoginScreen}
      />
      <AuthNav.Screen
        name="RegisterScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={RegisterScreen}
      />
      <AuthNav.Screen
        name="LoginGoogleScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={LoginGoogleScreen}
      />
      <AuthNav.Screen
        name="RegisterGoogleScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={RegisterGoogleScreen}
      />
      <AuthNav.Screen
        name="LoginFacebookScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={LoginFacebookScreen}
      />
      <AuthNav.Screen
        name="RegisterFacebookScreen"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={RegisterFacebookScreen}
      />

      <AuthNav.Screen
        name="otp"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={otp}
      />
      <AuthNav.Screen
        name="otppass"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={otppass}
      />
      <AuthNav.Screen
        name="forgotpwd"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={forgotpwd}
      />
      <AuthNav.Screen
        name="resetpwd"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={resetpwd}
      />
      <AuthNav.Screen
        name="LoginPhone"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={LoginPhone}
      />
      <AuthNav.Screen
        name="ConfirmNumber"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={ConfirmNumber}
      />
      <AuthNav.Screen
        name="ConfirmNumberLogin"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={ConfirmNumberLogin}
      />
      <AuthNav.Screen
        name="OtpPhone"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={OtpPhone}
      />
      <AuthNav.Screen
        name="OtpLoginPhone"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={OtpLoginPhone}
      />
      <AuthNav.Screen
        name="RegisterPhone"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={RegisterPhone}
      />
      <AuthNav.Screen
        name="ConfirmRegNumber"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={ConfirmRegNumber}
      />
      <AuthNav.Screen
        name="OtpRegPhone"
        options={{
          headerShown: false,
          headerTintColor: "black",
          headerBackTitleVisible: false,
        }}
        component={OtpRegPhone}
      />
    </AuthNav.Navigator>
  );
}
