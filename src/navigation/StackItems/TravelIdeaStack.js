import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TravelIdeas from "../../screens/TravelIdeas/Index";
import Unesco from "../../screens/TravelIdeas/Unesco/Index";
import MovieLocation from "../../screens/TravelIdeas/MovieLocation/Index";
import Detail_movie from "../../screens/TravelIdeas/MovieLocation/Detail_movie";
import SendMovie from "../../screens/TravelIdeas/MovieLocation/SendMovie";

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
      <TravelIdeaStack.Screen
        name="Detail_movie"
        component={Detail_movie}
        options={{
          headerTitle: "",
          headerTransparent: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <TravelIdeaStack.Screen
        name="SendMovie"
        component={SendMovie}
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
