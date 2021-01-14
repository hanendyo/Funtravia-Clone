import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../../../screens/Home";
import MyProfile from "../../../screens/Profile/MyProfile";
import FollowerPage from "../../../screens/Profile/Follower";
import FollowingPage from "../../../screens/Profile/Following";
import otherprofile from "../../../screens/Profile/OtherProfile";
import otherFollower from "../../../screens/Profile/otherFollower";
import otherFollowing from "../../../screens/Profile/otherFollowing";
import profilesetting from "../../../screens/Profile/ProfileSettings";
import myfeed from "../../../screens/Profile/Feed";
import Comments from "../../../screens/Profile/Comments";
import tripalbum from "../../../screens/Profile/tripalbum";
import tripalbumdetail from "../../../screens/Profile/tripalbumdetail";

const HomeStack = createStackNavigator();
export default function HomeNavigation() {
  return (
    <HomeStack.Navigator initialRouteName="HomeScreen" headerMode="screen">
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerShown: false,
        }}
      />
      <HomeStack.Screen
        name="profilesetting"
        component={profilesetting}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="ProfileTab"
        component={MyProfile}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="FollowerPage"
        component={FollowerPage}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="FollowingPage"
        component={FollowingPage}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="otherprofile"
        component={otherprofile}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="otherFollower"
        component={otherFollower}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="otherFollowing"
        component={otherFollowing}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="myfeed"
        component={myfeed}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="Comments"
        component={Comments}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="tripalbum"
        component={tripalbum}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <HomeStack.Screen
        name="tripalbumdetail"
        component={tripalbumdetail}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </HomeStack.Navigator>
  );
}
