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
import MyProfile from "../screens/Profile/MyProfile";
import FollowerPage from "../screens/Profile/Follower";
import FollowingPage from "../screens/Profile/Following";
import otherprofile from "../screens/Profile/OtherProfile";
import otherFollower from "../screens/Profile/otherFollower";
import otherFollowing from "../screens/Profile/otherFollowing";
import profilesetting from "../screens/Profile/ProfileSettings";
import myfeed from "../screens/Profile/Feed";
import Comments from "../screens/Profile/Comments";
import tripalbum from "../screens/Profile/tripalbum";
import tripalbumdetail from "../screens/Profile/tripalbumdetail";
import Trip from "../screens/Itinerary/TripPlaning/CreateTrip";
import itindetail from "../screens/Itinerary/ItineraryDetail";
import ItinGoogle from "../screens/Itinerary/ItinGoogle";
import SettingItin from "../screens/Itinerary/SettingItin";
import ItineraryBuddy from "../screens/Itinerary/ItineraryBuddy/Index";
import AddBuddy from "../screens/Itinerary/ItineraryBuddy/AddBuddy";
import CustomItinerary from "../screens/Itinerary/CustomItinerary/Index";
import CreateCustom from "../screens/Itinerary/CustomItinerary/CreateCustom";
import ChoosePosition from "../screens/Itinerary/CustomItinerary/ChoosePosition";
import itindest from "../screens/Itinerary/ItineraryDestination/index";
import ItineraryChooseday from "../screens/Itinerary/ItineraryChooseDay";

const Tab = createStackNavigator();
export default function MainStackNavigator({ authorizeToken }) {
  return (
    <NavigationContainer>
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
          options={{ headerShown: false }}
        />
        <Tab.Screen name="Post" component={Postscreen} />
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
          name="profilesetting"
          component={profilesetting}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="ProfileTab"
          component={MyProfile}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="FollowerPage"
          component={FollowerPage}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="FollowingPage"
          component={FollowingPage}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="otherprofile"
          component={otherprofile}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="otherFollower"
          component={otherFollower}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="otherFollowing"
          component={otherFollowing}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="myfeed"
          component={myfeed}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="Comments"
          component={Comments}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="tripalbum"
          component={tripalbum}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="tripalbumdetail"
          component={tripalbumdetail}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen name="Trip" component={Trip} />
        <Tab.Screen
          name="itindetail"
          component={itindetail}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ItinGoogle"
          component={ItinGoogle}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="SettingItin"
          component={SettingItin}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ItineraryBuddy"
          component={ItineraryBuddy}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="AddBuddy"
          component={AddBuddy}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="CustomItinerary"
          component={CustomItinerary}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="CreateCustom"
          component={CreateCustom}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ChoosePosition"
          component={ChoosePosition}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="itindest"
          component={itindest}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ItineraryChooseday"
          component={ItineraryChooseday}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
