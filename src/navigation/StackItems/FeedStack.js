import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Postscreen from "../../screens/Feed/Post";
import CreatePostScreen from "../../screens/Feed/Post/CreatePost";
import CommentPost from "../../screens/Feed/Post/Comments";
import EditPost from "../../screens/Feed/Post/EditPost";
import SinglePost from "../../screens/Feed/Post/SinglePost";
import CommentsById from "../../screens/Feed/Post/CommentsById";
import SearchPageFeed from "../../screens/Feed/SearchPageFeed";
import SearchFeedByTag from "../../screens/Feed/SearchFeedByTag";
import SearchFeedByLocation from "../../screens/Feed/SearchFeedByLocation";

const FeedStack = createStackNavigator();
export default function FeedStackNavigation() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen
        name="Post"
        component={Postscreen}
        options={{
          headerShown: false,
          headerBackTitleVisible: false,
        }}
      />
      <FeedStack.Screen
        name="CommentPost"
        component={CommentPost}
        options={{ headerShown: false }}
      />
      <FeedStack.Screen
        name="EditPost"
        component={EditPost}
        options={{ headerShown: false }}
      />
      <FeedStack.Screen
        name="SinglePost"
        component={SinglePost}
        options={{ headerShown: false }}
      />
      <FeedStack.Screen name="CreatePostScreen" component={CreatePostScreen} />
      <FeedStack.Screen
        name="CommentsById"
        component={CommentsById}
        options={{
          headerTitle: "",
          headerTransparent: false,
        }}
      />
      <FeedStack.Screen
        name="SearchPageFeed"
        component={SearchPageFeed}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <FeedStack.Screen
        name="SearchFeedByTag"
        component={SearchFeedByTag}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <FeedStack.Screen
        name="SearchFeedByLocation"
        component={SearchFeedByLocation}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
    </FeedStack.Navigator>
  );
}
