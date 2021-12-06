import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import {
  NotificationSettings,
  FAQ,
  About,
  Privacy,
  SettingsAkun,
  Settings,
  Bantuan,
  SettingEmail,
  SettingPhone,
  SettingPhoneChange,
  SettingEmailChange,
  SettingEmailVerify,
  AddPassword,
  HasPassword,
  AddPasswordEmail,
  SettingCity,
  SettingCountry,
} from "../../screens/Settings";
import SettingCurrency from "../../screens/Settings/SettingCurrency";
import Wishlist from "../../screens/Wishlist/Index";

const AccountStack = createStackNavigator();
export default function AccountStackNavigation() {
  return (
    <AccountStack.Navigator>
      <AccountStack.Screen
        name="settings"
        component={Settings}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingsAkun"
        component={SettingsAkun}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="bantuan"
        component={Bantuan}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="FAQ"
        component={FAQ}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="about"
        component={About}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="privacy"
        component={Privacy}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="notificationsettings"
        component={NotificationSettings}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingEmail"
        component={SettingEmail}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingPhone"
        component={SettingPhone}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingPhoneChange"
        component={SettingPhoneChange}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingEmailChange"
        component={SettingEmailChange}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="Wishlist"
        component={Wishlist}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingEmailVerify"
        component={SettingEmailVerify}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="AddPassword"
        component={AddPassword}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="AddPasswordEmail"
        component={AddPasswordEmail}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="HasPassword"
        component={HasPassword}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingCity"
        component={SettingCity}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <AccountStack.Screen
        name="SettingCountry"
        component={SettingCountry}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />

      <AccountStack.Screen
        name="SettingCurrency"
        component={SettingCurrency}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
    </AccountStack.Navigator>
  );
}
