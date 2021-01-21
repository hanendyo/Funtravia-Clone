import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../../screens/Authorization/Login";
import SplashScreen from "../../screens/SplashScreen";
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

      <AuthNav.Screen
        name="otp"
        options={{
          headerShown: false,
        }}
        component={otp}
      />
      <AuthNav.Screen
        name="otppass"
        options={{
          headerShown: false,
        }}
        component={otppass}
      />
      <AuthNav.Screen
        name="forgotpwd"
        options={{
          headerShown: false,
        }}
        component={forgotpwd}
      />
      <AuthNav.Screen
        name="resetpwd"
        options={{
          headerShown: false,
        }}
        component={resetpwd}
      />
      <AuthNav.Screen
        name="LoginPhone"
        options={{
          headerShown: false,
        }}
        component={LoginPhone}
      />
      <AuthNav.Screen
        name="ConfirmNumber"
        options={{
          headerShown: false,
        }}
        component={ConfirmNumber}
      />
      <AuthNav.Screen
        name="ConfirmNumberLogin"
        options={{
          headerShown: false,
        }}
        component={ConfirmNumberLogin}
      />
      <AuthNav.Screen
        name="OtpPhone"
        options={{
          headerShown: false,
        }}
        component={OtpPhone}
      />
      <AuthNav.Screen
        name="OtpLoginPhone"
        options={{
          headerShown: false,
        }}
        component={OtpLoginPhone}
      />
      <AuthNav.Screen
        name="RegisterPhone"
        options={{
          headerShown: false,
        }}
        component={RegisterPhone}
      />
      <AuthNav.Screen
        name="ConfirmRegNumber"
        options={{
          headerShown: false,
        }}
        component={ConfirmRegNumber}
      />
      <AuthNav.Screen
        name="OtpRegPhone"
        options={{
          headerShown: false,
        }}
        component={OtpRegPhone}
      />
    </AuthNav.Navigator>
  );
}
