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
import DestinationList from "../screens/Destination/DestinationList";
import ItineraryPlaning from "../screens/Itinerary/ItineraryPlaning/index";
import AllDestination from "../screens/CityDestination/PopularDestination";
import CityDetail from "../screens/CityDestination/City/index";
import Country from "../screens/CityDestination/Country/index";
import listevent from "../screens/Event/ListEvent";
import eventdetail from "../screens/Event/EventDetail";
import Abouts from "../screens/CityDestination/about";
import PracticalInformation from "../screens/CityDestination/PracticalInformation";
import CommentPost from "../screens/Feed/Post/Comments";
import EditPost from "../screens/Feed/Post/EditPost";
import SinglePost from "../screens/Feed/Post/SinglePost";
import { SearchPage, SearchTab } from "../screens/Search";
import Wishlist from "../screens/Wishlist/Index";
import Journal from "../screens/Journal/index";
import DetailJournal from "../screens/Journal/DetailJournal";
import ItineraryPopuler from "../screens/Itinerary/ItineraryPopular/ItineraryPopuler";
import ItineraryFavorite from "../screens/Itinerary/ItineraryFavorite/ItineraryFavorite";
import { MyAccount } from "../screens/MyAccount";
import detailStack from "../screens/Destination/DetailDestination/Index";

import Notification from "../screens/Notification";

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
        <Tab.Screen
          name="DestinationList"
          component={DestinationList}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="ItineraryPlaning"
          component={ItineraryPlaning}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="AllDestination"
          component={AllDestination}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="CityDetail"
          component={CityDetail}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Country"
          component={Country}
          options={{ headerShown: false }}
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
          name="Abouts"
          component={Abouts}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="PracticalInformation"
          component={PracticalInformation}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="SearchPage"
          component={SearchPage}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchTab}
          options={{
            headerTitle: "",
            headerTransparent: true,
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
          name="ItineraryPopuler"
          component={ItineraryPopuler}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="ItineraryFavorite"
          component={ItineraryFavorite}
          options={{
            headerTitle: "",
            headerTransparent: true,
          }}
        />
        <Tab.Screen
          name="GrouRoom"
          component={GroupChat}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="detailStack"
          component={detailStack}
          options={{ headerShown: false }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
