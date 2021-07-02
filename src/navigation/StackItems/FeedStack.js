import React from "react";
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack";
import Postscreen from "../../screens/Feed/Post";
import CreatePostScreen from "../../screens/Feed/Post/CreatePost";
// import CommentPost from "../../screens/Feed/Post/Comments";
import CommentPost from "../../screens/Feed/Post/CommentsV2";
import EditPost from "../../screens/Feed/Post/EditPost";
import SinglePost from "../../screens/Feed/Post/SinglePost";
import CommentsById from "../../screens/Feed/Post/CommentsById";
import SearchPageFeed from "../../screens/Feed/SearchPageFeed";
// import SearchPageFeed from "../../screens/Feed/SearchPageFeedcopy";
import SearchFeedByTag from "../../screens/Feed/SearchFeedByTag";
import SearchFeedByLocation from "../../screens/Feed/SearchFeedByLocation";
import CreateListAlbum from "../../screens/Feed/Post/CreateAlbum";
import ChooseAlbumItinerary from "../../screens/Feed/Post/ChooseAlbumItinerary";
import ListFotoAlbums from "../../screens/Feed/ListFotoAlbums";

const FeedStack = createStackNavigator();
export default function FeedStackNavigation() {
  return (
    <FeedStack.Navigator
      screenOptions={{
        gestureEnabled: true,
        gestureDirection: "horizontal",
        ...TransitionPresets.FadeFromBottomAndroid,
      }}
    >
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
        name="SinglePost"
        component={SinglePost}
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
        name="CommentsById"
        component={CommentsById}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
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
    </FeedStack.Navigator>
  );
}
