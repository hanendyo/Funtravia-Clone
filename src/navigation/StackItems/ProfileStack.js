import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileTab from "../../screens/Profile/backup/MyProfile";
import FollowerPage from "../../screens/Profile/Follower";
import FollowingPage from "../../screens/Profile/Following";
import otherprofile from "../../screens/Profile/ProfileScreen/index";
import otherFollower from "../../screens/Profile/otherFollower";
import otherFollowing from "../../screens/Profile/otherFollowing";
import profilesetting from "../../screens/Profile/ProfileSettings";
import myfeed from "../../screens/Profile/Feed";
import tripalbum from "../../screens/Profile/tripalbum";
import tripalbumdetail from "../../screens/Profile/tripalbumdetail";

const ProfileStack = createStackNavigator();
export default function ProfileStackNavigation(props) {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name="profilesetting"
        component={profilesetting}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="ProfileTab"
        // component={ProfileTab}
        component={otherprofile}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="FollowerPage"
        component={FollowerPage}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="FollowingPage"
        component={FollowingPage}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="otherprofile"
        component={otherprofile}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="otherFollower"
        component={otherFollower}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="otherFollowing"
        component={otherFollowing}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="myfeed"
        component={myfeed}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="tripalbum"
        component={tripalbum}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ProfileStack.Screen
        name="tripalbumdetail"
        component={tripalbumdetail}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
    </ProfileStack.Navigator>
  );
}
