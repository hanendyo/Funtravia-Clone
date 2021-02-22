import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TravelIdeas from "../../screens/TravelIdeas/Index";
import Unesco from "../../screens/TravelIdeas/Unesco/Index";
import MovieLocation from "../../screens/TravelIdeas/MovieLocation/Index";

const TravelIdeaStack = createStackNavigator();
export default function TravelIdeaStackNavigation() {
  return (
    <TravelIdeaStack.Navigator>
      <TravelIdeaStack.Screen
        name="TravelIdeas"
        component={TravelIdeas}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <TravelIdeaStack.Screen
        name="Unesco"
        component={Unesco}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <TravelIdeaStack.Screen
        name="MovieLocation"
        component={MovieLocation}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
    </TravelIdeaStack.Navigator>
  );
}
