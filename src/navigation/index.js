import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./StackItems/AuthStackNavigation";
import BottomStack from "./StackItems/BottomNavigation";
import Postscreen from "../screens/Feed/Post";
import CreatePostScreen from "../screens/Feed/Post/CreatePost";
import NewChat from "../screens/Chat/NewChat";
import GroupChat from "../screens/Chat/GroupRoom";
import RoomChat from "../screens/Chat/PersonalRoom";
import DestinationList from "../screens/Destination/DestinationList";
import listevent from "../screens/Event/ListEvent";
import eventdetail from "../screens/Event/EventDetail";
import CommentPost from "../screens/Feed/Post/Comments";
import EditPost from "../screens/Feed/Post/EditPost";
import SinglePost from "../screens/Feed/Post/SinglePost";
import { SearchPage, SearchTab } from "../screens/Search";
import Wishlist from "../screens/Wishlist/Index";
import Journal from "../screens/Journal/index";
import DetailJournal from "../screens/Journal/DetailJournal";
import detailStack from "../screens/Destination/DetailDestination/Index";
import Notification from "../screens/Notification";
import CommentsById from "../screens/Feed/Post/CommentsById";
import TravelGoal from "../screens/TravelGoal/Index";
import TravelGoalDetail from "../screens/TravelGoal/TravelGoalDetail";
import TravelIdeas from "../screens/TravelIdeas/Index";
import Unesco from "../screens/TravelIdeas/Unesco/Index";
import ItineraryStack from "./StackItems/ItineraryStack";
import ProfileStack from "./StackItems/ProfileStack";
import CountryStack from "./StackItems/CountryStack";
import AccountStack from "./StackItems/AccountStack";

const Tab = createStackNavigator();
export default function MainStackNavigator({ authorizeToken }) {
  const config = {
    screens: {
      BottomStack: {
        screens: {
          ChatScreen: "chat/:id",
        },
      },
      SinglePost: "feed/:post_id",
    },
  };
  const linking = {
    prefixes: ["http://link.funtravia.com", "https://link.funtravia.com"],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator
        initialRouteName={authorizeToken ? "BottomStack" : "AuthStack"}
      >
        <Tab.Screen
          name="AuthStack"
          component={AuthStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="BottomStack"
          component={BottomStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ItineraryStack"
          component={ItineraryStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="CountryStack"
          component={CountryStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="AccountStack"
          component={AccountStack}
          options={{
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Post"
          component={Postscreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="CommentPost"
          component={CommentPost}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="EditPost"
          component={EditPost}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="SinglePost"
          component={SinglePost}
          options={{ headerShown: false }}
        />
        <Tab.Screen name="CreatePostScreen" component={CreatePostScreen} />

        <Tab.Screen
          name="NewChat"
          component={NewChat}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="RoomChat"
          component={RoomChat}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="DestinationList"
          component={DestinationList}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="GroupRoom"
          component={GroupChat}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="SearchPage"
          component={SearchPage}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchTab}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="Wishlist"
          component={Wishlist}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="Journal"
          component={Journal}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="DetailJournal"
          component={DetailJournal}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="detailStack"
          component={detailStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Inbox"
          component={Notification}
          name="CommentsById"
          component={CommentsById}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="listevent"
          component={listevent}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="eventdetail"
          component={eventdetail}
          options={{ headerShown: false }}
        />

        <Tab.Screen
          name="TravelGoal"
          component={TravelGoal}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="TravelGoalDetail"
          component={TravelGoalDetail}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="TravelIdeas"
          component={TravelIdeas}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="Unesco"
          component={Unesco}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
