import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import NewChat from "../../screens/Chat/NewChat";
import NewGroup from "../../screens/Chat/Group/NewGroup";
import CraeteGrup from "../../screens/Chat/Group/CreateGroup_next";
import GroupDetail from "../../screens/Chat/Group/GroupDetail";
import AddMember from "../../screens/Chat/Group/AddMember";
import AddBuddy from "../../screens/Chat/Group/AddBuddy";
import GroupChat from "../../screens/Chat/GroupRoom";
import RoomChat from "../../screens/Chat/PersonalRoom";
import KeyboardInput from "../../screens/Chat/CustomKeyboard/demoScreen";
import ChatsearchPage from "../../screens/Chat/ChatsearchPage";
import SendToChat from "../../screens/Chat/SendToChat";

const ChatStack = createStackNavigator();
const Recent = () => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M8 1C11.866 1 15 4.13401 15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1Z"
        stroke="#DADADA"
      />
      <Path d="M4 7.65631H8.66667V8.65631H4V7.65631Z" fill="#DADADA" />
      <Path d="M7.66602 2H8.66602V8.31267H7.66602V2Z" fill="#DADADA" />
    </Svg>
  );
};

const Star = () => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M9.16499 1.22588C8.68755 0.261734 7.31245 0.261733 6.83501 1.22588L5.38212 4.15989C5.33843 4.24812 5.25423 4.3093 5.15681 4.32359L1.91743 4.79871C0.852938 4.95484 0.428005 6.26265 1.19743 7.01465L3.53887 9.30309C3.60928 9.37191 3.64145 9.4709 3.62493 9.56796L3.07578 12.7956C2.89532 13.8563 4.0078 14.6645 4.96077 14.1651L7.86075 12.6455C7.94796 12.5998 8.05204 12.5998 8.13925 12.6455L11.0392 14.1651C11.9922 14.6645 13.1047 13.8563 12.9242 12.7956L12.3751 9.56796C12.3586 9.4709 12.3907 9.37191 12.4611 9.30309L14.8026 7.01465C15.572 6.26265 15.1471 4.95484 14.0826 4.79871L10.8432 4.32359C10.7458 4.3093 10.6616 4.24812 10.6179 4.15989L9.16499 1.22588Z"
        stroke="#D1D1D1"
      />
    </Svg>
  );
};
export default function ChatStackNavigation() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="NewChat"
        component={NewChat}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="RoomChat"
        component={RoomChat}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="GroupRoom"
        component={GroupChat}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="NewGroup"
        component={NewGroup}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="CraeteGrup"
        component={CraeteGrup}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="GroupDetail"
        component={GroupDetail}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
          headerTransparent: true,
        }}
      />
      <ChatStack.Screen
        name="AddMember"
        component={AddMember}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="AddBuddy"
        component={AddBuddy}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="KeyboardInput"
        component={KeyboardInput}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ChatStack.Screen
        name="ChatsearchPage"
        component={ChatsearchPage}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
          gestureDirection: "horizontal",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      />
      <ChatStack.Screen
        name="SendToChat"
        component={SendToChat}
        options={{
          headerTitle: "",
          // headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
    </ChatStack.Navigator>
  );
}
