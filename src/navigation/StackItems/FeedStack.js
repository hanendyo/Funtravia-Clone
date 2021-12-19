import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Postscreen from "../../screens/Feed/Post";
import CreatePostScreen from "../../screens/Feed/Post/CreatePost";
import CommentPost from "../../screens/Feed/Post/CommentsV2";
import EditPost from "../../screens/Feed/Post/EditPost";
import SearchPageFeed from "../../screens/Feed/SearchPageFeed";
import SearchFeedByTag from "../../screens/Feed/SearchFeedByTag";
import SearchFeedByLocation from "../../screens/Feed/SearchFeedByLocation";
import CreateListAlbum from "../../screens/Feed/Post/CreateAlbum";
import ChooseAlbumItinerary from "../../screens/Feed/Post/ChooseAlbumItinerary";
import ListFotoAlbums from "../../screens/Feed/ListFotoAlbums";
import Crop from "../../screens/Feed/Post/Crop";

const FeedStack = createStackNavigator();
export default function FeedStackNavigation() {
  return (
    <FeedStack.Navigator
      screenOptions={
        {
          // gestureEnabled: true,
          // gestureDirection: "horizontal",
          // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          // ...TransitionPresets.FadeFromBottomAndroid,
          // ...TransitionPresets.SlideFromRightIOS,
        }
      }
    >
      {/* <FeedStack.Screen name="FeedList" component={FeedList} /> */}
      <FeedStack.Screen
        name="Post"
        component={Postscreen}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,

          // headerTintColor: "white",
          // headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="CommentPost"
        component={CommentPost}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="EditPost"
        component={EditPost}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="CreatePostScreen"
        component={CreatePostScreen}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="SearchPageFeed"
        component={SearchPageFeed}
        options={{
          headerTitle: "",
          headerTransparent: true,

          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
        backBehavior={"Post"}
      />
      <FeedStack.Screen
        name="SearchFeedByTag"
        component={SearchFeedByTag}
        options={{
          headerTitle: "",
          headerTransparent: true,

          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="SearchFeedByLocation"
        component={SearchFeedByLocation}
        options={{
          headerTitle: "",
          headerTransparent: true,

          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="CreateListAlbum"
        component={CreateListAlbum}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="ChooseAlbumItinerary"
        component={ChooseAlbumItinerary}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="ListFotoAlbums"
        component={ListFotoAlbums}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="Crop"
        component={Crop}
        options={{
          headerTitle: "",
          // headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
    </FeedStack.Navigator>
  );
}
