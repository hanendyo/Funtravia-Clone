import React from "react";
import { View, StyleSheet, Button } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

export default function DrawerContent(props) {
  const HomeScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button
          onPress={() => navigation.navigate("Notifications")}
          title="Go to notifications"
        />
      </View>
    );
  };

  const NotificationsScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
  };

  const Drawable = () => {
    return (
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    );
  };

  const Drawer = createDrawerNavigator();

  return (
    // <NavigationContainer>
    <Drawable />
    // </NavigationContainer>
  );
}
