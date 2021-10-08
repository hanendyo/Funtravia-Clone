import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Index from "../../screens/Journal/index";
import DetailJournal from "../../screens/Journal/DetailJournal";
import JournalCategory from "../../screens/Journal/JournalCategory";
import JournalComment from "../../screens/Journal/JournalComment";
import SendJournal from "../../screens/Journal/SendJournal";
const JournalStack = createStackNavigator();
export default function JournalStackNavigation() {
  return (
    <JournalStack.Navigator>
      <JournalStack.Screen name="Journal" component={Index} />
      <JournalStack.Screen
        name="DetailJournal"
        component={DetailJournal}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
          headerShown: false,
        }}
      />
      <JournalStack.Screen
        name="JournalCategory"
        component={JournalCategory}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <JournalStack.Screen
        name="JournalComment"
        component={JournalComment}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: true,
        }}
      />
      <JournalStack.Screen
        name="SendJournal"
        component={SendJournal}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: true,
        }}
      />
    </JournalStack.Navigator>
  );
}
