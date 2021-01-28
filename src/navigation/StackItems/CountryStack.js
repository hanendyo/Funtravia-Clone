import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AllDestination from "../../screens/CityDestination/PopularDestination";
import CityDetail from "../../screens/CityDestination/City/index";
import Country from "../../screens/CityDestination/Country/index";
import Abouts from "../../screens/CityDestination/about";
import PracticalInformation from "../../screens/CityDestination/PracticalInformation";

const CountryStack = createStackNavigator();
export default function CountryStackNavigation() {
  return (
    <CountryStack.Navigator>
      <CountryStack.Screen
        name="AllDestination"
        component={AllDestination}
        options={{ headerShown: false }}
      />
      <CountryStack.Screen
        name="CityDetail"
        component={CityDetail}
        options={{ headerShown: false }}
      />
      <CountryStack.Screen
        name="Country"
        component={Country}
        options={{ headerShown: false }}
      />
      <CountryStack.Screen
        name="PracticalInformation"
        component={PracticalInformation}
        options={{ headerShown: false }}
      />
      <CountryStack.Screen
        name="Abouts"
        component={Abouts}
        options={{ headerShown: false }}
      />
    </CountryStack.Navigator>
  );
}
