import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./StackItems/AuthStackNavigation";
import BottomStack from "./StackItems/BottomNavigation";
import HomeScreen from "../screens/Home";
import ItineraryStack from "./StackItems/ItineraryStack";
import ProfileStack from "./StackItems/ProfileStack";
import CountryStack from "./StackItems/CountryStack";
import AccountStack from "./StackItems/AccountStack";
import ChatStack from "./StackItems/ChatStack";
import FeedStack from "./StackItems/FeedStack";
import TravelIdeaStack from "./StackItems/TravelIdeaStack";
import JournalStackNavigation from "./StackItems/JournalStackNavigation";
import DestinationList from "../screens/Destination/DestinationList";
import Europe from "../screens/Maps/src/continent/Europe";
import Asia from "../screens/Maps/src/continent/Asia";
import Australia from "../screens/Maps/src/continent/Australia";
import NorthAmerica from "../screens/Maps/src/continent/NorthAmerica";
import SouthAmerica from "../screens/Maps/src/continent/SouthAmerica";
import Africa from "../screens/Maps/src/continent/Africa";
import listevent from "../screens/Event/ListEvent";
import listeventhome from "../screens/Event/ListEventHome";
import eventdetail from "../screens/Event/EventDetail";
import { SearchPage, SearchTab } from "../screens/Search";
import SearchPg from "../screens/Search/SearchPg";
import detailStack from "../screens/Destination/DetailDestination/Index";
import Notification from "../screens/Notification";
import TravelGoal from "../screens/TravelGoal/Index";
import TravelGoalDetail from "../screens/TravelGoal/TravelGoalDetail";
import TravelGoalList from "../screens/TravelGoal/TravelGoalList";
import DestinationMaps from "../screens/Maps";
// import DestinationStackNavigation from "./StackItems/DestinationStackNavigation";
import DestinationUnescoDetail from "../screens/Destination/DetailDestinationNew/index";
import DestinationUnescoReview from "../screens/Destination/DetailDestinationNew/DestinationUnescoReview";
import SendDestination from "../screens/Destination/DetailDestinationNew/SendDestination";

const Tab = createStackNavigator();
export default function MainStackNavigator({
  authorizeStatus,
  dNotify,
  isFirst,
  token,
}) {
  const config = {
    screens: {
      BottomStack: {
        screens: {
          HomeBottomScreen: {
            screens: {
              HomeScreen: "/:shareid",
            },
          },
        },
      },
    },
  };
  const linking = {
    prefixes: ["funtravia://", "https://link.funtravia.com"],
    config,
  };
  return (
    <NavigationContainer linking={linking}>
      <Tab.Navigator
        initialRouteName={
          !authorizeStatus
            ? "AuthStack"
            : dNotify
            ? "Notification"
            : "BottomStack"
        }
      >
        <Tab.Screen
          name="AuthStack"
          component={AuthStack}
          initialParams={{ isFirst: isFirst }}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        />
        <Tab.Screen
          name="BottomStack"
          component={BottomStack}
          initialParams={{ token: token }}
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

        {/* <Tab.Screen
          name="DestinationStackNavigation"
          component={DestinationStackNavigation}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "white",
          }}
        /> */}

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
          name="listEventHome"
          component={listeventhome}
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
          name="TravelGoalList"
          component={TravelGoalList}
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
            headerShown: false,
            headerTintColor: "white",
            headerBackTitleVisible: false,
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
        <Tab.Screen
          name="DestinationMaps"
          component={DestinationMaps}
          options={{
            headerShown: true,
            headerTitle: "Destination",
            headerTitleStyle: {
              fontFamily: "Lato-Bold",
              fontSize: 18,
              color: "white",
            },
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
            headerStyle: { backgroundColor: "#209FAE" },
          }}
        />
        <Tab.Screen
          name="DestinationUnescoDetail"
          component={DestinationUnescoDetail}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
          }}
        />
        <Tab.Screen
          name="DestinationUnescoReview"
          component={DestinationUnescoReview}
          options={{
            headerShown: false,
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
          }}
        />
        <Tab.Screen
          name="SendDestination"
          component={SendDestination}
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#209FAE" },
            headerBackTitleVisible: false,
            headerTintColor: "#FFF",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
