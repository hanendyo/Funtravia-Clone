import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TravelIdeas from "../../screens/TravelIdeas/Index";
import Unesco from "../../screens/TravelIdeas/Unesco/Index";

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
        }}
      />
      <TravelIdeaStack.Screen
        name="Unesco"
        component={Unesco}
        options={{
          headerTitle: "",
          headerTransparent: false,
        }}
      />
    </TravelIdeaStack.Navigator>
  );
}
