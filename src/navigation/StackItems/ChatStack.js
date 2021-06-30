import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NewChat from "../../screens/Chat/NewChat";
import NewGroup from "../../screens/Chat/Group/NewGroup";
import CraeteGrup from "../../screens/Chat/Group/CreateGroup_next";
import GroupDetail from "../../screens/Chat/Group/GroupDetail";
import AddMember from "../../screens/Chat/Group/AddMember";
import GroupChat from "../../screens/Chat/GroupRoom";
import RoomChat from "../../screens/Chat/PersonalRoom";

const ChatStack = createStackNavigator();
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
        </ChatStack.Navigator>
    );
}
