import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AllDestination from "../../screens/CityDestination/PopularDestination";
import CityDetail from "../../screens/CityDestination/City/index";
import Country from "../../screens/CityDestination/Country/index";
import Abouts from "../../screens/CityDestination/about";
import PracticalInformation from "../../screens/CityDestination/PracticalInformation";
import ArticelCategory from "../../screens/CityDestination/ArtikelCategory/Index";
import ArticelDetail from "../../screens/CityDestination/ArtikelCategory/ArtikelDetail";
import Aboutcountry from "../../screens/CityDestination/Country/AboutCountry";
import Practicalcountry from "../../screens/CityDestination/Country/PracticalCountry";

const CountryStack = createStackNavigator();
export default function CountryStackNavigation() {
  return (
    <CountryStack.Navigator>
      <CountryStack.Screen
        name="AllDestination"
        component={AllDestination}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <CountryStack.Screen
        name="CityDetail"
        component={CityDetail}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <CountryStack.Screen
        name="Country"
        component={Country}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <CountryStack.Screen
        name="PracticalInformation"
        component={PracticalInformation}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <CountryStack.Screen
        name="Abouts"
        component={Abouts}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <CountryStack.Screen
        name="ArticelCategory"
        component={ArticelCategory}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
      <CountryStack.Screen
        name="ArticelDetail"
        component={ArticelDetail}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />

      <CountryStack.Screen
        name="AboutCountry"
        component={Aboutcountry}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />

      <CountryStack.Screen
        name="PracticalCountry"
        component={Practicalcountry}
        options={{
          headerShown: false,
          headerTintColor: "white",
          headerBackTitleVisible: false,
        }}
      />
    </CountryStack.Navigator>
  );
}
