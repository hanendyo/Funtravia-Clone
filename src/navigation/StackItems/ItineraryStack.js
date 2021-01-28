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

const ItineraryStack = createStackNavigator();
export default function ItineraryStackNavigation() {
  return (
    <ItineraryStack.Navigator>
      <ItineraryStack.Screen name="Trip" component={Trip} />
      <ItineraryStack.Screen
        name="itindetail"
        component={itindetail}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="ItinGoogle"
        component={ItinGoogle}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="SettingItin"
        component={SettingItin}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="ItineraryBuddy"
        component={ItineraryBuddy}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="AddBuddy"
        component={AddBuddy}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="CustomItinerary"
        component={CustomItinerary}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="CreateCustom"
        component={CreateCustom}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="ChoosePosition"
        component={ChoosePosition}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="itindest"
        component={itindest}
        options={{ headerShown: false }}
      />
      <ItineraryStack.Screen
        name="ItineraryChooseday"
        component={ItineraryChooseday}
        options={{ headerShown: false }}
      />

      <ItineraryStack.Screen
        name="ItineraryPopuler"
        component={ItineraryPopuler}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryFavorite"
        component={ItineraryFavorite}
        options={{
          headerTitle: "",
          headerTransparent: true,
        }}
      />
      <ItineraryStack.Screen
        name="ItineraryPlaning"
        component={ItineraryPlaning}
        options={{ headerShown: false }}
      />
    </ItineraryStack.Navigator>
  );
}
