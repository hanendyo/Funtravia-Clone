import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Trip from "../../screens/Itinerary/TripPlaning/CreateTrip";
import itindetail from "../../screens/Itinerary/ItineraryDetail";
import ItinGoogle from "../../screens/Itinerary/ItinGoogle";
import SettingItin from "../../screens/Itinerary/SettingItin";
import ItineraryBuddy from "../../screens/Itinerary/ItineraryBuddy/Index";
import AddBuddy from "../../screens/Itinerary/ItineraryBuddy/AddBuddy";
import CustomItinerary from "../../screens/Itinerary/CustomItinerary/Index";
import CreateCustom from "../../screens/Itinerary/CustomItinerary/CreateCustom";
import ChoosePosition from "../../screens/Itinerary/CustomItinerary/ChoosePosition";
import itindest from "../../screens/Itinerary/ItineraryDestination/index";
import ItineraryChooseday from "../../screens/Itinerary/ItineraryChooseDay";
import ItineraryPopuler from "../../screens/Itinerary/ItineraryPopular/ItineraryPopuler";
import ItineraryFavorite from "../../screens/Itinerary/ItineraryFavorite/ItineraryFavorite";
import ItineraryPlaning from "../../screens/Itinerary/ItineraryPlaning/index";
import ItineraryCategory from "../../screens/Itinerary/ItineraryCategory/ItineraryCategory";
import ReorderDetail from "../../screens/Itinerary/ReorderDetail";
import PostItineraryAlbum from "../../screens/Itinerary/PostItineraryAlbum";
import CraetePostAlbum from "../../screens/Itinerary/PostItineraryAlbum/CraetePostAlbum";
import detailCustomItinerary from "../../screens/Itinerary/CustomItinerary/detailcustom";
import copyItinerary from "../../screens/Itinerary/CopyItinerary/Index";
import detailItinerary from "../../screens/Itinerary/ItineraryDetail/detailItinerary";
import customFlight from "../../screens/Itinerary/CustomItinerary/flight";
import customStay from "../../screens/Itinerary/CustomItinerary/stay";
import ItinerarySearchCategory from "../../screens/Itinerary/ItineraryPopular/ItinerarySearch";
import editprivacy from "../../screens/Itinerary/ItineraryDetail/editprivacy";
import editCustomActivity from "../../screens/Itinerary/CustomItinerary/editCustomActivity";

const ItineraryStack = createStackNavigator();
export default function ItineraryStackNavigation() {
  return (
    <ItineraryStack.Navigator initialRouteName="itindetail">
      <ItineraryStack.Screen
        name="itindetail"
        component={itindetail}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen name="Trip" component={Trip} />
      <ItineraryStack.Screen
        name="ItinGoogle"
        component={ItinGoogle}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="SettingItin"
        component={SettingItin}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryBuddy"
        component={ItineraryBuddy}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="AddBuddy"
        component={AddBuddy}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="CustomItinerary"
        component={CustomItinerary}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="CreateCustom"
        component={CreateCustom}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ChoosePosition"
        component={ChoosePosition}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="itindest"
        component={itindest}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryChooseday"
        component={ItineraryChooseday}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryPopuler"
        component={ItineraryPopuler}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryFavorite"
        component={ItineraryFavorite}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryPlaning"
        component={ItineraryPlaning}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryCategory"
        component={ItineraryCategory}
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ReorderDetail"
        component={ReorderDetail}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="SelectAlbumsPost"
        component={PostItineraryAlbum}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="CraetePostAlbum"
        component={CraetePostAlbum}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="detailCustomItinerary"
        component={detailCustomItinerary}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="copyItinerary"
        component={copyItinerary}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="detailItinerary"
        component={detailItinerary}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="customFlight"
        component={customFlight}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="customStay"
        component={customStay}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="ItinerarySearchCategory"
        component={ItinerarySearchCategory}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="editprivacy"
        component={editprivacy}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <ItineraryStack.Screen
        name="editcustomactivity"
        component={editCustomActivity}
        options={{
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
    </ItineraryStack.Navigator>
  );
}
