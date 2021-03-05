import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./StackItems/AuthStackNavigation";
import BottomStack from "./StackItems/BottomNavigation";
import ItineraryStack from "./StackItems/ItineraryStack";
import ProfileStack from "./StackItems/ProfileStack";
import CountryStack from "./StackItems/CountryStack";
import AccountStack from "./StackItems/AccountStack";
import ChatStack from "./StackItems/ChatStack";
import FeedStack from "./StackItems/FeedStack";
import TravelIdeaStack from "./StackItems/TravelIdeaStack";
import JournalStackNavigation from "./StackItems/JournalStackNavigation";
import DestinationList from "../screens/Maps";
import Europe from "../screens/Maps/src/continent/Europe";
import Asia from "../screens/Maps/src/continent/Asia";
import Australia from "../screens/Maps/src/continent/Australia";
import NorthAmerica from "../screens/Maps/src/continent/NorthAmerica";
import SouthAmerica from "../screens/Maps/src/continent/SouthAmerica";
import Africa from "../screens/Maps/src/continent/Africa";
import listevent from "../screens/Event/ListEvent";
import eventdetail from "../screens/Event/EventDetail";
import { SearchPage, SearchTab } from "../screens/Search";
import SearchPg from "../screens/Search/SearchPg";
import detailStack from "../screens/Destination/DetailDestination/Index";
import Notification from "../screens/Notification";
import TravelGoal from "../screens/TravelGoal/Index";
import TravelGoalDetail from "../screens/TravelGoal/TravelGoalDetail";

const Tab = createStackNavigator();
export default function MainStackNavigator({ authorizeStatus }) {
  const config = {
    screens: {
      BottomStack: {
        screens: {
          ChatScreen: "chat/:id",
        },
      },
      BottomStack: {
        screens: {
          SinglePost: "feed/:post_id",
        },
      },
    },
  };
  const linking = {
    prefixes: ["funtravia://", "https://*.funtravia.com"],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator
        initialRouteName={authorizeStatus ? "BottomStack" : "AuthStack"}
      >
        <Tab.Screen
          name="AuthStack"
          component={AuthStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="BottomStack"
          component={BottomStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="ItineraryStack"
          component={ItineraryStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="ProfileStack"
          component={ProfileStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="CountryStack"
          component={CountryStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="AccountStack"
          component={AccountStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="ChatStack"
          component={ChatStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="FeedStack"
          component={FeedStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="TravelIdeaStack"
          component={TravelIdeaStack}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="JournalStackNavigation"
          component={JournalStackNavigation}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="DestinationList"
          component={DestinationList}
          options={{
            headerShown: true,
            headerTitle: "Destination",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="detailStack"
          component={detailStack}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="SearchPage"
          component={SearchPage}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="SearchTab"
          component={SearchTab}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="SearchPg"
          component={SearchPg}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
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
          name="TravelGoal"
          component={TravelGoal}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="TravelGoalDetail"
          component={TravelGoalDetail}
          options={{
            headerTitle: "",
            headerTransparent: false,
          }}
        />
        <Tab.Screen
          name="Europe"
          component={Europe}
          options={{
            headerShown: true,
            headerTitle: "Europe",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="Asia"
          component={Asia}
          options={{
            headerShown: true,
            headerTitle: "Asia",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="Australia"
          component={Australia}
          options={{
            headerShown: true,
            headerTitle: "Australia",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="NorthAmerica"
          component={NorthAmerica}
          options={{
            headerShown: true,
            headerTitle: "NorthAmerica",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="SouthAmerica"
          component={SouthAmerica}
          options={{
            headerShown: true,
            headerTitle: "SouthAmerica",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="Africa"
          component={Africa}
          options={{
            headerShown: true,
            headerTitle: "Africa",
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
